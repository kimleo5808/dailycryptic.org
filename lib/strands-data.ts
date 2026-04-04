import { readFileSync } from "fs";
import { join } from "path";
import type {
  StrandsDataFile,
  StrandsPuzzle,
  StrandsBoardsFile,
  StrandsBoardData,
  DecodedStrandsPuzzle,
  StrandsMonthData,
} from "@/types/strands";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodePuzzle(puzzle: StrandsPuzzle): DecodedStrandsPuzzle {
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    clue: puzzle.clue,
    hint: puzzle.hint,
    theme: fromBase64(puzzle.theme),
    spangram: fromBase64(puzzle.spangram),
    spangramDirection: puzzle.spangramDirection,
    spangramLetterCount: puzzle.spangramLetterCount,
    themeWords: puzzle.themeWords.map(fromBase64),
  };
}

let _raw: StrandsPuzzle[] | null = null;
let _decoded: DecodedStrandsPuzzle[] | null = null;

function getRawPublished(): StrandsPuzzle[] {
  if (!_raw) {
    const rawData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "strands", "puzzles.json"), "utf8")
    ) as StrandsDataFile;
    const today = new Date().toISOString().split("T")[0];
    _raw = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate));
  }
  return _raw;
}

function getPublished(): DecodedStrandsPuzzle[] {
  if (!_decoded) {
    _decoded = getRawPublished().map(decodePuzzle);
  }
  return _decoded;
}

export const getAllStrandsPuzzles = cache(
  async (): Promise<DecodedStrandsPuzzle[]> => getPublished()
);

export const getStrandsPuzzleByDate = cache(
  async (date: string): Promise<DecodedStrandsPuzzle | undefined> =>
    getPublished().find((p) => p.printDate === date)
);

export const getTodaysStrandsPuzzle = cache(
  async (): Promise<DecodedStrandsPuzzle | undefined> => {
    const p = getPublished();
    return p.length > 0 ? p[0] : undefined;
  }
);

export const getRawTodaysStrandsPuzzle = cache(
  async (): Promise<StrandsPuzzle | undefined> => {
    const r = getRawPublished();
    return r.length > 0 ? r[0] : undefined;
  }
);

export const getRawStrandsPuzzleByDate = cache(
  async (date: string): Promise<StrandsPuzzle | undefined> =>
    getRawPublished().find((p) => p.printDate === date)
);

export const getRecentStrandsPuzzles = cache(
  async (count: number = 4): Promise<DecodedStrandsPuzzle[]> =>
    getPublished().slice(1, count + 1)
);

export const getStrandsPuzzlesByMonth = cache(
  async (): Promise<StrandsMonthData[]> => {
    const months = new Map<string, DecodedStrandsPuzzle[]>();
    for (const puzzle of getPublished()) {
      const monthKey = puzzle.printDate.slice(0, 7);
      const arr = months.get(monthKey);
      if (arr) arr.push(puzzle);
      else months.set(monthKey, [puzzle]);
    }
    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, puzzles]) => {
        const [year] = key.split("-");
        const monthName = new Date(`${key}-01`).toLocaleString("en", { month: "long" });
        const first = puzzles[puzzles.length - 1];
        const last = puzzles[0];
        return {
          label: `${monthName} ${year}`,
          rangeLabel: `Strands #${first.id}–#${last.id} (${monthName} ${year})`,
          puzzles,
        };
      });
  }
);

export const getAdjacentStrandsPuzzles = cache(
  async (date: string): Promise<{
    prev: DecodedStrandsPuzzle | undefined;
    next: DecodedStrandsPuzzle | undefined;
  }> => {
    const puzzles = getPublished();
    const idx = puzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: puzzles[idx + 1],
      next: idx > 0 ? puzzles[idx - 1] : undefined,
    };
  }
);

function loadBoards(): StrandsBoardsFile {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "strands", "boards.json"), "utf8")
  );
}

export const getStrandsBoardByDate = cache(
  async (date: string): Promise<StrandsBoardData | undefined> =>
    loadBoards().boards[date]
);

export const getTodaysStrandsBoard = cache(
  async (): Promise<StrandsBoardData | undefined> => {
    const r = getRawPublished();
    if (r.length === 0) return undefined;
    return loadBoards().boards[r[0].printDate];
  }
);
