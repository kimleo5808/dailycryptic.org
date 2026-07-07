import puzzlesJson from "@/data/spelling-bee/puzzles.json";
import type {
  SpellingBeeDataFile,
  SpellingBeePuzzle,
  DecodedSpellingBeePuzzle,
  SpellingBeeStats,
  SpellingBeeMonthData,
} from "@/types/spelling-bee";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

/**
 * NYT Spelling Bee scoring:
 *   - 4-letter word = 1 point
 *   - Longer words = 1 point per letter
 *   - Pangram = word length + 7 bonus points
 * Genius rank = 70% of the maximum score (rounded down).
 */
function computeStats(answers: string[], pangrams: string[]): SpellingBeeStats {
  const pangramSet = new Set(pangrams);
  let maxScore = 0;
  for (const word of answers) {
    let pts = word.length === 4 ? 1 : word.length;
    if (pangramSet.has(word)) pts += 7;
    maxScore += pts;
  }
  const startLetters = new Set(answers.map((w) => w[0]));
  return {
    wordCount: answers.length,
    pangramCount: pangrams.length,
    maxScore,
    geniusScore: Math.floor(maxScore * 0.7),
    isBingo: startLetters.size >= 7,
  };
}

function decodePuzzle(puzzle: SpellingBeePuzzle): DecodedSpellingBeePuzzle {
  const answers = puzzle.answers
    .map(fromBase64)
    .sort((a, b) => a.length - b.length || a.localeCompare(b));
  const pangrams = puzzle.pangrams.map(fromBase64).sort();
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    centerLetter: puzzle.centerLetter,
    outerLetters: puzzle.outerLetters,
    letters: [puzzle.centerLetter, ...puzzle.outerLetters],
    answers,
    pangrams,
    stats: computeStats(answers, pangrams),
  };
}

/* Lazy-load: only read/decode when first accessed, not at module import time. */
let _decoded: DecodedSpellingBeePuzzle[] | null = null;

function getPublished(): DecodedSpellingBeePuzzle[] {
  if (!_decoded) {
    const rawData = puzzlesJson as unknown as SpellingBeeDataFile;
    const today = new Date().toISOString().split("T")[0];
    _decoded = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate))
      .map(decodePuzzle);
  }
  return _decoded;
}

export const getAllSpellingBeePuzzles = cache(
  async (): Promise<DecodedSpellingBeePuzzle[]> => {
    return getPublished();
  }
);

export const getTodaysSpellingBeePuzzle = cache(
  async (): Promise<DecodedSpellingBeePuzzle | undefined> => {
    const puzzles = getPublished();
    return puzzles.length > 0 ? puzzles[0] : undefined;
  }
);

export const getSpellingBeePuzzleByDate = cache(
  async (date: string): Promise<DecodedSpellingBeePuzzle | undefined> => {
    return getPublished().find((p) => p.printDate === date);
  }
);

export const getRecentSpellingBeePuzzles = cache(
  async (count: number = 4): Promise<DecodedSpellingBeePuzzle[]> => {
    return getPublished().slice(1, count + 1);
  }
);

export const getSpellingBeePuzzlesByMonth = cache(
  async (): Promise<SpellingBeeMonthData[]> => {
    const months = new Map<string, DecodedSpellingBeePuzzle[]>();
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
        const monthName = new Date(`${key}-01`).toLocaleString("en", {
          month: "long",
        });
        return {
          label: `${monthName} ${year}`,
          rangeLabel: `Spelling Bee answers — ${monthName} ${year}`,
          puzzles,
        };
      });
  }
);

export const getAdjacentSpellingBeePuzzles = cache(
  async (
    date: string
  ): Promise<{
    prev: DecodedSpellingBeePuzzle | undefined;
    next: DecodedSpellingBeePuzzle | undefined;
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

/**
 * Two-letter list: for each starting two-letter prefix, how many answers begin
 * with it. This is the classic spoiler-free hint the NYT itself publishes.
 * Returns entries sorted alphabetically by prefix.
 */
export function buildTwoLetterList(
  answers: string[]
): { prefix: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const word of answers) {
    const prefix = word.slice(0, 2).toUpperCase();
    counts.set(prefix, (counts.get(prefix) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([prefix, count]) => ({ prefix, count }));
}

/**
 * Word-length distribution: how many answers exist at each length.
 * Returns entries sorted by ascending length.
 */
export function buildLengthDistribution(
  answers: string[]
): { length: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const word of answers) {
    counts.set(word.length, (counts.get(word.length) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([length, count]) => ({ length, count }));
}

/**
 * Per-starting-letter word counts (for the "words starting with…" hint).
 */
export function buildFirstLetterCounts(
  answers: string[]
): { letter: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const word of answers) {
    const l = word[0].toUpperCase();
    counts.set(l, (counts.get(l) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, count]) => ({ letter, count }));
}
