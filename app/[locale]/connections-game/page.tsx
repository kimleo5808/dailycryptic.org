import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ConnectionsGame from "@/components/connections/ConnectionsGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { getTodaysConnectionsPuzzle, getRawTodaysConnectionsPuzzle } from "@/lib/connections-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "Is this the official NYT Connections game?",
    answer:
      "No. This is an independent fan-made version that uses the same daily puzzle data as the New York Times Connections game. We are not affiliated with The New York Times. If you want to play the official version, visit nytimes.com/games/connections.",
  },
  {
    question: "Can I play old Connections puzzles?",
    answer:
      "Yes. Browse our Connections archive to find any past puzzle and play it right here. The official NYT game only offers one puzzle per day with no way to replay older ones.",
  },
  {
    question: "How often is a new puzzle added?",
    answer:
      "A new puzzle is added every day, matching the official NYT Connections schedule. The puzzle updates around midnight Eastern Time.",
  },
  {
    question: "Do I need to create an account to play?",
    answer:
      "No. You can play for free without signing up, logging in, or creating any account. Just open the page and start playing.",
  },
  {
    question: "What does 'one away' mean in Connections?",
    answer:
      "When the game tells you that you are 'one away', it means three of the four words you selected belong to the same group. You only need to swap out one word to get the correct answer. This feedback helps you narrow down your next guess.",
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
    page: "ConnectionsGame",
    title: `Play Connections Online Free — Daily Puzzle & Unlimited Archive`,
    description: `Play today's Connections puzzle or any past puzzle from the archive. Sort 16 words into four hidden groups. Free, no login required. New puzzle every day.`,
    keywords: [
      "connections game",
      "play connections online",
      "connections unlimited",
      "connections puzzle game",
      "connections game free",
      "connections word game",
      "nyt connections game",
    ],
    locale: locale as Locale,
    path: "/connections-game",
    canonicalUrl: "/connections-game",
  });
}

