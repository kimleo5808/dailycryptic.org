/**
 * Server-rendered Letter Boxed answer board.
 *
 * Unlike the interactive reveal in LetterBoxedPlay (a "use client" component
 * whose answer only enters the DOM after a click), every solution word is
 * present in the server HTML here so search engines can index the actual
 * answer. The words stay spoiler-protected for humans behind a native
 * <details> element (no JS needed) whose collapsed content is still crawlable.
 */

interface AnswerBoardProps {
  solution: string[];
  wordLengths: number[];
  dateLabel: string;
  defaultOpen?: boolean;
}

export default function LetterBoxedAnswerBoard({
  solution,
  wordLengths,
  dateLabel,
  defaultOpen = false,
}: AnswerBoardProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-foreground">
          Official Letter Boxed Solution
        </span>
        <span className="rounded-lg bg-[hsl(var(--strands-hint))] px-4 py-1.5 text-xs font-semibold text-white transition group-open:bg-muted group-open:text-muted-foreground">
          <span className="group-open:hidden">Reveal answer</span>
          <span className="hidden group-open:inline">Hide answer</span>
        </span>
      </summary>

      <p className="mt-3 text-xs text-muted-foreground">
        Spoiler warning — the full New York Times answer for {dateLabel} is shown
        below.
      </p>

      {/* The solution words, in play order */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {solution.map((word, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-muted-foreground" aria-hidden>
                →
              </span>
            )}
            <span className="rounded-lg bg-[hsl(var(--strands-hint))]/15 px-3 py-1.5 font-mono text-base font-bold tracking-wide text-foreground">
              {word}
            </span>
          </span>
        ))}
      </div>

      {/* Per-word breakdown */}
      <ul className="mt-4 space-y-2">
        {solution.map((word, i) => (
          <li
            key={i}
            className="rounded-xl border border-border/70 bg-background p-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="font-semibold text-foreground">
              Word {i + 1}: {word}
            </span>{" "}
            — {wordLengths[i]} letters
            {i > 0 && (
              <>
                , starting on{" "}
                <span className="font-mono font-bold text-foreground">
                  {word[0]}
                </span>{" "}
                to pick up the last letter of{" "}
                <span className="font-mono font-bold text-foreground">
                  {solution[i - 1]}
                </span>
              </>
            )}
            {i === 0 && solution.length > 1 && (
              <>
                , ending on{" "}
                <span className="font-mono font-bold text-foreground">
                  {word[word.length - 1]}
                </span>{" "}
                so the next word can begin there
              </>
            )}
            .
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        In Letter Boxed the words are chained: each word must begin with the last
        letter of the previous word, and together they use all twelve letters
        around the box. This {solution.length}-word chain is the official
        &ldquo;our solution&rdquo; the NYT publishes, though other valid word
        chains exist.
      </p>
    </details>
  );
}
