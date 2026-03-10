import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  DayRoutineGrid,
  ExamplePuzzleGrid,
  LearningBadge,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getExampleMinuteCrypticsByClueType } from "@/lib/minute-cryptic-data";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-09";

const FAQ_ITEMS = [
  {
    question: "Are cryptic crosswords good for beginners?",
    answer:
      "Yes. Beginners usually improve fastest when they work with one clear clue at a time, use hints with discipline, and review explanations immediately after each solve.",
  },
  {
    question: "What is the easiest cryptic clue type to learn first?",
    answer:
      "Hidden word clues are the easiest because the answer is literally written in the clue text. Anagram clues are the next best starting point because the indicator, letter pool, and answer length are all easy to verify.",
  },
  {
    question: "Should beginners use hints?",
    answer:
      "Yes, but only one level at a time. Hints work best when they redirect your thinking without replacing the solving process entirely.",
  },
  {
    question: "How many clues should a beginner solve in one session?",
    answer:
      "Three to five clues is usually enough. A short set gives repetition without turning review into low-quality guessing.",
  },
  {
    question: "Is it normal to understand the answer but not the wordplay?",
    answer:
      "Yes. That is one of the most common beginner stages. The key is to review the explanation until you can restate how the clue actually built the answer.",
  },
];

const SEVEN_DAY_ROUTINE = [
  {
    day: 1,
    title: "First Clue",
    description: "Solve one easy clue and review the full explanation before moving on.",
    focus: "Review Quality",
  },
  {
    day: 2,
    title: "Definition First",
    description: "Identify the definition before touching the hint system.",
    focus: "Clue Boundary",
  },
  {
    day: 3,
    title: "Mixed Session",
    description: "One clue from today's route and one from the archive.",
    focus: "Volume",
  },
  {
    day: 4,
    title: "Type Recognition",
    description: "Guess the clue family before you submit your answer.",
    focus: "Pattern Reading",
  },
  {
    day: 5,
    title: "Disciplined Hints",
    description: "Use only one hint per clue, then retry immediately.",
    focus: "Hint Control",
  },
  {
    day: 6,
    title: "Review Day",
    description: "Go back to solved clues and restate each mechanism in your own words.",
    focus: "Retention",
  },
  {
    day: 7,
    title: "Mixed Set",
    description: "One easy clue, one today's clue, one from a clue-type page you found difficult.",
    focus: "Integration",
  },
];

const CLUE_TYPE_CARDS = [
  {
    href: "/cryptic-clue-types/hidden-word",
    title: "Hidden word clues",
    badge: "easiest" as const,
    description:
      "The answer is spelled out inside the clue text. The most transparent mechanism — perfect for your very first cryptic clue.",
  },
  {
    href: "/cryptic-clue-types/anagram",
    title: "Anagram clues",
    badge: "easiest" as const,
    description:
      "Rearrange a set of letters into the answer. Ideal for beginners because you can verify the indicator, letter pool, count, and definition independently.",
  },
  {
    href: "/cryptic-clue-types/charade",
    title: "Charade clues",
    badge: "beginner" as const,
    description:
      "Build answers from smaller pieces placed in sequence. Teaches segmentation and makes clue structure easier to see.",
  },
  {
    href: "/cryptic-clue-types/container",
    title: "Container clues",
    badge: "intermediate" as const,
    description:
      "Place one set of letters inside another. Trains precise order control and positional thinking.",
  },
  {
    href: "/cryptic-clue-types/double-definition",
    title: "Double definition clues",
    badge: "beginner" as const,
    description:
      "Two meanings point to the same answer. Sharpens your ability to demand fair definitions instead of settling for something that merely sounds close.",
  },
  {
    href: "/cryptic-clue-types/reversal",
    title: "Reversal clues",
    badge: "beginner" as const,
    description:
      "Read a word backwards to find the answer. A simple operation that trains directional awareness.",
  },
  {
    href: "/cryptic-clue-types/homophone",
    title: "Homophone clues",
    badge: "intermediate" as const,
    description:
      "The answer sounds like another word. The only clue type based on pronunciation rather than spelling.",
  },
  {
    href: "/cryptic-clue-types/deletion",
    title: "Deletion clues",
    badge: "intermediate" as const,
    description:
      "Remove specific letters from a word to form the answer. Covers beheadment, curtailment, and internal deletion.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Beginners",
    title: "Cryptic Crossword for Beginners: How to Start Solving Clues",
    description:
      "Learn how cryptic crossword clues work with simple examples, beginner-friendly solving steps, and easy practice routes on DailyCryptic.",
    keywords: [
      "cryptic crossword for beginners",
      "beginner cryptic clues",
      "how to start cryptic crosswords",
      "easy cryptic crossword for beginners",
      "how to solve cryptic clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-crossword-for-beginners",
    canonicalUrl: "/cryptic-crossword-for-beginners",
  });
}

export default async function CrypticCrosswordForBeginnersPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const anagrams = await getExampleMinuteCrypticsByClueType("anagram", 2);
  const charades = await getExampleMinuteCrypticsByClueType("charade", 1);
  const examples = [...anagrams, ...charades].slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Cryptic Crossword for Beginners",
            url: `${BASE_URL}/cryptic-crossword-for-beginners`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Cryptic Crossword for Beginners: How to Start Solving Clues",
          description:
            "Learn how cryptic crossword clues work with simple examples, beginner-friendly solving steps, and easy practice routes on DailyCryptic.",
          url: `${BASE_URL}/cryptic-crossword-for-beginners`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd
        data={howToSchema(
          "How to start solving cryptic crossword clues",
          "A beginner-friendly three-step method for separating definition, wordplay, and proof in minute cryptic puzzles.",
          [
            {
              name: "Find the likely definition",
              text: "Start by testing the beginning and end of the clue for the most likely definition phrase.",
            },
            {
              name: "Check the answer length",
              text: "Use enumeration to reject answers that do not fit the required letter count immediately.",
            },
            {
              name: "Prove the wordplay",
              text: "Confirm the clue type and make sure the wordplay supports the same answer as the definition.",
            },
          ]
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Beginner Guide"
        title="Cryptic Crossword for Beginners"
        description="Cryptic clues stop feeling chaotic once you know what to look for. This guide explains the basic structure, the easiest clue families to learn first, and where to practice next on DailyCryptic."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-cryptic-crossword", label: "What is a cryptic crossword?" },
            { href: "#how-a-cryptic-clue-works", label: "How a cryptic clue works" },
            { href: "#best-clue-types-for-beginners", label: "Best clue types for beginners" },
            { href: "#simple-solving-method", label: "A simple solving method" },
            { href: "#common-beginner-mistakes", label: "Common beginner mistakes" },
            { href: "#beginner-practice-clues", label: "Beginner practice clues" },
            { href: "#where-to-practice-next", label: "Where to practice next" },
            { href: "#starter-routine", label: "7-Day starter routine" },
            { href: "#beginner-faq", label: "Beginner FAQ" },
          ]}
        />

        <ContentSection
          title="What Is a Cryptic Crossword?"
          id="what-is-a-cryptic-crossword"
        >
          <BodyText>
            A cryptic crossword clue usually contains two layers at once. One
            part gives you a direct definition of the answer, and the other
            part gives you a wordplay mechanism that builds the same answer in a
            less obvious way. That is the central difference between cryptic
            clues and regular crossword clues.
          </BodyText>
          <SubHeading>Why Structure Matters More Than Vocabulary</SubHeading>
          <BodyText>
            Beginners often think cryptics require obscure vocabulary or lucky
            intuition. In practice, progress comes from recognizing structure.
            Once you learn to separate definition from wordplay, the clue stops
            being a sentence-shaped mystery and becomes a sequence of checks you
            can actually run.
          </BodyText>
        </ContentSection>

        <ContentSection title="How a Cryptic Clue Works" id="how-a-cryptic-clue-works">
          <BodyText>
            Most clues place the definition near the beginning or the end. That
            is not an unbreakable rule, but it is a useful first test. The rest
            of the clue usually contains instructions such as rearrange these
            letters, join these parts, place one group inside another, or read
            two meanings at once.
          </BodyText>
          <BodyText>
            If you only check meaning, you will get near misses. If you only
            check mechanism, you may build a technically neat answer that does
            not fit the definition. The goal is always the same: one answer,
            two clean justifications.
          </BodyText>
          <SubHeading>Two-Pass Reading</SubHeading>
          <BodyText>
            A useful beginner habit is to separate clue reading into two
            passes. The first pass reads for plain meaning. The second pass
            reads for structure. Many beginners only do the first pass, which
            makes the clue feel clever but unfair. Once you deliberately reread
            for structure, indicator words and possible clue boundaries start to
            appear much more often than you expect.
          </BodyText>
          <SubHeading>Using Enumeration as a Filter</SubHeading>
          <BodyText>
            Answer length is not only there to help you fill squares. It keeps
            your reasoning honest. If a candidate word does not fit the count,
            you can drop it immediately and move on without emotional attachment.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="The 8 Cryptic Clue Types"
          id="best-clue-types-for-beginners"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {CLUE_TYPE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">{card.title}</h3>
                  <LearningBadge variant={card.badge} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <p className="mt-3 text-xs font-semibold text-primary">
                  See examples →
                </p>
              </Link>
            ))}
          </div>
          <CalloutBox type="highlight" title="Recommended Learning Order">
            Hidden Word → Anagram → Charade → Container → Double Definition →
            Reversal → Homophone → Deletion. Start with the most transparent
            mechanisms and work toward more subtle ones.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="A Simple 3-Step Solving Method" id="simple-solving-method">
          <StepList
            items={[
              {
                title: "Find the Likely Definition",
                description:
                  "Test clue boundaries first. The definition usually sits at the very beginning or the very end of the clue.",
              },
              {
                title: "Check the Answer Length",
                description:
                  "Enumeration is a hard filter, not a soft suggestion. If a candidate word does not fit the count, drop it immediately.",
              },
              {
                title: "Prove the Wordplay",
                description:
                  "Confirm the clue type and make sure the wordplay mechanism supports the same answer as the definition before you submit.",
              },
            ]}
          />
          <SubHeading>Why This Order Matters</SubHeading>
          <BodyText>
            A repeatable process builds confidence much faster than occasional
            lucky solves. Beginners who adopt a disciplined solve order usually
            improve faster than those who consume lots of theory without
            practicing a fixed routine.
          </BodyText>
          <CalloutBox type="tip" title="Emotional Control">
            Cryptic clues often create strong but misleading first impressions.
            A step-based approach prevents you from committing too early to a
            surface-level answer. Use the same order repeatedly until it becomes
            natural: definition, count, mechanism, proof.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="What Beginners Usually Misunderstand About Cryptics"
          id="what-beginners-usually-misunderstand"
        >
          <SubHeading>Cryptics Are About Structure, Not Vocabulary</SubHeading>
          <BodyText>
            Many beginners assume cryptics are mainly about tricky vocabulary.
            In reality, most progress comes from reading clues as systems rather
            than as riddles. The answer is rarely hidden by a needlessly obscure
            word — it is more often hidden by a failure to separate what the
            clue means from what the clue is doing.
          </BodyText>
          <SubHeading>Speed Is Not the Goal Early On</SubHeading>
          <BodyText>
            Fast guessing creates weak habits. Slow proof creates strong habits.
            Once your proof quality improves, speed follows almost by itself
            because you stop wasting time on weak answer paths.
          </BodyText>
          <SubHeading>Hints Are a Tool, Not a Sign of Failure</SubHeading>
          <BodyText>
            On a learning site, hints work best when they preserve your
            involvement. The real risk is not using hints — the real risk is
            opening too many hints before you retry the clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Beginner Mistakes" id="common-beginner-mistakes">
          <CalloutBox type="warning" title="Watch for These Patterns">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Guessing from surface meaning only</li>
              <li>Ignoring wordplay once an attractive answer appears</li>
              <li>Opening several hints before re-attempting the clue</li>
              <li>Reading the clue like a normal sentence instead of a structured prompt</li>
            </ul>
          </CalloutBox>
          <SubHeading>The Surface Reading Trap</SubHeading>
          <BodyText>
            Good cryptic clues often hide their logic in fluent language. You do
            not beat that misdirection by reading more dramatically. You beat it
            by asking what each clue segment is actually doing — definition,
            indicator, fodder, or linking word.
          </BodyText>
        </ContentSection>

        <ExamplePuzzleGrid
          id="beginner-practice-clues"
          puzzles={examples}
          title="3 Beginner-Friendly Practice Clues"
          intro="These examples are good training clues because the mechanism is visible enough to learn from but still representative of real daily solving. Work through the clue, identify the likely definition, then confirm the wordplay against the published explanation."
        />

        <ContentSection title="Where Beginners Should Practice Next" id="where-to-practice-next">
          <SubHeading>The Best First Steps</SubHeading>
          <BodyText>
            The best next step is not to search for harder theory. It is to run
            short sets of real clues in a controlled order. Start with easy
            practice clues, then try today's clue even if you need one hint.
            After each solve, compare your own reasoning to the published
            explanation and write down one thing you misread.
          </BodyText>
          <SubHeading>A Simple Weekly Routine</SubHeading>
          <BodyText>
            One clue per day, one archive clue every other day, and one repeated
            review habit. That is enough volume to build pattern memory without
            overwhelming yourself.
          </BodyText>
          <SubHeading>The Practice Loop</SubHeading>
          <BodyText>
            Begin with easy clue archives, then study clue types when one
            mechanism keeps repeating, then use today's clue as your daily
            benchmark. Learn the pattern → solve a live clue → reinforce with
            archive repetition. That loop is much more effective than reading
            five guides in a row and solving nothing.
          </BodyText>
        </ContentSection>

        <ContentSection title="A 7-Day Starter Routine for New Solvers" id="starter-routine">
          <BodyText>
            You do not need long sessions to improve. Seven short days with a
            clear focus is enough to build the pattern recognition that makes
            cryptic clues feel manageable.
          </BodyText>
          <DayRoutineGrid items={SEVEN_DAY_ROUTINE} />
          <CalloutBox type="highlight" title="The Goal of This Routine">
            Not endurance — familiarity. Once the solving process feels familiar,
            the intimidation factor drops sharply and your attention can move
            from confusion to craft.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Cryptic Crossword for Beginners FAQ" id="beginner-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types",
              title: "Cryptic clue types",
              description:
                "Explore all eight clue families with examples and solving methods.",
            },
            {
              href: "/minute-cryptic/easy",
              title: "Easy cryptic clues",
              description:
                "Move from theory to beginner-friendly practice with archive filtering.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's minute cryptic",
              description:
                "Apply the beginner workflow on the latest live clue.",
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
