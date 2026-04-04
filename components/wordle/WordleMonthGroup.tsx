"use client";

import { useState } from "react";
import WordlePuzzleCard from "./WordlePuzzleCard";
import type { DecodedWordlePuzzle } from "@/types/wordle";

interface WordleMonthGroupProps {
  rangeLabel: string;
  puzzles: DecodedWordlePuzzle[];
  latestDate?: string;
}

export default function WordleMonthGroup({
  rangeLabel,
  puzzles,
  latestDate,
}: WordleMonthGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? puzzles : puzzles.slice(0, 9);
  const hasMore = puzzles.length > 9;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-foreground">
        {rangeLabel}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((puzzle) => (
          <WordlePuzzleCard
            key={puzzle.printDate}
            puzzle={puzzle}
            isLatest={puzzle.printDate === latestDate}
          />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Show All ({puzzles.length - 9} more)
          </button>
        </div>
      )}
    </section>
  );
}
