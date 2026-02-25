export interface Puzzle {
  id: string;
  clue: string;
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameState {
  currentPuzzleIndex: number;
  guesses: Record<number, string>; // Maps puzzle index to current guess string
  solvedStatus: Record<number, boolean>; // Maps puzzle index to isSolved
  hintsUsed: Record<number, boolean>; // Maps puzzle index to hasHintBeenUsed
  loading: boolean;
  error: string | null;
}

export type FeedbackStatus = 'idle' | 'correct' | 'incorrect';