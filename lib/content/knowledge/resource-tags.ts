import type { ActivityId } from "./vocabulary";
import type { KnowledgeTags, ResourceKind, Setting, TagProvenance } from "./schema";

/**
 * Tags for resources other than courses: practice paths, DSD practice scenarios,
 * employee life-cycle stages, and tools. Program-authored from each resource's own
 * definition. Course tags live in course-tags.json.
 */
export const RESOURCE_TAG_PROVENANCE: TagProvenance = {
  basis: "lesson-read", producedBy: "program-authored", ownerReviewed: false, date: "2026-11-11",
};

type Entry = { kind: ResourceKind; id: string; href: string; setting: Setting; activities: ActivityId[]; tags: KnowledgeTags };

const t = (
  domains: KnowledgeTags["domains"], competencies: KnowledgeTags["competencies"], scopes: KnowledgeTags["scopes"],
  contexts: KnowledgeTags["contexts"] = [], orientations: KnowledgeTags["orientations"] = [],
): KnowledgeTags => ({ domains, competencies, scopes, orientations, contexts, deferral: "none" });

const path = (id: string, tags: KnowledgeTags): Entry =>
  ({ kind: "path", id, href: `/practice/${id}`, setting: "shared", activities: ["practice"], tags });
const scenario = (id: string, tags: KnowledgeTags): Entry =>
  ({ kind: "scenario", id, href: `/one-dsd/scenarios/${id}`, setting: "dsd", activities: ["learn", "practice"], tags });
const stage = (id: string, tags: KnowledgeTags): Entry =>
  ({ kind: "life-cycle-stage", id, href: `/one-dsd/leadership?stage=${id}#life-cycle`, setting: "dsd", activities: ["learn", "practice", "reflect"], tags });

