import {
  ContentHero,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ConnectionsHintCard from "@/components/connections/ConnectionsHintCard";
import ConnectionsAnswerReveal from "@/components/connections/ConnectionsAnswerReveal";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getConnectionsPuzzleByDate,
  getAllConnectionsPuzzles,
  getAdjacentConnectionsPuzzles,
} from "@/lib/connections-data";
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
  const puzzle = await getConnectionsPuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "ConnectionsHintDate",
      title: "Connections Hint Not Found",
      description: "This Connections puzzle was not found.",
      locale: locale as Locale,
      path: `/connections-hint/${date}`,
      canonicalUrl: `/connections-hint/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "ConnectionsHintDate",
    title: `NYT Connections Hints — ${dateLabel} (Puzzle #${puzzle.id})`,
    description: `Hints and answers for NYT Connections puzzle #${puzzle.id} on ${dateLabel}. Progressive clues for all four color groups.`,
    keywords: [
      `connections hint ${date}`,
      `connections answers ${dateLabel.toLowerCase()}`,
      "nyt connections hints",
    ],
    locale: locale as Locale,
    path: `/connections-hint/${date}`,
    canonicalUrl: `/connections-hint/${date}`,
  });
}

export default async function ConnectionsHintDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getConnectionsPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentConnectionsPuzzles(date);

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
          { name: "Connections Hints", url: `${BASE_URL}/connections-hint` },
          {
            name: `#${puzzle.id}`,
            url: `${BASE_URL}/connections-hint/${date}`,
          },
        ])}
      />

      <ContentHero
        eyebrow="Connections"
        title={`NYT Connections Hints — Puzzle #${puzzle.id}`}
        description={`${dateLabel}. Reveal hints one level at a time, or jump straight to the answers.`}
      />

      <div className="mt-8 space-y-8">
        {/* Hints */}
        <div className="space-y-3">
          {puzzle.groups.map((group) => (
            <ConnectionsHintCard
              key={group.color}
              color={group.color}
              hint={group.hint}
              groupName={group.name}
              words={group.words}
            />
          ))}
        </div>

        {/* Answers */}
        <ConnectionsAnswerReveal groups={puzzle.groups} />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Connections is a
          trademark of The New York Times Company.
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/connections-hint/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← #{prev.id} ({prev.printDate})
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/connections-hint-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Hints
          </Link>
          {next ? (
            <Link
              href={`/connections-hint/${next.printDate}`}
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
            href="/connections-hint"
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
  const puzzles = await getAllConnectionsPuzzles();
  // Only pre-generate the most recent 90 days to keep build output small.
  // Older pages are generated on-demand via SSR and cached by R2.
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
