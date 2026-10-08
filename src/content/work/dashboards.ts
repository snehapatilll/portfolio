import { caseStudySchema } from "@/lib/schemas";

/**
 * REVIEW BEFORE DEPLOY — one blank left:
 *   Whether the chart component shipped in one of the internal npm packages or
 *   lived in the app. It changes how reusable it reads.
 *
 * Charting is Ant Design (confirmed). If the exact package matters in an
 * interview, it is @ant-design/charts, which sits on AntV G2 underneath — worth
 * knowing, because that is why splitting it out of the main bundle was worth
 * doing at all.
 */
export const dashboards = caseStudySchema.parse({
  slug: "esg-dashboards",
  title: "One chart component, five chart types, and the dashboards built on it",
  org: "Newtral Technologies",
  period: "Sep 2025 — Sep 2026",
  summary:
    "Built the ESG reporting dashboard, the AI-usage metering dashboard and the multi-tenant login experience — and underneath them, a single chart component that switches between bar, stacked bar, line, pie and donut rather than five components that drift apart.",
  tags: [
    "React",
    "TypeScript",
    "Ant Design",
    "Data visualisation",
    "Component design",
    "Multi-tenant",
  ],

  owned: "The ESG and metering dashboards, the shared chart component, and the multi-tenant login UI.",
  hardPart: "Five chart types with different data shapes behind one component API that stayed worth using.",
  result: "One charting surface across both dashboards instead of five components drifting apart.",

  team: "Team of four. I owned the dashboard and visualisation work.",

  context:
    "ESG reporting is a reading problem before it is a writing one. Once facilities submit their metrics, somebody has to see whether energy intensity is trending the right way, how this quarter compares to the last, and which sites are dragging a company-level number down. That meant charts — a lot of them, of different kinds, across two separate dashboards and a tenant-aware shell around both.",

  constraint:
    "The obvious route is a component per chart type: a BarChart, a PieChart, a LineChart. That works until the fourth one, by which point the legend behaves differently in two of them, tooltips are formatted three ways, and the empty state exists in one. Dashboards are where small inconsistencies are most visible, because the charts sit next to each other on the same screen.",

  built: [
    "A single chart component wrapping Ant Design Charts that renders bar, stacked bar, line, pie and donut, switched by a prop rather than by choosing a different component.",
    "The ESG reporting dashboard — company- and facility-level views of submitted metrics, with period comparison.",
    "The AI-usage metering dashboard — subscription tiers and per-user token consumption across services, with threshold alerting as accounts approached their limits.",
    "The multi-tenant login experience and the dashboard shell around it, so a user lands in the right organisation's context with the right scope already applied.",
    "Shared formatting, legend, tooltip and empty-state behaviour, defined once in the chart component rather than per chart type.",
    "Render performance work on the dashboards — memoising the derived series so a filter change did not recompute and repaint every chart on the screen.",
    "Code-splitting Ant Design Charts so routes without a chart do not download it.",
  ],

  decisions: [
    {
      decision:
        "One component with a `type` prop, rather than one component per chart type.",
      rejected: "BarChart, LineChart, PieChart as separate exports.",
      why: "Everything around the plotted marks is identical across types — the legend, the tooltip, the axis and number formatting, the loading and empty states, the responsive container. Splitting by chart type duplicates all of that five times and guarantees it drifts, because a fix lands in the chart someone was working in. Consolidating means a change to the tooltip is a change to every chart on every dashboard at once.",
    },
    {
      decision:
        "Wrap the library rather than letting call sites use it directly.",
      rejected: "Importing Ant Design Charts in each dashboard and configuring it there.",
      why: "A pie takes one series and a stacked bar takes many, so configuring the library per call site ends up with a different shape of config in every dashboard — the per-type component problem again, wearing a config object. One wrapper that accepts a normalised series and adapts inside means a caller can switch a chart from grouped bars to a line without touching the data it passes, and it leaves one place to change if the library is ever swapped.",
    },
    {
      decision:
        "Keep the toggle a prop the dashboard owns, not state inside the chart.",
      rejected: "A built-in type switcher rendered by the chart itself.",
      why: "Some views are genuinely a pie and should never be anything else; others are worth letting a user flip between stacked bars and a line. Baking the switcher in would put a control on charts that should not have one, and owning it outside meant the same component serves both cases without a flag to disable its own UI.",
    },
    {
      decision:
        "Load Ant Design Charts only on routes that render a chart.",
      rejected: "Importing it at the top level alongside the rest of the app.",
      why: "Ant Design Charts sits on AntV G2, which brings a full rendering engine with it — easily the heaviest thing in the bundle, and most routes never draw a chart. Splitting it out means the login screen and the settings pages stop paying for a capability they do not use. Because every chart already went through one component, there was exactly one import boundary to move rather than five: the consolidation paid for itself a second time.",
    },
    {
      decision:
        "Memoise the derived series rather than recomputing per render.",
      rejected: "Transforming the data inline in the component body.",
      why: "A dashboard holds several charts over the same underlying data, so a filter change re-renders all of them at once. Recomputing the normalised series inline meant each chart redid that work on every parent state change, and with a tenant at the larger end — 162 facilities — that was visible as lag on interaction rather than on load. Deriving once and memoising made the cost proportional to the data changing instead of to the render count.",
    },
    {
      decision:
        "Treat the empty state as a first-class case, not a fallback.",
      rejected: "Rendering an empty chart frame when a facility had not reported.",
      why: "On an ESG dashboard, no data and a value of zero mean completely different things — one is a site that has not submitted, the other is a site reporting zero incidents. An empty axis reads as zero at a glance, which is a reporting error rather than a visual one.",
    },
  ],

  outcome: [
    "Five chart types served by one component, with legends, tooltips and formatting consistent across both dashboards by construction.",
    "ESG reporting views at company and facility level, for tenants ranging from 20 facilities to 162.",
    "Usage metering with threshold alerting before accounts hit their subscription limits.",
    "A multi-tenant login and shell that puts a user in the right organisation's scope on arrival.",
    "Filter interactions stayed responsive at the largest tenant size, and routes without charts no longer carry the charting bundle.",
  ],

  wouldChange:
    "I would have written the component's story cases first — every chart type against an empty series, a single point, one category, and a long tail of categories. Most of what needed fixing later was not the common case but the degenerate ones: a legend wrapping past two lines, a donut with a single segment, a line chart with one point and therefore no line. A fixture set covering those would have caught them before they reached a dashboard.",
});
