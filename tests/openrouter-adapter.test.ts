import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { OpenRouterAdapter, openRouterModel } from "@/lib/intelligence/providers/openrouter";
import { reasoningConnections, reasoningProviderOrder, resolveBinding } from "@/lib/intelligence/providers";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { getModel } from "@/lib/intelligence/registry/models";

const Schema = z.object({ shortAnswer: z.string(), limits: z.array(z.string()) });
const record = getModel("mdl_openrouter_staff")!;
const request = { model_id: record.model_id, system: "system text", user: "user text", schema: Schema, trace_id: "t" };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const good = (text: string) => ({ id: "gen_1", choices: [{ finish_reason: "stop", message: { content: text } }], usage: { prompt_tokens: 10, completion_tokens: 5 } });
const adapter = (fetcher: unknown, configured: { model?: string; key?: string } = { model: "vendor/model-name", key: "test-key" }) =>
  new OpenRouterAdapter({ fetcher: fetcher as typeof fetch, credential: () => configured.key, model: () => configured.model });

afterEach(() => vi.unstubAllEnvs());

describe("OpenRouter adapter", () => {
  it("posts a strict schema request to the chat completions endpoint and parses the structured reply", async () => {
    const fetcher = vi.fn(async () => reply(good(JSON.stringify({ shortAnswer: "An answer.", limits: ["a limit"] }))));
    const out = await adapter(fetcher).complete(request, record);
    expect(out.parsed).toEqual({ shortAnswer: "An answer.", limits: ["a limit"] });
    expect(out.usage).toEqual({ input_tokens: 10, output_tokens: 5 });
    expect(out.provider_trace_id).toBe("gen_1");
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe("vendor/model-name");
    expect(body.messages).toEqual([{ role: "system", content: "system text" }, { role: "user", content: "user text" }]);
    expect(body.response_format).toMatchObject({ type: "json_schema", json_schema: { name: "pac_structured_output", strict: true } });
    expect(body.provider).toEqual({ require_parameters: true });
  });

  it("fails with a finite code and makes no request when the key or the model is missing", async () => {
    const fetcher = vi.fn();
    await expect(adapter(fetcher, { model: "vendor/model-name" }).complete(request, record)).rejects.toThrow("openrouter_credential_missing");
    await expect(adapter(fetcher, { key: "test-key" }).complete(request, record)).rejects.toThrow("openrouter_model_not_configured");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports provider failures truthfully instead of returning an answer", async () => {
    await expect(adapter(async () => reply({ error: { message: "no" } }, 402)).complete(request, record)).rejects.toThrow("openrouter_http_402");
    await expect(adapter(async () => reply({ error: { message: "upstream", code: 502 } })).complete(request, record)).rejects.toThrow("openrouter_upstream_error");
    await expect(adapter(async () => reply(good("not json"))).complete(request, record)).rejects.toThrow("openrouter_output_not_json");
    await expect(adapter(async () => reply(good(JSON.stringify({ shortAnswer: 1 })))).complete(request, record)).rejects.toThrow("openrouter_invalid_structured_output");
    await expect(adapter(async () => reply({ choices: [{ finish_reason: "length", message: { content: "{" } }] })).complete(request, record)).rejects.toThrow("openrouter_incomplete");
    await expect(adapter(async () => reply({ choices: [{ message: { refusal: "no", content: null } }] })).complete(request, record)).rejects.toThrow("provider_refusal");
    await expect(adapter(async () => { throw new Error("socket"); }).complete(request, record)).rejects.toThrow("openrouter_network");
  });

  it("accepts only a well-formed configured model identifier", () => {
    vi.stubEnv("PAC_OPENROUTER_MODEL", "vendor/model-name:free");
    expect(openRouterModel()).toBe("vendor/model-name:free");
    vi.stubEnv("PAC_OPENROUTER_MODEL", "bad model\nname");
    expect(openRouterModel()).toBeUndefined();
    vi.stubEnv("PAC_OPENROUTER_MODEL", "");
    expect(openRouterModel()).toBeUndefined();
  });
});

describe("reasoning service order", () => {
  const ask = getAgent("ask_concierge");
  const clear = () => { for (const name of ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "OPENROUTER_API_KEY", "PAC_OPENROUTER_MODEL", "PAC_REASONING_PROVIDERS"]) vi.stubEnv(name, ""); };

  it("defaults to OpenAI, then Claude, then OpenRouter, and honors a configured order", () => {
    clear();
    expect(reasoningProviderOrder()).toEqual(["openai", "anthropic", "openrouter"]);
    vi.stubEnv("PAC_REASONING_PROVIDERS", "openrouter, anthropic, nonsense, openrouter");
    expect(reasoningProviderOrder()).toEqual(["openrouter", "anthropic"]);
  });

  it("uses the deterministic composer when the reasoning switch is off, whatever is connected", () => {
    clear();
    vi.stubEnv("PAC_GENERATIVE_PILOT", "off");
    vi.stubEnv("OPENAI_API_KEY", "k");
    expect(resolveBinding(ask)).toMatchObject({ generative: false, reasonCode: "pilot_flag_off" });
  });

  it("uses the first connected service in order, and reports when none is connected", () => {
    clear();
    vi.stubEnv("PAC_GENERATIVE_PILOT", "on");
    expect(resolveBinding(ask)).toMatchObject({ generative: false, reasonCode: "pilot_credential_missing" });
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    expect(resolveBinding(ask).generative).toBe(false);
    vi.stubEnv("PAC_OPENROUTER_MODEL", "vendor/model-name");
    expect(resolveBinding(ask).model.model_id).toBe("mdl_openrouter_staff");
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    expect(resolveBinding(ask).model.provider_id).toBe("anthropic");
    vi.stubEnv("OPENAI_API_KEY", "k");
    expect(resolveBinding(ask).model.provider_id).toBe("openai");
    vi.stubEnv("PAC_REASONING_PROVIDERS", "openrouter,openai");
    expect(resolveBinding(ask).model.provider_id).toBe("openrouter");
    expect(reasoningConnections()).toEqual([{ provider: "openrouter", connected: true }, { provider: "openai", connected: true }]);
  });
});
