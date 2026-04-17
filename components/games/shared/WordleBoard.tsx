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
   * Collapse future (non-active, non-submitted) rows into thin bars.
   * Kept as an opt-in — off by default for standard full-grid rendering.
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

/*
 * Wordle-proven semantic palette. Chosen for maximum legibility and because
 * it matches the mental model users already have from the original game.
 *   correct: #6aaa64 (light) / #538d4e (dark)
 *   present: #c9b458 (light) / #b59f3b (dark)
 *   absent:  #787c7e (light) / #3a3a3c (dark)
 * Empty tiles get a visible 2px border so the grid reads clearly.
 */

function tileColor(state: LetterState, colorBlind: boolean): string {
  switch (state) {
    case "correct":
      return colorBlind
        ? "bg-[#3b82f6] border-2 border-[#3b82f6] text-white dark:bg-[#2563eb] dark:border-[#2563eb]"
        : "bg-[#6aaa64] border-2 border-[#6aaa64] text-white dark:bg-[#538d4e] dark:border-[#538d4e]";
    case "present":
      return colorBlind
        ? "bg-[#f97316] border-2 border-[#f97316] text-white dark:bg-[#ea580c] dark:border-[#ea580c]"
        : "bg-[#c9b458] border-2 border-[#c9b458] text-white dark:bg-[#b59f3b] dark:border-[#b59f3b]";
    case "absent":
      return "bg-[#787c7e] border-2 border-[#787c7e] text-white dark:bg-[#3a3a3c] dark:border-[#3a3a3c]";
    default:
      return TILE_EMPTY;
  }
}

const TILE_EMPTY =
  "bg-white border-2 border-[#d3d6da] text-[#1a1a1b] dark:bg-transparent dark:border-[#3a3a3c] dark:text-white";
const TILE_FILLED =
  "bg-white border-2 border-[#878a8c] text-[#1a1a1b] dark:bg-transparent dark:border-[#565758] dark:text-white";

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
  const tileSize = compact
    ? "h-7 w-7 text-sm sm:h-8 sm:w-8 sm:text-base lg:h-11 lg:w-11 lg:text-lg"
    : "h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl";
  const stubWidth = compact ? "w-7 sm:w-8 lg:w-11" : "w-12 sm:w-14";
  const rowGap = "gap-[3px] sm:gap-[4px]";
  const activeRowIndex = guesses.length;

  return (
    <div
      role="grid"
      aria-label={ariaLabel ?? "Wordle board"}
      className={cn(
        "inline-flex flex-col",
        rowGap,
        dimmed && "opacity-75",
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
          return (
            <div role="row" key={rowIdx} className={cn("inline-flex", rowGap)}>
              {Array.from({ length: wordLength }).map((__, colIdx) => (
                <div
                  role="gridcell"
                  key={colIdx}
                  aria-hidden="true"
                  className={cn(
                    "h-[6px] rounded-sm bg-[#d3d6da] dark:bg-[#3a3a3c]",
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
                    "inline-flex items-center justify-center rounded-[3px] font-heading font-extrabold uppercase leading-none transition-colors",
                    tileSize,
                    isSubmitted
                      ? cn(
                          tileColor(state ?? "empty", colorBlind),
                          "animate-tile-flip",
                        )
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
                      ? `${letter}${state ? ` (${state})` : ""}`
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
