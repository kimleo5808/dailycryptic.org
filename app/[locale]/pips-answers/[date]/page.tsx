import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import PipsTierView from "@/components/pips/PipsTierView";
import PipsAnswerBoard from "@/components/pips/PipsAnswerBoard";
import PipsPuzzleCard from "@/components/pips/PipsPuzzleCard";
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
  getPipsPuzzleByDate,
  getAllPipsPuzzles,
  getAdjacentPipsPuzzles,
  getRecentPipsPuzzles,
  buildStrategyHint,
} from "@/lib/pips-data";
import type { PipsDecodedPuzzle, PipsDecodedTier } from "@/types/pips";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/** Count of regions that carry an actual constraint (i.e. not "empty"). */
function constrainedRegions(tier: PipsDecodedTier): number {
  return tier.regions.filter((r) => r.type !== "empty").length;
}

/** Per-puzzle FAQ — answers pull in facts derived from this date's tiers. */
function buildFaq(puzzle: PipsDecodedPuzzle, dateLabel: string) {
  const { easy, medium, hard } = puzzle.tiers;
  const totalDominoes =
    easy.dominoes.length + medium.dominoes.length + hard.dominoes.length;

  return [
    {
      question: `How do you solve the ${dateLabel} Pips puzzle?`,
      answer: `Each Pips board on ${dateLabel} is a domino-placement logic puzzle: fit every domino so all region rules hold. Start with the "equal" and tightest sum regions — they lock values fastest — then work outward to the unconstrained cells. The Easy tier has ${easy.dominoes.length} dominoes across ${constrainedRegions(
        easy
      )} constrained regions, and the Hard tier has ${hard.dominoes.length}. Open the answer board above for the full solved layout.`,
    },
    {
      question: `How many dominoes are in the ${dateLabel} Pips puzzle?`,
      answer: `Across all three tiers there are ${totalDominoes} dominoes to place — ${easy.dominoes.length} on Easy, ${medium.dominoes.length} on Medium and ${hard.dominoes.length} on Hard. Each tier is an independent board with its own set of tiles and region constraints.`,
    },
    {
      question: `What is the difference between the Easy, Medium and Hard Pips tiers?`,
      answer: `They are three separate puzzles that grow in size and constraint density. On ${dateLabel} the Easy board spans ${easy.rows}×${easy.cols} with ${constrainedRegions(
        easy
      )} constrained regions, Medium spans ${medium.rows}×${medium.cols} with ${constrainedRegions(
        medium
      )}, and Hard spans ${hard.rows}×${hard.cols} with ${constrainedRegions(
        hard
      )}. Larger boards and more overlapping rules make the Hard tier the toughest to place cleanly.`,
    },
  ];
}

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
  const recentPuzzles = (await getRecentPipsPuzzles(6)).filter(
    (p) => p.printDate !== date
  );

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const shortDate = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const tierEntries = [
    {
      key: "easy" as const,
      label: "Easy",
      tier: puzzle.tiers.easy,
      strategyHint: buildStrategyHint(puzzle.tiers.easy),
    },
    {
      key: "medium" as const,
      label: "Medium",
      tier: puzzle.tiers.medium,
      strategyHint: buildStrategyHint(puzzle.tiers.medium),
    },
    {
      key: "hard" as const,
      label: "Hard",
      tier: puzzle.tiers.hard,
      strategyHint: buildStrategyHint(puzzle.tiers.hard),
    },
  ];

  const answerTiers = tierEntries.map(({ key, label, tier }) => ({
    key,
    label,
    tier,
  }));

  const faqItems = buildFaq(puzzle, shortDate);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Pips Answers", url: `${BASE_URL}/pips-answers` },
          { name: dateLabel, url: `${BASE_URL}/pips-answers/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Pips Answers — ${dateLabel}`,
          description: `Hints and full solutions for the NYT Pips puzzle on ${dateLabel}, across Easy, Medium and Hard.`,
          url: `${BASE_URL}/pips-answers/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="Pips"
        title={`NYT Pips Answers — ${dateLabel}`}
        description="Spoiler-free strategy first, then the full solved board for Easy, Medium and Hard."
      />

      <div className="mt-8 space-y-8">
        {/* Interactive tier view (client) */}
        <PipsTierView tiers={tierEntries} />

        {/* Server-rendered, crawlable answer board (all three tiers) */}
        <PipsAnswerBoard tiers={answerTiers} printDate={date} />

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

        {/* Recent Pips puzzles — internal links */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="More Recent Pips Puzzles">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPuzzles.slice(0, 6).map((p) => (
                <PipsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/pips-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                Browse the full Pips archive →
              </Link>
            </div>
          </ContentSection>
        )}

        {/* ── SEO content below the core answers ───────────────────────── */}

        {/* Per-puzzle intro — unique to this date */}
        <ContentSection title={`About the ${shortDate} Pips puzzle`}>
          <BodyText>
            The NYT Pips puzzle for {dateLabel} comes in three independent tiers
            — Easy, Medium and Hard. Each tier hands you a set of domino tiles
            and a board split into regions with rules such as &ldquo;all cells
            equal&rdquo;, a target sum, or a greater-than / less-than limit. You
            win a tier by placing every domino so that all of its region rules
            hold at once.
          </BodyText>
          <BodyText>
            On this date the Easy board spans {puzzle.tiers.easy.rows}&times;
            {puzzle.tiers.easy.cols} with{" "}
            {puzzle.tiers.easy.dominoes.length} dominoes across{" "}
            {constrainedRegions(puzzle.tiers.easy)} constrained regions, the
            Medium board spans {puzzle.tiers.medium.rows}&times;
            {puzzle.tiers.medium.cols} with{" "}
            {puzzle.tiers.medium.dominoes.length} dominoes, and the Hard board
            spans {puzzle.tiers.hard.rows}&times;{puzzle.tiers.hard.cols} with{" "}
            {puzzle.tiers.hard.dominoes.length} dominoes over{" "}
            {constrainedRegions(puzzle.tiers.hard)} constrained regions. Read a
            spoiler-free strategy for each tier below, then open the answer board
            when you want the full solved layout.
          </BodyText>
        </ContentSection>

        {/* Per-puzzle FAQ */}
        <ContentSection title={`${shortDate} Pips FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

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
