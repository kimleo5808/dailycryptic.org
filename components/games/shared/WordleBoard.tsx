"use client";

import { cn } from "@/lib/utils";
import type { BoardStatus, LetterState } from "@/types/quordle";

interface WordleBoardProps {
  rows: number;
  wordLength: number;
  guesses: string[];
  evaluations: LetterState[][];
  currentGuess?: string;
  status?: BoardStatus;
  /** Use smaller tiles for multi-board layouts (e.g. Quordle 2×2). */
  compact?: boolean;
  /** Shake the active row (e.g. invalid guess). */
  shake?: boolean;
  /** Optional dim style for completed boards. */
  dimmed?: boolean;
  /** Color-blind mode swaps green/yellow for blue/orange. */
  colorBlind?: boolean;
  className?: string;
  ariaLabel?: string;
}

const TILE_EMPTY =
  "border-2 border-zinc-300 bg-transparent text-foreground dark:border-zinc-700";
const TILE_FILLED =
  "border-2 border-zinc-400 bg-transparent text-foreground dark:border-zinc-500";

function tileColor(state: LetterState, colorBlind: boolean): string {
  switch (state) {
    case "correct":
      return colorBlind
        ? "border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600"
        : "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-600 dark:bg-emerald-600";
    case "present":
      return colorBlind
        ? "border-orange-400 bg-orange-400 text-white dark:border-orange-500 dark:bg-orange-500"
        : "border-amber-400 bg-amber-400 text-white dark:border-amber-500 dark:bg-amber-500";
    case "absent":
      return "border-zinc-400 bg-zinc-400 text-white dark:border-zinc-700 dark:bg-zinc-700";
    default:
      return TILE_EMPTY;
  }
}

export default function WordleBoard({
  rows,
  wordLength,
  guesses,
  evaluations,
  currentGuess = "",
  status = "playing",
  compact = false,
  shake = false,
  dimmed = false,
  colorBlind = false,
  className,
  ariaLabel,
}: WordleBoardProps) {
  const tileSize = compact
    ? "h-8 w-8 text-base sm:h-9 sm:w-9 sm:text-lg"
    : "h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl";
  const gap = compact ? "gap-1" : "gap-1.5";
  const rowGap = compact ? "gap-1" : "gap-1.5";
  const activeRowIndex = guesses.length;

  return (
    <div
      role="grid"
      aria-label={ariaLabel ?? "Wordle board"}
      className={cn(
        "inline-flex flex-col",
        rowGap,
        dimmed && "opacity-70",
        className,
      )}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const isSubmitted = rowIdx < guesses.length;
        const isActive =
          rowIdx === activeRowIndex && status === "playing";
        const guess = isSubmitted
          ? guesses[rowIdx].toUpperCase()
          : isActive
            ? currentGuess.toUpperCase()
            : "";
        const evals = isSubmitted ? evaluations[rowIdx] : [];

        return (
          <div
            role="row"
            key={rowIdx}
            className={cn(
              "inline-flex",
              gap,
              isActive && shake && "animate-shake",
            )}
          >
            {Array.from({ length: wordLength }).map((__, colIdx) => {
              const letter = guess[colIdx] ?? "";
              const state: LetterState | undefined = isSubmitted
                ? evals[colIdx]
                : undefined;
              const filled = !isSubmitted && letter !== "";

              return (
                <div
                  role="gridcell"
                  key={colIdx}
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm font-heading font-bold uppercase transition-colors",
                    tileSize,
                    isSubmitted
                      ? cn(tileColor(state ?? "empty", colorBlind), "animate-tile-flip")
                      : filled
                        ? TILE_FILLED
                        : TILE_EMPTY,
                  )}
                  style={
                    isSubmitted
                      ? { animationDelay: `${colIdx * 90}ms` }
                      : undefined
                  }
                  aria-label={
                    letter
                      ? `${letter}${
                          state ? ` (${state})` : ""
                        }`
                      : "empty"
                  }
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
