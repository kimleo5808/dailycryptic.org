"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WordleBoard from "@/components/games/shared/WordleBoard";
import WordleKeyboard, {
  type WordleKey,
} from "@/components/games/shared/WordleKeyboard";
import QuordleModeTabs from "@/components/quordle/QuordleModeTabs";
import WordleUnlimitedShareButton from "@/components/wordle-unlimited/WordleUnlimitedShareButton";
import { useWordleGame } from "@/hooks/useWordleGame";
import {
  DEFAULT_WORD_LENGTH,
  MAX_GUESSES,
  WORD_LENGTHS,
  type WordLength,
  getDailyAnswer,
  getDailyPuzzleNumber,
  getRandomAnswer,
  getUtcDateKey,
  isValidGuess,
  loadGuessSet,
} from "@/lib/wordle-unlimited-data";
import { useWordleUnlimitedStore } from "@/stores/wordleUnlimitedStore";
import { cn } from "@/lib/utils";
import type { LetterState, QuordleMode } from "@/types/quordle";

/**
 * Returns an error message if the guess breaks hard-mode rules
 * (revealed greens must stay in place; revealed yellows must be reused),
 * or null if the guess is allowed.
 */
function hardModeViolation(
  guess: string,
  guesses: string[],
  evaluations: LetterState[][],
): string | null {
  const required: Record<number, string> = {}; // position -> letter (green)
  const mustInclude = new Set<string>(); // letters seen as present (yellow)
  guesses.forEach((g, gi) => {
    const evals = evaluations[gi] ?? [];
    for (let i = 0; i < g.length; i++) {
      if (evals[i] === "correct") required[i] = g[i].toUpperCase();
      else if (evals[i] === "present") mustInclude.add(g[i].toUpperCase());
    }
  });
  const up = guess.toUpperCase();
  for (const [posStr, letter] of Object.entries(required)) {
    const pos = Number(posStr);
    if (up[pos] !== letter) {
      const ord = pos + 1;
      return `Letter ${ord} must be ${letter}`;
    }
  }
  for (const letter of mustInclude) {
    if (!up.includes(letter)) return `Guess must contain ${letter}`;
  }
  return null;
}

