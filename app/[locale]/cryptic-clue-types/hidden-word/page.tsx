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
    question: "What is a hidden word clue?",
    answer:
      "A hidden word clue conceals the answer as a consecutive letter run inside the clue text itself. The indicator tells you to look within the surrounding words.",
  },
  {
    question: "Are hidden word clues the easiest type?",
    answer:
      "They are often considered the most beginner-friendly because the answer is literally written in the clue. The challenge is spotting the indicator and finding the right letter span.",
  },
  {
    question: "What is a reverse hidden word?",
    answer:
      "A reverse hidden word clue hides the answer backwards in the clue text. It uses both a hidden word indicator and a reversal indicator together.",
  },
  {
    question: "How do I know which letters to look at?",
    answer:
      "Use the enumeration (letter count) to set a sliding window. Move that window across the words adjacent to the indicator until you find a valid English word that matches the definition.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "HiddenWordClues",
    title: "Hidden Word Clues: Find the Answer Inside the Clue",
    description:
      "Learn how hidden word clues work in cryptic crosswords, how to spot indicators, and how to find the answer concealed in the clue text.",
    keywords: [
      "hidden word clues",
      "hidden word cryptic clues",
      "hidden word indicators",
      "how to solve hidden word clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/hidden-word",
    canonicalUrl: "/cryptic-clue-types/hidden-word",
  });
}

