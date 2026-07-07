import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import PipsPuzzleCard from "@/components/pips/PipsPuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, collectionPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { getPipsPuzzlesByMonth, getAllPipsPuzzles } from "@/lib/pips-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "PipsAnswersArchive",
    title: "All NYT Pips Answers — Full Archive",
    description:
      "Browse every past NYT Pips puzzle with Easy, Medium and Hard boards, strategy hints and full solutions. Organised by month and updated daily.",
    keywords: [
      "pips answers archive",
      "past nyt pips answers",
      "nyt pips solution history",
      "pips answer archive",
    ],
    locale: locale as Locale,
    path: "/pips-answers",
    canonicalUrl: "/pips-answers",
  });
}

export default async function PipsAnswersArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getPipsPuzzlesByMonth();
  const allPuzzles = await getAllPipsPuzzles();
  const latestDate = allPuzzles.length > 0 ? allPuzzles[0].printDate : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Pips Answers Archive", url: `${BASE_URL}/pips-answers` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "NYT Pips Answers Archive",
          description:
            "Browse every past NYT Pips puzzle with all three difficulty boards and full solutions.",
          url: `${BASE_URL}/pips-answers`,
        })}
      />

      <ContentHero
        eyebrow="Archive"
        title="All NYT Pips Answers"
        description="Every past puzzle with Easy, Medium and Hard boards, strategy hints and full solutions. Updated daily."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <section key={month.label} aria-label={month.label}>
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
              {month.rangeLabel}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {month.puzzles.map((p) => (
                <PipsPuzzleCard
                  key={p.printDate}
                  puzzle={p}
                  isLatest={p.printDate === latestDate}
                />
              ))}
            </div>
          </section>
        ))}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Pips is a
          trademark of The New York Times Company.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/pips-answers-today",
              title: "Today's Pips answers",
              description: "Strategy hints and full solutions for all three tiers.",
            },
            {
              href: "/spelling-bee-answers-today",
              title: "Spelling Bee answers today",
              description: "Hints, pangram and the full word list for today.",
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
