# Leadership journey: what is built

November 11, 2026. Internal program and implementation guidance. This document is not staff-facing copy.

**Owner direction, November 11, 2026.** Make sure the leadership program is fully built.

Local work only. Nothing is published to a database or deployed.

## What a person can now open

| Page | Address | Contents |
| --- | --- | --- |
| Your leadership journey | `/one-dsd/leadership/journey` | How a module works, the core, five pathways, intercultural practice, learning with others |
| Leading with an equity mindset and lens (core) | `/one-dsd/leadership/journey/core` | 6 modules |
| Leading yourself | `…/leading-yourself` | 6 modules |
| Leading a program | `…/leading-a-program` | 6 modules |
| Leading a team | `…/leading-a-team` | 6 modules |
| Leading across teams | `…/leading-across-teams` | 6 modules |
| Leading the division | `…/leading-the-division` | 6 modules |
| Intercultural practice | `…/intercultural-practice` | 24 units in three parts: Ground, Practice, Extend |

That is 60 modules. Each one has its question, what a person can do afterwards, something to try in real work, the lessons and practice tools to open, related lessons, and a link to reflect.

The existing leadership page stays as it was and now opens with a link to the journey.

## How it is built

- **Content** is in `lib/content/leadership-journey.ts`. Every module names existing courses, practice paths, scenarios, and tools. Nothing was copied or rewritten: the pages link to the lessons already in the program.
- **Only published resources appear.** A course is listed only if it is published in the division view.
- **Related lessons** come from the lesson tags, limited to lessons that share the module's subject.
- **Each page is an editable page**, so the owner can change its title and introduction in place, and ASK can route people to it. The eight pages are registered and approved in code until a revision is published.
- **Division setting.** The pages are division content: ASK reaches them in the One DSD view and not in the agencywide view.

## Verification

Local, Node 24.14.0, static content source, One DSD view.

| Check | Result |
| --- | --- |
| Content tests (`tests/leadership-journey.test.ts`) | 6 passed: structure; every course real and not deferred; every link address real; staff voice check on all copy; pages registered; ASK reaches them in the division view only |
| Pages in a browser | All 8 pages loaded with no page errors. Every one of the 60 modules showed at least one resource |
| Links | All 209 links on the pathway pages opened |
| Phone width (390 px) | No sideways scrolling |
| TypeScript and ESLint | Passed |

## What is not built yet

- **Module lessons of their own.** A module points to existing lessons; it does not yet have a short lesson written specifically for it. Four modules rest on thin material: purpose and values, strategy and priorities, vision and culture, and stewardship.
- **"Start here" and "go further" lessons** for new and experienced leaders.
- **Reflection inside the module.** The reflect link opens the existing practice notebook. A journal with the six reflection types and return points is not built.
- **Saving on the device** for the development map, and the portfolio export.
- **Conversation guides, transition guides, the supervisor guide, and the pacing guides.**
- **A download** of the journey pages.
- **The agencywide version.** The shared lessons are available in both views; the journey pages themselves are division content for now.
- **Related lessons are a first pass** and some matches are loose.
- An unknown pathway address shows the site's page-not-found screen, as other pages in this application do.
