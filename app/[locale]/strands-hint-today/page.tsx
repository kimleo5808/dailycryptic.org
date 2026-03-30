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
import StrandsThemeCard from "@/components/strands/StrandsThemeCard";
import StrandsSpangramReveal from "@/components/strands/StrandsSpangramReveal";
import StrandsWordList from "@/components/strands/StrandsWordList";
import StrandsPuzzleCard from "@/components/strands/StrandsPuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getTodaysStrandsPuzzle,
  getRawTodaysStrandsPuzzle,
  getRecentStrandsPuzzles,
} from "@/lib/strands-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What time does NYT Strands reset each day?",
    answer:
      "NYT Strands resets at midnight Eastern Time (ET) every day. That is 9:00 PM Pacific Time or 5:00 AM UTC. The new puzzle is available immediately after reset on the NYT website and the NYT Games app.",
  },
  {
    question: "How many words are in each Strands puzzle?",
    answer:
      "Each puzzle typically contains six to ten theme words plus one spangram. The exact count varies daily. All 48 letters on the 6×8 grid are used -- every single letter belongs to exactly one word, with nothing left over.",
  },
  {
    question: "What is a spangram in NYT Strands?",
    answer:
      "The spangram is a special word or phrase that describes the puzzle's overall theme. It physically spans from one edge of the grid to the opposite edge. When found, the spangram highlights in yellow, while regular theme words highlight in blue.",
  },
  {
    question: "How do hints work in Strands?",
    answer:
      "Find three non-theme words (each at least four letters long) to earn one hint. Using a hint highlights the letters of one undiscovered theme word on the grid, showing you exactly where it sits. You can earn unlimited hints this way.",
  },
  {
    question: "Can I play old Strands puzzles?",
    answer:
      "The official NYT site only offers today's puzzle with no built-in archive. However, you can browse hints, spangrams, and answers for every past Strands puzzle in our Strands Archive.",
  },
  {
    question: 'What does "Perfect" mean in Strands?',
    answer:
      "A Perfect score means you found all theme words and the spangram without using any hints. There is no penalty for using hints -- your puzzle still counts as solved -- but experienced players treat a hint-free solve as the ultimate goal.",
  },
  {
    question: "Is NYT Strands free to play?",
    answer:
      "Yes. Strands is completely free and does not require an NYT Games subscription. You can play in any web browser or through the official NYT Games app on iOS and Android.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Read the Theme Clue",
    text: "Every puzzle displays a clue at the top of the board. It might be literal -- like 'Types of fruit' -- or a clever pun such as 'Can I have my quarter back?' The clue is your most important starting point.",
  },
  {
    name: "Trace Words Through the Grid",
    text: "Drag or tap adjacent letters to form words. Paths can go in all eight directions -- horizontal, vertical, and diagonal -- and can change direction mid-word. Every word must be at least four letters long.",
  },
  {
    name: "Find the Spangram",
    text: "The spangram is a special word that touches two opposite edges of the board and describes the overall theme. Finding it early reveals what all the other theme words have in common.",
  },
  {
    name: "Earn and Use Hints",
    text: "Finding three valid non-theme words (four or more letters each) earns you one hint. A hint highlights the letters of an undiscovered theme word on the grid. Hints are optional and you can earn as many as you need.",
  },
  {
    name: "Fill Every Letter",
    text: "The puzzle is complete when all 48 letters on the board belong to a found word. No letter goes unused. Solving without any hints earns you a Perfect rating.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysStrandsPuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "StrandsHintToday",
    title: `NYT Strands Hints Today -- Spangram, Theme Words and Answers ${dateStr}`,
    description: `Free hints and answers for today's NYT Strands puzzle. Progressive spangram clues, theme word reveals, and expert strategies. Updated daily.`,
    keywords: [
      "strands hint",
      "strands hints today",
      "nyt strands hints",
      "strands spangram today",
      "strands answers today",
      "nyt strands today",
      "strands theme today",
    ],
    locale: locale as Locale,
    path: "/strands-hint-today",
    canonicalUrl: "/strands-hint-today",
  });
}

