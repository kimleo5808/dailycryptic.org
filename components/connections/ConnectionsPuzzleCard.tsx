import Link from "next/link";
import type { DecodedConnectionsPuzzle } from "@/types/connections";

const DOT_COLOR = {
  yellow: "bg-amber-400",
  green: "bg-emerald-400",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
};

interface ConnectionsPuzzleCardProps {
  puzzle: DecodedConnectionsPuzzle;
  isLatest?: boolean;
}

export default function ConnectionsPuzzleCard({
  puzzle,
  isLatest,
}: ConnectionsPuzzleCardProps) {
  const dateLabel = new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <Link
      href={`/connections-hint/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground">
            {puzzle.id}
          </span>
          <span className="text-sm font-semibold text-foreground">
            Connections #{puzzle.id}
          </span>
        </div>
        {isLatest && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            Latest
          </span>
        )}
      </div>

      {/* Group preview */}
      <div className="mt-3 space-y-1.5">
        {puzzle.groups.map((group) => (
          <div key={group.color} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${DOT_COLOR[group.color]}`}
            />
            <span className="truncate text-xs text-muted-foreground">
              {group.name}
            </span>
          </div>
        ))}
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
