"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WordleBoard from "@/components/games/shared/WordleBoard";
import WordleKeyboard, {
  type WordleKey,
} from "@/components/games/shared/WordleKeyboard";
import QuordleModeTabs from "@/components/quordle/QuordleModeTabs";
import QuordleSettingsMenu from "@/components/quordle/QuordleSettingsMenu";
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
  onModeChange: (mode: QuordleMode) => void;
}

function formatElapsed(ms: number | null): string {
  if (ms === null || ms < 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuordleGame({ mode, onModeChange }: QuordleGameProps) {
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

  const guessCount = Math.min(
    sharedGuesses.length + (gameOver ? 0 : 1),
    QUORDLE_MAX_GUESSES,
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
      {/* Unified status bar */}
      <div className="flex w-full items-center justify-between gap-2 border-b border-border pb-2">
        <QuordleModeTabs mode={mode} onChange={onModeChange} />
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground sm:text-xs">
          <span className="font-semibold text-foreground">
            {mode === "daily" && puzzleNumber ? `#${puzzleNumber}` : "Random"}
          </span>
          <span>
            {guessCount}/{QUORDLE_MAX_GUESSES}
          </span>
          <span className="font-mono">{formatElapsed(elapsed)}</span>
        </div>
        <QuordleSettingsMenu />
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

      {/* Loading skeleton while store is hydrating */}
      {(!hydrated || !current) && (
        <div
          className="flex h-72 w-full animate-pulse items-center justify-center rounded-lg bg-muted/40"
          aria-label="Loading Quordle"
        >
          <span className="text-xs text-muted-foreground">Loading…</span>
        </div>
      )}

      {hydrated && current && (
        <>
          {/* 2×2 board grid — always two columns */}
          <div className="grid grid-cols-2 justify-items-center gap-x-2.5 gap-y-2 sm:gap-x-4 sm:gap-y-3">
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

          {/* Game-over summary */}
          {gameOver && (
            <div className="w-full rounded-lg border border-border bg-card/70 p-3 text-center">
              <p className="text-sm font-semibold text-foreground">
                {allWon ? "All four solved!" : "Out of guesses"}
              </p>
              {!allWon && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Answers:{" "}
                  <span className="font-mono text-foreground">
                    {answers.map((a) => a.toUpperCase()).join(" · ")}
                  </span>
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
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
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
                  >
                    New game
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
          />
        </>
      )}
    </div>
  );
}
