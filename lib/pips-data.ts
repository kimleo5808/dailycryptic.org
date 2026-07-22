import puzzlesJson from "@/data/pips/puzzles.json";
import type {
  PipsDataFile,
  PipsPuzzle,
  PipsTierRaw,
  PipsTierKey,
  PipsDecodedTier,
  PipsDecodedPuzzle,
  PipsPlacement,
  PipsCell,
  PipsMonthData,
  PipsRegion,
} from "@/types/pips";
import { cache } from "react";

const TIER_KEYS: PipsTierKey[] = ["easy", "medium", "hard"];

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodeTier(tier: PipsTierRaw): PipsDecodedTier {
  const rawSolution = JSON.parse(fromBase64(tier.solution)) as PipsCell[][];

  const placements: PipsPlacement[] = rawSolution.map((placement, i) => {
    const domino = tier.dominoes[i] ?? [0, 0];
    const [cellA, cellB] = placement;
    return {
      cells: [cellA, cellB],
      values: [domino[0], domino[1]],
    };
  });

  // Derive grid bounds from every region + solution coordinate.
  const allCells: PipsCell[] = [];
  for (const region of tier.regions) allCells.push(...region.indices);
  for (const placement of placements) allCells.push(...placement.cells);

  let rows = 0;
  let cols = 0;
  for (const [r, c] of allCells) {
    if (r + 1 > rows) rows = r + 1;
    if (c + 1 > cols) cols = c + 1;
  }

  // Board cells = union of region indices (deduped).
  const seen = new Set<string>();
  const boardCells: PipsCell[] = [];
  for (const region of tier.regions) {
    for (const [r, c] of region.indices) {
      const key = `${r},${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        boardCells.push([r, c]);
      }
    }
  }

  return {
    id: tier.id,
    dominoes: tier.dominoes,
    regions: tier.regions,
    placements,
    rows,
    cols,
    boardCells,
  };
}

function decodePuzzle(puzzle: PipsPuzzle): PipsDecodedPuzzle {
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    editor: puzzle.editor,
    tiers: {
      easy: decodeTier(puzzle.tiers.easy),
      medium: decodeTier(puzzle.tiers.medium),
      hard: decodeTier(puzzle.tiers.hard),
    },
  };
}

let _decoded: PipsDecodedPuzzle[] | null = null;

function getPublished(): PipsDecodedPuzzle[] {
  if (!_decoded) {
    const rawData = puzzlesJson as unknown as PipsDataFile;
    const today = new Date().toISOString().split("T")[0];
    _decoded = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate))
      .map(decodePuzzle);
  }
  return _decoded;
}

export const getAllPipsPuzzles = cache(
  async (): Promise<PipsDecodedPuzzle[]> => getPublished()
);

export const getTodaysPipsPuzzle = cache(
  async (): Promise<PipsDecodedPuzzle | undefined> => {
    const p = getPublished();
    return p.length > 0 ? p[0] : undefined;
  }
);

export const getPipsPuzzleByDate = cache(
  async (date: string): Promise<PipsDecodedPuzzle | undefined> =>
    getPublished().find((p) => p.printDate === date)
);

export const getRecentPipsPuzzles = cache(
  async (count: number = 4): Promise<PipsDecodedPuzzle[]> =>
    getPublished().slice(1, count + 1)
);

export const getPipsPuzzlesByMonth = cache(
  async (): Promise<PipsMonthData[]> => {
    const months = new Map<string, PipsDecodedPuzzle[]>();
    for (const puzzle of getPublished()) {
      const key = puzzle.printDate.slice(0, 7);
      const arr = months.get(key);
      if (arr) arr.push(puzzle);
      else months.set(key, [puzzle]);
    }
    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, puzzles]) => {
        const [year] = key.split("-");
        const monthName = new Date(`${key}-01`).toLocaleString("en", {
          month: "long",
        });
        return {
          label: `${monthName} ${year}`,
          rangeLabel: `Pips answers — ${monthName} ${year}`,
          puzzles,
        };
      });
  }
);

export const getAdjacentPipsPuzzles = cache(
  async (
    date: string
  ): Promise<{
    prev: PipsDecodedPuzzle | undefined;
    next: PipsDecodedPuzzle | undefined;
  }> => {
    const puzzles = getPublished();
    const idx = puzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return { prev: puzzles[idx + 1], next: idx > 0 ? puzzles[idx - 1] : undefined };
  }
);

/* ----------------------------- helpers ----------------------------------- */

export { TIER_KEYS };

/** Human label for a region constraint, e.g. "= (all equal)" or "sum to 6". */
export function describeRegion(region: PipsRegion): string {
  switch (region.type) {
    case "equals":
      return "all cells equal";
    case "unequal":
      return "all cells different";
    case "sum":
      return `sum to ${region.target}`;
    case "greater":
      return `greater than ${region.target}`;
    case "less":
      return `less than ${region.target}`;
    case "empty":
      return "no constraint";
    default:
      return region.type;
  }
}

/** Short badge glyph for a region constraint used on the board. */
export function regionBadge(region: PipsRegion): string {
  switch (region.type) {
    case "equals":
      return "=";
    case "unequal":
      return "≠";
    case "sum":
      return `${region.target}`;
    case "greater":
      return `>${region.target}`;
    case "less":
      return `<${region.target}`;
    case "empty":
      return "";
    default:
      return "";
  }
}

/**
 * Spoiler-free strategy hint for a tier: describes the shape of the board and
 * where to start, without giving away any placement.
 */
export function buildStrategyHint(tier: PipsDecodedTier): string {
  const equalsCount = tier.regions.filter((r) => r.type === "equals").length;
  const constrainedCount = tier.regions.filter(
    (r) => r.type !== "empty"
  ).length;

  // Tightest numeric constraint = smallest sum/less target.
  const sums = tier.regions
    .filter((r) => r.type === "sum" && typeof r.target === "number")
    .map((r) => r.target as number);
  const tightestSum = sums.length ? Math.min(...sums) : undefined;

  const parts: string[] = [
    `This board has ${tier.dominoes.length} dominoes to place across ${constrainedCount} constrained region${
      constrainedCount === 1 ? "" : "s"
    }.`,
  ];
  if (equalsCount > 0) {
    parts.push(
      `Start with the ${equalsCount} "equal" region${
        equalsCount > 1 ? "s" : ""
      } — every cell there must hold the same value, which locks options fast.`
    );
  }
  if (typeof tightestSum === "number") {
    parts.push(
      `The tightest sum region totals just ${tightestSum}, so only low pip values fit there.`
    );
  }
  parts.push(
    "Unmarked cells carry no rule of their own, so save them for whichever dominoes are left over."
  );
  return parts.join(" ");
}
