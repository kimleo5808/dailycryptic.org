import { AdSlot } from "@/components/ads/AdSlot";
import { ClueParseBreakdown } from "@/components/minute-cryptic-content/ClueParseBreakdown";
import { MisdirectionTable } from "@/components/minute-cryptic-content/MisdirectionTable";
import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  IndicatorTagList,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { MISLEADING_WORDS } from "@/data/cryptic-misleading-words";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-05-28";

const FAQ_ITEMS = [
  {
    question: "Why does \"flower\" mean river in a cryptic crossword?",
    answer:
      "Because cryptic setters read flower as flow + er — \"a thing that flows\" — which is a river, not a plant. This is an agent-noun trick: any verb plus \"-er\" can become a misleading noun. It is a recognised convention, so dictionaries will not list this meaning, but solvers are expected to know it.",
  },
  {
    question: "What does \"number\" mean in a cryptic crossword?",
    answer:
      "Number usually means an anaesthetic, painkiller, or something cold — anything that numbs (numb + er = \"one that numbs\"). It rarely refers to a digit. The position at the start of a clue is a decoy to push you toward the maths meaning.",
  },
  {
    question: "What does \"banker\" mean in cryptic crosswords?",
    answer:
      "Banker most often means a river — a thing that has banks — not a financier. Like flower, it is a misleading agent noun. Setters rely on you picturing money first. Other river-words include flower and sometimes runner.",
  },
  {
    question: "Are these misleading meanings considered fair?",
    answer:
      "Yes. These invented agent-noun and double-definition meanings are a long-standing, accepted part of cryptic convention. A clue is fair as long as the wordplay genuinely leads to the answer, even if the surface reading deliberately misleads you.",
  },
  {
    question: "How do I get better at spotting cryptic misdirection?",
    answer:
      "Learn the common families first — the \"-er\" agent nouns and the usual-suspect abbreviations — then practise daily. Check the letter count against the obvious answer; a mismatch is the fastest tell that a word is being used cryptically.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrypticMisleadingWords",
    title: 'Why "Flower" Means River in Cryptic Crosswords',
    description:
      "Flower = river, number = anaesthetic, banker = river. Learn why cryptic crosswords hide everyday words — with a full misleading-word list and real examples.",
    keywords: [
      "why does flower mean river in cryptic crosswords",
      "cryptic crossword flower river",
      "cryptic misleading words",
      "what does number mean in cryptic",
      "the usual suspects cryptic crossword",
    ],
    locale: locale as Locale,
    path: "/cryptic-misleading-words",
    canonicalUrl: "/cryptic-misleading-words",
  });
}

