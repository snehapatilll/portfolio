/**
 * `@types/mdx` declares `*.mdx` with only a default export, but each note also
 * exports a `meta` object. Ambient module declarations merge, so this adds the
 * named export without replacing the default one.
 *
 * It is deliberately `unknown`: the shape is enforced at runtime by
 * `noteMetaSchema.parse` in src/content/notes/index.ts, so a note with a
 * missing or misspelled field fails the build with a Zod error naming the
 * field — which is more useful than a structural type that only checks the
 * literal written here.
 */
declare module "*.mdx" {
  export const meta: unknown;
}
