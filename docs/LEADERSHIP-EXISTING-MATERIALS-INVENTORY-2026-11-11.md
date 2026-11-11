# Leadership section: inventory of existing materials to use, adapt, and revise

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Owner direction, November 11, 2026.** The leadership program is to be a significant addition to the One DSD People, Access and Culture application, and it may use, adapt, and revise existing materials for the leadership section.

**What this is.** A read-only inventory of what the application already holds that the leadership section can draw on. Nothing was edited to produce it.

**How fit was judged.** The leadership files, practice paths, and scenarios were read. Course fit was judged from course and lesson titles and series labels, not from reading every lesson. A lesson-level review is still needed before any course is placed in a pathway.

**What "revise" covers.** Program-written material can be revised. Original institutional source material is preserved as it is, and new leadership framing sits alongside it. Recovered course packs keep their source history.

---

## 1. Headline numbers

| | Courses | Lessons |
| --- | --- | --- |
| Recovered collection | 86 | 780 |
| Program-authored series | 154 | 635 |
| **Total** | **240** | **1,415** |

Program-authored series: disability inclusion (25 courses), intercultural practice (38), gap completion (30), DSD practice (13), diversity foundation (10), diversity intermediate (10), diversity advanced (11), cultural intelligence clusters (10), IDI continuum (4), program integrity (3).

**This corrects the earlier outline.** A first title scan suggested about a dozen leadership lessons would need to be written from nothing. The full inventory shows existing material for nearly every module, including courses on psychological safety, new-supervisor inclusive leadership, succession, resource allocation, governance, and an eight-course "internal leadership" series. Most of the work is adapting and assembling, not writing from a blank page.

---

## 2. Leadership content already built

| Asset | What it holds |
| --- | --- |
| Leadership page, `/one-dsd/leadership` | Learn, Reflect, Practice, Return; three starting points; life-cycle explorer; growth cards; mentor and sponsor guidance; continuity tool; sources |
| `lib/content/leadership-development.ts` | Three starting points (exploring, encouraged, practicing); seven capabilities; the development map and after-practice fields |
| `lib/content/leadership-lifecycle.ts` | Ten employee life-cycle stages, each with a question, learning, scenario, practice steps, reflection, evidence, and a resource |
| Components | Development studio; life-cycle explorer with `?stage=` links; continuity tool; stage-specific media |
| Download | The leadership page downloads as a document |

**Three things to know before building on it.**

1. **Nothing on the page is saved.** Notes live only while the page is open. The practice paths and practice notebook already save to the device, so the same pattern is available.
2. **The page is not editable in place.** It has no editable surface, unlike most of the application.
3. **ASK does not index it.** Only pages registered as editable surfaces are indexed, so ASK cannot currently route someone to the leadership page. This is inferred from how indexing is built and should be confirmed.

---

## 3. IDI continuum coverage

| Orientation | Existing courses |
| --- | --- |
| Denial | `idi-denial` |
| Polarization | `idi-polarization`; lessons in `from-noticing-to-shifting` and `what-minimization-does-in-dhs-work` |
| Minimization | `idi-minimization`; `what-minimization-does-in-dhs-work`; `teams-in-minimization` |
| Acceptance | `idi-acceptance`; `acceptance-in-dhs-work` |
| Adaptation | `idi-adaptation`; `from-noticing-to-shifting` |
| Integration | `idi-integration` only |

Every orientation has a dedicated course. Each `idi-*` course includes a lesson on noticing the orientation in a team and a lesson on finding it honestly in oneself. Those two lessons are the natural anchors for the core. Integration has the least material and is where pathway 5 needs the most new writing.

---

## 4. Adaptation map

Treatment key: **Use** = link as it is. **Adapt** = add a leadership framing, reorder, or select lessons. **Revise** = rewrite substantially or assemble from several sources. **New** = little exists.

### Common core

