/**
 * Knowledge architecture: the controlled vocabulary every resource is tagged with.
 *
 * These describe CONTENT. They never describe a person. An orientation tag says which
 * developmental work a resource addresses; it must not be used to label, score, gate,
 * or infer anything about a staff member.
 *
 * The competency list is the program's own and is proposed pending the owner's
 * confirmation. It is data: change it here and the validation tests follow.
 */

export const DOMAINS = [
  { id: "intercultural-fluency", label: "Intercultural Fluency", focus: "Cultural self-awareness, perspective shifting, cultural humility, and adapting behavior across difference." },
  { id: "leadership-effectiveness", label: "Leadership Effectiveness", focus: "Leading oneself, building relationships and teams, and developing others." },
  { id: "human-centered-communication", label: "Human-Centered Communication", focus: "Listening, accessible and plain communication, feedback, dialogue, and conflict." },
  { id: "systems-leadership", label: "Systems Leadership", focus: "Evidence, decisions, equity analysis, change, and partnership with people affected." },
  { id: "organizational-stewardship", label: "Organizational Stewardship", focus: "Access built into work, governance and resources, continuity, and a culture that lasts." },
] as const;

export const LEADERSHIP_SCOPES = [
  { id: "everyone", label: "For everyone", note: "General learning that does not assume a leadership role." },
  { id: "yourself", label: "Leading yourself", note: "One's own practice, development, and influence." },
  { id: "program", label: "Leading a program", note: "Work guided without supervisory authority." },
  { id: "team", label: "Leading a team", note: "Supervising a team of direct reports." },
  { id: "across-teams", label: "Leading across teams", note: "Managing several teams, resources, and priorities." },
  { id: "organization", label: "Leading the organization", note: "Direction, culture, and continuity of the whole unit." },
] as const;

/** IDI continuum, in the IDI's own wording. A resource carries one only when it addresses that orientation's work. */
export const ORIENTATIONS = [
  { id: "denial", label: "Denial" },
  { id: "polarization", label: "Polarization" },
  { id: "minimization", label: "Minimization" },
  { id: "acceptance", label: "Acceptance" },
  { id: "adaptation", label: "Adaptation" },
  { id: "integration", label: "Integration" },
] as const;

export const ACTIVITIES = [
  { id: "learn", label: "Learn" },
  { id: "practice", label: "Practice" },
  { id: "reflect", label: "Reflect" },
] as const;

/**
 * Context a resource supplies about the setting it is used in. Context prepares better
 * questions; it never predicts what an individual believes, needs, or will do.
 */
export const CONTEXTS = [
  { id: "community", label: "Community context" },
  { id: "service", label: "Service and program knowledge" },
  { id: "policy", label: "Policy and official sources" },
  { id: "workforce", label: "Workforce and employee life cycle" },
] as const;

export const COMPETENCIES = [
  { id: "own-culture", domain: "intercultural-fluency", label: "Know your own culture" },
  { id: "observe-interpret", domain: "intercultural-fluency", label: "Separate observation from interpretation" },
  { id: "shift-perspective", domain: "intercultural-fluency", label: "Shift perspective" },
  { id: "adapt-behavior", domain: "intercultural-fluency", label: "Adapt behavior" },
  { id: "bridge", domain: "intercultural-fluency", label: "Bridge across difference" },
  { id: "purpose-accountability", domain: "leadership-effectiveness", label: "Lead with purpose and accountability" },
  { id: "inclusive-teams", domain: "leadership-effectiveness", label: "Build inclusive teams" },
  { id: "develop-others", domain: "leadership-effectiveness", label: "Develop and sponsor others equitably" },
  { id: "coach-feedback", domain: "leadership-effectiveness", label: "Coach and give feedback" },
  { id: "listen-inquire", domain: "human-centered-communication", label: "Listen and ask" },
  { id: "accessible-communication", domain: "human-centered-communication", label: "Communicate accessibly and plainly" },
  { id: "facilitate", domain: "human-centered-communication", label: "Facilitate across difference" },
  { id: "conflict-repair", domain: "human-centered-communication", label: "Engage conflict and repair" },
  { id: "evidence", domain: "systems-leadership", label: "Examine assumptions and use evidence" },
  { id: "equity-analysis", domain: "systems-leadership", label: "Apply an equity analysis to decisions" },
  { id: "lead-change", domain: "systems-leadership", label: "Lead change" },
  { id: "partner", domain: "systems-leadership", label: "Partner with people affected" },
  { id: "build-access", domain: "organizational-stewardship", label: "Build inclusion and accessibility into work" },
  { id: "govern-resource", domain: "organizational-stewardship", label: "Govern and resource equitably" },
  { id: "continuity", domain: "organizational-stewardship", label: "Share knowledge and build future capability" },
  { id: "sustain-culture", domain: "organizational-stewardship", label: "Sustain an equitable culture" },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];
export type ScopeId = (typeof LEADERSHIP_SCOPES)[number]["id"];
export type OrientationId = (typeof ORIENTATIONS)[number]["id"];
export type ActivityId = (typeof ACTIVITIES)[number]["id"];
export type ContextId = (typeof CONTEXTS)[number]["id"];
export type CompetencyId = (typeof COMPETENCIES)[number]["id"];

const ids = <T extends { id: string }>(items: readonly T[]) => items.map(item => item.id) as [T["id"], ...T["id"][]];
export const DOMAIN_IDS = ids(DOMAINS);
export const SCOPE_IDS = ids(LEADERSHIP_SCOPES);
export const ORIENTATION_IDS = ids(ORIENTATIONS);
export const ACTIVITY_IDS = ids(ACTIVITIES);
export const CONTEXT_IDS = ids(CONTEXTS);
export const COMPETENCY_IDS = ids(COMPETENCIES);

export function competencyDomain(id: CompetencyId): DomainId {
  return COMPETENCIES.find(competency => competency.id === id)!.domain;
}

/**
 * The seven DEIA leadership capabilities already used by the development map
 * (lib/content/leadership-development.ts), mapped onto the competency list.
 */
export const DEVELOPMENT_CAPABILITY_COMPETENCY: Record<string, CompetencyId> = {
  evidence: "evidence",
  communication: "facilitate",
  access: "build-access",
  opportunity: "develop-others",
  decisions: "equity-analysis",
  continuity: "continuity",
  "self-examination": "own-culture",
};
