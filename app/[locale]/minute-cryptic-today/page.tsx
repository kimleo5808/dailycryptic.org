import MinuteCrypticGame from "@/components/home/MinuteCrypticGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getLatestMinuteCryptic,
  getRecentMinuteCryptics,
} from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getLatestMinuteCryptic();
  const dateStr = puzzle
    ? dayjs(puzzle.printDate).format("MMMM D, YYYY")
    : "Today";

  return constructMetadata({
    page: "MinuteCrypticToday",
    title: `Minute Cryptic Today - ${dateStr}`,
    description:
      "Solve today's minute cryptic clue with progressive hints and instant answer checks.",
    keywords: [
      "minute cryptic today",
      "daily cryptic clue",
      "cryptic clue hints",
      "dailycryptic",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic-today`,
    canonicalUrl: `/minute-cryptic-today`,
  });
}

export default async function MinuteCrypticTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getLatestMinuteCryptic();
  const recentPuzzles = await getRecentMinuteCryptics(7);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">No Clue Available</h1>
        <p className="mt-4 text-muted-foreground">
          Today&apos;s minute cryptic has not been published yet.
        </p>
      </div>
    );
  }

  const dateLabel = dayjs(puzzle.printDate).format("dddd, MMMM D, YYYY");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Minute Cryptic Today",
            url: `${BASE_URL}/minute-cryptic-today`,
          },
        ])}
      />

      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Minute Cryptic Today
        </h1>
        <p className="mt-2 text-muted-foreground">
          Solve today&apos;s clue, reveal hints only when needed, and check your
          answer instantly.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <MinuteCrypticGame
          clue={puzzle.clue}
          answer={puzzle.answer}
          dateLabel={dateLabel}
          hints={puzzle.hintLevels}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Clue Breakdown
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Type: {puzzle.clueType} | Difficulty: {puzzle.difficulty}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {puzzle.explanation}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Recent clues
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open clue
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
