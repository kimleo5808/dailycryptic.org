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

const META = LINKEDIN_GAME_BY_KEY.queens;

function buildFaq(dateLabel: string) {
  return [
    {
      question: `What was the LinkedIn Queens answer on ${dateLabel}?`,
      answer: `The complete crown placement for the ${dateLabel} Queens board is on this page, held behind a reveal button. Read the three graded hints first if you would rather solve it yourself, then open the solved grid to see one crown in every row, column and coloured region.`,
    },
    {
      question: `Can I still play the ${dateLabel} Queens puzzle?`,
      answer: `The app only serves the current day's board, so older puzzles are no longer playable there. This archive page keeps the hints and the solved grid for ${dateLabel} permanently, which makes it useful for reviewing a day you missed or studying how a particular board resolved.`,
    },
    {
      question: "How is each Queens board solved?",
      answer:
        "Every Queens board has exactly one valid arrangement, reached by elimination rather than guesswork. Start with the smallest colour regions, mark squares that cannot hold a crown instead of guessing placements, and remember that crowns may never touch — not even diagonally.",
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

  if (!day?.queens) {
    return constructMetadata({
      page: "LinkedInQueensAnswerDate",
      title: "LinkedIn Queens Answer Not Found",
      description: "This LinkedIn Queens puzzle was not found.",
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
    page: "LinkedInQueensAnswerDate",
    title: `LinkedIn Queens Answer for ${dateLabel} — Hints & Solution`,
    description: `Hints and the full solved board for the LinkedIn Queens puzzle on ${dateLabel}. Spoiler-free clues first, then every crown placed.`,
    keywords: [
      `linkedin queens answer ${dateLabel.toLowerCase()}`,
      `queens answer ${date}`,
      ...META.keywords,
    ],
    locale: locale as Locale,
    path: `/${META.slug}/${date}`,
    canonicalUrl: `/${META.slug}/${date}`,
  });
}

export async function generateStaticParams() {
  const dates = await getAllLinkedInDates("queens");
  return LOCALES.flatMap((locale) => dates.map((date) => ({ locale, date })));
}

export default async function LinkedInQueensAnswerDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const day = await getLinkedInDayByDate(date);

  if (!day?.queens) {
    notFound();
  }

  const { prev, next } = await getAdjacentLinkedInDays("queens", date);
  const recent = (await getRecentLinkedInDays("queens", 8)).filter(
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
          { name: "Queens Answer", url: `${BASE_URL}/${META.slug}` },
          { name: shortDate, url: `${BASE_URL}/${META.slug}/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Queens Answer — ${dateLabel}`,
          description: `Hints and the full solved board for the LinkedIn Queens puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/${META.slug}/${date}`,
          datePublished: date,
          dateModified: date,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title={`LinkedIn Queens Answer — ${dateLabel}`}
        description="Three spoiler-free hints first, then the full crown placement for this board."
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          The LinkedIn Queens answer for {dateLabel} is published below. Work
          through the graded hints if you still want to finish the board
          yourself, or reveal the solved grid to see every crown in place. For
          the current puzzle see{" "}
          <Link href={`/${META.slug}`} className="text-primary underline">
            today&apos;s Queens answer
          </Link>
          , and the{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Zip, Tango, Pinpoint and Crossclimb the same way.
        </p>

        <GameSolution game="queens" day={day} dateLabel={shortDate} />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Queens is a trademark of
          LinkedIn Corporation.
        </p>

        {/* Prev / today / next */}
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
            Today&apos;s Queens Answer
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

        <ContentSection title={`About the ${shortDate} Queens board`}>
          <BodyText>
            Queens is the daily logic grid: one crown in every row, every column
            and every coloured region, with no two crowns ever touching — not
            even at a corner. The board published on {shortDate}{" "}
            followed those same four rules, and like every Queens puzzle it had
            exactly one valid arrangement waiting to be found.
          </BodyText>
          <BodyText>
            If you are reviewing this board rather than solving it fresh, the
            most useful thing to study is the order in which it resolves. The
            smallest colour regions almost always fall first, because a region
            squeezed into two or three squares forces a crown into a single row
            or column before anything else on the grid is settled. From there,
            each placed crown removes a whole row, a whole column, its own
            region and the ring of squares around it.
          </BodyText>
          <BodyText>
            Only the current day is playable inside the app, so this page is the
            lasting record of the {shortDate} Queens answer. Every board we
            cover keeps a permanent page with the same hints-before-spoilers
            structure.
          </BodyText>
        </ContentSection>

        {recent.length > 0 ? (
          <ContentSection title="More Queens answers">
            <ArchiveStrip days={recent} slug={META.slug} gameName="Queens" />
          </ContentSection>
        ) : null}

        <ContentSection title="FAQ">
          <SimpleFaq items={faqItems} />
        </ContentSection>
      </div>
    </div>
  );
}
