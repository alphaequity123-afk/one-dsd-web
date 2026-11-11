# Three-layer agent architecture and Learning Navigator: assessment

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Request.** The owner shared a proposed architecture drafted in another AI conversation: nine agents in three layers, a Learning Navigator as the front door, dynamic orchestration, five permanent domains, and a tagging hierarchy for all content. The owner asked what can be done with it and for an honest assessment of how it fits the One DSD and One DHS People, Access and Culture applications.

**What this is based on.** The proposal as pasted, and a reading of the application's agent code: the agent registry, orchestrator, ASK agent, autonomy policy, model registry, feature flags, and content tagging. Nothing was changed or run. Statements about production behavior are marked where they could not be checked from here.

---

## 1. Bottom line

1. **Most of the proposal can be incorporated, and a good part of it already exists** in the application under different names. The right move is to extend what is there, not to add a second system beside it.
2. **Three parts of the proposal conflict with the owner's standing rules** and need to change: governance as a final approval authority, tracking and assessing individual learners, and certifications.
3. **One part is an engineering risk:** running four or five agents in sequence on every learner question. It suits authoring work. It does not suit a live conversation.
4. **The five domains and the tagging idea are sound and worth adopting**, as tags and not as a strict tree.
5. **Nine agents do not by themselves make the learning better.** What staff experience is the content and the quality of one answer. The architecture is worth building where it produces those.

---

## 2. What the application already has

Verified in the code.

| In the application | What it does |
| --- | --- |
| Agent registry (`lib/intelligence/registry/agents.ts`) | Ten agents, each defined as configuration: purpose, allowed tools, autonomy ceiling, review rule, evaluation suite, scope, safety profile |
| Program orchestrator (`lib/intelligence/orchestrator.ts`) | Routes a request to the right specialist and enforces tool permissions and the owner's policy. Its own description: "specialists are never collapsed into one unbounded chat brain" |
| ASK (`lib/intelligence/agents/ask.ts`) | The staff front door: classifies intent, retrieves program resources, reasons, cites sources, suggests next actions, and keeps a durable record |
| Owner policy (`lib/intelligence/policy.ts`) | A hard stop, a program-wide autonomy ceiling, and per-agent switches |
| Model registry | An owner-approved reasoning model behind a feature flag, a local model for meaning-based search, and a deterministic fallback when no model is available |
| Evaluation steward and content sentinel | Run evaluation cases, detect stale content, write proposals |
| Librarian and accessibility reviewer | Classify and tag resources; review plain language and access |
| Graduation coach | Recommends next practice using progress kept on the person's own device |
| Content tagging | Themes (many-to-many), role and topic facets, domains with tasks, and the librarian's layers |
| Staff labels | The registry requires a workflow label and "never a persona name." Staff see "Ask," not a roster of agents |

---

## 3. How the nine proposed agents map

| Proposed agent | Closest existing piece | What it would take |
| --- | --- | --- |
| Learning Navigator | ASK plus the program orchestrator | **Extend ASK.** It is already the front door. A second one would split the experience and the records |
| Governance, Research and Quality Assurance | Evaluation steward, content sentinel, accessibility reviewer, research governance, and the Chief of Staff role | Combine as a quality check on agent-produced output. See section 4.1 for the authority change |
| Curriculum Architect | None | New, on the authoring side |
| Organizational Transformation Strategist | Launch-question advisor, in part | New, owner-facing |
| Intercultural Development Specialist | Community guide, in part | New. The intercultural strand gives it its content |
| Leadership Coach | Graduation coach, in part | New, or an extension |
| Reflection and Meaning-Making Facilitator | The practice notebook and reflection prompts are content, not an agent | New |
| Facilitation and Community Learning Designer | The session-planning practice path | New, on the authoring side |
| Assessment and Development Planner | Graduation coach's on-device progress | New, and the most constrained. See section 4.2 |
| Career and Leadership Pathway Advisor | Named in the proposal's layer three but never specified | Decide whether it exists. If it does, it must never promise advancement |

A note on the pasted draft: it numbers Governance as agent 8 in one place and agent 1 in another, and lists ten roles while saying nine. That needs settling before anything is registered.

---