export default function WordleUnlimitedGame() {
  const hydrated = useWordleUnlimitedStore((s) => s.hydrated);
  const hydrate = useWordleUnlimitedStore((s) => s.hydrate);
  const hardMode = useWordleUnlimitedStore((s) => s.hardMode);
  const setHardMode = useWordleUnlimitedStore((s) => s.setHardMode);
  const stats = useWordleUnlimitedStore((s) => s.stats);
  const practiceByLength = useWordleUnlimitedStore((s) => s.practiceByLength);
  const dailyByKey = useWordleUnlimitedStore((s) => s.dailyByKey);
  const ensurePractice = useWordleUnlimitedStore((s) => s.ensurePractice);
  const ensureDaily = useWordleUnlimitedStore((s) => s.ensureDaily);
  const addGuess = useWordleUnlimitedStore((s) => s.addGuess);
  const finish = useWordleUnlimitedStore((s) => s.finish);
  const resetPractice = useWordleUnlimitedStore((s) => s.resetPractice);

  const [mode, setMode] = useState<QuordleMode>("practice");
  const [length, setLength] = useState<WordLength>(DEFAULT_WORD_LENGTH);
  const [currentGuess, setCurrentGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [guessSet, setGuessSet] = useState<Set<string> | null>(null);

  const todayKey = useMemo(() => getUtcDateKey(), []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Lazily load the larger valid-guess dictionary for the active length.
  useEffect(() => {
    let active = true;
    setGuessSet(null);
    loadGuessSet(length).then((set) => {
      if (active) setGuessSet(set);
    });
    return () => {
      active = false;
    };
  }, [length]);

  // Reset the in-progress typed guess whenever the active board changes.
  useEffect(() => {
    setCurrentGuess("");
    setErrorMsg(null);
  }, [mode, length]);

  useEffect(() => {
    if (!hydrated) return;
    if (mode === "daily") {
      const key = `${length}:${todayKey}`;
      if (!dailyByKey[key]) {
        ensureDaily(length, todayKey, getDailyAnswer(length, todayKey));
      }
    } else if (!practiceByLength[String(length)]) {
      ensurePractice(length, getRandomAnswer(length));
    }
  }, [
    hydrated,
    mode,
    length,
    todayKey,
    dailyByKey,
    practiceByLength,
    ensureDaily,
    ensurePractice,
  ]);

  const current = useMemo(() => {
    if (!hydrated) return null;
    if (mode === "daily") return dailyByKey[`${length}:${todayKey}`] ?? null;
    return practiceByLength[String(length)] ?? null;
  }, [hydrated, mode, length, todayKey, dailyByKey, practiceByLength]);

  const answer = current?.answer ?? "";
  const guesses = useMemo(() => current?.guesses ?? [], [current]);

  const board = useWordleGame({ answer, guesses, maxRows: MAX_GUESSES });
  const gameOver = current !== null && board.status !== "playing";
  const won = board.status === "won";

  // Record stats exactly once per finished game.
  const recordedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!current || !gameOver) return;
    const dateKey = mode === "daily" ? todayKey : "practice";
    const signature = `${mode}:${length}:${dateKey}:${answer}:${guesses.length}`;
    if (recordedRef.current === signature) return;
    if (current.finishedAt) {
      recordedRef.current = signature;
      return;
    }
    finish(mode, length, todayKey, won, guesses.length);
    recordedRef.current = signature;
  }, [current, gameOver, mode, length, todayKey, answer, guesses.length, won, finish]);

  const triggerShake = useCallback((message: string) => {
    setErrorMsg(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
    window.setTimeout(() => setErrorMsg(null), 1800);
  }, []);

  const handleKey = useCallback(
    (key: WordleKey) => {
      if (!current || gameOver) return;
      if (key === "enter") {
        if (currentGuess.length !== length) {
          triggerShake("Not enough letters");
          return;
        }
        const validWord = guessSet
          ? guessSet.has(currentGuess.toUpperCase())
          : isValidGuess(currentGuess, length);
        if (!validWord) {
          triggerShake("Not in word list");
          return;
        }
        if (hardMode) {
          const violation = hardModeViolation(
            currentGuess,
            guesses,
            board.evaluations,
          );
          if (violation) {
            triggerShake(violation);
            return;
          }
        }
        addGuess(mode, length, todayKey, currentGuess);
        setCurrentGuess("");
        return;
      }
      if (key === "backspace") {
        setCurrentGuess((g) => g.slice(0, -1));
        return;
      }
      if (typeof key === "string" && /^[a-z]$/.test(key)) {
        if (currentGuess.length < length) {
          setCurrentGuess((g) => g + key.toUpperCase());
        }
      }
    },
    [
      current,
      gameOver,
      currentGuess,
      length,
      hardMode,
      guesses,
      board.evaluations,
      guessSet,
      mode,
      todayKey,
      addGuess,
      triggerShake,
    ],
  );

  const onPlayAgain = useCallback(() => {
    resetPractice(length, getRandomAnswer(length));
    setCurrentGuess("");
    setErrorMsg(null);
    recordedRef.current = null;
  }, [resetPractice, length]);

  const puzzleNumber = mode === "daily" ? getDailyPuzzleNumber() : null;
  const winRate = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0;
  const guessCount = Math.min(
    guesses.length + (gameOver ? 0 : 1),
    MAX_GUESSES,
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
      {/* Control bar */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <QuordleModeTabs mode={mode} onChange={setMode} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            {mode === "daily" && puzzleNumber ? `#${puzzleNumber}` : "Random"}
          </span>
          <span>
            {guessCount}/{MAX_GUESSES}
          </span>
        </div>
      </div>

      {/* Length selector + hard mode */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            Letters
          </span>
          {WORD_LENGTHS.map((len) => {
            const active = len === length;
            return (
              <button
                key={len}
                type="button"
                onClick={() => setLength(len)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {len}
              </button>
            );
          })}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={(e) => setHardMode(e.target.checked)}
            className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
          />
          Hard mode
        </label>
      </div>

      {/* Error toast */}
      {errorMsg && (
        <div
          role="status"
          className="rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground"
        >
          {errorMsg}
        </div>
      )}

      {/* Loading skeleton during hydration */}
      {(!hydrated || !current) && (
        <div
          className="flex h-72 w-full animate-pulse items-center justify-center rounded-lg bg-muted/40"
          aria-label="Loading Wordle Unlimited"
        >
          <span className="text-xs text-muted-foreground">Loading…</span>
        </div>
      )}

      {hydrated && current && (
        <>
          <WordleBoard
            rows={MAX_GUESSES}
            wordLength={length}
            guesses={guesses}
            evaluations={board.evaluations}
            currentGuess={board.status === "playing" ? currentGuess : ""}
            status={board.status}
            shake={shake}
            ariaLabel="Wordle Unlimited board"
          />

          {/* Game-over summary */}
          {gameOver && (
            <div className="w-full rounded-lg border border-border bg-card/70 p-3 text-center">
              <p className="text-sm font-semibold text-foreground">
                {won ? "Solved!" : "Out of guesses"}
              </p>
              {!won && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Answer:{" "}
                  <span className="font-mono font-bold text-foreground">
                    {answer.toUpperCase()}
                  </span>
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <WordleUnlimitedShareButton
                  mode={mode}
                  length={length}
                  puzzleNumber={puzzleNumber}
                  evaluations={board.evaluations}
                  won={won}
                  guessLimit={MAX_GUESSES}
                />
                {mode === "practice" && (
                  <button
                    type="button"
                    onClick={onPlayAgain}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Play again
                  </button>
                )}
              </div>
            </div>
          )}

          <WordleKeyboard
            onKey={handleKey}
            letterStates={board.letterStates}
            disabled={gameOver}
          />

          {/* Stats strip */}
          <div className="flex w-full items-center justify-center gap-6 border-t border-border pt-3 text-center">
            <Stat label="Played" value={stats.played} />
            <Stat label="Win %" value={winRate} />
            <Stat label="Streak" value={stats.currentStreak} />
            <Stat label="Max streak" value={stats.maxStreak} />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold text-foreground">{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
