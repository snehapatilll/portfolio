import type { CaseStudy } from "@/lib/schemas";
import { kpiHub } from "./kpi-hub";
import { dashboards } from "./dashboards";
import { jobAssistant } from "./job-assistant";
import { strapiFlattening } from "./strapi-flattening";
import { commerceCms } from "./commerce-cms";

/**
 * Ordered strongest-first — this is the order a reader meets them in.
 * KPI Hub leads because multi-tenant authorization is the most commercially
 * valuable thing here; the Strapi rescue follows because it is the clearest
 * evidence of debugging under production pressure.
 */
export const caseStudies: readonly CaseStudy[] = [
  kpiHub,
  dashboards,
  commerceCms,
  strapiFlattening,
  jobAssistant,
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
