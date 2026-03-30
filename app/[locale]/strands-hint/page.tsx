import {
  ContentHero,
  RelatedLinks,
} from "@/components/minute-cryptic-content/ContentBlocks";
import StrandsMonthGroup from "@/components/strands/StrandsMonthGroup";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  collectionPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getStrandsPuzzlesByMonth,
  getAllStrandsPuzzles,
} from "@/lib/strands-data";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "StrandsHintArchive",
    title: "All NYT Strands Hints, Spangrams and Answers — Full Archive",
    description:
      "Browse hints, spangrams, and answers for every past NYT Strands puzzle. Organised by month with progressive clue reveals. Updated daily.",
    keywords: [
      "strands hint archive",
      "nyt strands answers archive",
      "past strands puzzles",
      "strands hint history",
      "strands spangram archive",
    ],
    locale: locale as Locale,
    path: "/strands-hint",
    canonicalUrl: "/strands-hint",
  });
}

export default async function StrandsHintArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const months = await getStrandsPuzzlesByMonth();
  const allPuzzles = await getAllStrandsPuzzles();
  const latestId = allPuzzles.length > 0 ? allPuzzles[0].id : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Strands Hints Archive",
            url: `${BASE_URL}/strands-hint`,
          },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "NYT Strands Hints Archive",
          description:
            "Browse hints, spangrams, and answers for every past NYT Strands puzzle.",
          url: `${BASE_URL}/strands-hint`,
        })}
      />

      <ContentHero
        eyebrow="Archive"
        title="All NYT Strands Hints, Spangrams and Answers"
        description="Every daily Strands puzzle with progressive hints. Updated automatically each day."
      />

      <div className="mt-8 space-y-10">
        {months.map((month) => (
          <StrandsMonthGroup
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
              href: "/strands-hint-today",
              title: "Today's Strands hints",
              description:
                "Get hints, spangram clues, and answers for today's puzzle.",
            },
            {
              href: "/connections-hint-today",
              title: "Today's Connections hints",
              description:
                "Progressive hints for all four colour groups in today's NYT Connections.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description:
                "Solve a daily one-clue cryptic crossword with hints.",
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
