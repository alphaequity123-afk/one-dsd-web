import courseTagFile from "./course-tags.json";
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
