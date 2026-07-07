import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import LetterBoxedPuzzleCard from "@/components/letter-boxed/LetterBoxedPuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, collectionPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getLetterBoxedPuzzlesByMonth,
  getAllLetterBoxedPuzzles,
} from "@/lib/letter-boxed-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LetterBoxedAnswersArchive",
    title: "All NYT Letter Boxed Answers — Full Archive",
    description:
      "Browse every past NYT Letter Boxed puzzle with its box, spoiler-free hints and the official two-word solution. Organised by month and updated daily.",
    keywords: [
      "letter boxed answers archive",
      "past letter boxed answers",
      "nyt letter boxed solution history",
      "letter boxed answer archive",
    ],
    locale: locale as Locale,
    path: "/letter-boxed-answers",
    canonicalUrl: "/letter-boxed-answers",
  });
}

export default async function LetterBoxedAnswersArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getLetterBoxedPuzzlesByMonth();
  const allPuzzles = await getAllLetterBoxedPuzzles();
  const latestDate = allPuzzles.length > 0 ? allPuzzles[0].printDate : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Letter Boxed Answers Archive", url: `${BASE_URL}/letter-boxed-answers` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "NYT Letter Boxed Answers Archive",
          description:
            "Browse every past NYT Letter Boxed puzzle with its box, hints and official solution.",
          url: `${BASE_URL}/letter-boxed-answers`,
        })}
      />

      <ContentHero
        eyebrow="Archive"
        title="All NYT Letter Boxed Answers"
        description="Every past puzzle with its box, spoiler-free hints and the official two-word solution. Updated daily."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <section key={month.label} aria-label={month.label}>
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {month.rangeLabel}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {month.puzzles.map((p) => (
                <LetterBoxedPuzzleCard
                  key={p.printDate}
                  puzzle={p}
                  isLatest={p.printDate === latestDate}
                />
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Letter Boxed is a
          trademark of The New York Times Company.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/letter-boxed-answers-today",
              title: "Today's Letter Boxed answer",
              description: "Spoiler-free hints and the official two-word solution.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description: "Unscramble letters and find every possible word.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description: "Solve a daily one-clue cryptic crossword with hints.",
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
