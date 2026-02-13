"use client";

import type { StrandsPuzzle } from "@/types/strands";
import { Eye } from "lucide-react";
import { useState } from "react";

interface StrandsClickToRevealProps {
  puzzle: StrandsPuzzle;
}

export function StrandsClickToReveal({ puzzle }: StrandsClickToRevealProps) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25"
      >
        <Eye className="h-4 w-4" />
        Click to reveal the answer
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Spangram */}
      <div className="rounded-lg px-4 py-3 text-center bg-strands-spangram text-amber-950">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
          Spangram
        </p>
        <p className="mt-1 text-sm font-bold uppercase">{puzzle.spangram}</p>
      </div>
      {/* Theme Words */}
      <div className="rounded-lg px-4 py-3 text-center bg-strands-theme text-white">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
          Theme Words ({puzzle.themeWords.length})
        </p>
        <p className="mt-1 text-sm font-bold uppercase">
          {puzzle.themeWords.join(", ")}
        </p>
      </div>
    </div>
  );
}
