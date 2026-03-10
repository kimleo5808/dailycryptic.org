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
const CONTENT_PUBLISHED_AT = "2026-03-09";

const FAQ_ITEMS = [
  {
    question: "What is an anagram indicator?",
    answer:
      "An anagram indicator is a word that signals the letters should be rearranged, such as mixed, altered, wild, or broken.",
  },
  {
    question: "How do I know which letters to rearrange?",
    answer:
      "The fodder is usually the word or phrase attached to the indicator. You confirm it by checking whether its letters match the answer length exactly.",
  },
  {
    question: "Are anagram clues always easy?",
    answer:
      "No. They are usually easier to verify, but a clue can still be difficult if the definition is subtle or the fodder is less obvious.",
  },
  {
    question: "Why does my guessed word fit the letters but still fail?",
    answer:
      "Because the answer also has to match the definition fairly. A valid anagram solve needs both the letter logic and the meaning logic.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "AnagramClues",
    title: "Anagram Clues in Cryptic Crosswords: How to Spot and Solve Them",
    description:
      "Learn how anagram clues work in cryptic crosswords, how to spot indicators, and how to solve them step by step.",
    keywords: [
      "anagram clues",
      "anagram cryptic clues",
      "anagram clue indicators",
      "how to solve anagram clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/anagram",
    canonicalUrl: "/cryptic-clue-types/anagram",
  });
}

