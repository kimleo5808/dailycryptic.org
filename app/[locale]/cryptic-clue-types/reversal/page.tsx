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
    question: "What is a reversal clue?",
    answer:
      "A reversal clue asks you to write a word or phrase backwards to produce the answer. The clue contains a reversal indicator and a source word that, when reversed, gives you the solution.",
  },
  {
    question: "Do across and down clues use different reversal indicators?",
    answer:
      "Yes, in grid crosswords. Across clues use horizontal language like back or returning, while down clues use vertical language like up or rising. In single-clue puzzles, the phrasing is usually unambiguous.",
  },
  {
    question: "Can reversal be combined with other clue types?",
    answer:
      "Yes. Reversal is often combined with charade or container operations. For example, a clue might reverse one part before joining it with another.",
  },
  {
    question: "How do I know which word to reverse?",
    answer:
      "The indicator usually points to the adjacent word or phrase. Test by reversing the candidate and checking whether the result matches the definition and the enumeration.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "ReversalClues",
    title: "Reversal Clues: When Words Read Backwards in Cryptic Crosswords",
    description:
      "Learn how reversal clues work in cryptic crosswords, how to spot direction indicators, and how to solve them step by step.",
    keywords: [
      "reversal clues",
      "reversal cryptic clues",
      "reversal indicators",
      "how to solve reversal clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/reversal",
    canonicalUrl: "/cryptic-clue-types/reversal",
  });
}

