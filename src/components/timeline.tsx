import type { Role } from "@/lib/schemas";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** "2025-09" -> "Sep 2025". Parsed by hand so there is no timezone involved. */
function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function Timeline({ roles }: { roles: readonly Role[] }) {
  return (
    <ol className="border-l border-border">
      {roles.map((role) => (
        <li key={`${role.company}-${role.start}`} className="relative pb-12 pl-6 last:pb-0">
          <span
            className="absolute top-1.5 -left-[3px] size-1.5 bg-accent"
            aria-hidden
          />

          {/*
            Date ranges only, no computed duration. A per-role figure here and
            the summary figure on the home page are two different roundings of
            the same months, and showing both invites the reader to reconcile
            them. The dates are the primary source either way.
          */}
          <p className="eyebrow">
            {formatMonth(role.start)} — {formatMonth(role.end)}
          </p>

          <h3 className="mt-2 font-medium text-text">
            {role.title}
            <span className="text-muted"> · {role.company}</span>
          </h3>
          <p className="mt-0.5 font-mono text-[0.6875rem] text-faint">
            {role.location}
          </p>

          <ul className="mt-4 space-y-2.5">
            {role.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex max-w-[68ch] gap-3 text-sm leading-relaxed text-muted"
              >
                <span
                  className="mt-2 size-1 shrink-0 bg-border-strong"
                  aria-hidden
                />
                {highlight}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
