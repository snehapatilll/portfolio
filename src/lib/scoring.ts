import type { Requirement, Importance } from "@/content/fixtures/types";

/**
 * The same split the job assistant uses: the model classifies each requirement
 * (how important is it, does the resume meet it), and this code computes the
 * score from those labels.
 *
 * Running it in the browser is the point — the visitor can see that the number
 * follows from the classifications by arithmetic, not from a second model call.
 */

/** Mirrors IMPORTANCE_WEIGHT in the assistant's analysisService. */
export const WEIGHTS: Record<Importance, number> = {
  critical: 3,
  important: 2,
  nice_to_have: 1,
};

export type ScoreBreakdown = {
  score: number;
  earned: number;
  available: number;
  byImportance: {
    importance: Importance;
    matched: number;
    total: number;
    weight: number;
  }[];
};

export function scoreRequirements(
  requirements: readonly Requirement[],
): ScoreBreakdown {
  const available = requirements.reduce(
    (sum, requirement) => sum + WEIGHTS[requirement.importance],
    0,
  );

  const earned = requirements.reduce(
    (sum, requirement) =>
      requirement.matched ? sum + WEIGHTS[requirement.importance] : sum,
    0,
  );

  const byImportance = (["critical", "important", "nice_to_have"] as const).map(
    (importance) => {
      const group = requirements.filter((r) => r.importance === importance);
      return {
        importance,
        matched: group.filter((r) => r.matched).length,
        total: group.length,
        weight: WEIGHTS[importance],
      };
    },
  );

  return {
    // Rounded once, at the boundary — never carried through the arithmetic.
    score: available === 0 ? 0 : Math.round((earned / available) * 100),
    earned,
    available,
    byImportance,
  };
}
