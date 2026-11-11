# Model and research connections for ASK

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Owner direction, November 11, 2026.** OpenRouter, the Perplexity API, the OpenAI API, and the Claude API are to be connected to the ASK and research functions of both applications. ASK is open-ended: it uses the program's own resources, outside resources, and open research.

This supersedes the September 9 routing note where it said one vendor only with no other service used. Sonar remains excluded.

Local work only. No key was added, no live call was made, and nothing is deployed.

## What is connected in the code

Both applications share one codebase, so each connection serves both.

| Service | Used for | Setting that turns it on | State before this change |
| --- | --- | --- | --- |
| OpenAI | ASK reasoning; web research | `OPENAI_API_KEY` | Already built |
| Claude (Anthropic) | ASK reasoning | `ANTHROPIC_API_KEY` | Built, but never selected: only OpenAI was tried |
| OpenRouter | ASK reasoning, through any model it offers | `OPENROUTER_API_KEY` and `PAC_OPENROUTER_MODEL` | **New** |
| Perplexity | Open research, pinned to a non-Sonar model | `PERPLEXITY_API_KEY` | Already built |

## How ASK chooses a reasoning service

1. The reasoning switch (`PAC_GENERATIVE_PILOT`) must be on. When it is off, ASK gives its built-in answer.
2. ASK uses the first connected service in the order set by `PAC_REASONING_PROVIDERS`. The default order is OpenAI, Claude, OpenRouter.
3. A service counts as connected when its key is present. OpenRouter also needs a model named in `PAC_OPENROUTER_MODEL`, because no model identifier is assumed in the code.
4. If the chosen service fails on a request, ASK reports the answer as limited. It does not silently retry on another service. That keeps the record of which service answered truthful.

Research is separate and unchanged: its own on/off setting, kill switch, and monthly spending cap still govern Perplexity and OpenAI web research.

## What changed

- `lib/intelligence/providers/openrouter.ts`: the OpenRouter adapter. It sends a strict structured-output request and limits routing to upstream endpoints that honor it.
- `lib/intelligence/providers/index.ts`: ordered selection across the three reasoning services, and `reasoningConnections()` to list which are connected (names only).
- `lib/intelligence/registry/models.ts`: an OpenRouter model record.
- `config/environment-contract.json` and `.env.example`: three new settings.
- `tests/openrouter-adapter.test.ts`: 7 tests.

## Verification

Local, Node 24.14.0.

| Check | Result |
| --- | --- |
| `tests/openrouter-adapter.test.ts` | 7 passed: request shape, missing key or model, six failure cases, model identifier validation, default and configured order, selection by what is connected |
| Provider, ASK, research-governance, and control tests together | 148 passed, 9 skipped; one file could not start a local test database here |
| Environment contract check, ESLint, TypeScript | Passed |

## Limits

- **No live call was made to any of the four services.** This session has no keys. The adapter is tested against simulated responses built from OpenRouter's published request format; its response handling follows the standard chat-completions shape, which OpenRouter's structured-output page does not spell out. The first real call should be watched.
- **Whether the keys and switches are set in the deployed applications was not checked.**
- **OpenRouter and Claude are connected for reasoning, not for research.** Research runs through Perplexity and OpenAI web search.
- **The specialist agents and the Chief of Staff summaries** use the same selection, so they follow the same order.

## To turn it on

In the deployment's settings: set the keys for the services to use, set `PAC_OPENROUTER_MODEL` to the exact OpenRouter model identifier, set `PAC_GENERATIVE_PILOT` to on, and set the research switch for open research. Then follow `DEPLOY.md`, whose live checks confirm what is actually running.
