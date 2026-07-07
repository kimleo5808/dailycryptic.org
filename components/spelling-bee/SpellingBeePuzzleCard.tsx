import Link from "next/link";
import type { DecodedSpellingBeePuzzle } from "@/types/spelling-bee";

interface SpellingBeePuzzleCardProps {
  puzzle: DecodedSpellingBeePuzzle;
  isLatest?: boolean;
}

export default function SpellingBeePuzzleCard({
  puzzle,
  isLatest,
}: SpellingBeePuzzleCardProps) {
  const dateLabel = new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <Link
      href={`/spelling-bee-answers/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-[hsl(var(--cta))]/50 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--cta))]/15 font-heading text-sm font-bold uppercase text-[hsl(var(--cta))]">
            {puzzle.centerLetter}
          </span>
          <span className="text-sm font-semibold text-foreground">{dateLabel}</span>
        </div>
        {isLatest && (
          <span className="rounded-full bg-[hsl(var(--cta))]/10 px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--cta))]">
            Latest
          </span>
        )}
      </div>

      {/* Letters preview */}
      <div className="mt-3 flex flex-wrap gap-1">
        {puzzle.letters.map((letter, i) => (
          <span
            key={i}
            className={`flex h-6 w-6 items-center justify-center rounded font-mono text-xs font-bold uppercase ${
              i === 0
                ? "bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))]"
                : "bg-muted text-foreground"
            }`}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground">
          {puzzle.stats.wordCount} words · {puzzle.stats.pangramCount} pangram
          {puzzle.stats.pangramCount === 1 ? "" : "s"}
        </span>
        <span className="text-xs font-medium text-[hsl(var(--cta))] transition group-hover:underline">
          Answers →
        </span>
      </div>
    </Link>
  );
}
