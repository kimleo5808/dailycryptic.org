import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordleHintCard from "@/components/wordle/WordleHintCard";
import WordleAnswerReveal from "@/components/wordle/WordleAnswerReveal";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getWordlePuzzleByDate,
  getAdjacentWordlePuzzles,
  getAllWordlePuzzles,
} from "@/lib/wordle-data";
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
  const puzzle = await getWordlePuzzleByDate(date);
  if (!puzzle) return {};

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "WordleAnswer",
    title: `Wordle Answer and Hints — ${dateLabel} (#${puzzle.id})`,
    description: `Wordle #${puzzle.id} hints and answer for ${dateLabel}. Progressive hints from vague to specific.`,
    keywords: [
      `wordle answer ${date}`,
      `wordle ${puzzle.id}`,
      "wordle hints",
      "wordle answer",
    ],
    locale: locale as Locale,
    path: `/wordle-answer/${date}`,
    canonicalUrl: `/wordle-answer/${date}`,
  });
}

export default async function WordleDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getWordlePuzzleByDate(date);
  if (!puzzle) notFound();

  const { prev, next } = await getAdjacentWordlePuzzles(date);

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Get raw puzzle for encoded solution
  const rawPuzzlesModule = await import("@/data/wordle/puzzles.json");
  const rawPuzzles = (rawPuzzlesModule.default as { puzzles: { printDate: string; solution: string }[] }).puzzles;
  const rawPuzzle = rawPuzzles.find((p) => p.printDate === date);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Wordle Hints", url: `${BASE_URL}/wordle-answer-today` },
          { name: `#${puzzle.id}`, url: `${BASE_URL}/wordle-answer/${date}` },
        ])}
      />

      <ContentHero
        eyebrow="Wordle"
        title={`Wordle Answer and Hints — ${dateLabel}`}
        description={`Wordle #${puzzle.id}. Use the hints below before revealing the answer.`}
      />

      <div className="mt-8 space-y-8">
        <WordleHintCard
          hint1={puzzle.hint1}
          hint2={puzzle.hint2}
          hint3={puzzle.hint3}
        />

        {rawPuzzle && (
          <WordleAnswerReveal encodedSolution={rawPuzzle.solution} />
        )}

        {/* Nav */}
        <div className="flex items-center justify-between text-sm">
          {prev ? (
            <Link
              href={`/wordle-answer/${prev.printDate}`}
              className="text-primary hover:underline"
            >
              ← #{prev.id}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/wordle-answer/${next.printDate}`}
              className="text-primary hover:underline"
            >
              #{next.id} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/wordle-answer-today",
              title: "Today's Wordle",
              description: "Hints and answer for today's puzzle.",
            },
            {
              href: "/wordle-answer",
              title: "Wordle archive",
              description: "Browse all past Wordle answers.",
            },
            {
              href: "/connections-hint-today",
              title: "Connections hints",
              description: "Today's NYT Connections hints and answers.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const puzzles = await getAllWordlePuzzles();
  const recent = puzzles.slice(0, 30);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
