import { describe, expect, it } from "vitest";
import { CONSULT_METHOD, CONSULTANT_FUNCTIONS, CONSULTANT_LINES, consultantPracticeContext } from "@/lib/intelligence/practice/consultant-practice";
import { describesWork, guidedSteps, needLabels, practiceNeed } from "@/lib/intelligence/practice/guided-steps";
import { findLessons, findTagged } from "@/lib/content/knowledge";

const directory = (hrefs: string[]) => new Map(hrefs.map(href => [href, { label: `Open ${href}`, href }]));

describe("consultant practice model", () => {
  it("carries the six functions, the consultation order, and the hand-off lines", () => {
    const context = consultantPracticeContext();
    expect(context.functions).toHaveLength(CONSULTANT_FUNCTIONS.length);
    expect(CONSULT_METHOD.map(item => item.step)).toEqual(["situation", "people", "authority", "evidence", "move", "return"]);
    expect(context.lines).toHaveLength(CONSULTANT_LINES.length);
    expect(context.role).toMatch(/Do not speak as the consultant personally/);
  });

  it("keeps the standing rules in the lines every agent reads", () => {
    const lines = consultantPracticeContext().lines.join(" ");
    expect(lines).toMatch(/Office of Indian Affairs/);
    expect(lines).toMatch(/training credit/);
    expect(lines).toMatch(/scores, ranks, or labels a person/);
    expect(lines).toMatch(/Human Resources/);
  });
});

describe("reading a question for the work it describes", () => {
  it("finds the competencies and the scope the question names", () => {
    expect(practiceNeed("There is a conflict on my team after a comment landed badly")).toEqual({ competencies: ["conflict-repair"], scope: "team" });
    expect(practiceNeed("How do I give feedback to someone I supervise?").competencies).toContain("coach-feedback");
    expect(practiceNeed("As a manager I need to cut a budget across teams")).toMatchObject({ scope: "across-teams" });
    expect(needLabels(practiceNeed("our hiring panel keeps choosing the same candidates"))).toContain("Build inclusive teams");
  });

  it("returns nothing for a question that names no such need, and never more than three competencies", () => {
    expect(practiceNeed("What is the capital of Minnesota?")).toEqual({ competencies: [], scope: undefined });
    expect(practiceNeed("conflict feedback hiring mentor bias perspective data budget").competencies).toHaveLength(3);
    expect(guidedSteps("What is the capital of Minnesota?", directory(["/learn/intercultural"]), ["shared"])).toEqual([]);
  });

  it("infers nothing about the person: identity and self-description add no competency", () => {
    expect(practiceNeed("I am a new immigrant employee").competencies).toEqual([]);
    expect(practiceNeed("I think I am in Minimization").competencies).toEqual([]);
  });
});

describe("guided steps", () => {
  const lesson = findLessons({ competencies: ["conflict-repair"] })[0];
  const practice = findTagged({ competencies: ["conflict-repair"], activities: ["practice"], kinds: ["scenario"] }, { settings: ["shared", "dsd"] })[0];

  it("offers something to learn, to practice, and a place to reflect, from published destinations only", () => {
    const published = directory([lesson.href, practice.href, "/learn/intercultural"]);
    const steps = guidedSteps("How do I handle a conflict on my team?", published, ["shared", "dsd"]);
    expect(steps.map(step => step.activity)).toEqual(["learn", "practice", "reflect"]);
    for (const step of steps) expect(published.has(step.href)).toBe(true);
    expect(steps[0].label).toMatch(/^Learn: /);
  });

  it("offers nothing that is not published in the current view", () => {
    expect(guidedSteps("How do I handle a conflict on my team?", directory([]), ["shared", "dsd"])).toEqual([]);
    expect(guidedSteps("How do I handle a conflict on my team?", directory(["/learn/intercultural"]), ["shared"])).toEqual([]);
  });

  it("keeps division scenarios out of the agencywide view even when they are published", () => {
    const published = directory([lesson.href, practice.href, "/learn/intercultural"]);
    const steps = guidedSteps("How do I handle a conflict on my team?", published, ["shared"]);
    expect(steps.some(step => step.href === practice.href)).toBe(false);
  });
});

describe("describing work", () => {
  it("recognizes questions about people and work, and not general knowledge", () => {
    expect(describesWork("How should I give feedback to someone I supervise?")).toBe(true);
    expect(describesWork("A family could not read our notice")).toBe(true);
    expect(describesWork("What data structures are good options for a Python queue?")).toBe(false);
  });
});
