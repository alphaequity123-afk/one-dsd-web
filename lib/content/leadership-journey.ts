import type { CompetencyId, ScopeId } from "@/lib/content/knowledge";
import { defineEditableSurface, type EditableSurfaceDefinition } from "./editable-surface-contract";

/**
 * The leadership program: a common core, five pathways by scope of leadership work,
 * and an intercultural strand. Each module names existing resources by id; a page
 * shows only those published in the reader's view.
 */

export type JourneyLink = { label: string; href: string };

export type JourneyModule = {
  id: string;
  title: string;
  /** The question the module turns on. */
  question: string;
  /** What a person can do after it. */
  youCan: string;
  /** Something to try in real work. */
  tryThis: string;
  competencies: CompetencyId[];
  courses: string[];
  links?: JourneyLink[];
};

export type JourneyPathway = {
  id: string;
  title: string;
  /** Who it is written for. */
  audience: string;
  question: string;
  intro: string;
  scope?: ScopeId;
  modules: JourneyModule[];
};

const path = (id: string, label: string): JourneyLink => ({ label, href: `/practice/${id}` });
const scenario = (id: string, label: string): JourneyLink => ({ label, href: `/one-dsd/scenarios/${id}` });
const stage = (id: string, label: string): JourneyLink => ({ label, href: `/one-dsd/leadership?stage=${id}#life-cycle` });

export const JOURNEY_CORE: JourneyPathway = {
  id: "core",
  title: "Leading with an equity mindset and lens",
  audience: "Everyone, in any role",
  question: "What does equity ask of anyone who leads here?",
  intro: "Six modules that every pathway builds on. They cover why equity belongs at the center of leadership in public service, how to see your own starting point, and how to bring an equity lens to a real decision.",
  modules: [
    { id: "c1", title: "Why equity belongs at the center of leadership", question: "Who benefits from the decisions I am part of?",
      youCan: "Explain in your own words why a leader in disability services is responsible for who a decision serves well and who it does not.",
      tryThis: "Write one paragraph about a recent decision: who it worked for, and who had to work around it.",
      competencies: ["purpose-accountability", "equity-analysis"], courses: ["equity-centered-leadership", "equity-inclusion-leadership-and-systems", "di-leadership-case-for-inclusion"] },
    { id: "c2", title: "The intercultural continuum as a map", question: "How does a team respond to difference in its ordinary routines?",
      youCan: "Describe each of the six orientations as it shows up in everyday practice.",
      tryThis: "Choose one routine, such as how meetings run, and describe which orientation it reflects.",
      competencies: ["own-culture", "shift-perspective"], courses: ["intercultural-competence-without-a-score", "idi-denial", "idi-polarization", "idi-minimization", "idi-acceptance", "idi-adaptation", "idi-integration"] },
    { id: "c3", title: "Your own default", question: "What am I treating as the normal way, and where did I learn it?",
      youCan: "Name one norm you have treated as neutral, and who has had to adapt to it.",
      tryThis: "Notice one moment this month when your preferred way of working was treated as the standard.",
      competencies: ["own-culture"], courses: ["div-f04-cultural-values", "div-f08-ethnocentrism", "div-a02-whiteness-institutional-norm"],
      links: [{ label: "Start a development map", href: "/one-dsd/leadership#starting-points" }] },
    { id: "c4", title: "Five questions for any leadership moment", question: "What would curiosity, perspective, communication, evidence, and reflection each add here?",
      youCan: "Work through the five questions on one decision from your own work.",
      tryThis: "Pick a decision in front of you and write one sentence under each of the five questions.",
      competencies: ["observe-interpret", "shift-perspective", "adapt-behavior"], courses: [],
      links: [{ label: "Learning across difference: five focuses", href: "/learn/intercultural" }] },
    { id: "c5", title: "The equity lens on a decision", question: "Who decides, what do we know, and what does an equity analysis show?",
      youCan: "Take a real decision through an equity analysis and say who holds the decision.",
      tryThis: "Use the Equity Pause on one routine decision this week.",
      competencies: ["equity-analysis", "evidence"], courses: ["dhs-equity-analysis-toolkit"],
      links: [{ label: "Equity Analysis Toolkit companion", href: "/learn/equity-toolkit" }, path("gp-12", "Equity Pause for a routine decision"), path("gp-7", "Equity analysis for a decision")] },
    { id: "c6", title: "The people we serve", question: "What do presuming competence, dignity of risk, and self-determination ask of a leader?",
      youCan: "Explain each of the three commitments and one thing it changes about how you lead.",
      tryThis: "Check one current practice against the three commitments and note what you would change.",
      competencies: ["build-access", "partner"], courses: ["dsd-03-self-direction-independent-living", "dsd-12-communication-methods", "di-access-needs-and-individualized-support", "ipe-04-person-centered-systems"] },
  ],
};

