import { runSchema, type Run } from "./types";

/**
 * ============================ PLACEHOLDER DATA ============================
 *
 * Every run below is `provenance: "placeholder"` — written by hand against
 * Sneha's resume so the demo UI could be built and reviewed. None of it is
 * model output, and the UI says so on screen.
 *
 * TO REPLACE WITH REAL RUNS:
 *   1. Run the assistant locally against 6-8 real Bangalore full-stack job
 *      descriptions.
 *   2. Save each response's per-requirement classifications here.
 *   3. Set `provenance: "recorded"` and `recordedAt` to the run date.
 *
 * The score is never stored — it is computed from these classifications by
 * `scoreRequirements`, which is the whole point of the demo. Do not add a
 * score field.
 * =========================================================================
 */

export const runs: readonly Run[] = [
  {
    id: "fullstack-b2b-saas",
    roleTitle: "Full-Stack Engineer (Node + React)",
    companyDescriptor: "B2B SaaS company, Bangalore · 2-4 yrs",
    provenance: "placeholder",
    recordedAt: null,
    requirements: [
      { text: "2+ years building production web applications", importance: "critical", matched: true, evidence: "15 months at GIDA Technologies, 11 months at Newtral Technologies." },
      { text: "Strong TypeScript across frontend and backend", importance: "critical", matched: true, evidence: "TypeScript strict mode across services and React UI at Newtral." },
      { text: "React and a modern meta-framework", importance: "critical", matched: true, evidence: "React and Next.js on cart, product and slug-based landing pages." },
      { text: "Node.js REST API design", importance: "critical", matched: true, evidence: "REST API contracts for KPI Hub; Express API on the job assistant." },
      { text: "Relational database experience", importance: "important", matched: true, evidence: "PostgreSQL schema, index design and query builders." },
      { text: "Experience with multi-tenant or RBAC systems", importance: "important", matched: true, evidence: "Four-role RBAC with facility-level tenant scoping." },
      { text: "Containerised deployment (Docker/Kubernetes)", importance: "important", matched: false },
      { text: "CI/CD pipeline ownership", importance: "nice_to_have", matched: false },
      { text: "Exposure to a cloud provider", importance: "nice_to_have", matched: true, evidence: "GCP Cloud Run migration; AWS RDS, VPC, IAM and Systems Manager." },
    ],
    tailoredBullets: [
      "Designed role-based access control across four roles with status-transition workflows and facility-level multi-tenant scoping, applied at the data-access layer so new endpoints inherit the tenant boundary by default.",
      "Migrated REST APIs from a monolithic core to microservices on Cloud Run while holding request/response contract parity, so no client required changes.",
      "Built the KPI Hub data-collection module end to end — data models, REST contracts, backend logic and the React/TypeScript UI.",
    ],
  },
  {
    id: "backend-platform",
    roleTitle: "Backend Engineer, Platform",
    companyDescriptor: "Series B fintech, Bangalore · 3-5 yrs",
    provenance: "placeholder",
    recordedAt: null,
    requirements: [
      { text: "Designing and versioning REST APIs consumed by multiple clients", importance: "critical", matched: true, evidence: "Held contract parity across a monolith-to-Cloud-Run migration." },
      { text: "Node.js and TypeScript in production", importance: "critical", matched: true, evidence: "Node/TypeScript services at Newtral under strict mode." },
      { text: "Microservices architecture", importance: "critical", matched: true, evidence: "Split a monolithic core into Cloud Run services." },
      { text: "Event-driven systems and message queues", importance: "important", matched: false },
      { text: "PostgreSQL at scale, including query optimisation", importance: "important", matched: true, evidence: "Schema and index design; traced an aggregation defect through the query layer." },
      { text: "Publishing shared internal libraries", importance: "important", matched: true, evidence: "Reporting-period npm packages adopted across multiple microservices." },
      { text: "Infrastructure-as-code", importance: "nice_to_have", matched: false },
      { text: "Financial-domain experience", importance: "nice_to_have", matched: false },
    ],
    tailoredBullets: [
      "Published versioned internal npm packages for reporting-period and cross-period calculations, consolidating date logic that had been duplicated across several microservices into one tested artifact.",
      "Traced an aggregation defect under-reporting KPI counts through the query and filtering layers to a maintainable fix, rather than correcting the symptom at the response boundary.",
      "Built event-driven filtering on programmatic query builders and JSON filter trees.",
    ],
  },
  {
    id: "frontend-product",
    roleTitle: "Frontend Engineer, Product",
    companyDescriptor: "Consumer e-commerce, remote · 2-4 yrs",
    provenance: "placeholder",
    recordedAt: null,
    requirements: [
      { text: "React with deep component architecture experience", importance: "critical", matched: true, evidence: "Rebuilt cart and product pages; architected reusable section components." },
      { text: "Next.js App Router", importance: "critical", matched: true, evidence: "Next.js across e-commerce flows and landing-page system." },
      { text: "State management at scale", importance: "critical", matched: true, evidence: "Redux, Zustand and React Query split by the character of the state." },
      { text: "Headless CMS integration", importance: "important", matched: true, evidence: "Sanity across e-commerce; re-architected Strapi content models." },
      { text: "End-to-end testing", importance: "important", matched: true, evidence: "Playwright suites asserting underlying API calls, not just DOM." },
      { text: "Web performance and Core Web Vitals", importance: "important", matched: true, evidence: "Storefront load performance — image sizing, font loading, and layout stability across CMS-composed pages." },
      { text: "Design-system ownership", importance: "nice_to_have", matched: false },
      { text: "Analytics instrumentation", importance: "nice_to_have", matched: true, evidence: "MoEngage, GA4, CleverTap and GTM event tracking." },
    ],
    tailoredBullets: [
      "Built a slug-based landing-page system that let marketing compose, reorder and publish unlimited pages with no engineering involvement or release.",
      "Separated owned state from cached server state across Redux, Zustand and React Query, cutting redundant API calls through product and cart flows.",
      "Wrote Playwright coverage that asserts the underlying API calls, catching stale-cache and double-mutation bugs a DOM-only assertion would pass.",
    ],
  },
];

/** Validated at module load — a malformed fixture fails the build. */
export const validatedRuns: readonly Run[] = runs.map((run) =>
  runSchema.parse(run),
);

export const hasRealRuns = validatedRuns.some(
  (run) => run.provenance === "recorded",
);
