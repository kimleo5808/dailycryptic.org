"use client";

import { Check, Delete, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UnlimitedPuzzle = {
  id: number;
  clue: string;
  answer: string;
  hintLevels: [string, string, string, string];
  clueType: string;
  difficulty: string;
  explanation: string;
};

type FeedbackState = "idle" | "correct" | "incorrect";

type UnlimitedStats = {
  totalSolved: number;
  currentStreak: number;
  bestStreak: number;
};

const STORAGE_KEY_IDS = "unlimited-solved-ids";
const STORAGE_KEY_STATS = "unlimited-stats";

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function normalizeAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

function loadSolvedIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSolvedIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(ids));
  } catch {}
}

function loadStats(): UnlimitedStats {
  if (typeof window === "undefined")
    return { totalSolved: 0, currentStreak: 0, bestStreak: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    return raw
      ? JSON.parse(raw)
      : { totalSolved: 0, currentStreak: 0, bestStreak: 0 };
  } catch {
    return { totalSolved: 0, currentStreak: 0, bestStreak: 0 };
  }
}

function saveStats(stats: UnlimitedStats) {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch {}
}

function pickRandom(puzzles: UnlimitedPuzzle[], solvedIds: number[]): UnlimitedPuzzle {
  const unsolved = puzzles.filter((p) => !solvedIds.includes(p.id));
  const pool = unsolved.length > 0 ? unsolved : puzzles;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function UnlimitedGame({
  puzzles,
}: {
  puzzles: UnlimitedPuzzle[];
}) {
  const [mounted, setMounted] = useState(false);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [stats, setStats] = useState<UnlimitedStats>({
    totalSolved: 0,
    currentStreak: 0,
    bestStreak: 0,
  });
  const [current, setCurrent] = useState<UnlimitedPuzzle>(() => puzzles[0]);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState(0);

  const expected = useMemo(() => normalizeAnswer(current.answer), [current.answer]);
  const expectedLength = expected.length;
  const maxHintLevel = current.hintLevels.filter(Boolean).length;

  const resetFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearFeedbackTimer = useCallback(() => {
    if (resetFeedbackTimerRef.current) {
      clearTimeout(resetFeedbackTimerRef.current);
      resetFeedbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearFeedbackTimer(), [clearFeedbackTimer]);

  useEffect(() => {
    const ids = loadSolvedIds();
    const s = loadStats();
    setSolvedIds(ids);
    setStats(s);
    setCurrent(pickRandom(puzzles, ids));
    setMounted(true);
  }, [puzzles]);

  const triggerIncorrectFeedback = useCallback(
    (msg: string) => {
      setFeedback("incorrect");
      setMessage(msg);
      clearFeedbackTimer();
      resetFeedbackTimerRef.current = setTimeout(() => {
        setFeedback("idle");
      }, 500);
    },
    [clearFeedbackTimer]
  );

  const handleInput = useCallback(
    (char: string) => {
      if (solved) return;
      if (!/^[A-Z]$/.test(char)) return;
      if (guess.length >= expectedLength) return;
      setGuess((prev) => prev + char);
      if (feedback !== "idle") setFeedback("idle");
    },
    [solved, guess.length, expectedLength, feedback]
  );

  const handleDelete = useCallback(() => {
    if (solved) return;
    setGuess((prev) => prev.slice(0, -1));
    if (feedback !== "idle") setFeedback("idle");
  }, [solved, feedback]);

  const handleCheck = useCallback(() => {
    if (solved) return;
    const normalized = normalizeAnswer(guess);
    if (normalized.length < expectedLength) {
      triggerIncorrectFeedback(`Enter all ${expectedLength} letters first.`);
      return;
    }
    if (normalized === expected) {
      setFeedback("correct");
      setMessage("Correct!");
      setSolved(true);
      const newIds = [...solvedIds, current.id];
      const newStats = {
        totalSolved: stats.totalSolved + 1,
        currentStreak: stats.currentStreak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1),
      };
      setSolvedIds(newIds);
      setStats(newStats);
      saveSolvedIds(newIds);
      saveStats(newStats);
    } else {
      triggerIncorrectFeedback("Not quite — try again.");
    }
  }, [solved, guess, expected, expectedLength, triggerIncorrectFeedback, solvedIds, current.id, stats]);

  const handleReveal = useCallback(() => {
    if (solved) return;
    setGuess(expected);
    setFeedback("correct");
    setMessage("Answer revealed.");
    setSolved(true);
    setRevealed(true);
    const newIds = [...solvedIds, current.id];
    const newStats = {
      ...stats,
      totalSolved: stats.totalSolved + 1,
      currentStreak: 0,
      bestStreak: stats.bestStreak,
    };
    setSolvedIds(newIds);
    setStats(newStats);
    saveSolvedIds(newIds);
    saveStats(newStats);
  }, [solved, expected, solvedIds, current.id, stats]);

  const handleNextPuzzle = useCallback(() => {
    const next = pickRandom(puzzles, solvedIds);
    setCurrent(next);
    setGuess("");
    setFeedback("idle");
    setMessage("");
    setSolved(false);
    setRevealed(false);
    setRevealedHintLevel(0);
  }, [puzzles, solvedIds]);

  const handleShowHint = useCallback(() => {
    if (revealedHintLevel < maxHintLevel) {
      setRevealedHintLevel((prev) => prev + 1);
    }
  }, [revealedHintLevel, maxHintLevel]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
        return;
      }
      if (key === "Enter") {
        e.preventDefault();
        if (solved) {
          handleNextPuzzle();
        } else {
          handleCheck();
        }
        return;
      }
      const upper = key.toUpperCase();
      if (/^[A-Z]$/.test(upper)) {
        e.preventDefault();
        handleInput(upper);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleInput, handleDelete, handleCheck, handleNextPuzzle, solved]);

  const cells = Array.from({ length: expectedLength }, (_, i) => guess[i] ?? "");

  const feedbackBorder =
    feedback === "correct"
      ? "ring-2 ring-emerald-400"
      : feedback === "incorrect"
        ? "ring-2 ring-red-400 animate-shake"
        : "";

  if (!mounted) {
    return (
      <section className="flex flex-col items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-600" />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center">
      {/* Stats bar */}
      <div className="mb-4 flex items-center gap-6 text-sm font-medium text-slate-700">
        <span>Solved: {stats.totalSolved} / {puzzles.length}</span>
        <span>Streak: {stats.currentStreak}</span>
        <span>Best: {stats.bestStreak}</span>
      </div>

      {/* Difficulty badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-white/40 px-3 py-0.5 text-xs font-semibold capitalize text-slate-600">
          {current.difficulty}
        </span>
        <span className="rounded-full bg-white/40 px-3 py-0.5 text-xs font-semibold capitalize text-slate-600">
          {current.clueType.replace("-", " ")}
        </span>
      </div>

      {/* Clue */}
      <p className="mb-5 max-w-xl text-center text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl">
        &ldquo;{current.clue}&rdquo;
      </p>

      {/* Input cells */}
      <div className={`flex gap-1.5 ${feedbackBorder} rounded-lg p-1`}>
        {cells.map((char, i) => (
          <div
            key={i}
            className={`flex h-11 w-9 items-center justify-center rounded-md border-2 text-lg font-bold sm:h-12 sm:w-10 sm:text-xl ${
              char
                ? "border-slate-400 bg-white text-slate-900"
                : "border-slate-300 bg-white/60 text-transparent"
            }`}
          >
            {char || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="mt-3 h-6 text-center text-sm font-medium">
        {feedback === "correct" && (
          <span className="text-emerald-600">{message}</span>
        )}
        {feedback === "incorrect" && (
          <span className="text-red-600">{message}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-3">
        {!solved ? (
          <>
            <button
              type="button"
              onClick={handleCheck}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.97]"
            >
              <Check className="h-4 w-4" /> Check
            </button>
            <button
              type="button"
              onClick={handleShowHint}
              disabled={revealedHintLevel >= maxHintLevel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.97] disabled:opacity-40"
            >
              <HelpCircle className="h-4 w-4" /> Hint{" "}
              {revealedHintLevel > 0 && `(${revealedHintLevel}/${maxHintLevel})`}
            </button>
            <button
              type="button"
              onClick={handleReveal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.97]"
            >
              Reveal
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleNextPuzzle}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.97]"
          >
            Next Puzzle <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hints */}
      {revealedHintLevel > 0 && (
        <div className="mt-4 w-full max-w-md space-y-2">
          {current.hintLevels.slice(0, revealedHintLevel).map((hint, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            >
              <span className="font-semibold">Hint {i + 1}:</span> {hint}
            </div>
          ))}
        </div>
      )}

      {/* Explanation after solve */}
      {solved && (
        <div className="mt-5 w-full max-w-md rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">
            Answer: {current.answer}
          </p>
          <p className="mt-1 text-sm text-emerald-700">{current.explanation}</p>
        </div>
      )}

      {/* Virtual keyboard */}
      <div className="mt-5 pb-1">
        <div className="mx-auto w-full max-w-[520px] select-none rounded-2xl bg-white/15 p-2.5">
          <div className="space-y-2">
            {KEY_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1.5">
                {row.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleInput(key)}
                    disabled={solved}
                    className="h-11 w-8 rounded-md border border-slate-300 bg-white text-base font-semibold text-slate-700 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-10 md:w-11"
                  >
                    {key}
                  </button>
                ))}
                {rowIndex === 2 ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={solved}
                    aria-label="Delete one letter"
                    className="inline-flex h-11 w-10 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-700 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-12 md:w-14"
                  >
                    <Delete className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