export default async function AnagramCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("anagram", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Anagram Clues", url: `${BASE_URL}/cryptic-clue-types/anagram` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Anagram Clues in Cryptic Crosswords: How to Spot and Solve Them",
          description:
            "Learn how anagram clues work in cryptic crosswords, how to spot indicators, and how to solve them step by step.",
          url: `${BASE_URL}/cryptic-clue-types/anagram`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Anagram Clues"
        description="Anagram clues are one of the best places to start in cryptic crosswords. They give you a letter set, a signal that the letters should move, and a definition that confirms the final answer."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-an-anagram-clue", label: "What is an anagram clue?" },
            { href: "#why-anagrams-are-good-for-beginners", label: "Why anagrams are good for beginners" },
            { href: "#spot-anagram-indicators", label: "How to spot anagram indicators" },
            { href: "#find-the-fodder", label: "How to find the fodder" },
            { href: "#solve-anagrams-step-by-step", label: "Step-by-step solving method" },
            { href: "#real-anagram-examples", label: "Real anagram examples" },
            { href: "#common-anagram-mistakes", label: "Common anagram mistakes" },
            { href: "#anagram-faq", label: "Anagram FAQ" },
          ]}
        />

        <ContentSection title="What Is an Anagram Clue?" id="what-is-an-anagram-clue">
          <BodyText>
            An anagram clue asks you to rearrange a set of letters into the
            final answer. In cryptic language, the source letters are usually
            called fodder. The clue also contains an indicator that tells you
            those letters are unstable or should be changed in some way.
          </BodyText>
          <SubHeading>Why the Structure Is Visible</SubHeading>
          <BodyText>
            What makes anagram clues useful for beginners is that the structure
            is visible once you know what to look for. You can identify the
            indicator, isolate the fodder, count the letters, and then test the
            result against the definition — four independent checks in sequence.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Anagram Clues Are Good for Beginners" id="why-anagrams-are-good-for-beginners">
          <SubHeading>Built-In Letter Discipline</SubHeading>
          <BodyText>
            Anagram clues teach letter discipline quickly. If the fodder has
            five letters, your answer must also have five letters. That creates
            a reliable checking habit and reduces vague guessing.
          </BodyText>
          <SubHeading>Multiple Ways to Verify</SubHeading>
          <BodyText>
            Beginners often improve fast on anagrams because the clue offers
            multiple ways to verify a candidate answer — indicator, fodder count,
            definition match. That kind of redundancy is valuable when you are
            still learning what cryptic proof actually feels like.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Spot Anagram Indicators" id="spot-anagram-indicators">
          <BodyText>
            Anagram indicators are words that suggest change, movement,
            disorder, or mixing. These are not magical words on their own, but
            they are strong signals that the adjacent letters may need to be
            rebuilt.
          </BodyText>
          <IndicatorTagList
            tags={["mixed", "wild", "altered", "broken", "scrambled", "arranged", "confused", "upset", "chaotic", "disturbed", "disordered", "anew"]}
            color="blue"
          />
          <SubHeading>Context Is Everything</SubHeading>
          <BodyText>
            The important habit is context. Not every energetic word is really
            serving as an indicator in a given clue. Ask whether the clue reads
            as if one phrase is being transformed into another.
          </BodyText>
          <BodyText>
            This is why many anagram lessons fail beginners: they teach long
            indicator lists without showing how the list interacts with clue
            grammar. A word only functions as an indicator when it actually
            directs a letter transformation inside that clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Find the Fodder" id="find-the-fodder">
          <BodyText>
            Fodder means the letters that will be rearranged. Once you suspect
            an anagram clue, your next task is to isolate the exact letter pool.
          </BodyText>
          <SubHeading>The Most Common Beginner Error</SubHeading>
          <BodyText>
            Many beginners make mistakes here. They include a nearby word that
            does not belong, or drop a letter because the answer they want
            almost works. The fix is strict counting: take the candidate fodder,
            normalize the letters, and compare its length to the answer length.
            If the numbers do not match, the parse is wrong.
          </BodyText>
          <CalloutBox type="warning" title="No Borrowing Allowed">
            If the clue only gives you a certain letter set, you are not allowed
            to silently borrow from nearby words or ignore inconvenient letters.
            Precision here prevents almost every avoidable near miss.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="A Step-by-Step Method for Solving Anagram Clues" id="solve-anagrams-step-by-step">
          <StepList
            items={[
              {
                title: "Find the Indicator",
                description:
                  "Look for a word suggesting change, disorder, or movement. Confirm it is grammatically acting on the adjacent letter group.",
              },
              {
                title: "Collect the Fodder Letters",
                description:
                  "Isolate the exact letter pool the indicator is pointing at. Do not add or remove any letters.",
              },
              {
                title: "Apply the Answer Length as a Hard Constraint",
                description:
                  "Count the fodder letters and confirm they match the enumeration. If not, your fodder boundary is wrong.",
              },
              {
                title: "Build Possible Outputs",
                description:
                  "Rearrange the letters to find valid English words that fit the count.",
              },
              {
                title: "Match the Definition",
                description:
                  "Choose the candidate that matches the direct definition side of the clue. Letter logic alone is not a complete solve.",
              },
            ]}
          />
          <SubHeading>The Final Definition Check</SubHeading>
          <BodyText>
            Many words can be built from a given letter pool. The clue is only
            solved when one of those words also fits the direct meaning side
            cleanly. This final check is what turns an anagram attempt into a
            complete solve.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Definition Still Matters in Anagram Clues" id="definition-still-matters">
          <BodyText>
            Because anagram clues often feel mechanically generous, beginners
            sometimes forget that they are still cryptic clues, not letter
            games. The clue writer is not asking you to produce any valid word
            from the letters — the writer is asking for the one word that also
            satisfies the definition.
          </BodyText>
          <CalloutBox type="highlight" title="The Deeper Lesson">
            Anagram practice trains you to treat definition as proof, not as a
            loose suggestion. Once that habit sets in, your solving quality
            improves across all clue types — not just anagrams.
          </CalloutBox>
        </ContentSection>

        <ExamplePuzzleGrid
          id="real-anagram-examples"
          puzzles={puzzles}
          title="Real Anagram Clue Examples"
          intro="These examples show how anagram clues work in real minute cryptic puzzles. For each one, identify the indicator, isolate the fodder, and make sure the definition confirms the final answer."
        />

        <ContentSection title="Common Anagram Mistakes" id="common-anagram-mistakes">
          <CalloutBox type="warning" title="Mistakes to Avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Ignoring the definition once the letters seem to fit</li>
              <li>Stretching the fodder by adding or dropping unjustified letters</li>
              <li>Stopping at a plausible answer instead of a proven one</li>
            </ul>
          </CalloutBox>
          <SubHeading>The Full Parse Out Loud</SubHeading>
          <BodyText>
            A useful correction is to force yourself to say the full parse out
            loud: indicator → fodder → answer → definition. If any one of those
            elements feels vague while you say it, the clue probably needs more
            work before you submit.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Anagram Clues Efficiently" id="practice-anagram-clues">
          <SubHeading>Small Batches, Clear Review</SubHeading>
          <BodyText>
            Solve two or three anagrams in a row, compare the indicator
            language, and note whether you missed the clue because of the fodder,
            the definition, or the final count. This makes the review
            transferable to the next session.
          </BodyText>
          <SubHeading>When to Move On</SubHeading>
          <BodyText>
            If you can already solve most easy anagrams, move into mixed clue
            sets where anagrams appear alongside charades and containers. That
            helps you stop solving by expectation alone and start identifying the
            mechanism more reliably from the clue itself.
          </BodyText>
        </ContentSection>

        <ContentSection title="Anagram Clue FAQ" id="anagram-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Expand from anagram signals into other common indicator families.",
            },
            {
              href: "/minute-cryptic/easy",
              title: "Easy cryptic clues",
              description:
                "Practice easier archive clues before moving into mixed-difficulty sets.",
            },
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "Compare anagrams with charades, containers, and double definitions.",
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
