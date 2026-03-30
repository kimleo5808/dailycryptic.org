import { ContentHero } from "@/components/minute-cryptic-content/ContentBlocks";
import StrandsThemeCard from "@/components/strands/StrandsThemeCard";
import StrandsSpangramReveal from "@/components/strands/StrandsSpangramReveal";
import StrandsWordList from "@/components/strands/StrandsWordList";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getStrandsPuzzleByDate,
  getRawStrandsPuzzleByDate,
  getAllStrandsPuzzles,
  getAdjacentStrandsPuzzles,
} from "@/lib/strands-data";
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
  const puzzle = await getStrandsPuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "StrandsHintDate",
      title: "Strands Hint Not Found",
      description: "This Strands puzzle was not found.",
      locale: locale as Locale,
      path: `/strands-hint/${date}`,
      canonicalUrl: `/strands-hint/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "StrandsHintDate",
    title: `NYT Strands Hints — ${dateLabel} (Strands #${puzzle.id})`,
    description: `Hints, spangram, and answers for NYT Strands #${puzzle.id} on ${dateLabel}. Progressive clues — reveal as much or as little as you need.`,
    keywords: [
      `strands hint ${date}`,
      `strands answers ${dateLabel.toLowerCase()}`,
      "nyt strands hints",
    ],
    locale: locale as Locale,
    path: `/strands-hint/${date}`,
    canonicalUrl: `/strands-hint/${date}`,
  });
}

export default async function StrandsHintDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getStrandsPuzzleByDate(date);
  const rawPuzzle = await getRawStrandsPuzzleByDate(date);

  if (!puzzle || !rawPuzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentStrandsPuzzles(date);

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Strands Archive", url: `${BASE_URL}/strands-hint` },
          {
            name: `#${puzzle.id}`,
            url: `${BASE_URL}/strands-hint/${date}`,
          },
        ])}
      />

      <ContentHero
        eyebrow="Strands"
        title={`NYT Strands Hints — Strands #${puzzle.id}`}
        description={`${dateLabel}. Reveal hints one level at a time, or jump straight to the answers.`}
      />

      <div className="mt-8 space-y-8">
        {/* Hints */}
        <div className="space-y-3">
          <StrandsThemeCard
            clue={puzzle.clue}
            hint={puzzle.hint}
            theme={rawPuzzle.theme}
          />
          <StrandsSpangramReveal
            spangram={rawPuzzle.spangram}
            direction={puzzle.spangramDirection}
            letterCount={puzzle.spangramLetterCount}
          />
        </div>

        {/* Word list */}
        <StrandsWordList
          themeWords={rawPuzzle.themeWords}
          spangram={rawPuzzle.spangram}
        />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Strands is a
          trademark of The New York Times Company.
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/strands-hint/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← #{prev.id} ({prev.printDate})
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/strands-hint-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Hints
          </Link>
          {next ? (
            <Link
              href={`/strands-hint/${next.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              #{next.id} ({next.printDate}) →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/strands-hint"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Full Archive
          </Link>
          <Link
            href="/connections-hint-today"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Connections Hints
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
  const puzzles = await getAllStrandsPuzzles();
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
