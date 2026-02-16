export type MinuteCrypticDifficulty = "easy" | "medium" | "hard";
export type MinuteCrypticClueType =
  | "anagram"
  | "charade"
  | "container"
  | "double-definition";

export type MinuteCrypticStatus = "published" | "scheduled" | "draft";

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
}

export interface MinuteCrypticDataFile {
  lastUpdated: string;
  puzzles: MinuteCrypticPuzzle[];
}
