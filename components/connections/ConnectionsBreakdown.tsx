import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import {
  getConnectionsInsights,
  type PastAppearance,
} from "@/lib/connections-insights";
import type { DecodedConnectionsPuzzle } from "@/types/connections";
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

/** Wrap in curly quotes unless the text already starts with a quote mark. */
function quoted(text: string): string {
  return /^["“]/.test(text) ? text : `“${text}”`;
}

function PuzzleLink({ past }: { past: PastAppearance }) {
  return (
    <Link
      href={`/connections-hint/${past.printDate}`}
      className="text-primary underline underline-offset-2 hover:text-primary/80"
    >
      #{past.id}
    </Link>
  );
}

/**
 * Archive cross-references for a Connections answer page: returning words with
 * their earlier categories, and groups that reuse a familiar trick. Placed
 * below the answer board, so naming words and categories spoils nothing new.
 */
export default function ConnectionsBreakdown({
  puzzle,
  archive,
}: {
  puzzle: DecodedConnectionsPuzzle;
  archive: DecodedConnectionsPuzzle[];
}) {
  const data = getConnectionsInsights(puzzle, archive);

  return (
    <ContentSection title="Puzzle Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section names words and categories from the answer board.
        Cross-references use our archive of {data.archiveSize} Connections puzzles
        since {formatDate(data.archiveStart)}.
      </BodyText>

      {!data.hasEarlierPuzzles ? (
        <BodyText>
          This is the earliest puzzle in our archive, so there are no earlier
          puzzles to compare it with.
        </BodyText>
      ) : (
        <>
          <SubHeading>Returning words</SubHeading>
          <BodyText>
            {data.returningCount === 0
              ? "None of the sixteen words had appeared in an earlier puzzle in our archive — every word on this board was new."
              : `${data.returningCount} of the sixteen words had appeared in earlier puzzles, and ${data.newWordCount} ${data.newWordCount === 1 ? "was" : "were"} new to our archive. A word that has sat in a different group before is a natural red herring, so the most familiar ones are worth a second look:`}
          </BodyText>
          {data.returning.length > 0 ? (
            <ul className={LIST_CLASS}>
              {data.returning.map((r) => (
                <li key={r.word}>
                  <span className="font-semibold text-foreground">{r.word}</span> —{" "}
                  {r.times === 1 ? "seen once before, in " : `${r.times} earlier puzzles, most recently `}
                  <PuzzleLink past={r.last} /> ({formatDate(r.last.printDate)}) under{" "}
                  {quoted(r.last.category)}.
                </li>
              ))}
            </ul>
          ) : null}

          <SubHeading>Tricks seen before</SubHeading>
          {data.tricks.length === 0 ? (
            <BodyText>
              None of the four group names matches the wordplay tricks we track —
              fill-in-the-blank, homophones, anagrams, letter changes, hidden
              starts and ends, rhymes and reversals — so this board leans on
              meaning and general knowledge.
            </BodyText>
          ) : (
            <ul className={LIST_CLASS}>
              {data.tricks.map((t) => (
                <li key={t.category}>
                  {quoted(t.category)} uses the {t.trickLabel} trick.{" "}
                  {t.earlierCount === 0 ? (
                    "It is the first group of its kind in our archive."
                  ) : (
                    <>
                      {t.earlierCount} earlier group{t.earlierCount === 1 ? "" : "s"} in
                      our archive used the same trick
                      {t.example ? (
                        <>
                          , most recently <PuzzleLink past={t.example} />{" "}
                          {quoted(t.example.category)}
                        </>
                      ) : null}
                      .
                    </>
                  )}
                  {t.sameAnchor && t.sameAnchor.id !== t.example?.id ? (
                    <>
                      {" "}The same fixed word also appeared in{" "}
                      <PuzzleLink past={t.sameAnchor} /> {quoted(t.sameAnchor.category)}.
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </ContentSection>
  );
}
