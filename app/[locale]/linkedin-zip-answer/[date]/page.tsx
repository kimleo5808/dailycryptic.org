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

const META = LINKEDIN_GAME_BY_KEY.zip;

function buildFaq(dateLabel: string) {
  return [
    {
      question: `What was the LinkedIn Zip answer for ${dateLabel}?`,
      answer: `The full traced route for the ${dateLabel} Zip board is on this page, held behind a reveal button. Three graded hints come first, so you can take a nudge toward the forced corners without seeing the whole path at once.`,
    },
    {
      question: `How is the ${dateLabel} Zip puzzle solved?`,
      answer: `Draw one unbroken line from the cell numbered one to the highest number, moving only up, down, left or right, never crossing a wall, hitting the checkpoints in ascending order and covering every square on the grid exactly once. Start from the corners and wall-sealed pockets, where the route has no choice at all.`,
    },
    {
      question: "Can I still play this Zip board?",
      answer:
        "LinkedIn serves one puzzle per day and does not keep an in-app archive, so past boards can no longer be played there. This page preserves the hints and the complete numbered path so you can review how the route resolved.",
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.zip) {
    return constructMetadata({
      page: "LinkedInZipAnswerDate",
      title: "LinkedIn Zip Answer Not Found",
      description: "This LinkedIn Zip puzzle was not found.",
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
    page: "LinkedInZipAnswerDate",
    title: `LinkedIn Zip Answer for ${dateLabel} — Hints & Solution`,
    description: `Hints and the complete numbered path for the LinkedIn Zip puzzle on ${dateLabel}. Spoiler-free clues first, then the full route.`,
    keywords: [
      `linkedin zip answer ${dateLabel.toLowerCase()}`,
      `linkedin zip ${date}`,
      "linkedin zip solution",
      "zip puzzle answer",
    ],
    locale: locale as Locale,
    path: `/${META.slug}/${date}`,
    canonicalUrl: `/${META.slug}/${date}`,
  });
}

export async function generateStaticParams() {
  const dates = await getAllLinkedInDates("zip");
  return LOCALES.flatMap((locale) => dates.map((date) => ({ locale, date })));
}

export default async function LinkedInZipAnswerDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.zip) {
    notFound();
  }

  const { prev, next } = await getAdjacentLinkedInDays("zip", date);

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

  const faqItems = buildFaq(shortDate);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
          { name: "Zip Answer", url: `${BASE_URL}/${META.slug}` },
          { name: shortDate, url: `${BASE_URL}/${META.slug}/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Zip Answer for ${dateLabel}`,
          description: `Hints and the complete numbered path for the LinkedIn Zip puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/${META.slug}/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title={`LinkedIn Zip Answer — ${shortDate}`}
        description="Three spoiler-free hints first, then the complete numbered path through the board."
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          This is the LinkedIn Zip answer for {dateLabel}. The graded hints come
          first and the traced route sits behind a reveal button, so you can take
          as little help as you need. For the current board, see{" "}
          <Link href={`/${META.slug}`} className="text-primary underline">
            today&apos;s Zip answer
          </Link>
          , or browse the{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub for Queens, Tango, Pinpoint and Crossclimb.
        </p>

        <GameSolution game="zip" day={day} dateLabel={shortDate} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Zip is a trademark of
          LinkedIn Corporation.
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
            Today&apos;s Zip Answer
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

        <ContentSection title={`About the ${shortDate} Zip puzzle`}>
          <BodyText>
            The LinkedIn Zip board for {dateLabel} follows the same rules as
            every other day: one unbroken line from the cell numbered one to the
            highest number, moving only to orthogonal neighbours, never crossing
            a wall, and covering every square on the grid exactly once. The
            numbered checkpoints have to be reached in ascending order, which is
            what narrows an enormous space of possible routes down to a single
            valid Zip solution.
          </BodyText>
          <BodyText>
            If you are reviewing this board rather than solving it live, the
            most instructive part is usually the opening. Look at where the
            corners and the wall-sealed pockets forced the route before any real
            choice existed — those forced segments are the skeleton every
            successful solve is built on, and spotting them quickly is what
            separates a fast finish from a long one.
          </BodyText>
        </ContentSection>

        <ContentSection title={`${shortDate} Zip FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>
      </div>
    </div>
  );
}
