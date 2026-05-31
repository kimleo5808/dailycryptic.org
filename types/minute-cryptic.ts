export type MinuteCrypticDifficulty = "easy" | "medium" | "hard";
export type MinuteCrypticClueType =
  | "anagram"
  | "charade"
  | "container"
  | "double-definition"
  | "hidden-word"
  | "reversal"
  | "homophone"
  | "deletion";

export type MinuteCrypticStatus = "published" | "scheduled" | "draft";

/**
 * Structured, per-clue solving analysis. Each text field is base64-encoded in
 * storage (like answer/explanation/hintLevels) and decoded on read. Optional:
 * when absent, pages fall back to the short `explanation` line.
 */
export interface MinuteCrypticAnalysis {
  /** Which word(s) form the definition and what they point to. */
  definition: string;
  /** The cryptic device and the indicator word that signals it. */
  device: string;
  /** Letter-level derivation, one step per entry. */
  steps: string[];
  /** A solver's note: a pitfall, misdirection, or pattern to remember. */
  note: string;
}

export interface MinuteCrypticPuzzle {
  id: number;
  printDate: string;
  publishDate?: string;
  status?: MinuteCrypticStatus;
  clue: string;
  answer: string;
  clueType: MinuteCrypticClueType;
  difficulty: MinuteCrypticDifficulty;
  hintLevels: [string, string, string, string];
  explanation: string;
  analysis?: MinuteCrypticAnalysis;
}

export interface MinuteCrypticDataFile {
  lastUpdated: string;
  puzzles: MinuteCrypticPuzzle[];
}
