import { readFileSync } from "fs";
import { join } from "path";
import type {
  MinuteCrypticDataFile,
  MinuteCrypticPuzzle,
} from "@/types/minute-cryptic";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodePuzzle(puzzle: MinuteCrypticPuzzle): MinuteCrypticPuzzle {
  return {
    ...puzzle,
    answer: fromBase64(puzzle.answer),
    explanation: fromBase64(puzzle.explanation),
    hintLevels: puzzle.hintLevels.map(fromBase64) as [string, string, string, string],
  };
}

function sortAscByDate(a: MinuteCrypticPuzzle, b: MinuteCrypticPuzzle) {
  const dateA = a.publishDate ?? a.printDate;
  const dateB = b.publishDate ?? b.printDate;
  return dateA.localeCompare(dateB);
}

/* Lazy-load to avoid fs.readFileSync at module import time (crashes Worker) */
let _allDesc: MinuteCrypticPuzzle[] | null = null;
let _publicSource: MinuteCrypticPuzzle[] | null = null;
let _archiveDesc: MinuteCrypticPuzzle[] | null = null;

function init() {
  if (_allDesc) return;
  const rawData = JSON.parse(
    readFileSync(join(process.cwd(), "data", "minute-cryptic", "puzzles.json"), "utf8")
  ) as MinuteCrypticDataFile;
  const data: MinuteCrypticDataFile = {
    ...rawData,
    puzzles: rawData.puzzles.map(decodePuzzle),
  };
  const ARCHIVE_VISIBLE_COUNT_RAW =
    process.env.MINUTE_CRYPTIC_ARCHIVE_VISIBLE_COUNT ??
    process.env.MINUTE_CRYPTIC_VISIBLE_COUNT ??
    "";
  const parsed = Number.parseInt(ARCHIVE_VISIBLE_COUNT_RAW, 10);
  const ARCHIVE_VISIBLE_COUNT =
    Number.isFinite(parsed) && parsed > 0 ? parsed : null;

  const sortedPuzzles = [...data.puzzles].sort(sortAscByDate);
  const today = new Date().toISOString().split("T")[0];

  const publishedPuzzles = sortedPuzzles.filter((p) => {
    if (p.status === "draft") return false;
    return (p.publishDate ?? p.printDate) <= today;
  });

  _publicSource =
    publishedPuzzles.length > 0 ? publishedPuzzles : sortedPuzzles;
  _allDesc = [..._publicSource].reverse();
  _archiveDesc =
    ARCHIVE_VISIBLE_COUNT && ARCHIVE_VISIBLE_COUNT > 0
      ? _allDesc.slice(0, ARCHIVE_VISIBLE_COUNT)
      : _allDesc;
}

function getAllDesc(): MinuteCrypticPuzzle[] {
  init();
  return _allDesc!;
}
function getPublicSource(): MinuteCrypticPuzzle[] {
  init();
  return _publicSource!;
}
function getArchiveDesc(): MinuteCrypticPuzzle[] {
  init();
  return _archiveDesc!;
}

export const getMinuteCrypticByDate = cache(
  async (date: string): Promise<MinuteCrypticPuzzle | undefined> =>
    getPublicSource().find((p) => p.printDate === date)
);

export const getLatestMinuteCryptic = cache(
  async (): Promise<MinuteCrypticPuzzle | undefined> => {
    const src = getPublicSource();
    if (src.length === 0) return undefined;
    const today = new Date().toISOString().split("T")[0];
    for (let i = src.length - 1; i >= 0; i -= 1) {
      if ((src[i].publishDate ?? src[i].printDate) <= today) return src[i];
    }
    return src[src.length - 1];
  }
);

export const getRecentMinuteCryptics = cache(
  async (count: number = 7): Promise<MinuteCrypticPuzzle[]> =>
    getAllDesc().slice(0, count)
);

export const getAllMinuteCryptics = cache(
  async (): Promise<MinuteCrypticPuzzle[]> => getAllDesc()
);

export const getMinuteCrypticCount = cache(
  async (): Promise<number> => getAllDesc().length
);

export const getArchiveMinuteCryptics = cache(
  async (): Promise<MinuteCrypticPuzzle[]> => getArchiveDesc()
);

export const getArchiveMinuteCrypticCount = cache(
  async (): Promise<number> => getArchiveDesc().length
);

export const getMinuteCrypticsByClueType = cache(
  async (clueType: MinuteCrypticPuzzle["clueType"]): Promise<MinuteCrypticPuzzle[]> =>
    getAllDesc().filter((p) => p.clueType === clueType)
);

export const getMinuteCrypticsByDifficulty = cache(
  async (difficulty: MinuteCrypticPuzzle["difficulty"]): Promise<MinuteCrypticPuzzle[]> =>
    getAllDesc().filter((p) => p.difficulty === difficulty)
);

export const getExampleMinuteCrypticsByClueType = cache(
  async (clueType: MinuteCrypticPuzzle["clueType"], count: number = 3): Promise<MinuteCrypticPuzzle[]> =>
    getAllDesc().filter((p) => p.clueType === clueType).slice(0, count)
);

export const getRelatedMinuteCryptics = cache(
  async (currentPuzzle: MinuteCrypticPuzzle, count: number = 6): Promise<MinuteCrypticPuzzle[]> => {
    const all = getAllDesc();
    const buckets = [
      all.filter((p) => p.printDate !== currentPuzzle.printDate && p.clueType === currentPuzzle.clueType && p.difficulty === currentPuzzle.difficulty),
      all.filter((p) => p.printDate !== currentPuzzle.printDate && p.clueType === currentPuzzle.clueType && p.difficulty !== currentPuzzle.difficulty),
      all.filter((p) => p.printDate !== currentPuzzle.printDate && p.difficulty === currentPuzzle.difficulty && p.clueType !== currentPuzzle.clueType),
      all.filter((p) => p.printDate !== currentPuzzle.printDate),
    ];
    const seen = new Set<string>();
    const result: MinuteCrypticPuzzle[] = [];
    for (const bucket of buckets) {
      for (const puzzle of bucket) {
        if (seen.has(puzzle.printDate)) continue;
        seen.add(puzzle.printDate);
        result.push(puzzle);
        if (result.length >= count) return result;
      }
    }
    return result;
  }
);

export type UnlimitedPuzzle = Pick<
  MinuteCrypticPuzzle,
  "id" | "clue" | "answer" | "hintLevels" | "clueType" | "difficulty" | "explanation"
>;

export const getAllPuzzlesForUnlimited = cache(
  async (): Promise<UnlimitedPuzzle[]> =>
    getAllDesc().map((p) => ({
      id: p.id,
      clue: p.clue,
      answer: p.answer,
      hintLevels: p.hintLevels,
      clueType: p.clueType,
      difficulty: p.difficulty,
      explanation: p.explanation,
    }))
);
