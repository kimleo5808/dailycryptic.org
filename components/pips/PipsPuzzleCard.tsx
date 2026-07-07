import Link from "next/link";
import type { PipsDecodedPuzzle } from "@/types/pips";

export default function PipsPuzzleCard({
  puzzle,
  isLatest,
}: {
  puzzle: PipsDecodedPuzzle;
  isLatest?: boolean;
}) {
  const dateLabel = new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );
  const totalDominoes =
    puzzle.tiers.easy.dominoes.length +
    puzzle.tiers.medium.dominoes.length +
    puzzle.tiers.hard.dominoes.length;

  return (
    <Link
      href={`/pips-answers/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{dateLabel}</span>
        {isLatest && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            Latest
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-1.5">
        {(["easy", "medium", "hard"] as const).map((k, i) => (
          <span
            key={k}
            className="flex-1 rounded-md py-1 text-center text-[10px] font-medium capitalize"
            style={{
              background: `hsl(var(--chart-${i + 1}) / 0.15)`,
              color: `hsl(var(--chart-${i + 1}))`,
            }}
          >
            {k}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-xs text-muted-foreground">
          {totalDominoes} dominoes · 3 tiers
        </span>
        <span className="text-xs font-medium text-primary transition group-hover:underline">
          Answers →
        </span>
      </div>
    </Link>
  );
}
