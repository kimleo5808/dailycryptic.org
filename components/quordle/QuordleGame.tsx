"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WordleBoard from "@/components/games/shared/WordleBoard";
import WordleKeyboard, {
  type WordleKey,
} from "@/components/games/shared/WordleKeyboard";
import QuordleShareButton from "@/components/quordle/QuordleShareButton";
import { useWordleGame } from "@/hooks/useWordleGame";
import {
  QUORDLE_MAX_GUESSES,
  QUORDLE_WORD_LENGTH,
  aggregateLetterState,
  getDailyPuzzleNumber,
  getRandomAnswers,
  getTodayAnswers,
  getUtcDateKey,
  isValidGuess,
} from "@/lib/quordle-data";
import { useQuordleStore } from "@/stores/quordleStore";
import type { LetterState, QuordleMode } from "@/types/quordle";

interface QuordleGameProps {
  mode: QuordleMode;
}

function formatElapsed(ms: number | null): string {
  if (ms === null || ms < 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuordleGame({ mode }: QuordleGameProps) {
  const hydrate = useQuordleStore((s) => s.hydrate);
  const hydrated = useQuordleStore((s) => s.hydrated);
  const colorBlind = useQuordleStore((s) => s.colorBlind);
  const dailyByDate = useQuordleStore((s) => s.dailyByDate);
  const practice = useQuordleStore((s) => s.practice);
  const ensureDaily = useQuordleStore((s) => s.ensureDaily);
  const ensurePractice = useQuordleStore((s) => s.ensurePractice);
  const addGuess = useQuordleStore((s) => s.addGuess);
  const markFinished = useQuordleStore((s) => s.markFinished);
  const resetPractice = useQuordleStore((s) => s.resetPractice);

  const [currentGuess, setCurrentGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const todayKey = useMemo(() => getUtcDateKey(), []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (mode === "daily") {
      if (!dailyByDate[todayKey]) {
        ensureDaily(todayKey, getTodayAnswers());
      }
    } else if (!practice) {
      ensurePractice(getRandomAnswers());
    }
  }, [hydrated, mode, dailyByDate, practice, todayKey, ensureDaily, ensurePractice]);

  const current = useMemo(() => {
    if (!hydrated) return null;
    if (mode === "daily") return dailyByDate[todayKey] ?? null;
    return practice;
  }, [hydrated, mode, dailyByDate, practice, todayKey]);

  const sharedGuesses = current?.guesses ?? [];
  const answers = (current?.answers ?? ["", "", "", ""]) as [
    string,
    string,
    string,
    string,
  ];

  const board0 = useWordleGame({
    answer: answers[0],
    guesses: sharedGuesses,
    maxRows: QUORDLE_MAX_GUESSES,
  });
  const board1 = useWordleGame({
    answer: answers[1],
    guesses: sharedGuesses,
    maxRows: QUORDLE_MAX_GUESSES,
  });
  const board2 = useWordleGame({
    answer: answers[2],
    guesses: sharedGuesses,
    maxRows: QUORDLE_MAX_GUESSES,
  });
  const board3 = useWordleGame({
    answer: answers[3],
    guesses: sharedGuesses,
    maxRows: QUORDLE_MAX_GUESSES,
  });

  const boards = useMemo(
    () => [board0, board1, board2, board3],
    [board0, board1, board2, board3],
  );

  const allWon = current ? boards.every((b) => b.status === "won") : false;
  const gameOver =
    current !== null && (allWon || sharedGuesses.length >= QUORDLE_MAX_GUESSES);

  // Mark finished once we know the game is over
  const markedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!current || !gameOver) return;
    const dateKey = mode === "daily" ? todayKey : "practice";
    const signature = `${mode}:${dateKey}:${sharedGuesses.length}`;
    if (markedRef.current === signature) return;
    if (current.finishedAt) {
      markedRef.current = signature;
      return;
    }
    markFinished(mode, todayKey);
    markedRef.current = signature;
  }, [current, gameOver, mode, todayKey, sharedGuesses.length, markFinished]);

  // Timer tick
  useEffect(() => {
    if (!current?.startedAt || current?.finishedAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [current?.startedAt, current?.finishedAt]);

  const aggregatedLetterStates = useMemo(() => {
    const agg: Record<string, LetterState> = {};
    for (const b of boards) {
      for (const [letter, state] of Object.entries(b.letterStates)) {
        agg[letter] = aggregateLetterState(agg[letter], state);
      }
    }
    return agg;
  }, [boards]);

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
        if (currentGuess.length !== QUORDLE_WORD_LENGTH) {
          triggerShake("Not enough letters");
          return;
        }
        if (!isValidGuess(currentGuess)) {
          triggerShake("Not in word list");
          return;
        }
        addGuess(mode, todayKey, currentGuess);
        setCurrentGuess("");
        return;
      }
      if (key === "backspace") {
        setCurrentGuess((g) => g.slice(0, -1));
        return;
      }
      if (typeof key === "string" && /^[a-z]$/.test(key)) {
        if (currentGuess.length < QUORDLE_WORD_LENGTH) {
          setCurrentGuess((g) => g + key.toUpperCase());
        }
      }
    },
    [current, gameOver, currentGuess, mode, todayKey, addGuess, triggerShake],
  );

  const onNewPractice = useCallback(() => {
    resetPractice(getRandomAnswers());
    setCurrentGuess("");
    setErrorMsg(null);
    markedRef.current = null;
  }, [resetPractice]);

  const puzzleNumber = mode === "daily" ? getDailyPuzzleNumber() : null;
  const elapsed = current?.startedAt
    ? (current.finishedAt ?? now) - current.startedAt
    : 0;

  const guessesPerBoard: (number | null)[] = boards.map((b, i) => {
    if (b.status !== "won") return null;
    const answerUpper = answers[i].toUpperCase();
    const idx = sharedGuesses.findIndex(
      (g) => g.toUpperCase() === answerUpper,
    );
    return idx === -1 ? null : idx + 1;
  });

  if (!hydrated || !current) {
    return (
      <div
        className="mx-auto flex h-[420px] w-full max-w-3xl animate-pulse items-center justify-center rounded-xl border border-border bg-muted/30"
        aria-label="Loading Quordle"
      >
        <span className="text-sm text-muted-foreground">Loading Quordle…</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
      {/* Status bar */}
      <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-card/60 px-4 py-2 text-sm">
        <div className="font-semibold text-foreground">
          {mode === "daily" && puzzleNumber
            ? `Daily Quordle #${puzzleNumber}`
            : "Practice Quordle"}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Guess{" "}
            <span className="font-semibold text-foreground">
              {Math.min(sharedGuesses.length + (gameOver ? 0 : 1), QUORDLE_MAX_GUESSES)}
            </span>{" "}
            / {QUORDLE_MAX_GUESSES}
          </span>
          <span className="font-mono">⏱ {formatElapsed(elapsed)}</span>
        </div>
      </div>

      {errorMsg && (
        <div
          role="status"
          className="rounded-md bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground"
        >
          {errorMsg}
        </div>
      )}

      {/* Boards: 2×2 on md+, 1×4 on mobile */}
      <div className="grid w-full grid-cols-1 justify-items-center gap-3 sm:grid-cols-2">
        {boards.map((b, i) => (
          <WordleBoard
            key={i}
            rows={QUORDLE_MAX_GUESSES}
            wordLength={QUORDLE_WORD_LENGTH}
            guesses={sharedGuesses}
            evaluations={b.evaluations}
            currentGuess={b.status === "playing" ? currentGuess : ""}
            status={b.status}
            compact
            shake={shake && b.status === "playing"}
            dimmed={b.status !== "playing"}
            colorBlind={colorBlind}
            ariaLabel={`Quordle board ${i + 1}`}
          />
        ))}
      </div>

      {/* Game over summary */}
      {gameOver && (
        <div className="w-full rounded-xl border border-border bg-card/80 p-4 text-center">
          <p className="mb-2 text-base font-semibold text-foreground">
            {allWon ? "All four solved!" : "Out of guesses"}
          </p>
          {!allWon && (
            <p className="mb-3 text-sm text-muted-foreground">
              Answers: {answers.map((a) => a.toUpperCase()).join(" · ")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <QuordleShareButton
              puzzleNumber={puzzleNumber}
              mode={mode}
              guessesPerBoard={guessesPerBoard}
              guessLimit={QUORDLE_MAX_GUESSES}
            />
            {mode === "practice" && (
              <button
                type="button"
                onClick={onNewPractice}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                New practice game
              </button>
            )}
          </div>
        </div>
      )}

      {/* Keyboard */}
      <WordleKeyboard
        onKey={handleKey}
        letterStates={aggregatedLetterStates}
        disabled={gameOver}
        colorBlind={colorBlind}
        className="mt-1"
      />
    </div>
  );
}
