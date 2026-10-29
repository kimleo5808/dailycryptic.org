import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { getStrandsInsights } from "@/lib/strands-insights";
import type { DecodedStrandsPuzzle } from "@/types/strands";
import Link from "next/link";

const LIST_CLASS =
  "list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]";

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Archive comparison for a Strands answer page: spangram length and direction,
 * the size of the theme set, and theme words that have appeared in earlier
 * puzzles. Placed below the answers, so naming words here spoils nothing new.
 */
export default function StrandsBreakdown({
  puzzle,
  archive,
}: {
  puzzle: DecodedStrandsPuzzle;
  archive: DecodedStrandsPuzzle[];
}) {
  const data = getStrandsInsights(puzzle, archive);
  const pct = data.spangramShorterPct;
  const spangramSentence =
    pct >= 65
      ? `At ${data.spangramLength} letters, ${puzzle.spangram} is one of the longer spangrams: ${pct}% of spangrams in our archive are shorter.`
      : pct <= 35
        ? `At ${data.spangramLength} letters, ${puzzle.spangram} is on the short side for a spangram: only ${pct}% in our archive are shorter.`
        : `At ${data.spangramLength} letters, ${puzzle.spangram} is a typical spangram length: ${pct}% in our archive are shorter.`;

  return (
    <ContentSection title="Puzzle Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section names the spangram and theme words. Comparisons
        use our archive of {data.archiveSize} Strands puzzles since{" "}
        {formatDate(data.archiveStart)}.
      </BodyText>

      <SubHeading>The spangram</SubHeading>
      <BodyText>
        {spangramSentence} It runs {puzzle.spangramDirection}ly across the board,
        as {data.sameDirectionCount} of the {data.archiveSize} spangrams in our
        archive do.
      </BodyText>

      <SubHeading>The theme words</SubHeading>
      <BodyText>
        Besides the spangram, this board hides {data.themeWordCount} theme words —
        a count shared by {data.sameWordCountPuzzles} puzzles in our archive. The
        longest is {data.longestWord} ({data.longestWord.length} letters) and the
        shortest is {data.shortestWord} ({data.shortestWord.length} letters).
        Short theme words are usually the hardest to trace, because they can hide
        almost anywhere on the grid.
      </BodyText>

      {data.hasEarlierPuzzles ? (
        <>
          <SubHeading>Theme words seen before</SubHeading>
          {data.returning.length === 0 ? (
            <BodyText>
              None of these theme words had appeared in an earlier Strands
              puzzle in our archive.
            </BodyText>
          ) : (
            <ul className={LIST_CLASS}>
              {data.returning.map((r) => (
                <li key={r.word}>
                  <span className="font-semibold text-foreground">{r.word}</span> —{" "}
                  {r.times === 1 ? "seen once before, in " : `${r.times} earlier puzzles, most recently `}
                  <Link
                    href={`/strands-hint/${r.last.printDate}`}
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    #{r.last.id}
                  </Link>{" "}
                  ({formatDate(r.last.printDate)}), clued{" "}
                  {/^["“]/.test(r.last.clue) ? r.last.clue : `“${r.last.clue}”`}.
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </ContentSection>
  );
}
