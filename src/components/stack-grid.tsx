import type { StackGroup } from "@/lib/schemas";

/**
 * Every tool carries one line saying where it was actually used.
 *
 * No percentage bars: "React 85%" is unverifiable and invites doubt about
 * everything next to it. A specific claim invites the question you want.
 */
export function StackGrid({ groups }: { groups: readonly StackGroup[] }) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.group}>
          <h3 className="eyebrow border-b border-border pb-2">
            {group.group}
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {group.items.map((item) => (
              <div key={item.name} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-3">
                <dt className="font-mono text-xs text-text">{item.name}</dt>
                <dd className="text-xs leading-relaxed text-muted">
                  {item.usedFor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
