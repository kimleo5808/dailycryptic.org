"use client";

import { WORD_LISTS } from "@/data/wordle-words";
import { useCallback, useEffect, useState } from "react";

type CellStatus = "empty" | "correct" | "present" | "absent" | "tbd";

type GameState = {
  board: { letter: string; status: CellStatus }[][];
  currentRow: number;
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  targetWord: string;
  message: string;
  keyStatuses: Record<string, CellStatus>;
};

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const MAX_GUESSES = 6;

function getRandomWord(wordLength: number): string {
  const words = WORD_LISTS[wordLength] || WORD_LISTS[5];
  return words[Math.floor(Math.random() * words.length)];
}

function checkGuess(
  guess: string,
  target: string
): CellStatus[] {
  const result: CellStatus[] = new Array(guess.length).fill("absent");
  const targetCount: Record<string, number> = {};

  for (const letter of target) {
    targetCount[letter] = (targetCount[letter] || 0) + 1;
  }

  // First pass: correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetCount[guess[i]]--;
    }
  }

  // Second pass: present but wrong position
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "absent" && targetCount[guess[i]] > 0) {
      result[i] = "present";
      targetCount[guess[i]]--;
    }
  }

  return result;
}

function createInitialState(wordLength: number): GameState {
  return {
    board: Array.from({ length: MAX_GUESSES }, () =>
      Array.from({ length: wordLength }, () => ({
        letter: "",
        status: "empty" as CellStatus,
      }))
    ),
    currentRow: 0,
    currentGuess: "",
    gameOver: false,
    won: false,
    targetWord: getRandomWord(wordLength),
    message: "",
    keyStatuses: {},
  };
}

