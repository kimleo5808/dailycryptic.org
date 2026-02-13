"use client";

import type { StrandsPuzzle } from "@/types/strands";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { StrandsGridStatic } from "./StrandsGrid";

interface StrandsAnswerRevealProps {
  puzzle: StrandsPuzzle;
}

export function StrandsAnswerReveal({ puzzle }: StrandsAnswerRevealProps) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 text-center">
        <EyeOff className="mx-auto h-8 w-8 text-primary/60" />
        <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
          Spoiler Warning
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The complete answers for today&apos;s Strands puzzle are hidden below.
        </p>
        <button
          onClick={() => setRevealed(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          <Eye className="h-4 w-4" />
          Reveal All Answers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Complete Answers
        </h3>
        <button
          onClick={() => setRevealed(false)}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Hide answers
        </button>
      </div>

      {/* Spangram */}
      <div className="rounded-xl bg-strands-spangram/10 border border-strands-spangram/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-strands-spangram">
          Spangram
        </p>
        <p className="mt-1 text-lg font-bold text-foreground uppercase tracking-wide">
          {puzzle.spangram}
        </p>
      </div>

      {/* Theme Words */}
      <div className="rounded-xl bg-strands-theme/10 border border-strands-theme/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-strands-theme">
          Theme Words
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {puzzle.themeWords.map((word) => (
            <span
              key={word}
              className="rounded-md bg-strands-theme/15 px-2.5 py-1 text-xs font-bold text-foreground uppercase"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Grid with highlights */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Solved Grid
        </p>
        <StrandsGridStatic puzzle={puzzle} />
      </div>
    </div>
  );
}
