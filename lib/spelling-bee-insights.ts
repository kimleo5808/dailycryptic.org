import type { DecodedSpellingBeePuzzle } from "@/types/spelling-bee";

/*
 * Archive-based facts for a /spelling-bee-answers/[date] page: how the hive
 * compares with other puzzles, which words are new to the archive, which ones
 * keep coming back, and the standout words of the day. Everything is derived
 * from the bundled puzzle archive, so each page gets figures of its own.
 */

const MAX_LISTED = 10;
const MAX_REGULARS = 5;
const MIN_REGULAR_COUNT = 3;

/** NYT scoring: 4-letter words score 1, longer words 1 per letter, pangrams +7. */
function wordPoints(word: string, pangrams: Set<string>): number {
  return (word.length === 4 ? 1 : word.length) + (pangrams.has(word) ? 7 : 0);
}

export interface SpellingBeeInsights {
  archiveSize: number;
  /** Earliest date in the archive (YYYY-MM-DD). */
  archiveStart: string;
  /** Percentage of archive puzzles with fewer words than this one. */
  smallerThanPct: number;
  /** Archive puzzles (this one included) that share the centre letter. */
  centreLetterCount: number;
  /** False when this is the earliest puzzle in the archive. */
  hasEarlierPuzzles: boolean;
  debutWords: string[];
  debutCount: number;
  regulars: { word: string; count: number }[];
  longestWords: string[];
  topWord: { word: string; points: number };
  /** Pangrams that use each of the seven letters exactly once. */
  perfectPangrams: string[];
}

export function getSpellingBeeInsights(
  puzzle: DecodedSpellingBeePuzzle,
  archive: DecodedSpellingBeePuzzle[]
): SpellingBeeInsights {
  const frequency = new Map<string, number>();
  for (const p of archive) {
    for (const w of p.answers) frequency.set(w, (frequency.get(w) ?? 0) + 1);
  }

  const earlier = archive.filter((p) => p.printDate < puzzle.printDate);
  const earlierWords = new Set(earlier.flatMap((p) => p.answers));
  const debut = puzzle.answers
    .filter((w) => !earlierWords.has(w))
    .sort((a, b) => b.length - a.length || a.localeCompare(b));

  const regulars = puzzle.answers
    .map((word) => ({ word, count: frequency.get(word) ?? 1 }))
    .filter((r) => r.count >= MIN_REGULAR_COUNT)
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, MAX_REGULARS);

  const maxLength = Math.max(...puzzle.answers.map((w) => w.length));
  const pangramSet = new Set(puzzle.pangrams);
  const topWord = puzzle.answers
    .map((word) => ({ word, points: wordPoints(word, pangramSet) }))
    .reduce((best, w) =>
      w.points > best.points || (w.points === best.points && w.word < best.word) ? w : best
    );

  return {
    archiveSize: archive.length,
    archiveStart: archive.reduce(
      (min, p) => (p.printDate < min ? p.printDate : min),
      puzzle.printDate
    ),
    smallerThanPct: Math.round(
      (archive.filter((p) => p.stats.wordCount < puzzle.stats.wordCount).length /
        archive.length) *
        100
    ),
    centreLetterCount: archive.filter((p) => p.centerLetter === puzzle.centerLetter).length,
    hasEarlierPuzzles: earlier.length > 0,
    debutWords: debut.slice(0, MAX_LISTED),
    debutCount: debut.length,
    regulars,
    longestWords: puzzle.answers.filter((w) => w.length === maxLength),
    topWord,
    perfectPangrams: puzzle.pangrams.filter((w) => w.length === 7),
  };
}
