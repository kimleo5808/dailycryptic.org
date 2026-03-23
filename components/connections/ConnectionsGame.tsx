"use client";

import { useState, useMemo, useCallback } from "react";
import type { ConnectionsColor } from "@/types/connections";

/* ------------------------------------------------------------------ */
/*  Color config                                                       */
/* ------------------------------------------------------------------ */

const COLOR_BG: Record<ConnectionsColor, string> = {
  yellow: "bg-amber-300 dark:bg-amber-400",
  green: "bg-emerald-400 dark:bg-emerald-500",
  blue: "bg-blue-400 dark:bg-blue-500",
  purple: "bg-purple-400 dark:bg-purple-500",
};

const COLOR_TEXT: Record<ConnectionsColor, string> = {
  yellow: "text-amber-950",
  green: "text-emerald-950",
  blue: "text-blue-950",
  purple: "text-purple-950",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GameGroup {
  color: ConnectionsColor;
  name: string;
  words: string[];
}

interface ConnectionsGameProps {
  puzzleId: number;
  /** base64-encoded groups — decoded client-side to avoid exposing answers in page source */
  encodedGroups: {
    color: ConnectionsColor;
    name: string;
    words: string[];
  }[];
}

interface SolvedGroup {
  color: ConnectionsColor;
  name: string;
  words: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fromBase64(s: string): string {
  try {
    return atob(s);
  } catch {
    return s;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ConnectionsGame({
  puzzleId,
  encodedGroups,
}: ConnectionsGameProps) {
  // Decode groups client-side
  const groups: GameGroup[] = useMemo(
    () =>
      encodedGroups.map((g) => ({
        color: g.color,
        name: fromBase64(g.name),
        words: g.words.map(fromBase64),
      })),
    [encodedGroups]
  );

  // All 16 words, shuffled once on mount
  const allWords = useMemo(() => {
    const words = groups.flatMap((g) => g.words);
    return shuffle(words);
  }, [groups]);

  const [board, setBoard] = useState<string[]>(allWords);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState<SolvedGroup[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [guessHistory, setGuessHistory] = useState<ConnectionsColor[]>([]);

  const maxMistakes = 4;
  const won = solved.length === 4;

  // Find which group a word belongs to
  const findGroup = useCallback(
    (word: string): GameGroup | undefined => {
      return groups.find((g) => g.words.includes(word));
    },
    [groups]
  );

  // Toggle word selection
  function toggleWord(word: string) {
    if (gameOver) return;
    const next = new Set(selected);
    if (next.has(word)) {
      next.delete(word);
    } else if (next.size < 4) {
      next.add(word);
    }
    setSelected(next);
    setFeedback(null);
  }

  // Shuffle remaining board words
  function handleShuffle() {
    setBoard(shuffle(board));
  }

  // Deselect all
  function handleDeselect() {
    setSelected(new Set());
    setFeedback(null);
  }

  // Submit guess
  function handleSubmit() {
    if (selected.size !== 4 || gameOver) return;

    const selectedWords = Array.from(selected);

    // Check if all 4 words belong to the same group
    const group = findGroup(selectedWords[0]);
    if (!group) return;

    const allMatch = selectedWords.every((w) => group.words.includes(w));

    if (allMatch) {
      // Correct!
      const newSolved = [
        ...solved,
        { color: group.color, name: group.name, words: group.words },
      ];
      setSolved(newSolved);
      setBoard(board.filter((w) => !group.words.includes(w)));
      setSelected(new Set());
      setGuessHistory([...guessHistory, group.color]);
      setFeedback(null);

      // Check if all groups solved
      if (newSolved.length === 4) {
        setGameOver(true);
      }
    } else {
      // Check for "one away"
      const groupCounts = new Map<string, number>();
      for (const w of selectedWords) {
        const g = findGroup(w);
        if (g) {
          groupCounts.set(
            g.name,
            (groupCounts.get(g.name) || 0) + 1
          );
        }
      }
      const maxCount = Math.max(...groupCounts.values());
      const isOneAway = maxCount === 3;

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      if (isOneAway) {
        setFeedback("One away!");
      } else {
        setFeedback("Incorrect");
      }

      if (newMistakes >= maxMistakes) {
        // Game over — reveal remaining groups
        setGameOver(true);
        setSelected(new Set());

        // Auto-solve remaining groups
        const solvedNames = new Set(solved.map((s) => s.name));
        const remaining = groups.filter((g) => !solvedNames.has(g.name));
        const allSolved = [...solved, ...remaining.map((g) => ({
          color: g.color,
          name: g.name,
          words: g.words,
        }))];
        setSolved(allSolved);
        setBoard([]);
      } else {
        setSelected(new Set());
      }
    }
  }

  // Generate share text
  function getShareText(): string {
    const colorEmoji: Record<ConnectionsColor, string> = {
      yellow: "🟨",
      green: "🟩",
      blue: "🟦",
      purple: "🟪",
    };

    const lines = [`Connections Puzzle #${puzzleId}`];
    // Show each guess as a row of emojis
    // Simplified: show solved order
    for (const g of solved) {
      lines.push(colorEmoji[g.color].repeat(4));
    }
    if (mistakes > 0) {
      lines.push(`Mistakes: ${mistakes}`);
    }
    lines.push("dailycryptic.org/connections-game");
    return lines.join("\n");
  }

  function handleShare() {
    const text = getShareText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setFeedback("Copied to clipboard!");
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Create four groups of four!
        </p>
      </div>

      {/* Solved groups */}
      {solved.length > 0 && (
        <div className="mt-4 space-y-2">
          {solved.map((group) => (
            <div
              key={group.name}
              className={`rounded-xl ${COLOR_BG[group.color]} p-3 text-center animate-fade-in-up`}
              style={{ animationDuration: "0.4s" }}
            >
              <p
                className={`text-sm font-bold uppercase tracking-wide ${COLOR_TEXT[group.color]}`}
              >
                {group.name}
              </p>
              <p className={`mt-0.5 text-xs ${COLOR_TEXT[group.color]} opacity-80`}>
                {group.words.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Word grid */}
      {board.length > 0 && (
        <div
          className={`mt-4 grid grid-cols-4 gap-2 ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
        >
          {board.map((word) => {
            const isSelected = selected.has(word);
            return (
              <button
                key={word}
                type="button"
                onClick={() => toggleWord(word)}
                disabled={gameOver}
                className={`flex min-h-[3.5rem] items-center justify-center rounded-lg border-2 px-2 py-2 text-center text-xs font-bold uppercase transition-all sm:min-h-[4rem] sm:text-sm ${
                  isSelected
                    ? "border-stone-700 bg-stone-700 text-white scale-[0.97] dark:border-stone-300 dark:bg-stone-300 dark:text-stone-900"
                    : "border-border bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                } ${gameOver ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <p
          className={`mt-3 text-center text-sm font-semibold ${
            feedback === "One away!"
              ? "text-amber-600 dark:text-amber-400"
              : feedback === "Copied to clipboard!"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Mistakes indicator */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground">
          Mistakes Remaining:
        </span>
        {Array.from({ length: maxMistakes }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition ${
              i < maxMistakes - mistakes
                ? "bg-stone-700 dark:bg-stone-300"
                : "bg-stone-300 dark:bg-stone-700"
            }`}
          />
        ))}
      </div>

      {/* Action buttons */}
      {!gameOver && (
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className="rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={handleDeselect}
            className="rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Deselect All
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.size !== 4}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              selected.size === 4
                ? "bg-stone-800 text-white hover:bg-stone-900 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-100"
                : "bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600"
            }`}
          >
            Submit
          </button>
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="mt-5 space-y-3 text-center animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
          <p className="font-heading text-lg font-bold text-foreground">
            {won
              ? mistakes === 0
                ? "Perfect!"
                : "Well done!"
              : "Better luck next time!"}
          </p>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Share Results
          </button>
        </div>
      )}
    </div>
  );
}
