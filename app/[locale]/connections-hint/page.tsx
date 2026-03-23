import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ConnectionsMonthGroup from "@/components/connections/ConnectionsMonthGroup";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  collectionPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getConnectionsPuzzlesByMonth,
  getAllConnectionsPuzzles,
} from "@/lib/connections-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "ConnectionsHintArchive",
    title: "All NYT Connections Hints and Answers — Full Archive",
    description:
      "Browse every past NYT Connections puzzle with hints and answers. Organised by month with progressive clues for all four color groups.",
    keywords: [
      "connections hint archive",
      "nyt connections answers archive",
      "past connections puzzles",
      "connections hint history",
    ],
    locale: locale as Locale,
    path: "/connections-hint",
    canonicalUrl: "/connections-hint",
  });
}

export default async function ConnectionsHintArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getConnectionsPuzzlesByMonth();
  const allPuzzles = await getAllConnectionsPuzzles();
  const latestId = allPuzzles.length > 0 ? allPuzzles[0].id : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Hints Archive",
            url: `${BASE_URL}/connections-hint`,
          },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "NYT Connections Hints Archive",
          description:
            "Browse every past NYT Connections puzzle with hints and answers.",
          url: `${BASE_URL}/connections-hint`,
        })}
      />

      <ContentHero
        eyebrow="Archive"
        title="All NYT Connections Hints and Answers"
        description="Browse every past puzzle with progressive hints for all four color groups. Updated daily."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <ConnectionsMonthGroup
            key={month.label}
            rangeLabel={month.rangeLabel}
            puzzles={month.puzzles}
            latestId={latestId}
          />
        ))}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/connections-hint-today",
              title: "Today's Connections hints",
              description:
                "Get hints and answers for today's puzzle.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description:
                "Solve a daily one-clue cryptic crossword with hints.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description:
                "Unscramble letters and find every possible word.",
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