| Module | Existing assets | Treatment |
| --- | --- | --- |
| C1 Why equity governs leadership | `equity-centered-leadership`; `equity-inclusion-leadership-and-systems`; `di-leadership-case-for-inclusion`; `gc-structural-racism` | Adapt |
| C2 The continuum as a leader's map | Six `idi-*` courses; `intercultural-competence-without-a-score`; `teams-in-minimization`; `pn-idi-and-tool-registry` | Adapt |
| C3 Your own default | The "examine your own cultural default" capability; `idi-*` self lessons; `div-f04-cultural-values`; `div-f08-ethnocentrism`; `div-a02-whiteness-institutional-norm` | Adapt |
| C4 The five questions | The five-focus journey at `/learn/intercultural` and its practice notebook; `pn-equity-in-practice` | Use |
| C5 The equity lens on a decision | `dhs-equity-analysis-toolkit`; the Toolkit companion and Toolkit Studio; practice paths gp-7 and gp-12; `ja-operational-equity-canvas` | Use, with one leadership case |
| C6 The people we serve | `dsd-03-self-direction-independent-living`; `dsd-12-communication-methods`; `di-access-needs-and-individualized-support`; `ipe-04-person-centered-systems` | Adapt |

### Pathway 1: Leading yourself

| Module | Existing assets | Treatment |
| --- | --- | --- |
| 1.1 Purpose and values | `div-f04-cultural-values`; the "exploring" starting point | New |
| 1.2 Self-awareness | `idi-*` self lessons; `div-f05-implicit-bias-iat`; practice path gp-13 | Adapt |
| 1.3 Communication and listening | `intercultural-conflict-styles`; `ipe-06-accessible-communication`; `di-inclusive-communication` | Adapt |
| 1.4 Accountability and ethics | `ipe-27-ethical-decision-making`; `div-i10-receiving-feedback`; `div-a06-restorative-identity-harm` | Adapt |
| 1.5 Influence without a title | `equity-champion-contribution-workflow`; Amplify ideas; the Team page's "know who can decide" | Revise |
| 1.6 Planning your development | Development studio; `career-mentorship-and-sponsorship`; `pn-mentoring-sponsorship`; Amplify mentoring | Use, and add saving on the device |

### Pathway 2: Leading a program

| Module | Existing assets | Treatment |
| --- | --- | --- |
| 2.1 Systems thinking | `ipe-03-public-power`; `ipe-28-complex-issue-inquiry`; `ipe-19-history-public-institutions` | Adapt |
| 2.2 Leading without formal authority | `ipe-18-cross-division-coordination`; scenario `dsd-leadership-bottleneck` | Revise |
| 2.3 Stakeholder and community partnership | `ipe-15-stakeholder-partnership`; `ipe-34-co-design-partnership`; practice path gp-3; `ja-engagement-influence-ladder`; scenarios `dsd-engagement-late`, `dsd-report-back` | Use or adapt |
| 2.4 Policy, forms, and notices | `ipe-12-policy-writing-equity-lens`; gp-2; gp-9; scenarios `dsd-policy-change`, `dsd-accessible-form` | Use |
| 2.5 Using evidence | `ipe-33-responsible-data-evaluation`; `outcomes-not-intentions`; measurement worksheet; scenario `dsd-small-group-data` | Use |
| 2.6 Advising a decision owner | The "connect equity with workforce decisions" capability; lesson 5 of `di-capstone-remove-a-real-barrier`; lesson 4 of `ipe-capstone-intercultural-practice` | Revise |

### Pathway 3: Leading a team

