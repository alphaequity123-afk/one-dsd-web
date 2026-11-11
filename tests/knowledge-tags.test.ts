import { describe, expect, it } from "vitest";
import { AUTHORED_COURSES, RECOVERED_COURSES } from "@/lib/content/courses/definitions";
import { GRADUATION_PATHS } from "@/lib/content/paths";
import { LEADERSHIP_STAGES } from "@/lib/content/leadership-lifecycle";
import { DEVELOPMENT_CAPABILITIES } from "@/lib/content/leadership-development";
import { DSD_SCENARIOS } from "@/lib/dsd";
import {
  ActivitiesSchema, COMPETENCIES, COMPETENCY_IDS, COURSE_TAGS, COURSE_TAG_PROVENANCE, DEVELOPMENT_CAPABILITY_COMPETENCY, DOMAIN_IDS,
  KnowledgeTagsSchema, LESSON_TAGS, LESSON_TAG_PROVENANCE, ORIENTATION_IDS, RESOURCE_TAGS, findLessons, lessonTags, allTaggedResources, courseTags, findTagged, mayBeAdapted, needsTextPass, resourceKey,
} from "@/lib/content/knowledge";

const courseIds = [...RECOVERED_COURSES, ...AUTHORED_COURSES].map(pack => pack.course.id);

