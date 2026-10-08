import { z } from "zod";

export const importanceSchema = z.enum(["critical", "important", "nice_to_have"]);
export type Importance = z.infer<typeof importanceSchema>;

export const requirementSchema = z.object({
  text: z.string().min(1),
  importance: importanceSchema,
  matched: z.boolean(),
  /** What in the resume satisfied it. Absent when unmatched. */
  evidence: z.string().optional(),
});
export type Requirement = z.infer<typeof requirementSchema>;

/**
 * `provenance` is load-bearing, not decoration.
 *
 *   "recorded"    — genuine output from a real local run of the assistant.
 *   "placeholder" — written by hand so the UI could be built and reviewed.
 *
 * The UI labels placeholders plainly. Nothing may claim to be real model
 * output until it actually is one.
 */
export const provenanceSchema = z.enum(["recorded", "placeholder"]);

export const runSchema = z.object({
  id: z.string().min(1),
  roleTitle: z.string().min(1),
  /** Generic — never a real company that was applied to. */
  companyDescriptor: z.string().min(1),
  provenance: provenanceSchema,
  /** ISO date the run was recorded. Null for placeholders. */
  recordedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  requirements: z.array(requirementSchema).min(3),
  tailoredBullets: z.array(z.string().min(1)).min(1),
});
export type Run = z.infer<typeof runSchema>;
