import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  ExamplePuzzleGrid,
  IndicatorTagList,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getExampleMinuteCrypticsByClueType } from "@/lib/minute-cryptic-data";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-10";

const FAQ_ITEMS = [
  {
    question: "What is a deletion clue?",
    answer:
      "A deletion clue removes one or more letters from a source word to produce the answer. The indicator tells you which letters to remove — typically the first, last, or middle letters.",
  },
  {
    question: "What is the difference between beheadment and curtailment?",
    answer:
      "Beheadment removes the first letter of a word. Curtailment removes the last letter. Both are specific forms of deletion with their own indicator language.",
  },
  {
    question: "Can deletion clues remove more than one letter?",
    answer:
      "Yes. Some clues remove multiple letters, though single-letter deletion is most common. The indicator language and enumeration help you determine how many letters to remove.",
  },
  {
    question: "How do I know which word to delete from?",
    answer:
      "The indicator usually points to the adjacent word. The remaining letters after deletion should form a valid word matching the definition and the enumeration.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "DeletionClues",
    title: "Deletion Clues: Removing Letters to Find the Answer",
    description:
      "Learn how deletion clues work in cryptic crosswords, including beheadment, curtailment, and internal deletion, with indicators and examples.",
    keywords: [
      "deletion clues",
      "deletion cryptic clues",
      "beheadment clues",
      "curtailment clues",
      "how to solve deletion clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/deletion",
    canonicalUrl: "/cryptic-clue-types/deletion",
  });
}

