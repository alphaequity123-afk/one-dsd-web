# The consultant's digital twin, and an outcome-based program

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Owner direction, November 11, 2026.**

1. The 21 competencies are confirmed.
2. The applications are to operate as the Equity and Inclusion Operations Consultant's digital twin, and the builder is to lead the technical design.
3. The purpose of the whole application is outcomes: people able to apply equity in all they do, and disparities reduced. Recommendations that serve that purpose are wanted, including self-learning and self-improvement.

Local work only. Nothing here is published or deployed.

---

## 1. What was built

| Piece | What it does | Where |
| --- | --- | --- |
| Consultant practice model | One written account of how the consultant works: six functions, the order a consultation follows, the stance, and where the program hands off. Every agent can read it | `lib/intelligence/practice/consultant-practice.ts` |
| ASK reasons from it | The practice model is given to the reasoning model with every question, with an instruction to reason that way, keep short questions short, and never speak as the consultant personally | `lib/intelligence/agents/ask.ts` |
| Guided steps | A work question now ends with something to learn, something to practice, and a place to reflect, chosen from the tagged collection | `lib/intelligence/practice/guided-steps.ts` |

### The consultation order

Situation, people affected, who decides, evidence, one proportionate move, and the return to what happened. The last two are the outcome end of the method: every answer points to something the person can do within their role, and to how they would know it helped.

### Guided steps, in practice

From the real published index in the One DSD view:

| Question | Learn | Practice |
| --- | --- | --- |
| A conflict on my team after a comment landed badly | A conflict-resolution lesson | The scenario "A comment in a meeting landed badly and nobody addressed it" |
| Our hiring panel keeps choosing the same kind of candidate | A supervisor culture lesson | The scenario "A hiring panel keeps choosing the same kind of candidate" |
| Rewrite a notice in plain language for families | A plain-language lesson | The path "Reviewing a draft for equity, access, and plain language" |

Each also offers the reflection notebook.

### Rules built in and tested

- Steps come only from destinations published in the current view. A tag never makes anything else visible.
- Division scenarios do not appear in the agencywide view.
- Wholly deferred content is never offered.
- The question is read for the work it describes. Nothing is inferred about the person: stating an identity or naming an orientation adds nothing.
- General-knowledge questions get no guided steps.
- Nothing is stored.

---

## 2. Limits

- **The practice model is drawn from the program's documents, not from the consultant's own account.** It is a first version for the owner to correct. The functions, method, and lines are in one file.
- **How well the reasoning model follows it is untested.** The model sits behind a feature flag and was not called in this work. Tests cover what is sent to it and the deterministic parts.
- **Guided steps depend on first-pass tags** made from titles. The practice match is usually strong because scenarios and paths were tagged by hand; the lesson match is weaker, as the hiring example shows.
- **Questions are matched by wording.** A need phrased in unusual words is missed. A reasoning model that names the competencies would do better and is the next step.
- **Lessons outside the 609 tagged so far are never offered as a learn step.**

---

## 3. Verification

Local, Node 24.14.0, static content source.

| Check | Result |
| --- | --- |
| `tests/consultant-practice.test.ts` | 9 passed |
| `tests/ask-guided-steps.test.ts`, through the real ASK flow and published index | 4 passed |
| All ASK, learning, and knowledge tests together | 171 passed, 9 skipped. One file could not start a local test database in this environment |
| ESLint on changed files; TypeScript for the project | Passed |

---

## 4. Making the program outcome-based

The application today is strong on content and weak on the last step: knowing whether anything changed. These are the recommendations, in order of value.

| # | Recommendation | Why it serves outcomes |
| --- | --- | --- |
| 1 | **Every answer ends in an action and a return.** Built: guided steps. Next: a return point a week later on the person's own device | An answer that ends in reading changes nothing. The research on training transfer says application and follow-up decide whether learning reaches the work |
| 2 | **One outcome chain for every piece of work:** the decision, who is affected, what was changed, what was observed, for whom. The application already separates delivered, applied, and benefit; make that the closing step of every practice path and scenario | It turns activity into evidence without scoring anyone |
| 3 | **Disparity as the starting question.** For any decision, ask first: which groups does the current practice serve less well, and what do we know? Put the State Equity Analysis Tool's impact and data criteria at the front of the consult method | Disparities shrink when decisions change, and decisions change when the question is asked before the decision |
| 4 | **Real work items.** A practice that matters becomes a One DSD Team work item with a decision owner and a recorded outcome | Research on organizations finds shared responsibility for real work is associated with lasting change where training alone is not |
| 5 | **An outcomes view for the owner,** built from voluntary accounts and work-item outcomes: what changed, where, and what is still missing | It shows the program's contribution without tracking people. It waits on the retention decision for anything staff submit |
| 6 | **Gaps as a first-class record.** When ASK cannot help, or a person reports something inaccessible or missing, record the gap and route it to an owner | The fastest route to a better outcome is fixing what blocked the last person |

### What "outcome" can and cannot mean here

The program can show its contribution: what people tried, what changed in a process, what a decision owner did. It cannot claim to have reduced a disparity on its own, and it must not measure a person. Disparity data belongs to the responsible offices; the program helps people ask for it, read it, and act on it.

---

## 5. Self-learning and self-improvement

The application can improve itself in four loops. Each is evidence-led, each leaves a receipt, and the owner keeps the stop control.

| Loop | What it learns from | What it changes | Guard |
| --- | --- | --- | --- |
| **Answers** | ASK records already kept: questions it could not ground, answers marked degraded, questions with no guided step | Proposes new signals, tags, and practice-model wording | Reads questions for topics, never to profile anyone. Changes pass the evaluation suite before they apply |
| **Content** | Gaps, stale sources, thin competencies and orientations in the tags | Drafts or revises lessons through the authoring chain | Original sources preserved; deferred content untouched; owner-curated content not re-approved |
| **Tags** | Disagreement between first-pass tags and what a lesson-level read finds | Corrects tags with a receipt for each | A test already fails if tags are marked reviewed without a review |
| **Evaluation** | A growing set of test questions with the answers the consultant would give | Scores every change to the practice model and the agents | A change that lowers the score does not ship |

**The evaluation set is the piece that makes the others safe.** It should hold, for each of the six consultant functions, a set of realistic questions and what a good answer must include and must never do. It grows whenever the owner corrects an answer. That is how the twin comes to reflect the consultant's own judgment over time.

What self-improvement must never do: learn about individual staff, change a standing rule, publish without the checks, or act outside the owner's ceiling and stop control.
