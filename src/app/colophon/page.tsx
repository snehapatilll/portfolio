import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Colophon",
  description:
    "How this site is built — the theme architecture, the accessibility decisions, and why there is no component library.",
};

const stack = [
  {
    name: "Next.js 16 · App Router",
    note: "Every page statically prerendered.",
  },
  { name: "TypeScript", note: "Strict mode. No `any` in application code." },
  {
    name: "Tailwind v4",
    note: "CSS-first config, theme as custom properties.",
  },
  {
    name: "Radix primitives",
    note: "Unstyled. Behaviour borrowed, appearance not.",
  },
  {
    name: "MDX + Zod",
    note: "Notes are files; their metadata is validated at build.",
  },
  { name: "Motion", note: "One effect, behind prefers-reduced-motion." },
];

const decisions = [
  {
    title: "No component library",
    body: "No shadcn, no MUI, no Ant. A reviewer spots a template in about three seconds, and the point of a portfolio is to show judgement rather than someone else's. Radix supplies unstyled behaviour for the tabs, dialog and accordion — keyboard handling and focus management are genuinely hard to get right — and every pixel of appearance is mine.",
  },
  {
    title: "Theme as tokens, not a dark-mode class sprinkle",
    body: "Colour lives in custom properties on :root, with .light redefining the same names. Components reference bg-surface or text-muted and never branch on theme, so there is no second set of classes to keep in sync. Light mode is a genuine remap rather than an inversion — the amber accent darkens from #F5A524 to #96610A so it still passes contrast on a light background.",
  },
  {
    title: "The theme toggle does not shift layout or flash",
    body: "The active theme is only knowable on the client, so until mount the button renders a neutral icon and a neutral label. Gating only the icon and not the aria-label is how I got a hydration mismatch the first time — the server rendered one label, React replaced it on hydration, and the console said so.",
  },
  {
    title: "Accessibility that holds up to tabbing through it",
    body: "A skip link, focus-visible rings that are never removed, aria-current on the active route, the architecture diagram navigable by keyboard with each node focusable, and every interactive control reachable in order. The RBAC playground's role switcher is a real radiogroup rather than styled buttons.",
  },
  {
    title: "Motion is one effect, and it is optional",
    body: "Opacity plus a 14px translate over 240ms on scroll into view. Nothing else moves. It is gated behind prefers-reduced-motion both in CSS and in the component, so a visitor who asks for stillness gets it rather than a shorter animation.",
  },
  {
    title: "Content is typed and validated at build",
    body: "Everything the site asserts — the metrics, the case studies, each note's metadata — is parsed by a Zod schema when the module loads. A malformed edit fails the build with an error naming the field, instead of rendering a page with a blank heading. The skim bullets on each case study are length-capped by the schema so they cannot quietly grow into paragraphs.",
  },
  {
    title: "The diagram is inline SVG, not an exported image",
    body: "It uses the same CSS variables as everything else, so it flips with the theme. Two exported PNGs would have been faster and would have drifted apart the first time a colour changed.",
  },
  {
    title: "No analytics, no cookies, no consent banner",
    body: "Nothing here needs to know who you are, so there is nothing to disclose and nothing to click away.",
  },
];

export default function ColophonPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-20 px-4 py-20">
      <SectionHeader
        eyebrow="Colophon"
        title="How this site is built"
        description="This page is itself a work sample, so it seems fair to say what is going on underneath it."
        as="h1"
      />

      <section>
        <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((item) => (
            <li key={item.name} className="bg-surface p-4">
              <p className="font-mono text-xs text-text">{item.name}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-faint">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Decisions"
            title="Eight choices worth explaining"
          />
        </Reveal>
        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
          {decisions.map((decision) => (
            <article key={decision.title} className="bg-surface p-5">
              <h3 className="leading-snug font-medium text-text">
                {decision.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {decision.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Checks"
            title="What the build enforces"
            description="Claims on this page are only worth making if something fails when they stop being true."
          />
        </Reveal>
        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            "TypeScript strict",
            "Every route prerendered",
            "Zod-validated content",
            "0 production vulnerabilities",
            "No horizontal scroll at 375px",
            "prefers-reduced-motion respected",
          ].map((check) => (
            <li key={check}>
              <Badge tone="ok">{check}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