export default async function DeletionCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("deletion", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Deletion Clues", url: `${BASE_URL}/cryptic-clue-types/deletion` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Deletion Clues: Removing Letters to Find the Answer",
          description:
            "Learn how deletion clues work in cryptic crosswords, including beheadment, curtailment, and internal deletion, with indicators and examples.",
          url: `${BASE_URL}/cryptic-clue-types/deletion`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Deletion Clues"
        description="Deletion clues remove specific letters from a source word to produce the answer. They come in several forms — beheadment, curtailment, and internal deletion — each with its own indicator language and solving approach."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-deletion-clue", label: "What is a deletion clue?" },
            { href: "#types-of-deletion", label: "Types of deletion" },
            { href: "#beheadment-indicators", label: "Beheadment indicators" },
            { href: "#curtailment-indicators", label: "Curtailment indicators" },
            { href: "#internal-deletion-indicators", label: "Internal deletion indicators" },
            { href: "#solve-deletions-step-by-step", label: "Step-by-step solving method" },
            { href: "#real-deletion-examples", label: "Real deletion examples" },
            { href: "#common-deletion-mistakes", label: "Common mistakes" },
            { href: "#deletion-faq", label: "Deletion FAQ" },
          ]}
        />

        <ContentSection title="What Is a Deletion Clue?" id="what-is-a-deletion-clue">
          <BodyText>
            A deletion clue takes a word and removes one or more letters to
            produce the answer. The clue contains the source word (or a
            synonym that leads to it), a deletion indicator that tells you
            which letters to remove, and a definition of the final answer.
          </BodyText>
          <SubHeading>Small Changes, Real Words</SubHeading>
          <BodyText>
            Deletion clues are elegant because a single letter change can
            turn one real word into another. WHEAT without its first letter
            becomes HEAT. PLANET without its last letter becomes PLANE.
            CHARIOT without its middle becomes CHART. The setter finds these
            letter relationships and wraps them in a natural-sounding clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="Types of Deletion" id="types-of-deletion">
          <BodyText>
            Deletion clues fall into three main categories based on which
            letters are removed. Each category has its own indicator
            vocabulary.
          </BodyText>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-sm font-bold text-foreground">Beheadment</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Removes the first letter. BLAND becomes LAND. The indicator
                suggests losing a head or top.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-sm font-bold text-foreground">Curtailment</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Removes the last letter. BRAND becomes BRAN. The indicator
                suggests cutting short or being endless.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-sm font-bold text-foreground">Internal Deletion</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Removes a middle letter or letters. FLAIR becomes FAIR. The
                indicator suggests losing heart or being gutted.
              </p>
            </div>
          </div>
          <CalloutBox type="tip" title="The Indicator Tells You Which Type">
            You do not need to guess which deletion type applies. The
            indicator language almost always makes it clear whether you are
            losing the first letter, the last letter, or something from the
            middle.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Beheadment Indicators" id="beheadment-indicators">
          <BodyText>
            Beheadment indicators suggest removing the first letter, the
            head, or the top of a word. These are among the most vivid and
            memorable indicator words in cryptic crosswords.
          </BodyText>
          <IndicatorTagList
            tags={["headless", "topless", "beheaded", "losing head", "first off", "decapitated", "leaderless", "losing first"]}
            color="purple"
          />
          <BodyText>
            The key recognition pattern is any word that suggests removing
            the beginning, front, or top. In a grid crossword down clue,
            "topless" works especially well because the first letter is
            literally at the top.
          </BodyText>
        </ContentSection>

        <ContentSection title="Curtailment Indicators" id="curtailment-indicators">
          <BodyText>
            Curtailment indicators suggest removing the last letter, the
            tail, or the ending of a word.
          </BodyText>
          <IndicatorTagList
            tags={["endless", "curtailed", "unfinished", "cut short", "nearly", "almost", "most of", "not quite", "tailless", "docked"]}
            color="purple"
          />
          <SubHeading>Nearly and Almost</SubHeading>
          <BodyText>
            Words like "nearly" and "almost" are particularly effective
            curtailment indicators because they suggest something that is
            not quite complete. When you see these words modifying another
            word in a clue, consider whether dropping the last letter
            produces the answer.
          </BodyText>
        </ContentSection>

        <ContentSection title="Internal Deletion Indicators" id="internal-deletion-indicators">
          <BodyText>
            Internal deletion indicators suggest removing the middle,
            heart, or core of a word. These are less common than beheadment
            or curtailment but produce distinctive and often surprising
            answers.
          </BodyText>
          <IndicatorTagList
            tags={["heartless", "gutted", "coreless", "disheartened", "hollow", "emptied", "losing heart", "without core"]}
            color="purple"
          />
          <SubHeading>How Much Gets Removed?</SubHeading>
          <BodyText>
            Internal deletion usually removes the central letter of an odd-
            length word, or sometimes a larger chunk. The enumeration helps
            you determine how many letters were removed. If the source word
            has seven letters and the answer has five, you know two internal
            letters were deleted.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Step-by-Step Method for Solving Deletion Clues" id="solve-deletions-step-by-step">
          <StepList
            items={[
              {
                title: "Find the Deletion Indicator",
                description:
                  "Look for a word suggesting removal — headless, endless, heartless, or similar. This tells you a deletion is happening and often which type.",
              },
              {
                title: "Determine the Deletion Type",
                description:
                  "Is the indicator suggesting beheadment (first letter), curtailment (last letter), or internal deletion (middle letters)?",
              },
              {
                title: "Identify the Source Word",
                description:
                  "Find the word adjacent to the indicator that the deletion applies to. It may be given directly or as a synonym you need to find first.",
              },
              {
                title: "Perform the Deletion",
                description:
                  "Remove the indicated letter or letters. Check that the remaining string is a valid English word matching the enumeration.",
              },
              {
                title: "Verify the Definition",
                description:
                  "Confirm that the result matches the definition at the other end of the clue. Both the deletion logic and the meaning must be satisfied.",
              },
            ]}
          />
        </ContentSection>

        {puzzles.length > 0 && (
          <ExamplePuzzleGrid
            id="real-deletion-examples"
            puzzles={puzzles}
            title="Real Deletion Clue Examples"
            intro="These examples show how deletion clues work in real minute cryptic puzzles. Identify the deletion type, find the source word, remove the indicated letters, and verify the definition."
          />
        )}

        <ContentSection title="Deletion in Compound Clues" id="deletion-in-compound-clues">
          <BodyText>
            Deletion often appears as part of a larger clue mechanism. A
            charade clue might delete a letter from one component before
            joining it with others. A container clue might use a truncated
            word as the inner or outer part. When deletion is combined with
            other operations, the deletion indicator still applies to its
            adjacent word specifically.
          </BodyText>
          <CalloutBox type="tip" title="Deletion + Charade Is Common">
            One of the most frequent combinations is deletion followed by
            charade assembly. For example, a clue might take a word, remove
            its last letter, and then add another component to form the
            final answer. Watch for this pattern when a deletion alone does
            not produce the right letter count.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Common Deletion Mistakes" id="common-deletion-mistakes">
          <CalloutBox type="warning" title="Mistakes to Avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Deleting from the wrong position (confusing beheadment with curtailment)</li>
              <li>Using the wrong source word — especially when a synonym is needed first</li>
              <li>Removing too many or too few letters without checking the enumeration</li>
              <li>Treating a deletion clue as an anagram because both involve letter changes</li>
            </ul>
          </CalloutBox>
          <SubHeading>Deletion vs Anagram</SubHeading>
          <BodyText>
            Deletion and anagram clues both change a word, but in different
            ways. An anagram rearranges all the letters. A deletion removes
            specific letters and keeps the rest in order. The indicator
            language is the clearest way to distinguish them: disorder words
            signal anagrams, while removal words signal deletions.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Deletion Clues" id="practice-deletion-clues">
          <SubHeading>Study by Deletion Type</SubHeading>
          <BodyText>
            Start by practicing beheadment clues separately, then move to
            curtailment, and finally internal deletion. This lets you build
            recognition for each indicator vocabulary before mixing them.
            Once all three subtypes feel familiar, practice in mixed sets.
          </BodyText>
          <SubHeading>Build a Mental Dictionary</SubHeading>
          <BodyText>
            Deletion clues become easier when you recognize common deletion
            pairs: WHEAT/HEAT, BLAND/LAND, BRAND/BRAN, PLANE/PLAN,
            FLAIR/FAIR. The more word-minus-letter pairs you know, the
            faster you can test deletion routes when solving.
          </BodyText>
        </ContentSection>

        <ContentSection title="Deletion Clue FAQ" id="deletion-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/anagram",
              title: "Anagram clues",
              description:
                "Compare deletion with anagram — both change words but through different operations.",
            },
            {
              href: "/cryptic-clue-types/container",
              title: "Container clues",
              description:
                "Learn how insertion works, the structural opposite of deletion.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's clue",
              description:
                "Practice your deletion skills on today's minute cryptic puzzle.",
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
