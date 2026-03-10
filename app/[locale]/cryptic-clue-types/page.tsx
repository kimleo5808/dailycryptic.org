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
import { CLUE_TYPE_TOPICS } from "@/lib/minute-cryptic-topics";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "How many cryptic clue types are there?",
    answer:
      "There are eight main clue families covered here: anagram, charade, container, double definition, hidden word, reversal, homophone, and deletion. Most beginners should start with anagrams and hidden words before moving to the others.",
  },
  {
    question: "Which clue type is easiest for beginners?",
    answer:
      "Anagram clues are usually the easiest place to start because the mechanism is easier to verify with letter count and indicator language.",
  },
  {
    question: "Can one clue contain more than one mechanism?",
    answer:
      "Yes. Some clues combine multiple operations, but beginners improve faster by learning the clearest single-mechanism examples first.",
  },
  {
    question: "Do clue types affect difficulty?",
    answer:
      "Yes, but not in a fixed way. Difficulty usually comes from how clearly the clue signals the mechanism, not only from the mechanism name itself.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "ClueTypes",
    title: "Cryptic Clue Types Explained: All 8 Families with Examples",
    description:
      "Learn the main types of cryptic clues — anagram, charade, container, double definition, hidden word, reversal, homophone, and deletion — and where to practice each one.",
    keywords: [
      "cryptic clue types",
      "types of cryptic clues",
      "common cryptic clue patterns",
      "cryptic clue mechanisms",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types",
    canonicalUrl: "/cryptic-clue-types",
  });
}

