import { caseStudySchema } from "@/lib/schemas";

export const kpiHub = caseStudySchema.parse({
  slug: "kpi-hub",
  title: "A four-role permission model over facility-scoped data",
  org: "Newtral Technologies",
  period: "Sep 2025 — Sep 2026",
  summary:
    "Owned the KPI Hub data-collection module end to end — data models, REST contracts, backend logic and the React UI — then designed the authorization model that decides who may see and change each record.",
  tags: ["RBAC", "Multi-tenant", "Node.js", "React", "MongoDB", "Cloud Run"],

  owned: "The KPI Hub module end to end — data models, REST contracts, backend logic and the React UI.",
  hardPart: "Authorization across 8-10 tenant organisations, the largest with 162 facilities, enforced below the endpoints.",
  result: "Four roles with record-level actions and facility scoping, serving 80-100 users per organisation.",

  team: "Team of four. I owned this module, and mentored a junior intern through their first tickets on it.",

  context:
    "KPI Hub is the module where an enterprise customer collects operational metrics across its facilities. One company may run dozens of sites, each with its own staff, and the same number can be entered by a site contributor, checked by a reviewer, challenged by an auditor and signed off by an admin. Every one of those people needs a different view of the same record.",

  constraint:
    "Authorization could not be a UI concern. Hiding a button is not a permission model, and an auditor at one facility must never be able to read another facility's data even by guessing an ID. At the same time the module had to stay workable for an admin who legitimately sees everything, so the scoping had to be a property of the query layer rather than a check bolted onto each endpoint.",

  built: [
    "Data models and REST API contracts for the collection module, plus the backend logic and the React/TypeScript UI on top of them.",
    "Company- and facility-level coverage views, so an admin can see which sites have reported and which have not.",
    "A record-level audit ledger — every state change attributable to a person, a role and a timestamp.",
    "Role-based access control across four roles (Admin, Auditor, Reviewer, Contributor), with status-transition workflows governing which role may move a record from one state to the next.",
    "Facility-level multi-tenant data scoping via organization/team mappings, applied at the data-access layer.",
    "An AI-usage metering dashboard tracking subscription tiers and per-user token consumption across services, with threshold alerting as accounts neared their limits.",
    "Event-driven filtering built on programmatic query builders and JSON filter trees.",
    "Reusable npm packages for reporting-period and cross-period calculations, adopted across multiple microservices.",
  ],

  decisions: [
    {
      decision:
        "Scope tenant data in the data-access layer, derived from the caller's organization/team mappings.",
      rejected:
        "A permission check at the top of each route handler.",
      why: "Per-route checks are correct exactly as long as every author remembers to write one. Pushing the scope into the layer that builds the query makes the safe path the default path — a new endpoint inherits the boundary instead of having to re-implement it. The failure mode changes from a silent cross-tenant leak to no results.",
    },
    {
      decision:
        "Model status transitions explicitly as role-gated edges, not as a writable status field.",
      rejected:
        "Letting any authorized role set status directly, validating the value only.",
      why: "The question is never whether 'approved' is a valid value; it is whether this person may move this record from 'submitted' to 'approved' right now. Encoding the edges makes the workflow readable in one place and makes the audit ledger meaningful — each entry corresponds to a transition that was permitted, not merely a field that was written.",
    },
    {
      decision:
        "Hold request/response contract parity when moving REST endpoints from the monolith to Cloud Run services.",
      rejected:
        "Taking the migration as an opportunity to clean up the API shape.",
      why: "The two changes have completely different risk profiles. Moving where code runs is verifiable — same input, same output, different host. Changing what it returns requires every client to move in lockstep. Keeping them separate meant the migration needed no client changes at all and could be rolled back per endpoint.",
    },
    {
      decision:
        "Publish the reporting-period calculations as versioned npm packages.",
      rejected:
        "Copying the date logic into each service, or a shared internal folder.",
      why: "Cross-period comparison is subtle — quarter boundaries, partial periods, timezone handling — and three slightly different copies of it is three slightly different sets of numbers. A package makes the logic one artifact with one test suite, and versioning means a service upgrades deliberately rather than inheriting a change it did not ask for.",
    },
  ],

  outcome: [
    "Four roles with record-level actions and facility-level scoping, shipped as part of the module rather than retrofitted.",
    "The monolith-to-Cloud-Run migration required no client changes.",
    "Reporting-period packages adopted across multiple microservices.",
    "Traced an aggregation defect that under-reported KPI counts — isolating it through the query and filtering layers to a maintainable fix under TypeScript strict mode, rather than patching the symptom at the response boundary.",
  ],

  wouldChange:
    "I would write the permission model as a declarative table — role, resource, action, scope — before writing any handlers, and generate both the server checks and the UI's capability hints from it. We arrived at something close to that, but by consolidation rather than by design, which meant a period where the UI's idea of what you could do and the server's idea were maintained separately. One source for both would have removed a whole class of mismatch.",
});