export const JOURNEY_PATHWAYS: JourneyPathway[] = [
  {
    id: "leading-yourself", title: "Leading yourself", scope: "yourself",
    audience: "Staff exploring leadership, whether you stepped forward yourself or someone encouraged you",
    question: "What kind of leader do I want to be, and what do I treat as the default?",
    intro: "Leadership starts as a practice, well before a title. This pathway is about your own purpose, awareness, and influence in the role you hold now.",
    modules: [
      { id: "1-1", title: "Purpose and values", question: "Whose interests does my idea of a good leader serve?",
        youCan: "State a leadership purpose that names who it is for.",
        tryThis: "Write your purpose in three sentences: what you want to change, for whom, and why you.",
        competencies: ["purpose-accountability", "own-culture"], courses: ["div-f04-cultural-values"] },
      { id: "1-2", title: "Self-awareness", question: "When am I least curious, and about whom?",
        youCan: "Separate what you observed from what you assumed in a recent interaction.",
        tryThis: "After one conversation this week, write what was said and done, then separately what you concluded.",
        competencies: ["observe-interpret", "own-culture"], courses: ["div-f05-implicit-bias-iat", "idi-minimization"],
        links: [path("gp-13", "Checking your own material for access, assumptions, and tone")] },
      { id: "1-3", title: "Communication and listening", question: "Who finds it easy to be heard by me?",
        youCan: "Offer more than one way to contribute, and check what people understood.",
        tryThis: "In your next meeting or handoff, add one other way for people to take part.",
        competencies: ["listen-inquire", "adapt-behavior"], courses: ["intercultural-conflict-styles", "ipe-06-accessible-communication", "di-inclusive-communication"],
        links: [path("gp-8", "Accessible and culturally responsive meeting")] },
      { id: "1-4", title: "Accountability and ethics", question: "Accountable to whom, and who can tell me I am wrong?",
        youCan: "Describe a mistake and its effect on someone else without defending it.",
        tryThis: "Think of one thing that landed badly. Decide what repair is yours to make, and make it.",
        competencies: ["purpose-accountability", "conflict-repair"], courses: ["ipe-27-ethical-decision-making", "div-i10-receiving-feedback", "div-a06-restorative-identity-harm"] },
      { id: "1-5", title: "Influence without a title", question: "Whose ideas get credited, and can I change that?",
        youCan: "Bring a colleague's overlooked contribution into a decision.",
        tryThis: "Name a colleague's idea out loud, with their name on it, in the room where it matters.",
        competencies: ["inclusive-teams", "facilitate"], courses: ["equity-champion-contribution-workflow"],
        links: [stage("everyday", "Support everyday contribution")] },
      { id: "1-6", title: "Planning your development", question: "What opportunity can I reach, and what is in the way?",
        youCan: "Complete a development map and name the support you need.",
        tryThis: "Bring your map to one conversation with a mentor, sponsor, or supervisor.",
        competencies: ["develop-others", "purpose-accountability"], courses: ["career-mentorship-and-sponsorship", "gc-career-pathways-succession"],
        links: [{ label: "Your development map", href: "/one-dsd/leadership#starting-points" }, { label: "Mentoring and peer learning", href: "/one-dsd/amplify/mentoring" }] },
    ],
  },
  {
    id: "leading-a-program", title: "Leading a program", scope: "program",
    audience: "Program leads, new or experienced, who guide work without supervising the people who do it",
    question: "How do I improve access and culture in work I guide but do not supervise?",
    intro: "Program leadership runs on influence, evidence, and partnership. This pathway is about seeing where a process loses people and bringing the right voices to the person who decides.",
    modules: [
      { id: "2-1", title: "Seeing the system", question: "Where does this process lose people, and which people?",
        youCan: "Map a process and mark where access fails.",
        tryThis: "Trace one service path from first contact to outcome and mark each point where someone could drop out.",
        competencies: ["evidence", "lead-change"], courses: ["ipe-03-public-power", "ipe-28-complex-issue-inquiry", "ipe-19-history-public-institutions"],
        links: [scenario("dsd-service-redesign", "Redesigning an assessment process without adding steps")] },
      { id: "2-2", title: "Leading without formal authority", question: "Whose agreement do I seek first, and whose last?",
        youCan: "Identify the person who decides and the people affected before proposing a change.",
        tryThis: "For one change you want, list who decides, who is affected, and who you have not yet spoken to.",
        competencies: ["lead-change", "partner"], courses: ["ipe-18-cross-division-coordination"],
        links: [scenario("dsd-leadership-bottleneck", "Every equity change waits for one approval that never comes")] },
      { id: "2-3", title: "Partnership with people affected", question: "Can this engagement still change the decision?",
        youCan: "Say what is open to influence and how a response will return to the people who took part.",
        tryThis: "Before your next engagement, write down what could change as a result and when you will report back.",
        competencies: ["partner", "listen-inquire"], courses: ["ipe-34-co-design-partnership"],
        links: [path("gp-3", "Community engagement or co-design effort"), scenario("dsd-engagement-late", "Community input requested after the decision is effectively final"), scenario("dsd-report-back", "Listening sessions are done. Now what?")] },
      { id: "2-4", title: "Policy, forms, and notices", question: "Who can use this as it is written?",
        youCan: "Review a document for plain language and access.",
        tryThis: "Take one notice or form and revise it so a first-time reader can act on it.",
        competencies: ["accessible-communication", "build-access"], courses: ["ipe-12-policy-writing-equity-lens"],
        links: [path("gp-2", "Policy, form, or notice change"), path("gp-9", "Reviewing a draft for equity, access, and plain language"), scenario("dsd-accessible-form", "A required form cannot be completed with a screen reader")] },
      { id: "2-5", title: "Using evidence", question: "What does the total hide?",
        youCan: "Tell apart what was delivered, what was applied, and what benefit was seen, and say what the evidence cannot show.",
        tryThis: "Write a short measurement note for one piece of work, including its limits.",
        competencies: ["evidence"], courses: ["ipe-33-responsible-data-evaluation", "outcomes-not-intentions"],
        links: [{ label: "Measurement worksheet", href: "/practice/measurement" }, scenario("dsd-small-group-data", "Service data by race would identify a handful of people")] },
      { id: "2-6", title: "Advising the person who decides", question: "Have I shown the tradeoffs, including who bears them?",
        youCan: "Prepare an options brief that includes affected perspectives and a way to learn from the decision.",
        tryThis: "Draft a one-page brief with two or three options, who each one costs, and what you recommend.",
        competencies: ["equity-analysis", "purpose-accountability"], courses: ["di-capstone-remove-a-real-barrier"],
        links: [path("gp-7", "Equity analysis for a decision"), scenario("dsd-policy-change", "A waiver policy change is going to leadership next month")] },
    ],
  },
  {
    id: "leading-a-team", title: "Leading a team", scope: "team",
    audience: "Supervisors, new or experienced",
    question: "How do we work so that different colleagues can contribute and the people we serve are served well?",
    intro: "Supervising means creating the conditions for other people's work. This pathway follows the decisions a supervisor makes every week: who is hired, who is heard, who gets the next opportunity, and who stays.",
    modules: [
      { id: "3-1", title: "Hiring and welcoming", question: "What does the work require, and what is only familiar?",
        youCan: "Tie each selection criterion to a duty, and separate evidence from impression.",
        tryThis: "Review one posting or interview guide with your hiring and HR partners.",
        competencies: ["inclusive-teams", "observe-interpret"], courses: ["job-design-and-the-posting", "screening-and-selection", "onboarding-and-first-90-days"],
        links: [path("gp-6", "Inclusive hiring and selection"), scenario("dsd-hiring-panel", "A hiring panel keeps choosing the same kind of candidate"), stage("interview", "Interview and assess fairly")] },
      { id: "3-2", title: "Team culture and safety to speak", question: "Who pays a price for disagreeing here?",
        youCan: "Describe your team's default and one routine that would change it.",
        tryThis: "Change one meeting routine so more than the usual voices shape the outcome.",
        competencies: ["inclusive-teams", "facilitate"], courses: ["ipe-29-reflective-team", "gc-respectful-workplace", "di-inclusive-supervision-and-team-culture", "teams-in-minimization"],
        links: [path("gp-4", "Workplace culture and team climate"), scenario("dsd-team-silence", "The same three people speak in every team meeting")] },
      { id: "3-3", title: "Coaching and feedback", question: "Is my feedback about the work, or about a style I prefer?",
        youCan: "Give specific feedback tied to the work, and ask what conditions would help.",
        tryThis: "Hold one coaching conversation that ends with what you will do differently as the supervisor.",
        competencies: ["coach-feedback"], courses: ["performance-and-development", "dsd-13-coaching-direct-support", "gc-new-supervisor-inclusive-leadership"] },
      { id: "3-4", title: "Delegation and opportunity", question: "Who gets the stretch work?",
        youCan: "Make one opportunity visible to everyone, with clear criteria and support.",
        tryThis: "Before your next assignment, write down who you would normally ask and one person you have never asked.",
        competencies: ["develop-others"], courses: ["div-a07-networks-opportunity-hoarding", "career-mentorship-and-sponsorship"],
        links: [scenario("dsd-advancement-conversation", "A team member says they do not know what it takes to advance"), stage("develop", "Mentor, sponsor, and develop")] },
      { id: "3-5", title: "Conflict and repair", question: "Whose comfort is the resolution protecting?",
        youCan: "Tell a matter for conversation from one that belongs in a formal process.",
        tryThis: "Prepare for one conversation you have been putting off, including what you will ask and what you will not decide alone.",
        competencies: ["conflict-repair"], courses: ["conflict-at-work", "ipe-26-power-conflict-repair", "ipe-36-leading-difficult-dialogue", "di-conflict-resolution-and-neurodiversity"],
        links: [scenario("dsd-repair-after-harm", "A comment in a meeting landed badly and nobody addressed it")] },
      { id: "3-6", title: "Workload, well-being, and staying", question: "What would make it easier to stay and do good work?",
        youCan: "Hold a stay conversation, agree what is recorded, and respond to one concern.",
        tryThis: "Ask one colleague what supports their work, then return to them with what you did about it.",
        competencies: ["listen-inquire", "inclusive-teams"], courses: ["stay-and-exit-interviews", "gc-sustaining-the-work", "gc-remote-hybrid-equity"],
        links: [stage("retain", "Listen, respond, and sustain"), { label: "Room to recharge", href: "/one-dsd/amplify/well-being" }] },
    ],
  },
  {
    id: "leading-across-teams", title: "Leading across teams", scope: "across-teams",
    audience: "Managers, including deputy and assistant directors, new or experienced",
    question: "How do resourcing, workforce, and governance decisions carry equity across the teams I am responsible for?",
    intro: "Managing means leading through other leaders. This pathway is about priorities, resources, change, and the support your supervisors need in order to give the same to their teams.",
    modules: [
      { id: "4-1", title: "Strategy and priorities", question: "Who benefits first from what we chose to do first?",
        youCan: "Show how a priority affects different groups of staff and people served.",
        tryThis: "Annotate your current priority list with who each item serves soonest and who waits.",
        competencies: ["equity-analysis", "govern-resource"], courses: ["equity-inclusion-leadership-and-systems"] },
      { id: "4-2", title: "Resources and budget", question: "Where does a cut or a delay land?",
        youCan: "Run an equity analysis on one resourcing choice.",
        tryThis: "Take one budget or staffing tradeoff through the equity analysis before you decide.",
        competencies: ["govern-resource", "equity-analysis"], courses: ["ipe-37-resource-allocation-equity", "di-governance-accountability-resourcing"],
        links: [path("gp-10", "Procurement or contract equity review"), path("gp-7", "Equity analysis for a decision")] },
      { id: "4-3", title: "Leading change", question: "Who is asked to adapt, and who is not?",
        youCan: "Plan a change that says what is open to influence and how you will report back.",
        tryThis: "Write a one-page change plan that names who adapts, what support they get, and when you will return to them.",
        competencies: ["lead-change"], courses: ["di-change-management-and-implementation"],
        links: [scenario("dsd-service-redesign", "Redesigning an assessment process without adding steps")] },
      { id: "4-4", title: "Developing supervisors", question: "Do my supervisors get the support I expect them to give?",
        youCan: "Review how development is offered across your teams.",
        tryThis: "Ask each supervisor what they need in order to coach well, and act on one answer.",
        competencies: ["develop-others", "coach-feedback"], courses: ["gc-new-supervisor-inclusive-leadership", "facilitators-guide-equity-inclusion-curriculum"],
        links: [path("gp-5", "Planning a learning or facilitation session")] },
      { id: "4-5", title: "Accessibility as a management duty", question: "Is access built in, or requested each time?",
        youCan: "Find a place where access depends on a person asking for it.",
        tryThis: "Change one process so the access is there before anyone has to request it.",
        competencies: ["build-access"], courses: ["accessibility-as-leadership-responsibility", "gc-accommodation-transitions"],
        links: [path("gp-11", "Leadership pathway or sponsorship plan for staff with disabilities"), scenario("dsd-accommodation-cliff", "An accommodation disappears during a leadership rotation"), { label: "Accessible leadership pathways", href: "/resources/pn-accessible-leadership-pathways" }] },
      { id: "4-6", title: "Advising upward and deciding", question: "What did I leave out because it was uncomfortable?",
        youCan: "Use an options brief from someone else, and explain your decision back to the people it affects.",
        tryThis: "After your next decision, tell the people affected what you decided, why, and what you will watch.",
        competencies: ["purpose-accountability", "equity-analysis"], courses: ["ipe-27-ethical-decision-making"],
        links: [scenario("dsd-leadership-bottleneck", "Every equity change waits for one approval that never comes")] },
    ],
  },
  {
    id: "leading-the-division", title: "Leading the division", scope: "organization",
    audience: "Directors, new or experienced",
    question: "What culture and access are we building, and who has a fair chance to carry the work forward?",
    intro: "Directing means holding the whole division's culture and its future. This pathway is about what the division rewards, how it answers for itself, and what will remain when its leaders change.",
    modules: [
      { id: "5-1", title: "Vision and culture", question: "What do we reward in practice?",
        youCan: "Compare the division's stated values with what is recognized and resourced.",
        tryThis: "List three things the division says it values and what it last did to reward each.",
        competencies: ["sustain-culture"], courses: ["culture-without-theater", "ipe-31-inclusive-workforce-culture", "idi-integration"] },
      { id: "5-2", title: "Governance and accountability", question: "Who can hold us to account, and how do they reach us?",
        youCan: "Describe how a concern from staff or a person served reaches a decision, and how the answer returns.",
        tryThis: "Trace one recent concern from where it was raised to where it was answered.",
        competencies: ["govern-resource", "partner"], courses: ["ipe-30-policy-procedure-governance", "ipe-32-complaints-incident-learning", "di-measuring-culture-and-sustained-progress"] },
      { id: "5-3", title: "Partnership beyond the division", question: "Whose terms is the partnership on?",
        youCan: "Name what each side decides before entering a partnership.",
        tryThis: "Before your next partner meeting, write down what you are prepared to change.",
        competencies: ["partner", "bridge"], courses: ["ipe-34-co-design-partnership"],
        links: [path("gp-3", "Community engagement or co-design effort")] },
      { id: "5-4", title: "Removing a structural barrier", question: "Which rule produces the unequal result?",
        youCan: "Take one barrier through its proper policy route.",
        tryThis: "Choose one barrier you have the authority to remove, and start its official process.",
        competencies: ["lead-change", "equity-analysis"], courses: ["gc-structural-racism", "di-capstone-remove-a-real-barrier"],
        links: [{ label: "Equity Analysis Toolkit companion", href: "/learn/equity-toolkit" }] },
      { id: "5-5", title: "Continuity and succession", question: "Who has a fair chance to learn this work?",
        youCan: "Review a critical function and how its knowledge is shared, without naming a successor.",
        tryThis: "Use the continuity builder on one function that depends on a single person.",
        competencies: ["continuity", "develop-others"], courses: ["gc-career-pathways-succession", "mobility-acting-promotion"],
        links: [{ label: "Continuity builder", href: "/one-dsd/leadership#continuity-plan" }, stage("succession", "Build continuity and future leadership")] },
      { id: "5-6", title: "Stewardship", question: "What will remain when I move on?",
        youCan: "Write a leadership philosophy and a private reflection on what you will leave behind.",
        tryThis: "Write one page: what you want to be true of this division in five years, and what you will do this year toward it.",
        competencies: ["sustain-culture", "continuity"], courses: ["pi-equitable-oversight-design", "ipe-38-sustaining-voluntary-learning"] },
    ],
  },
];

