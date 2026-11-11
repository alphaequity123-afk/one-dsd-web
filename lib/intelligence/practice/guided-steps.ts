import { COMPETENCIES, findLessons, findTagged, type CompetencyId, type ScopeId, type Setting } from "@/lib/content/knowledge";

/**
 * From a person's question to three next steps: something to learn, something to
 * practice, and somewhere to reflect. This is the consultant's "one proportionate
 * move, then return" made concrete from the tagged collection.
 *
 * It reads the question for the WORK it describes. It does not infer anything about
 * the person: no orientation, readiness, identity, or history. Nothing is stored.
 */

const SIGNALS: ReadonlyArray<readonly [RegExp, CompetencyId]> = [
  [/\b(conflicts?|tension|arguments?|disagree\w*|clash\w*|repair|landed badly|harm)\b/i, "conflict-repair"],
  [/\b(feedback|coach\w*|performance (conversation|review)|one[- ]to[- ]ones?)\b/i, "coach-feedback"],
  [/\b(hir(e|ing)|interview\w*|panel|posting|recruit\w*|onboard\w*|new (colleague|employee|hire))\b/i, "inclusive-teams"],
  [/\b(delegat\w*|stretch|mentor\w*|sponsor\w*|promotion|advance(ment)?|career|develop (my|our) (staff|team|people))\b/i, "develop-others"],
  [/\b(speak(s|ing)? up|silent|silence|psychological safety|team (culture|climate)|belong\w*|same (people|voices))\b/i, "inclusive-teams"],
  [/\b(facilitat\w*|difficult (conversation|dialogue)|dialogue|discussion)\b/i, "facilitate"],
  [/\b(bias\w*|assum\w*|stereotyp\w*|first impression|judg(e|ing|ment))\b/i, "observe-interpret"],
  [/\b(my own (culture|default|norms?)|privilege|self[- ]aware\w*|blind spots?)\b/i, "own-culture"],
  [/\b(perspectives?|point of view|see it (their|another) way|understand where)\b/i, "shift-perspective"],
  [/\b(adapt\w*|adjust (my|how)|communication styles?|code[- ]switch\w*)\b/i, "adapt-behavior"],
  [/\b(listen\w*|ask better questions|stay (conversation|interview))\b/i, "listen-inquire"],
  [/\b(plain language|notices?|forms?|interpreter\w*|translat\w*|readab\w*|screen reader)\b/i, "accessible-communication"],
  [/\b(data|measur\w*|evidence|outcomes?|disparit\w*|indicator\w*)\b/i, "evidence"],
  [/\b(equity analysis|toolkit|decisions?|policy change|trade[- ]?offs?|options)\b/i, "equity-analysis"],
  [/\b(change management|resist\w*|rollout|roll out|implement\w*|redesign\w*)\b/i, "lead-change"],
  [/\b(communit(y|ies)|engag\w*|partner\w*|stakeholder\w*|co[- ]design\w*|listening sessions?)\b/i, "partner"],
  [/\b(accommodat\w*|accessib\w*|barriers?)\b/i, "build-access"],
  [/\b(budget\w*|resourc\w*|governance|contracts?|procurement|grants?)\b/i, "govern-resource"],
  [/\b(succession|hand[- ]?(off|over)s?|knowledge transfer|retir\w*|turnover|continuity)\b/i, "continuity"],
  [/\b(culture change|sustain\w*|values)\b/i, "sustain-culture"],
  [/\b(purpose|accountab\w*|ethic\w*|mistake|apolog\w*)\b/i, "purpose-accountability"],
  [/\b(bridg\w*|mediat\w*|between two)\b/i, "bridge"],
];

