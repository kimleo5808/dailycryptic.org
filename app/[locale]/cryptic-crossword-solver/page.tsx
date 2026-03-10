import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ClueSolver from "@/components/tools/ClueSolver";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllMinuteCryptics } from "@/lib/minute-cryptic-data";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-10";

const FAQ_ITEMS = [
  {
    question: "How does the cryptic crossword solver work?",
    answer:
      "It searches through our database of minute cryptic clues and answers. You can search by clue text, answer word, letter count, or known letter pattern.",
  },
  {
    question: "Can I use this for any cryptic crossword?",
    answer:
      "This tool searches our minute cryptic puzzle database specifically. For broader crossword solving, try the Word Finder tool which matches any English word by letter pattern.",
  },
  {
    question: "What does the letter pattern mean?",
    answer:
      "Use letters for known positions and ? for unknown positions. For example, A?E?T would match ALERT (A in position 1, E in position 3, T in position 5).",
  },
  {
    question: "Why are some clue types not showing results?",
    answer:
      "Our database grows over time as new puzzles are published. Some clue types may have fewer entries than others. Check back regularly for new additions.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrypticCrosswordSolver",
    title: "Cryptic Crossword Solver — Search Clues and Answers",
    description:
      "Search cryptic crossword clues by text, answer word, letter count, or pattern. Find solutions with full explanations from our minute cryptic puzzle database.",
    keywords: [
      "cryptic crossword solver",
      "cryptic clue solver",
      "crossword clue finder",
      "cryptic crossword answers",
    ],
    locale: locale as Locale,
    path: "/cryptic-crossword-solver",
    canonicalUrl: "/cryptic-crossword-solver",
  });
}

export default async function CrypticCrosswordSolverPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllMinuteCryptics();
  const solverPuzzles = allPuzzles.map((p) => ({
    clue: p.clue,
    answer: p.answer,
    clueType: p.clueType,
    difficulty: p.difficulty,
    explanation: p.explanation,
    printDate: p.printDate,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Crossword Solver", url: `${BASE_URL}/cryptic-crossword-solver` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Cryptic Crossword Solver — Search Clues and Answers",
          description:
            "Search cryptic crossword clues by text, answer word, letter count, or pattern. Find solutions with full explanations.",
          url: `${BASE_URL}/cryptic-crossword-solver`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Tool"
        title="Cryptic Crossword Solver"
        description="Search our database of cryptic crossword clues by text, answer, letter count, or known letter pattern. Every result includes a full explanation of the wordplay."
      />

      <div className="mt-8 space-y-8">
        <ClueSolver puzzles={solverPuzzles} />

        <TableOfContents
          items={[
            { href: "#how-to-use", label: "How to use this tool" },
            { href: "#search-tips", label: "Search tips" },
            { href: "#understanding-results", label: "Understanding results" },
            { href: "#solver-faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="How to Use This Tool" id="how-to-use">
          <SubHeading>Search by Clue Text</SubHeading>
          <BodyText>
            Type any word or phrase from a cryptic clue to find matching
            entries. This is useful when you remember part of a clue but
            cannot recall the answer.
          </BodyText>
          <SubHeading>Search by Answer</SubHeading>
          <BodyText>
            If you know the answer and want to understand the wordplay,
            type the answer word directly. The tool will show you the
            original clue and its full explanation.
          </BodyText>
          <SubHeading>Filter by Letter Count</SubHeading>
          <BodyText>
            Enter the number of letters to narrow results to answers of a
            specific length. This matches the enumeration number at the end
            of cryptic clues.
          </BodyText>
          <SubHeading>Use Letter Patterns</SubHeading>
          <BodyText>
            If you know some letters, enter them with ? for unknown
            positions. For example, ?A?E? would match CATER, LATER, PAPER,
            and any other 5-letter word with A in position 2 and E in
            position 4.
          </BodyText>
        </ContentSection>

        <ContentSection title="Search Tips" id="search-tips">
          <CalloutBox type="tip" title="Combine Filters for Best Results">
            Use multiple filters together. For example, search for
            "mixed" with letter count 5 to find all 5-letter anagram
            answers that use "mixed" as an indicator.
          </CalloutBox>
          <BodyText>
            The search is case-insensitive and ignores punctuation. You
            can search for indicator words like "broken," "around," or
            "sounds like" to find clues that use specific mechanisms.
          </BodyText>
        </ContentSection>

        <ContentSection title="Understanding Results" id="understanding-results">
          <BodyText>
            Each result shows the original clue text, the answer, the clue
            type, difficulty level, and publication date. Click "Show
            explanation" to see a full breakdown of how the wordplay
            produces the answer.
          </BodyText>
          <SubHeading>Learning from Explanations</SubHeading>
          <BodyText>
            The explanations are the most valuable part of each result.
            They show you exactly how the setter constructed the clue and
            what each element contributes. Use them to build your
            understanding of cryptic clue mechanisms.
          </BodyText>
        </ContentSection>

        <ContentSection title="Cryptic Crossword Solver FAQ" id="solver-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/crossword-word-finder",
              title: "Word Finder",
              description:
                "Search for any English word by letter pattern — not limited to our puzzle database.",
            },
            {
              href: "/cryptic-clue-types",
              title: "Clue types",
              description:
                "Learn how each clue mechanism works with detailed guides and examples.",
            },
            {
              href: "/cryptic-abbreviations",
              title: "Abbreviations",
              description:
                "Look up the letter codes that appear in charade and container wordplay.",
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