## 4. Where the proposal has to change

### 4.1 Governance as final authority

**The proposal says:** Governance is the final authority; no content may bypass its review; it approves, rejects, and decides when agents disagree.

**The owner's directive says:** the Chief of Staff coordinates and follows work through. It is not an approval authority over content the owner has already approved, and no AI adds a content-approval veto.

**The fit:** the quality agent checks what other agents produce: accuracy against sources, the lesson standard, accessibility, voice, and the standing rules. It records what it checked and what failed. It can send agent work back. It does not re-approve owner-curated content, and the owner remains the final authority. The proposal's wording "Governance provides determination" becomes "the quality check reports; the owner decides where a decision is needed."

### 4.2 Tracking and assessing the learner

**The proposal says:** the Navigator and the Assessment Planner take in assessment results and reflection journals, consider "developmental readiness" and "intercultural orientation," monitor progress, produce progress summaries, and aim at "measurable developmental progress."

**The owner's rules say:** no assessed or inferred intercultural position becomes a record, a score, a gate, or a label on a person. The application has no sign-in for staff, so there is no account to attach a history to. No staff records are collected while retention is undecided. ASK must not infer an orientation from someone's questions.

**The fit:**

| Proposal | What can be built |
| --- | --- |
| Tracks progress | The learner's device holds their own journey: lessons opened, reflections, application notes. The program holds none of it |
| Uses assessment results and intercultural orientation | Content is tagged by orientation. People are not. A learner can tell the Navigator a goal from their own debrief, and it uses that for the conversation |
| Personalizes from learning history | The learner can choose to include their on-device journey in a question. Consent for passing context to ASK is already an open decision in the PRD |
| Developmental readiness | The learner chooses "start here" or "go further." Nothing judges readiness |
| Progress summaries | The learner's own export |
| Measurable developmental progress | Evidence about the program from opt-in accounts. Never a measure of a person |

One thing staff must be told at the point of asking: ASK keeps durable records behind the owner's boundary. Whatever a learner types to the Navigator, including anything personal, becomes part of that record.

**Because the program belongs to the consultant and may be used elsewhere:** the learner's journey should be built as a self-contained object the learner holds. In a setting that has accounts, consent, and a retention decision, the same object could be stored for the learner. That would be a switch for that setting, not a redesign.

### 4.3 Certifications

The proposal mentions certificates and certifications several times. In this setting, participation does not count toward required training credit without an express exception, and the earlier decision was to leave badges and certificates out. The tagging scheme can support certificates in another setting later. They should not appear in this one.

---

## 5. The engineering caution: live answers and authoring are different jobs

The proposal sends every request through the Navigator, then several specialists in sequence, then governance review.

**For a learner's live question, that is the wrong shape.** Each specialist is a separate model call, allowed up to sixty seconds in the current configuration. Four or five in a row, plus a review, means a long wait, several times the cost, and several more places to fail. The application also treats the reasoning model as optional: when it is unavailable, ASK falls back to a deterministic answer. A chain of specialists has no such fallback.

**For authoring, it is the right shape.** Creating a lesson, tagging content, or updating material after new research can run in the background, pass from one specialist to the next, and leave a receipt at each step. That is also where the owner's target of mostly agent-driven work applies.

**Recommendation: two modes.**

| Mode | When | How it works |
| --- | --- | --- |
| Live guidance | A person asks the Navigator something | One reasoning step that carries the specialists' guidance as instructions (leadership, intercultural, reflection), searches tagged content, answers, and offers a next step. The existing safety checks run. A second specialist is called only when the question plainly needs it |
| Authoring and upkeep | The owner or Chief of Staff starts a piece of work | The full chain: curriculum, intercultural, leadership, reflection, assessment, facilitation, quality check. Each step recorded. Agent-produced content goes to the owner where the owner's decision is needed |

The learner still gets what the proposal wants: one place to ask, an answer that draws on every specialty, and a next step. They get it in seconds.

---

## 6. The five domains and the tagging scheme

**Adopt the five domains.** They line up with the long-term design:

