import { profileSchema } from "@/lib/schemas";

/**
 * Single source of truth for everything the site claims about Sneha.
 * Validated at module load — a bad edit fails the build.
 *
 * REVIEW BEFORE DEPLOY:
 *   1. The npm packages no longer appear as a metric — the strip now carries
 *      tenant scale instead, which is stronger. They are described without a
 *      count in the KPI Hub case study, which is accurate as written, so no
 *      number is needed unless you want one there.
 *   2. `yearsShipping`: Sneha's own figures are 15 months at GIDA and 11 at
 *      Newtral — 26 months, i.e. 2.2 years. She chose to show "2.5 yrs".
 *      Swap this constant for "2.2 yrs" or "26 months" if a literal figure is
 *      preferred; the dates are on the page, so the arithmetic is checkable.
 *
 * No client is named anywhere on this site. The insurance portal work is
 * described as "a major Indian bank" throughout, deliberately.
 */

const yearsShipping = "2.5 yrs";

export const profile = profileSchema.parse({
  name: "Sneha Patil",
  headline:
    "I build multi-tenant B2B SaaS — the interface, the services, and the data model under both.",
  location: "Bangalore, India",
  email: "snehapatil112001@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/sneha-patil-271939295",
    github: "https://github.com/snehapatilll",
  },
  availability: "Available to join immediately",
  summary:
    "Full-stack engineer across React/Next.js frontends and Node.js/TypeScript services — multi-tenant authorization and RBAC, REST API contract design, event-driven services, microservices on GCP Cloud Run, PostgreSQL and MongoDB.",

  // DRAFT — written from the resume and the project repos, in a voice I have
  // guessed at. Rewrite it so it sounds like you; this is the only part of the
  // site a reader will take as personal rather than technical.
  bio: [
    "I work across the whole of a product — the React interface, the services behind it, and the data model under both. Most of that has been enterprise B2B SaaS: a customer with dozens of sites, where the same record has to look different to the person entering it, the person checking it and the person signing it off. I have built both halves of that problem — the coverage views and audit screens people use every day, and the scoping underneath that decides what those screens contain.",
    "I came to software from an electronics and communication degree, and the habit that stuck is wanting to know why something works rather than only that it does. It shows up on both sides: when KPI counts were under-reported I followed it through the query and filtering layers rather than correcting the number where it surfaced; and on the frontend, separating owned state from cached server state across Redux, Zustand and React Query removed a whole class of redundant refetching that no amount of component tidying would have fixed.",
    "Lately I have been building my own things end to end, including the infrastructure — a PostgreSQL instance in a private subnet with no route to the internet, reached through Systems Manager, because I wanted to understand the parts of AWS that are usually someone else's job.",
  ],

  lookingFor:
    "Full-stack engineering roles — frontend, backend, or both. I am equally happy building a React interface, the services behind it, or the data model under both. Bangalore or remote, available immediately.",

  /**
   * All four are from paid work, deliberately. An earlier version spent a slot
   * on the personal project's test count; that number is strong but it belongs
   * inside that case study, not on the strip a recruiter reads first.
   */
  metrics: [
    {
      value: yearsShipping,
      label: "shipping production",
      basis: "Enterprise B2B SaaS across two companies in Bangalore.",
    },
    {
      value: "8–10",
      label: "tenant organisations",
      basis:
        "Each with its own facilities, staff and data boundary — served from one multi-tenant platform.",
    },
    {
      value: "162",
      label: "facilities in the largest tenant",
      basis:
        "Tenants ranged from 20 facilities to 162, so coverage views and scoping had to hold at both ends.",
    },
    {
      value: "80–100",
      label: "users per organisation",
      basis:
        "Across four roles, each seeing a different view of the same record.",
    },
  ],

  experience: [
    {
      title: "SDE-1",
      company: "Newtral Technologies Pvt. Ltd.",
      location: "Bangalore",
      start: "2025-09",
      end: "2026-09",
      highlights: [
        "Delivered the KPI Hub data-collection module end to end — data models, REST API contracts, backend logic and React/TypeScript UI — with company- and facility-level coverage views and a record-level audit ledger.",
        "Designed role-based access control across four roles (Admin, Auditor, Reviewer, Contributor) with status-transition workflows and record-level actions, plus facility-level multi-tenant data scoping via organization/team mappings.",
        "Built an AI-usage metering dashboard tracking subscription tiers and per-user token consumption across services, with threshold alerting as accounts neared their limits.",
        "Migrated REST APIs from a monolithic core to microservices on GCP Cloud Run, holding request/response contract parity so no client changes were required.",
        "Traced an aggregation defect that under-reported KPI counts, isolating it through the query and filtering layers to a maintainable fix under TypeScript strict mode.",
        "Published reusable npm packages for reporting-period and cross-period calculations, adopted across multiple microservices; built event-driven filtering using programmatic query builders and JSON filter trees.",
      ],
    },
    {
      title: "Software Developer",
      company: "GIDA Technologies",
      location: "Bangalore",
      start: "2024-03",
      end: "2025-05",
      highlights: [
        "Rebuilt cart and product pages in React / Next.js for a smoother checkout, and built a slug-based landing-page system letting marketing compose, reorder and publish unlimited pages with no engineering involvement; integrated Sanity CMS across e-commerce flows.",
        "Architected the state and data-fetching layers with Redux, Zustand and React Query, improving component reusability and cutting redundant API calls across product and cart flows.",
        "Single-handedly re-architected the Strapi CMS behind a major Indian bank's insurance self-help portal to fix build failures at scale — flattening nested content models to dot-separated fields and writing the frontend parsing layer that rebuilt the expected nested shape, with zero component rewrites.",
        "Built end-to-end Playwright UI automation for the revamped flows, asserting the underlying API calls; integrated MoEngage, GA4, CleverTap and GTM for event tracking.",
      ],
    },
  ],

  stack: [
    {
      group: "Languages",
      items: [
        {
          name: "TypeScript",
          usedFor: "Strict mode across services and UI at Newtral.",
        },
        {
          name: "JavaScript",
          usedFor: "E-commerce and CMS frontends at GIDA.",
        },
        {
          name: "SQL",
          usedFor: "PostgreSQL schema, indexes and query builders.",
        },
      ],
    },
    {
      group: "Backend & APIs",
      items: [
        {
          name: "Node.js",
          usedFor: "KPI Hub services and the job assistant API.",
        },
        { name: "Express", usedFor: "REST layer on the job assistant." },
        {
          name: "REST contract design",
          usedFor:
            "Held request/response parity through a monolith-to-Cloud-Run migration.",
        },
        {
          // The assistant's repo has no Swagger tooling — the spec rendered on
          // /labs was written by reading its routers. Keep this attributed to
          // the work where Swagger was actually used.
          name: "Swagger / OpenAPI",
          usedFor: "API documentation and contract verification at Newtral.",
        },
        {
          name: "Microservices",
          usedFor: "Split a monolithic core into Cloud Run services.",
        },
        {
          name: "Event-driven architecture",
          usedFor:
            "Filtering via programmatic query builders and JSON filter trees.",
        },
        {
          name: "Zod / Joi",
          usedFor: "Validating LLM output before it reaches scoring code.",
        },
        {
          name: "npm authoring",
          usedFor: "Reporting-period packages shared across microservices.",
        },
      ],
    },
    {
      group: "Frontend",
      items: [
        {
          name: "React",
          usedFor: "KPI Hub coverage views and audit ledger UI.",
        },
        {
          name: "Next.js",
          usedFor: "Cart, product and slug-based landing pages; this site.",
        },
        { name: "Redux", usedFor: "Cart and checkout state at GIDA." },
        {
          name: "Zustand",
          usedFor: "Lighter client state alongside Redux in product flows.",
        },
        {
          name: "React Query",
          usedFor: "Cut redundant API calls across product and cart flows.",
        },
        {
          name: "Tailwind CSS",
          usedFor: "The assistant's UI and this site's design system.",
        },
        {
          name: "Ant Design",
          usedFor:
            "Dashboard UI, and Ant Design Charts behind the shared chart component.",
        },
      ],
    },
    {
      group: "Databases",
      items: [
        {
          name: "PostgreSQL",
          usedFor: "Assistant's data model; RDS in private subnets.",
        },
        {
          name: "MongoDB / Mongoose",
          usedFor: "KPI Hub records and the audit ledger.",
        },
        {
          name: "Aggregation pipelines",
          usedFor:
            "Coverage roll-ups — and the defect I traced through them.",
        },
        {
          name: "Schema & index design",
          usedFor: "Reporting-period queries across facilities.",
        },
        {
          name: "Query builders",
          usedFor: "JSON filter trees compiled to database queries.",
        },
      ],
    },
    {
      group: "Cloud",
      items: [
        {
          name: "GCP Cloud Run",
          usedFor: "Target for the microservices migration at Newtral.",
        },
        {
          name: "AWS RDS",
          usedFor: "PostgreSQL in two private subnets, no internet route.",
        },
        {
          name: "AWS VPC",
          usedFor:
            "Subnet and route-table design — no NAT gateway, by choice.",
        },
        {
          name: "AWS Systems Manager",
          usedFor: "Session Manager access with zero inbound rules.",
        },
        {
          name: "AWS IAM / EC2",
          usedFor: "Instance roles instead of long-lived keys.",
        },
      ],
    },
    {
      group: "Engineering",
      items: [
        {
          name: "RBAC & multi-tenant auth",
          usedFor: "Four roles, record-level actions, facility scoping.",
        },
        {
          name: "Data scoping",
          usedFor: "Organization/team mappings as the tenant boundary.",
        },
        {
          name: "Testing",
          usedFor: "Playwright E2E at GIDA; node:test on the assistant.",
        },
        {
          name: "Technical design & review",
          usedFor: "Owned the KPI Hub design end to end.",
        },
        {
          name: "Web performance",
          usedFor:
            "Render and bundle work on the dashboards; load and layout stability on the storefront.",
        },
        { name: "Agile / Scrum", usedFor: "Two-week cycles at both companies." },
      ],
    },
    {
      group: "Tools",
      items: [
        { name: "Git", usedFor: "Trunk-based with PR review." },
        { name: "Jira", usedFor: "Sprint tracking at both companies." },
        {
          name: "Postman",
          usedFor: "Contract verification during the Cloud Run migration.",
        },
        {
          name: "Strapi",
          usedFor: "The flattening rescue on the insurance portal.",
        },
        { name: "Sanity", usedFor: "E-commerce content models." },
        {
          name: "Claude Code / Cursor",
          usedFor: "Daily driver for implementation and review.",
        },
      ],
    },
  ],

  education: {
    institution: "CMR Institute of Technology, Bangalore",
    degree: "B.E. Electronics and Communication Engineering",
    detail: "GPA 8.87 / 10",
    period: "Dec 2020 — Jun 2024",
  },
});
