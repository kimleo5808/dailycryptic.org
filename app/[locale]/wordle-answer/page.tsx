import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordleMonthGroup from "@/components/wordle/WordleMonthGroup";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getWordlePuzzlesByMonth,
  getAllWordlePuzzles,
} from "@/lib/wordle-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "WordleArchive",
    title: "All Wordle Answers and Hints (Updated Daily)",
    description:
      "Browse every past Wordle answer with progressive hints. Updated daily with new puzzles. Find any Wordle answer by date.",
    keywords: [
      "wordle answers",
      "wordle archive",
      "past wordle answers",
      "wordle answer history",
      "all wordle answers",
    ],
    locale: locale as Locale,
    path: "/wordle-answer",
    canonicalUrl: "/wordle-answer",
  });
}

export default async function WordleArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getWordlePuzzlesByMonth();
  const allPuzzles = await getAllWordlePuzzles();
  const latestDate = allPuzzles.length > 0 ? allPuzzles[0].printDate : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Wordle Archive", url: `${BASE_URL}/wordle-answer` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All Wordle Answers and Hints",
          description:
            "Complete archive of Wordle answers with progressive hints for every puzzle.",
          url: `${BASE_URL}/wordle-answer`,
        }}
      />

      <ContentHero
        eyebrow="Archive"
        title="All Wordle Answers and Hints"
        description="Browse every past puzzle with progressive hints for all five-letter answers. Updated daily."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <WordleMonthGroup
            key={month.label}
            rangeLabel={month.rangeLabel}
            puzzles={month.puzzles}
            latestDate={latestDate}
          />
        ))}
      </div>

      <div className="mt-10">
        <RelatedLinks
          links={[
            {
              href: "/wordle-answer-today",
              title: "Today's Wordle",
              description: "Hints and answer for today's puzzle.",
            },
            {
              href: "/connections-hint-today",
              title: "Connections hints",
              description: "Today's NYT Connections hints and answers.",
            },
            {
              href: "/strands-hint-today",
              title: "Strands hints",
              description: "Today's NYT Strands hints and answers.",
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
