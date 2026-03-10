import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  ExamplePuzzleGrid,
  RelatedLinks,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllMinuteCryptics,
  getMinuteCrypticByDate,
  getRelatedMinuteCryptics,
} from "@/lib/minute-cryptic-data";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { CLUE_TYPE_TOPICS } from "@/lib/minute-cryptic-topics";
import { MinuteCrypticClueType } from "@/types/minute-cryptic";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function getPreviousDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

function getNextDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split("T")[0];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getMinuteCrypticByDate(date);

  if (!puzzle) {
    return constructMetadata({
      title: "Solution Not Found",
      description: "No puzzle found for this date.",
      noIndex: true,
      locale: locale as Locale,
      path: `/daily-solution/${date}`,
    });
  }

  return constructMetadata({
    page: "DailySolution",
    title: `Minute Cryptic Solution — ${formatDate(date)}`,
    description: `Full solution and explanation for the minute cryptic clue published on ${formatDate(date)}. Learn how the ${puzzle.clueType} wordplay produces the answer.`,
    keywords: [
      "minute cryptic solution",
      "daily cryptic answer",
      "cryptic clue explanation",
      `${date} cryptic solution`,
    ],
    locale: locale as Locale,
    path: `/daily-solution/${date}`,
    canonicalUrl: `/daily-solution/${date}`,
  });
}

export default async function DailySolutionPage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getMinuteCrypticByDate(date);

  if (!puzzle) {
    notFound();
  }

  const related = await getRelatedMinuteCryptics(puzzle, 3);
  const clueTypeTopic = CLUE_TYPE_TOPICS[puzzle.clueType as MinuteCrypticClueType];
  const prevDate = getPreviousDate(date);
  const nextDate = getNextDate(date);
  const prevPuzzle = await getMinuteCrypticByDate(prevDate);
  const nextPuzzle = await getMinuteCrypticByDate(nextDate);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Daily Solutions", url: `${BASE_URL}/daily-solution/${date}` },
          { name: formatDate(date), url: `${BASE_URL}/daily-solution/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `Minute Cryptic Solution — ${formatDate(date)}`,
          description: `Full solution and explanation for the minute cryptic clue published on ${formatDate(date)}.`,
          url: `${BASE_URL}/daily-solution/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />

      <ContentHero
        eyebrow="Daily Solution"
        title={formatDate(date)}
        description={`Full breakdown of today's minute cryptic clue — a ${puzzle.difficulty} ${clueTypeTopic?.shortLabel ?? puzzle.clueType} clue.`}
      />

      <div className="mt-8 space-y-8">
        {/* Navigation between dates */}
        <div className="flex items-center justify-between">
          {prevPuzzle ? (
            <Link
              href={`/daily-solution/${prevDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              &larr; Previous
            </Link>
          ) : (
            <span />
          )}
          {nextPuzzle ? (
            <Link
              href={`/daily-solution/${nextDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Next &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* The clue */}
        <ContentSection title="The Clue" id="the-clue">
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
            <p className="font-heading text-lg font-bold text-foreground sm:text-xl">
              {puzzle.clue}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {clueTypeTopic?.shortLabel ?? puzzle.clueType}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {puzzle.difficulty}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {puzzle.answer.length} letters
            </span>
          </div>
        </ContentSection>

        {/* Spoiler warning */}
        <CalloutBox type="warning" title="Spoiler Warning">
          The answer and full explanation are shown below. If you have not
          attempted the clue yet, try solving it first on the{" "}
          <Link href={`/minute-cryptic/${date}`} className="font-medium text-primary hover:underline">
            puzzle page
          </Link>
          .
        </CalloutBox>

        {/* The answer */}
        <ContentSection title="The Answer" id="the-answer">
          <div className="flex justify-center">
            <div className="rounded-xl border-2 border-primary bg-primary/10 px-8 py-4">
              <p className="font-mono text-2xl font-bold tracking-[0.3em] text-primary sm:text-3xl">
                {puzzle.answer}
              </p>
            </div>
          </div>
        </ContentSection>

        {/* Full explanation */}
        <ContentSection title="Full Breakdown" id="full-breakdown">
          <BodyText>{puzzle.explanation}</BodyText>
          <SubHeading>Clue Type: {clueTypeTopic?.label ?? puzzle.clueType}</SubHeading>
          <BodyText>
            {clueTypeTopic?.detailBody ?? ""}
          </BodyText>
          {clueTypeTopic && (
            <CalloutBox type="tip" title="Review Focus">
              {clueTypeTopic.detailFocus}
            </CalloutBox>
          )}
        </ContentSection>

        {/* Learn more about this clue type */}
        {clueTypeTopic && (
          <ContentSection title="Learn More About This Clue Type" id="learn-more">
            <BodyText>
              This clue uses a <strong>{clueTypeTopic.shortLabel.toLowerCase()}</strong> mechanism.
              Visit the full guide to understand how these clues work and
              practice more examples.
            </BodyText>
            <div className="mt-3">
              <Link
                href={clueTypeTopic.href}
                className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
              >
                {clueTypeTopic.label} Guide &rarr;
              </Link>
            </div>
          </ContentSection>
        )}

        {/* Similar clues to practice */}
        {related.length > 0 && (
          <ExamplePuzzleGrid
            id="similar-clues"
            puzzles={related}
            title="Similar Clues to Practice"
            intro={`These clues use similar mechanisms or difficulty levels. Practice them to reinforce what you learned from today's solution.`}
          />
        )}

        <RelatedLinks
          links={[
            ...(prevPuzzle
              ? [{
                  href: `/daily-solution/${prevDate}`,
                  title: "Yesterday's solution",
                  description: `See the breakdown for ${formatDate(prevDate)}.`,
                }]
              : []),
            {
              href: "/minute-cryptic-today",
              title: "Today's clue",
              description: "Try solving today's minute cryptic puzzle.",
            },
            {
              href: "/minute-cryptic",
              title: "Archive",
              description: "Browse all past clues by date, type, or difficulty.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const puzzles = await getAllMinuteCryptics();
  const params: { locale: string; date: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of puzzles) {
      params.push({ locale, date: puzzle.printDate });
    }
  }

  return params;
}
