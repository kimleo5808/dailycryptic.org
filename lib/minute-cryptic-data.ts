import puzzlesData from "@/data/minute-cryptic/puzzles.json";
import type {
  MinuteCrypticDataFile,
  MinuteCrypticPuzzle,
} from "@/types/minute-cryptic";
import { cache } from "react";

const data = puzzlesData as unknown as MinuteCrypticDataFile;
const PRELAUNCH_VISIBLE_COUNT_DEFAULT = 2;
const PRELAUNCH_VISIBLE_COUNT_RAW =
  process.env.MINUTE_CRYPTIC_VISIBLE_COUNT ??
  String(PRELAUNCH_VISIBLE_COUNT_DEFAULT);
const parsedPrelaunchVisibleCount = Number.parseInt(
  PRELAUNCH_VISIBLE_COUNT_RAW,
  10
);
const PRELAUNCH_VISIBLE_COUNT =
  Number.isFinite(parsedPrelaunchVisibleCount) &&
  parsedPrelaunchVisibleCount > 0
    ? parsedPrelaunchVisibleCount
    : null;

function sortAscByDate(a: MinuteCrypticPuzzle, b: MinuteCrypticPuzzle) {
  const dateA = a.publishDate ?? a.printDate;
  const dateB = b.publishDate ?? b.printDate;
  return dateA.localeCompare(dateB);
}

const sortedPuzzles = [...data.puzzles].sort(sortAscByDate);
const today = new Date().toISOString().split("T")[0];

function isPublishedPuzzle(puzzle: MinuteCrypticPuzzle): boolean {
  if (puzzle.status === "draft") return false;

  const publishDate = puzzle.publishDate ?? puzzle.printDate;
  return publishDate <= today;
}

const publishedPuzzles = sortedPuzzles.filter(isPublishedPuzzle);
const prelaunchSource =
  publishedPuzzles.length > 0 ? publishedPuzzles : sortedPuzzles;
const visiblePuzzles =
  PRELAUNCH_VISIBLE_COUNT && PRELAUNCH_VISIBLE_COUNT > 0
    ? prelaunchSource.slice(0, PRELAUNCH_VISIBLE_COUNT)
    : publishedPuzzles;

export const getMinuteCrypticByDate = cache(
  async (date: string): Promise<MinuteCrypticPuzzle | undefined> => {
    return visiblePuzzles.find((p) => p.printDate === date);
  }
);

export const getLatestMinuteCryptic = cache(
  async (): Promise<MinuteCrypticPuzzle | undefined> => {
    if (visiblePuzzles.length === 0) return undefined;

    for (let i = visiblePuzzles.length - 1; i >= 0; i -= 1) {
      const publishDate =
        visiblePuzzles[i].publishDate ?? visiblePuzzles[i].printDate;
      if (publishDate <= today) {
        return visiblePuzzles[i];
      }
    }

    return visiblePuzzles[visiblePuzzles.length - 1];
  }
);

export const getRecentMinuteCryptics = cache(
  async (count: number = 7): Promise<MinuteCrypticPuzzle[]> => {
    return [...visiblePuzzles].reverse().slice(0, count);
  }
);

export const getAllMinuteCryptics = cache(
  async (): Promise<MinuteCrypticPuzzle[]> => {
    return [...visiblePuzzles].reverse();
  }
);

export const getMinuteCrypticCount = cache(async (): Promise<number> => {
  return visiblePuzzles.length;
});