const SCOPE_SIGNALS: ReadonlyArray<readonly [RegExp, ScopeId]> = [
  [/\b(my team|my staff|direct reports?|i supervise|as a supervisor|supervising)\b/i, "team"],
  [/\b(as a manager|my supervisors|across (my )?teams|several teams)\b/i, "across-teams"],
  [/\b(as (a|the) director|division[- ]wide|the whole division|our strategy)\b/i, "organization"],
  [/\b(my program|program lead|project lead|without authority|policy lead)\b/i, "program"],
];

export type PracticeNeed = { competencies: CompetencyId[]; scope?: ScopeId };

/** What the question is about, in the program's vocabulary. Empty when nothing matches. */
export function practiceNeed(question: string): PracticeNeed {
  const competencies: CompetencyId[] = [];
  for (const [pattern, competency] of SIGNALS) {
    if (pattern.test(question) && !competencies.includes(competency)) competencies.push(competency);
  }
  const scope = SCOPE_SIGNALS.find(([pattern]) => pattern.test(question))?.[1];
  return { competencies: competencies.slice(0, 3), scope };
}

/**
 * True when the question is about work with other people: a team, colleagues, the people
 * served, a meeting, a policy. Keeps guided steps off general-knowledge questions that
 * happen to contain a word such as "data" or "options".
 */
export function describesWork(question: string): boolean {
  return /\b(team|staff|supervis\w*|colleagues?|co-?workers?|employees?|direct reports?|manag(e|er|ers|ing)|meetings?|hiring|workplace|division|caseload|clients?|people we serve|famil(y|ies)|communit(y|ies)|notices?|polic(y|ies))\b/i.test(question);
}

export type GuidedStep = { activity: "learn" | "practice" | "reflect"; label: string; href: string };

type Destination = { label: string; href: string };

const title = (destination: Destination) => destination.label.replace(/^(Open|Explore|Read)\s+/, "");
const REFLECTION_HREF = "/learn/intercultural";

/**
 * Up to three steps, each a destination already published in the current view.
 * `published` is the caller's own directory of available destinations; a tag never
 * makes anything else visible. Returns nothing when the question names no need.
 */
export function guidedSteps(question: string, published: ReadonlyMap<string, Destination>, settings: readonly Setting[]): GuidedStep[] {
  const need = practiceNeed(question);
  if (need.competencies.length === 0) return [];
  const steps: GuidedStep[] = [];
  const open = (href: string) => published.get(href);

  // Among everything tagged for the need, prefer the destination whose title shares the most words with the question.
  const words = new Set(question.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const overlap = (href: string) => (title(open(href)!).toLowerCase().match(/[a-z]{4,}/g) ?? []).filter(word => words.has(word)).length;
  const best = <T extends { href: string }>(items: T[], bonus: (item: T) => number) =>
    items.filter(item => open(item.href)).map((item, index) => ({ item, score: overlap(item.href) + bonus(item), index }))
      .sort((x, y) => y.score - x.score || x.index - y.index)[0]?.item;

  const lesson = best(findLessons({ competencies: need.competencies }), item => (need.scope && item.course.scopes.includes(need.scope) ? 0.5 : 0));
  if (lesson) steps.push({ activity: "learn", label: `Learn: ${title(open(lesson.href)!)}`, href: lesson.href });

  const practice = best(
    findTagged({ competencies: need.competencies, activities: ["practice"], kinds: ["path", "scenario", "tool"] }, { settings }).filter(item => item.href !== REFLECTION_HREF),
    item => (item.kind === "path" ? 0.25 : 0));
  if (practice) steps.push({ activity: "practice", label: `Practice: ${title(open(practice.href)!)}`, href: practice.href });

  const reflect = open(REFLECTION_HREF);
  if (reflect && steps.length > 0) steps.push({ activity: "reflect", label: "Reflect: note what you tried and what happened", href: REFLECTION_HREF });
  return steps;
}

/** For display and tests: the label of each competency a question touched. */
export function needLabels(need: PracticeNeed): string[] {
  return need.competencies.map(id => COMPETENCIES.find(item => item.id === id)!.label);
}
