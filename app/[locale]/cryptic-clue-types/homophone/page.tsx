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
    question: "What is a homophone clue?",
    answer:
      "A homophone clue gives you a word that sounds like the answer but is spelled differently. The indicator always relates to hearing or speaking.",
  },
  {
    question: "Do accents affect homophone clues?",
    answer:
      "They can. Most homophone clues are based on standard pronunciations, but regional differences occasionally create ambiguity. The published explanation will clarify the intended pronunciation.",
  },
  {
    question: "How do I know which part is the sound-alike?",
    answer:
      "The homophone indicator usually sits next to the word that sounds like the answer. The definition is at the other end of the clue.",
  },
  {
    question: "Are homophone clues common?",
    answer:
      "They are less common than anagrams or charades but appear regularly. They are distinctive because they are the only clue type that depends on pronunciation rather than spelling.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "HomophoneClues",
    title: "Homophone Clues: When It Sounds Like the Answer",
    description:
      "Learn how homophone clues work in cryptic crosswords, how to spot hearing indicators, and how to solve sound-alike clues step by step.",
    keywords: [
      "homophone clues",
      "homophone cryptic clues",
      "sounds like clues",
      "how to solve homophone clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/homophone",
    canonicalUrl: "/cryptic-clue-types/homophone",
  });
}

