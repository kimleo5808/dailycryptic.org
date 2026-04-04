import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import StrandsGame from "@/components/strands/StrandsGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getTodaysStrandsPuzzle,
  getRawTodaysStrandsPuzzle,
  getTodaysStrandsBoard,
} from "@/lib/strands-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "Is this the official NYT Strands game?",
    answer:
      "No. This is an independent fan-made version that uses the same daily puzzle data as the New York Times Strands game. We are not affiliated with The New York Times. Visit nytimes.com/games/strands for the official version.",
  },
  {
    question: "How do I select words on the grid?",
    answer:
      "Click or tap a letter to start, then drag your finger or mouse through adjacent letters (including diagonals) to spell a word. Release to submit. Letters must be connected — you cannot jump across the board.",
  },
  {
    question: "What is the spangram?",
    answer:
      "The spangram is a special theme word that spans the entire board from one side to the other. It describes the overall theme of the puzzle. Finding it highlights the path in yellow.",
  },
  {
    question: "How do hints work in Strands?",
    answer:
      "Every time you find three valid non-theme words (four letters or more), you earn one hint. Using a hint highlights the first letter of a random unfound theme word on the grid.",
  },
  {
    question: "Is there a guess limit in Strands?",
    answer:
      "No. Unlike Connections, Strands has no mistake limit. You can keep guessing until you find all theme words and the spangram. The challenge is finding them efficiently.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "StrandsGame",
    title: "Play Strands Online Free — Daily Word Search Puzzle",
    description:
      "Play today's Strands puzzle or any past puzzle from the archive. Find hidden theme words in the letter grid. Free, no login required. New puzzle every day.",
    keywords: [
      "strands game",
      "play strands online",
      "strands puzzle",
      "strands word game",
      "nyt strands game",
      "strands free",
      "word search puzzle",
    ],
    locale: locale as Locale,
    path: "/strands-game",
    canonicalUrl: "/strands-game",
  });
}

