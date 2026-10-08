import { z } from "zod";

/**
 * Content is typed and validated at module load, so a bad edit fails the
 * build rather than shipping a broken page. Same discipline as validating
 * model output in the job assistant.
 */

export const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  /** Shown on hover/tooltip to back the number up. Keep it factual. */
  basis: z.string().min(1),
});

export const roleSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  start: z.string().regex(/^\d{4}-\d{2}$/, "use YYYY-MM"),
  end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal("present")]),
  highlights: z.array(z.string().min(1)).min(1),
});

export const stackItemSchema = z.object({
  name: z.string().min(1),
  /** Where it was actually used. No percentage bars, no unbacked claims. */
  usedFor: z.string().min(1),
});

export const stackGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(stackItemSchema).min(1),
});

export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  org: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  /**
   * The skim layer: what a reader takes away in ten seconds, before any prose.
   * Deliberately capped short — if it does not fit, it is not the headline.
   */
  owned: z.string().min(1).max(130),
  hardPart: z.string().min(1).max(130),
  result: z.string().min(1).max(130),
  /** Interface screenshots. Only ever from work that is safe to publish. */
  screenshots: z
    .array(z.object({ src: z.string().min(1), caption: z.string().min(1) }))
    .optional(),
  /** Team size and who I was responsible for. Absent on solo work. */
  team: z.string().min(1).optional(),
  /** The fixed spine. Every case study answers the same six questions. */
  context: z.string().min(1),
  constraint: z.string().min(1),
  built: z.array(z.string().min(1)).min(1),
  decisions: z
    .array(
      z.object({
        decision: z.string().min(1),
        rejected: z.string().min(1),
        why: z.string().min(1),
      }),
    )
    .min(1),
  outcome: z.array(z.string().min(1)).min(1),
  wouldChange: z.string().min(1),
});

export const noteMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  hook: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readingMinutes: z.number().int().positive(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  // No phone field: this repo is public, and a number in source is scraped.
  // It is on the resume PDF, which is a deliberate download.
  links: z.object({
    linkedin: z.string().url(),
    github: z.string().url(),
  }),
  availability: z.string().min(1),
  summary: z.string().min(1),
  /** First-person narrative for the About page. Paragraphs, in order. */
  bio: z.array(z.string().min(1)).min(2),
  /** One line on what she is looking for next. */
  lookingFor: z.string().min(1),
  metrics: z.array(metricSchema).length(4),
  experience: z.array(roleSchema).min(1),
  stack: z.array(stackGroupSchema).min(1),
  education: z.object({
    institution: z.string().min(1),
    degree: z.string().min(1),
    detail: z.string().min(1),
    period: z.string().min(1),
  }),
});

export type Metric = z.infer<typeof metricSchema>;
export type Role = z.infer<typeof roleSchema>;
export type StackGroup = z.infer<typeof stackGroupSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type NoteMeta = z.infer<typeof noteMetaSchema>;
export type Profile = z.infer<typeof profileSchema>;