export default async function ConnectionsGamePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysConnectionsPuzzle();
  const rawPuzzle = await getRawTodaysConnectionsPuzzle();

  if (!puzzle || !rawPuzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Game"
          title="Play Connections"
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

  // Pass encoded data to client — decoded client-side to avoid answers in page source
  const encodedGroups = rawPuzzle.groups.map((g) => ({
    color: g.color,
    name: g.name,
    words: g.words,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Play Connections",
            url: `${BASE_URL}/connections-game`,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Connections Puzzle Game",
          description:
            "Play today's Connections puzzle — sort 16 words into four hidden groups.",
          url: `${BASE_URL}/connections-game`,
          applicationCategory: "Game",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Game"
        title="Play Connections Online Free"
        description={`Puzzle #${puzzle.id} — ${dateLabel}. Sort 16 words into four groups of four. Find the hidden connections before you run out of guesses.`}
      />

      <div className="mt-8 space-y-8">
        {/* Game */}
        <ConnectionsGame puzzleId={puzzle.id} encodedGroups={encodedGroups} />

        {/* Stuck link */}
        <div className="text-center">
          <Link
            href="/connections-hint-today"
            className="text-sm font-medium text-primary hover:underline"
          >
            Stuck? See today&apos;s hints →
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Connections is a
          trademark of The New York Times Company.
        </p>

        {/* TOC */}
        <TableOfContents
          items={[
            { href: "#how-to-play", label: "How to play" },
            { href: "#unlimited", label: "Play Connections unlimited" },
            { href: "#difficulty", label: "Difficulty explained" },
            { href: "#tips", label: "Quick solving tips" },
            { href: "#why-addictive", label: "What makes it addictive" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        {/* How to Play */}
        <ContentSection title="How to Play Connections" id="how-to-play">
          <SubHeading>The Goal</SubHeading>
          <BodyText>
            You are given 16 words. Your job is to sort them into four groups
            of four words each. Every group shares a hidden connection — a
            common theme, category, or pattern.
          </BodyText>
          <SubHeading>Selecting and Submitting</SubHeading>
          <BodyText>
            Tap four words to select them, then press Submit. If all four
            belong to the same group, they are removed from the board and
            revealed as a solved category. If not, you lose a life.
          </BodyText>
          <SubHeading>Mistakes and Game Over</SubHeading>
          <BodyText>
            You have four lives. Each wrong guess costs one life. If you
            lose all four, the game ends and the remaining answers are
            revealed automatically.
          </BodyText>
          <SubHeading>The &quot;One Away&quot; Clue</SubHeading>
          <BodyText>
            If three of your four selected words belong to the same group,
            the game shows &quot;One away!&quot; — swap out just one word
            and try again. This is one of the most useful pieces of feedback
            in the game.
          </BodyText>
        </ContentSection>

        {/* Unlimited */}
        <ContentSection
          title="Play Connections Unlimited"
          id="unlimited"
        >
          <SubHeading>Why Only One Puzzle Per Day?</SubHeading>
          <BodyText>
            The official NYT Connections game releases one new puzzle every
            24 hours. Once you finish it, you have to wait until midnight
            Eastern Time for the next one.
          </BodyText>
          <SubHeading>Play Any Past Puzzle Here</SubHeading>
          <BodyText>
            We keep a full archive of every past Connections puzzle. Browse
            the{" "}
            <Link
              href="/connections-hint"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Connections archive
            </Link>{" "}
            and play any puzzle you missed — or replay your favourites.
          </BodyText>
          <SubHeading>Practice Without Limits</SubHeading>
          <BodyText>
            No account needed, no daily limit, completely free. Play as many
            puzzles as you want to sharpen your pattern recognition skills.
          </BodyText>
        </ContentSection>

        {/* Difficulty */}
        <ContentSection
          title="Connections Difficulty Explained"
          id="difficulty"
        >
          <SubHeading>🟨 Yellow — Start Here</SubHeading>
          <BodyText>
            The easiest group with the most straightforward connection.
            Usually common categories like types of food, animals, or colours.
          </BodyText>
          <SubHeading>🟩 Green — A Step Up</SubHeading>
          <BodyText>
            Slightly harder. May involve less obvious groupings or words with
            multiple meanings that make the connection less immediately clear.
          </BodyText>
          <SubHeading>🟦 Blue — Knowledge Required</SubHeading>
          <BodyText>
            Often tests specific knowledge — trivia, pop culture references,
            geography, or niche vocabulary. Broader general knowledge helps.
          </BodyText>
          <SubHeading>🟪 Purple — The Real Challenge</SubHeading>
          <BodyText>
            The hardest group. Frequently involves wordplay: hidden words
            inside other words, shared prefixes or suffixes, or abstract
            conceptual patterns that require lateral thinking.
          </BodyText>
        </ContentSection>

        {/* Tips */}
        <ContentSection title="Quick Solving Tips" id="tips">
          <SubHeading>Solve the Obvious Group First</SubHeading>
          <BodyText>
            Yellow is designed to be easy. Find it first to remove four words
            from the board and make the remaining groups clearer.
          </BodyText>
          <SubHeading>Beware of Red Herring Words</SubHeading>
          <BodyText>
            Some words are intentionally placed to fit multiple categories.
            If a word seems to belong to two groups, it is probably a trap in
            the easier one.
          </BodyText>
          <SubHeading>Use Shuffle to Break Assumptions</SubHeading>
          <BodyText>
            Rearranging the grid can reveal patterns you could not see before.
            Hit Shuffle whenever you feel stuck — a fresh layout often
            triggers new connections.
          </BodyText>
          <SubHeading>
            Think About Word Structure, Not Just Meaning
          </SubHeading>
          <BodyText>
            Purple groups often rely on the letters inside words rather than
            their definitions. Look for hidden words, shared letter patterns,
            or words that can follow a common prefix.
          </BodyText>
          <SubHeading>Need More Help?</SubHeading>
          <BodyText>
            If you are completely stuck, check our{" "}
            <Link
              href="/connections-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Connections hints page
            </Link>{" "}
            for progressive clues — from vague hints to group names to full
            answers. You control how much you reveal.
          </BodyText>
        </ContentSection>

        {/* Why addictive */}
        <ContentSection
          title="What Makes Connections Addictive?"
          id="why-addictive"
        >
          <SubHeading>The &quot;Aha&quot; Moment</SubHeading>
          <BodyText>
            The satisfaction of spotting a hidden pattern that nobody else sees
            is uniquely rewarding. When the purple group finally clicks, the
            dopamine rush is real.
          </BodyText>
          <SubHeading>Shareable Results</SubHeading>
          <BodyText>
            Just like Wordle, you can share your results as a spoiler-free grid
            of coloured squares. Comparing scores with friends turns a solo
            puzzle into a social experience.
          </BodyText>
          <SubHeading>Daily Ritual</SubHeading>
          <BodyText>
            One new puzzle per day creates a healthy habit. Pair it with your
            morning coffee, your{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              daily cryptic clue
            </Link>
            , and you have a perfect five-minute brain workout.
          </BodyText>
        </ContentSection>

        {/* FAQ */}
        <ContentSection title="FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Related */}
        <RelatedLinks
          links={[
            {
              href: "/connections-hint-today",
              title: "Connections hints",
              description:
                "Progressive hints for today's puzzle — reveal as much or as little as you need.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Daily cryptic clue",
              description:
                "Solve a one-clue cryptic crossword with progressive hints.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description:
                "Unscramble letters and find every possible word.",
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