describe("knowledge tags", () => {
  it("tag every course the program publishes, and nothing else", () => {
    expect(Object.keys(COURSE_TAGS).sort()).toEqual([...courseIds].sort());
    expect(courseIds).toHaveLength(240);
  });

  it("use only the controlled vocabulary, with each competency inside a tagged domain", () => {
    for (const resource of allTaggedResources()) {
      const result = KnowledgeTagsSchema.safeParse(resource.tags);
      expect(result.success, `${resource.key}: ${result.success ? "" : JSON.stringify(result.error.issues)}`).toBe(true);
      expect(ActivitiesSchema.safeParse(resource.activities).success, resource.key).toBe(true);
    }
  });

  it("give every domain at least four competencies and every competency a known domain", () => {
    for (const domain of DOMAIN_IDS) expect(COMPETENCIES.filter(item => item.domain === domain).length).toBeGreaterThanOrEqual(4);
    expect(new Set(COMPETENCY_IDS).size).toBe(COMPETENCY_IDS.length);
  });

  it("map the existing development capabilities onto the competency list", () => {
    expect(Object.keys(DEVELOPMENT_CAPABILITY_COMPETENCY).sort()).toEqual(DEVELOPMENT_CAPABILITIES.map(item => item.id).sort());
    for (const competency of Object.values(DEVELOPMENT_CAPABILITY_COMPETENCY)) expect(COMPETENCY_IDS).toContain(competency);
  });

  it("tag every practice path, practice scenario, and life-cycle stage that exists, by its real id", () => {
    const tagged = (kind: string) => RESOURCE_TAGS.filter(item => item.kind === kind).map(item => item.id).sort();
    expect(tagged("path")).toEqual(GRADUATION_PATHS.map(path => path.id).sort());
    expect(tagged("scenario")).toEqual(DSD_SCENARIOS.map(scenario => scenario.id).sort());
    expect(tagged("life-cycle-stage")).toEqual(LEADERSHIP_STAGES.map(stage => stage.id).sort());
    const keys = allTaggedResources().map(resource => resource.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("do not present the first pass as reviewed", () => {
    expect(COURSE_TAG_PROVENANCE).toMatchObject({ basis: "titles", producedBy: "agent-first-pass", ownerReviewed: false });
  });
});

describe("deferred content", () => {
  const whole = ["cultural-intelligence-tribal", "cultural-intelligence-native-american", "cultural-intelligence-alaska-native", "ipe-20-tribal-sovereignty"];
  const partial = ["dsd-leading-system-change", "gc-faith-in-minnesota", "how-it-shows-up-in-minnesota-human-services", "change-management-bringing-people-along", "employment-first-and-economic-inclusion", "ipe-15-stakeholder-partnership", "gc-equity-committee-roles", "ipe-capstone-intercultural-practice"];

  it("marks Native American and Tribal Nations courses as deferred in whole", () => {
    for (const id of whole) expect(courseTags(id)?.deferral, id).toBe("whole");
  });

  it("never returns wholly deferred content from a search, whatever the filter", () => {
    const keys = new Set(findTagged().map(resource => resource.key));
    for (const id of whole) expect(keys.has(resourceKey("course", id)), id).toBe(false);
    expect(findTagged({ domains: ["intercultural-fluency"], contexts: ["community"] }).some(resource => whole.includes(resource.id))).toBe(false);
  });

  it("keeps partially deferred courses out of authoring work until a text pass", () => {
    for (const id of partial) {
      const resource = allTaggedResources().find(item => item.key === resourceKey("course", id))!;
      expect(resource.tags.deferral, id).toBe("partial");
      expect(mayBeAdapted(resource)).toBe(false);
      expect(needsTextPass(resource)).toBe(true);
    }
  });
});

describe("finding tagged resources", () => {
  it("matches any value within a facet and every facet given", () => {
    const supervising = findTagged({ scopes: ["team"], domains: ["leadership-effectiveness"] });
    expect(supervising.length).toBeGreaterThan(10);
    for (const resource of supervising) {
      expect(resource.tags.scopes).toContain("team");
      expect(resource.tags.domains).toContain("leadership-effectiveness");
    }
    expect(findTagged({ kinds: ["path"], activities: ["practice"] })).toHaveLength(GRADUATION_PATHS.length);
  });

  it("finds content for each orientation of the continuum", () => {
    for (const orientation of ["denial", "polarization", "minimization", "acceptance", "adaptation", "integration"] as const) {
      expect(findTagged({ orientations: [orientation] }).length, orientation).toBeGreaterThan(0);
    }
  });

  it("returns only resources published in the current view", () => {
    const available = new Set([resourceKey("course", "idi-denial")]);
    expect(findTagged({ orientations: ["denial", "polarization"] }, { availableKeys: available }).map(resource => resource.id)).toEqual(["idi-denial"]);
    expect(findTagged({}, { availableKeys: new Set() })).toEqual([]);
  });

  it("keeps division setting content out of the agencywide view", () => {
    const shared = findTagged({}, { settings: ["shared"] });
    expect(shared.some(resource => resource.setting === "dsd")).toBe(false);
    expect(shared.some(resource => resource.kind === "scenario")).toBe(false);
    expect(findTagged({ kinds: ["scenario"] }, { settings: ["shared", "dsd"] })).toHaveLength(DSD_SCENARIOS.length);
  });
});

describe("lesson tags", () => {
  const packs = new Map([...RECOVERED_COURSES, ...AUTHORED_COURSES].map(pack => [pack.course.id, pack]));
  const taggedCourses = new Set(Object.keys(LESSON_TAGS).map(key => key.split("/")[0]));

  it("refer only to real lessons, and cover every lesson of each course they touch", () => {
    for (const key of Object.keys(LESSON_TAGS)) {
      const [courseId, lessonId] = key.split("/");
      expect(packs.get(courseId)?.course.lessons.some(lesson => lesson.id === lessonId), key).toBe(true);
    }
    for (const courseId of taggedCourses) {
      for (const lesson of packs.get(courseId)!.course.lessons) expect(lessonTags(courseId, lesson.id), `${courseId}/${lesson.id}`).toBeDefined();
    }
    expect(Object.keys(LESSON_TAGS)).toHaveLength(609);
    expect(taggedCourses.size).toBe(135);
  });

  it("use one or two known competencies, known orientations, and never touch a deferred course", () => {
    for (const [key, tags] of Object.entries(LESSON_TAGS)) {
      expect(tags.competencies.length, key).toBeGreaterThanOrEqual(1);
      expect(tags.competencies.length, key).toBeLessThanOrEqual(2);
      for (const competency of tags.competencies) expect(COMPETENCY_IDS, key).toContain(competency);
      for (const orientation of tags.orientations) expect(ORIENTATION_IDS, key).toContain(orientation);
      expect(tags.activities, key).toContain("learn");
      expect(courseTags(key.split("/")[0])?.deferral, key).toBe("none");
    }
    expect(LESSON_TAG_PROVENANCE).toMatchObject({ basis: "titles", producedBy: "agent-first-pass", ownerReviewed: false });
  });

  it("find lessons by competency, orientation, and the scope of their course", () => {
    const coaching = findLessons({ competencies: ["coach-feedback"], scopes: ["team"] });
    expect(coaching.length).toBeGreaterThan(0);
    for (const lesson of coaching) {
      expect(lesson.tags.competencies).toContain("coach-feedback");
      expect(lesson.course.scopes).toContain("team");
      expect(lesson.href).toBe(`/courses/${lesson.courseId}/${lesson.lessonId}`);
    }
    for (const orientation of ORIENTATION_IDS) expect(findLessons({ orientations: [orientation] }).length, orientation).toBeGreaterThan(0);
    for (const competency of COMPETENCY_IDS) expect(findLessons({ competencies: [competency] }).length, competency).toBeGreaterThan(0);
    expect(findLessons({}, { availableKeys: new Set() })).toEqual([]);
  });
});
