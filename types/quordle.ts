export type LetterState = "correct" | "present" | "absent" | "empty";

export type QuordleMode = "daily" | "practice";

export type QuordleAnswers = [string, string, string, string];

export type BoardStatus = "playing" | "won" | "lost";

export interface QuordleBoardSnapshot {
  answer: string;
  guesses: string[];
  evaluations: LetterState[][];
  status: BoardStatus;
}

export interface QuordleSessionSnapshot {
  mode: QuordleMode;
  dateKey: string | null;
  puzzleNumber: number | null;
  answers: QuordleAnswers;
  sharedGuesses: string[];
  boards: [
    QuordleBoardSnapshot,
    QuordleBoardSnapshot,
    QuordleBoardSnapshot,
    QuordleBoardSnapshot,
  ];
  startedAt: number | null;
  finishedAt: number | null;
}
