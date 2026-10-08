import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { ContactBlock } from "@/components/contact-block";
import { MetricStrip } from "@/components/metric-strip";
import { CaseStudyTeaser } from "@/components/case-study-card";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { profile } from "@/content/profile";
import { caseStudies } from "@/content/work";
import { formatNoteDate, notes } from "@/content/notes";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MetricStrip metrics={profile.metrics} />

      <div className="mx-auto max-w-[1100px] space-y-24 px-4 py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Labs"
            title="Three things you can actually press"
            description="A working clone of the four-role permission model I built, the job assistant's scoring with the arithmetic shown, and the API contract behind it."
            action={
              <Button asChild variant="primary">
                <Link href="/labs">Open Labs</Link>
              </Button>
            }
          />
        </Reveal>

        <section>
          <Reveal>
            <SectionHeader
              eyebrow="Selected work"
              title="Selected case studies"
              description="Context, constraint, what I built, what I decided and rejected, outcome, what I would change."
              action={
                <Button asChild variant="secondary">
                  <Link href="/work">All work</Link>
                </Button>
              }
            />
          </Reveal>
          {/* Three compact teasers, not the full cards from /work — the home
              page should make someone want the detail, not duplicate it. */}
          <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.slice(0, 3).map((study, index) => (
              <Reveal key={study.slug} delay={index * 0.06} className="h-full">
                <CaseStudyTeaser study={study} />
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <SectionHeader
            eyebrow="Infrastructure"
            title="A database with no route to the internet"
            description="The VPC topology behind my job assistant, annotated with the reasoning — including the two defaults I avoided that would have cost $53 a month, and the three things that went wrong."
            action={
              <Button asChild variant="secondary">
                <Link href="/infrastructure">See the topology</Link>
              </Button>
            }
          />
        </Reveal>

        <section>
          <Reveal>
            <SectionHeader
              eyebrow="Notes"
              title="Decisions, written down"
              description="The constraint, what I chose, and what I rejected."
              action={
                <Button asChild variant="secondary">
                  <Link href="/notes">All notes</Link>
                </Button>
              }
            />
          </Reveal>
          <ul className="mt-8 border-t border-border">
            {notes.slice(0, 3).map((note, index) => (
              <Reveal key={note.slug} delay={index * 0.05}>
                <li className="border-b border-border">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group flex items-start justify-between gap-6 py-5 transition-colors hover:bg-surface"
                  >
                    <span className="max-w-[68ch] px-1">
                      <span className="eyebrow block">
                        {formatNoteDate(note.date)} · {note.readingMinutes} min
                      </span>
                      <span className="mt-1.5 block leading-snug font-medium text-text">
                        {note.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {note.hook}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="mt-1 mr-1 size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                      aria-hidden
                    />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        <section>
          <Reveal>
            <SectionHeader
              eyebrow="Contact"
              title="Available immediately"
              description="Bangalore or remote."
            />
          </Reveal>
          <div className="mt-8">
            <ContactBlock />
          </div>
        </section>
      </div>
    </>
  );
}
