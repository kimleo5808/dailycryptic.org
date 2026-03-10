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
import WordFinder from "@/components/tools/WordFinder";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-10";

const FAQ_ITEMS = [
  {
    question: "How does the word finder work?",
    answer:
      "Select a word length, then type known letters into their positions. The tool searches a curated dictionary of common English words and shows all matches.",
  },
  {
    question: "What words are included?",
    answer:
      "The dictionary includes thousands of common English words from 3 to 8 letters, curated for crossword relevance. It covers the most frequently used crossword answers.",
  },
  {
    question: "Can I use this for non-cryptic crosswords?",
    answer:
      "Yes. The word finder works for any crossword where you know some letters and their positions. It is not limited to cryptic puzzles.",
  },
  {
    question: "Why is my word not showing up?",
    answer:
      "The dictionary focuses on common words. Very obscure, technical, or archaic words may not be included. The tool is designed for the most useful crossword vocabulary.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrosswordWordFinder",
    title: "Crossword Word Finder — Search by Letter Pattern",
    description:
      "Find crossword answers by entering known letters in their positions. Search thousands of common English words by letter pattern.",
    keywords: [
      "crossword word finder",
      "crossword pattern search",
      "crossword letter pattern",
      "word finder by letters",
      "crossword helper",
    ],
    locale: locale as Locale,
    path: "/crossword-word-finder",
    canonicalUrl: "/crossword-word-finder",
  });
}

export default async function CrosswordWordFinderPage({
  params,
}: {
  params: Params;
}) {
  await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Crossword Word Finder", url: `${BASE_URL}/crossword-word-finder` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Crossword Word Finder — Search by Letter Pattern",
          description:
            "Find crossword answers by entering known letters in their positions. Search thousands of common English words by letter pattern.",
          url: `${BASE_URL}/crossword-word-finder`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Tool"
        title="Crossword Word Finder"
        description="Enter known letters in their positions and find matching words instantly. Works for cryptic crosswords, quick crosswords, and any word puzzle where you know some letters."
      />

      <div className="mt-8 space-y-8">
        <WordFinder />

        <TableOfContents
          items={[
            { href: "#how-to-use", label: "How to use the word finder" },
            { href: "#tips-for-partial-letters", label: "Tips for solving with partial letters" },
            { href: "#common-patterns", label: "Common crossword answer patterns" },
            { href: "#word-finder-faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="How to Use the Word Finder" id="how-to-use">
          <SubHeading>Select the Word Length</SubHeading>
          <BodyText>
            Start by choosing how many letters the answer has. This matches
            the enumeration number at the end of a cryptic clue — for
            example, (5) means a five-letter word.
          </BodyText>
          <SubHeading>Enter Known Letters</SubHeading>
          <BodyText>
            Click on any position and type a letter you already know. Leave
            positions empty for letters you do not know yet. The tool
            updates results instantly as you type.
          </BodyText>
          <SubHeading>Read the Results</SubHeading>
          <BodyText>
            All matching words appear below the input grid. Scan the list
            for words that fit your crossword definition. In a cryptic
            crossword, the answer must satisfy both the definition and the
            wordplay.
          </BodyText>
        </ContentSection>

        <ContentSection title="Tips for Solving with Partial Letters" id="tips-for-partial-letters">
          <CalloutBox type="tip" title="Start with Crossing Letters">
            In grid crosswords, the most reliable known letters come from
            crossing answers you have already solved. Enter those first to
            narrow the field quickly.
          </CalloutBox>
          <SubHeading>Try Multiple Combinations</SubHeading>
          <BodyText>
            If your first pattern produces too many results, add another
            known letter. If it produces zero results, double-check your
            crossing answers — one of them may be wrong.
          </BodyText>
          <SubHeading>Use the Definition as a Filter</SubHeading>
          <BodyText>
            The word finder shows all matching words, but not all of them
            will fit your clue. Use the definition part of the cryptic clue
            to filter the list mentally. The right answer should satisfy
            both the pattern and the meaning.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Crossword Answer Patterns" id="common-patterns">
          <BodyText>
            Certain letter patterns appear frequently in crossword answers.
            Knowing these can help you guess productively even with few
            known letters.
          </BodyText>
          <SubHeading>Vowel-Heavy Words</SubHeading>
          <BodyText>
            Words like AREA, IDEA, ARIA, and ALOE have high vowel density
            and appear often because they create good crossing
            opportunities in grids.
          </BodyText>
          <SubHeading>Common Endings</SubHeading>
          <BodyText>
            Watch for common word endings: -ATE, -INE, -ORE, -ANE, -ILE,
            -OSE, -URE. If you know the last two or three letters, these
            endings can dramatically narrow your search.
          </BodyText>
          <SubHeading>Double Letters</SubHeading>
          <BodyText>
            Words with double letters (OTTER, ALLOY, OCCUR) are useful to
            know because a single confirmed letter can sometimes reveal
            its neighbour.
          </BodyText>
        </ContentSection>

        <ContentSection title="Word Finder FAQ" id="word-finder-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-crossword-solver",
              title: "Cryptic clue solver",
              description:
                "Search by clue text to find answers with full wordplay explanations.",
            },
            {
              href: "/common-crossword-answers",
              title: "Common answers",
              description:
                "See the words that appear most frequently in cryptic crosswords.",
            },
            {
              href: "/cryptic-clue-types",
              title: "Clue types",
              description:
                "Learn how each clue mechanism works to understand the wordplay behind answers.",
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
