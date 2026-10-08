import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { formatNoteDate, notes } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short write-ups of technical decisions — what the constraint was, what I chose, and what I rejected.",
};

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-20">
      <SectionHeader
        eyebrow="Notes"
        title="Decisions, written down"
        description="Short pieces on choices I had to defend — the constraint, the option I took, and the one I did not. These are the questions an interview asks anyway."
        as="h1"
      />

      <ul className="mt-10 border-t border-border">
        {notes.map((note, index) => (
          <Reveal key={note.slug} delay={index * 0.05}>
            <li className="border-b border-border">
              <Link
                href={`/notes/${note.slug}`}
                className="group block py-7 transition-colors hover:bg-surface"
              >
                <div className="flex items-start justify-between gap-6 px-1">
                  <div className="max-w-[68ch]">
                    <p className="eyebrow">
                      {formatNoteDate(note.date)} · {note.readingMinutes} min
                    </p>
                    <h2 className="mt-2 text-lg leading-snug font-medium text-text">
                      {note.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-muted">
                      {note.hook}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
