import { cn } from "@/lib/utils";

/**
 * Mono eyebrow over a sans heading. Used on every section so the page has one
 * consistent rhythm, and the mono/sans contrast carries the technical register.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /**
   * The page's primary heading must be an h1, or the document starts its
   * hierarchy at h2 with nothing above it — which is what a screen reader
   * reads out, and what a crawler indexes. Sections within a page stay h2.
   */
  as?: "h1" | "h2";
}) {
  const Heading = as;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6",
        "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <Heading
          className={cn(
            "mt-2 font-medium",
            as === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
