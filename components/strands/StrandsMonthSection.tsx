"use client";

import type { StrandsPuzzle } from "@/types/strands";
import dayjs from "dayjs";
import { useState } from "react";
import { StrandsPuzzleCard } from "./StrandsPuzzleCard";

interface StrandsMonthSectionProps {
  month: string;
  puzzles: StrandsPuzzle[];
  latestId?: number;
}

export function StrandsMonthSection({
  month,
  puzzles,
  latestId,
}: StrandsMonthSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const monthLabel = dayjs(`${month}-01`).format("MMMM YYYY");
  const firstId = puzzles[puzzles.length - 1]?.id;
  const lastId = puzzles[0]?.id;

  const displayed = showAll ? puzzles : puzzles.slice(0, 6);
  const hasMore = puzzles.length > 6;

  return (
    <section>
      <h2 className="mb-6 text-center font-heading text-xl font-bold text-foreground sm:text-2xl">
        Strands #{firstId}-{lastId} Hints ({monthLabel})
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((puzzle) => (
          <StrandsPuzzleCard
            key={puzzle.printDate}
            puzzle={puzzle}
            isLatest={puzzle.id === latestId}
          />
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
}
