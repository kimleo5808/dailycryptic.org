"use client";

import { useMemo } from "react";
import { scoreGuess, aggregateLetterState } from "@/lib/quordle-data";
import type { BoardStatus, LetterState } from "@/types/quordle";

export interface UseWordleGameOpts {
  answer: string;
  guesses: string[];
  maxRows: number;
}

export interface UseWordleGameReturn {
  evaluations: LetterState[][];
  status: BoardStatus;
  letterStates: Record<string, LetterState>;
}

export function useWordleGame({
  answer,
  guesses,
  maxRows,
}: UseWordleGameOpts): UseWordleGameReturn {
  return useMemo<UseWordleGameReturn>(() => {
    const upperAnswer = answer.toUpperCase();
    const evaluations = guesses.map((g) => scoreGuess(g, upperAnswer));

    let status: BoardStatus = "playing";
    const solved = guesses.some((g) => g.toUpperCase() === upperAnswer);
    if (solved) {
      status = "won";
    } else if (guesses.length >= maxRows) {
      status = "lost";
    }

    const letterStates: Record<string, LetterState> = {};
    guesses.forEach((g, gi) => {
      const evals = evaluations[gi];
      for (let i = 0; i < g.length; i++) {
        const ch = g[i].toUpperCase();
        letterStates[ch] = aggregateLetterState(letterStates[ch], evals[i]);
      }
    });

    return { evaluations, status, letterStates };
  }, [answer, guesses, maxRows]);
}
