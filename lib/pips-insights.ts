import type { PipsDecodedPuzzle, PipsRegionType, PipsTierKey } from "@/types/pips";

/*
 * Archive comparison for a /pips-answers/[date] page: how many dominoes and
 * rules each difficulty uses, how that compares with other days, and whether
 * the set leans on rarer rule types. Derived from the bundled archive.
 */

export const PIPS_TIERS: PipsTierKey[] = ["easy", "medium", "hard"];

/** Rule types in the order and wording used on the page. */
export const RULE_LABELS: Record<PipsRegionType, string> = {
  sum: "sum",
  equals: "equal",
  unequal: "all different",
  greater: "greater than",
  less: "less than",
  empty: "no rule",
};

export interface PipsTierInsights {
  tier: PipsTierKey;
  dominoes: number;
  doubles: number;
  /** Percentage of archive puzzles whose same tier uses fewer dominoes. */
  fewerDominoesPct: number;
  archiveMin: number;
  archiveMax: number;
  ruleCounts: Partial<Record<PipsRegionType, number>>;
  /** Largest sum target on the board, if it has a sum rule. */
  biggestSum?: number;
}

export interface PipsInsights {
  archiveSize: number;
  tiers: PipsTierInsights[];
  /** Puzzles in the archive (this one included) that use an "all different" rule. */
  unequalPuzzles: number;
  usesUnequal: boolean;
}

export function getPipsInsights(
  puzzle: PipsDecodedPuzzle,
  archive: PipsDecodedPuzzle[]
): PipsInsights {
  const tiers = PIPS_TIERS.map((tier) => {
    const t = puzzle.tiers[tier];
    const counts = archive.map((p) => p.tiers[tier].dominoes.length);
    const ruleCounts: Partial<Record<PipsRegionType, number>> = {};
    for (const r of t.regions) ruleCounts[r.type] = (ruleCounts[r.type] ?? 0) + 1;
    const sums = t.regions.filter((r) => r.type === "sum" && r.target !== undefined);
    return {
      tier,
      dominoes: t.dominoes.length,
      doubles: t.dominoes.filter(([a, b]) => a === b).length,
      fewerDominoesPct: Math.round(
        (counts.filter((c) => c < t.dominoes.length).length / archive.length) * 100
      ),
      archiveMin: Math.min(...counts),
      archiveMax: Math.max(...counts),
      ruleCounts,
      biggestSum: sums.length ? Math.max(...sums.map((r) => r.target as number)) : undefined,
    };
  });

  const hasUnequal = (p: PipsDecodedPuzzle) =>
    PIPS_TIERS.some((tier) => p.tiers[tier].regions.some((r) => r.type === "unequal"));

  return {
    archiveSize: archive.length,
    tiers,
    unequalPuzzles: archive.filter(hasUnequal).length,
    usesUnequal: hasUnequal(puzzle),
  };
}
