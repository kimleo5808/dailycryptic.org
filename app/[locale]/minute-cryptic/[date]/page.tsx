import MinuteCrypticGame from "@/components/home/MinuteCrypticGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllMinuteCryptics,
  getMinuteCrypticByDate,
  getRecentMinuteCryptics,
} from "@/lib/minute-cryptic-data";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const puzzle = await getMinuteCrypticByDate(date);
  if (!puzzle) return {};

  const formattedDate = dayjs(date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Minute Cryptic for ${formattedDate} (Clue #${puzzle.id})`,
    description: `Solve minute cryptic clue #${puzzle.id} for ${formattedDate} with progressive hints, answer check, and full explanation.`,
    keywords: [
      `minute cryptic ${date}`,
      `minute cryptic #${puzzle.id}`,
      "minute cryptic answer",
      "daily cryptic clue",
      "cryptic clue explanation",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic/${date}`,
    canonicalUrl: `/minute-cryptic/${date}`,
  });
}

export default async function DailyPuzzlePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getMinuteCrypticByDate(date);

  if (!puzzle) notFound();

  const allPuzzles = await getAllMinuteCryptics();
  const currentIndex = allPuzzles.findIndex((p) => p.printDate === date);
  const prevPuzzle =
    currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;
  const nextPuzzle = currentIndex > 0 ? allPuzzles[currentIndex - 1] : null;
  const recentPuzzles = await getRecentMinuteCryptics(8);

  const formattedDate = dayjs(puzzle.printDate).format("dddd, MMMM D, YYYY");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Archive", url: `${BASE_URL}/minute-cryptic` },
          {
            name: `Clue #${puzzle.id}`,
            url: `${BASE_URL}/minute-cryptic/${date}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `Minute Cryptic ${dayjs(puzzle.printDate).format("MMMM D, YYYY")} - Clue #${puzzle.id}`,
          description: puzzle.clue,
          url: `${BASE_URL}/minute-cryptic/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />

      <nav className="mb-6 flex items-center justify-between">
        {prevPuzzle ? (
          <Link
            href={`/minute-cryptic/${prevPuzzle.printDate}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {dayjs(prevPuzzle.printDate).format("MMM D")} previous clue
          </Link>
        ) : (
          <span />
        )}
        {nextPuzzle ? (
          <Link
            href={`/minute-cryptic/${nextPuzzle.printDate}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Next clue {dayjs(nextPuzzle.printDate).format("MMM D")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Minute Cryptic for {dayjs(puzzle.printDate).format("MMMM D, YYYY")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Clue #{puzzle.id} | {formattedDate}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Try to solve before revealing help. The answer and explanation are
          available below after your attempt.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <MinuteCrypticGame
          clue={puzzle.clue}
          answer={puzzle.answer}
          dateLabel={formattedDate}
          hints={puzzle.hintLevels}
        />
      </div>

      <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Answer and Explanation
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Type: {puzzle.clueType} | Difficulty: {puzzle.difficulty}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Answer
        </h3>
        <p className="mt-2 text-base font-semibold text-foreground">
          Answer: {puzzle.answer}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Why this answer fits
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {puzzle.explanation}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Hint strategy for this clue
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use one hint level at a time. Start with direction, then mechanism,
          then structure. Only reveal deeper help if your current parse still
          fails both definition and wordplay checks.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Related practice clues
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Continue with nearby archive entries to reinforce the same solving
          workflow across different clue types.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {recentPuzzles
            .filter((p) => p.printDate !== puzzle.printDate)
            .slice(0, 6)
            .map((p) => (
              <Link
                key={p.id}
                href={`/minute-cryptic/${p.printDate}`}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {dayjs(p.printDate).format("MMM D, YYYY")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  #{p.id} | {p.clueType}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {p.clue}
                </p>
                <span className="mt-3 inline-flex text-xs font-semibold text-primary">
                  Solve this clue
                </span>
              </Link>
            ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Found an issue in this clue?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If you notice an unclear definition, ambiguous parse, or explanation
          issue, contact us with the puzzle date and your reasoning so we can
          review and correct quickly.
        </p>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const allPuzzles = await getAllMinuteCryptics();
  const params: { locale: string; date: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of allPuzzles) {
      params.push({ locale, date: puzzle.printDate });
    }
  }

  return params;
}
