# Knowledge architecture: stage one and the staged plan

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Owner direction, November 11, 2026.** Apply the three-layer agent architecture, the Learning Navigator, the five domains, and the tagging scheme to the whole of both People, Access and Culture applications, refactoring where needed.

**Request.** Build the architecture across both applications. **Purpose.** One content model and one front door for the whole program, so guidance, pathways, and upkeep work the same way everywhere. **Completion evidence.** Each stage names its tests and receipts; a stage is done only when they pass. **Quality criteria.** Existing addresses and saved work keep working; original sources are preserved; no tag ever describes a person.

The assessment this follows is `LEADERSHIP-AGENT-ARCHITECTURE-ASSESSMENT-2026-11-11.md`.

---

## 1. What stage one delivered

Local work only. Nothing is published or deployed, and no staff page changed.

| Delivered | Where |
| --- | --- |
| The controlled vocabulary: five domains, six leadership scopes, six orientations, three activities, four kinds of context, 21 competencies | `lib/content/knowledge/vocabulary.ts` |
| The tag schema, with validation | `lib/content/knowledge/schema.ts` |
| First-pass tags for all 240 courses | `lib/content/knowledge/course-tags.json` |
| Tags for all 13 practice paths, 13 DSD practice scenarios, 10 life-cycle stages, and 5 tools | `lib/content/knowledge/resource-tags.ts` |
| Lookup functions that respect publication, setting, and deferral | `lib/content/knowledge/index.ts` |
| Tests | `tests/knowledge-tags.test.ts` |

### Tags are facets, not a tree

Each resource carries a set of tags. A resource can sit in more than one domain, scope, and orientation.

| Facet | Values |
| --- | --- |
| Domain | Intercultural Fluency; Leadership Effectiveness; Human-Centered Communication; Systems Leadership; Organizational Stewardship |
| Leadership scope | For everyone; leading yourself; a program; a team; across teams; the organization |
| Orientation | Denial; Polarization; Minimization; Acceptance; Adaptation; Integration. Set only when the content addresses that orientation's work |
| Competency | 21, four or five per domain; each must belong to a domain the resource is tagged with |
| Context | Community; service and program knowledge; policy and official sources; workforce and employee life cycle |
| Activity | Learn; practice; reflect |
| Setting | Shared, or DSD |
| Deferral | None; partial; whole |

**Tags describe content. They never describe a person.** The code says so at the top of the vocabulary file.

### Two additions to the proposal

1. **Context.** The five proposed domains were written for leadership development. The applications also hold a large body of community profiles and disability services knowledge that fits them loosely. A separate context facet records that honestly instead of forcing a domain.
2. **Setting.** Shared content serves any organization. DSD content (scenarios, life-cycle examples) is marked as that setting's own, which keeps it out of the agencywide view and keeps the program independent of any one agency.

### What the first pass found

| Facet | Count of the 240 courses |
| --- | --- |
| Intercultural Fluency | 103 |
| Systems Leadership | 91 |
| Organizational Stewardship | 81 |
| Human-Centered Communication | 68 |
| Leadership Effectiveness | 48 |
| For everyone | 199 |
| Leading a program | 53 |
| Leading a team | 49 |
| Leading yourself | 35 |
| Leading across teams | 26 |
| Leading the organization | 14 |
| Any orientation | 11 courses carry one; every orientation has at least one |

Courses can carry more than one domain and scope, so the columns do not sum to 240.

Two things this shows. Leadership Effectiveness is the thinnest domain, and content for leading the organization is the thinnest scope: 14 courses. That agrees with the earlier finding that pathway 5 needs the most new writing.

### Deferred content

| Deferral | Courses | Treatment in code |
| --- | --- | --- |
| Whole | 4: the three Native American, Alaska Native, and Tribal community courses, and the tribal sovereignty course | Never returned by a search, whatever the filter. Tested |
| Partial | 10: courses with a lesson or passages that touch Tribal Nations or Native American communities | Still openable; marked as needing a text pass, and excluded from authoring work until one is done. Tested |

