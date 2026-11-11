import courseTagFile from "./course-tags.json";
import lessonTagFile from "./lesson-tags.json";
import { RESOURCE_TAGS } from "./resource-tags";
import type { KnowledgeTags, ResourceKind, Setting, TaggedResource, TagProvenance } from "./schema";
import type { ActivityId, CompetencyId, ContextId, DomainId, OrientationId, ScopeId } from "./vocabulary";

export * from "./vocabulary";
export * from "./schema";
export { RESOURCE_TAGS, RESOURCE_TAG_PROVENANCE } from "./resource-tags";

/** Course tags are a first pass from titles; they await the owner's review. */
export const COURSE_TAG_PROVENANCE = courseTagFile.provenance as TagProvenance;
export const COURSE_TAGS = courseTagFile.courses as Record<string, KnowledgeTags>;

export function resourceKey(kind: ResourceKind, id: string): string {
  return `${kind}:${id}`;
}

export function courseTags(courseId: string): KnowledgeTags | undefined {
  return Object.hasOwn(COURSE_TAGS, courseId) ? COURSE_TAGS[courseId] : undefined;
}

const TAGGED: readonly TaggedResource[] = [
  ...Object.entries(COURSE_TAGS).map(([id, tags]): TaggedResource => ({
    key: resourceKey("course", id), kind: "course", id, href: `/courses/${encodeURIComponent(id)}`,
    setting: "shared", activities: ["learn"], tags,
  })),
  ...RESOURCE_TAGS.map((entry): TaggedResource => ({ key: resourceKey(entry.kind, entry.id), ...entry })),
];

/** Every tagged resource, whether or not it is published in a given view. */
export function allTaggedResources(): readonly TaggedResource[] {
  return TAGGED;
}

export type TagFilter = {
  domains?: readonly DomainId[];
  competencies?: readonly CompetencyId[];
  scopes?: readonly ScopeId[];
  orientations?: readonly OrientationId[];
  contexts?: readonly ContextId[];
  activities?: readonly ActivityId[];
  kinds?: readonly ResourceKind[];
};

export type FindOptions = {
  /**
   * Keys of resources actually published in the current view. When given, nothing
   * outside it is returned: a tag never makes an unpublished resource visible.
   */
  availableKeys?: ReadonlySet<string>;
  /** Settings the current view may show. The agencywide view passes ["shared"]. */
  settings?: readonly Setting[];
};

const intersects = <T>(wanted: readonly T[] | undefined, actual: readonly T[]) =>
  !wanted || wanted.length === 0 || wanted.some(value => actual.includes(value));

/**
 * Resources matching every given facet (any value within a facet).
 * Content deferred in whole is never returned. Partially deferred content is returned
 * so a person can still open it; `needsTextPass` tells authoring work to leave it alone.
 */
export function findTagged(filter: TagFilter = {}, options: FindOptions = {}): TaggedResource[] {
  return TAGGED.filter(resource =>
    resource.tags.deferral !== "whole"
    && (!options.availableKeys || options.availableKeys.has(resource.key))
    && (!options.settings || options.settings.includes(resource.setting))
    && intersects(filter.kinds, [resource.kind])
    && intersects(filter.domains, resource.tags.domains)
    && intersects(filter.competencies, resource.tags.competencies)
    && intersects(filter.scopes, resource.tags.scopes)
    && intersects(filter.orientations, resource.tags.orientations)
    && intersects(filter.contexts, resource.tags.contexts)
    && intersects(filter.activities, resource.activities));
}

/** True when a resource may be adapted or revised by authoring work without a prior text pass. */
export function mayBeAdapted(resource: TaggedResource): boolean {
  return resource.tags.deferral === "none";
}

export function needsTextPass(resource: TaggedResource): boolean {
  return resource.tags.deferral === "partial";
}

/** Lesson tags: a first pass from lesson titles and summaries, for the leadership and intercultural courses. */
export type LessonTags = { competencies: CompetencyId[]; orientations: OrientationId[]; activities: ActivityId[] };
export const LESSON_TAG_PROVENANCE = lessonTagFile.provenance as TagProvenance;
export const LESSON_TAGS = lessonTagFile.lessons as Record<string, LessonTags>;

export type TaggedLesson = { key: string; courseId: string; lessonId: string; href: string; tags: LessonTags; course: KnowledgeTags };

const TAGGED_LESSONS: readonly TaggedLesson[] = Object.entries(LESSON_TAGS).map(([key, tags]) => {
  const [courseId, lessonId] = key.split("/");
  return { key, courseId, lessonId, href: `/courses/${encodeURIComponent(courseId)}/${encodeURIComponent(lessonId)}`, tags, course: COURSE_TAGS[courseId] };
});

export function lessonTags(courseId: string, lessonId: string): LessonTags | undefined {
  const key = `${courseId}/${lessonId}`;
  return Object.hasOwn(LESSON_TAGS, key) ? LESSON_TAGS[key] : undefined;
}

export type LessonFilter = {
  competencies?: readonly CompetencyId[];
  orientations?: readonly OrientationId[];
  /** Matched against the lesson's course. */
  scopes?: readonly ScopeId[];
  domains?: readonly DomainId[];
};

/**
 * Lessons matching every given facet. A lesson is returned only when its course is
 * not deferred and, when `availableKeys` is given, its course is published in the view.
 */
export function findLessons(filter: LessonFilter = {}, options: Pick<FindOptions, "availableKeys"> = {}): TaggedLesson[] {
  return TAGGED_LESSONS.filter(lesson =>
    lesson.course.deferral === "none"
    && (!options.availableKeys || options.availableKeys.has(resourceKey("course", lesson.courseId)))
    && intersects(filter.competencies, lesson.tags.competencies)
    && intersects(filter.orientations, lesson.tags.orientations)
    && intersects(filter.scopes, lesson.course.scopes)
    && intersects(filter.domains, lesson.course.domains));
}
