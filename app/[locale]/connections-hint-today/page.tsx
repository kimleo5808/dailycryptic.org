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
import ConnectionsHintCard from "@/components/connections/ConnectionsHintCard";
import ConnectionsAnswerReveal from "@/components/connections/ConnectionsAnswerReveal";
import ConnectionsPuzzleCard from "@/components/connections/ConnectionsPuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getTodaysConnectionsPuzzle,
  getRecentConnectionsPuzzles,
} from "@/lib/connections-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What time does NYT Connections reset each day?",
    answer:
      "NYT Connections resets at midnight Eastern Time (ET) every day. That is 5:00 AM UTC or 9:00 PM PT the previous evening. A new set of 16 words and four groups is available as soon as the clock strikes midnight ET.",
  },
  {
    question: "How many guesses do you get in Connections?",
    answer:
      "You get four mistakes before the game ends. Each time you submit a group of four words that does not match a correct category, you lose one life. If you lose all four lives, the remaining answers are revealed and the game is over.",
  },
  {
    question: "What do the colors mean in NYT Connections?",
    answer:
      "The four colors represent difficulty levels. Yellow is the easiest and most straightforward. Green is moderate. Blue is tricky and often involves trivia or cultural knowledge. Purple is the hardest and usually involves wordplay, hidden patterns, or abstract connections.",
  },
  {
    question: "Can I play old Connections puzzles?",
    answer:
      "The official NYT Connections game only offers one puzzle per day with no built-in archive. However, you can browse our archive of past Connections puzzles with hints and answers for every previous date.",
  },
  {
    question: "Is there a strategy for solving Connections?",
    answer:
      "Yes. Start by scanning all 16 words for an obvious group, usually the yellow category. Solve the easiest group first to reduce the board. Watch for trap words that seem to fit multiple categories. Use the shuffle button to spot new visual patterns. Save your last guess for when you are confident.",
  },
  {
    question: "What is the hardest color in Connections?",
    answer:
      "Purple is consistently the hardest category. Purple groups often rely on wordplay, hidden patterns inside words, or abstract conceptual links that are not immediately obvious. Examples include words that all contain a hidden animal name or words that can follow a common prefix.",
  },
  {
    question: "How is Connections different from Wordle?",
    answer:
      "Wordle asks you to guess a single five-letter word using letter-by-letter feedback. Connections gives you 16 words and asks you to sort them into four groups of four based on shared themes. Wordle tests vocabulary and letter patterns. Connections tests categorisation, lateral thinking, and pattern recognition.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysConnectionsPuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "ConnectionsHintToday",
    title: `NYT Connections Hints Today — Clues and Answers ${dateStr}`,
    description: `Free hints and answers for today's NYT Connections puzzle. Progressive clues for all four color groups — yellow, green, blue, and purple. Updated daily.`,
    keywords: [
      "connections hint",
      "connections hints today",
      "nyt connections hints",
      "connections hint today",
      "connections puzzle hint",
      "connections game hint",
      "nyt connections answers",
    ],
    locale: locale as Locale,
    path: "/connections-hint-today",
    canonicalUrl: "/connections-hint-today",
  });
}

