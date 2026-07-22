import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ConnectionsHintCard from "@/components/connections/ConnectionsHintCard";
import ConnectionsAnswerBoard from "@/components/connections/ConnectionsAnswerBoard";
import ConnectionsPuzzleCard from "@/components/connections/ConnectionsPuzzleCard";
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
  getConnectionsPuzzleByDate,
  getAllConnectionsPuzzles,
  getAdjacentConnectionsPuzzles,
  getRecentConnectionsPuzzles,
} from "@/lib/connections-data";
import type {
  ConnectionsColor,
  DecodedConnectionsPuzzle,
} from "@/types/connections";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

const COLOR_ORDER: ConnectionsColor[] = ["yellow", "green", "blue", "purple"];

function orderedGroups(puzzle: DecodedConnectionsPuzzle) {
  return [...puzzle.groups].sort(
    (a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color)
  );
}

function groupByColor(puzzle: DecodedConnectionsPuzzle, color: ConnectionsColor) {
  return puzzle.groups.find((g) => g.color === color);
}

function longDate(date: string): string {
  return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Per-puzzle FAQ — unique to this date, answers include the real group themes. */
function buildFaq(puzzle: DecodedConnectionsPuzzle, dateLabel: string) {
  const groups = orderedGroups(puzzle);
  const themeList = groups
    .map((g) => `${g.color} “${g.name}”`)
    .join(", ");
  const purple = groupByColor(puzzle, "purple");

  const items = [
    {
      question: `What are the answer groups for NYT Connections #${puzzle.id}?`,
      answer: `The four categories for Connections #${puzzle.id} on ${dateLabel} are ${themeList}. Open the answer board above to see every word in each group.`,
    },
    {
      question: `What is the hardest (purple) group on ${dateLabel}?`,
      answer: purple
        ? `The purple group — the trickiest of the four — is “${purple.name}”. It usually relies on wordplay or a hidden pattern rather than a simple category.`
        : `The purple group is the hardest of the four and usually relies on wordplay or a hidden pattern.`,
    },
    {
      question: `How many guesses did Connections #${puzzle.id} allow?`,
      answer: `Like every NYT Connections puzzle, #${puzzle.id} gives you four mistakes. Sort the 16 words into four groups of four; a fifth wrong guess ends the game and reveals the remaining answers.`,
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
    title: `NYT Connections Hints & Answers — ${dateLabel} (Puzzle #${puzzle.id})`,
    description: `Hints and full answers for NYT Connections puzzle #${puzzle.id} on ${dateLabel}. Progressive clues plus every word in the yellow, green, blue and purple groups.`,
    keywords: [
      `connections hint ${date}`,
      `connections answers ${dateLabel.toLowerCase()}`,
      `connections #${puzzle.id}`,
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
  const recentPuzzles = (await getRecentConnectionsPuzzles(6)).filter(
    (p) => p.printDate !== date
  );

  const dateLabel = longDate(date);
  const shortDate = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const faqItems = buildFaq(puzzle, shortDate);

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
      <JsonLd
        data={articleSchema({
          title: `NYT Connections Hints & Answers — ${dateLabel} (Puzzle #${puzzle.id})`,
          description: `Hints and full answers for NYT Connections puzzle #${puzzle.id} on ${dateLabel}.`,
          url: `${BASE_URL}/connections-hint/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="Connections"
        title={`NYT Connections Hints & Answers — Puzzle #${puzzle.id}`}
        description={`${dateLabel}. Reveal a hint for each color one level at a time, or open the answer board for every word.`}
      />

      <div className="mt-8 space-y-8">
        {/* Per-puzzle intro — unique to this date */}
        <ContentSection title={`About Connections #${puzzle.id}`}>
          <BodyText>
            The NYT Connections puzzle for {dateLabel} is puzzle #{puzzle.id}. As
            always, the board holds 16 words that split into four hidden groups
            of four — ranked from the easiest yellow group up to the toughest
            purple one. You get four mistakes before the game ends.
          </BodyText>
          <BodyText>
            Below you&apos;ll find a progressive hint for each color group. Start
            with the yellow hint, work your way down, and only open the full
            answer board when you want to confirm the exact words. New to the
            game? Read our full{" "}
            <Link
              href="/connections-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Connections how-to-play guide and strategy tips
            </Link>
            .
          </BodyText>
        </ContentSection>

        {/* Progressive hints */}
        <div className="space-y-3">
          {orderedGroups(puzzle).map((group) => (
            <ConnectionsHintCard
              key={group.color}
              color={group.color}
              hint={group.hint}
              groupName={group.name}
              words={group.words}
            />
          ))}
        </div>

        {/* Server-rendered, crawlable answer board */}
        <ConnectionsAnswerBoard groups={puzzle.groups} puzzleId={puzzle.id} />

        {/* Per-puzzle FAQ */}
        <ContentSection title={`Connections #${puzzle.id} FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

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

        {/* Recent puzzles — internal links */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="More Recent Connections Puzzles">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPuzzles.slice(0, 6).map((p) => (
                <ConnectionsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/connections-hint"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                Browse the full Connections archive →
              </Link>
            </div>
          </ContentSection>
        )}

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
