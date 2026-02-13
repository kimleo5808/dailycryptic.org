import type { StrandsPuzzle } from "@/types/strands";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface StrandsPuzzleCardProps {
  puzzle: StrandsPuzzle;
  isLatest?: boolean;
}

export function StrandsPuzzleCard({ puzzle, isLatest }: StrandsPuzzleCardProps) {
  const formattedDate = dayjs(puzzle.printDate).format("MMMM D, YYYY");

  return (
    <Link
      href={`/strands-hint/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          Puzzle #{puzzle.id}
        </span>
        {isLatest && (
          <span className="inline-block rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
            Latest
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-bold text-foreground line-clamp-1">
        &ldquo;{puzzle.clue}&rdquo;
      </h3>

      <div className="mt-2 space-y-1">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-strands-spangram" />
          <span className="truncate">Spangram: {puzzle.spangram.length} letters</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-strands-theme" />
          <span>{puzzle.themeWords.length} theme words</span>
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          View Hints
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function StrandsPuzzleCardCompact({ puzzle }: { puzzle: StrandsPuzzle }) {
  return (
    <Link
      href={`/strands-hint/${puzzle.printDate}`}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
    >
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-strands-spangram" />
        <span className="h-2 w-2 rounded-full bg-strands-theme" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          #{puzzle.id} — {dayjs(puzzle.printDate).format("MMM D")}
        </p>
      </div>
      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
