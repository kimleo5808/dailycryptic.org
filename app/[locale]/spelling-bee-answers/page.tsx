import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import SpellingBeePuzzleCard from "@/components/spelling-bee/SpellingBeePuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  collectionPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getSpellingBeePuzzlesByMonth,
  getAllSpellingBeePuzzles,
} from "@/lib/spelling-bee-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "SpellingBeeAnswersArchive",
    title: "All NYT Spelling Bee Answers — Full Archive",
    description:
      "Browse every past NYT Spelling Bee puzzle with letters, stats, hints and the full answer list. Organised by month and updated daily.",
    keywords: [
      "spelling bee answers archive",
      "past spelling bee answers",
      "nyt spelling bee word list archive",
      "spelling bee answer history",
    ],
    locale: locale as Locale,
    path: "/spelling-bee-answers",
    canonicalUrl: "/spelling-bee-answers",
  });
}

export default async function SpellingBeeAnswersArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getSpellingBeePuzzlesByMonth();
  const allPuzzles = await getAllSpellingBeePuzzles();
  const latestDate = allPuzzles.length > 0 ? allPuzzles[0].printDate : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Spelling Bee Answers Archive",
            url: `${BASE_URL}/spelling-bee-answers`,
          },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "NYT Spelling Bee Answers Archive",
          description:
            "Browse every past NYT Spelling Bee puzzle with letters, stats, hints and answers.",
          url: `${BASE_URL}/spelling-bee-answers`,
        })}
      />

      <ContentHero
        eyebrow="Archive"
        title="All NYT Spelling Bee Answers"
        description="Every past puzzle with its letters, word count, pangram and full answer list. Updated daily."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <section key={month.label} aria-label={month.label}>
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {month.rangeLabel}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {month.puzzles.map((p) => (
                <SpellingBeePuzzleCard
                  key={p.printDate}
                  puzzle={p}
                  isLatest={p.printDate === latestDate}
                />
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Spelling Bee is a
          trademark of The New York Times Company.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/spelling-bee-answers-today",
              title: "Today's Spelling Bee answers",
              description: "Hints, pangram and the full word list for today.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description: "Solve a daily one-clue cryptic crossword with hints.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description: "Unscramble letters and find every possible word.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
