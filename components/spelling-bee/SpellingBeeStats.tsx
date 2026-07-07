import type { SpellingBeeStats } from "@/types/spelling-bee";

/**
 * Daily stats bar: word count, pangram count, Genius score, Queen Bee score.
 * Spoiler-safe — it reveals quantities, never the words themselves.
 */
export default function SpellingBeeStatsBar({ stats }: { stats: SpellingBeeStats }) {
  const items = [
    { label: "Words", value: stats.wordCount },
    { label: "Pangrams", value: stats.pangramCount },
    { label: "Genius", value: stats.geniusScore, suffix: "pts" },
    { label: "Queen Bee", value: stats.maxScore, suffix: "pts" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 font-heading text-2xl font-bold text-foreground">
            {item.value}
            {item.suffix && (
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                {item.suffix}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
