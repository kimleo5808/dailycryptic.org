import { readFileSync } from "fs";
import { join } from "path";
import type {
  WordleDataFile,
  WordlePuzzle,
  DecodedWordlePuzzle,
  WordleMonthData,
} from "@/types/wordle";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodePuzzle(puzzle: WordlePuzzle): DecodedWordlePuzzle {
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    solution: fromBase64(puzzle.solution),
    hint1: puzzle.hint1,
    hint2: puzzle.hint2,
    hint3: puzzle.hint3,
  };
}

let _raw: WordlePuzzle[] | null = null;
let _decoded: DecodedWordlePuzzle[] | null = null;

function getRawPublished(): WordlePuzzle[] {
  if (!_raw) {
    const rawData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "wordle", "puzzles.json"), "utf8")
    ) as WordleDataFile;
    const today = new Date().toISOString().split("T")[0];
    _raw = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate));
  }
  return _raw;
}

function getPublished(): DecodedWordlePuzzle[] {
  if (!_decoded) {
    _decoded = getRawPublished().map(decodePuzzle);
  }
  return _decoded;
}

export const getAllWordlePuzzles = cache(
  async (): Promise<DecodedWordlePuzzle[]> => getPublished()
);

export const getWordlePuzzleByDate = cache(
  async (date: string): Promise<DecodedWordlePuzzle | undefined> =>
    getPublished().find((p) => p.printDate === date)
);

export const getTodaysWordlePuzzle = cache(
  async (): Promise<DecodedWordlePuzzle | undefined> => {
    const p = getPublished();
    return p.length > 0 ? p[0] : undefined;
  }
);

export const getRawTodaysWordlePuzzle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    const r = getRawPublished();
    return r.length > 0 ? r[0] : undefined;
  }
);

export const getRecentWordlePuzzles = cache(
  async (count: number = 4): Promise<DecodedWordlePuzzle[]> =>
    getPublished().slice(1, count + 1)
);

export const getWordlePuzzlesByMonth = cache(
  async (): Promise<WordleMonthData[]> => {
    const months = new Map<string, DecodedWordlePuzzle[]>();
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
          rangeLabel: `Wordle #${first.id}–#${last.id} (${monthName} ${year})`,
          puzzles,
        };
      });
  }
);

export const getAdjacentWordlePuzzles = cache(
  async (date: string): Promise<{
    prev: DecodedWordlePuzzle | undefined;
    next: DecodedWordlePuzzle | undefined;
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
