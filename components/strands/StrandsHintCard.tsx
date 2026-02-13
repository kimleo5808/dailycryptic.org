"use client";

import type { StrandsPuzzle } from "@/types/strands";
import { ChevronDown, Eye, EyeOff, Lightbulb } from "lucide-react";
import { useState } from "react";

/**
 * Progressive hint system for Strands puzzles.
 *
 * Hint levels:
 * 1. Theme clue (already given by the puzzle)
 * 2. Spangram length + first letter
 * 3. Reveal some theme words
 * 4. Reveal the Spangram word
 * 5. Reveal all theme words
 */

interface StrandsHintCardProps {
  puzzle: StrandsPuzzle;
}

export function StrandsHintCard({ puzzle }: StrandsHintCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [revealLevel, setRevealLevel] = useState(0);

  const totalThemeWords = puzzle.themeWords.length;
  const halfCount = Math.ceil(totalThemeWords / 2);

  const hints = [
    {
      label: "Hint 1: Theme Clue",
      content: `Today's theme clue is: "${puzzle.clue}". Think about what words could relate to this theme on the letter grid.`,
    },
    {
      label: "Hint 2: Spangram Info",
      content: `The Spangram is ${puzzle.spangram.length} letters long and starts with "${puzzle.spangram[0]}". It spans the entire board and relates to the theme.`,
    },
    {
      label: `Hint 3: ${halfCount} Theme Words`,
      content: `Some of today's theme words are: ${puzzle.themeWords.slice(0, halfCount).join(", ")}. Can you find the rest?`,
    },
    {
      label: "Hint 4: The Spangram",
      content: `The Spangram word is: "${puzzle.spangram}". Find it on the board — it spans from one side to the other!`,
    },
    {
      label: "Hint 5: All Theme Words",
      content: `All theme words: ${puzzle.themeWords.join(", ")}. Plus the Spangram: ${puzzle.spangram}.`,
    },
  ];

  return (
    <div className="rounded-xl border border-primary/20 bg-card overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {revealLevel}/{hints.length}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Hint content */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          {hints.map((hint, i) => (
            <div key={i}>
              {i < revealLevel ? (
                <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">
                      {hint.label}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {hint.content}
                    </p>
                  </div>
                </div>
              ) : i === revealLevel ? (
                <button
                  onClick={() => setRevealLevel(revealLevel + 1)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Eye className="h-4 w-4" />
                  Reveal {hint.label}
                </button>
              ) : null}
            </div>
          ))}

          {revealLevel >= hints.length && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              All hints revealed! Check the answer section below for the full
              grid solution.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual theme word hint cards — one per word with click-to-reveal.
 */
interface WordHintListProps {
  puzzle: StrandsPuzzle;
}

export function WordHintList({ puzzle }: WordHintListProps) {
  return (
    <div className="space-y-2">
      {/* Spangram card */}
      <WordHintItem
        label="Spangram"
        hint={`${puzzle.spangram.length} letters, starts with "${puzzle.spangram[0]}"`}
        answer={puzzle.spangram}
        variant="spangram"
      />
      {/* Theme word cards */}
      {puzzle.themeWords.map((word, i) => (
        <WordHintItem
          key={word}
          label={`Theme Word ${i + 1}`}
          hint={`${word.length} letters, starts with "${word[0]}"`}
          answer={word}
          variant="theme"
        />
      ))}
    </div>
  );
}

function WordHintItem({
  label,
  hint,
  answer,
  variant,
}: {
  label: string;
  hint: string;
  answer: string;
  variant: "theme" | "spangram";
}) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const borderColor =
    variant === "spangram"
      ? "border-strands-spangram/30"
      : "border-strands-theme/30";

  const badgeStyle =
    variant === "spangram"
      ? "bg-strands-spangram/15 text-strands-spangram"
      : "bg-strands-theme/15 text-strands-theme";

  return (
    <div className={`rounded-lg border ${borderColor} bg-card p-3`}>
      <div className="flex items-center justify-between">
        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badgeStyle}`}>
          {label}
        </span>
        <div className="flex gap-2">
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              Show Hint
            </button>
          )}
          {!showAnswer && (
            <button
              onClick={() => {
                setShowHint(true);
                setShowAnswer(true);
              }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Show Answer
            </button>
          )}
        </div>
      </div>
      {showHint && !showAnswer && (
        <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      )}
      {showAnswer && (
        <p className="mt-2 text-sm font-bold text-foreground uppercase tracking-wide">
          {answer}
        </p>
      )}
    </div>
  );
}
