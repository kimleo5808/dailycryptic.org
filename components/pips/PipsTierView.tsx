"use client";

import { useState } from "react";
import type { PipsDecodedTier, PipsTierKey } from "@/types/pips";
import PipsBoard from "./PipsBoard";

interface TierEntry {
  key: PipsTierKey;
  label: string;
  tier: PipsDecodedTier;
  strategyHint: string;
}

const TIER_META: { key: PipsTierKey; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export default function PipsTierView({ tiers }: { tiers: TierEntry[] }) {
  const [active, setActive] = useState<PipsTierKey>("easy");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const entry = tiers.find((t) => t.key === active) ?? tiers[0];
  const isRevealed = !!revealed[active];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Difficulty tabs */}
      <div role="tablist" aria-label="Pips difficulty" className="flex gap-1 rounded-lg bg-muted p-1">
        {TIER_META.map((meta) => {
          const selected = meta.key === active;
          return (
            <button
              key={meta.key}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(meta.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
                selected
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Board */}
      <div
        key={active + (isRevealed ? "-solved" : "")}
        className="mt-5 animate-fade-in-up motion-reduce:animate-none"
        style={{ animationDuration: "0.3s" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">= equal</span>
          <span className="font-mono">6 = sum</span>
          <span className="font-mono">&gt;n / &lt;n</span>
          <span>plain = no rule</span>
        </div>
        <div className="mt-3">
          <PipsBoard tier={entry.tier} solved={isRevealed} />
        </div>
      </div>

      {/* Strategy hint */}
      <div className="mt-5 rounded-xl border-l-4 border-l-primary bg-primary/5 p-4">
        <p className="mb-1 text-sm font-bold text-primary">
          Spoiler-free strategy — {entry.label}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {entry.strategyHint}
        </p>
      </div>

      {/* Reveal solution */}
      <div className="mt-4 text-center">
        {!isRevealed ? (
          <button
            type="button"
            aria-expanded={false}
            onClick={() => setRevealed((r) => ({ ...r, [active]: true }))}
            className="rounded-lg bg-[hsl(var(--cta))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--cta-foreground))] transition hover:opacity-90"
          >
            Reveal the solved {entry.label} board
          </button>
        ) : (
          <button
            type="button"
            aria-expanded={true}
            onClick={() => setRevealed((r) => ({ ...r, [active]: false }))}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Hide the {entry.label} solution
          </button>
        )}
      </div>
    </div>
  );
}
