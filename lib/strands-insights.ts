import type { DecodedStrandsPuzzle } from "@/types/strands";

/*
 * Archive comparison for a /strands-hint/[date] page: how the spangram and the
 * theme set compare with other puzzles, and which theme words have turned up
 * before (with links back to those puzzles). Derived from the bundled archive.
 */

export interface StrandsReturningWord {
  word: string;
  times: number;
  last: { id: number; printDate: string; clue: string };
}

export interface StrandsInsights {
  archiveSize: number;
  archiveStart: string;
  hasEarlierPuzzles: boolean;
  spangramLength: number;
  /** Percentage of archive spangrams shorter than this one. */
  spangramShorterPct: number;
  /** Archive puzzles whose spangram runs the same way as this one. */
  sameDirectionCount: number;
  themeWordCount: number;
  /** Archive puzzles with the same number of theme words. */
  sameWordCountPuzzles: number;
  longestWord: string;
  shortestWord: string;
  returning: StrandsReturningWord[];
}

export function getStrandsInsights(
  puzzle: DecodedStrandsPuzzle,
  archive: DecodedStrandsPuzzle[]
): StrandsInsights {
  const earlier = archive
    .filter((p) => p.printDate < puzzle.printDate)
    .sort((a, b) => b.printDate.localeCompare(a.printDate));

  const returning: StrandsReturningWord[] = [];
  for (const word of puzzle.themeWords) {
    const hits = earlier.filter((p) => p.themeWords.includes(word) || p.spangram === word);
    if (hits.length === 0) continue;
    returning.push({
      word,
      times: hits.length,
      last: { id: hits[0].id, printDate: hits[0].printDate, clue: hits[0].clue },
    });
  }
  returning.sort((a, b) => b.times - a.times || a.word.localeCompare(b.word));

  const byLength = [...puzzle.themeWords].sort(
    (a, b) => b.length - a.length || a.localeCompare(b)
  );
  const spangramLength = puzzle.spangram.length;

  return {
    archiveSize: archive.length,
    archiveStart: archive.reduce(
      (min, p) => (p.printDate < min ? p.printDate : min),
      puzzle.printDate
    ),
    hasEarlierPuzzles: earlier.length > 0,
    spangramLength,
    spangramShorterPct: Math.round(
      (archive.filter((p) => p.spangram.length < spangramLength).length / archive.length) * 100
    ),
    sameDirectionCount: archive.filter(
      (p) => p.spangramDirection === puzzle.spangramDirection
    ).length,
    themeWordCount: puzzle.themeWords.length,
    sameWordCountPuzzles: archive.filter(
      (p) => p.themeWords.length === puzzle.themeWords.length
    ).length,
    longestWord: byLength[0],
    shortestWord: byLength[byLength.length - 1],
    returning,
  };
}