export default async function StrandsGamePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysStrandsPuzzle();
  const rawPuzzle = await getRawTodaysStrandsPuzzle();
  const board = await getTodaysStrandsBoard();

  if (!puzzle || !rawPuzzle || !board || !board.startingBoard || board.startingBoard.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Game"
          title="Play Strands"
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
            name: "Play Strands",
            url: `${BASE_URL}/strands-game`,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Strands Word Puzzle Game",
          description:
            "Play today's Strands puzzle — find hidden theme words in the letter grid.",
          url: `${BASE_URL}/strands-game`,
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
        title="Play Strands Online Free"
        description={`Puzzle #${puzzle.id} — ${dateLabel}. Find all the hidden theme words in the letter grid.`}
      />

      <div className="mt-8 space-y-8">
        {/* Game */}
        <StrandsGame
          puzzleId={puzzle.id}
          clue={puzzle.clue}
          startingBoard={board.startingBoard}
          encodedThemeCoords={board.themeCoords}
          encodedSpangram={rawPuzzle.spangram}
          spangramCoords={board.spangramCoords}
          encodedThemeWords={rawPuzzle.themeWords}
        />

        {/* Stuck link */}
        <div className="text-center">
          <Link
            href="/strands-hint-today"
            className="text-sm font-medium text-primary hover:underline"
          >
            Stuck? See today&apos;s hints →
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Strands is a
          trademark of The New York Times Company.
        </p>

        {/* TOC */}
        <TableOfContents
          items={[
            { href: "#how-to-play", label: "How to play Strands" },
            { href: "#spangram", label: "What is the spangram?" },
            { href: "#hints", label: "How hints work" },
            { href: "#tips", label: "Tips and strategies" },
            { href: "#vs-connections", label: "Strands vs Connections" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        {/* How to Play */}
        <ContentSection title="How to Play Strands" id="how-to-play">
          <SubHeading>The Goal</SubHeading>
          <BodyText>
            You are given a grid of letters, usually eight rows by six columns.
            Hidden inside the grid are several theme words and one special word
            called the spangram. Your job is to find every theme word by
            tracing connected paths through the letters.
          </BodyText>
          <SubHeading>Selecting Letters</SubHeading>
          <BodyText>
            Click or tap a letter to begin, then drag through adjacent letters
            — horizontally, vertically, or diagonally. Each letter in your path
            must touch the previous one. Release to submit the word. You cannot
            skip letters or jump across the grid.
          </BodyText>
          <SubHeading>Theme Words and the Board</SubHeading>
          <BodyText>
            Every letter on the board belongs to exactly one theme word or the
            spangram. When you find a theme word, its letters turn blue. When
            you find the spangram, its letters turn yellow. The puzzle is
            complete when every cell on the board is coloured.
          </BodyText>
        </ContentSection>

        {/* Spangram */}
        <ContentSection title="What Is the Spangram?" id="spangram">
          <SubHeading>The Theme Word That Spans the Board</SubHeading>
          <BodyText>
            The spangram is a special word that stretches across the entire
            board from one edge to the opposite edge — either left to right
            or top to bottom. It reveals the overall theme of the puzzle. For
            example, if the clue is &quot;Early risers&quot;, the spangram
            might be SPRINGBLOSSOM, connecting flowers that bloom in spring.
          </BodyText>
          <SubHeading>Why the Spangram Matters</SubHeading>
          <BodyText>
            Finding the spangram early gives you a major advantage. Once you
            know the theme, the remaining words become much easier to spot.
            Many experienced players start by looking for the spangram before
            hunting for individual theme words.
          </BodyText>
        </ContentSection>

        {/* Hints */}
        <ContentSection title="How Hints Work" id="hints">
          <SubHeading>Earning Hints</SubHeading>
          <BodyText>
            Every time you find three valid words that are not theme words
            (at least four letters long), you earn one hint. Valid words are
            real English words that can be traced through connected letters
            on the board.
          </BodyText>
          <SubHeading>Using a Hint</SubHeading>
          <BodyText>
            When you use a hint, the game highlights the first letter of a
            random unfound theme word. This gives you a starting point to
            trace from. Hints are especially useful when you have found most
            words but are stuck on the last one or two.
          </BodyText>
        </ContentSection>

        {/* Tips */}
        <ContentSection title="Tips and Strategies" id="tips">
          <SubHeading>Read the Clue Carefully</SubHeading>
          <BodyText>
            The clue is your biggest asset. It hints at the theme that
            connects all the hidden words. A clue like &quot;Early
            risers&quot; could mean flowers, early birds, or morning
            routines — consider all possible interpretations.
          </BodyText>
          <SubHeading>Hunt for the Spangram First</SubHeading>
          <BodyText>
            The spangram must touch two opposite edges of the board, which
            limits where it can start and end. Scan the edges for promising
            starting letters and try to trace a theme-related word across
            the board.
          </BodyText>
          <SubHeading>Work from Known Letters</SubHeading>
          <BodyText>
            Once you find a few theme words and the board starts filling with
            colour, the remaining blank letters form smaller and smaller
            groups. Use these isolated clusters to narrow down where the
            remaining words must be.
          </BodyText>
          <SubHeading>Use Non-Theme Words Strategically</SubHeading>
          <BodyText>
            Finding non-theme words is not wasted effort. Every three valid
            words earn you a hint. If you are stuck, hunt for common short
            words to build up hints rather than staring at the board.
          </BodyText>
          <SubHeading>Need More Help?</SubHeading>
          <BodyText>
            If you are completely stuck, check our{" "}
            <Link
              href="/strands-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Strands hints page
            </Link>{" "}
            for progressive clues — from vague hints to the spangram and full
            answers.
          </BodyText>
        </ContentSection>

        {/* Strands vs Connections */}
        <ContentSection title="Strands vs Connections" id="vs-connections">
          <SubHeading>Different Puzzle Formats</SubHeading>
          <BodyText>
            Connections gives you 16 loose words and asks you to group them
            into four categories. Strands hides words in a letter grid and
            asks you to find them by tracing paths. Both test pattern
            recognition, but Strands adds a spatial element.
          </BodyText>
          <SubHeading>No Mistake Limit</SubHeading>
          <BodyText>
            In Connections, four wrong guesses end the game. In Strands,
            there is no penalty for wrong guesses — you just keep searching.
            This makes Strands more relaxing but also removes the tension
            that makes Connections exciting.
          </BodyText>
          <SubHeading>Play Both</SubHeading>
          <BodyText>
            Many players do both puzzles daily as part of their morning
            routine. Try our{" "}
            <Link
              href="/connections-game"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Connections game
            </Link>{" "}
            and pair it with a{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              daily cryptic clue
            </Link>{" "}
            for a complete five-minute brain workout.
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
              href: "/strands-hint-today",
              title: "Strands hints",
              description:
                "Progressive hints for today's puzzle — reveal as much or as little as you need.",
            },
            {
              href: "/connections-game",
              title: "Play Connections",
              description:
                "Sort 16 words into four hidden groups in our free Connections game.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Daily cryptic clue",
              description:
                "Solve a one-clue cryptic crossword with progressive hints.",
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