| Module | Existing assets | Treatment |
| --- | --- | --- |
| 3.1 Hiring and welcoming | Life-cycle stages design to onboard; `job-design-and-the-posting`; `sourcing-and-outreach`; `screening-and-selection`; `onboarding-and-first-90-days`; gp-6; scenario `dsd-hiring-panel` | Use |
| 3.2 Psychological safety and team culture | `ipe-29-reflective-team`; `gc-respectful-workplace`; `di-inclusive-supervision-and-team-culture`; `culture-without-theater`; gp-4; `lm-psychological-safety-and-repair`; scenario `dsd-team-silence` | Use |
| 3.3 Coaching and feedback | `performance-and-development`; `dsd-13-coaching-direct-support`; `gc-new-supervisor-inclusive-leadership`; `div-i07-gender-double-binds` | Adapt |
| 3.4 Delegation and opportunity | `div-a07-networks-opportunity-hoarding`; `gc-new-supervisor-inclusive-leadership` lesson 1; scenario `dsd-advancement-conversation` | Adapt |
| 3.5 Conflict and repair | `conflict-at-work`; `ipe-26-power-conflict-repair`; `ipe-36-leading-difficult-dialogue`; `di-conflict-resolution-and-neurodiversity`; scenario `dsd-repair-after-harm` | Use or adapt |
| 3.6 Workload, well-being, and staying | `gc-sustaining-the-work`; `stay-and-exit-interviews`; `gc-remote-hybrid-equity`; life-cycle stage retain; Amplify well-being; `pn-stay-interviews-and-retention` | Adapt |

### Pathway 4: Leading across teams

| Module | Existing assets | Treatment |
| --- | --- | --- |
| 4.1 Strategy and priorities | `equity-inclusion-leadership-and-systems`; `gc-equity-committee-roles` | New |
| 4.2 Resourcing and budget | `ipe-37-resource-allocation-equity`; `di-governance-accountability-resourcing`; gp-10; Toolkit Studio cases `interpreter-budget`, `grant-rfp` | Adapt |
| 4.3 Leading change | `change-management-bringing-people-along`; `di-change-management-and-implementation`; `dsd-leading-system-change` | Adapt |
| 4.4 Developing supervisors | `gc-new-supervisor-inclusive-leadership`; `facilitators-guide-equity-inclusion-curriculum`; gp-5 | Revise |
| 4.5 Accessibility as a management duty | `accessibility-as-leadership-responsibility`; `gc-accommodation-transitions`; gp-11; `pn-accessible-leadership-pathways`; scenario `dsd-accommodation-cliff` | Use |
| 4.6 Advising upward and deciding | `ipe-27-ethical-decision-making`; gp-7; scenario `dsd-leadership-bottleneck` | Adapt |

### Pathway 5: Leading the division

| Module | Existing assets | Treatment |
| --- | --- | --- |
| 5.1 Vision and culture | `culture-without-theater`; `ipe-31-inclusive-workforce-culture`; `idi-integration` | New |
| 5.2 Governance and accountability | `di-governance-accountability-resourcing`; `ipe-30-policy-procedure-governance`; `ipe-32-complaints-incident-learning`; `di-measuring-culture-and-sustained-progress` | Adapt |
| 5.3 Partnership beyond the division | `ipe-15-stakeholder-partnership`; `ipe-34-co-design-partnership`; `pn-partnership-spine` | Adapt |
| 5.4 Removing a structural barrier | `gc-structural-racism`; `di-capstone-remove-a-real-barrier`; `ipe-capstone-intercultural-practice` | Adapt |
| 5.5 Continuity and succession | Continuity tool; life-cycle stages succession and transition; `gc-career-pathways-succession`; `mobility-acting-promotion` | Use |
| 5.6 Stewardship | `pi-equitable-oversight-design`; `ipe-38-sustaining-voluntary-learning` | New |

**Count.** Of 36 modules: 11 use existing material as it is, 17 adapt it, 4 need substantial revision, and 4 are new writing.

---

## 5. Leadership cases already in the application

Ten of the 13 practice scenarios work as leadership cases:

| Scenario | Leadership question it raises |
| --- | --- |
| `dsd-hiring-panel` | A panel keeps choosing the same kind of candidate |
| `dsd-advancement-conversation` | A team member does not know what it takes to advance |
| `dsd-accommodation-cliff` | An accommodation disappears during a leadership rotation |
| `dsd-policy-change` | A policy change goes to leadership next month |
| `dsd-engagement-late` | Input is requested after the decision is effectively final |
| `dsd-report-back` | Listening sessions are done; what returns to participants |
| `dsd-team-silence` | The same three people speak in every meeting |
| `dsd-repair-after-harm` | A comment landed badly and nobody addressed it |
| `dsd-leadership-bottleneck` | Every equity change waits for one approval |
| `dsd-small-group-data` | Data by race would identify a handful of people |

The Toolkit Studio adds decision cases on a grant request, hiring minimums, a listening session, a disparity dashboard, and an interpreter budget.

---

## 6. Practice paths that become leadership applications

| Path | Title | Module |
| --- | --- | --- |
| gp-2 | Policy, form, or notice change | 2.4 |
| gp-3 | Community engagement or co-design effort | 2.3, 5.3 |
| gp-4 | Workplace culture and team climate | 3.2 |
| gp-5 | Planning a learning or facilitation session | 4.4 |
| gp-6 | Inclusive hiring and selection | 3.1 |
| gp-7 | Equity analysis for a decision | C5, 4.6 |
| gp-8 | Accessible and culturally responsive meeting | 1.3, 4.5 |
| gp-9 | Reviewing a draft for equity, access, and plain language | 2.4 |
| gp-10 | Procurement or contract equity review | 4.2 |
| gp-11 | Leadership pathway or sponsorship plan for staff with disabilities | 4.5, 5.5 |
| gp-12 | Equity Pause for a routine decision | C5 |
| gp-13 | Checking your own material for access, assumptions, and tone | 1.2 |

Each path already has a work product, a self-check, and saving on the device.

---

## 7. What needs care before reuse

**Material that defers to the Office of Indian Affairs and the DHS tribal offices.** The following touch Native American communities or Tribal Nations and are not to be adapted, excerpted, or expanded by this program:

- Courses `cultural-intelligence-tribal`, `cultural-intelligence-native-american`, `cultural-intelligence-alaska-native`, and `ipe-20-tribal-sovereignty`.
- Lesson 3 of `dsd-leading-system-change`; one lesson each in `gc-faith-in-minnesota` and `how-it-shows-up-in-minnesota-human-services`.
- The Tribal Nations community brief and the Toolkit Studio case `tribal-deadline`.
- Passages in `change-management-bringing-people-along`, `employment-first-and-economic-inclusion`, `ipe-15-stakeholder-partnership`, `gc-equity-committee-roles`, and the two capstone courses. These need a text pass before any lesson from them is placed in a pathway.

**Templated text.** All 45 recovered program-authored courses, including every recovered leadership course, give each lesson the same closing "applied next step" sentence, and their transfer choices are templated. The lesson bodies may be sound; the endings need rewriting when a lesson is adapted. This matches the finding already recorded in the learning coordination document. It was detected from repeated text and is not a review of lesson quality.

**Link form.** The leadership page links practice notes at `/resources/…` while the source register lists them at `/library/…`. Both are meant to keep working; confirm when adding links.

---

## 8. Mechanisms the leadership section reuses

| Need | Existing mechanism |
| --- | --- |
| Editable pages | Editable surfaces registered in the staff surface registry |
| Shared and division content | Scope policy: inheritable, agencywide, or division. The division view reads agencywide content; the reverse is not true |
| Saving on the device | The browser storage helpers; each new key is registered so "clear my data" removes it |
| Downloads | The download catalog already has a leadership kind; documents export as Word, PDF, slides, spreadsheet, or text |
| ASK | Indexes registered editable surfaces with static routes, and each course lesson |
| Navigation | The route list has One DSD and the Team but no leadership entry; the page is reached through links |
| Tests | Existing suites for the development studio, life-cycle tools, DSD pages, surfaces, downloads, and storage failure |

**Consequence for the build.** Registering the leadership pages as editable surfaces does three things at once: the owner can edit them in place, ASK can route to them, and they follow the existing scope rules.
