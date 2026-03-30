"use client";

import { useState } from "react";
import StrandsPuzzleCard from "./StrandsPuzzleCard";
import type { DecodedStrandsPuzzle } from "@/types/strands";

interface StrandsMonthGroupProps {
  rangeLabel: string;
  puzzles: DecodedStrandsPuzzle[];
  latestId?: number;
}

const INITIAL_VISIBLE = 9;

export default function StrandsMonthGroup({
  rangeLabel,
  puzzles,
  latestId,
}: StrandsMonthGroupProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? puzzles : puzzles.slice(0, INITIAL_VISIBLE);
  const hasMore = puzzles.length > INITIAL_VISIBLE;

  return (
    <section>
      <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
        {rangeLabel}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((puzzle) => (
          <StrandsPuzzleCard
            key={puzzle.printDate}
            puzzle={puzzle}
            isLatest={puzzle.id === latestId}
          />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            Show More ({puzzles.length - INITIAL_VISIBLE} more)
          </button>
        </div>
      )}
    </section>
  );
}
