import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { caseStudies, getCaseStudy } from "@/content/work";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}


export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-border py-10 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="eyebrow md:pt-1">{label}</h2>
      <div className="max-w-[68ch]">{children}</div>
    </section>
  );
}

/**
 * The shell — the back link and page frame — is the same for every slug, so it
 * renders instantly. Under Cache Components `params` is request-time URL data,
 * so reading it has to happen inside a Suspense boundary; otherwise the route
 * is held to a partial prerender and prefetching any case-study link drags the
 * dynamic shell along with it.
 */
export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <article className="mx-auto max-w-[1100px] px-4 py-16">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-xs tracking-wide text-muted uppercase transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All work
      </Link>

      <Suspense fallback={<CaseStudySkeleton />}>
        <CaseStudyBody params={params} />
      </Suspense>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className="mt-8 animate-pulse" aria-hidden>
      <div className="h-3 w-48 bg-surface" />
      <div className="mt-5 h-9 w-full max-w-2xl bg-surface" />
      <div className="mt-3 h-9 w-full max-w-md bg-surface" />
      <div className="mt-6 h-4 w-full max-w-[68ch] bg-surface" />
      <div className="mt-2 h-4 w-full max-w-[52ch] bg-surface" />
    </div>
  );
}

async function CaseStudyBody({
  params,
}: {
  params: PageProps<"/work/[slug]">["params"];
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  return (
    <>
      <header className="mt-8 max-w-[68ch]">
        <p className="eyebrow">
          {study.org} · {study.period}
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-medium sm:text-4xl">
          {study.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          {study.summary}
        </p>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {study.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      </header>

      {/*
        The skim layer. Most readers give a case study well under a minute, so
        the three things worth taking away sit above the prose rather than
        being recoverable only by reading all of it.
      */}
      <dl className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        {[
          { term: "What I owned", detail: study.owned },
          { term: "The hard part", detail: study.hardPart },
          { term: "Result", detail: study.result },
        ].map(({ term, detail }) => (
          <div key={term} className="bg-surface p-4">
            <dt className="eyebrow">{term}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-text">{detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        {study.screenshots ? (
          <Section label="Interface">
            <ul className="space-y-8">
              {study.screenshots.map((shot, index) => (
                <li key={shot.src}>
                  <div className="overflow-hidden border border-border bg-surface">
                    <Image
                      src={shot.src}
                      alt={shot.caption}
                      width={1600}
                      height={1000}
                      className="h-auto w-full"
                      sizes="(max-width: 768px) 100vw, 700px"
                      priority={index === 0}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-faint">
                    {shot.caption}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {study.team ? (
          <Section label="Team">
            <p className="leading-relaxed text-muted">{study.team}</p>
          </Section>
        ) : null}

        <Reveal>
          <Section label="Context">
            <p className="leading-relaxed text-muted">{study.context}</p>
          </Section>
        </Reveal>

        <Reveal>
          <Section label="Constraint">
            <p className="leading-relaxed text-muted">{study.constraint}</p>
          </Section>
        </Reveal>

        <Reveal>
          <Section label="What I built">
            <ul className="space-y-3">
              {study.built.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 leading-relaxed text-muted"
                >
                  <span className="mt-2 size-1 shrink-0 bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </Reveal>

        <Reveal>
          <Section label="Decisions & tradeoffs">
            <ol className="space-y-8">
              {study.decisions.map((entry, index) => (
                <li key={entry.decision}>
                  <p className="font-mono text-[0.6875rem] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 leading-relaxed font-medium text-text">
                    {entry.decision}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-faint">
                    <span className="font-mono text-[0.6875rem] tracking-wide uppercase">
                      Rejected ·{" "}
                    </span>
                    {entry.rejected}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted">{entry.why}</p>
                </li>
              ))}
            </ol>
          </Section>
        </Reveal>

        <Reveal>
          <Section label="Outcome">
            <ul className="space-y-3">
              {study.outcome.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 leading-relaxed text-muted"
                >
                  <span className="mt-2 size-1 shrink-0 bg-ok" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </Reveal>

        {slug === "job-assistant" ? (
          <Section label="Infrastructure">
            <p className="leading-relaxed text-muted">
              The VPC topology, the two AWS defaults I avoided, and the three
              things that went wrong while building it are written up
              separately.
            </p>
            <p className="mt-4">
              <Link
                href="/infrastructure"
                className="font-mono text-xs tracking-wide text-accent uppercase underline underline-offset-4"
              >
                See the topology
              </Link>
            </p>
          </Section>
        ) : null}

        <Reveal>
          <Section label="What I'd change">
            <p className="leading-relaxed text-muted">{study.wouldChange}</p>
          </Section>
        </Reveal>
      </div>
    </>
  );
}
