import Link from "next/link";
import type { DecodedWordlePuzzle } from "@/types/wordle";

interface WordlePuzzleCardProps {
  puzzle: DecodedWordlePuzzle;
  isLatest?: boolean;
}

export default function WordlePuzzleCard({
  puzzle,
  isLatest,
}: WordlePuzzleCardProps) {
  const dateLabel = new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <Link
      href={`/wordle-answer/${puzzle.printDate}`}
      className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      {/* Number badge */}
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white">
          {puzzle.id}
        </span>
        {isLatest && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            Latest
          </span>
        )}
      </div>

      {/* 5 grey boxes */}
      <div className="mt-3 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-7 w-7 rounded bg-stone-200 dark:bg-stone-700"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{dateLabel}</span>
        <span className="text-xs font-medium text-primary group-hover:underline">
          View Hints →
        </span>
      </div>
    </Link>
  );
}