/** The intercultural strand: three parts of eight units, following the continuum. */
export const JOURNEY_INTERCULTURAL: JourneyPathway = {
  id: "intercultural-practice",
  title: "Intercultural practice",
  audience: "Everyone on any pathway",
  question: "How do I notice difference, understand it, and adapt, in myself, my team, and the systems I work in?",
  intro: "A steady course of study that runs beside every pathway. It follows the intercultural continuum from noticing difference, through seeing your own norms, to adapting how you and your processes work. Take one unit a month, or go at your own pace.",
  modules: [
    { id: "i-01", title: "Culture, and your own", question: "What norms do I bring, and where did I learn them?", youCan: "Describe three norms of your own culture and where each was learned.", tryThis: "Write down three things you were taught were simply the right way to do things.", competencies: ["own-culture"], courses: ["div-f04-cultural-values"] },
    { id: "i-02", title: "The continuum", question: "What are the ways people and teams respond to difference?", youCan: "Describe each orientation as a practice.", tryThis: "Match one team routine to the orientation it most reflects.", competencies: ["own-culture", "shift-perspective"], courses: ["intercultural-competence-without-a-score"] },
    { id: "i-03", title: "Noticing Denial", question: "Where does difference go unnoticed in my work?", youCan: "Find one place where difference is not seen or is avoided.", tryThis: "Look at one form or routine and ask who it never mentions.", competencies: ["observe-interpret"], courses: ["idi-denial"] },
    { id: "i-04", title: "Noticing Polarization, in both directions", question: "Where do I judge a difference as better or worse?", youCan: "Recognize an us-and-them judgment of your own, including when you favor another group over your own.", tryThis: "Catch one comparison this week and restate it without the ranking.", competencies: ["observe-interpret", "own-culture"], courses: ["idi-polarization", "from-noticing-to-shifting"] },
    { id: "i-05", title: "What Minimization does, and why it feels fair", question: "How can treating everyone the same produce unequal results?", youCan: "Explain how one standard applied to everyone can serve some people better than others.", tryThis: "Find one rule that is the same for everyone and ask who it fits best.", competencies: ["own-culture", "observe-interpret"], courses: ["idi-minimization", "what-minimization-does-in-dhs-work"] },
    { id: "i-06", title: "Observation, interpretation, evaluation", question: "What did I see, what did I make of it, and how did I judge it?", youCan: "Separate the three in a recent interaction.", tryThis: "Describe one moment in three lines: what happened, what you took it to mean, and what you thought of it.", competencies: ["observe-interpret"], courses: [], links: [{ label: "Begin with curiosity", href: "/learn/intercultural#foundations" }, stage("interview", "Interview and assess fairly")] },
    { id: "i-07", title: "Whose norm is the norm", question: "Who adapts to whom here, and at what cost?", youCan: "Name who adapts in one routine, and what it costs them.", tryThis: "Ask one colleague what they adjust about how they work in order to fit in.", competencies: ["own-culture", "shift-perspective"], courses: ["div-f08-ethnocentrism", "div-a02-whiteness-institutional-norm", "teams-in-minimization"] },
    { id: "i-08", title: "Curiosity and cultural humility as habits", question: "What would I ask if I did not assume?", youCan: "Ask a respectful question where you would once have assumed.", tryThis: "Replace one assumption with a question this week.", competencies: ["listen-inquire", "shift-perspective"], courses: [], links: [{ label: "Make room for different experiences", href: "/learn/intercultural#perspectives" }] },
    { id: "i-09", title: "Acceptance: difference is real", question: "What differences matter in my work, without ranking them?", youCan: "Describe a difference that matters in your work without ranking it.", tryThis: "Describe one colleague's way of working in terms they would recognize.", competencies: ["shift-perspective"], courses: ["idi-acceptance", "acceptance-in-dhs-work"] },
    { id: "i-10", title: "Cultural value patterns, held as questions", question: "How can a framework help me ask, without telling me who someone is?", youCan: "Use a value framework to form a question, and say why it predicts nothing about one person.", tryThis: "Turn one generalization you have heard into a question you could ask.", competencies: ["shift-perspective", "listen-inquire"], courses: ["div-f04-cultural-values", "cq-leading-multicultural-teams"] },
    { id: "i-11", title: "Communication styles", question: "How do I adapt so that I am understood, and so that I understand?", youCan: "Adapt how you communicate to a stated need, and check that it worked.", tryThis: "Ask one person how they prefer to receive information, and use it.", competencies: ["adapt-behavior", "accessible-communication"], courses: ["div-f03-intercultural-communication", "ipe-06-accessible-communication"], links: [{ label: "Adapt how you communicate", href: "/learn/intercultural#communication" }] },
    { id: "i-12", title: "Conflict styles", question: "How do I handle disagreement, and how else do people handle it?", youCan: "Recognize your own conflict style and one unlike it.", tryThis: "In your next disagreement, name the difference in style before the difference in view.", competencies: ["conflict-repair", "adapt-behavior"], courses: ["intercultural-conflict-styles"] },
    { id: "i-13", title: "Shifting perspective", question: "How does this look from where the other person stands?", youCan: "Give an account of a disagreement that the other person would accept as fair.", tryThis: "Write the other side of one disagreement, then check it with them.", competencies: ["shift-perspective"], courses: ["critical-incidents-in-the-work"] },
    { id: "i-14", title: "Adapting without losing yourself", question: "What is the difference between adapting and pretending?", youCan: "Tell adapting from pretending, and name who carries the weight of constant adjustment.", tryThis: "Notice who on your team adjusts most often, and take on one adjustment yourself.", competencies: ["adapt-behavior"], courses: ["idi-adaptation", "div-a05-racial-battle-fatigue"] },
    { id: "i-15", title: "When values conflict", question: "What do I do when respect for difference meets a commitment that cannot bend?", youCan: "Work through a case where two commitments pull in different directions.", tryThis: "Take one hard case to a colleague and reason it through together.", competencies: ["purpose-accountability", "shift-perspective"], courses: ["ipe-27-ethical-decision-making"] },
    { id: "i-16", title: "Disability culture and language access", question: "What changes when I treat disability as culture and identity, and language as access?", youCan: "Explain disability as culture and identity, and adapt one communication for access.", tryThis: "Revise one message so it reaches someone who uses a different language or format.", competencies: ["accessible-communication", "build-access"], courses: ["ipe-02-disability-culture-justice", "ipe-10-language-access"] },
    { id: "i-17", title: "Whose culture is the team's culture", question: "What are our unwritten rules, and who do they fit?", youCan: "Describe your team's unwritten norms and who they fit best.", tryThis: "Ask your team to list three unwritten rules, and who finds each one hardest.", competencies: ["inclusive-teams", "own-culture"], courses: ["teams-in-minimization", "ipe-29-reflective-team"] },
    { id: "i-18", title: "Feedback and coaching across difference", question: "Does my feedback depend on a style I happen to prefer?", youCan: "Give feedback about the work that does not depend on a preferred style.", tryThis: "Rewrite one piece of feedback so it describes the work and its effect only.", competencies: ["coach-feedback", "observe-interpret"], courses: ["div-i07-gender-double-binds", "div-i10-receiving-feedback"] },
    { id: "i-19", title: "Assessing people fairly across difference", question: "What is evidence, and what is my impression?", youCan: "Separate job-related evidence from cultural impression in a selection decision.", tryThis: "For one rating you gave, write the evidence that supports it.", competencies: ["observe-interpret", "inclusive-teams"], courses: ["screening-and-selection"], links: [scenario("dsd-hiring-panel", "A hiring panel keeps choosing the same kind of candidate")] },
    { id: "i-20", title: "Bridging", question: "How do I help two people or teams understand each other?", youCan: "Help two people or teams understand each other's reasoning.", tryThis: "In one disagreement, restate each side to the other until both agree you have it right.", competencies: ["bridge", "facilitate"], courses: ["ipe-36-leading-difficult-dialogue", "ipe-26-power-conflict-repair"] },
    { id: "i-21", title: "Adapting the process, not only yourself", question: "What could we change so that fewer people have to work around it?", youCan: "Change one process so fewer people have to work around it.", tryThis: "Pick one workaround people use and fix the process behind it.", competencies: ["build-access", "lead-change"], courses: ["ipe-12-policy-writing-equity-lens"], links: [scenario("dsd-accessible-form", "A required form cannot be completed with a screen reader")] },
    { id: "i-22", title: "Community context as a question", question: "How does knowing a community's context help me ask better, without assuming?", youCan: "Use a community brief to prepare questions, and state its limits.", tryThis: "Read one community brief and write three questions it helps you ask.", competencies: ["shift-perspective", "partner"], courses: [], links: [{ label: "Minnesota Communities", href: "/minnesota-communities" }] },
    { id: "i-23", title: "Integration: when equity is how we work", question: "What would have to be true for this to outlast any one leader?", youCan: "Describe what would keep a practice in place through a change of leader.", tryThis: "Choose one good practice and write down what it depends on.", competencies: ["sustain-culture"], courses: ["idi-integration", "culture-without-theater"] },
    { id: "i-24", title: "Teaching and mentoring across difference", question: "How do I help someone else examine a default without shaming them?", youCan: "Help someone examine an assumption in a way that keeps them in the conversation.", tryThis: "Share one of your own defaults with someone you mentor, and ask about theirs.", competencies: ["develop-others", "bridge"], courses: ["facilitators-guide-equity-inclusion-curriculum", "career-mentorship-and-sponsorship"] },
  ],
};

