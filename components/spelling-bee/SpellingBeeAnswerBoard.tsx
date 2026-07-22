/**
 * Server-rendered Spelling Bee answer board.
 *
 * Every valid word and pangram is present in the server HTML so search engines
 * can index the actual answers. The list stays spoiler-protected for humans
 * behind a native <details> element (no JS needed), whose collapsed content is
 * still crawlable.
 */

interface SpellingBeeAnswerBoardProps {
  answers: string[];
  pangrams: string[];
  dateLabel: string;
  defaultOpen?: boolean;
}

interface LetterGroup {
  letter: string;
  words: string[];
}

/** Group the answers by their first letter, alphabetically, one row per letter. */
function groupByFirstLetter(answers: string[]): LetterGroup[] {
  const groups = new Map<string, string[]>();
  for (const word of answers) {
    const letter = word[0].toUpperCase();
    const arr = groups.get(letter);
    if (arr) arr.push(word);
    else groups.set(letter, [word]);
  }
  return Array.from(groups.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, words]) => ({
      letter,
      words: words.sort((a, b) => a.localeCompare(b)),
    }));
}

export default function SpellingBeeAnswerBoard({
  answers,
  pangrams,
  dateLabel,
  defaultOpen = false,
}: SpellingBeeAnswerBoardProps) {
  const pangramSet = new Set(pangrams);
  const groups = groupByFirstLetter(answers);
  const sortedPangrams = [...pangrams].sort((a, b) => a.localeCompare(b));

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[hsl(var(--cta))]/40 bg-[hsl(var(--cta))]/[0.04] p-4 shadow-sm sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-foreground">
          Full Answer List — {answers.length} Words
        </span>
        <span className="rounded-lg bg-[hsl(var(--cta))] px-4 py-1.5 text-xs font-semibold text-[hsl(var(--cta-foreground))] transition group-open:bg-muted group-open:text-muted-foreground">
          <span className="group-open:hidden">Reveal answers</span>
          <span className="hidden group-open:inline">Hide answers</span>
        </span>
      </summary>

      <p className="mt-3 text-xs text-muted-foreground">
        Spoiler warning — every valid word for the {dateLabel} Spelling Bee is
        listed below, with the pangram
        {pangrams.length === 1 ? "" : "s"} highlighted.
      </p>

      {/* Pangrams first — the highlight of every puzzle */}
      {sortedPangrams.length > 0 && (
        <div className="mt-4 rounded-xl border border-[hsl(var(--cta))]/50 bg-[hsl(var(--cta))]/[0.08] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[hsl(var(--cta))]">
            {sortedPangrams.length === 1 ? "Pangram" : "Pangrams"} · uses all
            seven letters
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sortedPangrams.map((word) => (
              <span
                key={word}
                className="rounded-md bg-background/80 px-2 py-0.5 font-mono text-sm font-bold uppercase tracking-wide text-foreground"
              >
                <span aria-label="pangram" className="mr-1 text-[hsl(var(--cta))]">
                  ⬡
                </span>
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complete list, grouped by first letter, one row per letter */}
      <div className="mt-4 space-y-3">
        {groups.map((group) => (
          <div
            key={group.letter}
            className="flex gap-3 border-b border-border/50 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--cta))]/15 font-heading text-sm font-bold uppercase text-[hsl(var(--cta))]">
              {group.letter}
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
              {group.words.map((word) => {
                const isPangram = pangramSet.has(word);
                return (
                  <span
                    key={word}
                    className={`font-mono text-sm uppercase tracking-wide ${
                      isPangram
                        ? "font-bold text-foreground"
                        : "text-foreground/90"
                    }`}
                  >
                    {isPangram && (
                      <span
                        aria-label="pangram"
                        className="mr-0.5 text-[hsl(var(--cta))]"
                      >
                        ⬡
                      </span>
                    )}
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-[hsl(var(--cta))]">⬡</span> = pangram (uses all
        seven letters)
      </p>
    </details>
  );
}
