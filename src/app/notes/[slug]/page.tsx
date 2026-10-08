import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatNoteDate, getNote, notes } from "@/content/notes";

/**
 * Static imports keyed by slug. A glob would be shorter, but this keeps every
 * note visible to the bundler and makes an unknown slug a compile-time fact
 * rather than a runtime lookup that silently returns nothing.
 */
const noteBodies = {
  "deterministic-scoring": () =>
    import("@/content/notes/deterministic-scoring.mdx"),
  "strapi-flattening": () => import("@/content/notes/strapi-flattening.mdx"),
  "contract-parity-migration": () =>
    import("@/content/notes/contract-parity-migration.mdx"),
} as const;

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return { title: note.title, description: note.hook };
}

export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <article className="mx-auto max-w-[1100px] px-4 py-16">
      <Link
        href="/notes"
        className="inline-flex items-center gap-2 font-mono text-xs tracking-wide text-muted uppercase transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        All notes
      </Link>

      <Suspense fallback={<NoteSkeleton />}>
        <NoteBody params={params} />
      </Suspense>
    </article>
  );
}

function NoteSkeleton() {
  return (
    <div className="mt-8 max-w-[68ch] animate-pulse" aria-hidden>
      <div className="h-3 w-40 bg-surface" />
      <div className="mt-5 h-8 w-full bg-surface" />
      <div className="mt-2 h-8 w-2/3 bg-surface" />
      <div className="mt-8 h-4 w-full bg-surface" />
      <div className="mt-2 h-4 w-11/12 bg-surface" />
      <div className="mt-2 h-4 w-4/5 bg-surface" />
    </div>
  );
}

async function NoteBody({
  params,
}: {
  params: PageProps<"/notes/[slug]">["params"];
}) {
  const { slug } = await params;
  const note = getNote(slug);
  const load = noteBodies[slug as keyof typeof noteBodies];

  if (!note || !load) notFound();

  const { default: Content } = await load();

  return (
    <>
      <header className="mt-8 max-w-[68ch] border-b border-border pb-8">
        <p className="eyebrow">
          {formatNoteDate(note.date)} · {note.readingMinutes} min read
        </p>
        <h1 className="mt-3 text-3xl leading-tight font-medium sm:text-4xl">
          {note.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">{note.hook}</p>
      </header>

      <div className="mt-10 max-w-[68ch]">
        <Content />
      </div>
    </>
  );
}
