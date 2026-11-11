import { describe, expect, it } from "vitest";
import {
  ALL_JOURNEY_PATHWAYS, JOURNEY_CORE, JOURNEY_INTERCULTURAL, JOURNEY_INTERCULTURAL_PARTS, JOURNEY_PATHWAYS, LEADERSHIP_JOURNEY_SURFACES, getJourneyPathway,
} from "@/lib/content/leadership-journey";
import { COMPETENCY_IDS, RESOURCE_TAGS, courseTags } from "@/lib/content/knowledge";
import { EDITABLE_SURFACE_REGISTRY } from "@/lib/content/staff-surface-registry";
import { CODE_APPROVED_SURFACE_IDS } from "@/lib/content/courses/definitions";
import { lintStaffCopy } from "@/lib/brand/lint";

const modules = ALL_JOURNEY_PATHWAYS.flatMap(pathway => pathway.modules.map(module => ({ pathway, module })));

describe("leadership journey content", () => {
  it("has a six-module core, five six-module pathways, and a 24-unit intercultural strand in three parts", () => {
    expect(JOURNEY_CORE.modules).toHaveLength(6);
    expect(JOURNEY_PATHWAYS.map(pathway => pathway.modules.length)).toEqual([6, 6, 6, 6, 6]);
    expect(JOURNEY_PATHWAYS.map(pathway => pathway.scope)).toEqual(["yourself", "program", "team", "across-teams", "organization"]);
    expect(JOURNEY_INTERCULTURAL.modules).toHaveLength(24);
    expect(JOURNEY_INTERCULTURAL_PARTS.flatMap(part => part.unitIds)).toEqual(JOURNEY_INTERCULTURAL.modules.map(module => module.id));
    expect(new Set(modules.map(item => item.module.id)).size).toBe(modules.length);
    expect(getJourneyPathway("leading-a-team")?.title).toBe("Leading a team");
    expect(getJourneyPathway("nope")).toBeUndefined();
  });

  it("names only real courses, none of them deferred, and only known competencies", () => {
    for (const { module } of modules) {
      for (const id of module.courses) expect(courseTags(id)?.deferral, `${module.id}: ${id}`).toBe("none");
      for (const competency of module.competencies) expect(COMPETENCY_IDS, module.id).toContain(competency);
      expect(module.competencies.length, module.id).toBeGreaterThan(0);
      expect(module.courses.length + (module.links?.length ?? 0), `${module.id} has nothing to open`).toBeGreaterThan(0);
    }
  });

  it("links practice paths, scenarios, and life-cycle stages by addresses that exist", () => {
    const known = new Set(RESOURCE_TAGS.map(resource => resource.href));
    for (const { module } of modules) for (const link of module.links ?? []) {
      if (/^\/(practice\/gp-|one-dsd\/scenarios\/|one-dsd\/leadership\?stage=)/.test(link.href)) expect(known.has(link.href), `${module.id}: ${link.href}`).toBe(true);
      expect(link.href.startsWith("/"), link.href).toBe(true);
    }
  });

  it("reads as staff copy, with no internal or technical wording", () => {
    for (const pathway of ALL_JOURNEY_PATHWAYS) {
      const text = [pathway.title, pathway.audience, pathway.question, pathway.intro, ...pathway.modules.flatMap(module => [module.title, module.question, module.youCan, module.tryThis, ...(module.links ?? []).map(link => link.label)])];
      for (const value of text) expect(lintStaffCopy(value), value).toEqual([]);
    }
  });

  it("registers one editable page for the entry and one per pathway, approved in code", () => {
    expect(LEADERSHIP_JOURNEY_SURFACES).toHaveLength(8);
    const registered = new Set(EDITABLE_SURFACE_REGISTRY.map(surface => surface.surfaceId));
    for (const surface of LEADERSHIP_JOURNEY_SURFACES) {
      expect(registered.has(surface.surfaceId), surface.surfaceId).toBe(true);
      expect(CODE_APPROVED_SURFACE_IDS.has(surface.surfaceId), surface.surfaceId).toBe(true);
      expect(surface.scopePolicy).toBe("dsd");
    }
  });
});

describe("leadership journey and ASK", () => {
  it("is reachable through ASK in the division view and absent from the agencywide view", async () => {
    const { indexedProgramResources } = await import("@/lib/intelligence/retrieval/program-resources");
    const division = new Set((await indexedProgramResources("dsd")).destinations.map(doc => doc.href));
    const agencywide = new Set((await indexedProgramResources("one-dhs")).destinations.map(doc => doc.href));
    for (const surface of LEADERSHIP_JOURNEY_SURFACES) {
      expect(division.has(surface.route), surface.route).toBe(true);
      expect(agencywide.has(surface.route), surface.route).toBe(false);
    }
  }, 120_000);
});
