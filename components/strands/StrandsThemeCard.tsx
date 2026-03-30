"use client";

import { useState } from "react";

interface StrandsThemeCardProps {
  clue: string;
  hint: string;
  /** Base64-encoded theme name */
  theme: string;
}

export default function StrandsThemeCard({
  clue,
  hint,
  theme,
}: StrandsThemeCardProps) {
  const [level, setLevel] = useState(0); // 0=clue only, 1=hint, 2=theme

  return (
    <div className="overflow-hidden rounded-xl border-2 border-amber-300 bg-amber-50 transition-all dark:border-amber-700 dark:bg-amber-950/30">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-950">
          ?
        </span>
        <span className="font-heading text-sm font-bold text-foreground">
          Today&apos;s Theme
        </span>
      </div>

      {/* Clue (always visible) */}
      <div className="border-t border-amber-200/60 px-4 py-3 dark:border-amber-800/40">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
          NYT Clue
        </p>
        <p className="mt-1 font-heading text-base font-semibold italic text-foreground">
          &ldquo;{clue}&rdquo;
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={() => setLevel(level >= 1 ? 0 : 1)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 1
              ? "bg-amber-400 text-amber-950"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {level >= 1 ? "Hide Hint" : "See Hint"}
        </button>
        <button
          type="button"
          onClick={() => setLevel(level >= 2 ? 1 : 2)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 2
              ? "bg-amber-400 text-amber-950"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {level >= 2 ? "Hide Theme" : "Reveal Theme"}
        </button>
      </div>

      {/* Reveal content */}
      {level >= 1 && (
        <div
          className="space-y-2 border-t border-amber-200/60 px-4 py-3 animate-fade-in-up dark:border-amber-800/40"
          style={{ animationDuration: "0.15s" }}
        >
          {/* Level 1: Our hint */}
          <p className="text-sm italic text-muted-foreground">{hint}</p>

          {/* Level 2: Theme name */}
          {level >= 2 && (
            <p className="font-heading text-lg font-bold text-amber-800 dark:text-amber-200">
              {atob(theme)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
