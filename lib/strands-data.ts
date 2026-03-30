import puzzlesData from "@/data/strands/puzzles.json";
import type {
  StrandsDataFile,
  StrandsPuzzle,
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

const rawData = puzzlesData as unknown as StrandsDataFile;
const today = new Date().toISOString().split("T")[0];

const rawPublished = rawData.puzzles
  .filter((p) => {
    if (p.status === "scheduled") return p.printDate <= today;
    return true;
  })
  .sort((a, b) => b.printDate.localeCompare(a.printDate));

const publishedPuzzles = rawPublished.map(decodePuzzle);

export const getAllStrandsPuzzles = cache(
  async (): Promise<DecodedStrandsPuzzle[]> => {
    return publishedPuzzles;
  }
);

export const getStrandsPuzzleByDate = cache(
  async (date: string): Promise<DecodedStrandsPuzzle | undefined> => {
    return publishedPuzzles.find((p) => p.printDate === date);
  }
);

export const getTodaysStrandsPuzzle = cache(
  async (): Promise<DecodedStrandsPuzzle | undefined> => {
    if (publishedPuzzles.length === 0) return undefined;
    return publishedPuzzles[0];
  }
);

/** Returns the raw (base64-encoded) puzzle for client-side hint components */
export const getRawTodaysStrandsPuzzle = cache(
  async (): Promise<StrandsPuzzle | undefined> => {
    if (rawPublished.length === 0) return undefined;
    return rawPublished[0];
  }
);

/** Returns the raw (base64-encoded) puzzle by date for client-side hint components */
export const getRawStrandsPuzzleByDate = cache(
  async (date: string): Promise<StrandsPuzzle | undefined> => {
    return rawPublished.find((p) => p.printDate === date);
  }
);

export const getRecentStrandsPuzzles = cache(
  async (count: number = 4): Promise<DecodedStrandsPuzzle[]> => {
    return publishedPuzzles.slice(1, count + 1);
  }
);

export const getStrandsPuzzlesByMonth = cache(
  async (): Promise<StrandsMonthData[]> => {
    const months = new Map<string, DecodedStrandsPuzzle[]>();

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
          rangeLabel: `Strands #${first.id}–#${last.id} (${monthName} ${year})`,
          puzzles,
        };
      });
  }
);

export const getAdjacentStrandsPuzzles = cache(
  async (
    date: string
  ): Promise<{
    prev: DecodedStrandsPuzzle | undefined;
    next: DecodedStrandsPuzzle | undefined;
  }> => {
    const idx = publishedPuzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: publishedPuzzles[idx + 1],
      next: idx > 0 ? publishedPuzzles[idx - 1] : undefined,
    };
  }
);