export default async function CrypticMisleadingWordsPage({
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
          {
            name: "Cryptic Crossword for Beginners",
            url: `${BASE_URL}/cryptic-crossword-for-beginners`,
          },
          {
            name: "Cryptic Misleading Words",
            url: `${BASE_URL}/cryptic-misleading-words`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: 'Why "Flower" Means River in Cryptic Crosswords',
          description:
            "A complete guide to cryptic misdirection words — the -er agent-noun trick, the usual suspects, and how to spot a misleading clue.",
          url: `${BASE_URL}/cryptic-misleading-words`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Solving Guide"
        title='Why "Flower" Means River in Cryptic Crosswords'
        description="In cryptic crosswords, flower almost never means a daisy — it means a river, something that flows. This one trick, adding -er to a verb, fools more beginners than any other device. Here is the whole family of misleading words, and how to read them the way setters intend."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#the-er-rule", label: "The 30-second answer: the -er rule" },
            { href: "#why-allowed", label: "Why setters are allowed to do this" },
            { href: "#flower-example", label: "Flower in detail" },
            { href: "#misleading-word-list", label: "Complete misleading-word list" },
            { href: "#double-bluff", label: "The double-bluff" },
            { href: "#spot-misdirection", label: "How to spot a misdirection" },
            { href: "#misleading-words-faq", label: "FAQ" },
          ]}
        />

        <ClueParseBreakdown
          word="FLOWER"
          parts={[
            { text: "FLOW", label: "verb — to flow" },
            { text: "-ER", label: "one that…" },
          ]}
          decoy="a plant or daisy (the obvious reading setters want you to take)"
          meaning="a river — a thing that flows"
        />

        <ContentSection title="The 30-Second Answer: the -er Rule" id="the-er-rule">
          <BodyText>
            In a cryptic crossword, flower means river — parsed as flow + er, a
            thing that flows. This is an invented agent-noun meaning you will not
            find in a dictionary; setters use it to misdirect you toward the
            floral meaning.
          </BodyText>
          <BodyText>
            The rule behind it is simple. Many cryptic words are agent nouns: a
            verb plus -er meaning &quot;one who&quot; or &quot;that which&quot;
            does something. Once you see the pattern, a whole family of traps
            opens up at once.
          </BodyText>
          <CalloutBox type="tip" title="The quick test">
            If a common noun feels too obvious in a clue, mentally strip the
            -er and ask what the verb does. Flower → flow. Number → numb. Banker
            → bank.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="Why Setters Are Allowed to Do This"
          id="why-allowed"
        >
          <BodyText>
            These misleading meanings are not cheating. They are a recognised,
            fair convention of cryptic crosswords. A clue is considered fair as
            long as the wordplay genuinely leads to the answer, even when the
            surface story deliberately points you the wrong way.
          </BodyText>
          <SubHeading>Two Mechanisms Produce the Same Effect</SubHeading>
          <BodyText>
            Misdirection words fall into two broad families. The first is the
            agent-noun trick (flower, number, runner) where -er hides a verb.
            The second is the cryptic double meaning (capital = letter, notes =
            money) where a whole word has a less obvious sense.
          </BodyText>
          <IndicatorTagList
            tags={[
              "flower = river",
              "number = anaesthetic",
              "banker = river",
              "capital = letter",
              "notes = money",
              "lead = leash",
            ]}
            color="purple"
          />
          <BodyText>
            For the second family, see how setters reuse short letter codes on
            our{" "}
            <a className="text-primary underline" href="/cryptic-abbreviations">
              cryptic abbreviations
            </a>{" "}
            page, and how double meanings drive a whole clue type in{" "}
            <a
              className="text-primary underline"
              href="/cryptic-clue-types/double-definition"
            >
              double definition clues
            </a>
            .
          </BodyText>
        </ContentSection>

        <ContentSection title="Flower in Detail: the Textbook Trap" id="flower-example">
          <BodyText>
            Take a clue like &quot;Flower flowing through Paris (5)&quot;. The
            surface invites you to picture a bloom in a French garden. But
            flower is the definition for river, and &quot;flowing through
            Paris&quot; confirms it: the answer is SEINE.
          </BodyText>
          <SubHeading>The Plural Works Too</SubHeading>
          <BodyText>
            The trick survives pluralisation. Flowers can mean rivers, and the
            same logic applies to bloomer (a flower), runner (a river or bean),
            and banker (a river with banks). Learn one and you unlock the set.
          </BodyText>
          <CalloutBox type="warning" title="Watch the definition position">
            The definition always sits at the start or end of a clue. If
            &quot;flower&quot; opens the clue and the rest reads like
            instructions, treat flower as the definition — a river — not as
            fodder.
          </CalloutBox>
        </ContentSection>

        <AdSlot slot="0000000000" />

        <MisdirectionTable words={MISLEADING_WORDS} />

        <ContentSection
          title="The Double-Bluff: When the Trick Is Reversed"
          id="double-bluff"
        >
          <BodyText>
            Once you know the -er trick, experienced setters turn it against
            you. Skier looks like a person on the slopes and feels like a
            classic agent-noun trap, but it can mean a ball hit high into the
            sky in cricket. Sewer hides two pronunciations: a drain, or one who
            sews.
          </BodyText>
          <CalloutBox type="highlight" title="Cross-check before you commit">
            When two cryptic readings compete, let the enumeration decide. Count
            the letters in each candidate answer and keep only the one that fits
            the grid exactly.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="How to Spot a Misdirection in 3 Seconds"
          id="spot-misdirection"
        >
          <StepList
            items={[
              {
                title: "Question the obvious noun",
                description:
                  "If a common noun sits where the definition should be, suspect an agent noun or a hidden second meaning.",
              },
              {
                title: "Try the verb + -er split",
                description:
                  "Could the word break into a verb plus -er? Flower → flow, number → numb, butter → butt.",
              },
              {
                title: "Distrust a tidy surface",
                description:
                  "Setters polish decoy stories. A clue that reads too neatly is often steering you away from the real definition.",
              },
              {
                title: "Let the letter count rule",
                description:
                  "Check the enumeration against the obvious answer. A mismatch is the fastest sign a word is being used cryptically.",
              },
            ]}
          />
        </ContentSection>

        <AdSlot slot="0000000001" />

        <ContentSection title="Cryptic Misleading Words FAQ" id="misleading-words-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Cryptic crossword for beginners",
              description:
                "Start from the basics and build up to spotting misdirection on sight.",
            },
            {
              href: "/cryptic-clue-types",
              title: "Cryptic clue types",
              description:
                "See how misleading words fit into anagrams, charades, and double definitions.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description:
                "Put the -er trick to work on a fresh clue right now.",
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
