import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getArchiveMinuteCryptics,
  getArchiveMinuteCrypticCount,
} from "@/lib/minute-cryptic-data";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { CLUE_TYPE_TOPICS } from "@/lib/minute-cryptic-topics";
import { MinuteCrypticClueType } from "@/types/minute-cryptic";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "Do solutions contain spoilers?",
    answer:
      "Yes. Each solution page reveals the answer and a full breakdown of the wordplay. Try the puzzle first before reading the solution.",
  },
  {
    question: "How quickly are solutions published?",
    answer:
      "Solutions are available the same day the clue is published, so you can review the answer and explanation immediately after attempting the puzzle.",
  },
  {
    question: "Can I use solutions to learn cryptic clue types?",
    answer:
      "Absolutely. Each solution explains the clue type, wordplay mechanism, and definition, making them an effective study resource for beginners.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = await getArchiveMinuteCrypticCount();

  return constructMetadata({
    page: "DailySolution",
    title: "Daily Cryptic Solutions — Answer Breakdowns for Every Clue",
    description: `Browse ${count} daily cryptic solutions with full answer breakdowns, wordplay explanations, and clue type analysis. Learn how each minute cryptic clue works.`,
    keywords: [
      "daily cryptic solutions",
      "minute cryptic answers",
      "cryptic clue explanations",
      "cryptic crossword solutions",
      "daily cryptic answer breakdown",
    ],
    locale: locale as Locale,
    path: `/daily-solution`,
    canonicalUrl: `/daily-solution`,
  });
}

export default async function DailySolutionIndexPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getArchiveMinuteCryptics();
  const count = await getArchiveMinuteCrypticCount();

  const groupedByMonth = allPuzzles.reduce<Record<string, typeof allPuzzles>>(
    (acc, puzzle) => {
      const month = puzzle.printDate.slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(puzzle);
      return acc;
    },
    {}
  );

  const months = Object.keys(groupedByMonth).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Daily Solutions", url: `${BASE_URL}/daily-solution` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Daily Cryptic Solutions",
          description: `Browse ${count} daily cryptic solutions with full answer breakdowns and wordplay explanations.`,
          url: `${BASE_URL}/daily-solution`,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Solutions"
        title="Daily Cryptic Solutions"
        description={`Full answer breakdowns for ${count} minute cryptic clues. Each solution explains the definition, wordplay mechanism, and clue type so you can learn from every puzzle.`}
      />

      <div className="mt-8 space-y-8">
        {/* Month jump bar */}
        <div className="flex flex-wrap gap-2">
          {months.map((month) => (
            <Link
              key={month}
              href={`#month-${month}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              {dayjs(`${month}-01`).format("MMM YYYY")}
            </Link>
          ))}
        </div>

        {/* Solutions by month */}
        {months.map((month) => (
          <section
            key={month}
            id={`month-${month}`}
            className="scroll-mt-24"
          >
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
              {dayjs(`${month}-01`).format("MMMM YYYY")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupedByMonth[month].map((puzzle) => {
                const clueTypeTopic =
                  CLUE_TYPE_TOPICS[
                    puzzle.clueType as MinuteCrypticClueType
                  ];
                return (
                  <Link
                    key={puzzle.id}
                    href={`/daily-solution/${puzzle.printDate}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                        #{puzzle.id}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {clueTypeTopic?.shortLabel ?? puzzle.clueType}
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-bold text-foreground">
                      {puzzle.clue}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {dayjs(puzzle.printDate).format("MMM D, YYYY")} |{" "}
                      {puzzle.difficulty}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                      View solution
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <ContentSection title="About Daily Solutions" id="about">
          <BodyText>
            Every minute cryptic clue published on Daily Cryptic has a
            corresponding solution page. Each solution reveals the answer and
            provides a detailed breakdown of how the wordplay produces it,
            including the clue type, indicator words, and definition.
          </BodyText>
          <BodyText>
            Use these solution pages to study after attempting a puzzle, or
            browse them to learn how different clue types work in practice.
            Solutions link to the relevant clue type guide and suggest similar
            clues for further practice.
          </BodyText>
        </ContentSection>

        <SimpleFaq items={FAQ_ITEMS} />

        <RelatedLinks
          links={[
            {
              href: "/minute-cryptic-today",
              title: "Today's Clue",
              description: "Solve today's minute cryptic puzzle first.",
            },
            {
              href: "/minute-cryptic",
              title: "Archive",
              description:
                "Browse all past clues by date, type, or difficulty.",
            },
            {
              href: "/cryptic-clue-types",
              title: "Clue Types",
              description: "Learn about all 8 cryptic clue families.",
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
