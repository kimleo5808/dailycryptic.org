"use client";

import { useState } from "react";

interface WordleHintCardProps {
  hint1: string;
  hint2: string;
  hint3: string;
}

export default function WordleHintCard({
  hint1,
  hint2,
  hint3,
}: WordleHintCardProps) {
  const [level, setLevel] = useState(0);

  const hints = [
    { label: "Hint 1", sublabel: "Vague clue", content: hint1 },
    { label: "Hint 2", sublabel: "More specific", content: hint2 },
    { label: "Hint 3", sublabel: "Partial letters", content: hint3 },
  ];

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="h-3.5 w-3.5 rounded-full bg-emerald-400" />
        <span className="font-heading text-sm font-bold text-foreground">
          Today&apos;s Wordle Hints
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4 pb-3">
        {hints.map((h, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLevel(level >= i + 1 ? i : i + 1)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              level >= i + 1
                ? "bg-emerald-400 text-emerald-950"
                : "bg-background text-foreground border border-border hover:bg-muted"
            }`}
          >
            {level >= i + 1 ? `Hide ${h.label}` : h.label}
          </button>
        ))}
      </div>

      {/* Reveal area */}
      {level >= 1 && (
        <div className="space-y-2 px-4 pb-4 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          {hints.slice(0, level).map((h, i) => (
            <div key={i} className="rounded-lg bg-white/60 p-3 dark:bg-white/5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {h.label} — {h.sublabel}
              </p>
              <p className={`mt-1 text-sm font-medium text-foreground ${i === 2 ? "font-mono tracking-[0.3em] text-base" : ""}`}>
                {h.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
