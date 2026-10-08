import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/lib/schemas";

/**
 * The full card, used on /work.
 *
 * `h-full` plus a column flex makes every card in a row the same height
 * regardless of how long its result line runs, and `mt-auto` pins the tag row
 * to the bottom so the tags line up across the grid instead of floating at
 * whatever height the prose above them ended.
 */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex h-full flex-col border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-raised"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{study.org}</p>
          <p className="mt-1 font-mono text-[0.6875rem] text-faint">
            {study.period}
          </p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
          aria-hidden
        />
      </div>

      <h3 className="mt-5 text-lg leading-snug font-medium">{study.title}</h3>

      {/* The card carries the result, not the summary — it is what a reader
          scanning the grid actually needs in order to pick one. */}
      <p className="mt-3 text-sm leading-relaxed text-muted">{study.result}</p>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <span className="font-mono tracking-wide uppercase">Hard part · </span>
        {study.hardPart}
      </p>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {study.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>
    </Link>
  );
}

/**
 * The compact teaser, used on the home page.
 *
 * Home previously rendered the same full cards as /work, which made the two
 * pages read as duplicates. This drops the tags and the hard-part line and
 * keeps only what decides whether someone clicks — so /work remains the place
 * that actually carries the detail.
 */
export function CaseStudyTeaser({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex h-full flex-col border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-raised"
    >
      <p className="eyebrow">{study.org}</p>

      <h3 className="mt-3 leading-snug font-medium text-text">{study.title}</h3>

      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        {study.result}
      </p>

      <span className="mt-auto flex items-center gap-1.5 pt-5 font-mono text-[0.625rem] tracking-wide text-faint uppercase transition-colors group-hover:text-accent">
        Read the case study
        <ArrowUpRight className="size-3" aria-hidden />
      </span>
    </Link>
  );
}
