"use client";

import { useState } from "react";
import LetterBoxedBox from "./LetterBoxedBox";

interface Starter {
  letter: string;
  side: string;
  length: number;
}
interface Hints {
  wordCount: number;
  wordLengths: number[];
  starters: Starter[];
}

function HintPanel({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/50"
      >
        <span className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          <span aria-hidden className="text-[hsl(var(--strands-hint))]">◆</span>
          {title}
          {badge && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
          )}
        </span>
        <span aria-hidden className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="animate-fade-in-up border-t border-border px-4 py-4 motion-reduce:animate-none" style={{ animationDuration: "0.3s" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function LetterBoxedPlay({
  sides,
  solution,
  hints,
}: {
  sides: string[];
  solution: string[];
  hints: Hints;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-6">
      {/* The box */}
      <div className="rounded-2xl border border-border bg-gradient-to-b from-[hsl(var(--strands-hint))]/[0.06] to-transparent p-6">
        <LetterBoxedBox sides={sides} solution={solution} showPath={revealed} />
      </div>

      {/* Spoiler-free hints */}
      <div className="space-y-3">
        <HintPanel title="How many words is the solution?" badge="Spoiler-free" defaultOpen>
          <p className="text-sm text-muted-foreground">
            The official New York Times answer solves today&apos;s box in{" "}
            <span className="font-semibold text-foreground">
              {hints.wordCount} word{hints.wordCount === 1 ? "" : "s"}
            </span>
            . It is possible to solve Letter Boxed in more words, but two is the
            gold standard.
          </p>
        </HintPanel>

        <HintPanel title="How long is each word?" badge="Spoiler-free">
          <ul className="flex flex-wrap gap-2">
            {hints.wordLengths.map((len, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground"
              >
                Word {i + 1}: <span className="font-bold">{len}</span> letters
              </li>
            ))}
          </ul>
        </HintPanel>

        <HintPanel title="First letters of each word" badge="Bigger hint">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {hints.starters.map((s, i) => (
              <li key={i}>
                Word {i + 1} starts with{" "}
                <span className="font-mono font-bold text-foreground">{s.letter}</span>{" "}
                on the <span className="font-medium text-foreground">{s.side}</span> side.
              </li>
            ))}
          </ul>
        </HintPanel>
      </div>

      {/* Reveal solution */}
      <div className="rounded-2xl border border-[hsl(var(--strands-hint))]/40 bg-[hsl(var(--strands-hint))]/[0.05] p-4 text-center shadow-sm sm:p-6">
        {!revealed ? (
          <>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-[hsl(var(--strands-hint))]">
              ◆ Spoiler below
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The official {hints.wordCount}-word solution for today&apos;s Letter Boxed.
            </p>
            <button
              type="button"
              aria-expanded={false}
              onClick={() => setRevealed(true)}
              className="mt-3 rounded-lg bg-[hsl(var(--strands-hint))] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Reveal today&apos;s answer
            </button>
          </>
        ) : (
          <div className="animate-fade-in-up motion-reduce:animate-none" style={{ animationDuration: "0.3s" }}>
            <p className="text-xs font-bold uppercase tracking-wide text-[hsl(var(--strands-hint))]">
              Today&apos;s answer
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {solution.map((word, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground" aria-hidden>→</span>}
                  <span className="rounded-lg bg-[hsl(var(--strands-hint))]/15 px-3 py-1.5 font-mono text-base font-bold tracking-wide text-foreground">
                    {word}
                  </span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRevealed(false)}
              className="mt-3 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
