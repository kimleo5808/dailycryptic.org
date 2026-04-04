import puzzlesData from "@/data/wordle/puzzles.json";
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

const rawData = puzzlesData as unknown as WordleDataFile;
const today = new Date().toISOString().split("T")[0];

const rawPublished = rawData.puzzles
  .filter((p) => {
    if (p.status === "scheduled") return p.printDate <= today;
    return true;
  })
  .sort((a, b) => b.printDate.localeCompare(a.printDate));

const publishedPuzzles = rawPublished.map(decodePuzzle);

export const getAllWordlePuzzles = cache(
  async (): Promise<DecodedWordlePuzzle[]> => {
    return publishedPuzzles;
  }
);

export const getWordlePuzzleByDate = cache(
  async (date: string): Promise<DecodedWordlePuzzle | undefined> => {
    return publishedPuzzles.find((p) => p.printDate === date);
  }
);

export const getTodaysWordlePuzzle = cache(
  async (): Promise<DecodedWordlePuzzle | undefined> => {
    if (publishedPuzzles.length === 0) return undefined;
    return publishedPuzzles[0];
  }
);

export const getRawTodaysWordlePuzzle = cache(
  async (): Promise<WordlePuzzle | undefined> => {
    if (rawPublished.length === 0) return undefined;
    return rawPublished[0];
  }
);

export const getRecentWordlePuzzles = cache(
  async (count: number = 4): Promise<DecodedWordlePuzzle[]> => {
    return publishedPuzzles.slice(1, count + 1);
  }
);

export const getWordlePuzzlesByMonth = cache(
  async (): Promise<WordleMonthData[]> => {
    const months = new Map<string, DecodedWordlePuzzle[]>();

    for (const puzzle of publishedPuzzles) {
      const monthKey = puzzle.printDate.slice(0, 7);
      const arr = months.get(monthKey);
      if (arr) arr.push(puzzle);
      else months.set(monthKey, [puzzle]);
    }

    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, puzzles]) => {
        const [year] = key.split("-");
        const monthName = new Date(`${key}-01`).toLocaleString("en", {
          month: "long",
        });
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
  async (
    date: string
  ): Promise<{
    prev: DecodedWordlePuzzle | undefined;
    next: DecodedWordlePuzzle | undefined;
  }> => {
    const idx = publishedPuzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: publishedPuzzles[idx + 1],
      next: idx > 0 ? publishedPuzzles[idx - 1] : undefined,
    };
  }
);
