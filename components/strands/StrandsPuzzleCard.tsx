import Link from "next/link";
import type { DecodedStrandsPuzzle } from "@/types/strands";

interface StrandsPuzzleCardProps {
  puzzle: DecodedStrandsPuzzle;
  isLatest?: boolean;
}

export default function StrandsPuzzleCard({
  puzzle,
  isLatest,
}: StrandsPuzzleCardProps) {
  const dateLabel = new Date(
    puzzle.printDate + "T12:00:00Z"
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const cluePreview =
    puzzle.clue.length > 55
      ? puzzle.clue.slice(0, 55) + "..."
      : puzzle.clue;

  const wordCount = puzzle.themeWords.length + 1; // +1 for spangram

  return (
    <Link
      href={`/strands-hint/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/50 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-xs font-bold text-amber-950">
            {puzzle.id}
          </span>
          <span className="text-sm font-semibold text-foreground">
            Strands #{puzzle.id}
          </span>
        </div>
        {isLatest && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/60 dark:text-amber-200">
            Latest
          </span>
        )}
      </div>

      {/* Clue preview */}
      <p className="mt-3 text-sm italic text-muted-foreground">
        &ldquo;{cluePreview}&rdquo;
      </p>

      {/* Word count */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">
          {wordCount} words
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">
          {puzzle.spangramDirection === "horizontal" ? "←→" : "↕"} spangram
        </span>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground">{dateLabel}</span>
        <span className="text-xs font-medium text-primary transition group-hover:underline">
          View Hints →
        </span>
      </div>
    </Link>
  );
}
