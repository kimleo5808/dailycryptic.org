import puzzlesJson from "@/data/letter-boxed/puzzles.json";
import type {
  LetterBoxedDataFile,
  LetterBoxedPuzzle,
  DecodedLetterBoxedPuzzle,
  LetterBoxedStats,
  LetterBoxedMonthData,
} from "@/types/letter-boxed";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function computeStats(solution: string[]): LetterBoxedStats {
  return {
    wordCount: solution.length,
    wordLengths: solution.map((w) => w.length),
  };
}

function decodePuzzle(puzzle: LetterBoxedPuzzle): DecodedLetterBoxedPuzzle {
  const solution = (JSON.parse(fromBase64(puzzle.solution)) as string[]).map(
    (w) => w.toUpperCase()
  );
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    sides: puzzle.sides,
    letters: puzzle.sides.flatMap((s) => s.split("")),
    solution,
    stats: computeStats(solution),
  };
}

let _decoded: DecodedLetterBoxedPuzzle[] | null = null;

function getPublished(): DecodedLetterBoxedPuzzle[] {
  if (!_decoded) {
    const rawData = puzzlesJson as unknown as LetterBoxedDataFile;
    const today = new Date().toISOString().split("T")[0];
    _decoded = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate))
      .map(decodePuzzle);
  }
  return _decoded;
}

export const getAllLetterBoxedPuzzles = cache(
  async (): Promise<DecodedLetterBoxedPuzzle[]> => getPublished()
);

export const getTodaysLetterBoxedPuzzle = cache(
  async (): Promise<DecodedLetterBoxedPuzzle | undefined> => {
    const p = getPublished();
    return p.length > 0 ? p[0] : undefined;
  }
);

export const getLetterBoxedPuzzleByDate = cache(
  async (date: string): Promise<DecodedLetterBoxedPuzzle | undefined> =>
    getPublished().find((p) => p.printDate === date)
);

export const getRecentLetterBoxedPuzzles = cache(
  async (count: number = 4): Promise<DecodedLetterBoxedPuzzle[]> =>
    getPublished().slice(1, count + 1)
);

export const getLetterBoxedPuzzlesByMonth = cache(
  async (): Promise<LetterBoxedMonthData[]> => {
    const months = new Map<string, DecodedLetterBoxedPuzzle[]>();
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
          rangeLabel: `Letter Boxed answers — ${monthName} ${year}`,
          puzzles,
        };
      });
  }
);

export const getAdjacentLetterBoxedPuzzles = cache(
  async (
    date: string
  ): Promise<{
    prev: DecodedLetterBoxedPuzzle | undefined;
    next: DecodedLetterBoxedPuzzle | undefined;
  }> => {
    const puzzles = getPublished();
    const idx = puzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return { prev: puzzles[idx + 1], next: idx > 0 ? puzzles[idx - 1] : undefined };
  }
);

/** Which side (0–3) a letter sits on, or -1 if not in the puzzle. */
export function letterSide(sides: string[], letter: string): number {
  const up = letter.toUpperCase();
  return sides.findIndex((s) => s.includes(up));
}

const SIDE_NAMES = ["top", "right", "bottom", "left"];

/**
 * Spoiler-free hints derived from the official solution alone (no dictionary):
 * how many words, each word's length, and the first letter of each word with
 * the side it sits on.
 */
export function buildLetterBoxedHints(puzzle: DecodedLetterBoxedPuzzle) {
  return {
    wordCount: puzzle.stats.wordCount,
    wordLengths: puzzle.stats.wordLengths,
    starters: puzzle.solution.map((word) => {
      const side = letterSide(puzzle.sides, word[0]);
      return {
        letter: word[0].toUpperCase(),
        side: side >= 0 ? SIDE_NAMES[side] : "the box",
        length: word.length,
      };
    }),
  };
}
