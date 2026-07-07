"use client";

import { useState } from "react";

interface HintData {
  firstLetterCounts: { letter: string; count: number }[];
  twoLetterList: { prefix: string; count: number }[];
  lengthDistribution: { length: number; count: number }[];
  pangramCount: number;
  /** First letter + length of each pangram, e.g. "A – 9 letters". Never the word. */
  pangramShapes: { letter: string; length: number }[];
  /** The pangram words themselves, revealed only on demand. */
  pangrams: string[];
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
          <span aria-hidden className="text-[hsl(var(--cta))]">⬡</span>
          {title}
          {badge && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {badge}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          className="animate-fade-in-up border-t border-border px-4 py-4 motion-reduce:animate-none"
          style={{ animationDuration: "0.3s" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function PangramReveal({
  shapes,
  pangrams,
}: {
  shapes: { letter: string; length: number }[];
  pangrams: string[];
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {pangrams.length === 1
          ? "There is 1 pangram today. Here is its shape:"
          : `There are ${pangrams.length} pangrams today. Here are their shapes:`}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {shapes.map((s, i) => (
          <li
            key={i}
            className="rounded-lg border border-[hsl(var(--cta))]/40 bg-[hsl(var(--cta))]/5 px-3 py-1.5 font-mono text-sm font-semibold text-foreground"
          >
            {s.letter} · {s.length} letters
          </li>
        ))}
      </ul>
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-3 rounded-lg bg-[hsl(var(--cta))] px-4 py-2 text-sm font-semibold text-[hsl(var(--cta-foreground))] transition hover:opacity-90"
        >
          Reveal the pangram{pangrams.length > 1 ? "s" : ""}
        </button>
      ) : (
        <div
          className="mt-3 flex flex-wrap gap-2 animate-fade-in-up motion-reduce:animate-none"
          style={{ animationDuration: "0.3s" }}
        >
          {pangrams.map((word) => (
            <span
              key={word}
              className="rounded-lg bg-[hsl(var(--cta))]/15 px-3 py-1.5 font-mono text-base font-bold uppercase tracking-wide text-foreground"
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpellingBeeHintLadder({ data }: { data: HintData }) {
  return (
    <div className="space-y-3">
      <HintPanel title="How many words start with each letter?" badge="Spoiler-free" defaultOpen>
        <ul className="flex flex-wrap gap-2">
          {data.firstLetterCounts.map((f) => (
            <li
              key={f.letter}
              className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground"
            >
              <span className="font-bold">{f.letter}</span>
              <span className="text-muted-foreground"> × {f.count}</span>
            </li>
          ))}
        </ul>
      </HintPanel>

      <HintPanel title="Word length distribution" badge="Spoiler-free">
        <ul className="flex flex-wrap gap-2">
          {data.lengthDistribution.map((l) => (
            <li
              key={l.length}
              className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground"
            >
              {l.length} letters <span className="text-muted-foreground">▸ {l.count}</span>
            </li>
          ))}
        </ul>
      </HintPanel>

      <HintPanel title="Two-letter list" badge="Official-style hint">
        <p className="mb-3 text-sm text-muted-foreground">
          The number of answers that begin with each two-letter combination.
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 font-mono text-sm sm:grid-cols-4 md:grid-cols-6">
          {data.twoLetterList.map((t) => (
            <div key={t.prefix} className="flex justify-between border-b border-border/60 py-0.5">
              <span className="font-semibold text-foreground">{t.prefix}</span>
              <span className="text-muted-foreground">{t.count}</span>
            </div>
          ))}
        </div>
      </HintPanel>

      <HintPanel title="Pangram hint" badge="Reveal when ready">
        <PangramReveal shapes={data.pangramShapes} pangrams={data.pangrams} />
      </HintPanel>
    </div>
  );
}
