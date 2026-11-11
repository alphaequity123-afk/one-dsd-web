import { z } from "zod";
import {
  ACTIVITY_IDS, COMPETENCY_IDS, CONTEXT_IDS, DOMAIN_IDS, ORIENTATION_IDS, SCOPE_IDS, competencyDomain,
  type ActivityId, type CompetencyId, type ContextId, type DomainId, type OrientationId, type ScopeId,
} from "./vocabulary";

/**
 * Deferral marks content involving Native American communities or Tribal Nations.
 * "whole": the resource defers to the Office of Indian Affairs and the offices that
 * handle tribal matters. It is never recommended, excerpted, adapted, or revised here.
 * "partial": one or more parts defer; the resource needs a text pass before any reuse.
 */
export const DEFERRALS = ["none", "partial", "whole"] as const;
export type Deferral = (typeof DEFERRALS)[number];

const unique = <T extends z.ZodType>(item: T) =>
  z.array(item).refine(values => new Set(values).size === values.length, "Values must not repeat.");

export const KnowledgeTagsSchema = z.object({
  domains: unique(z.enum(DOMAIN_IDS)).min(1).max(3),
  competencies: unique(z.enum(COMPETENCY_IDS)).min(1).max(4),
  scopes: unique(z.enum(SCOPE_IDS)).min(1),
  orientations: unique(z.enum(ORIENTATION_IDS)),
  contexts: unique(z.enum(CONTEXT_IDS)),
  deferral: z.enum(DEFERRALS),
}).strict().superRefine((tags, ctx) => {
  for (const competency of tags.competencies) {
    if (!tags.domains.includes(competencyDomain(competency))) {
      ctx.addIssue({ code: "custom", path: ["competencies"], message: `Competency ${competency} belongs to a domain this resource is not tagged with.` });
    }
  }
});

export type KnowledgeTags = {
  domains: DomainId[];
  competencies: CompetencyId[];
  scopes: ScopeId[];
  orientations: OrientationId[];
  contexts: ContextId[];
  deferral: Deferral;
};

export const ActivitiesSchema = unique(z.enum(ACTIVITY_IDS)).min(1);

export const RESOURCE_KINDS = ["course", "path", "scenario", "life-cycle-stage", "tool"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

/** "shared" content serves every setting; "dsd" content belongs to the Disability Services Division setting. */
export const SETTINGS = ["shared", "dsd"] as const;
export type Setting = (typeof SETTINGS)[number];

export type TaggedResource = {
  /** `${kind}:${id}`; stable across display-name changes. */
  key: string;
  kind: ResourceKind;
  id: string;
  href: string;
  setting: Setting;
  activities: ActivityId[];
  tags: KnowledgeTags;
};

/**
 * How the tags were produced. A first pass from titles is a starting point for the
 * owner's review; it is not a reviewed classification and must not be described as one.
 */
export type TagProvenance = {
  basis: "titles" | "lesson-read";
  producedBy: "agent-first-pass" | "program-authored";
  ownerReviewed: boolean;
  date: string;
};
