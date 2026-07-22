import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import StrandsThemeCard from "@/components/strands/StrandsThemeCard";
import StrandsSpangramReveal from "@/components/strands/StrandsSpangramReveal";
import StrandsWordList from "@/components/strands/StrandsWordList";
import StrandsAnswerBoard from "@/components/strands/StrandsAnswerBoard";
import StrandsPuzzleCard from "@/components/strands/StrandsPuzzleCard";
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
  getStrandsPuzzleByDate,
  getRawStrandsPuzzleByDate,
  getAllStrandsPuzzles,
  getAdjacentStrandsPuzzles,
  getRecentStrandsPuzzles,
} from "@/lib/strands-data";
import type { DecodedStrandsPuzzle } from "@/types/strands";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

function longDate(date: string): string {
  return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function shortDate(date: string): string {
  return new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Per-puzzle FAQ — unique to this date, answers include the real theme/spangram. */
function buildFaq(puzzle: DecodedStrandsPuzzle, dateLabel: string) {
  const wordCount = puzzle.themeWords.length + 1; // theme words + spangram
  return [
    {
      question: `What is the spangram for Strands #${puzzle.id}?`,
      answer: `The spangram for NYT Strands #${puzzle.id} on ${dateLabel} is “${puzzle.spangram}” — a ${puzzle.spangramLetterCount}-letter word running ${puzzle.spangramDirection}ly across the board. Open the answer board above to see it in context with every theme word.`,
    },
    {
      question: `What is the theme for Strands #${puzzle.id} on ${dateLabel}?`,
      answer: `The theme is “${puzzle.theme}”. The board holds ${wordCount} words in total — ${puzzle.themeWords.length} theme words plus the spangram — and each one connects back to that idea. The NYT clue for the day was “${puzzle.clue}”.`,
    },
    {
      question: `How many theme words are in Strands #${puzzle.id}?`,
      answer: `Strands #${puzzle.id} has ${puzzle.themeWords.length} theme words plus one spangram, for ${wordCount} answers in all. Reveal them one at a time with the cards above, or open the full answer board to see the complete list at once.`,
    },
  ];
}

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

  const dateLabel = shortDate(date);

  return constructMetadata({
    page: "StrandsHintDate",
    title: `NYT Strands Hints & Answers — ${dateLabel} (Strands #${puzzle.id})`,
    description: `Hints, spangram, and full answers for NYT Strands #${puzzle.id} on ${dateLabel}. Progressive clues plus the theme and every theme word — reveal as much or as little as you need.`,
    keywords: [
      `strands hint ${date}`,
      `strands answers ${dateLabel.toLowerCase()}`,
      `strands #${puzzle.id}`,
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
  const recentPuzzles = (await getRecentStrandsPuzzles(7)).filter(
    (p) => p.printDate !== date
  );

  const dateLabel = longDate(date);
  const faqItems = buildFaq(puzzle, shortDate(date));
  const wordCount = puzzle.themeWords.length + 1;

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
      <JsonLd
        data={articleSchema({
          title: `NYT Strands Hints & Answers — ${dateLabel} (Strands #${puzzle.id})`,
          description: `Hints, spangram, and full answers for NYT Strands #${puzzle.id} on ${dateLabel}.`,
          url: `${BASE_URL}/strands-hint/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="Strands"
        title={`NYT Strands Hints — Strands #${puzzle.id}`}
        description={`${dateLabel}. Reveal hints one level at a time, or jump straight to the answers.`}
      />

      <div className="mt-8 space-y-8">
        {/* Per-puzzle intro — unique to this date */}
        <ContentSection title={`About Strands #${puzzle.id}`}>
          <BodyText>
            The NYT Strands puzzle for {dateLabel} is Strands #{puzzle.id}, and
            the theme clue reads “{puzzle.clue}”. As with every Strands board,
            you&apos;re looking for {wordCount} answers in all —{" "}
            {puzzle.themeWords.length} theme words plus one spangram, a{" "}
            {puzzle.spangramLetterCount}-letter word that runs{" "}
            {puzzle.spangramDirection}ly and touches two opposite sides of the
            grid.
          </BodyText>
          <BodyText>
            Start with the theme card below for a gentle nudge, use the spangram
            hints when you&apos;re stuck on the long connector, and only open the
            answer board once you want every word confirmed. New to the game?
            Our{" "}
            <Link
              href="/strands-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Strands how-to-play guide and daily hints
            </Link>{" "}
            walk through the strategy.
          </BodyText>
        </ContentSection>

        {/* Progressive hints (interactive) */}
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

        {/* Interactive word list */}
        <StrandsWordList
          themeWords={rawPuzzle.themeWords}
          spangram={rawPuzzle.spangram}
        />

        {/* Server-rendered, crawlable answer board */}
        <StrandsAnswerBoard
          puzzleId={puzzle.id}
          theme={puzzle.theme}
          spangram={puzzle.spangram}
          spangramDirection={puzzle.spangramDirection}
          spangramLetterCount={puzzle.spangramLetterCount}
          themeWords={puzzle.themeWords}
        />

        {/* Per-puzzle FAQ */}
        <ContentSection title={`Strands #${puzzle.id} FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

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

        {/* Recent puzzles — internal links */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="More Recent Strands Puzzles">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPuzzles.slice(0, 6).map((p) => (
                <StrandsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/strands-hint"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                Browse the full Strands archive →
              </Link>
            </div>
          </ContentSection>
        )}

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
  // Limit pre-generation to avoid Cloudflare R2 upload timeouts.
  // Older pages are generated on-demand and cached.
  const recent = puzzles.slice(0, 30);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
