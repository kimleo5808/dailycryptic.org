export interface WordlePuzzle {
  /** Wordle puzzle number (days_since_launch) */
  id: number;
  printDate: string;
  status?: "published" | "scheduled";
  /** Base64-encoded 5-letter answer */
  solution: string;
  /** Level 1 hint — vague thematic clue */
  hint1: string;
  /** Level 2 hint — structural clue (starting letter, vowel count) */
  hint2: string;
  /** Level 3 hint — partial reveal (e.g. "S _ N D Y") */
  hint3: string;
}

export interface WordleDataFile {
  lastUpdated: string;
  puzzles: WordlePuzzle[];
}

export interface DecodedWordlePuzzle {
  id: number;
  printDate: string;
  solution: string;
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface WordleMonthData {
  label: string;
  rangeLabel: string;
  puzzles: DecodedWordlePuzzle[];
}
