import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import SpellingBeeHive from "@/components/spelling-bee/SpellingBeeHive";
import SpellingBeeStatsBar from "@/components/spelling-bee/SpellingBeeStats";
import SpellingBeeHintLadder from "@/components/spelling-bee/SpellingBeeHintLadder";
import SpellingBeeAnswers from "@/components/spelling-bee/SpellingBeeAnswers";
import SpellingBeeAnswerBoard from "@/components/spelling-bee/SpellingBeeAnswerBoard";
import SpellingBeePuzzleCard from "@/components/spelling-bee/SpellingBeePuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getSpellingBeePuzzleByDate,
  getAllSpellingBeePuzzles,
  getAdjacentSpellingBeePuzzles,
  getRecentSpellingBeePuzzles,
  buildFirstLetterCounts,
  buildTwoLetterList,
  buildLengthDistribution,
} from "@/lib/spelling-bee-data";
import type { DecodedSpellingBeePuzzle } from "@/types/spelling-bee";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/** Join a word list into readable prose: "A, B and C". */
function listWords(words: string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** Per-puzzle FAQ — unique to this date, answers include the real numbers. */
function buildFaq(puzzle: DecodedSpellingBeePuzzle, dateLabel: string) {
  const pangramList = listWords(
    puzzle.pangrams.map((w) => w.toUpperCase())
  );
  const items = [
    {
      question: `What is the pangram for the ${dateLabel} Spelling Bee?`,
      answer:
        puzzle.pangrams.length === 1
          ? `The pangram for ${dateLabel} is ${pangramList} — the one word that uses all seven letters. Reveal the full answer board above to confirm it.`
          : `The ${dateLabel} Spelling Bee has ${puzzle.pangrams.length} pangrams: ${pangramList}. Each uses all seven letters at least once.`,
    },
    {
      question: `How many words are in the ${dateLabel} Spelling Bee?`,
      answer: `There are ${puzzle.stats.wordCount} valid words in the ${dateLabel} puzzle, including ${puzzle.stats.pangramCount} pangram${
        puzzle.stats.pangramCount === 1 ? "" : "s"
      }. Finding every one earns the Queen Bee rank with a maximum score of ${puzzle.stats.maxScore} points.`,
    },
    {
      question: `What score do I need for Genius on ${dateLabel}?`,
      answer: `You reach the Genius rank once you score ${puzzle.stats.geniusScore} points — 70% of the ${puzzle.stats.maxScore}-point maximum. You do not have to find every word to hit Genius, only the pangram counts double toward the total.`,
    },
  ];
  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getSpellingBeePuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "SpellingBeeAnswersDate",
      title: "Spelling Bee Answers Not Found",
      description: "This Spelling Bee puzzle was not found.",
      locale: locale as Locale,
      path: `/spelling-bee-answers/${date}`,
      canonicalUrl: `/spelling-bee-answers/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "SpellingBeeAnswersDate",
    title: `NYT Spelling Bee Answers — ${dateLabel}`,
    description: `Hints, pangram and the full answer list for the NYT Spelling Bee on ${dateLabel}. Spoiler-free clues first, then all ${puzzle.stats.wordCount} words.`,
    keywords: [
      `spelling bee answers ${dateLabel.toLowerCase()}`,
      `spelling bee ${date}`,
      "nyt spelling bee answers",
      "spelling bee pangram",
    ],
    locale: locale as Locale,
    path: `/spelling-bee-answers/${date}`,
    canonicalUrl: `/spelling-bee-answers/${date}`,
  });
}

export default async function SpellingBeeAnswersDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getSpellingBeePuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentSpellingBeePuzzles(date);
  const recentPuzzles = (await getRecentSpellingBeePuzzles(6)).filter(
    (p) => p.printDate !== date
  );

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const shortDate = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstLetterCounts = buildFirstLetterCounts(puzzle.answers);
  const twoLetterList = buildTwoLetterList(puzzle.answers);
  const lengthDistribution = buildLengthDistribution(puzzle.answers);
  const pangramShapes = puzzle.pangrams.map((w) => ({
    letter: w[0].toUpperCase(),
    length: w.length,
  }));
  const lettersLabel = puzzle.letters.map((l) => l.toUpperCase()).join(", ");
  const centerLabel = puzzle.centerLetter.toUpperCase();
  const faqItems = buildFaq(puzzle, shortDate);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Spelling Bee Answers", url: `${BASE_URL}/spelling-bee-answers` },
          {
            name: dateLabel,
            url: `${BASE_URL}/spelling-bee-answers/${date}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Spelling Bee Answers — ${dateLabel}`,
          description: `Hints, pangram and the full answer list for the NYT Spelling Bee on ${dateLabel}.`,
          url: `${BASE_URL}/spelling-bee-answers/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="Spelling Bee"
        title={`NYT Spelling Bee Answers — ${dateLabel}`}
        description="Spoiler-free hints first, then the full word list and pangram whenever you are ready."
      />

      <div className="mt-8 space-y-8">
        {/* Per-puzzle intro — unique to this date */}
        <ContentSection title={`About the ${shortDate} Spelling Bee`}>
          <BodyText>
            The NYT Spelling Bee for {dateLabel} is built from the seven letters{" "}
            {lettersLabel}, with {centerLabel} in the center of the hive — every
            valid word must use that central letter. This grid hides{" "}
            {puzzle.stats.wordCount} accepted words in total, including{" "}
            {puzzle.stats.pangramCount} pangram
            {puzzle.stats.pangramCount === 1 ? "" : "s"} that use all seven
            letters at once.
          </BodyText>
          <BodyText>
            Start with the spoiler-free hint ladder below — first-letter counts,
            two-letter starts and word lengths — and only open the full answer
            board when you want to confirm the exact words. Reaching the Genius
            rank takes {puzzle.stats.geniusScore} points, while a perfect Queen
            Bee run is worth {puzzle.stats.maxScore}. New here? See our{" "}
            <Link
              href="/spelling-bee-answers-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              guide to today&apos;s Spelling Bee
            </Link>
            .
          </BodyText>
        </ContentSection>

        {/* Honeycomb */}
        <div className="rounded-2xl border border-border bg-gradient-to-b from-[hsl(var(--cta))]/[0.06] to-transparent p-6 text-center">
          <SpellingBeeHive
            centerLetter={puzzle.centerLetter}
            outerLetters={puzzle.outerLetters}
          />
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Letters:{" "}
            <span className="font-semibold text-foreground">{lettersLabel}</span>
            <span className="ml-2 rounded bg-[hsl(var(--cta))]/15 px-1.5 py-0.5 text-xs font-semibold text-[hsl(var(--cta))]">
              center {puzzle.centerLetter.toUpperCase()}
            </span>
          </p>
        </div>

        <SpellingBeeStatsBar stats={puzzle.stats} />

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Hints (Spoiler-Free)
          </h2>
          <SpellingBeeHintLadder
            data={{
              firstLetterCounts,
              twoLetterList,
              lengthDistribution,
              pangramCount: puzzle.stats.pangramCount,
              pangramShapes,
              pangrams: puzzle.pangrams,
            }}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Full Answer List
          </h2>
          {/* Server-rendered, crawlable answer board */}
          <SpellingBeeAnswerBoard
            answers={puzzle.answers}
            pangrams={puzzle.pangrams}
            dateLabel={shortDate}
          />
          {/* Interactive reveal — kept as a UX alternative */}
          <SpellingBeeAnswers answers={puzzle.answers} pangrams={puzzle.pangrams} />
        </section>

        {/* Per-puzzle FAQ */}
        <ContentSection title={`${shortDate} Spelling Bee FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Spelling Bee is a
          trademark of The New York Times Company.
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/spelling-bee-answers/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {prev.printDate}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/spelling-bee-answers-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Answers
          </Link>
          {next ? (
            <Link
              href={`/spelling-bee-answers/${next.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {next.printDate} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Recent puzzles — internal links */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="More Recent Spelling Bee Puzzles">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPuzzles.slice(0, 6).map((p) => (
                <SpellingBeePuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/spelling-bee-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--cta))]/40 hover:bg-[hsl(var(--cta))]/5 hover:text-foreground"
              >
                Browse the full Spelling Bee archive →
              </Link>
            </div>
          </ContentSection>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/spelling-bee-answers"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--cta))]/40 hover:text-foreground"
          >
            Full Archive
          </Link>
          <Link
            href="/minute-cryptic-today"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Today&apos;s Cryptic Clue
          </Link>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const puzzles = await getAllSpellingBeePuzzles();
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
