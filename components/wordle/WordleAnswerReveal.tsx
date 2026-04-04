"use client";

import { useState } from "react";

interface WordleAnswerRevealProps {
  /** Base64-encoded solution */
  encodedSolution: string;
}

export default function WordleAnswerReveal({
  encodedSolution,
}: WordleAnswerRevealProps) {
  const [revealed, setRevealed] = useState(false);

  const solution = revealed ? atob(encodedSolution).toUpperCase() : "";

  return (
    <div className="rounded-xl border-2 border-stone-300 bg-stone-50 p-4 text-center dark:border-stone-700 dark:bg-stone-900/40">
      {!revealed ? (
        <>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            ⚠️ Spoiler alert — full answer below
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-full bg-stone-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-900 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-100"
          >
            Reveal Answer
          </button>
        </>
      ) : (
        <div className="animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Today&apos;s Wordle Answer
          </p>
          <div className="flex justify-center gap-1.5">
            {solution.split("").map((letter, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-500 text-2xl font-bold text-white sm:h-16 sm:w-16 sm:text-3xl"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