export default async function ReversalCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("reversal", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Reversal Clues", url: `${BASE_URL}/cryptic-clue-types/reversal` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Reversal Clues: When Words Read Backwards in Cryptic Crosswords",
          description:
            "Learn how reversal clues work in cryptic crosswords, how to spot direction indicators, and how to solve them step by step.",
          url: `${BASE_URL}/cryptic-clue-types/reversal`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Reversal Clues"
        description="A reversal clue asks you to read a word or phrase backwards to find the answer. These clues train directional thinking and reward careful attention to indicator language."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-reversal-clue", label: "What is a reversal clue?" },
            { href: "#how-reversal-clues-work", label: "How reversal clues work" },
            { href: "#across-vs-down-indicators", label: "Across vs down indicators" },
            { href: "#common-reversal-indicators", label: "Common reversal indicators" },
            { href: "#solve-reversals-step-by-step", label: "Step-by-step solving method" },
            { href: "#real-reversal-examples", label: "Real reversal examples" },
            { href: "#reversals-in-compound-clues", label: "Reversals in compound clues" },
            { href: "#reversal-faq", label: "Reversal FAQ" },
          ]}
        />

        <ContentSection title="What Is a Reversal Clue?" id="what-is-a-reversal-clue">
          <BodyText>
            A reversal clue takes a word or phrase and reads it backwards to
            produce the answer. The operation is simple — STAR becomes RATS,
            LIVE becomes EVIL, DRAWER becomes REWARD — but the challenge
            lies in identifying which word to reverse and confirming that
            the result satisfies the definition.
          </BodyText>
          <SubHeading>A Small Operation with Big Impact</SubHeading>
          <BodyText>
            Reversal is one of the simplest letter operations in cryptic
            crosswords, yet it produces surprisingly effective misdirection.
            The clue surface often reads naturally, hiding the fact that you
            need to flip a specific word. That combination of simplicity and
            subtlety makes reversals excellent practice for careful parsing.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Reversal Clues Work" id="how-reversal-clues-work">
          <BodyText>
            Every reversal clue has three components: a definition, a source
            word or phrase, and a reversal indicator. The indicator tells you
            to reverse the source, and the reversed string should match the
            answer and satisfy the definition.
          </BodyText>
          <CalloutBox type="highlight" title="The Core Pattern">
            Definition + source word + reversal indicator = answer. The
            source word, read backwards, gives you a word that matches the
            definition. All three elements must be present for the clue to
            be fair.
          </CalloutBox>
          <BodyText>
            What makes reversals elegant is that both the source word and
            the answer are real words. The setter has found a pair of words
            that are letter-reverses of each other, then constructed a clue
            surface that defines the answer while also pointing to the
            source.
          </BodyText>
        </ContentSection>

        <ContentSection title="Across vs Down Indicators" id="across-vs-down-indicators">
          <SubHeading>Horizontal Reversal (Across Clues)</SubHeading>
          <BodyText>
            In grid crosswords, across clues use horizontal reversal
            language. Words like back, returning, reflected, and westward
            suggest reading from right to left. These indicators make sense
            spatially because across answers read left to right, so
            reversing them means going back.
          </BodyText>
          <SubHeading>Vertical Reversal (Down Clues)</SubHeading>
          <BodyText>
            Down clues use vertical language instead. Words like up, rising,
            climbing, overturned, and ascending tell you to read the source
            from bottom to top. This directional distinction is unique to
            reversal clues and does not apply to other clue families.
          </BodyText>
          <CalloutBox type="tip" title="In Minute Cryptic Puzzles">
            Since minute cryptic clues are standalone rather than grid-based,
            the indicator phrasing usually makes the reversal direction
            unambiguous. But understanding the across/down distinction helps
            when you move to full grid puzzles.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Common Reversal Indicators" id="common-reversal-indicators">
          <BodyText>
            Reversal indicators suggest backward movement, turning, or
            returning. The specific vocabulary often depends on the clue
            direction in a grid.
          </BodyText>
          <SubHeading>General and Across Indicators</SubHeading>
          <IndicatorTagList
            tags={["back", "returning", "reversed", "reflected", "turned around", "going west", "from the east", "recalled", "brought back"]}
            color="orange"
          />
          <SubHeading>Down-Clue Indicators</SubHeading>
          <IndicatorTagList
            tags={["up", "rising", "climbing", "overturned", "ascending", "raised", "lifted", "upended", "going north"]}
            color="orange"
          />
          <BodyText>
            The key habit is to read the indicator literally and ask what
            direction it implies. If the language suggests going backward or
            upward, test a reversal before trying other mechanisms.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Step-by-Step Method for Solving Reversal Clues" id="solve-reversals-step-by-step">
          <StepList
            items={[
              {
                title: "Find the Reversal Indicator",
                description:
                  "Look for a word suggesting backward movement, returning, or flipping. Confirm it is grammatically acting on the adjacent word or phrase.",
              },
              {
                title: "Identify the Source Word",
                description:
                  "The word or phrase being reversed is usually adjacent to the indicator. It should be a real word or a recognizable abbreviation.",
              },
              {
                title: "Reverse the Letters",
                description:
                  "Write the source word backwards. Check that the result is a valid English word with the correct letter count.",
              },
              {
                title: "Locate the Definition",
                description:
                  "The definition is at the other end of the clue. It should point to the reversed word cleanly and independently.",
              },
              {
                title: "Verify the Full Parse",
                description:
                  "Confirm that the indicator, source, reversal, and definition all work together. If any element feels forced, reconsider your parse.",
              },
            ]}
          />
        </ContentSection>

        {puzzles.length > 0 && (
          <ExamplePuzzleGrid
            id="real-reversal-examples"
            puzzles={puzzles}
            title="Real Reversal Clue Examples"
            intro="These examples show how reversal clues work in real minute cryptic puzzles. Identify the source word, reverse it, and verify the definition confirms the answer."
          />
        )}

        <ContentSection title="Reversals in Compound Clues" id="reversals-in-compound-clues">
          <BodyText>
            Reversal often appears as one operation inside a larger clue.
            A charade clue might reverse one of its parts before joining it
            with another. A container clue might reverse the inner or outer
            component. When reversal is part of a compound operation, the
            indicator still needs to be present and it still points to the
            specific piece being reversed.
          </BodyText>
          <CalloutBox type="tip" title="Watch for Partial Reversals">
            Not every reversal clue reverses the entire answer. Some clues
            reverse only one component and then combine it with other parts.
            Read the indicator carefully to determine its scope — it usually
            acts on the word or phrase immediately adjacent to it.
          </CalloutBox>
          <BodyText>
            This is why understanding reversal as a standalone operation is
            valuable even if you encounter it most often in mixed clues.
            The same recognition and verification skills apply whether the
            reversal is the only operation or one of several.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Reversal Mistakes" id="common-reversal-mistakes">
          <BodyText>
            The most common error is reversing the wrong word. If the clue
            contains several short words, beginners sometimes try reversing
            each one until something fits. A more reliable approach is to
            let the indicator guide you — it usually points to the word or
            phrase immediately adjacent to it.
          </BodyText>
          <BodyText>
            Another common mistake is failing to distinguish reversal from
            anagram. Both involve letter manipulation, but reversal
            preserves the exact letter order (just flipped), while anagrams
            allow any rearrangement. If the indicator suggests backward
            movement rather than disorder, reversal is more likely.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Reversal Clues" id="practice-reversal-clues">
          <SubHeading>Build Reversal Instinct</SubHeading>
          <BodyText>
            Practice by looking for common reversible word pairs in English:
            STOP/POTS, LOOP/POOL, PART/TRAP, WARD/DRAW. Once you start
            noticing these pairs naturally, reversal clues become much
            easier to spot and solve.
          </BodyText>
          <SubHeading>Mix with Other Types</SubHeading>
          <BodyText>
            After building basic reversal confidence, practice in mixed sets
            where reversals appear alongside anagrams and charades. This
            trains you to distinguish between letter manipulation types
            based on indicator language rather than expectation.
          </BodyText>
        </ContentSection>

        <ContentSection title="Reversal Clue FAQ" id="reversal-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/hidden-word",
              title: "Hidden word clues",
              description:
                "Compare reversals with hidden words, another letter-extraction clue family.",
            },
            {
              href: "/cryptic-clue-types/anagram",
              title: "Anagram clues",
              description:
                "Contrast reversal with anagram — both manipulate letters but in different ways.",
            },
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "See how reversals fit into the full set of cryptic clue families.",
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
