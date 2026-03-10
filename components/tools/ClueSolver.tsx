"use client";

import { useState, useMemo } from "react";

type SolverPuzzle = {
  clue: string;
  answer: string;
  clueType: string;
  difficulty: string;
  explanation: string;
  printDate: string;
};

function normalizeText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
}

function matchesPattern(answer: string, pattern: string): boolean {
  if (!pattern) return true;
  const clean = pattern.toUpperCase().replace(/[^A-Z?]/g, "");
  if (clean.length !== answer.length) return false;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] !== "?" && clean[i] !== answer[i]) return false;
  }
  return true;
}

export default function ClueSolver({ puzzles }: { puzzles: SolverPuzzle[] }) {
  const [query, setQuery] = useState("");
  const [letterCount, setLetterCount] = useState("");
  const [pattern, setPattern] = useState("");
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = normalizeText(query);
    const count = letterCount ? parseInt(letterCount, 10) : 0;

    return puzzles.filter((p) => {
      if (count > 0 && p.answer.length !== count) return false;
      if (pattern && !matchesPattern(p.answer, pattern)) return false;
      if (q && !normalizeText(p.clue).includes(q) && !p.answer.toLowerCase().includes(q)) return false;
      return true;
    }).slice(0, 20);
  }, [puzzles, query, letterCount, pattern]);

  const hasInput = query || letterCount || pattern;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="font-heading text-lg font-bold text-foreground">Search Clues & Answers</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Search by clue text, answer word, letter count, or known letter pattern.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label htmlFor="solver-query" className="mb-1 block text-xs font-medium text-muted-foreground">
            Clue text or answer
          </label>
          <input
            id="solver-query"
            type="text"
            placeholder='e.g. "mixed" or "ALERT"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="solver-count" className="mb-1 block text-xs font-medium text-muted-foreground">
            Letter count
          </label>
          <input
            id="solver-count"
            type="number"
            min={2}
            max={15}
            placeholder="e.g. 5"
            value={letterCount}
            onChange={(e) => setLetterCount(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="solver-pattern" className="mb-1 block text-xs font-medium text-muted-foreground">
            Letter pattern (use ? for unknown)
          </label>
          <input
            id="solver-pattern"
            type="text"
            placeholder="e.g. A?E?T"
            value={pattern}
            onChange={(e) => setPattern(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm tracking-wider text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {hasInput && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">
            {results.length === 0
              ? "No matches found."
              : `${results.length}${results.length === 20 ? "+" : ""} result${results.length !== 1 ? "s" : ""}`}
          </p>
          <div className="mt-3 space-y-2">
            {results.map((p) => (
              <div
                key={p.printDate}
                className="rounded-xl border border-border bg-background p-3 transition hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{p.clue}</p>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                    {p.answer}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {p.clueType}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {p.difficulty}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {p.printDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowExplanation(showExplanation === p.printDate ? null : p.printDate)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {showExplanation === p.printDate ? "Hide explanation" : "Show explanation"}
                  </button>
                </div>
                {showExplanation === p.printDate && (
                  <p className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                    {p.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