export default async function HiddenWordCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("hidden-word", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Hidden Word Clues", url: `${BASE_URL}/cryptic-clue-types/hidden-word` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Hidden Word Clues: Find the Answer Inside the Clue",
          description:
            "Learn how hidden word clues work in cryptic crosswords, how to spot indicators, and how to find the answer concealed in the clue text.",
          url: `${BASE_URL}/cryptic-clue-types/hidden-word`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Hidden Word Clues"
        description="Hidden word clues are often the friendliest entry point into cryptic crosswords. The answer is spelled out inside the clue text — your job is to find the indicator, count the letters, and scan for the hidden run."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-hidden-word-clue", label: "What is a hidden word clue?" },
            { href: "#why-hidden-words-are-beginner-friendly", label: "Why they are beginner-friendly" },
            { href: "#spot-hidden-word-indicators", label: "How to spot indicators" },
            { href: "#solve-hidden-words-step-by-step", label: "Step-by-step solving method" },
            { href: "#real-hidden-word-examples", label: "Real hidden word examples" },
            { href: "#reverse-hidden-words", label: "Reverse hidden words" },
            { href: "#common-hidden-word-mistakes", label: "Common mistakes" },
            { href: "#hidden-word-faq", label: "Hidden word FAQ" },
          ]}
        />

        <ContentSection title="What Is a Hidden Word Clue?" id="what-is-a-hidden-word-clue">
          <BodyText>
            A hidden word clue conceals the answer as a consecutive sequence of
            letters inside the clue text. The answer spans across one or more
            words in the clue, reading left to right in the exact order it
            appears. The clue also contains an indicator that tells you the
            answer is embedded somewhere nearby.
          </BodyText>
          <SubHeading>The Simplest Cryptic Mechanism</SubHeading>
          <BodyText>
            What makes hidden word clues uniquely accessible is that no letter
            manipulation is required. You do not rearrange, reverse, or
            construct anything. You simply locate where the answer sits within
            the clue and extract it. That directness makes these clues the
            most natural starting point for new solvers.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Hidden Word Clues Are Beginner-Friendly" id="why-hidden-words-are-beginner-friendly">
          <SubHeading>The Answer Is Already There</SubHeading>
          <BodyText>
            Unlike anagrams or charades, you do not need to build or
            rearrange anything. The answer is literally written in front of
            you. The only skill required is recognizing the indicator and
            knowing to scan the surrounding words letter by letter.
          </BodyText>
          <SubHeading>A Confidence Builder</SubHeading>
          <BodyText>
            Hidden word clues build early confidence because they demonstrate
            the core cryptic principle — every clue has a definition and a
            wordplay mechanism — in its most transparent form. Once you see
            how hidden words work, the structure of harder clue types becomes
            easier to understand.
          </BodyText>
          <CalloutBox type="highlight" title="Start Here If You Are New">
            If you have never solved a cryptic clue before, hidden word clues
            are the best place to begin. They let you practice identifying
            definitions, indicators, and wordplay boundaries without any
            letter manipulation.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="How to Spot Hidden Word Indicators" id="spot-hidden-word-indicators">
          <BodyText>
            Hidden word indicators are words or phrases that suggest
            containment, partial inclusion, or something being found inside
            something else. They point you toward scanning the adjacent text
            for a letter run.
          </BodyText>
          <IndicatorTagList
            tags={["in", "part of", "some", "held in", "within", "partly", "conceals", "hides", "contains", "found in", "embedded in", "housed in"]}
            color="teal"
          />
          <SubHeading>Overlap with Container Indicators</SubHeading>
          <BodyText>
            Some hidden word indicators overlap with container language. The
            word "in" can signal either type. The difference is structural:
            in a container clue, you build the answer from separate pieces;
            in a hidden word clue, you extract the answer from continuous
            text. If the clue seems too short for assembly, test the hidden
            word route first.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Step-by-Step Method for Solving Hidden Word Clues" id="solve-hidden-words-step-by-step">
          <StepList
            items={[
              {
                title: "Find the Indicator",
                description:
                  "Look for a word suggesting containment or partial inclusion. This tells you the answer is hiding in the clue text.",
              },
              {
                title: "Identify the Definition",
                description:
                  "The definition is usually at the opposite end of the clue from the indicator. Determine what kind of word you are looking for.",
              },
              {
                title: "Note the Letter Count",
                description:
                  "Use the enumeration to set your sliding window size. If the answer is five letters, you need a five-letter span.",
              },
              {
                title: "Scan the Text",
                description:
                  "Move your letter window across the words adjacent to the indicator. Look for a valid English word that matches the required length.",
              },
              {
                title: "Verify Against the Definition",
                description:
                  "Confirm that the word you found matches the definition. A correct hidden word solve satisfies both the letter extraction and the meaning.",
              },
            ]}
          />
          <SubHeading>The Sliding Window Technique</SubHeading>
          <BodyText>
            The most reliable technique is to write out the letters of the
            candidate words without spaces, then slide a window of the
            correct length across them. This removes word boundaries from
            your thinking and makes the hidden run easier to spot.
          </BodyText>
        </ContentSection>

        {puzzles.length > 0 && (
          <ExamplePuzzleGrid
            id="real-hidden-word-examples"
            puzzles={puzzles}
            title="Real Hidden Word Examples"
            intro="These examples show how hidden word clues conceal the answer in real minute cryptic puzzles. For each one, find the indicator, then scan the surrounding text for the letter run."
          />
        )}

        <ContentSection title="Reverse Hidden Words" id="reverse-hidden-words">
          <BodyText>
            A reverse hidden word clue hides the answer backwards in the
            clue text. These clues use two indicators together: one for
            hidden containment and one for reversal. You find the letter run
            the same way, but then read it in reverse to get the answer.
          </BodyText>
          <CalloutBox type="warning" title="Double Indicator Required">
            A legitimate reverse hidden word clue should signal both
            operations. If you only see a hidden word indicator, assume the
            answer reads forward. If you also see reversal language, try
            reading the span backwards.
          </CalloutBox>
          <SubHeading>How to Solve Reverse Hidden Words</SubHeading>
          <BodyText>
            The process is the same as regular hidden words with one extra
            step: after extracting the letter span, reverse it. Then check
            whether the reversed string matches the definition and the
            enumeration. This variation is less common but worth knowing
            about because it can catch solvers off guard.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Hidden Word Mistakes" id="common-hidden-word-mistakes">
          <CalloutBox type="warning" title="Mistakes to Avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Ignoring the letter count and forcing a longer or shorter span</li>
              <li>Missing word boundaries — the answer often crosses between words</li>
              <li>Confusing a hidden word indicator with a container indicator</li>
              <li>Forgetting to check the definition after finding the letter run</li>
            </ul>
          </CalloutBox>
          <SubHeading>The Word Boundary Trap</SubHeading>
          <BodyText>
            Many beginners search within individual words only. Hidden word
            answers almost always cross word boundaries. The answer might
            start in the middle of one word and end in the middle of the
            next. Removing spaces from your scan eliminates this trap.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Hidden Word Clues" id="practice-hidden-word-clues">
          <SubHeading>Build the Habit First</SubHeading>
          <BodyText>
            Start by solving three or four hidden word clues in a row. Focus
            on the process: find the indicator, set the window, scan, and
            verify. Once the process feels automatic, mix hidden words into
            broader practice sets so you learn to recognize them among other
            clue types.
          </BodyText>
          <SubHeading>When to Move On</SubHeading>
          <BodyText>
            If you can consistently identify hidden word clues and extract
            the answer within a minute, you are ready for more challenging
            clue types. Hidden words are a stepping stone — they teach the
            fundamental structure of cryptic clues in its most transparent
            form.
          </BodyText>
        </ContentSection>

        <ContentSection title="Hidden Word Clue FAQ" id="hidden-word-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/reversal",
              title: "Reversal clues",
              description:
                "Learn the related skill of reading letters backwards in reversal clues.",
            },
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Review the full list of indicator words across all clue families.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's clue",
              description:
                "Practice what you have learned on today's minute cryptic puzzle.",
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
