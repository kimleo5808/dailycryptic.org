import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import GameSolution from "@/components/linkedin/GameSolution";
import { LINKEDIN_GAME_BY_KEY, LINKEDIN_HUB_PATH } from "@/config/linkedin-games";
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
  getAdjacentLinkedInDays,
  getAllLinkedInDates,
  getLinkedInDayByDate,
} from "@/lib/linkedin-data";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

const META = LINKEDIN_GAME_BY_KEY.crossclimb;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.crossclimb) {
    return constructMetadata({
      page: "LinkedInCrossclimbDate",
      title: "Crossclimb Answer Not Found",
      description: "This LinkedIn Crossclimb puzzle was not found.",
      locale: locale as Locale,
      path: `/${META.slug}/${date}`,
      canonicalUrl: `/${META.slug}/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "LinkedInCrossclimbDate",
    title: `LinkedIn Crossclimb Answer for ${dateLabel} — Clues & Ladder`,
    description: `Every Crossclimb clue answered for ${dateLabel}, plus the finished ladder order and both bonus words. Hints before spoilers.`,
    keywords: [
      `crossclimb answer ${dateLabel.toLowerCase()}`,
      `linkedin crossclimb ${date}`,
      "crossclimb ladder answer",
      "crossclimb clues today",
    ],
    locale: locale as Locale,
    path: `/${META.slug}/${date}`,
    canonicalUrl: `/${META.slug}/${date}`,
  });
}

export default async function LinkedInCrossclimbDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.crossclimb) {
    notFound();
  }

  const { prev, next } = await getAdjacentLinkedInDays("crossclimb", date);

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

  const faqItems = [
    {
      question: `What was the Crossclimb answer on ${shortDate}?`,
      answer: `The full Crossclimb answer for ${shortDate} is on this page: every clue word, the finished ladder order, and the two bonus words that cap it. Each rung stays hidden behind its own reveal button, so you can check a single word without seeing the rest of the ladder.`,
    },
    {
      question: `How was the ${shortDate} Crossclimb ladder ordered?`,
      answer: `Every neighbouring pair on the ladder differs by exactly one letter in one position. Reveal the rungs above in order and the chain becomes clear — each step changes a single character while the rest of the word stays put. The amber chips mark the final order from top to bottom.`,
    },
    {
      question: "Can I still play this Crossclimb puzzle?",
      answer:
        "LinkedIn only serves the current day's board, so past puzzles are no longer playable in the app. This archive page keeps the clues, ladder and bonus words for reference, and today's live puzzle is always covered on our Crossclimb answer page.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
          { name: "Crossclimb Answer", url: `${BASE_URL}/${META.slug}` },
          { name: dateLabel, url: `${BASE_URL}/${META.slug}/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Crossclimb Answer — ${dateLabel}`,
          description: `Every clue answered plus the finished ladder and bonus caps for the LinkedIn Crossclimb puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/${META.slug}/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title={`LinkedIn Crossclimb Answer — ${dateLabel}`}
        description="Graded hints first, then every clue word, the ladder order and both bonus caps."
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          This is the archived LinkedIn Crossclimb answer for {dateLabel}. Take
          the hints first if you are replaying the puzzle, then reveal rungs one
          at a time to check a single clue without spoiling the rest of the
          ladder. For the current board, see{" "}
          <Link href={`/${META.slug}`} className="text-primary underline">
            today&apos;s Crossclimb answer
          </Link>
          , or browse the full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub.
        </p>

        <GameSolution game="crossclimb" day={day} dateLabel={dateLabel} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Crossclimb is a trademark
          of LinkedIn Corporation.
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/${META.slug}/${prev.date}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {prev.date}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href={`/${META.slug}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Answer
          </Link>
          {next ? (
            <Link
              href={`/${META.slug}/${next.date}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {next.date} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        <ContentSection title={`About the ${shortDate} Crossclimb puzzle`}>
          <BodyText>
            The Crossclimb puzzle for {dateLabel} follows the game&apos;s usual
            three stages. You solve a stack of trivia-style clues whose answers
            are all the same length, reorder those words so each neighbouring
            pair differs by exactly one letter, then fill the slots above and
            below the ladder with two bonus words that share a single clue.
          </BodyText>
          <BodyText>
            Reveal the rungs above in whichever order suits you — each one
            uncovers a single clue word, and the amber chips show where that word
            sits in the finished ladder. If you are working through this board as
            practice, try comparing the revealed words letter by letter before
            uncovering the rest; spotting the one-letter steps yourself is the
            skill the puzzle is really training.
          </BodyText>
        </ContentSection>

        <ContentSection title={`${shortDate} Crossclimb FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={LINKEDIN_HUB_PATH}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            All LinkedIn Games
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
  const dates = (await getAllLinkedInDates("crossclimb")).slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const date of dates) {
      params.push({ locale, date });
    }
  }
  return params;
}
