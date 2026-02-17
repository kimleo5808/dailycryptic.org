import puzzlesData from "@/data/minute-cryptic/puzzles.json";
import type {
  MinuteCrypticDataFile,
  MinuteCrypticPuzzle,
} from "@/types/minute-cryptic";
import { cache } from "react";

const data = puzzlesData as unknown as MinuteCrypticDataFile;
const ARCHIVE_VISIBLE_COUNT_RAW =
  process.env.MINUTE_CRYPTIC_ARCHIVE_VISIBLE_COUNT ??
  process.env.MINUTE_CRYPTIC_VISIBLE_COUNT ??
  "";
const parsedArchiveVisibleCount = Number.parseInt(
  ARCHIVE_VISIBLE_COUNT_RAW,
  10
);
const ARCHIVE_VISIBLE_COUNT =
  Number.isFinite(parsedArchiveVisibleCount) && parsedArchiveVisibleCount > 0
    ? parsedArchiveVisibleCount
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
const publicSource =
  publishedPuzzles.length > 0 ? publishedPuzzles : sortedPuzzles;
const allPublicPuzzlesDesc = [...publicSource].reverse();
const archiveVisiblePuzzlesDesc =
  ARCHIVE_VISIBLE_COUNT && ARCHIVE_VISIBLE_COUNT > 0
    ? allPublicPuzzlesDesc.slice(0, ARCHIVE_VISIBLE_COUNT)
    : allPublicPuzzlesDesc;

export const getMinuteCrypticByDate = cache(
  async (date: string): Promise<MinuteCrypticPuzzle | undefined> => {
    return publicSource.find((p) => p.printDate === date);
  }
);

export const getLatestMinuteCryptic = cache(
  async (): Promise<MinuteCrypticPuzzle | undefined> => {
    if (publicSource.length === 0) return undefined;

    for (let i = publicSource.length - 1; i >= 0; i -= 1) {
      const publishDate =
        publicSource[i].publishDate ?? publicSource[i].printDate;
      if (publishDate <= today) {
        return publicSource[i];
      }
    }

    return publicSource[publicSource.length - 1];
  }
);

export const getRecentMinuteCryptics = cache(
  async (count: number = 7): Promise<MinuteCrypticPuzzle[]> => {
    return allPublicPuzzlesDesc.slice(0, count);
  }
);

export const getAllMinuteCryptics = cache(
  async (): Promise<MinuteCrypticPuzzle[]> => {
    return allPublicPuzzlesDesc;
  }
);

export const getMinuteCrypticCount = cache(async (): Promise<number> => {
  return allPublicPuzzlesDesc.length;
});

export const getArchiveMinuteCryptics = cache(
  async (): Promise<MinuteCrypticPuzzle[]> => {
    return archiveVisiblePuzzlesDesc;
  }
);

export const getArchiveMinuteCrypticCount = cache(async (): Promise<number> => {
  return archiveVisiblePuzzlesDesc.length;
});
