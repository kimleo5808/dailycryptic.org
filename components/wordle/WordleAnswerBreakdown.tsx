import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { getWordleInsights } from "@/lib/wordle-insights";

const ORDINALS = ["first", "second", "third", "fourth", "fifth"];
const TILE_EMOJI: Record<string, string> = { G: "🟩", Y: "🟨", B: "⬛" };

function tiles(pattern: string): string {
  return pattern
    .split("")
    .map((t) => TILE_EMOJI[t])
    .join("");
}

function plural(n: number, word: string): string {
  return `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Answer-specific data for a Wordle archive page: meaning, how far the usual
 * openers narrowed the field, lookalike words and letter-position rarity.
 * Rendered below the existing analysis, so it only appears after the answer
 * has already been shown on the page.
 */
export default function WordleAnswerBreakdown({ solution }: { solution: string }) {
  const data = getWordleInsights(solution);
  const [crane, slate] = data.openers;
  const rarest = data.positionShares.reduce((min, p) =>
    p.share < min.share ? p : min
  );
  const gloss = data.gloss?.trim().replace(/\.?$/, ".");

  return (
    <ContentSection title="Answer Breakdown" id="breakdown">
      <BodyText>
        Spoilers: this section discusses the answer, {data.answer}. The figures
        are calculated from our list of{" "}
        {data.totalWords.toLocaleString("en-US")} five-letter words.
      </BodyText>

      {gloss ? (
        <>
          <SubHeading>What {data.answer} means</SubHeading>
          <BodyText>{gloss}</BodyText>
        </>
      ) : null}

      <SubHeading>How far CRANE and SLATE got you</SubHeading>
      <BodyText>
        Opening with CRANE would have shown{" "}
        <span aria-label={crane.pattern}>{tiles(crane.pattern)}</span>, which
        still left {plural(crane.remaining, "possible word")}. SLATE would have
        shown <span aria-label={slate.pattern}>{tiles(slate.pattern)}</span>,
        leaving {plural(slate.remaining, "word")}. Playing both as your first two
        guesses cut the field to{" "}
        {data.bothOpenersRemaining === 1
          ? `a single word — ${data.answer} itself.`
          : `${plural(data.bothOpenersRemaining, "word")}.`}
      </BodyText>

      <SubHeading>Lookalike words</SubHeading>
      <BodyText>
        {data.lookalikeCount > 0
          ? `${plural(data.lookalikeCount, "dictionary word")} ${data.lookalikeCount === 1 ? "differs" : "differ"} from ${data.answer} by a single letter in the same position: ${data.lookalikes.join(", ")}${data.lookalikeCount > data.lookalikes.length ? `, and ${data.lookalikeCount - data.lookalikes.length} more` : ""}. With four green tiles on the board, each of these is still a live guess — which is how streaks are lost.`
          : `No dictionary word differs from ${data.answer} by just one letter, so once four letters were green the last one was certain.`}
      </BodyText>

      <SubHeading>How unusual each letter&apos;s position is</SubHeading>
      <div className="grid grid-cols-5 gap-2">
        {data.positionShares.map((p) => (
          <div
            key={p.position}
            className="rounded-lg border border-border bg-background p-2 text-center"
          >
            <p className="font-heading text-lg font-bold text-foreground">
              {p.letter}
            </p>
            <p className="text-[11px] text-muted-foreground">{p.share}%</p>
          </div>
        ))}
      </div>
      <BodyText>
        Each figure is the share of five-letter words with that letter in that
        position. The least expected placement was {rarest.letter} as the{" "}
        {ORDINALS[rarest.position - 1]} letter: only {rarest.share}% of words
        have it there.
      </BodyText>

      {gloss ? (
        <p className="text-[11px] text-muted-foreground">
          Definitions derived from WordNet (Princeton University), used under its
          permissive licence.
        </p>
      ) : null}
    </ContentSection>
  );
}
