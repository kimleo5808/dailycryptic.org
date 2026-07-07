/**
 * NYT Letter Boxed — data types.
 *
 * Letter Boxed gives you a square with three letters on each of its four sides
 * (12 letters total). You chain words where each word starts with the last
 * letter of the previous one, consecutive letters must come from different
 * sides, and together the words must use all 12 letters. The NYT publishes an
 * official two-word "our solution".
 *
 * The `sides` are the puzzle face (shown to every player) and are stored in
 * plain text. The `solution` (the answer words) is base64-encoded — matching
 * the convention used by the other games on the site. The full daily dictionary
 * is intentionally NOT stored (it is ~1,200 words per day and would bloat the
 * bundle).
 */

export interface LetterBoxedPuzzle {
  id: number;
  printDate: string;
  status?: "published" | "scheduled";
  /** Four sides, each a string of three uppercase letters. */
  sides: string[];
  /** Base64-encoded JSON array of the official solution words. */
  solution: string;
}

export interface LetterBoxedDataFile {
  lastUpdated: string;
  puzzles: LetterBoxedPuzzle[];
}

export interface LetterBoxedStats {
  /** Number of words in the official solution (usually 2). */
  wordCount: number;
  /** Length of each solution word. */
  wordLengths: number[];
}

export interface DecodedLetterBoxedPuzzle {
  id: number;
  printDate: string;
  sides: string[];
  /** All twelve letters flattened (side order). */
  letters: string[];
  solution: string[];
  stats: LetterBoxedStats;
}

export interface LetterBoxedMonthData {
  label: string;
  rangeLabel: string;
  puzzles: DecodedLetterBoxedPuzzle[];
}