export const JOURNEY_INTERCULTURAL_PARTS = [
  { title: "Ground", description: "From noticing difference to seeing your own norm.", unitIds: ["i-01", "i-02", "i-03", "i-04", "i-05", "i-06", "i-07", "i-08"] },
  { title: "Practice", description: "From understanding difference to adapting.", unitIds: ["i-09", "i-10", "i-11", "i-12", "i-13", "i-14", "i-15", "i-16"] },
  { title: "Extend", description: "From your own adapting to teams and systems.", unitIds: ["i-17", "i-18", "i-19", "i-20", "i-21", "i-22", "i-23", "i-24"] },
] as const;

export const ALL_JOURNEY_PATHWAYS: readonly JourneyPathway[] = [JOURNEY_CORE, ...JOURNEY_PATHWAYS, JOURNEY_INTERCULTURAL];

export function getJourneyPathway(id: string): JourneyPathway | undefined {
  return ALL_JOURNEY_PATHWAYS.find(pathway => pathway.id === id);
}

export const JOURNEY_ROUTE = "/one-dsd/leadership/journey";
export const journeyHref = (pathwayId: string) => `${JOURNEY_ROUTE}/${pathwayId}`;

export const JOURNEY_CYCLE = [
  ["Learn", "A short lesson on one idea, set in real work."],
  ["Reflect", "What did you notice, what does it mean, and what will you do?"],
  ["Apply", "Try one thing in your own work, at a size that fits your role."],
  ["Return", "Come back to what happened, and decide what to keep, change, or stop."],
] as const;

