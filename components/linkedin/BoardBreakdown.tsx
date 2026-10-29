import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import {
  getQueensInsights,
  getTangoInsights,
  getZipInsights,
} from "@/lib/linkedin-insights";
import type { DecodedLinkedInDay } from "@/types/linkedin";

/** "A, B and C" */
function joinList(items: (string | number)[]): string {
  const s = items.map(String);
  if (s.length <= 1) return s.join("");
  return `${s.slice(0, -1).join(", ")} and ${s[s.length - 1]}`;
}

function rowsLabel(rows: number[]): string {
  return `${rows.length === 1 ? "Row" : "Rows"} ${joinList(rows)}`;
}

function QueensSection({ day, archive }: { day: DecodedLinkedInDay; archive: DecodedLinkedInDay[] }) {
  if (!day.queens) return null;
  const q = getQueensInsights(day.queens, archive);
  return (
    <>
      <SubHeading>Where the crowns fall</SubHeading>
      <BodyText>
        Reading from the top row down, the crowns sit in columns{" "}
        {joinList(q.columnsByRow)}. The biggest sideways jump comes between rows{" "}
        {q.biggestJump.fromRow} and {q.biggestJump.toRow}, where the crown moves{" "}
        {q.biggestJump.columns} columns.{" "}
        {q.edgeCrowns === 0
          ? "None of the crowns sits on the outer edge — every one is tucked inside the border."
          : `${q.edgeCrowns} of the ${q.size} crowns sit on the outer edge of the board.`}
      </BodyText>
      <SubHeading>How this board compares</SubHeading>
      <BodyText>
        This was a {q.size}×{q.size} board. Boards of that size make up{" "}
        {q.sameSizeCount} of the {q.archiveSize} Queens puzzles in our archive;
        larger boards add a row, a column and a colour region, so they usually
        take longer to solve.
      </BodyText>
    </>
  );
}

function TangoSection({ day }: { day: DecodedLinkedInDay }) {
  if (!day.tango) return null;
  const t = getTangoInsights(day.tango);
  return (
    <>
      <SubHeading>Matching pairs</SubHeading>
      <BodyText>
        The finished grid places two identical symbols side by side {t.rowPairs}{" "}
        times across its rows and {t.columnPairs} times down its columns. Every
        matching pair forces the cells on either side of it to take the opposite
        symbol, so pairs are where most Tango solves begin.
      </BodyText>
      <SubHeading>Row patterns</SubHeading>
      <BodyText>
        {t.alternatingRows.length > 0
          ? `${rowsLabel(t.alternatingRows)} ${t.alternatingRows.length === 1 ? "alternates" : "alternate"} perfectly between sun and moon. `
          : "No row alternates perfectly between sun and moon. "}
        {t.oppositeRows.length > 0
          ? `${joinList(t.oppositeRows.map(([a, b]) => `rows ${a} and ${b}`)).replace(/^r/, "R")} are exact opposites — wherever one has a sun, the other has a moon. `
          : ""}
        {t.repeatedRows.length > 0
          ? `${joinList(t.repeatedRows.map(([a, b]) => `rows ${a} and ${b}`)).replace(/^r/, "R")} are identical.`
          : "No two rows are identical."}
      </BodyText>
    </>
  );
}

function ZipSection({ day, archive }: { day: DecodedLinkedInDay; archive: DecodedLinkedInDay[] }) {
  if (!day.zip) return null;
  const z = getZipInsights(day.zip, archive);
  return (
    <>
      <SubHeading>Checkpoints</SubHeading>
      <BodyText>
        This {z.size}×{z.size} board has {z.checkpoints} numbered checkpoints,
        against an average of {z.sameSizeAvgCheckpoints} on the{" "}
        {z.sameSizeCount} boards of the same size in our archive. Fewer
        checkpoints leave the route less pinned down, which can make a board
        harder.
      </BodyText>
      {z.route ? (
        <>
          <SubHeading>The route</SubHeading>
          <BodyText>
            The finished path covers all {z.size * z.size} cells with{" "}
            {z.route.turns} turns, and its longest straight run is{" "}
            {z.route.longestStraight} cells. The longest stretch between
            checkpoints runs from {z.route.longestStretch.from} to{" "}
            {z.route.longestStretch.to} and takes {z.route.longestStretch.moves}{" "}
            moves — usually the hardest part to plan — while{" "}
            {z.route.shortestStretch.from} to {z.route.shortestStretch.to} needs
            only {z.route.shortestStretch.moves}.
          </BodyText>
        </>
      ) : null}
    </>
  );
}

/**
 * Board-specific facts for a LinkedIn Queens, Tango or Zip archive page,
 * computed from that day's stored solution. Placed below the solution, so it
 * describes the finished board openly.
 */
export default function BoardBreakdown({
  game,
  day,
  archive,
}: {
  game: "queens" | "tango" | "zip";
  day: DecodedLinkedInDay;
  archive: DecodedLinkedInDay[];
}) {
  if (!day[game]) return null;
  return (
    <ContentSection title="Board Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section describes the solved board.
      </BodyText>
      {game === "queens" ? <QueensSection day={day} archive={archive} /> : null}
      {game === "tango" ? <TangoSection day={day} /> : null}
      {game === "zip" ? <ZipSection day={day} archive={archive} /> : null}
    </ContentSection>
  );
}
