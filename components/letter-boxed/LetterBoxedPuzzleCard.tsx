import Link from "next/link";
import type { DecodedLetterBoxedPuzzle } from "@/types/letter-boxed";

export default function LetterBoxedPuzzleCard({
  puzzle,
  isLatest,
}: {
  puzzle: DecodedLetterBoxedPuzzle;
  isLatest?: boolean;
}) {
  const dateLabel = new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <Link
      href={`/letter-boxed-answers/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-[hsl(var(--strands-hint))]/50 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{dateLabel}</span>
        {isLatest && (
          <span className="rounded-full bg-[hsl(var(--strands-hint))]/10 px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--strands-hint))]">
            Latest
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {puzzle.sides.map((side, i) => (
          <span
            key={i}
            className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-bold tracking-widest text-foreground"
          >
            {side}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground">
          {puzzle.stats.wordCount}-word solution
        </span>
        <span className="text-xs font-medium text-[hsl(var(--strands-hint))] transition group-hover:underline">
          Answer →
        </span>
      </div>
    </Link>
  );
}
