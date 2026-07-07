import { ContentHero } from "@/components/minute-cryptic-content/ContentBlocks";
import SpellingBeeHive from "@/components/spelling-bee/SpellingBeeHive";
import SpellingBeeStatsBar from "@/components/spelling-bee/SpellingBeeStats";
import SpellingBeeHintLadder from "@/components/spelling-bee/SpellingBeeHintLadder";
import SpellingBeeAnswers from "@/components/spelling-bee/SpellingBeeAnswers";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getSpellingBeePuzzleByDate,
  getAllSpellingBeePuzzles,
  getAdjacentSpellingBeePuzzles,
  buildFirstLetterCounts,
  buildTwoLetterList,
  buildLengthDistribution,
} from "@/lib/spelling-bee-data";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

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

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
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

      <ContentHero
        eyebrow="Spelling Bee"
        title={`NYT Spelling Bee Answers — ${dateLabel}`}
        description="Spoiler-free hints first, then the full word list and pangram whenever you are ready."
      />

      <div className="mt-8 space-y-8">
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
          <SpellingBeeAnswers answers={puzzle.answers} pangrams={puzzle.pangrams} />
        </section>

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
