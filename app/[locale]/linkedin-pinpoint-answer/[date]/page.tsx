import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ArchiveStrip from "@/components/linkedin/ArchiveStrip";
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
  getRecentLinkedInDays,
} from "@/lib/linkedin-data";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

const META = LINKEDIN_GAME_BY_KEY.pinpoint;

function buildFaq(dateLabel: string) {
  return [
    {
      question: `What was the LinkedIn Pinpoint answer for ${dateLabel}?`,
      answer: `The Pinpoint category for ${dateLabel} is revealed on this page, along with all five clues in the order the game presents them. Clues open one at a time and the category stays hidden until you tap for it, so you can replay the round at your own pace rather than reading the answer straight away.`,
    },
    {
      question: `How many clues were in the ${dateLabel} Pinpoint puzzle?`,
      answer: `Every Pinpoint round uses the same structure: up to five clues, revealed one after another, with one guess attached to each. Solving on an earlier clue is the better result, so the ${dateLabel} round is worth replaying to see how few clues you would have needed.`,
    },
    {
      question: "Can I still play past Pinpoint puzzles on LinkedIn?",
      answer:
        "LinkedIn only serves the current day's round in the app, so older puzzles are no longer playable there. This archive keeps the clues and the category answer for each day we have covered, which is the practical way to review a round you missed or study how a category was built.",
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

  if (!day?.pinpoint) {
    return constructMetadata({
      page: "LinkedInPinpointAnswerDate",
      title: "LinkedIn Pinpoint Answer Not Found",
      description: "This LinkedIn Pinpoint puzzle was not found.",
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
    page: "LinkedInPinpointAnswerDate",
    title: `LinkedIn Pinpoint Answer for ${dateLabel} — Clues & Category`,
    description: `All five clues and the category answer for the LinkedIn Pinpoint puzzle on ${dateLabel}. Clues reveal one at a time, so nothing is spoiled early.`,
    keywords: [
      `linkedin pinpoint answer ${dateLabel.toLowerCase()}`,
      `pinpoint ${date}`,
      "linkedin pinpoint category",
      "pinpoint clues",
    ],
    locale: locale as Locale,
    path: `/${META.slug}/${date}`,
    canonicalUrl: `/${META.slug}/${date}`,
  });
}

export async function generateStaticParams() {
  const dates = await getAllLinkedInDates("pinpoint");
  const recent = dates.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const date of recent) {
      params.push({ locale, date });
    }
  }
  return params;
}

export default async function LinkedInPinpointAnswerDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.pinpoint) {
    notFound();
  }

  const { prev, next } = await getAdjacentLinkedInDays("pinpoint", date);
  const recent = (await getRecentLinkedInDays("pinpoint", 7)).filter(
    (d) => d.date !== date
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

  const faqItems = buildFaq(shortDate);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
          { name: "Pinpoint Answer", url: `${BASE_URL}/${META.slug}` },
          { name: shortDate, url: `${BASE_URL}/${META.slug}/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Pinpoint Answer — ${dateLabel}`,
          description: `All five clues and the category answer for the LinkedIn Pinpoint puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/${META.slug}/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title={`LinkedIn Pinpoint Answer — ${dateLabel}`}
        description="Clues revealed one at a time, then the category answer for this Pinpoint round."
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          This is the LinkedIn Pinpoint answer for {shortDate}. Open the clues
          one at a time and try naming the category before you unlock the next
          one — the answer itself stays hidden until you tap for it. For the
          current round see{" "}
          <Link href={`/${META.slug}`} className="text-primary underline">
            today&apos;s Pinpoint answer
          </Link>
          , or browse the{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub for Queens, Zip, Tango and Crossclimb.
        </p>

        <GameSolution game="pinpoint" day={day} dateLabel={shortDate} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Pinpoint is a trademark of
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

        {recent.length > 0 ? (
          <ContentSection title="More Recent Pinpoint Answers">
            <BodyText>
              Each past round keeps its full clue list and category, so you can
              replay a day you missed and see how few clues you would have
              needed.
            </BodyText>
            <div className="mt-3">
              <ArchiveStrip
                days={recent}
                slug={META.slug}
                gameName="Pinpoint"
              />
            </div>
          </ContentSection>
        ) : null}

        <ContentSection title="LinkedIn Pinpoint FAQ">
          <SimpleFaq items={faqItems} />
        </ContentSection>
      </div>
    </div>
  );
}
