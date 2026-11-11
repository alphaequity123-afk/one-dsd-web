import { beforeEach, expect, it } from "vitest";
import { askConcierge } from "@/lib/intelligence/agents/ask";
import { getAgent } from "@/lib/intelligence/registry/agents";
import { resetStoreForTests } from "@/lib/intelligence/memory/store";
import { invalidatePolicyCache } from "@/lib/intelligence/policy";
import { testTraceId } from "./helpers/opaque-identifiers";

const context = () => ({ trace_id: testTraceId("ask-guided-steps"), agent: getAgent("ask_concierge"), dry_run: false, role: "staff" as const });
beforeEach(() => { resetStoreForTests(); invalidatePolicyCache(); });

async function actions(question: string, contextPreference: "one_dsd" | "one_dhs") {
  const result = await askConcierge({ question, contextPreference }, context());
  if (result.kind !== "answer") throw new Error(`expected an answer, received ${result.kind}`);
  return result.answer.nextActions;
}

it("ends a work question with something to learn, practice, and reflect on, from the real published index", async () => {
  const next = await actions("How do I handle a conflict on my team after a comment landed badly in a meeting?", "one_dsd");
  const guided = next.filter(action => /^(Learn|Practice|Reflect): /.test(action.label));
  expect(guided.map(action => action.label.split(":")[0])).toEqual(["Learn", "Practice", "Reflect"]);
  expect(guided[0].href).toMatch(/^\/courses\/[a-z0-9-]+\/[a-z0-9-]+$/);
  expect(new Set(next.map(action => action.href)).size).toBe(next.length);
}, 120_000);

it("adds no guided steps to a question that names no such need", async () => {
  const next = await actions("What year did Minnesota become a state?", "one_dsd");
  expect(next.some(action => /^(Learn|Practice|Reflect): /.test(action.label))).toBe(false);
}, 120_000);

it("keeps division practice scenarios out of the agencywide view", async () => {
  const next = await actions("How do I handle a conflict on my team after a comment landed badly in a meeting?", "one_dhs");
  expect(next.some(action => action.href.startsWith("/one-dsd/"))).toBe(false);
}, 120_000);

it("guides a plain supervision question, and leaves a general question containing a signal word alone", async () => {
  const supervising = await actions("How should I give feedback to someone I supervise?", "one_dsd");
  expect(supervising.some(action => action.label.startsWith("Learn: "))).toBe(true);
  const general = await actions("What data structures are good options for a Python queue?", "one_dsd");
  expect(general.some(action => /^(Learn|Practice|Reflect): /.test(action.label))).toBe(false);
}, 120_000);