| Proposed domain | In the long-term design |
| --- | --- |
| Intercultural Fluency | The intercultural strand (24 units) |
| Leadership Effectiveness | Pathways 1 and 3: leading yourself, leading a team |
| Human-Centered Communication | Communication, feedback, and conflict modules across pathways; intercultural units on communication and conflict styles |
| Systems Leadership | Pathways 2 and 4: leading a program, leading across teams |
| Organizational Stewardship | Pathway 5: leading the division |

The proposal's aim of intercultural development as "the foundational operating system rather than a separate module" matches the owner's direction. The long-term design does both: a dedicated intercultural strand, and intercultural questions inside every leadership module.

**Use tags, not a tree.** The proposal draws a single chain from domain down to evidence of growth. Real lessons belong to more than one domain, scope, and orientation, and the application already treats theme membership as many-to-many. Each lesson should carry a set of tags:

| Tag | Values |
| --- | --- |
| Domain | The five domains; one or more |
| Leadership scope | Yourself, a program, a team, across teams, the division; one or more |
| Intercultural orientation | The orientation the content addresses; describes the content, never a person |
| Competency | From one agreed list. That list has to be decided: the program's own practices and capabilities, with a crosswalk to the State model |
| Skill | A short controlled list under each competency |
| Activity | Learn, practice, or reflect |
| Evidence | What a learner could notice for themselves |

**Scale.** The application has 240 courses and 1,415 lessons. Tagging all of them is real work. Agents can do a first pass with a receipt for each lesson, and the owner can spot-check. Start with the lessons the leadership program uses, roughly 150, and extend from there.

---

## 7. One DSD and One DHS

The two applications are one codebase with two content scopes. The agent registry, orchestrator, ASK, and tagging are shared by both. So:

- The architecture is built once and serves both.
- Leadership content can start in the division scope, where the scenarios and program profiles already are.
- Shared lessons, the intercultural strand, the tags, and the Navigator are available in the agencywide view as soon as they are published there.
- Starting with One DSD delays nothing for One DHS.

---

## 8. What can be done from here, and what cannot

**Can be built in this repository:**

1. The tag schema, with validation and tests, and tags on the leadership and intercultural lessons.
2. New specialist agents in the registry as real definitions, each with its purpose, allowed tools, ceiling, and evaluation cases.
3. ASK extended into the Navigator: leadership and intercultural routing, specialist guidance, next-step recommendations from tagged content.
4. The on-device journey, and an explicit "include my journey in this question" choice.
5. The authoring chain as background work with receipts.
6. The leadership section pages, registered so the owner can edit them and ASK can reach them.
7. Tests and local browser checks for all of the above.

**Cannot be claimed from here:**

- **Live model behavior.** The reasoning model sits behind a feature flag and needs a server-side key. Whether it is on in production was not checked, and no model call was made in this work.
- **Deployment.** Nothing has been deployed. A deployment follows `DEPLOY.md` and is complete only when its live checks pass.
- **Quality.** An agent definition is configuration. Whether a specialist gives good guidance is shown by running evaluation cases and by the owner reading its output.
- **Decisions that are the owner's:** the competency list, consent wording for shared context, retention, the certification question, and how the IDI is offered.

---

## 9. Suggested order

1. Settle the agent list and the competency list.
2. Build the tag schema and tag the leadership and intercultural lessons.
3. Build the leadership section pages from existing content.
4. Extend ASK into the Navigator in live-guidance mode.
5. Add the specialist agents and the authoring chain, and use the chain to adapt the lessons marked "adapt" and "revise."
6. Add the on-device journey and the consented-context choice.
7. Run evaluations and local verification; then follow the deployment pathway when the owner directs.

---

## 10. Decisions for the owner

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | Extend ASK as the Navigator, or build a separate front door | Extend ASK |
| 2 | Quality check with the owner as final authority, in place of governance as final authority | Adopt |
| 3 | Learner journey held on the learner's device, shared by choice | Adopt for this setting; build it portable |
| 4 | Two modes: live guidance and authoring chain | Adopt |
| 5 | The five domains as tags | Adopt |
| 6 | The competency list | The program's own list, with a State crosswalk |
| 7 | Career and Leadership Pathway Advisor | Fold into the Navigator and the development map, with no promise of advancement |
| 8 | Certificates | Leave out in this setting |
