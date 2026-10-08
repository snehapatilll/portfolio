import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/case-study-card";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { caseStudies } from "@/content/work";

const COUNT_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];
/** Derived, so adding a case study cannot leave the heading saying "four". */
const count = COUNT_WORDS[caseStudies.length] ?? String(caseStudies.length);

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies on a fixed spine: context, constraint, what I built, what I decided and rejected, outcome, and what I would change.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-20">
      <SectionHeader
        eyebrow="Selected work"
        title={`${count.charAt(0).toUpperCase() + count.slice(1)} case studies, one shape`}
        description="Each follows the same spine — context, constraint, what I built, the decisions and what I rejected, the outcome, and what I would change. The shape matters more than the prose: these are the questions an interview asks anyway."
        as="h1"
      />

      {/* items-stretch + h-full on the Reveal wrapper so the cards in a row
          match height no matter how long each result line runs. */}
      <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2">
        {caseStudies.map((study, index) => (
          <Reveal key={study.slug} delay={index * 0.06} className="h-full">
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
