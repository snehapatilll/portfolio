import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "ok" | "warn" | "fail";

const tones: Record<Tone, string> = {
  neutral: "border-border text-muted",
  accent: "border-accent/40 text-accent",
  ok: "border-ok/40 text-ok",
  warn: "border-warn/40 text-warn",
  fail: "border-fail/40 text-fail",
};

/** Hairline chip for tags and statuses. No fills — borders carry the weight. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5",
        "font-mono text-[0.6875rem] tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
