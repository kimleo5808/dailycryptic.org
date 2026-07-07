import { ContentHero } from "@/components/minute-cryptic-content/ContentBlocks";
import PipsTierView from "@/components/pips/PipsTierView";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getPipsPuzzleByDate,
  getAllPipsPuzzles,
  getAdjacentPipsPuzzles,
  buildStrategyHint,
} from "@/lib/pips-data";
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
  const puzzle = await getPipsPuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "PipsAnswersDate",
      title: "Pips Answers Not Found",
      description: "This Pips puzzle was not found.",
      locale: locale as Locale,
      path: `/pips-answers/${date}`,
      canonicalUrl: `/pips-answers/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "PipsAnswersDate",
    title: `NYT Pips Answers — ${dateLabel}`,
    description: `Hints and full solutions for the NYT Pips puzzle on ${dateLabel}, across Easy, Medium and Hard. Spoiler-free strategy first, then the solved board.`,
    keywords: [
      `pips answers ${dateLabel.toLowerCase()}`,
      `nyt pips ${date}`,
      "nyt pips solution",
      "pips hard solution",
    ],
    locale: locale as Locale,
    path: `/pips-answers/${date}`,
    canonicalUrl: `/pips-answers/${date}`,
  });
}

export default async function PipsAnswersDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getPipsPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentPipsPuzzles(date);

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const tierEntries = [
    { key: "easy" as const, label: "Easy", tier: puzzle.tiers.easy, strategyHint: buildStrategyHint(puzzle.tiers.easy) },
    { key: "medium" as const, label: "Medium", tier: puzzle.tiers.medium, strategyHint: buildStrategyHint(puzzle.tiers.medium) },
    { key: "hard" as const, label: "Hard", tier: puzzle.tiers.hard, strategyHint: buildStrategyHint(puzzle.tiers.hard) },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Pips Answers", url: `${BASE_URL}/pips-answers` },
          { name: dateLabel, url: `${BASE_URL}/pips-answers/${date}` },
        ])}
      />

      <ContentHero
        eyebrow="Pips"
        title={`NYT Pips Answers — ${dateLabel}`}
        description="Spoiler-free strategy first, then the full solved board for Easy, Medium and Hard."
      />

      <div className="mt-8 space-y-8">
        <PipsTierView tiers={tierEntries} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Pips is a
          trademark of The New York Times Company.
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/pips-answers/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {prev.printDate}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/pips-answers-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Answers
          </Link>
          {next ? (
            <Link
              href={`/pips-answers/${next.printDate}`}
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
            href="/pips-answers"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
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
  const puzzles = await getAllPipsPuzzles();
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
