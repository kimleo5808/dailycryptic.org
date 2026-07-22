/**
 * Server-rendered Strands answer board.
 *
 * Unlike the interactive reveal cards (which only render the real answers into
 * the DOM after a click), every value here — the theme name, the spangram, and
 * all theme words — is present in the server HTML so search engines can index
 * the actual answers. The answers stay spoiler-protected for humans behind a
 * native <details> element (no JS required); its collapsed content is still
 * crawlable.
 */

interface StrandsAnswerBoardProps {
  puzzleId: number;
  theme: string;
  spangram: string;
  spangramDirection: "horizontal" | "vertical";
  spangramLetterCount: number;
  themeWords: string[];
  defaultOpen?: boolean;
}

// Strands brand accent, defined in styles/globals.css as `--strands-hint`.
const ACCENT = "hsl(var(--strands-hint))";

export default function StrandsAnswerBoard({
  puzzleId,
  theme,
  spangram,
  spangramDirection,
  spangramLetterCount,
  themeWords,
  defaultOpen = false,
}: StrandsAnswerBoardProps) {
  const totalWords = themeWords.length + 1; // theme words + spangram

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-foreground">
          Strands #{puzzleId} — Full Answers
        </span>
        <span
          className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition group-open:bg-muted group-open:text-muted-foreground"
          style={{ backgroundColor: ACCENT }}
        >
          <span className="group-open:hidden">Reveal answers</span>
          <span className="hidden group-open:inline">Hide answers</span>
        </span>
      </summary>

      <p className="mt-3 text-xs text-muted-foreground">
        Spoiler warning — the theme, spangram, and all {totalWords} words are
        shown below.
      </p>

      {/* Theme + spangram */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: ACCENT,
            backgroundColor: "hsl(var(--strands-hint) / 0.08)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            Theme
          </p>
          <p className="mt-1 font-heading text-base font-bold text-foreground">
            {theme}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Every theme word ties back to this idea.
          </p>
        </div>

        <div
          className="rounded-xl border border-yellow-300 bg-amber-50 p-4 dark:border-yellow-700 dark:bg-amber-950/30"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Spangram · {spangramLetterCount} letters ·{" "}
            {spangramDirection === "horizontal" ? "horizontal" : "vertical"}
          </p>
          <p className="mt-1 font-heading text-base font-bold text-foreground">
            {spangram}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            The spangram spans the board and sums up the theme.
          </p>
        </div>
      </div>

      {/* Theme words */}
      <div className="mt-3 rounded-xl border border-border bg-background p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Theme words ({themeWords.length})
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {themeWords.map((word) => (
            <span
              key={word}
              className="rounded-md bg-muted px-2 py-0.5 font-mono text-sm font-medium text-foreground"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </details>
  );
}
