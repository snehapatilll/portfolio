import type { MDXComponents } from "mdx/types";

/**
 * Prose styles for note bodies. Defined here rather than with a typography
 * plugin so the measure, rhythm and colour all come from the same tokens the
 * rest of the site uses.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-12 scroll-mt-20 text-xl font-medium text-text first:mt-0"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-8 text-base font-medium text-text" {...props} />
    ),
    p: (props) => (
      <p className="mt-4 leading-relaxed text-muted" {...props} />
    ),
    ul: (props) => <ul className="mt-4 space-y-2" {...props} />,
    ol: (props) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted" {...props} />
    ),
    li: (props) => <li className="leading-relaxed text-muted" {...props} />,
    strong: (props) => (
      <strong className="font-medium text-text" {...props} />
    ),
    a: (props) => (
      <a
        className="text-accent underline underline-offset-4 transition-opacity hover:opacity-80"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-2 border-accent pl-4 text-text"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="border border-border bg-surface px-1 py-0.5 font-mono text-[0.8125em] text-text"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="mt-6 overflow-x-auto border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-muted [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
        {...props}
      />
    ),
    hr: () => <hr className="mt-10 border-border" />,
    ...components,
  };
}
