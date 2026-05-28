import { cn } from "@/lib/utils";

type ParsePart = {
  /** The literal fragment, e.g. "FLOW" or "-ER" */
  text: string;
  /** The role label shown under it, e.g. "verb" or "agent noun" */
  label: string;
};

/**
 * Visual decomposition of a misleading word, e.g. FLOW + ER -> RIVER.
 * Server component; uses CSS-only staggered reveal that respects
 * prefers-reduced-motion via the mc-fade-up utility.
 */
export function ClueParseBreakdown({
  eyebrow = "The textbook example",
  word,
  parts,
  decoy,
  meaning,
  className,
}: {
  eyebrow?: string;
  word: string;
  parts: ParsePart[];
  decoy: string;
  meaning: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
        className
      )}
    >
      <span className="text-sm font-medium text-primary">{eyebrow}</span>

      <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {word}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-4">
        {parts.map((part, i) => (
          <div key={i} className="flex items-center gap-3">
            {i > 0 && (
              <span
                className="mc-fade-up text-xl font-bold text-muted-foreground"
                style={{ animationDelay: `${i * 0.12}s` }}
                aria-hidden
              >
                +
              </span>
            )}
            <div
              className="mc-fade-up flex flex-col items-center"
              style={{ animationDelay: `${i * 0.12 + 0.06}s` }}
            >
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-base font-bold text-primary">
                {part.text}
              </span>
              <span className="mt-1.5 text-xs text-muted-foreground">
                {part.label}
              </span>
            </div>
          </div>
        ))}

        <span
          className="mc-fade-up text-xl font-bold text-muted-foreground"
          style={{ animationDelay: `${parts.length * 0.12 + 0.06}s` }}
          aria-hidden
        >
          →
        </span>
        <div
          className="mc-fade-up flex flex-col items-center"
          style={{ animationDelay: `${parts.length * 0.12 + 0.12}s` }}
        >
          <span className="inline-flex items-center rounded-full bg-primary px-5 py-1.5 text-base font-bold text-primary-foreground">
            {meaning}
          </span>
          <span className="mt-1.5 text-xs text-muted-foreground">answer</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-r-xl border border-transparent border-l-4 border-l-amber-400 bg-amber-50/60 p-4 dark:bg-amber-950/20">
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
            ✗ Looks like
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {decoy}
          </p>
        </div>
        <div className="rounded-r-xl border border-transparent border-l-4 border-l-primary bg-primary/5 p-4">
          <p className="text-sm font-bold text-primary">✓ Actually means</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {meaning}
          </p>
        </div>
      </div>
    </section>
  );
}