export default async function CrypticClueTypesPage({
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
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Cryptic Clue Types",
          description:
            "A guide to all eight cryptic clue families on DailyCryptic, including anagram, charade, container, double definition, hidden word, reversal, homophone, and deletion clues.",
          url: `${BASE_URL}/cryptic-clue-types`,
        })}
      />
      <JsonLd
        data={itemListSchema(
          Object.values(CLUE_TYPE_TOPICS).map((topic) => ({
            name: topic.label,
            url: `${BASE_URL}${topic.href}`,
            description: topic.description,
          }))
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type Guide"
        title="Cryptic Clue Types"
        description="Cryptic clue types are categories based on how the wordplay works. There are eight main families — from anagrams to homophones. If you can identify the clue family early, you stop guessing randomly and start applying the right solving method."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-are-cryptic-clue-types", label: "What are cryptic clue types?" },
            { href: "#why-learning-clue-types-helps", label: "Why learning clue types helps" },
            { href: "#main-cryptic-clue-families", label: "Main clue families" },
            { href: "#clue-type-vs-difficulty", label: "Clue type vs difficulty" },
            { href: "#best-types-for-beginners", label: "Best types for beginners" },
            { href: "#practice-by-type", label: "How to practice by type" },
            { href: "#suggested-learning-order", label: "Suggested learning order" },
            { href: "#clue-types-faq", label: "Clue types FAQ" },
          ]}
        />

        <ContentSection title="What Are Cryptic Clue Types?" id="what-are-cryptic-clue-types">
          <BodyText>
            Clue types are categories that group cryptic clues by mechanism.
            They are not the same thing as difficulty labels. A clue can be
            easy or hard within the same family depending on how clearly it
            signals its structure. Learning clue types matters because the right
            category usually suggests the right solving workflow.
          </BodyText>
          <SubHeading>A Focused Set for Practical Learning</SubHeading>
          <BodyText>
            This page covers all eight main clue families used in cryptic
            crosswords. Beginners should start with anagrams and hidden words,
            which offer the most transparent mechanisms, then work through the
            others in the suggested order below.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Learning Clue Types Helps" id="why-learning-clue-types-helps">
          <SubHeading>Choosing Better Actions, Earlier</SubHeading>
          <BodyText>
            Strong solvers do not merely know more definitions. They recognize
            clue patterns earlier and therefore choose better solving actions.
            Once you suspect a clue is an anagram, charade, container, or double
            definition, you already know what kind of evidence to look for.
          </BodyText>
          <SubHeading>Reducing Wasted Effort</SubHeading>
          <BodyText>
            Pattern recognition reduces wasted effort. Instead of trying five
            unrelated ideas, you focus on one mechanism and ask whether the
            clue's language supports it. That shift alone often cuts down the
            number of false starts dramatically.
          </BodyText>
          <SubHeading>Building Confidence</SubHeading>
          <BodyText>
            When a clue looks difficult, many beginners assume they need
            inspiration. More often they need a clearer category. Once the clue
            type becomes visible, the solving path becomes narrower and therefore
            more manageable.
          </BodyText>
        </ContentSection>

        <ContentSection title="The Main Cryptic Clue Families" id="main-cryptic-clue-families">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.values(CLUE_TYPE_TOPICS).map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground">
                  {topic.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
                <p className="mt-3 text-xs font-semibold text-primary">
                  See examples →
                </p>
              </Link>
            ))}
          </div>
          <BodyText>
            Anagrams and hidden words are the best places to begin because
            they make the mechanism most visible. Charades build segmentation
            skills. Containers teach positional structure. Double definitions
            train semantic fairness. Reversals, homophones, and deletions
            round out the full toolkit.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Clue Type Differs from Difficulty" id="clue-type-vs-difficulty">
          <SubHeading>Mechanism vs. Resistance</SubHeading>
          <BodyText>
            Clue type tells you what kind of wordplay is happening. Difficulty
            tells you how obvious or demanding the clue is likely to feel. An
            anagram can be easy if the indicator and fodder are clear, or medium
            if the definition is subtle. A charade can be easy with simple parts
            or harder if abbreviations and segmentation are less obvious.
          </BodyText>
          <CalloutBox type="tip" title="Use the Right Page for the Right Goal">
            If you want to study a mechanism, use a clue-type page. If you want
            to control resistance and volume, use an easy, medium, or hard
            archive page instead. Mixing these up is one of the most common
            reasons beginners feel stuck.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Which Types Are Best for Beginners?" id="best-types-for-beginners">
          <BodyText>
            The clearest order for most users is: hidden words and anagrams
            first (they make the mechanism visible), then charades and
            containers (they teach structural parsing), then double
            definitions and homophones (they require semantic thinking), and
            finally reversals and deletions (they refine letter precision).
          </BodyText>
          <CalloutBox type="highlight" title="It Is a Training Sequence, Not a Law">
            If one clue type clicks early for you, lean into it — but keep the
            overall path structured. Skill compounds faster when categories are
            learned in batches instead of random fragments.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="How to Practice by Type" id="practice-by-type">
          <SubHeading>Focus Before You Mix</SubHeading>
          <BodyText>
            Practice works best when clue type and difficulty are both under
            control. Do three easy anagrams in a row. Then switch to charades
            and write down the parts before submitting. For containers, rebuild
            the answer from outside to inside. For double definitions, force
            yourself to restate both meanings before you check.
          </BodyText>
          <SubHeading>What a Good Study Block Looks Like</SubHeading>
          <BodyText>
            Solve two or three clues from one family, then pause and review what
            repeated. Was the main issue clue segmentation, indicator reading,
            definition testing, or order control? If you can name the repeated
            issue, the practice set has already become productive.
          </BodyText>
          <SubHeading>When to Start Mixing</SubHeading>
          <BodyText>
            Mixing practice is useful later, but early on it helps to compare
            related examples directly. That is how clue types stop being labels
            and become usable solving instincts.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Suggested Learning Order for New Solvers" id="suggested-learning-order">
          <StepList
            items={[
              {
                title: "Hidden Word — The Easiest Start",
                description:
                  "The answer is already written in the clue text. Perfect for learning to spot indicators and definitions for the first time.",
              },
              {
                title: "Anagram — Build Letter Discipline",
                description:
                  "Provides the clearest mechanical proof. Indicator, fodder, count, and definition can all be checked independently.",
              },
              {
                title: "Charade — Learn Segmentation",
                description:
                  "Move here once you are comfortable splitting clues into parts. Teaches you to read clue structure rather than just surface meaning.",
              },
              {
                title: "Container — Sharpen Positional Thinking",
                description:
                  "Add containers when you want to practice order and direction control inside a more structural framework.",
              },
              {
                title: "Double Definition — Test Semantic Fairness",
                description:
                  "Learn to judge meaning carefully instead of relying on visible letter work. Two meanings, one answer.",
              },
              {
                title: "Reversal — Train Directional Awareness",
                description:
                  "A simple operation with subtle misdirection. Read a word backwards and confirm the definition matches.",
              },
              {
                title: "Homophone — Think in Sound",
                description:
                  "The only clue type based on pronunciation. Learn to spot hearing indicators and find sound-alike pairs.",
              },
              {
                title: "Deletion — Precision Letter Removal",
                description:
                  "Remove specific letters from a word. Covers beheadment, curtailment, and internal deletion with distinct indicators.",
              },
            ]}
          />
          <BodyText>
            This sequence is a training scaffold, not a permanent rule. Once
            you have basic confidence in all four families, mix them freely.
            But in the early stage, ordered exposure helps the clue families
            feel distinct instead of blurred together.
          </BodyText>
        </ContentSection>

        <ContentSection title="FAQ About Cryptic Clue Types" id="clue-types-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/hidden-word",
              title: "Hidden word clues",
              description:
                "Start with the easiest clue type — the answer is hidden in the clue text.",
            },
            {
              href: "/cryptic-clue-types/anagram",
              title: "Anagram clues",
              description:
                "Build letter discipline with the most popular beginner-friendly clue family.",
            },
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Beginner guide",
              description:
                "Go back to the full start-here page if you want a simpler route.",
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