Three of the partial marks are cautious calls on thin evidence (a faith course's "traditional healing and ceremony" lesson, a course title containing "2S", and a framework course flagged by keyword). They need the owner's eye.

---

## 2. How far the first pass can be trusted

- **Course tags were produced from titles and lesson titles only**, by four agent passes working from one written rule set. No lesson body was read. The file records this: basis "titles", produced by "agent-first-pass", owner reviewed "false". A test fails if that record is changed without a review.
- **Tags for paths, scenarios, stages, and tools** were written from each resource's own definition.
- **Lessons are not yet tagged.** The 1,415 lessons still carry no tags of their own. That is stage two.
- **The competency list is proposed.** It combines the five intercultural practices and the seven existing development capabilities with nine more. It is one data file; changing it is simple, and the tests follow.
- **Sixteen courses had titles too thin to tag with confidence**, including several community profiles with generic lesson titles. They are tagged with a best fit and should be among the first reviewed.

---

## 2a. Stage two, first part: lesson tags

Added after stage one, the same day. Local work only.

| Delivered | Where |
| --- | --- |
| First-pass tags for 609 lessons across 135 courses | `lib/content/knowledge/lesson-tags.json` |
| Lesson lookups by competency, orientation, and the scope and domain of the lesson's course | `findLessons` in `lib/content/knowledge/index.ts` |
| Three more tests, 16 in all | `tests/knowledge-tags.test.ts` |

**Which lessons.** Every lesson of every course that carries a leadership scope, plus the intercultural courses that are not community profiles. Deferred courses are excluded. The remaining 806 lessons, mostly community profiles and service knowledge, are not yet tagged.

**What each lesson carries.** One or two competencies, any orientation it addresses, and its activities.

**What it showed.**

- Every one of the 21 competencies and all six orientations has at least one lesson.
- 59 lessons address an orientation: Minimization 22, Acceptance 18, Adaptation 16, Polarization 9, Denial 5, Integration 4.
- The thinnest competencies are "bridge across difference" and "share knowledge and build future capability," with 9 lessons each.
- All 609 lessons include a scenario, so each has practice built in. **None has a reflection block.** Reflection today comes from separate tools, not from the lessons. The long-term design's reflection step will need to be added to lessons or attached beside them.

**Trust.** Tagged from lesson titles and one-sentence summaries only, by four agent passes. Recorded as not owner-reviewed. About 60 lessons were flagged as too thin to tag with confidence, chiefly 26 lessons in two community courses with templated summaries, ten regional overview lessons, and several service-knowledge lessons that fit the vocabulary loosely.

**Still to do in stage two.** The owner's review of first-pass tags and the competency list; tags for the remaining lessons.

---

## 3. Verification

Environment: local, Node 24.14.0, npm 11.9.0, static content source.

| Check | Result |
| --- | --- |
| `tests/knowledge-tags.test.ts` | 16 of 16 passed, including the lesson tags |
| ESLint on the new files | Passed |
| TypeScript, whole project | Passed |
| Full test suite, 232 files | 210 files passed, 4 skipped, 18 failed. 1,896 tests passed, 128 skipped, 3 failed |

**The 18 failing files are not caused by this change.**

- **16 are PostgreSQL integration suites.** Each failed at setup because a local test database could not be started in this environment (`initdb failed`). They did not reach their tests.
- **3 tests fail on the unchanged main branch as well.** They were run there to confirm: `editable-surface-migration`, `page-copy-migration`, and `page-copy-full-chain`. They compare the site header and Home headline against pinned history, and differ on the program name (`programName`, and "Program" in the third headline line). That points to the recent program-name commits. They need their own fix and are not addressed here.

One setup note: installing dependencies needed an optional GPU download to be skipped for one package, because this environment dropped the connection to its host. The CPU build, which the application uses, installed normally.

---

## 4. The staged plan

Each stage is done only when its own tests and checks pass. Order matters: later stages depend on earlier ones.

| Stage | Work | Serves |
| --- | --- | --- |
| **1. Content model** | Vocabulary, schema, first-pass tags, lookups, tests | Both applications. **Done locally** |
| **2. Lesson tags and review** | Tag lessons for the leadership and intercultural content first; owner review of first-pass course tags; resolve thin and cautious items | Both |
| **3. Views from tags** | Compute the existing themes and browse views from tags, keeping every current address working | Both |
| **4. Leadership section** | Entry, core, pathways, and intercultural strand pages from tagged content; registered so they are editable in place and reachable through ASK | DSD first; shared lessons agencywide |
| **5. ASK as the Navigator** | Recommendations from tags; leadership and intercultural guidance in one reasoning step; a next step on every answer; a notice that questions are recorded | Both |
| **6. Specialists and the authoring chain** | New agents in the registry with evaluation cases; background chain with receipts; the quality check reporting to the owner | Both |
| **7. The learner's journey** | One on-device record across courses, paths, notes, and reflections; an explicit choice to include it in a question | Both |
| **8. Evaluation and release** | Evaluation runs; browser checks; the deployment pathway in `DEPLOY.md` when the owner directs | Both |

### What each stage must protect

- Existing addresses for learning, library, resources, and courses.
- Anything already saved on a person's device.
- Original source material and recovered course history.
- The existing test suite.
- The standing rules: no tracking or scoring of people, the owner as final authority, no certificates in this setting, deference on Native American and Tribal content.

---

## 5. Decisions the next stages need

| # | Decision | Needed for | Recommendation |
| --- | --- | --- | --- |
| 1 | Confirm or change the 21 competencies | Stage 2 | Review the list in `vocabulary.ts`; it is easy to change now and costly later |
| 2 | Confirm the context facet and the "for everyone" scope | Stage 2 | Keep both |
| 3 | Who reviews first-pass tags, and how much | Stage 2 | The owner spot-checks the thin and cautious items and a sample of the rest |
| 4 | Wording that tells a person their question is recorded | Stage 5 | One sentence at the question box |
| 5 | Wording for including one's own journey in a question | Stage 7 | A clear, optional choice each time |
