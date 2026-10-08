import { noteMetaSchema, type NoteMeta } from "@/lib/schemas";
import { meta as deterministicScoring } from "./deterministic-scoring.mdx";
import { meta as strapiFlattening } from "./strapi-flattening.mdx";
import { meta as contractParityMigration } from "./contract-parity-migration.mdx";

/**
 * Each note's metadata is an `export const meta` in its own .mdx file, parsed
 * here. No frontmatter parser is involved — which keeps a YAML dependency with
 * known advisories out of the tree, and means a malformed note fails the build
 * rather than rendering a page with an empty title.
 *
 * Imports are static rather than globbed so the set of notes is explicit and
 * the bundler can see every one of them.
 */
const rawMetas: unknown[] = [
  deterministicScoring,
  strapiFlattening,
  contractParityMigration,
];

export const notes: readonly NoteMeta[] = rawMetas
  .map((raw) => noteMetaSchema.parse(raw))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getNote(slug: string): NoteMeta | undefined {
  return notes.find((note) => note.slug === slug);
}

export function formatNoteDate(date: string): string {
  // Fixed locale and UTC so the server and client cannot disagree.
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
