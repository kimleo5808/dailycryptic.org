/**
 * NYT Spelling Bee — data types.
 *
 * Sensitive fields (the answer word list, pangrams) are stored base64-encoded
 * in puzzles.json so the answers are not trivially scrapable from the raw JSON,
 * matching the convention used by the other games on the site.
 * Letters are NOT sensitive (they are visible on the puzzle itself) and are
 * stored in plain text.
 */

/** Raw puzzle as stored in data/spelling-bee/puzzles.json */
export interface SpellingBeePuzzle {
  /** NYT internal puzzle id */
  id: number;
  /** YYYY-MM-DD */
  printDate: string;
  status?: "published" | "scheduled";
  /** Center letter — must appear in every answer. Lowercase, plain text. */
  centerLetter: string;
  /** The six outer letters, lowercase, plain text. */
  outerLetters: string[];
  /** Base64-encoded answer words (lowercase). */
  answers: string[];
  /** Base64-encoded pangram words (subset of answers). */
  pangrams: string[];
}

export interface SpellingBeeDataFile {
  lastUpdated: string;
  puzzles: SpellingBeePuzzle[];
}

/** Decoded puzzle used by the UI, with derived stats. */
export interface DecodedSpellingBeePuzzle {
  id: number;
  printDate: string;
  centerLetter: string;
  outerLetters: string[];
  /** All seven letters, center first. */
  letters: string[];
  answers: string[];
  pangrams: string[];
  /** Derived scoring / stats. */
  stats: SpellingBeeStats;
}

export interface SpellingBeeStats {
  /** Total number of valid answers. */
  wordCount: number;
  /** Number of pangrams. */
  pangramCount: number;
  /** Maximum score (Queen Bee). */
  maxScore: number;
  /** Score needed to reach the Genius rank (70% of max, rounded down). */
  geniusScore: number;
  /** Whether at least one "bingo" is possible (a word for each starting letter). */
  isBingo: boolean;
}

export interface SpellingBeeMonthData {
  label: string;
  rangeLabel: string;
  puzzles: DecodedSpellingBeePuzzle[];
}
