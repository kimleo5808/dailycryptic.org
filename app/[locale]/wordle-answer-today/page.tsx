import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordleHintCard from "@/components/wordle/WordleHintCard";
import WordleAnswerReveal from "@/components/wordle/WordleAnswerReveal";
import WordlePuzzleCard from "@/components/wordle/WordlePuzzleCard";
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
  getTodaysWordlePuzzle,
  getRawTodaysWordlePuzzle,
  getRecentWordlePuzzles,
} from "@/lib/wordle-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What time does Wordle reset each day?",
    answer:
      "Wordle resets at midnight Eastern Time (ET) every day. That is 5:00 AM UTC or 9:00 PM PT the previous evening. A brand-new five-letter word is available as soon as the clock strikes midnight ET.",
  },
  {
    question: "How many guesses do you get in Wordle?",
    answer:
      "You get six guesses to find the five-letter word. Each guess must be a valid English word. After each guess, the tiles change colour to show how close you are.",
  },
  {
    question: "What do the colours mean in Wordle?",
    answer:
      "Green means the letter is in the correct position. Yellow means the letter is in the word but in the wrong position. Grey means the letter is not in the word at all.",
  },
  {
    question: "What is the best starting word for Wordle?",
    answer:
      "Popular starting words include CRANE, SLATE, ADIEU, and AUDIO. The best starters contain common letters (S, E, A, R, O, T, L, I, N) and avoid repeats. Many players rotate between a few favourites.",
  },
  {
    question: "Can I play old Wordle puzzles?",
    answer:
      "The official NYT Wordle only offers one puzzle per day with no replay option. However, you can browse our Wordle archive to see past answers and hints for any date.",
  },
  {
    question: "Is Wordle free to play?",
    answer:
      "Yes. Wordle is completely free on the New York Times website. No account or subscription is required to play the daily puzzle.",
  },
  {
    question: "How is Wordle different from Connections?",
    answer:
      "Wordle asks you to guess a single five-letter word in six tries using colour-coded feedback. Connections gives you 16 words and asks you to sort them into four groups of four. Both are daily NYT puzzles but test different skills.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysWordlePuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "WordleAnswerToday",
    title: `Wordle Answer and Hints Today — ${dateStr} (#${puzzle?.id ?? ""})`,
    description: `Today's Wordle answer with progressive hints. Get 3 levels of clues before revealing the solution. Wordle #${puzzle?.id ?? ""} for ${dateStr}.`,
    keywords: [
      "wordle answer today",
      "wordle hints today",
      "today's wordle",
      "wordle answer",
      "wordle hint",
      "wordle solution",
      "nyt wordle today",
    ],
    locale: locale as Locale,
    path: "/wordle-answer-today",
    canonicalUrl: "/wordle-answer-today",
  });
}