const outline = (pathway: JourneyPathway) => pathway.modules.map(module => `${module.title}: ${module.question}`);

export const LEADERSHIP_JOURNEY_SURFACE: EditableSurfaceDefinition = defineEditableSurface({
  surfaceId: "leadership.journey", route: JOURNEY_ROUTE, scopePolicy: "dsd", label: "Leadership journey",
  fields: [
    { key: "title", label: "Title", kind: "short", required: true },
    { key: "intro", label: "Introduction", kind: "long", required: true },
    { key: "voluntary", label: "Participation", kind: "long", required: true },
    { key: "outline", label: "Pathways", kind: "string-list", required: true },
  ],
  approvedValues: {
    title: "Your leadership journey",
    intro: "A way to grow as a leader at your own pace, in the role you hold now. Each pathway is built for a different scope of leadership work. Every module gives you a short lesson, a question to think through, and something to try in your own work.",
    voluntary: "Taking part is your choice. There is no nomination, no deadline, and no rating. Start anywhere, move between pathways, and stop whenever you like. Formal leadership programs and job openings have their own requirements.",
    outline: ALL_JOURNEY_PATHWAYS.map(pathway => `${pathway.title}: ${pathway.audience}. ${pathway.question}`),
  },
});

export const LEADERSHIP_PATHWAY_SURFACES: readonly EditableSurfaceDefinition[] = ALL_JOURNEY_PATHWAYS.map(pathway => defineEditableSurface({
  surfaceId: `leadership.pathway.${pathway.id}`, route: journeyHref(pathway.id), scopePolicy: "dsd", label: `Leadership pathway: ${pathway.title}`,
  fields: [
    { key: "title", label: "Title", kind: "short", required: true },
    { key: "audience", label: "Who it is for", kind: "long", required: true },
    { key: "question", label: "Central question", kind: "long", required: true },
    { key: "intro", label: "Introduction", kind: "long", required: true },
    { key: "outline", label: "Modules", kind: "string-list", required: true },
  ],
  approvedValues: { title: pathway.title, audience: pathway.audience, question: pathway.question, intro: pathway.intro, outline: outline(pathway) },
}));

export const LEADERSHIP_JOURNEY_SURFACES: readonly EditableSurfaceDefinition[] = [LEADERSHIP_JOURNEY_SURFACE, ...LEADERSHIP_PATHWAY_SURFACES];
