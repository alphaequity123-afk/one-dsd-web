import { z } from "zod";
import type { CompleteRequest, CompleteResult, ProviderAdapter } from "./index";
import type { ModelRecord } from "../types";
import { logProviderFailure, providerErrorExcerpt } from "./log";
import { strictSchemaForOpenAI, stripInjectedNulls } from "./openai";

const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";

const EnvelopeSchema = z.object({
  id: z.string().optional(),
  model: z.string().optional(),
  choices: z.array(z.object({
    finish_reason: z.string().nullish(),
    message: z.object({ content: z.string().nullish(), refusal: z.string().nullish() }).passthrough(),
  }).passthrough()).optional(),
  usage: z.object({ prompt_tokens: z.number().optional(), completion_tokens: z.number().optional() }).passthrough().optional(),
  error: z.object({ message: z.string().optional(), code: z.union([z.string(), z.number()]).optional() }).passthrough().optional(),
}).passthrough();

/** Message is a finite code (openrouter_http_400, openrouter_timeout, ...); status and body are for logs only. */
export class OpenRouterRequestError extends Error {
  constructor(code: string, readonly status?: number, readonly body?: string) {
    super(code);
    this.name = "OpenRouterRequestError";
  }
}

export type OpenRouterAdapterOptions = {
  fetcher?: typeof fetch;
  /** Read at call time so a test can stub the environment. */
  credential?: () => string | undefined;
  model?: () => string | undefined;
  timeoutMs?: number;
};

/** The model identifier is deployment configuration: no identifier is assumed in code. */
export function openRouterModel(): string | undefined {
  const value = process.env.PAC_OPENROUTER_MODEL?.trim();
  return value && /^[A-Za-z0-9][A-Za-z0-9._:\/-]{0,199}$/.test(value) ? value : undefined;
}

/**
 * OpenRouter through its OpenAI-compatible chat completions endpoint, with a strict
 * JSON schema. Routing is limited to upstream endpoints that honor the request's
 * parameters, so the structured output is not silently dropped.
 */
export class OpenRouterAdapter implements ProviderAdapter {
  readonly id = "openrouter" as const;
  readonly generative = true;
  constructor(private readonly opts: OpenRouterAdapterOptions = {}) {}

  private credential(): string | undefined {
    return (this.opts.credential ?? (() => process.env.OPENROUTER_API_KEY))()?.trim() || undefined;
  }

  async complete(req: CompleteRequest, record: ModelRecord): Promise<CompleteResult> {
    const model = (this.opts.model ?? openRouterModel)() ?? "";
    const fail = (reason: string, extra: { status?: number; body?: string; detail?: Record<string, unknown> } = {}): never => {
      logProviderFailure({ provider: "openrouter", model: model || record.provider_model_ref, reason, trace_id: req.trace_id, ...extra });
      throw new OpenRouterRequestError(reason, extra.status, extra.body);
    };
    const key = this.credential();
    if (!key) return fail("openrouter_credential_missing");
    if (!model) return fail("openrouter_model_not_configured");

    const fetcher = this.opts.fetcher ?? globalThis.fetch;
    const timeoutMs = this.opts.timeoutMs ?? req.timeoutMs ?? 60_000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const strict = strictSchemaForOpenAI(req.schema);

    let response: Response;
    try {
      response = await fetcher(OPENROUTER_CHAT_URL, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: req.system }, { role: "user", content: req.user }],
          response_format: { type: "json_schema", json_schema: { name: "pac_structured_output", strict: true, schema: strict.schema } },
          provider: { require_parameters: true },
          max_tokens: req.maxTokens ?? 12_000,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timer);
      const timedOut = error instanceof Error && error.name === "AbortError";
      return fail(timedOut ? "openrouter_timeout" : "openrouter_network", { detail: { timeout_ms: timeoutMs, error: providerErrorExcerpt(error, 120) } });
    }
    if (!response.ok) {
      clearTimeout(timer);
      let body = "";
      try { body = providerErrorExcerpt(await response.text()); } catch { body = ""; }
      return fail(`openrouter_http_${response.status}`, { status: response.status, body });
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch (error) {
      return fail(error instanceof Error && error.name === "AbortError" ? "openrouter_timeout" : "openrouter_bad_json", { status: response.status });
    } finally {
      clearTimeout(timer);
    }
    const envelope = EnvelopeSchema.safeParse(json);
    if (!envelope.success) return fail("openrouter_bad_envelope", { status: response.status });
    // OpenRouter can report an upstream failure inside a 200 response.
    if (envelope.data.error) return fail("openrouter_upstream_error", { status: response.status, detail: { code: String(envelope.data.error.code ?? "") } });
    const choice = envelope.data.choices?.[0];
    if (!choice) return fail("openrouter_no_output", { status: response.status });
    if (choice.message.refusal) return fail("provider_refusal", { status: response.status });
    if (choice.finish_reason === "length") return fail("openrouter_incomplete", { status: response.status });
    const text = choice.message.content;
    if (!text) return fail("openrouter_no_output", { status: response.status });

    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { return fail("openrouter_output_not_json", { status: response.status }); }
    parsed = stripInjectedNulls(parsed, strict.schema, strict.schema, strict.injected);
    const checked = req.schema.safeParse(parsed);
    if (!checked.success) {
      // Issue paths and codes only: generated text never reaches the log.
      const issues = checked.error.issues.slice(0, 6).map(issue => `${issue.path.join(".") || "(root)"}: ${issue.code}`);
      return fail("openrouter_invalid_structured_output", { status: response.status, detail: { issues } });
    }
    const usage = envelope.data.usage;
    return {
      parsed: checked.data, model_id: req.model_id, provider_trace_id: envelope.data.id,
      usage: usage ? { input_tokens: usage.prompt_tokens ?? 0, output_tokens: usage.completion_tokens ?? 0 } : undefined,
    };
  }

  async health() {
    return { ok: Boolean(this.credential() && (this.opts.model ?? openRouterModel)()), latency_ms: 0 };
  }
}