export default async function WordleAnswerTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysWordlePuzzle();
  const rawPuzzle = await getRawTodaysWordlePuzzle();
  const recentPuzzles = await getRecentWordlePuzzles(4);

  if (!puzzle || !rawPuzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Wordle"
          title="Wordle Answer and Hints Today"
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
        data={articleSchema({
          title: `Wordle Answer and Hints Today — ${dateLabel}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
          url: `${BASE_URL}/wordle-answer-today`,
          description: `Wordle #${puzzle.id} hints and answer for ${dateLabel}.`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Wordle Hints", url: `${BASE_URL}/wordle-answer-today` },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Wordle"
        title="Wordle Answer and Hints Today"
        description={`Wordle #${puzzle.id} — ${dateLabel}. Use the progressive hints below before revealing the answer.`}
      />

      <div className="mt-8 space-y-8">
        {/* Hints */}
        <WordleHintCard
          hint1={puzzle.hint1}
          hint2={puzzle.hint2}
          hint3={puzzle.hint3}
        />

        {/* Answer */}
        <WordleAnswerReveal encodedSolution={rawPuzzle.solution} />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Wordle is a
          trademark of The New York Times Company.
        </p>

        {/* TOC */}
        <TableOfContents
          items={[
            { href: "#what-is-wordle", label: "What is Wordle?" },
            { href: "#how-to-play", label: "How to play Wordle" },
            { href: "#best-starting-words", label: "Best starting words" },
            { href: "#strategies", label: "10 tips and strategies" },
            { href: "#letter-frequency", label: "Letter frequency in Wordle" },
            { href: "#vs-other-games", label: "Wordle vs other games" },
            { href: "#faq", label: "FAQ" },
            { href: "#recent", label: "Recent Wordle answers" },
          ]}
        />

        {/* What is Wordle */}
        <ContentSection title="What Is Wordle?" id="what-is-wordle">
          <BodyText>
            Wordle is a free daily word puzzle published by The New York Times.
            Each day you get six attempts to guess a single five-letter English
            word. After every guess, each letter is colour-coded: green if it
            is correct and in the right spot, yellow if it is in the word but
            in the wrong spot, and grey if it is not in the word at all.
          </BodyText>
          <BodyText>
            Created by Josh Wardle in 2021 and acquired by the NYT in 2022,
            Wordle became a global phenomenon thanks to its simple rules, one-
            puzzle-per-day format, and the iconic grid of coloured squares that
            players share on social media without spoiling the answer.
          </BodyText>
        </ContentSection>

        {/* How to Play */}
        <ContentSection title="How to Play Wordle" id="how-to-play">
          <SubHeading>Step 1: Enter a Starting Word</SubHeading>
          <BodyText>
            Type any valid five-letter English word and press Enter. Your first
            guess should contain common letters to maximise the information you
            get back.
          </BodyText>
          <SubHeading>Step 2: Read the Colour Feedback</SubHeading>
          <BodyText>
            Green tiles lock in — that letter is confirmed in that position.
            Yellow tiles mean the letter exists but needs to move. Grey tiles
            are eliminated from all positions.
          </BodyText>
          <SubHeading>Step 3: Refine Your Guesses</SubHeading>
          <BodyText>
            Use the feedback to narrow down possibilities. Place green letters
            in their confirmed spots, move yellow letters to new positions, and
            avoid grey letters entirely.
          </BodyText>
          <SubHeading>Step 4: Solve Within Six Tries</SubHeading>
          <BodyText>
            You have six total guesses. Most experienced players solve in three
            or four. If you cannot solve it in six, the answer is revealed.
          </BodyText>
          <SubHeading>Step 5: Share Your Results</SubHeading>
          <BodyText>
            After solving (or failing), you can share a spoiler-free grid of
            coloured squares. The grid shows your path to the answer without
            revealing any letters.
          </BodyText>
        </ContentSection>

        {/* Best Starting Words */}
        <ContentSection title="Best Wordle Starting Words" id="best-starting-words">
          <SubHeading>High-Frequency Letter Starters</SubHeading>
          <BodyText>
            The best starting words pack the most common Wordle letters — S, E,
            A, R, O, T, L, I, N — into a single guess. Popular choices include
            CRANE, SLATE, TRACE, and STARE. Each of these covers five of the
            ten most frequent letters.
          </BodyText>
          <SubHeading>Vowel-Heavy Openers</SubHeading>
          <BodyText>
            Words like ADIEU, AUDIO, and OUIJA front-load vowels. Knowing which
            vowels are present (or absent) dramatically narrows the field. Many
            speed-solvers use a vowel-heavy first word followed by a consonant-
            heavy second word.
          </BodyText>
          <SubHeading>Two-Word Combos</SubHeading>
          <BodyText>
            Pairing SLATE + CRONY or CRANE + TOILS covers all five vowels and
            ten common consonants in just two guesses. This strategy sacrifices
            one guess for near-complete letter coverage.
          </BodyText>
        </ContentSection>

        {/* Strategies */}
        <ContentSection title="10 Tips and Strategies for Wordle" id="strategies">
          <SubHeading>1. Start With a Strong Opening Word</SubHeading>
          <BodyText>
            Choose a word with five unique, common letters. Avoid obscure words
            or repeated letters on your first guess.
          </BodyText>
          <SubHeading>2. Never Reuse Grey Letters</SubHeading>
          <BodyText>
            Once a letter turns grey, it is not in the answer. Eliminate it from
            all future guesses to avoid wasting attempts.
          </BodyText>
          <SubHeading>3. Lock In Greens Immediately</SubHeading>
          <BodyText>
            Keep green letters in their confirmed positions in every subsequent
            guess. Building on confirmed letters is the fastest path to solving.
          </BodyText>
          <SubHeading>4. Move Yellows to New Positions</SubHeading>
          <BodyText>
            A yellow letter is confirmed in the word but not in that spot. Try
            it in a different position on your next guess.
          </BodyText>
          <SubHeading>5. Think About Common Letter Patterns</SubHeading>
          <BodyText>
            English has predictable patterns: SH, TH, CH at the start; -TION,
            -IGHT, -NESS at the end. Use these patterns to narrow your options.
          </BodyText>
          <SubHeading>6. Watch for Double Letters</SubHeading>
          <BodyText>
            Words like SPEED, KNEEL, and VIVID have repeated letters. If your
            remaining options are few, consider double letters — they appear
            more often than you might expect.
          </BodyText>
          <SubHeading>7. Use Hard Mode for Better Habits</SubHeading>
          <BodyText>
            Hard mode forces you to use all revealed hints in every guess. This
            prevents wasteful &quot;information-only&quot; guesses and builds
            stronger solving instincts.
          </BodyText>
          <SubHeading>8. Eliminate Letter Positions Systematically</SubHeading>
          <BodyText>
            If you know a letter is yellow, track which positions it has
            already failed in. Process of elimination often reveals the answer
            faster than guessing randomly.
          </BodyText>
          <SubHeading>9. Save Your Last Two Guesses</SubHeading>
          <BodyText>
            By guess four, you should have strong constraints. Use guess five
            to test your best hypothesis and save guess six as a safety net.
          </BodyText>
          <SubHeading>10. Use Our Hints When Stuck</SubHeading>
          <BodyText>
            If you are truly stuck, our three-level hint system lets you get
            just enough help without seeing the full answer. Start with hint 1
            and only escalate if you need more.
          </BodyText>
        </ContentSection>

        {/* Letter Frequency */}
        <ContentSection title="Letter Frequency in Wordle" id="letter-frequency">
          <SubHeading>Most Common Letters</SubHeading>
          <BodyText>
            Based on the full Wordle answer list, the most frequent letters are
            E, A, R, O, T, L, I, S, N, and C — in roughly that order. The
            letter E alone appears in nearly 40% of all Wordle answers.
          </BodyText>
          <SubHeading>Most Common Starting Letters</SubHeading>
          <BodyText>
            S is by far the most common first letter in Wordle answers, followed
            by C, B, T, P, and A. Words starting with S appear roughly three
            times more often than any other starting letter.
          </BodyText>
          <SubHeading>Rarest Letters</SubHeading>
          <BodyText>
            Q, J, X, and Z are the rarest letters in Wordle answers. If none of
            your common-letter guesses are working, do not jump to rare letters
            — statistically they are almost never the answer.
          </BodyText>
        </ContentSection>

        {/* Vs Other Games */}
        <ContentSection title="Wordle vs Other Word Games" id="vs-other-games">
          <SubHeading>Wordle vs Connections</SubHeading>
          <BodyText>
            Wordle is about guessing a single hidden word through letter-by-
            letter feedback.{" "}
            <Link
              href="/connections-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Connections
            </Link>{" "}
            gives you 16 visible words and asks you to group them by hidden
            categories. Wordle tests vocabulary; Connections tests pattern
            recognition.
          </BodyText>
          <SubHeading>Wordle vs Strands</SubHeading>
          <BodyText>
            <Link
              href="/strands-hint-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Strands
            </Link>{" "}
            hides theme words in a letter grid and asks you to trace paths.
            It combines word knowledge with spatial reasoning. Wordle is pure
            deduction from colour feedback.
          </BodyText>
          <SubHeading>Wordle vs Cryptic Crosswords</SubHeading>
          <BodyText>
            A{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic clue
            </Link>{" "}
            gives you a definition and wordplay mixed into a single sentence.
            Wordle gives you nothing but colour tiles. Both are daily one-word
            puzzles, but cryptics reward linguistic creativity while Wordle
            rewards systematic elimination.
          </BodyText>
        </ContentSection>

        {/* FAQ */}
        <ContentSection title="Wordle Hints FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Recent */}
        <ContentSection title="Recent Wordle Answers" id="recent">
          {recentPuzzles.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {recentPuzzles.map((p) => (
                <WordlePuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
          ) : (
            <BodyText>No recent puzzles available yet.</BodyText>
          )}
          <div className="mt-4 text-center">
            <Link
              href="/wordle-answer"
              className="text-sm font-medium text-primary hover:underline"
            >
              View full Wordle archive →
            </Link>
          </div>
        </ContentSection>

        {/* Related */}
        <RelatedLinks
          links={[
            {
              href: "/connections-hint-today",
              title: "Connections hints",
              description:
                "Today's hints and answers for the NYT Connections puzzle.",
            },
            {
              href: "/strands-hint-today",
              title: "Strands hints",
              description:
                "Today's hints, spangram, and answers for the NYT Strands puzzle.",
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
