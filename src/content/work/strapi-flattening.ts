import { caseStudySchema } from "@/lib/schemas";

export const strapiFlattening = caseStudySchema.parse({
  slug: "strapi-flattening",
  title: "Builds were failing at scale — so I changed the shape of the content",
  org: "GIDA Technologies · a major Indian bank",
  period: "2024 — 2025",
  summary:
    "The Strapi CMS behind an insurance self-help portal had grown nested enough that builds stopped completing. I flattened the content models to dot-separated fields and wrote a parsing layer that rebuilt the nested shape the frontend already expected — so not one component had to change.",
  tags: ["Strapi", "Next.js", "Content modelling", "Debugging", "Migration"],

  owned: "Sole engineer on the fix — content model re-architecture plus the frontend parsing layer.",
  hardPart: "Builds were failing in production, and neither the content nor the components could change.",
  result: "Builds restored at full content volume. Zero component rewrites, no re-authoring by the client.",

  context:
    "A self-help insurance portal for a major Indian bank, with content authored in Strapi. Over time the content models had grown deeply nested — components inside components inside dynamic zones — which is the natural way to model a page when you start, and the thing that quietly becomes expensive as the catalogue grows.",

  constraint:
    "Builds were failing at scale, so this was production pressure rather than a refactor anyone had scheduled. Two hard limits: content editors at the bank could not be asked to re-enter their content, and the frontend was a large Next.js application whose components consumed the nested shape throughout. A fix that required rewriting components would have taken longer than the problem allowed, and would have carried its own regression risk across the whole portal.",

  built: [
    "Re-architected the Strapi content models, flattening nested structures into dot-separated fields so the data the CMS had to assemble at build time became wide and shallow rather than deep.",
    "A frontend parsing layer that reads the flat, dot-separated payload and reconstructs the nested object shape the components already expected.",
    "The migration path for existing content from the nested models into the flattened ones.",
  ],

  decisions: [
    {
      decision:
        "Keep the nested shape at the component boundary and reconstruct it in a parsing layer.",
      rejected:
        "Updating every component to read the new flat shape directly.",
      why: "The components were not the problem — the storage and assembly shape was. Rewriting them would have spread a CMS-layer fix across the entire frontend, turning a contained change into a portal-wide regression surface. Putting one parser at the boundary meant the change was reviewable in a single place and could be reasoned about on its own.",
    },
    {
      decision:
        "Flatten to dot-separated keys rather than redesigning the content model from scratch.",
      rejected:
        "A cleaner, purpose-built schema built around how the portal is actually structured today.",
      why: "A clean redesign was the better model in the abstract and the wrong move under the constraint. Dot-separated keys preserve a mechanical, inspectable relationship to the original structure, which made the content migration something you could verify key by key rather than trust. The better schema is worth doing — but as deliberate work, not as the fix to a failing build.",
    },
    {
      decision: "Treat the parsing layer as a documented contract, not a shim.",
      rejected: "Inlining the reconstruction where each page fetched its data.",
      why: "A shim scattered across fetch sites is how a temporary fix becomes permanent and unreviewable. One named layer with an explicit input and output shape means the next person can see exactly what transformation is happening, and can delete it in one step if the content models are ever redesigned properly.",
    },
  ],

  outcome: [
    "Builds completed again at the portal's full content volume.",
    "Zero component rewrites — the frontend consumed the same shape before and after.",
    "Existing content migrated rather than re-authored, so no editor work at the client.",
    "Delivered single-handedly, under production pressure.",
  ],

  wouldChange:
    "I would have added a build-time assertion that the parser's output matches the shape components expect, so a future content-model change breaks the build with a clear message instead of surfacing as an undefined field on a rendered page. The parsing layer was correct, but it was correct by inspection — nothing enforced it. That is the piece I would not leave implicit a second time.",
});