export const RESOURCE_TAGS: readonly Entry[] = [
  // Practice paths
  path("gp-1", t(["systems-leadership"], ["equity-analysis", "partner"], ["program", "across-teams"])),
  path("gp-2", t(["human-centered-communication", "systems-leadership"], ["accessible-communication", "equity-analysis"], ["program"], ["policy"])),
  path("gp-3", t(["systems-leadership"], ["partner"], ["program", "organization"])),
  path("gp-4", t(["leadership-effectiveness", "organizational-stewardship"], ["inclusive-teams", "sustain-culture"], ["team"], ["workforce"])),
  path("gp-5", t(["human-centered-communication"], ["facilitate"], ["everyone", "team"])),
  path("gp-6", t(["leadership-effectiveness", "systems-leadership"], ["inclusive-teams", "evidence"], ["team"], ["workforce"])),
  path("gp-7", t(["systems-leadership"], ["equity-analysis", "evidence"], ["program", "team", "across-teams", "organization"], ["policy"])),
  path("gp-8", t(["human-centered-communication", "intercultural-fluency"], ["accessible-communication", "facilitate", "adapt-behavior"], ["everyone", "team"])),
  path("gp-9", t(["human-centered-communication"], ["accessible-communication"], ["everyone", "program"])),
  path("gp-10", t(["organizational-stewardship", "systems-leadership"], ["govern-resource", "equity-analysis"], ["program", "across-teams"])),
  path("gp-11", t(["leadership-effectiveness", "organizational-stewardship"], ["develop-others", "build-access", "continuity"], ["team", "across-teams"], ["workforce"])),
  path("gp-12", t(["systems-leadership"], ["equity-analysis"], ["everyone", "yourself"])),
  path("gp-13", t(["human-centered-communication", "intercultural-fluency"], ["accessible-communication", "own-culture"], ["everyone", "yourself"])),

  // DSD practice scenarios
  scenario("dsd-hiring-panel", t(["leadership-effectiveness", "intercultural-fluency"], ["inclusive-teams", "observe-interpret"], ["team"], ["workforce"])),
  scenario("dsd-advancement-conversation", t(["leadership-effectiveness"], ["develop-others", "coach-feedback"], ["team"], ["workforce"])),
  scenario("dsd-accommodation-cliff", t(["organizational-stewardship"], ["build-access", "continuity"], ["team", "across-teams"], ["workforce"])),
  scenario("dsd-policy-change", t(["systems-leadership"], ["equity-analysis", "partner"], ["program", "organization"], ["policy"])),
  scenario("dsd-service-redesign", t(["systems-leadership"], ["lead-change", "partner"], ["program"], ["service"])),
  scenario("dsd-engagement-late", t(["systems-leadership"], ["partner"], ["program", "organization"])),
  scenario("dsd-report-back", t(["systems-leadership", "human-centered-communication"], ["partner", "listen-inquire"], ["program"])),
  scenario("dsd-accessible-form", t(["human-centered-communication", "organizational-stewardship"], ["accessible-communication", "build-access"], ["program"], ["service"])),
  scenario("dsd-interpreter-first-contact", t(["human-centered-communication", "intercultural-fluency"], ["accessible-communication", "adapt-behavior"], ["everyone", "program"], ["service"])),
  scenario("dsd-team-silence", t(["leadership-effectiveness", "human-centered-communication"], ["inclusive-teams", "facilitate"], ["team"])),
  scenario("dsd-repair-after-harm", t(["human-centered-communication", "leadership-effectiveness"], ["conflict-repair", "inclusive-teams"], ["everyone", "team"])),
  scenario("dsd-leadership-bottleneck", t(["systems-leadership", "organizational-stewardship"], ["lead-change", "govern-resource"], ["across-teams", "organization"])),
  scenario("dsd-small-group-data", t(["systems-leadership"], ["evidence"], ["program", "across-teams"])),

  // Employee life-cycle stages on the leadership page
  stage("design", t(["leadership-effectiveness", "systems-leadership"], ["inclusive-teams", "evidence"], ["team"], ["workforce"])),
  stage("recruit", t(["leadership-effectiveness", "human-centered-communication"], ["inclusive-teams", "accessible-communication"], ["team"], ["workforce"])),
  stage("interview", t(["intercultural-fluency", "systems-leadership"], ["observe-interpret", "evidence"], ["team"], ["workforce"])),
  stage("onboard", t(["leadership-effectiveness"], ["inclusive-teams"], ["everyone", "team"], ["workforce"])),
  stage("everyday", t(["leadership-effectiveness"], ["inclusive-teams", "coach-feedback"], ["team"], ["workforce"])),
  stage("develop", t(["leadership-effectiveness"], ["develop-others"], ["yourself", "team"], ["workforce"])),
  stage("advance", t(["leadership-effectiveness", "organizational-stewardship"], ["develop-others", "continuity"], ["team", "across-teams"], ["workforce"])),
  stage("retain", t(["human-centered-communication", "leadership-effectiveness"], ["listen-inquire", "inclusive-teams"], ["team"], ["workforce"])),
  stage("succession", t(["organizational-stewardship"], ["continuity"], ["across-teams", "organization"], ["workforce"])),
  stage("transition", t(["organizational-stewardship"], ["continuity"], ["team", "across-teams"], ["workforce"])),

  // Tools
  { kind: "tool", id: "development-map", href: "/one-dsd/leadership#starting-points", setting: "dsd", activities: ["practice", "reflect"],
    tags: t(["leadership-effectiveness"], ["purpose-accountability", "develop-others"], ["yourself"]) },
  { kind: "tool", id: "continuity-builder", href: "/one-dsd/leadership#continuity-plan", setting: "dsd", activities: ["practice"],
    tags: t(["organizational-stewardship"], ["continuity"], ["across-teams", "organization"], ["workforce"]) },
  { kind: "tool", id: "intercultural-practice-notebook", href: "/learn/intercultural", setting: "shared", activities: ["learn", "practice", "reflect"],
    tags: t(["intercultural-fluency"], ["observe-interpret", "shift-perspective", "adapt-behavior"], ["everyone", "yourself"]) },
  { kind: "tool", id: "equity-toolkit-companion", href: "/learn/equity-toolkit", setting: "shared", activities: ["learn", "practice"],
    tags: t(["systems-leadership"], ["equity-analysis"], ["everyone", "program", "team", "across-teams", "organization"], ["policy"]) },
  { kind: "tool", id: "measurement-worksheet", href: "/practice/measurement", setting: "shared", activities: ["practice", "reflect"],
    tags: t(["systems-leadership"], ["evidence"], ["program", "across-teams"]) },
];
