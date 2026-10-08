"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validatedRuns } from "@/content/fixtures/runs";
import { WEIGHTS, scoreRequirements } from "@/lib/scoring";
import type { Importance } from "@/content/fixtures/types";

const importanceLabel: Record<Importance, string> = {
  critical: "Critical",
  important: "Important",
  nice_to_have: "Nice to have",
};

export function AssistantDemo() {
  const [activeId, setActiveId] = useState(validatedRuns[0]!.id);

  const run = useMemo(
    () => validatedRuns.find((r) => r.id === activeId) ?? validatedRuns[0]!,
    [activeId],
  );

  // Computed here, in the browser, from the classifications in the fixture.
  const breakdown = useMemo(
    () => scoreRequirements(run.requirements),
    [run],
  );

  const matched = run.requirements.filter((r) => r.matched);
  const missing = run.requirements.filter((r) => !r.matched);

  return (
    <div className="border border-border bg-surface">
      {run.provenance === "placeholder" ? (
        <p className="flex items-start gap-2 border-b border-warn/30 bg-warn/5 px-4 py-3 text-xs leading-relaxed text-warn">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            <strong className="font-medium">Sample data.</strong> These
            classifications are hand-written to demonstrate the interface — they
            are not model output. The scoring below is the real algorithm.
          </span>
        </p>
      ) : (
        <p className="border-b border-border px-4 py-3 font-mono text-[0.6875rem] text-faint">
          Recorded output from a real run on {run.recordedAt}. The live app runs
          against AWS — ask me and I&rsquo;ll spin it up.
        </p>
      )}

      {/* Job selector */}
      <div className="border-b border-border p-4 sm:p-5">
        <p className="eyebrow">Job description</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {validatedRuns.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === run.id}
              onClick={() => setActiveId(option.id)}
              className={cn(
                "border p-3 text-left transition-colors",
                option.id === run.id
                  ? "border-accent bg-raised"
                  : "border-border hover:border-border-strong",
              )}
            >
              <span className="block text-xs leading-snug font-medium text-text">
                {option.roleTitle}
              </span>
              <span className="mt-1 block font-mono text-[0.625rem] text-faint">
                {option.companyDescriptor}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Score */}
      {/*
        Grid children default to min-width:auto, so the long mono weighting
        line sets a max-content floor and the column grows past the card on a
        narrow screen. min-w-0 lets them shrink and wrap instead.
      */}
      <div className="grid gap-5 border-b border-border p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:p-5">
        <div className="min-w-0">
          <p className="eyebrow">Fit score</p>
          <p
            data-testid="fit-score"
            className="mt-1 font-mono text-4xl tabular-nums text-accent"
          >
            {breakdown.score}
            <span className="text-lg text-faint">/100</span>
          </p>
        </div>

        <div className="min-w-0">
          <p
            data-testid="score-breakdown"
            className="font-mono text-[0.6875rem] text-faint"
          >
            {breakdown.earned} of {breakdown.available} weighted points · critical
            ×{WEIGHTS.critical} · important ×{WEIGHTS.important} · nice_to_have
            ×{WEIGHTS.nice_to_have}
          </p>
          <ul className="mt-3 space-y-1.5">
            {breakdown.byImportance.map((group) => (
              <li
                key={group.importance}
                className="flex items-center gap-3 font-mono text-[0.6875rem]"
              >
                <span className="w-24 shrink-0 text-muted">
                  {importanceLabel[group.importance]}
                </span>
                <span
                  className="h-1.5 flex-1 bg-raised"
                  role="presentation"
                >
                  <span
                    className="block h-full bg-accent"
                    style={{
                      width: `${group.total === 0 ? 0 : (group.matched / group.total) * 100}%`,
                    }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right text-faint">
                  {group.matched}/{group.total}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Computed in this page from the per-requirement labels — not asked of
            the model. Same input, same number, every time.
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="grid gap-px bg-border md:grid-cols-2">
        <div className="bg-surface p-4 sm:p-5">
          <p className="eyebrow">
            Matched · {matched.length}
          </p>
          <ul className="mt-3 space-y-3">
            {matched.map((requirement) => (
              <li key={requirement.text} className="flex gap-2.5">
                <Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden />
                <span>
                  <span className="block text-sm leading-snug text-text">
                    {requirement.text}
                  </span>
                  {requirement.evidence ? (
                    <span className="mt-1 block text-xs leading-relaxed text-faint">
                      {requirement.evidence}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface p-4 sm:p-5">
          <p className="eyebrow">Missing · {missing.length}</p>
          <ul className="mt-3 space-y-3">
            {missing.map((requirement) => (
              <li key={requirement.text} className="flex gap-2.5">
                <X className="mt-0.5 size-3.5 shrink-0 text-fail" aria-hidden />
                <span>
                  <span className="block text-sm leading-snug text-muted">
                    {requirement.text}
                  </span>
                  <span className="mt-1 block font-mono text-[0.625rem] text-faint">
                    {importanceLabel[requirement.importance]} · weight{" "}
                    {WEIGHTS[requirement.importance]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tailored bullets */}
      <div className="border-t border-border p-4 sm:p-5">
        <p className="eyebrow">Suggested resume bullets</p>
        <ul className="mt-3 space-y-3">
          {run.tailoredBullets.map((bullet) => (
            <li
              key={bullet}
              className="border-l-2 border-accent pl-3 text-sm leading-relaxed text-muted"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