export default async function StrandsHintTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysStrandsPuzzle();
  const rawPuzzle = await getRawTodaysStrandsPuzzle();
  const recentPuzzles = await getRecentStrandsPuzzles(4);

  if (!puzzle || !rawPuzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Strands"
          title="NYT Strands Hints"
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
            name: "Strands Hints",
            url: `${BASE_URL}/strands-hint-today`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Strands Hints Today -- ${dateLabel}`,
          description:
            "Free hints and answers for today's NYT Strands puzzle. Progressive spangram clues, theme word reveals, and strategies.",
          url: `${BASE_URL}/strands-hint-today`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <JsonLd
        data={howToSchema(
          "How to Play NYT Strands",
          "A step-by-step guide to solving the daily NYT Strands word puzzle, including how to find theme words, the spangram, and how to earn hints.",
          HOW_TO_STEPS
        )}
      />

      <ContentHero
        eyebrow="Strands"
        title="NYT Strands Hints, Spangram and Answers Today"
        description={`${dateLabel} -- Strands #${puzzle.id}. Reveal hints one level at a time, or jump straight to the answers.`}
      />

      <div className="mt-8 space-y-8">
        {/* Daily hints */}
        <div className="space-y-3">
          <StrandsThemeCard
            clue={puzzle.clue}
            hint={puzzle.hint}
            theme={rawPuzzle.theme}
          />
          <StrandsSpangramReveal
            spangram={rawPuzzle.spangram}
            direction={puzzle.spangramDirection}
            letterCount={puzzle.spangramLetterCount}
          />
        </div>

        {/* Word list reveal */}
        <StrandsWordList
          themeWords={rawPuzzle.themeWords}
          spangram={rawPuzzle.spangram}
        />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Strands is a
          trademark of The New York Times Company.
        </p>

        {/* Table of Contents */}
        <TableOfContents
          items={[
            { href: "#what-is-strands", label: "What is NYT Strands?" },
            { href: "#how-to-play", label: "How to play" },
            { href: "#spangram", label: "What is a spangram?" },
            { href: "#difficulty", label: "Puzzle difficulty" },
            { href: "#strategies", label: "Expert strategies" },
            { href: "#patterns", label: "Common theme patterns" },
            { href: "#vs-other-games", label: "Strands vs other games" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        {/* ========== EVERGREEN CONTENT ========== */}

        {/* What Is NYT Strands? */}
        <ContentSection title="What Is NYT Strands?" id="what-is-strands">
          <BodyText>
            NYT Strands is a daily word-finding puzzle from The New York Times.
            You are given a 6-column by 8-row grid containing 48 letters and a
            short theme clue. Your job is to trace paths through the grid to
            uncover every themed word -- plus one special word called the
            spangram that stretches from one edge of the board to the opposite
            edge.
          </BodyText>
          <BodyText>
            Unlike a traditional word search, every letter on the board belongs
            to exactly one word. There are no filler letters and no leftover
            squares. When every letter turns blue or yellow, the puzzle is
            complete.
          </BodyText>
          <BodyText>
            Strands was created by puzzle editor Tracy Bennett, who also edits
            Wordle. It entered public beta in March 2024 and became an official
            NYT game in June 2024. By 2025 it had reached 1.5 billion total
            solves, making it the third most popular NYT game behind Wordle
            and Connections. A new puzzle is available every day at midnight
            Eastern Time, free of charge.
          </BodyText>
          <BodyText>
            What sets Strands apart from other word searches is its hint
            system: find non-theme words on the board to earn clues that
            highlight hidden answers. This creates a satisfying loop of
            exploration and deduction that keeps millions of players coming
            back every morning.
          </BodyText>
        </ContentSection>

        {/* How to Play */}
        <ContentSection title="How to Play NYT Strands" id="how-to-play">
          <SubHeading>Step 1 -- Read the Theme Clue</SubHeading>
          <BodyText>
            Every puzzle displays a clue at the top of the board. It might be a
            straightforward category like &quot;Types of pasta&quot; or a playful
            pun such as &quot;I blew it!&quot; (which turned out to be wind
            instruments). The clue is the single most important piece of
            information -- spend a moment interpreting it before you start
            tracing.
          </BodyText>

          <SubHeading>Step 2 -- Trace Words Through the Grid</SubHeading>
          <BodyText>
            Drag or tap adjacent letters to form words. Paths can travel in all
            eight directions -- horizontal, vertical, and diagonal -- and can
            change direction mid-word. Each word must be at least four letters
            long. If the word you traced is a valid theme word, those letters
            turn blue and lock in place.
          </BodyText>

          <SubHeading>Step 3 -- Find the Spangram</SubHeading>
          <BodyText>
            The spangram is a special word or phrase that physically touches two
            opposite edges of the board. It describes the overall theme and
            highlights in yellow when found. Because the spangram names the
            category, finding it early reveals what all the other words have in
            common and makes the rest of the puzzle easier.
          </BodyText>

          <SubHeading>Step 4 -- Earn and Use Hints</SubHeading>
          <BodyText>
            Whenever you find three valid non-theme words (each at least four
            letters), you earn one hint. Activating a hint highlights the
            letters of one undiscovered theme word on the grid, showing you
            exactly where it sits. Hints are entirely optional and you can
            stockpile as many as you need.
          </BodyText>

          <SubHeading>Step 5 -- Fill Every Letter</SubHeading>
          <BodyText>
            The puzzle is complete when every one of the 48 letters belongs to a
            found word -- there should be no grey squares remaining. Completing
            the board without using a single hint earns you a
            &quot;Perfect&quot; rating. If you did use hints, the game notes how
            many you needed.
          </BodyText>
        </ContentSection>

        {/* Spangram */}
        <ContentSection
          title="What Is a Spangram? The Key to Every Strands Puzzle"
          id="spangram"
        >
          <SubHeading>Spangram Rules</SubHeading>
          <BodyText>
            The spangram must trace a path that touches two opposite edges of
            the 6×8 grid -- left to right, right to left, top to bottom, or
            bottom to top. It can wind in any direction along the way, as long
            as both endpoints sit on opposing borders. It is usually the longest
            word on the board and is often a compound phrase written without
            spaces, like ITALIANFOOD or WINDINSTRUMENT.
          </BodyText>

          <SubHeading>Why Finding the Spangram First Wins Games</SubHeading>
          <BodyText>
            The spangram is the theme itself. If the theme words are CLARINET,
            FLUTE, and OBOE, the spangram is WINDINSTRUMENT. Discovering it
            early is like reading the answer key -- you immediately know what
            every remaining word has in common. Focus on edge letters and look
            for long words that start on one border and end on the opposite one.
          </BodyText>

          <SubHeading>Horizontal vs Vertical Spangrams</SubHeading>
          <BodyText>
            A horizontal spangram connects the left edge (column 0) to the
            right edge (column 5). A vertical spangram connects the top edge
            (row 0) to the bottom edge (row 7). Our daily hints include the
            spangram&apos;s direction as a spoiler-free first clue, plus the
            letter count and first-and-last-letter reveal, so you can choose
            exactly how much help you want.
          </BodyText>
        </ContentSection>

        {/* Difficulty */}
        <ContentSection
          title="What Makes a Strands Puzzle Hard or Easy?"
          id="difficulty"
        >
          <BodyText>
            Strands does not use colour-coded difficulty levels like
            Connections. Instead, difficulty varies from puzzle to puzzle
            based on how abstract the clue is and how obscure the vocabulary
            gets. Here is how to recognise each tier.
          </BodyText>

          <SubHeading>Easy Puzzles -- Straightforward Themes</SubHeading>
          <BodyText>
            The clue is literal and direct. &quot;Sniff sniff&quot; leads to
            words for noses: BEAK, SNOUT, MUZZLE. Theme words are common
            vocabulary, the spangram is a recognisable phrase (ONTHENOSE), and
            most players solve without needing a hint.
          </BodyText>

          <SubHeading>Moderate Puzzles -- Wordplay Clues</SubHeading>
          <BodyText>
            The clue contains a pun or double meaning. &quot;I blew it!&quot;
            sounds like a mistake but actually means wind instruments. You need
            to look past the literal interpretation to crack the theme. The
            spangram may be a two-word compound like WINDINSTRUMENT.
          </BodyText>

          <SubHeading>Hard Puzzles -- Abstract Themes and Cultural References</SubHeading>
          <BodyText>
            The clue is highly abstract or relies on niche cultural knowledge.
            &quot;Trademarked no more&quot; required knowing that ASPIRIN,
            DUMPSTER, and ZIPPER were once brand names that became generic
            terms. The spangram (GENERICTERM) is not obvious from the clue
            alone. These puzzles often require all available hints.
          </BodyText>
        </ContentSection>

        {/* Strategies */}
        <ContentSection
          title="10 Expert Strategies for Solving NYT Strands"
          id="strategies"
        >
          <SubHeading>1. Decode the Clue -- Think Literal and Figurative</SubHeading>
          <BodyText>
            Read the clue both ways. &quot;Can I have my quarter back?&quot;
            sounds like loose change but actually points to quarterbacks and
            football teams. Always ask yourself: could this be a pun, an idiom,
            or a double meaning?
          </BodyText>

          <SubHeading>2. Hunt the Spangram First</SubHeading>
          <BodyText>
            The spangram reveals the theme. Scan the grid edges for long words
            that could stretch from one border to the other. Even a partial
            guess narrows down the category dramatically.
          </BodyText>

          <SubHeading>3. Start From the Corners</SubHeading>
          <BodyText>
            Corner letters have only three adjacent neighbours compared to eight
            for centre letters. Fewer connections means fewer possible words,
            making corners the easiest place to start assigning letters to
            words.
          </BodyText>

          <SubHeading>4. Spot Common Suffixes and Prefixes</SubHeading>
          <BodyText>
            Look for clusters like -ING, -TION, -ED, -ER, or -LY. These are
            almost always word endings. Once you identify a suffix you can
            build backwards to discover the full word.
          </BodyText>

          <SubHeading>5. Watch for Uncommon Letter Clusters</SubHeading>
          <BodyText>
            Two adjacent Zs, a QU pair, or back-to-back Fs usually belong to
            the same word. Unusual letter combinations stand out on the board
            and are reliable anchors for word-building.
          </BodyText>

          <SubHeading>6. Remember -- Every Letter Is Used</SubHeading>
          <BodyText>
            Strands has zero filler letters. All 48 characters on the board
            belong to exactly one theme word or the spangram. If some letters
            appear left over after you have found most words, one of your
            earlier answers likely traced an incorrect path.
          </BodyText>
          <CalloutBox type="tip" title="The Zero-Leftover Rule">
            Re-examine your solved words when orphan letters appear. A
            different path through the same letters might free up the
            stranded characters and reveal the word you are missing.
          </CalloutBox>

          <SubHeading>7. Farm Hints with Short Non-Theme Words</SubHeading>
          <BodyText>
            When you are stuck, deliberately find three short common words --
            THAT, THIS, HAVE, or THEN -- to fill the hint meter. Earning a
            hint is often faster and more productive than staring at the board.
          </BodyText>

          <SubHeading>8. Save Hints for the Final Words</SubHeading>
          <BodyText>
            The first few theme words are usually discoverable by logic alone.
            Save your earned hints for the last one or two stubborn words where
            positional highlighting is most valuable.
          </BodyText>

          <SubHeading>9. Work the Edges Inward</SubHeading>
          <BodyText>
            Edge letters are more constrained than central ones. After solving
            the spangram and corner-adjacent words, the interior of the grid
            fills in almost naturally.
          </BodyText>

          <SubHeading>10. Learn the Editor&apos;s Patterns</SubHeading>
          <BodyText>
            Tracy Bennett and her team of constructors have recurring styles --
            pun-based clues, fill-in-the-blank themes, pop culture categories.
            Playing daily builds pattern recognition so you can anticipate the
            type of theme before reading a single letter.
          </BodyText>
        </ContentSection>

        {/* Theme Patterns */}
        <ContentSection
          title="Common NYT Strands Theme Patterns"
          id="patterns"
        >
          <SubHeading>Synonym Sets</SubHeading>
          <BodyText>
            The most common type. The clue &quot;Just right&quot; led to words
            meaning perfectly fitting: EXACT, IDEAL, SUITABLE, FITTING, PERFECT,
            and SEEMLY, with the spangram TAILORMADE. These themes use
            straightforward vocabulary and are often the easiest to crack.
          </BodyText>

          <SubHeading>Fill-in-the-Blank Phrases</SubHeading>
          <BodyText>
            All theme words complete a common phrase. &quot;Intermission
            mission&quot; led to snack-bar items -- POPCORN, SODA, CANDY, BEER,
            FRIES -- with the spangram CONCESSIONS. The clue usually hints at
            the blank or the context.
          </BodyText>

          <SubHeading>Pun and Wordplay Themes</SubHeading>
          <BodyText>
            The clue deliberately misdirects. &quot;I blew it!&quot; sounds like
            a mistake but means wind instruments (CLARINET, FLUTE, OBOE). These
            are the trickiest to decode because you have to see past the
            surface meaning. Expect the spangram to spell out the literal
            category.
          </BodyText>

          <SubHeading>Pop Culture Categories</SubHeading>
          <BodyText>
            Movie characters, sports teams, song titles, or TV references.
            These require broad cultural knowledge rather than vocabulary skills.
            If the clue feels oddly specific -- like a quote or catchphrase --
            think pop culture first.
          </BodyText>

          <SubHeading>Hidden Word Patterns</SubHeading>
          <BodyText>
            Each theme word contains a smaller word inside it, or all words
            share a structural letter pattern. For example, every word might
            contain a hidden animal name or start with the same three-letter
            sequence. These are rare but rewarding to spot.
          </BodyText>

          <SubHeading>Concrete Classification</SubHeading>
          <BodyText>
            Direct, real-world categories: parts of an umbrella, obstacles in a
            course, types of written correspondence. &quot;For a rainy day&quot;
            led to umbrella parts (CANOPY, RIBS, SHAFT, HANDLE) with the
            spangram UMBRELLATERM. These sit in the middle of the difficulty
            range and rely on general knowledge rather than wordplay skills.
          </BodyText>
          <BodyText>
            Recognising which pattern a puzzle uses is half the battle. Once
            you identify the type -- synonym, fill-in-the-blank, pun, or
            classification -- the remaining theme words become far easier to
            locate on the grid.
          </BodyText>
        </ContentSection>

        {/* vs Other Games */}
        <ContentSection
          title="NYT Strands vs Other Daily Word Games"
          id="vs-other-games"
        >
          <SubHeading>Strands vs Wordle</SubHeading>
          <BodyText>
            Wordle gives you six attempts to guess a single five-letter word
            using colour-coded feedback. Strands asks you to find six to ten
            themed words hidden in a letter grid with no guess limit and no
            penalty for wrong traces. Wordle is tense and time-pressured.
            Strands is exploratory and relaxed. Both are edited by Tracy
            Bennett and reset at midnight Eastern Time.
          </BodyText>
          <BodyText>
            The skill sets overlap surprisingly little. Wordle rewards
            vocabulary breadth and letter-frequency intuition. Strands
            rewards spatial reasoning and the ability to decode wordplay
            clues.
          </BodyText>

          <SubHeading>Strands vs Connections</SubHeading>
          <BodyText>
            In Connections, you see 16 words and sort them into four colour-coded
            groups of four, with only four mistakes allowed. In Strands, you
            know the theme but must find the words yourself inside a letter
            grid, with unlimited attempts. Connections has explicit difficulty
            tiers (yellow through purple). Strands has no difficulty indicator
            at all.
          </BodyText>
          <BodyText>
            Players who enjoy categorisation and trivia tend to prefer
            Connections. Players who enjoy spatial puzzles and wordplay clues
            gravitate toward Strands. Many daily puzzle enthusiasts play both
            back to back.
          </BodyText>

          <SubHeading>Strands vs Cryptic Crosswords</SubHeading>
          <BodyText>
            Both games reward lateral thinking about clue meanings. Cryptic
            crosswords use wordplay devices -- anagrams, containers, hidden
            words -- inside each clue. Strands clues use puns and misdirection
            at the theme level. If you enjoy decoding cryptic wordplay, the
            double-meaning clues in Strands will feel familiar. Try our{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              daily cryptic clue
            </Link>{" "}
            for another kind of word puzzle challenge.
          </BodyText>
        </ContentSection>

        {/* FAQ */}
        <ContentSection title="NYT Strands Hints FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Recent puzzles */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Strands Puzzles" id="recent">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentPuzzles.map((p) => (
                <StrandsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/strands-hint"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                View All Strands Hints and Answers →
              </Link>
            </div>
          </ContentSection>
        )}

        {/* Related */}
        <RelatedLinks
          links={[
            {
              href: "/connections-hint-today",
              title: "Today's Connections hints",
              description:
                "Progressive hints for all four colour groups in today's NYT Connections puzzle.",
            },
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
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
