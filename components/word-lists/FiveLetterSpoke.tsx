import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import LetterIndexGrid from "@/components/word-lists/LetterIndexGrid";
import WordListTable from "@/components/word-lists/WordListTable";
import { BASE_URL } from "@/config/site";
import {
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import {
  MODES,
  getSpokeData,
  spokeHeading,
  type Mode,
} from "@/lib/word-lists-data";
import { STAT_LISTS } from "@/lib/word-stat-lists";

const MODE_CROSS_LABEL: Record<Mode, string> = {
  "starting-with": "starting with",
  "ending-in": "ending in",
  with: "with",
  middle: "with … in the middle",
};

export default function FiveLetterSpoke({
  mode,
  letter,
}: {
  mode: Mode;
  letter: string;
}) {
  const data = getSpokeData(mode, letter);
  if (!data) notFound();

  const L = data.letter;
  const path = `/5-letter-words/${mode}/${L.toLowerCase()}`;
  const otherModes = MODES.filter((m) => m !== mode);

  /* Rotate which pattern lists this spoke links to, keyed off the letter, so
     every list is reachable from a fair share of the 104 spokes rather than
     the first eight collecting all the internal links. */
  const offset = L.charCodeAt(0) % STAT_LISTS.length;
  const patternLists = Array.from({ length: 8 }, (_, i) =>
    STAT_LISTS[(offset + i) % STAT_LISTS.length]
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "5-Letter Words", url: `${BASE_URL}/5-letter-words` },
          { name: data.heading, url: `${BASE_URL}${path}` },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          data.topCommonWords.map((w) => ({
            name: w,
            url: `${BASE_URL}${path}`,
          }))
        )}
      />
      <JsonLd data={faqPageSchema(data.faqItems)} />

      <ContentHero
        eyebrow="Words · 5 Letters"
        title={data.heading}
        description={`All ${data.count} five-letter words ${data.phrase}, sorted with Scrabble scores and definitions to help you crack today's Wordle.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct answer + common words (core, above the fold) */}
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are{" "}
            <span className="font-heading text-xl font-bold text-[hsl(var(--cta))]">
              {data.count}
            </span>{" "}
            five-letter words {data.phrase}. The most common are:
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.topCommonWords.map((w) => (
              <span
                key={w}
                className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-wide text-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Sortable table (the core asset) */}
        <WordListTable
          common={data.common}
          all={data.all}
          allTruncated={data.allTruncated}
          totalCount={data.count}
        />

        {/* Strategy */}
        <CalloutBox type="tip" title={`Using ${L} clues in Wordle`}>
          {data.strategy}
        </CalloutBox>

        {/* Highest scoring */}
        {data.highest && (
          <CalloutBox type="highlight" title="Highest-scoring word">
            <span className="font-mono font-bold">{data.highest.word}</span> is
            the top scorer here at {data.highest.scrabble} points in Scrabble
            ({data.highest.wwf} in Words With Friends).
          </CalloutBox>
        )}

        {/* Glossary */}
        {data.glossary.length > 0 && (
          <ContentSection title="Tricky Words Explained">
            <BodyText>
              Some of these words are rare enough that you may not know them.
              Here is what a few of the trickier ones mean.
            </BodyText>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.glossary.map((g) => (
                <div
                  key={g.word}
                  className="rounded-xl border border-border bg-background p-3"
                >
                  <p className="font-mono text-sm font-bold uppercase tracking-wide text-foreground">
                    {g.word}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {g.def}
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>
        )}

        {/* FAQ */}
        <ContentSection title={`${data.heading} — FAQ`}>
          <SimpleFaq items={data.faqItems} />
        </ContentSection>

        {/* Cross-index: change the letter */}
        <ContentSection title="Change the Letter">
          <LetterIndexGrid mode={mode} active={L} />
        </ContentSection>

        {/* Change the constraint */}
        <div className="flex flex-wrap gap-3">
          {otherModes.map((m) => (
            <Link
              key={m}
              href={`/5-letter-words/${m}/${L.toLowerCase()}`}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {spokeHeading(m, L)}
            </Link>
          ))}
        </div>

        {/* Cross-index: change the constraint shape */}
        <ContentSection title="Browse by Pattern Instead">
          <BodyText>
            If the clue you hold is a shape rather than a letter — no vowels
            left, a letter that repeats, a Q with no U — these lists cover it.
          </BodyText>
          <div className="grid gap-2 sm:grid-cols-2">
            {patternLists.map((s) => (
              <Link
                key={s.slug}
                href={`/5-letter-words/${s.slug}`}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </ContentSection>

        {/* Up-links to tools / daily */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/wordle-solver"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Filter these with the Wordle Solver →
          </Link>
          <Link
            href="/wordle-answer-today"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Today&apos;s Wordle answer
          </Link>
          <Link
            href="/5-letter-words"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            All 5-letter word lists
          </Link>
        </div>

        {/* Attribution */}
        <p className="text-center text-[11px] text-muted-foreground">
          Definitions derived from WordNet (Princeton University), used under its
          permissive licence.
        </p>
      </div>
    </div>
  );
}

/** Shared metadata builder for every spoke route. */
export function buildSpokeMetadata(mode: Mode, letterRaw: string) {
  const letter = letterRaw.toUpperCase();
  const heading = spokeHeading(mode, letter);
  const data = getSpokeData(mode, letter);
  const count = data?.count ?? 0;
  return {
    title: `${heading} — Wordle Help`,
    description: `All ${count} five-letter words ${data?.phrase ?? ""}, with Scrabble scores and definitions. Perfect for cracking today's Wordle.`,
    path: `/5-letter-words/${mode}/${letter.toLowerCase()}`,
  };
}
