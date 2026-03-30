"use client";

import { useState } from "react";

interface StrandsWordListProps {
  /** Base64-encoded theme words */
  themeWords: string[];
  /** Base64-encoded spangram */
  spangram: string;
}

export default function StrandsWordList({
  themeWords,
  spangram,
}: StrandsWordListProps) {
  const [revealed, setRevealed] = useState(false);
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  const totalCount = themeWords.length + 1; // +1 for spangram

  const toggleWord = (index: number) => {
    setRevealedWords((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const revealAll = () => {
    setRevealed(true);
    const all = new Set<number>();
    for (let i = 0; i <= themeWords.length; i++) all.add(i);
    setRevealedWords(all);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {!revealed && revealedWords.size === 0 ? (
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Spoiler alert — full answers below
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalCount} words ({themeWords.length} theme words + 1 spangram)
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-lg border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Reveal One by One
            </button>
            <button
              type="button"
              onClick={revealAll}
              className="rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
            >
              Reveal All Answers
            </button>
          </div>
        </div>
      ) : (
        <div
          className="space-y-2 animate-fade-in-up"
          style={{ animationDuration: "0.15s" }}
        >
          <h3 className="font-heading text-lg font-bold text-foreground">
            Theme Words
          </h3>

          {/* Theme words */}
          <div className="space-y-1.5">
            {themeWords.map((word, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                {revealedWords.has(i) ? (
                  <span className="rounded-lg bg-blue-100 px-3 py-1 font-mono text-sm font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                    {atob(word)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleWord(i)}
                    className="rounded-lg border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
                  >
                    Reveal Word {i + 1}
                  </button>
                )}
              </div>
            ))}

            {/* Spangram row */}
            <div className="flex items-center gap-2 pt-1">
              <span className="flex w-6 items-center justify-center text-lg">
                &#11088;
              </span>
              {revealedWords.has(themeWords.length) ? (
                <span className="rounded-lg bg-yellow-200 px-3 py-1 font-mono text-sm font-bold text-yellow-900 dark:bg-yellow-600/40 dark:text-yellow-100">
                  {atob(spangram)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleWord(themeWords.length)}
                  className="rounded-lg border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800 dark:hover:border-yellow-600 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-300"
                >
                  Reveal Spangram
                </button>
              )}
            </div>
          </div>

          {/* Reveal all button (if not all revealed) */}
          {revealedWords.size < totalCount && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={revealAll}
                className="rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
              >
                Reveal All ({totalCount - revealedWords.size} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
