"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuordleHowToPlayProps {
  className?: string;
}

export default function QuordleHowToPlay({ className }: QuordleHowToPlayProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {open ? "Hide rules" : "How to play"}
      </button>
      {open && (
        <div className="mt-3 rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Quordle rules</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Guess <strong>four</strong> five-letter words at the same time.</li>
            <li>Each guess is scored against <em>all four</em> target words simultaneously.</li>
            <li>A <span className="font-semibold text-emerald-600 dark:text-emerald-500">green</span> tile means the letter is in the right spot.</li>
            <li>A <span className="font-semibold text-amber-500">yellow</span> tile means the letter is in the word but in a different position.</li>
            <li>A gray tile means the letter is not in that word.</li>
            <li>You have <strong>nine</strong> total guesses to solve all four boards.</li>
            <li>Daily mode: everyone gets the same 4 answers each UTC day. Practice mode: unlimited random puzzles.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
