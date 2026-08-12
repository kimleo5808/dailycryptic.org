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

const META = LINKEDIN_GAME_BY_KEY.tango;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.tango) {
    return constructMetadata({
      page: "LinkedInTangoAnswerDate",
      title: "LinkedIn Tango Answer Not Found",
      description: "This LinkedIn Tango puzzle was not found.",
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
    page: "LinkedInTangoAnswerDate",
    title: `LinkedIn Tango Answer for ${dateLabel} — Hints & Solution`,
    description: `Hints and the full sun and moon grid for the LinkedIn Tango puzzle on ${dateLabel}. Spoiler-free hints first, then the complete solution.`,
    keywords: [
      `linkedin tango answer ${dateLabel.toLowerCase()}`,
      `tango answer ${date}`,
      "linkedin tango solution",
      "tango puzzle answer",
    ],
    locale: locale as Locale,
    path: `/${META.slug}/${date}`,
    canonicalUrl: `/${META.slug}/${date}`,
  });
}

export async function generateStaticParams() {
  const dates = (await getAllLinkedInDates("tango")).slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const date of dates) {
      params.push({ locale, date });
    }
  }
  return params;
}

export default async function LinkedInTangoAnswerDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day || !day.tango) {
    notFound();
  }

  const { prev, next } = await getAdjacentLinkedInDays("tango", date);

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
      question: `What was the LinkedIn Tango answer for ${shortDate}?`,
      answer: `The complete Tango grid for ${shortDate} is on this page, held behind a reveal button. Read the graded hints first if you want to finish the board yourself, then open the solution to see every sun and moon in place.`,
    },
    {
      question: `How is the ${shortDate} Tango puzzle solved?`,
      answer: `Start from any two matching symbols already sitting side by side — the three-in-a-row rule forces the cells at both ends. Then cash in the equals and cross signs, and finish by counting each row and column toward its quota of three suns and three moons.`,
    },
    {
      question: "Can I still play this Tango board?",
      answer: `LinkedIn keeps only the current day playable, so an archived board like ${shortDate} is best used for study rather than for a streak. Working through an older Tango answer is still a good way to drill the signs and the counting pass.`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
          { name: "Tango Answer", url: `${BASE_URL}/${META.slug}` },
          { name: dateLabel, url: `${BASE_URL}/${META.slug}/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Tango Answer for ${dateLabel}`,
          description: `Hints and the full solved sun and moon grid for the LinkedIn Tango puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/${META.slug}/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title={`LinkedIn Tango Answer — ${dateLabel}`}
        description="Spoiler-free hints first, then the complete sun and moon grid for this Tango board."
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          This is the archived LinkedIn Tango answer for {dateLabel}. The three
          graded hints come first, then the finished six-by-six grid with every
          sun and moon placed. For the current board see{" "}
          <Link href={`/${META.slug}`} className="text-primary underline">
            today&apos;s Tango answer
          </Link>
          , or browse{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            all LinkedIn games answers
          </Link>
          .
        </p>

        <GameSolution game="tango" day={day} dateLabel={dateLabel} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Tango is a trademark of
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
            Today&apos;s Tango Answer
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

        <ContentSection title={`About the ${shortDate} Tango Puzzle`}>
          <BodyText>
            Every LinkedIn Tango board follows the same three constraints: each
            row and column ends with three suns and three moons, no three
            identical symbols may sit consecutively, and the equals and cross
            signs bind neighbouring cells together or apart. Those rules are
            enough to determine one unique grid, which is why this archived Tango
            solution is the only valid answer for the date.
          </BodyText>
          <BodyText>
            If you are working through the archive to build speed, try covering
            the solution and using only the first hint. Older boards make good
            practice precisely because nothing is at stake, and the counting pass
            that closes out a Tango answer is a habit worth drilling on puzzles
            that no longer affect your streak.
          </BodyText>
        </ContentSection>

        <ContentSection title="FAQ">
          <SimpleFaq items={faqItems} />
        </ContentSection>
      </div>
    </div>
  );
}
