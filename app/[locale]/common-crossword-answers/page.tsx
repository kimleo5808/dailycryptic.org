import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-10";

const FAQ_ITEMS = [
  {
    question: "Why do the same words keep appearing in cryptic crosswords?",
    answer:
      "Because they have useful letter patterns — lots of vowels, common consonant combinations, and multiple meanings. Setters need words that interlock well in grids and support fair wordplay.",
  },
  {
    question: "Should I memorise common answers?",
    answer:
      "Not as a primary strategy. Familiarity with common answers helps you verify candidates faster, but solving skill comes from understanding wordplay, not from recognising frequent answers.",
  },
  {
    question: "Do common answers make puzzles easier?",
    answer:
      "They can, but setters often compensate with harder wordplay or more subtle definitions when using common answer words. The word may be familiar, but the clue may not be.",
  },
  {
    question: "Are these answers specific to British cryptic crosswords?",
    answer:
      "Most of these words are common across English-language cryptic crosswords. Some British-specific terms may appear less often in American or Australian cryptics.",
  },
];

type WordEntry = { word: string; hint: string };

function WordCardGrid({ words }: { words: WordEntry[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {words.map((w) => (
        <div
          key={w.word}
          className="rounded-lg border border-border bg-card p-3 transition hover:border-primary/30"
        >
          <p className="font-mono text-sm font-bold tracking-wider text-primary">{w.word}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.hint}</p>
        </div>
      ))}
    </div>
  );
}

const THREE_LETTER: WordEntry[] = [
  { word: "ERA", hint: "Period / age" },
  { word: "ORE", hint: "Mineral / metal source" },
  { word: "ARE", hint: "Exist / land measure" },
  { word: "ATE", hint: "Consumed / Greek recklessness" },
  { word: "IRE", hint: "Anger" },
  { word: "AWE", hint: "Wonder / reverence" },
  { word: "OAR", hint: "Rowing blade" },
  { word: "ALE", hint: "Beer / brew" },
  { word: "APE", hint: "Primate / mimic" },
  { word: "EWE", hint: "Female sheep" },
  { word: "ODE", hint: "Poem / lyric" },
  { word: "ACE", hint: "Expert / card / serve" },
];

const FOUR_LETTER: WordEntry[] = [
  { word: "AREA", hint: "Region / zone" },
  { word: "IDEA", hint: "Thought / concept" },
  { word: "ARIA", hint: "Opera song" },
  { word: "OGRE", hint: "Monster / brute" },
  { word: "EASE", hint: "Comfort / simplicity" },
  { word: "AIDE", hint: "Helper / assistant" },
  { word: "ALOE", hint: "Plant / succulent" },
  { word: "EIRE", hint: "Ireland" },
  { word: "ANTE", hint: "Stake / before" },
  { word: "AXIS", hint: "Line / alliance" },
  { word: "EARL", hint: "Nobleman / peer" },
  { word: "ISLE", hint: "Island" },
];

const FIVE_LETTER: WordEntry[] = [
  { word: "ERASE", hint: "Delete / remove" },
  { word: "AROSE", hint: "Got up / emerged" },
  { word: "IRATE", hint: "Angry / furious" },
  { word: "ATONE", hint: "Make amends" },
  { word: "OATER", hint: "Western film" },
  { word: "ADORE", hint: "Love / worship" },
  { word: "AISLE", hint: "Passage / walkway" },
  { word: "ELITE", hint: "Best / top group" },
  { word: "OPERA", hint: "Musical drama" },
  { word: "ASTER", hint: "Flower / star-shaped" },
  { word: "ALIEN", hint: "Foreign / outsider" },
  { word: "ENTER", hint: "Go in / type" },
];

const MULTI_MEANING: WordEntry[] = [
  { word: "BANK", hint: "River edge / financial institution / rely on" },
  { word: "MATCH", hint: "Game / fire lighter / equal" },
  { word: "LIGHT", hint: "Not heavy / illumination / land on" },
  { word: "SPRING", hint: "Season / water source / jump / coil" },
  { word: "BRIDGE", hint: "Card game / structure / connection" },
  { word: "BARK", hint: "Tree covering / dog sound / ship" },
  { word: "CRANE", hint: "Bird / machine / stretch neck" },
  { word: "MOLE", hint: "Animal / spy / unit / skin mark" },
  { word: "RACE", hint: "Competition / ethnicity / rush" },
  { word: "SEAL", hint: "Animal / close up / stamp / approve" },
  { word: "POUND", hint: "Currency / weight / hit / enclosure" },
  { word: "IRON", hint: "Metal / press clothes / golf club / resolve" },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CommonCrosswordAnswers",
    title: "100 Most Common Cryptic Crossword Answers",
    description:
      "A guide to the words that appear most frequently in cryptic crosswords, organised by length, with explanations of why setters love them.",
    keywords: [
      "common crossword answers",
      "frequent crossword words",
      "most common cryptic answers",
      "crossword answer list",
    ],
    locale: locale as Locale,
    path: "/common-crossword-answers",
    canonicalUrl: "/common-crossword-answers",
  });
}

