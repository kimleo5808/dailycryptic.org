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
  /**
   * Collapse future (non-active, non-submitted) rows into thin bars
   * to reduce vertical footprint — matches merriam-webster Quordle layout.
   */
  stubEmptyRows?: boolean;
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
      return "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/70 dark:text-zinc-100";
  }
}

const TILE_EMPTY =
  "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/70 dark:text-zinc-100";
const TILE_FILLED =
  "bg-background text-foreground ring-[1.5px] ring-inset ring-zinc-400 dark:ring-zinc-400";

export default function WordleBoard({
  rows,
  wordLength,
  guesses,
  evaluations,
  currentGuess = "",
  status = "playing",
  compact = false,
  stubEmptyRows = false,
  shake = false,
  dimmed = false,
  colorBlind = false,
  className,
  ariaLabel,
}: WordleBoardProps) {
  // Tile sizing: bigger by default, merriam-webster-like presence
  const tileSize = compact
    ? "h-9 w-9 text-base sm:h-10 sm:w-10 sm:text-lg"
    : "h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl";
  const stubWidth = compact ? "w-9 sm:w-10" : "w-12 sm:w-14";
  const rowGap = "gap-[2px] sm:gap-[3px]";
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
        const collapsed = stubEmptyRows && !isSubmitted && !isActive;
        const guess = isSubmitted
          ? guesses[rowIdx].toUpperCase()
          : isActive
            ? currentGuess.toUpperCase()
            : "";
        const evals = isSubmitted ? evaluations[rowIdx] : [];

        if (collapsed) {
          // Thin stub row: a single horizontal strip per cell
          return (
            <div role="row" key={rowIdx} className={cn("inline-flex", rowGap)}>
              {Array.from({ length: wordLength }).map((__, colIdx) => (
                <div
                  role="gridcell"
                  key={colIdx}
                  aria-hidden="true"
                  className={cn(
                    "h-[6px] rounded-sm bg-zinc-200 dark:bg-zinc-800/60",
                    stubWidth,
                  )}
                />
              ))}
            </div>
          );
        }

        return (
          <div
            role="row"
            key={rowIdx}
            className={cn(
              "inline-flex",
              rowGap,
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
