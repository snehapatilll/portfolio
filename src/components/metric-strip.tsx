import type { Metric } from "@/lib/schemas";

/**
 * Four numbers, each with the basis for it shown underneath rather than
 * hidden in a tooltip. An unbacked number invites doubt; a backed one invites
 * the question you want to be asked.
 */
export function MetricStrip({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className="grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={[
            "border-border p-5",
            "border-b last:border-b-0",
            "sm:border-b-0",
            index % 2 === 0 ? "sm:border-r" : "",
            "lg:border-r lg:last:border-r-0",
          ].join(" ")}
        >
          <dt className="font-mono text-2xl tabular-nums text-text">
            {metric.value}
          </dt>
          <dd className="mt-1">
            <span className="eyebrow block">{metric.label}</span>
            <span className="mt-2 block text-xs leading-relaxed text-faint">
              {metric.basis}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