export default async function CommonCrosswordAnswersPage({
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
          { name: "Common Crossword Answers", url: `${BASE_URL}/common-crossword-answers` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "100 Most Common Cryptic Crossword Answers",
          description:
            "A guide to the words that appear most frequently in cryptic crosswords, organised by length, with explanations of why setters love them.",
          url: `${BASE_URL}/common-crossword-answers`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Reference Guide"
        title="Common Cryptic Crossword Answers"
        description="Some words appear in cryptic crosswords far more often than others. They have useful letter patterns, multiple meanings, and interlock well with grid constraints. Recognising them helps you verify candidates faster."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#why-some-words-repeat", label: "Why some words repeat" },
            { href: "#three-letter-words", label: "3-letter words" },
            { href: "#four-letter-words", label: "4-letter words" },
            { href: "#five-letter-words", label: "5-letter words" },
            { href: "#words-with-multiple-meanings", label: "Words with multiple meanings" },
            { href: "#how-to-use-this-list", label: "How to use this list" },
            { href: "#common-answers-faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="Why Some Words Appear Again and Again" id="why-some-words-repeat">
          <BodyText>
            Cryptic crossword answers are not random. Certain words appear
            disproportionately often because they share properties that make
            them useful to setters: high vowel density, common consonant
            patterns, and multiple distinct meanings.
          </BodyText>
          <CalloutBox type="highlight" title="The Pattern">
            Short word + many vowels + multiple meanings = high frequency.
            Words like ERA, AREA, and IDEA have all three properties, which
            is why they show up so often in grids and in single-clue puzzles.
          </CalloutBox>
          <SubHeading>Grid Interlocking</SubHeading>
          <BodyText>
            In full crossword grids, answers must interlock with crossing
            entries. Words with alternating vowels and consonants (like
            ALOE, ARIA, or ERASE) create more viable crossing points than
            words with consonant clusters. That structural advantage pushes
            them to the top of the frequency list.
          </BodyText>
          <SubHeading>Wordplay Versatility</SubHeading>
          <BodyText>
            Words with multiple meanings give setters more options for
            constructing fair clues. BANK can be defined as a financial
            institution, a river edge, or an act of reliance — each opening
            up a different surface reading for the same answer.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common 3-Letter Answers" id="three-letter-words">
          <BodyText>
            Three-letter words are the smallest answers in most crossword
            grids. They appear at intersections and corners, making them
            structurally important. The most frequent ones are heavy on
            vowels.
          </BodyText>
          <WordCardGrid words={THREE_LETTER} />
        </ContentSection>

        <ContentSection title="Common 4-Letter Answers" id="four-letter-words">
          <BodyText>
            Four-letter words are the backbone of crossword grids. They
            balance brevity with enough letters for interesting wordplay.
            Many of them double as useful charade components.
          </BodyText>
          <WordCardGrid words={FOUR_LETTER} />
        </ContentSection>

        <ContentSection title="Common 5-Letter Answers" id="five-letter-words">
          <BodyText>
            Five-letter words offer setters more room for structural
            wordplay. They frequently appear as charade or container
            constructions and provide enough letters for anagram fodder.
          </BodyText>
          <WordCardGrid words={FIVE_LETTER} />
        </ContentSection>

        <ContentSection title="Words with Multiple Meanings" id="words-with-multiple-meanings">
          <BodyText>
            These words are setter favourites because each meaning opens up
            a different clue angle. A word with four distinct senses can
            appear in four completely different clues without repetition.
            They are especially common in double definition clues.
          </BodyText>
          <WordCardGrid words={MULTI_MEANING} />
          <CalloutBox type="tip" title="Double Definition Gold">
            Words with multiple unrelated meanings are natural double
            definition candidates. When you see a short, seemingly simple
            clue, consider whether the answer might be a multi-meaning word
            from this list.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="How to Use This List" id="how-to-use-this-list">
          <StepList
            items={[
              {
                title: "Use It as a Verification Tool",
                description:
                  "When you have a candidate answer that partly fits, check whether it appears on this list. Common answers are more likely to be correct than obscure ones.",
              },
              {
                title: "Study the Multiple Meanings",
                description:
                  "For each word, think about its different senses. This builds the semantic flexibility that helps with double definition clues.",
              },
              {
                title: "Notice Patterns in Your Solving",
                description:
                  "After solving a batch of clues, check how many answers were from this list. You will be surprised how often common words appear.",
              },
            ]}
          />
          <SubHeading>Do Not Over-Rely on Memorisation</SubHeading>
          <BodyText>
            This list helps you verify, not guess. Good solving comes from
            understanding the wordplay, not from recognising common answer
            words. Use it as a complement to clue-type study, not a
            replacement for it.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Crossword Answers FAQ" id="common-answers-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-abbreviations",
              title: "Cryptic abbreviations",
              description:
                "Learn the letter codes that build these common answers in charade wordplay.",
            },
            {
              href: "/cryptic-clue-types/double-definition",
              title: "Double definition clues",
              description:
                "See how multi-meaning words power double definition clues.",
            },
            {
              href: "/cryptic-glossary",
              title: "Cryptic glossary",
              description:
                "Look up any cryptic crossword term you do not recognise.",
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
