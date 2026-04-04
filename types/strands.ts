export interface StrandsPuzzle {
  id: number;
  printDate: string;
  status?: "published" | "scheduled";
  /** NYT's theme clue shown to players (plain text) */
  clue: string;
  /** Our additional editorial hint (plain text) */
  hint: string;
  /** Base64-encoded theme name (derived from spangram) */
  theme: string;
  /** Base64-encoded spangram word */
  spangram: string;
  /** Spangram orientation on the board */
  spangramDirection: "horizontal" | "vertical";
  /** Number of letters in the spangram */
  spangramLetterCount: number;
  /** Base64-encoded theme words (excluding spangram) */
  themeWords: string[];
  /** 8×6 letter grid — each string is one row of 6 characters */
  startingBoard?: string[];
  /** Grid coordinates for each theme word — keys are Base64-encoded word strings */
  themeCoords?: Record<string, [number, number][]>;
  /** Grid coordinates for the spangram */
  spangramCoords?: [number, number][];
}

export interface StrandsDataFile {
  lastUpdated: string;
  puzzles: StrandsPuzzle[];
}

export interface DecodedStrandsPuzzle {
  id: number;
  printDate: string;
  clue: string;
  hint: string;
  theme: string;
  spangram: string;
  spangramDirection: "horizontal" | "vertical";
  spangramLetterCount: number;
  themeWords: string[];
  startingBoard?: string[];
  themeCoords?: Record<string, [number, number][]>;
  spangramCoords?: [number, number][];
}

export interface StrandsMonthData {
  label: string;
  rangeLabel: string;
  puzzles: DecodedStrandsPuzzle[];
}
