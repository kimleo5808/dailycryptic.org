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

function tileColor(state: LetterState, colorBlind: boolean): string {
  switch (state) {
    case "correct":
      return colorBlind
        ? "bg-blue-500 text-white dark:bg-blue-600"
        : "bg-emerald-500 text-white dark:bg-emerald-600";
    case "present":
      return colorBlind
        ? "bg-orange-400 text-white dark:bg-orange-500"
        : "bg-amber-400 text-white dark:bg-amber-500";
    case "absent":
      return "bg-zinc-400 text-white dark:bg-zinc-700";
    default:
      return "bg-zinc-100 text-foreground dark:bg-zinc-800/70";
  }
}

const TILE_EMPTY = "bg-zinc-100 text-foreground dark:bg-zinc-800/70";
const TILE_FILLED =
  "bg-background text-foreground ring-1 ring-inset ring-zinc-400 dark:ring-zinc-500";

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
  // Quordle-optimized compact sizing: 24px on very small, 28px default, 32px md+
  const tileSize = compact
    ? "h-6 w-6 text-[0.7rem] sm:h-7 sm:w-7 sm:text-sm md:h-8 md:w-8 md:text-base"
    : "h-11 w-11 text-lg sm:h-14 sm:w-14 sm:text-2xl";
  const gap = compact ? "gap-[3px] sm:gap-1" : "gap-1.5";
  const activeRowIndex = guesses.length;

  return (
    <div
      role="grid"
      aria-label={ariaLabel ?? "Wordle board"}
      className={cn(
        "inline-flex flex-col",
        gap,
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
                    "inline-flex items-center justify-center rounded-[4px] font-heading font-bold uppercase transition-colors",
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
