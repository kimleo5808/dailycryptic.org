import { ContentHero } from "@/components/minute-cryptic-content/ContentBlocks";
import LetterBoxedPlay from "@/components/letter-boxed/LetterBoxedPlay";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getLetterBoxedPuzzleByDate,
  getAllLetterBoxedPuzzles,
  getAdjacentLetterBoxedPuzzles,
  buildLetterBoxedHints,
} from "@/lib/letter-boxed-data";
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
  const puzzle = await getLetterBoxedPuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "LetterBoxedAnswersDate",
      title: "Letter Boxed Answer Not Found",
      description: "This Letter Boxed puzzle was not found.",
      locale: locale as Locale,
      path: `/letter-boxed-answers/${date}`,
      canonicalUrl: `/letter-boxed-answers/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "LetterBoxedAnswersDate",
    title: `NYT Letter Boxed Answer — ${dateLabel}`,
    description: `Hints and the official two-word solution for the NYT Letter Boxed puzzle on ${dateLabel}. Spoiler-free nudges first, then the answer.`,
    keywords: [
      `letter boxed answer ${dateLabel.toLowerCase()}`,
      `nyt letter boxed ${date}`,
      "nyt letter boxed solution",
      "letter boxed two word solution",
    ],
    locale: locale as Locale,
    path: `/letter-boxed-answers/${date}`,
    canonicalUrl: `/letter-boxed-answers/${date}`,
  });
}

export default async function LetterBoxedAnswersDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getLetterBoxedPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentLetterBoxedPuzzles(date);
  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hints = buildLetterBoxedHints(puzzle);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Letter Boxed Answers", url: `${BASE_URL}/letter-boxed-answers` },
          { name: dateLabel, url: `${BASE_URL}/letter-boxed-answers/${date}` },
        ])}
      />

      <ContentHero
        eyebrow="Letter Boxed"
        title={`NYT Letter Boxed Answer — ${dateLabel}`}
        description="Spoiler-free hints first, then the official two-word solution traced on the box."
      />

      <div className="mt-8 space-y-8">
        <LetterBoxedPlay
          sides={puzzle.sides}
          solution={puzzle.solution}
          hints={hints}
        />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Letter Boxed is a
          trademark of The New York Times Company.
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/letter-boxed-answers/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {prev.printDate}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/letter-boxed-answers-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Answer
          </Link>
          {next ? (
            <Link
              href={`/letter-boxed-answers/${next.printDate}`}
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
            href="/letter-boxed-answers"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--strands-hint))]/40 hover:text-foreground"
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
  const puzzles = await getAllLetterBoxedPuzzles();
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
