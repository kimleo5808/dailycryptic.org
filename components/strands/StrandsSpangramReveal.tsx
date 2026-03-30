"use client";

import { useState } from "react";

interface StrandsSpangramRevealProps {
  /** Base64-encoded spangram */
  spangram: string;
  direction: "horizontal" | "vertical";
  letterCount: number;
}

export default function StrandsSpangramReveal({
  spangram,
  direction,
  letterCount,
}: StrandsSpangramRevealProps) {
  const [level, setLevel] = useState(0); // 0=meta only, 1=first/last, 2=full

  const decoded = atob(spangram);
  const firstLetter = decoded[0];
  const lastLetter = decoded[decoded.length - 1];

  return (
    <div className="overflow-hidden rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-amber-50 to-yellow-50 transition-all dark:border-yellow-600 dark:from-amber-950/30 dark:to-yellow-950/20">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="text-lg">&#11088;</span>
        <span className="font-heading text-sm font-bold text-foreground">
          Spangram
        </span>
      </div>

      {/* Always-visible meta */}
      <div className="flex flex-wrap gap-2 border-t border-yellow-300/50 px-4 py-3 dark:border-yellow-700/40">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
          {direction === "horizontal" ? "←→" : "↕"}{" "}
          {direction === "horizontal" ? "Horizontal" : "Vertical"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
          {letterCount} letters
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={() => setLevel(level >= 1 ? 0 : 1)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 1
              ? "bg-yellow-400 text-yellow-950"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {level >= 1 ? "Hide Letters" : "First & Last Letter"}
        </button>
        <button
          type="button"
          onClick={() => setLevel(level >= 2 ? 1 : 2)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 2
              ? "bg-yellow-400 text-yellow-950"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {level >= 2 ? "Hide Spangram" : "Reveal Spangram"}
        </button>
      </div>

      {/* Reveal content */}
      {level >= 1 && (
        <div
          className="border-t border-yellow-300/50 px-4 py-3 animate-fade-in-up dark:border-yellow-700/40"
          style={{ animationDuration: "0.15s" }}
        >
          {level === 1 && (
            <p className="font-mono text-lg font-bold tracking-widest text-foreground">
              {firstLetter}
              <span className="mx-1 text-muted-foreground">
                {"·".repeat(Math.max(letterCount - 2, 1))}
              </span>
              {lastLetter}
            </p>
          )}
          {level >= 2 && (
            <p className="inline-block rounded-lg bg-yellow-300 px-4 py-1.5 font-heading text-lg font-bold text-yellow-950 dark:bg-yellow-500/80 dark:text-yellow-950">
              {decoded}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