export default async function ConnectionsHintTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysConnectionsPuzzle();
  const recentPuzzles = await getRecentConnectionsPuzzles(4);

  if (!puzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Connections"
          title="NYT Connections Hints"
          description="Today's puzzle is being updated. Please check back shortly."
        />
      </div>
    );
  }

  const dateObj = new Date(puzzle.printDate + "T12:00:00Z");
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Hints",
            url: `${BASE_URL}/connections-hint-today`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Connections Hints Today — ${dateLabel}`,
          description:
            "Free hints and answers for today's NYT Connections puzzle. Progressive clues for all four color groups.",
          url: `${BASE_URL}/connections-hint-today`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Connections"
        title="NYT Connections Hints and Answers Today"
        description={`${dateLabel} — Puzzle #${puzzle.id}. Reveal hints one level at a time, or jump straight to the answers.`}
      />

      <div className="mt-8 space-y-8">
        {/* Daily hints */}
        <div className="space-y-3">
          {puzzle.groups.map((group) => (
            <ConnectionsHintCard
              key={group.color}
              color={group.color}
              hint={group.hint}
              groupName={group.name}
              words={group.words}
            />
          ))}
        </div>

        {/* Answer reveal */}
        <ConnectionsAnswerReveal groups={puzzle.groups} />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Connections is a
          trademark of The New York Times Company.
        </p>

        {/* Table of Contents */}
        <TableOfContents
          items={[
            { href: "#what-is-connections", label: "What is NYT Connections?" },
            { href: "#how-to-play", label: "How to play" },
            { href: "#color-levels", label: "What the colors mean" },
            { href: "#tips", label: "Tips and strategies" },
            { href: "#patterns", label: "Common category patterns" },
            { href: "#vs-other-games", label: "Connections vs other games" },
            { href: "#faq", label: "FAQ" },
            { href: "#archive", label: "Past puzzles" },
          ]}
        />

        {/* What Is Connections */}
        <ContentSection title="What Is NYT Connections?" id="what-is-connections">
          <BodyText>
            NYT Connections is a daily word puzzle from The New York Times. Each
            day you are given 16 words and must sort them into four groups of
            four. Each group shares a hidden connection — a common category,
            theme, or pattern.
          </BodyText>
          <BodyText>
            You have four chances to make a mistake. Every incorrect guess costs
            one life. If you lose all four lives, the remaining answers are
            revealed. After completing the puzzle, you can share your result as
            a grid of colored squares — similar to Wordle.
          </BodyText>
          <BodyText>
            A new puzzle is released every day at midnight Eastern Time. The
            game is free to play on the New York Times Games website and app.
          </BodyText>
        </ContentSection>

        {/* How to Play */}
        <ContentSection title="How to Play NYT Connections" id="how-to-play">
          <SubHeading>Step 1 — Scan All 16 Words</SubHeading>
          <BodyText>
            Read through every word before making any selections. Look for
            obvious groupings and note words that could belong to more than one
            category.
          </BodyText>
          <SubHeading>Step 2 — Look for the Easiest Group</SubHeading>
          <BodyText>
            The yellow group is always the most straightforward. Find four
            words with a clear, simple connection and start there. Solving one
            group reduces the board from 16 words to 12.
          </BodyText>
          <SubHeading>Step 3 — Select and Submit</SubHeading>
          <BodyText>
            Tap or click four words to select them, then hit submit. If your
            group is correct, those words are removed from the board. If
            incorrect, you lose one life.
          </BodyText>
          <SubHeading>Step 4 — Use Mistakes as Clues</SubHeading>
          <BodyText>
            When a guess is wrong, the game tells you it is incorrect but not
            which words are misplaced. Use this information to reconsider your
            groupings and try different combinations.
          </BodyText>
          <SubHeading>Step 5 — Share Your Results</SubHeading>
          <BodyText>
            After completing the puzzle — win or lose — you can share a spoiler-free
            grid showing which groups you solved and in what order. The
            colored squares show your path without revealing the actual answers.
          </BodyText>
        </ContentSection>

        {/* Difficulty Levels */}
        <ContentSection
          title="Connections Difficulty Levels — What the Colors Mean"
          id="color-levels"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
              <p className="font-heading text-sm font-bold text-amber-800 dark:text-amber-200">
                🟨 Yellow — Easiest
              </p>
              <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-100/80">
                The most straightforward category. Usually based on simple,
                well-known groupings like types of fruit, colors, or everyday
                objects. Most players solve this one first.
              </p>
            </div>
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
              <p className="font-heading text-sm font-bold text-emerald-800 dark:text-emerald-200">
                🟩 Green — Moderate
              </p>
              <p className="mt-1 text-sm text-emerald-900/80 dark:text-emerald-100/80">
                Requires a bit more thought. Categories may involve less obvious
                connections, secondary word meanings, or slightly niche
                knowledge areas.
              </p>
            </div>
            <div className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-950/40">
              <p className="font-heading text-sm font-bold text-blue-800 dark:text-blue-200">
                🟦 Blue — Tricky
              </p>
              <p className="mt-1 text-sm text-blue-900/80 dark:text-blue-100/80">
                Often involves trivia, cultural references, or knowledge of
                specific domains like music, film, or geography. These groups
                can surprise you.
              </p>
            </div>
            <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-950/40">
              <p className="font-heading text-sm font-bold text-purple-800 dark:text-purple-200">
                🟪 Purple — Hardest
              </p>
              <p className="mt-1 text-sm text-purple-900/80 dark:text-purple-100/80">
                The trickiest category, often involving wordplay, hidden
                patterns, or abstract links. Words might share a common prefix,
                contain a hidden word, or follow an unexpected rule.
              </p>
            </div>
          </div>
        </ContentSection>

        {/* Tips */}
        <ContentSection
          title="10 Tips and Strategies for Solving Connections"
          id="tips"
        >
          <SubHeading>Start with Yellow, End with Purple</SubHeading>
          <BodyText>
            The yellow group is designed to be the most obvious. Solve it first
            to reduce the board and build confidence before tackling harder
            categories.
          </BodyText>
          <SubHeading>Use the Shuffle Button</SubHeading>
          <BodyText>
            Shuffling the word order can reveal patterns you missed. Words that
            look unrelated when adjacent might click when rearranged.
          </BodyText>
          <SubHeading>Watch for Trap Words</SubHeading>
          <BodyText>
            The puzzle designers intentionally include words that seem to fit
            multiple groups. If a word feels too obvious for a category, it
            might be a decoy meant to trick you.
          </BodyText>
          <CalloutBox type="tip" title="The One-Away Rule">
            If you submit a guess and the game says you are &quot;one away,&quot;
            it means three of your four words are correct. Swap out just one
            word and try again.
          </CalloutBox>
          <SubHeading>Think Beyond the Obvious Meaning</SubHeading>
          <BodyText>
            Words can have multiple meanings. BARK could be a tree, a dog
            sound, or a type of boat. Consider every possible definition before
            committing.
          </BodyText>
          <SubHeading>Look for Word Patterns, Not Just Meanings</SubHeading>
          <BodyText>
            Purple groups often involve structural patterns: words containing a
            hidden color, words that can follow a common prefix, or words with
            a shared letter sequence.
          </BodyText>
          <SubHeading>Count Before You Commit</SubHeading>
          <BodyText>
            Before submitting, make sure you have found exactly four words, not
            three or five. Count the remaining words too — if only 12 remain,
            each group must have exactly four.
          </BodyText>
          <SubHeading>Eliminate Solved Groups First</SubHeading>
          <BodyText>
            After solving one group, the remaining words become easier to
            categorise. Fewer words means fewer possible combinations and
            clearer patterns.
          </BodyText>
          <SubHeading>Brush Up on Pop Culture</SubHeading>
          <BodyText>
            Blue and green categories frequently reference movies, TV shows,
            music, brands, or famous people. A broad pop culture knowledge base
            gives you an edge.
          </BodyText>
          <SubHeading>Save Your Last Guess</SubHeading>
          <BodyText>
            When you are down to one remaining life, do not guess unless you
            are confident. Take your time, reconsider the board, and only
            submit when you are sure.
          </BodyText>
        </ContentSection>

        {/* Category Patterns */}
        <ContentSection
          title="Common Connections Category Patterns"
          id="patterns"
        >
          <SubHeading>Synonym Groups</SubHeading>
          <BodyText>
            Four words that all mean the same thing. For example, GLAD, MERRY,
            JOLLY, and ELATED could all be grouped as &quot;words meaning
            happy.&quot; These often appear as yellow or green groups.
          </BodyText>
          <SubHeading>&quot;___ Word&quot; and &quot;Word ___&quot; Patterns</SubHeading>
          <BodyText>
            Four words that all pair with the same word. For example, FLASH,
            MOON, HIGH, and SPOT could all precede &quot;LIGHT.&quot; These
            are a favourite of the purple category.
          </BodyText>
          <SubHeading>Pop Culture and Trivia Groups</SubHeading>
          <BodyText>
            Categories based on specific knowledge areas: Marvel characters,
            Olympic sports, world capitals, or 90s sitcoms. These tend to
            appear as blue or green groups.
          </BodyText>
          <SubHeading>Hidden Word Tricks</SubHeading>
          <BodyText>
            Each word in the group contains a hidden word inside it. For
            example, BARED (RED), FOREIGN (REIGN), and PLUMBER (PLUM) each
            conceal a color or another word within their letters.
          </BodyText>
          <SubHeading>Letter Pattern Groups</SubHeading>
          <BodyText>
            Words that share a structural pattern: all contain a number
            (BONE → ONE), all start with a body part (ARMADA → ARM), or all
            end with the same three letters.
          </BodyText>
        </ContentSection>

        {/* vs Other Games */}
        <ContentSection
          title="NYT Connections vs Other Word Games"
          id="vs-other-games"
        >
          <SubHeading>Connections vs Wordle</SubHeading>
          <BodyText>
            Wordle gives you six attempts to guess a single five-letter word
            using letter-by-letter colour feedback. Connections gives you 16
            words and four attempts to sort them into groups. Wordle is about
            vocabulary and deduction. Connections is about categorisation and
            lateral thinking.
          </BodyText>
          <SubHeading>Connections vs Strands</SubHeading>
          <BodyText>
            Strands presents a letter grid where you find themed words hidden
            in a word search. Connections gives you the words upfront and asks
            you to find the hidden themes. Both test pattern recognition but
            in very different ways.
          </BodyText>
          <SubHeading>Connections vs Cryptic Crosswords</SubHeading>
          <BodyText>
            Cryptic crosswords use wordplay within individual clues — anagrams,
            containers, and hidden words. Connections tests your ability to see
            relationships between words. If you enjoy one, you will likely
            enjoy the other. Try our{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              daily cryptic clue
            </Link>{" "}
            for a different kind of word puzzle challenge.
          </BodyText>
        </ContentSection>

        {/* FAQ */}
        <ContentSection title="Connections Hints FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Recent puzzles */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Connections Puzzles" id="archive">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentPuzzles.map((p) => (
                <ConnectionsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/connections-hint"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                View All Connections Hints and Answers →
              </Link>
            </div>
          </ContentSection>
        )}

        {/* Related */}
        <RelatedLinks
          links={[
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description:
                "Solve a daily one-clue cryptic crossword with progressive hints.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description:
                "Unscramble letters and find every possible word instantly.",
            },
            {
              href: "/crossword-word-finder",
              title: "Word finder",
              description:
                "Search by letter pattern when you know some positions.",
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