export default async function HomophoneCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("homophone", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Homophone Clues", url: `${BASE_URL}/cryptic-clue-types/homophone` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Homophone Clues: When It Sounds Like the Answer",
          description:
            "Learn how homophone clues work in cryptic crosswords, how to spot hearing indicators, and how to solve sound-alike clues step by step.",
          url: `${BASE_URL}/cryptic-clue-types/homophone`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Homophone Clues"
        description="Homophone clues are the only cryptic clue family that depends on how a word sounds rather than how it is spelled. They use hearing indicators to signal that the answer is a sound-alike of another word."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-homophone-clue", label: "What is a homophone clue?" },
            { href: "#how-homophones-work", label: "How homophone clues work" },
            { href: "#spot-homophone-indicators", label: "How to spot indicators" },
            { href: "#solve-homophones-step-by-step", label: "Step-by-step solving method" },
            { href: "#real-homophone-examples", label: "Real homophone examples" },
            { href: "#tricky-homophones-and-accents", label: "Tricky homophones and accents" },
            { href: "#common-homophone-mistakes", label: "Common mistakes" },
            { href: "#homophone-faq", label: "Homophone FAQ" },
          ]}
        />

        <ContentSection title="What Is a Homophone Clue?" id="what-is-a-homophone-clue">
          <BodyText>
            A homophone clue tells you that the answer sounds like another
            word or phrase. The clue contains a definition of the answer and
            a word that, when spoken aloud, sounds identical or very similar
            to the answer. A hearing indicator connects the two.
          </BodyText>
          <SubHeading>Sound Over Spelling</SubHeading>
          <BodyText>
            What makes homophone clues unique is that they shift your
            attention from letters to sounds. While every other clue type
            asks you to manipulate written characters, homophones ask you to
            think about pronunciation. That makes them feel distinctly
            different and sometimes surprisingly tricky.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Homophone Clues Work" id="how-homophones-work">
          <BodyText>
            The clue contains three elements: a definition of the answer, a
            word or phrase that sounds like the answer, and an indicator that
            points to the hearing connection. The indicator is always related
            to sound, speech, or hearing.
          </BodyText>
          <CalloutBox type="highlight" title="Classic Examples">
            PAIR sounds like PEAR. FLOUR sounds like FLOWER. KNIGHT sounds
            like NIGHT. MARE sounds like MAYOR (in some accents). The clue
            defines one and phonetically references the other.
          </CalloutBox>
          <BodyText>
            The beauty of homophone clues is that they exploit the gap
            between English spelling and pronunciation. Two words can be
            spelled completely differently yet sound identical. The setter
            uses that gap to construct a clue that reads naturally while
            hiding the phonetic link.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Spot Homophone Indicators" id="spot-homophone-indicators">
          <BodyText>
            Homophone indicators always relate to hearing, speaking, or
            sound. If you see one of these words in a clue and there is no
            obvious letter manipulation, test the homophone route.
          </BodyText>
          <IndicatorTagList
            tags={["sounds like", "we hear", "reportedly", "on the radio", "aloud", "spoken", "say", "audibly", "by the sound of it", "in conversation", "orally", "they say", "it is said", "when spoken"]}
            color="default"
          />
          <SubHeading>The Hearing Test</SubHeading>
          <BodyText>
            A useful habit is to read the clue aloud when you see hearing
            language. If saying a word in the clue produces the sound of a
            different word that matches the definition, you have likely
            found a homophone clue.
          </BodyText>
          <BodyText>
            The indicator usually sits right next to the sound-alike word.
            It tells you that the adjacent word should be heard rather than
            read. This directional placement is your most reliable structural
            signal.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Step-by-Step Method for Solving Homophone Clues" id="solve-homophones-step-by-step">
          <StepList
            items={[
              {
                title: "Find the Hearing Indicator",
                description:
                  "Look for a word related to sound, speech, or hearing. This confirms the clue depends on pronunciation.",
              },
              {
                title: "Identify the Definition",
                description:
                  "The definition is usually at the opposite end from the indicator. Determine what kind of word you are looking for.",
              },
              {
                title: "Read the Clue Aloud",
                description:
                  "Say the words near the indicator out loud. Listen for a word that sounds like a different word matching the definition.",
              },
              {
                title: "Find the Sound-Alike Pair",
                description:
                  "Identify the two words: one is in the clue text, the other is the answer. They sound the same but are spelled differently.",
              },
              {
                title: "Verify Definition and Letter Count",
                description:
                  "Confirm that the answer matches the definition and the enumeration. The sound-alike relationship must be clear, not forced.",
              },
            ]}
          />
        </ContentSection>

        {puzzles.length > 0 && (
          <ExamplePuzzleGrid
            id="real-homophone-examples"
            puzzles={puzzles}
            title="Real Homophone Examples"
            intro="These examples show how homophone clues use sound-alike pairs in real minute cryptic puzzles. Read each clue aloud and listen for the phonetic connection."
          />
        )}

        <ContentSection title="Tricky Homophones and Regional Accents" id="tricky-homophones-and-accents">
          <SubHeading>The Accent Problem</SubHeading>
          <BodyText>
            English pronunciation varies by region. Words that sound identical
            in British English may not match in American English, and vice
            versa. Most cryptic crosswords use standard British pronunciation
            as their baseline, but this is not always stated explicitly.
          </BodyText>
          <CalloutBox type="warning" title="When Pronunciation Differs">
            If a homophone clue does not seem to work, consider whether the
            intended pronunciation differs from your own. Words like
            FLOUR/FLOWER, POOR/POUR, or CAUGHT/COURT may or may not be
            homophones depending on your accent. The published explanation
            will clarify the intended sound.
          </CalloutBox>
          <SubHeading>Near-Homophones</SubHeading>
          <BodyText>
            Some clues use near-homophones where the sounds are very close
            but not perfectly identical. This is a matter of setter style
            and editorial standards. Fair clues should use pairs that are
            genuinely indistinguishable in normal speech, not pairs that
            only work with creative pronunciation.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Homophone Mistakes" id="common-homophone-mistakes">
          <CalloutBox type="warning" title="Mistakes to Avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Confusing which word is the sound-alike and which is the definition</li>
              <li>Trying to apply letter manipulation instead of listening</li>
              <li>Assuming your regional pronunciation is the only valid one</li>
              <li>Ignoring the indicator and treating the clue as a double definition</li>
            </ul>
          </CalloutBox>
          <SubHeading>Homophone vs Double Definition</SubHeading>
          <BodyText>
            Homophones and double definitions can look similar because both
            clue types often feel short and semantically driven. The key
            difference is the indicator. A homophone clue always contains
            hearing or sound language. A double definition does not need any
            operational indicator — it relies purely on two fair meanings.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Homophone Clues" id="practice-homophone-clues">
          <SubHeading>Train Your Ear</SubHeading>
          <BodyText>
            The best preparation for homophone clues is building a mental
            library of common homophone pairs. Words like BEAR/BARE,
            BORED/BOARD, BRAKE/BREAK, CEILING/SEALING, HIRE/HIGHER, and
            WAIT/WEIGHT appear frequently. The more pairs you recognize, the
            faster you can solve.
          </BodyText>
          <SubHeading>Read Clues Aloud</SubHeading>
          <BodyText>
            Make it a habit to read cryptic clues aloud, especially when you
            spot hearing language. The phonetic connection is often much
            easier to detect by ear than by sight. This is one of the few
            clue types where speaking helps more than writing.
          </BodyText>
        </ContentSection>

        <ContentSection title="Homophone Clue FAQ" id="homophone-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/double-definition",
              title: "Double definition clues",
              description:
                "Compare homophones with double definitions — both feel semantic but work differently.",
            },
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "See how homophones fit into the full family of cryptic clue mechanisms.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's clue",
              description:
                "Test your homophone skills on today's minute cryptic puzzle.",
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
