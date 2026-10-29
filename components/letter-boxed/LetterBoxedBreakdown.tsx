import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { getLetterBoxedInsights } from "@/lib/letter-boxed-insights";
import type { DecodedLetterBoxedPuzzle } from "@/types/letter-boxed";

/** "A, B and C" */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Box-specific data for a Letter Boxed answer page: how the official solution
 * covers the box, strong opening words from our word list, rare letters and how
 * long this solution is compared with the archive. Placed below the answer
 * board, so the solution words are already on the page.
 */
export default function LetterBoxedBreakdown({
  puzzle,
  archive,
}: {
  puzzle: DecodedLetterBoxedPuzzle;
  archive: DecodedLetterBoxedPuzzle[];
}) {
  const data = getLetterBoxedInsights(puzzle, archive);
  const [first, second] = puzzle.solution;
  const twoWords = puzzle.solution.length === 2 && second;

  return (
    <ContentSection title="Box Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section discusses the official solution. Word suggestions
        come from our own list of {data.dictionarySize.toLocaleString("en-US")}{" "}
        common words, not the official NYT dictionary, so the game may accept
        words that are not shown here.
      </BodyText>

      {twoWords ? (
        <>
          <SubHeading>How the solution covers the box</SubHeading>
          <BodyText>
            {first} alone uses {data.firstWordCoverage} of the twelve letters, and{" "}
            {second} picks up the rest, starting on the shared {data.chainLetter}.{" "}
            {data.repeatedLetters.length > 0
              ? `Between them the two words use ${joinList(data.repeatedLetters)} more than once — repeats are allowed, as long as every letter appears at least once.`
              : "No letter is used twice, so the two words cover the box with no waste at all."}
          </BodyText>
        </>
      ) : null}

      <SubHeading>Strong opening words</SubHeading>
      <BodyText>
        {data.playableCount > 0
          ? `Our list finds ${data.playableCount.toLocaleString("en-US")} other words that can be played in this box. The ones covering the most different letters make the best starts: ${joinList(data.openers.map((o) => `${o.word} (${o.letters} of 12)`))}.`
          : "Our list finds no other playable words for this box, which makes the official solution the only route we can confirm."}
      </BodyText>

      {data.alternatives.length > 0 ? (
        <>
          <SubHeading>Other two-word solutions</SubHeading>
          <BodyText>
            Our list also solves this box in two words:{" "}
            {joinList(data.alternatives.map(([a, b]) => `${a} → ${b}`))}.
          </BodyText>
        </>
      ) : null}

      <SubHeading>How this box compares</SubHeading>
      <BodyText>
        {data.shorterThanPct >= 65
          ? `At ${data.totalLetters} letters, the official solution is one of the longer ones: ${data.shorterThanPct}% of the ${data.archiveSize} solutions in our archive use fewer letters.`
          : data.shorterThanPct <= 35
            ? `At ${data.totalLetters} letters, the official solution is on the short side: only ${data.shorterThanPct}% of the ${data.archiveSize} solutions in our archive use fewer letters.`
            : `At ${data.totalLetters} letters, the official solution is about average: ${data.shorterThanPct}% of the ${data.archiveSize} solutions in our archive use fewer letters.`}{" "}
        {data.rareLetters.length > 0
          ? `The box also contains ${joinList(data.rareLetters.map((r) => `${r.letter} (in only ${r.boxes} of ${data.archiveSize} boxes)`))}, which ${data.rareLetters.length === 1 ? "is" : "are"} rarely seen — letters like these usually decide where the solution has to go.`
          : "None of its letters is unusual for Letter Boxed, so the difficulty comes from the side pattern rather than rare letters."}
      </BodyText>
    </ContentSection>
  );
}
