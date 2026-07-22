import Link from "next/link";

/**
 * "Stuck?" funnel card shown on the Wordle answer pages. Routes solvers to the
 * Wordle Solver and the 5-letter word lists. When the day's answer is known, it
 * links straight to the word list for that answer's first letter — a fresh,
 * on-topic internal link every day.
 */
export default function WordleToolsCard({
  firstLetter,
}: {
  firstLetter?: string;
}) {
  const letter = firstLetter?.toUpperCase();
  const hasLetter = !!letter && /^[A-Z]$/.test(letter);

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold text-foreground">
        Stuck before the answer? Use our Wordle tools
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your green, yellow and gray clues to see every word that still
        fits — or browse word lists by letter.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/wordle-solver"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Open the Wordle Solver →
        </Link>
        {hasLetter && (
          <Link
            href={`/5-letter-words/starting-with/${letter.toLowerCase()}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            5-letter words starting with {letter}
          </Link>
        )}
        <Link
          href="/5-letter-words"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          All 5-letter word lists
        </Link>
      </div>
    </div>
  );
}