export default function WordleGame({
  wordLength,
}: {
  wordLength: number;
}) {
  const [state, setState] = useState<GameState>(() =>
    createInitialState(wordLength)
  );

  const clearMessage = useCallback(() => {
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, message: "" }));
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      setState((prev) => {
        if (prev.gameOver) return prev;

        if (key === "ENTER" || key === "⌫" || key === "BACKSPACE") {
          if (key === "⌫" || key === "BACKSPACE") {
            if (prev.currentGuess.length === 0) return prev;
            const newGuess = prev.currentGuess.slice(0, -1);
            const newBoard = prev.board.map((row) => row.map((cell) => ({ ...cell })));
            newBoard[prev.currentRow][prev.currentGuess.length - 1] = {
              letter: "",
              status: "empty",
            };
            return { ...prev, currentGuess: newGuess, board: newBoard };
          }

          // ENTER
          if (prev.currentGuess.length !== wordLength) {
            return {
              ...prev,
              message: `Word must be ${wordLength} letters!`,
            };
          }

          const words = WORD_LISTS[wordLength] || WORD_LISTS[5];
          if (!words.includes(prev.currentGuess)) {
            return { ...prev, message: "Word not in dictionary!" };
          }

          const result = checkGuess(prev.currentGuess, prev.targetWord);
          const newBoard = prev.board.map((row) => row.map((cell) => ({ ...cell })));
          const newKeyStatuses = { ...prev.keyStatuses };

          for (let i = 0; i < wordLength; i++) {
            newBoard[prev.currentRow][i] = {
              letter: prev.currentGuess[i],
              status: result[i],
            };

            const letter = prev.currentGuess[i];
            const currentStatus = newKeyStatuses[letter];
            if (result[i] === "correct") {
              newKeyStatuses[letter] = "correct";
            } else if (
              result[i] === "present" &&
              currentStatus !== "correct"
            ) {
              newKeyStatuses[letter] = "present";
            } else if (
              result[i] === "absent" &&
              currentStatus !== "correct" &&
              currentStatus !== "present"
            ) {
              newKeyStatuses[letter] = "absent";
            }
          }

          const won = prev.currentGuess === prev.targetWord;
          const gameOver =
            won || prev.currentRow === MAX_GUESSES - 1;

          return {
            ...prev,
            board: newBoard,
            currentRow: prev.currentRow + 1,
            currentGuess: "",
            gameOver,
            won,
            keyStatuses: newKeyStatuses,
            message: won
              ? "Congratulations! You won!"
              : gameOver
                ? `Game Over! The word was: ${prev.targetWord}`
                : "",
          };
        }

        // Letter key
        if (
          prev.currentGuess.length >= wordLength ||
          !/^[A-Z]$/.test(key)
        )
          return prev;

        const newGuess = prev.currentGuess + key;
        const newBoard = prev.board.map((row) => row.map((cell) => ({ ...cell })));
        newBoard[prev.currentRow][prev.currentGuess.length] = {
          letter: key,
          status: "tbd",
        };
        return { ...prev, currentGuess: newGuess, board: newBoard };
      });
    },
    [wordLength]
  );

  // Keyboard events
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE") {
        handleKey(key);
      } else if (/^[A-Z]$/.test(key)) {
        handleKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Auto-clear message
  useEffect(() => {
    if (state.message) {
      const cleanup = clearMessage();
      return cleanup;
    }
  }, [state.message, clearMessage]);

  const newGame = () => {
    setState(createInitialState(wordLength));
  };

  const showHint = () => {
    if (state.gameOver) return;
    const hints = [
      `First letter: ${state.targetWord[0]}`,
      `Last letter: ${state.targetWord[wordLength - 1]}`,
      `Contains: ${state.targetWord[Math.floor(Math.random() * wordLength)]}`,
    ];
    setState((prev) => ({
      ...prev,
      message: hints[Math.floor(Math.random() * hints.length)],
    }));
  };

  const cellSize =
    wordLength <= 5
      ? "w-14 h-14 text-2xl sm:w-16 sm:h-16"
      : wordLength <= 7
        ? "w-11 h-11 text-xl sm:w-14 sm:h-14"
        : wordLength <= 9
          ? "w-9 h-9 text-lg sm:w-12 sm:h-12"
          : "w-8 h-8 text-base sm:w-10 sm:h-10";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Message */}
      {state.message && (
        <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {state.message}
        </div>
      )}

      {/* Board */}
      <div className="flex flex-col gap-1.5">
        {state.board.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`${cellSize} flex items-center justify-center rounded-md border-2 font-heading font-bold uppercase transition-all duration-300 ${
                  cell.status === "correct"
                    ? "border-green-500 bg-green-500 text-white"
                    : cell.status === "present"
                      ? "border-yellow-500 bg-yellow-500 text-white"
                      : cell.status === "absent"
                        ? "border-slate-600 bg-slate-600 text-white"
                        : cell.letter
                          ? "border-slate-400 bg-transparent text-foreground dark:border-slate-500"
                          : "border-slate-300 bg-transparent dark:border-slate-700"
                }`}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="mt-2 flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {row.map((key) => {
              const status = state.keyStatuses[key];
              const isWide = key === "ENTER" || key === "⌫";
              return (
                <button
                  key={key}
                  onClick={() =>
                    handleKey(key === "⌫" ? "BACKSPACE" : key)
                  }
                  className={`flex items-center justify-center rounded-md font-semibold uppercase transition-colors ${
                    isWide
                      ? "px-3 py-3 text-xs sm:px-4 sm:text-sm"
                      : "h-12 w-8 text-sm sm:w-10"
                  } ${
                    status === "correct"
                      ? "bg-green-500 text-white"
                      : status === "present"
                        ? "bg-yellow-500 text-white"
                        : status === "absent"
                          ? "bg-slate-600 text-slate-400"
                          : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-2 flex gap-3">
        <button
          onClick={newGame}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          New Game
        </button>
        <button
          onClick={showHint}
          className="rounded-lg border border-blue-500/30 px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          Get Hint
        </button>
      </div>
    </div>
  );
}
