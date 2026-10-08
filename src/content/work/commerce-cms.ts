import { caseStudySchema } from "@/lib/schemas";

export const commerceCms = caseStudySchema.parse({
  slug: "commerce-cms",
  title: "Giving marketing their own publishing surface",
  org: "GIDA Technologies",
  period: "2024 — 2025",
  summary:
    "Rebuilt cart and product for a smoother checkout, then built a slug-based landing-page system that let marketing compose, reorder and publish unlimited pages without an engineer in the loop.",
  tags: ["Next.js", "React", "Sanity", "Redux", "Zustand", "React Query", "Playwright"],

  owned: "Product and cart pages, the slug-based landing-page system, the section library, and the state architecture.",
  hardPart: "Giving marketing real compositional freedom without turning the storefront into a slow page builder.",
  result: "Marketing builds and publishes entire pages from Sanity alone — choosing, omitting and reordering sections.",

  context:
    "An e-commerce frontend where two different groups of people were blocked on the same team. Customers were dropping out of a checkout that had accumulated friction, and marketing could not ship a campaign landing page without filing a ticket and waiting for a release.",

  constraint:
    "Marketing needed real compositional freedom — new pages, arbitrary section order — but the result still had to be a fast, correct storefront page, not a page builder that produces slow pages. And the state layer had to serve both: cart state that must be exactly right, alongside catalogue data that is read constantly and changes rarely.",

  built: [
    "Product detail pages for the storefront — content from Sanity, pricing, availability and cart actions from the backend APIs, composed into one page.",
    "The cart and checkout path, rebuilt in React / Next.js.",
    "A slug-based landing-page system: a page is a slug plus an ordered list of sections, so marketing can compose a complete new page from the Sanity interface with no engineering involvement and no release.",
    "A library of section types marketing picks from — reorderable, and each one optional, so a page is assembled by choosing and arranging rather than by requesting a build.",
    "Sanity content models matched one-to-one to those section components, so what an editor sees in the CMS maps to what renders.",
    "The integration layer joining CMS content to the backend APIs on the same page — static marketing copy and live product data arriving from two sources into one view.",
    "The state and data-fetching architecture — Redux, Zustand and React Query, each on the state it suits.",
    "End-to-end Playwright automation for the revamped flows, asserting the underlying API calls rather than only the rendered output.",
    "Event tracking through MoEngage, GA4, CleverTap and GTM.",
    "Load performance across the storefront and the composed landing pages — image sizing, font loading, and keeping layout stable as CMS-driven sections render.",
  ],

  decisions: [
    {
      decision:
        "Split state three ways by its actual character: Redux for cart and checkout, Zustand for local UI state, React Query for server data.",
      rejected: "One global store for everything.",
      why: "Cart state is a small amount of data that must be exactly right and survive navigation, so it earns the ceremony of a reducer. Server data is cached remote state with its own staleness and refetch rules, which a global store models badly and React Query models precisely. Collapsing all three into one store is what produces the redundant refetches we were trying to remove — the store cannot tell the difference between state it owns and state it is merely holding.",
    },
    {
      decision:
        "Model a landing page as a slug plus an ordered list of typed sections.",
      rejected: "A free-form page builder with arbitrary nesting.",
      why: "Arbitrary nesting is where a CMS stops being fast — both for the build and for the people maintaining it. A flat ordered list of known section types gives marketing the freedom they actually asked for (new pages, any order) while keeping every section a real, optimised React component. It also means a new section type is an additive change, not a schema migration.",
    },
    {
      decision:
        "Reserve space for CMS-driven sections before their content arrives.",
      rejected: "Letting each section size itself once its content loaded.",
      why: "A landing page marketing assembles is a list of sections whose contents are not known until the CMS responds, which is the textbook setup for layout shift — the page reflows under the reader as each one fills in. On a storefront that is not just an irritation: a product card moving as someone reaches for it costs a tap on the wrong thing. Sizing from what the section type implies, rather than from what arrived, keeps the page still.",
    },
    {
      decision: "Assert the underlying API calls in the Playwright suite.",
      rejected: "Asserting only on rendered DOM.",
      why: "A cart test that only checks the UI passes when the UI happens to be right and the request was wrong — a stale cache, a double-fired mutation. Asserting the network traffic catches exactly the class of bug the state refactor could introduce, which is what the suite existed to protect.",
    },
  ],

  outcome: [
    "Marketing publishes landing pages independently — no engineering involvement, no release required.",
    "Redundant API calls cut across product and cart flows, and component reuse improved by separating owned state from cached server state.",
    "A smoother checkout path through the rebuilt cart and product pages.",
    "Playwright coverage over the revamped flows, asserting network behaviour as well as UI.",
    "Stable layout and improved load behaviour on pages whose composition is decided in the CMS rather than in code.",
  ],

  wouldChange:
    "I would have given marketing a preview of the composed page against production data before publishing. They got compositional freedom and used it, which is the point — but the first look at a new arrangement being the live page is more pressure than the tool needed to put on them, and a preview route would have cost very little next to what the system already did.",
});
