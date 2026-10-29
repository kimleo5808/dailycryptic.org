import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { getSpellingBeeInsights } from "@/lib/spelling-bee-insights";
import type { DecodedSpellingBeePuzzle } from "@/types/spelling-bee";

/** "A, B and C" */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function upperList(words: string[]): string {
  return joinList(words.map((w) => w.toUpperCase()));
}

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Archive comparison for a Spelling Bee answer page: hive size, centre-letter
 * history, standout words, words new to the archive and long-running regulars.
 * Placed below the answer board, so naming words here spoils nothing new.
 */
export default function SpellingBeeBreakdown({
  puzzle,
  archive,
}: {
  puzzle: DecodedSpellingBeePuzzle;
  archive: DecodedSpellingBeePuzzle[];
}) {
  const data = getSpellingBeeInsights(puzzle, archive);
  const centre = puzzle.centerLetter.toUpperCase();
  const words = puzzle.stats.wordCount;
  const sizeSentence =
    data.smallerThanPct >= 65
      ? `With ${words} words, this is one of the bigger hives: ${data.smallerThanPct}% of puzzles in our archive have fewer.`
      : data.smallerThanPct <= 35
        ? `With ${words} words, this hive is on the small side: only ${data.smallerThanPct}% of puzzles in our archive have fewer.`
        : `With ${words} words, this hive is about average: ${data.smallerThanPct}% of puzzles in our archive have fewer.`;

  return (
    <ContentSection title="Puzzle Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section names words from the answer list. Comparisons use
        our archive of {data.archiveSize} Spelling Bee puzzles since{" "}
        {formatDate(data.archiveStart)}.
      </BodyText>

      <SubHeading>How this hive compares</SubHeading>
      <BodyText>
        {sizeSentence} {centre} has been the centre letter in{" "}
        {data.centreLetterCount} of those {data.archiveSize} puzzles.
      </BodyText>

      <SubHeading>Standout words</SubHeading>
      <BodyText>
        The longest {data.longestWords.length === 1 ? "answer is" : "answers are"}{" "}
        {upperList(data.longestWords)} ({data.longestWords[0].length} letters).
        The single highest-scoring word is {data.topWord.word.toUpperCase()}, worth{" "}
        {data.topWord.points} points.{" "}
        {data.perfectPangrams.length > 0
          ? `${upperList(data.perfectPangrams)} ${data.perfectPangrams.length === 1 ? "is a perfect pangram" : "are perfect pangrams"}, using each of the seven letters exactly once.`
          : puzzle.pangrams.length > 0
            ? `There is no perfect pangram in this puzzle: every pangram repeats at least one letter.`
            : ""}
      </BodyText>

      {data.hasEarlierPuzzles ? (
        <>
          <SubHeading>New to the Bee</SubHeading>
          <BodyText>
            {data.debutCount === 0
              ? "Every word in this list had already appeared in an earlier puzzle in our archive."
              : `${data.debutCount} of this puzzle's ${words} words had not appeared in any earlier puzzle in our archive: ${upperList(data.debutWords)}${data.debutCount > data.debutWords.length ? `, plus ${data.debutCount - data.debutWords.length} more` : ""}. Fresh words like these are the ones most likely to be missed.`}
          </BodyText>
        </>
      ) : null}

      {data.regulars.length > 0 ? (
        <>
          <SubHeading>Bee regulars</SubHeading>
          <BodyText>
            Some answers turn up again and again. From this list,{" "}
            {joinList(
              data.regulars.map((r) => `${r.word.toUpperCase()} (${r.count} puzzles)`)
            )}{" "}
            {data.regulars.length === 1 ? "has" : "have"} appeared most often in our
            archive — worth trying early whenever their letters come round.
          </BodyText>
        </>
      ) : null}
    </ContentSection>
  );
}
