"use client";

import { useMemo, useState } from "react";

interface SpellingBeeAnswersProps {
  answers: string[];
  pangrams: string[];
}

export default function SpellingBeeAnswers({
  answers,
  pangrams,
}: SpellingBeeAnswersProps) {
  const [revealed, setRevealed] = useState(false);
  const pangramSet = useMemo(() => new Set(pangrams), [pangrams]);

  const groups = useMemo(() => {
    const byLength = new Map<number, string[]>();
    for (const word of answers) {
      const arr = byLength.get(word.length);
      if (arr) arr.push(word);
      else byLength.set(word.length, [word]);
    }
    return Array.from(byLength.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([length, words]) => ({
        length,
        words: words.sort((a, b) => a.localeCompare(b)),
      }));
  }, [answers]);

  return (
    <div className="rounded-2xl border border-[hsl(var(--cta))]/40 bg-[hsl(var(--cta))]/[0.04] p-4 shadow-sm sm:p-6">
      {!revealed ? (
        <div className="text-center">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-[hsl(var(--cta))]">
            ⚠ Spoilers below
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The complete list of all {answers.length} answers for today&apos;s Spelling Bee.
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-3 rounded-lg bg-[hsl(var(--cta))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--cta-foreground))] transition hover:opacity-90"
          >
            Reveal all {answers.length} answers
          </button>
        </div>
      ) : (
        <div
          className="animate-fade-in-up motion-reduce:animate-none"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Today&apos;s Spelling Bee Answers
            </h3>
            <button
              type="button"
              onClick={() => setRevealed(false)}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Hide
            </button>
          </div>
          <div className="mt-4 space-y-5">
            {groups.map((group) => (
              <div key={group.length}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {group.length}-letter words · {group.words.length}
                </p>
                <ul className="columns-2 gap-4 sm:columns-3 md:columns-4">
                  {group.words.map((word) => {
                    const isPangram = pangramSet.has(word);
                    return (
                      <li
                        key={word}
                        className={`mb-1 break-inside-avoid font-mono text-sm uppercase tracking-wide ${
                          isPangram
                            ? "font-bold text-foreground"
                            : "text-foreground/90"
                        }`}
                      >
                        {isPangram && (
                          <span aria-label="pangram" className="mr-1 text-[hsl(var(--cta))]">
                            ⬡
                          </span>
                        )}
                        {word}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-[hsl(var(--cta))]">⬡</span> = pangram (uses all seven letters)
          </p>
        </div>
      )}
    </div>
  );
}
