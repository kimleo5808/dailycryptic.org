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
import SpellingBeeHive from "@/components/spelling-bee/SpellingBeeHive";
import SpellingBeeStatsBar from "@/components/spelling-bee/SpellingBeeStats";
import SpellingBeeHintLadder from "@/components/spelling-bee/SpellingBeeHintLadder";
import SpellingBeeAnswers from "@/components/spelling-bee/SpellingBeeAnswers";
import SpellingBeePuzzleCard from "@/components/spelling-bee/SpellingBeePuzzleCard";
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
  getTodaysSpellingBeePuzzle,
  getRecentSpellingBeePuzzles,
  buildFirstLetterCounts,
  buildTwoLetterList,
  buildLengthDistribution,
} from "@/lib/spelling-bee-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What are today's Spelling Bee answers?",
    answer:
      "Today's full Spelling Bee answer list is on this page, hidden behind a spoiler button so you only see it when you are ready. Scroll to the answers section and tap Reveal to see every valid word grouped by length, with the pangram marked. We update the list every morning after the new puzzle goes live.",
  },
  {
    question: "What is today's Spelling Bee pangram?",
    answer:
      "A pangram is a word that uses all seven of the day's letters at least once. Today's pangram is available in the Pangram hint panel above — first as a spoiler-free shape (its starting letter and length), then as a full reveal. Every puzzle has at least one pangram, and it is always worth chasing because it scores a seven-point bonus.",
  },
  {
    question: "How many words are in today's Spelling Bee?",
    answer:
      "The exact word count for today is shown in the stats bar near the top of this page, alongside the number of pangrams and the score needed for Genius and Queen Bee. The count changes daily and typically ranges from about 20 to 60 valid words depending on the letter set.",
  },
  {
    question: "What score do I need for Queen Bee?",
    answer:
      "Queen Bee is the rank you earn by finding every single word in the puzzle — a perfect score. The exact number of points required is shown in today's stats bar. Genius, the rank the New York Times officially celebrates, requires 70% of the maximum score.",
  },
  {
    question: "Why is there no letter S in the Spelling Bee?",
    answer:
      "The New York Times deliberately excludes the letter S from every puzzle. If S were allowed, solvers could pluralise almost any noun and inflate the word list with easy variations. Leaving it out keeps each puzzle tighter, fairer, and more interesting to solve.",
  },
  {
    question: "What does bingo mean in Spelling Bee?",
    answer:
      "A bingo happens when you find at least one word starting with each of the seven letters in the puzzle. It is an optional bonus challenge with no extra points, but many regular solvers treat completing a bingo as a personal badge of honour alongside reaching Genius.",
  },
  {
    question: "Is there a Spelling Bee archive I can browse?",
    answer:
      "Yes. Our archive keeps every past puzzle we have covered, each with its letters, stats, hints, and full word list. It is a useful way to review words you missed or to practise with older grids at your own pace.",
  },
  {
    question: "Can solving cryptic clues improve my Spelling Bee?",
    answer:
      "It can. Cryptic crosswords train you to break words apart, spot hidden letter patterns, and think about spelling flexibly — the same skills that help you spot obscure words in the Bee. If you want a different daily word workout, try our anagram-based cryptic clues and beginner guides.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysSpellingBeePuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "SpellingBeeAnswersToday",
    title: `NYT Spelling Bee Answers & Hints Today — Pangram ${dateStr}`,
    description: `Today's NYT Spelling Bee answers, hints and pangram. Spoiler-free clues first, then the full word list plus Genius and Queen Bee tips. Updated daily, free.`,
    keywords: [
      "spelling bee answers today",
      "spelling bee pangram today",
      "spelling bee hints today",
      "nyt spelling bee answers",
      "queen bee spelling bee",
      "spelling bee word list",
      "spelling bee genius",
    ],
    locale: locale as Locale,
    path: "/spelling-bee-answers-today",
    canonicalUrl: "/spelling-bee-answers-today",
  });
}

export default async function SpellingBeeAnswersTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysSpellingBeePuzzle();
  const recentPuzzles = await getRecentSpellingBeePuzzles(4);

  if (!puzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Spelling Bee"
          title="NYT Spelling Bee Answers & Hints"
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

  const firstLetterCounts = buildFirstLetterCounts(puzzle.answers);
  const twoLetterList = buildTwoLetterList(puzzle.answers);
  const lengthDistribution = buildLengthDistribution(puzzle.answers);
  const pangramShapes = puzzle.pangrams.map((w) => ({
    letter: w[0].toUpperCase(),
    length: w.length,
  }));

  const lettersLabel = puzzle.letters.map((l) => l.toUpperCase()).join(", ");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Spelling Bee Answers",
            url: `${BASE_URL}/spelling-bee-answers-today`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Spelling Bee Answers & Hints Today — ${dateLabel}`,
          description:
            "Spoiler-free hints and the full answer list for today's NYT Spelling Bee, including the pangram, Genius and Queen Bee scores.",
          url: `${BASE_URL}/spelling-bee-answers-today`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Spelling Bee"
        title="NYT Spelling Bee Answers & Hints Today"
        description={`${dateLabel} — spoiler-free hints first, then the full word list and pangram whenever you are ready.`}
      />

      <div className="mt-8 space-y-8">
        {/* Honeycomb hero */}
        <div className="rounded-2xl border border-border bg-gradient-to-b from-[hsl(var(--cta))]/[0.06] to-transparent p-6 text-center">
          <SpellingBeeHive
            centerLetter={puzzle.centerLetter}
            outerLetters={puzzle.outerLetters}
          />
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            Today&apos;s letters:{" "}
            <span className="font-semibold text-foreground">{lettersLabel}</span>
            <span className="ml-2 rounded bg-[hsl(var(--cta))]/15 px-1.5 py-0.5 text-xs font-semibold text-[hsl(var(--cta))]">
              center {puzzle.centerLetter.toUpperCase()}
            </span>
          </p>
        </div>

        {/* Stats bar */}
        <SpellingBeeStatsBar stats={puzzle.stats} />

        {/* Hint ladder */}
        <section aria-labelledby="hints-heading" className="space-y-3">
          <h2
            id="hints-heading"
            className="font-heading text-xl font-bold text-foreground"
          >
            Today&apos;s Spelling Bee Hints (Spoiler-Free)
          </h2>
          <p className="text-sm text-muted-foreground">
            Work down the ladder — each panel gives away a little more. Start with
            the letter counts, then the two-letter list, then the pangram shape.
          </p>
          <SpellingBeeHintLadder
            data={{
              firstLetterCounts,
              twoLetterList,
              lengthDistribution,
              pangramCount: puzzle.stats.pangramCount,
              pangramShapes,
              pangrams: puzzle.pangrams,
            }}
          />
        </section>

        {/* Full answers */}
        <section aria-labelledby="answers-heading" className="space-y-3">
          <h2
            id="answers-heading"
            className="font-heading text-xl font-bold text-foreground"
          >
            Today&apos;s Spelling Bee Answers (Full List)
          </h2>
          <SpellingBeeAnswers
            answers={puzzle.answers}
            pangrams={puzzle.pangrams}
          />
        </section>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Spelling Bee is a
          trademark of The New York Times Company.
        </p>

        {/* Ad zone #1 — after the daily answer block, before evergreen content */}

        {/* Table of Contents */}
        <TableOfContents
          items={[
            { href: "#what-is", label: "What is the NYT Spelling Bee?" },
            { href: "#scoring", label: "How scoring & ranks work" },
            { href: "#pangram", label: "What is a pangram?" },
            { href: "#queen-bee", label: "What is Queen Bee?" },
            { href: "#strategies", label: "How to get Queen Bee" },
            { href: "#cryptic", label: "Spelling Bee & cryptic crosswords" },
            { href: "#faq", label: "FAQ" },
            { href: "#archive", label: "Past puzzles" },
          ]}
        />

        {/* B1 — What is Spelling Bee */}
        <ContentSection title="What Is the NYT Spelling Bee?" id="what-is">
          <BodyText>
            The NYT Spelling Bee is a daily word game from The New York Times.
            Every day you are given seven letters arranged in a honeycomb, with
            one letter in the centre. Your job is to build as many words as
            possible using only those seven letters — and every word must include
            the centre letter.
          </BodyText>
          <BodyText>
            The rules are simple but strict. Words must be at least four letters
            long, letters can be reused as often as you like, and proper nouns,
            hyphenated words and obscure abbreviations are not accepted. There is
            never a letter S in the puzzle, which stops solvers from padding the
            list with easy plurals.
          </BodyText>
          <BodyText>
            A fresh puzzle is released every day at 3:00 AM Eastern Time.
            The game is free to play in a limited form on the New York Times
            Games website and app, with full access included in a Games
            subscription. Each grid contains one or more <strong>pangrams</strong>
            {" "}— words that use all seven letters at once.
          </BodyText>
        </ContentSection>

        {/* B2 — Scoring */}
        <ContentSection
          title="How Spelling Bee Scoring & Ranks Work"
          id="scoring"
        >
          <BodyText>
            Every valid word earns points, and your running total moves you up
            through a series of ranks from Beginner all the way to Genius — and,
            unofficially, Queen Bee. Understanding the scoring makes it much
            easier to plan which words to chase.
          </BodyText>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-heading font-bold text-foreground">
                    Word
                  </th>
                  <th className="py-2 font-heading font-bold text-foreground">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4">Four-letter word</td>
                  <td className="py-2">1 point</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4">Five letters or longer</td>
                  <td className="py-2">1 point per letter</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Pangram (all seven letters)</td>
                  <td className="py-2">Word length + 7 bonus points</td>
                </tr>
              </tbody>
            </table>
          </div>
          <BodyText>
            The rank ladder runs Beginner, Good Start, Moving Up, Good, Solid,
            Nice, Great, Amazing, and finally Genius. Reaching Genius requires
            70% of the total available points — that is the score the New York
            Times officially celebrates. You do not need every word to hit
            Genius, which is why smart solvers focus on the longer, higher-value
            words first.
          </BodyText>
        </ContentSection>

        {/* B3 — Pangram */}
        <ContentSection title="What Is a Pangram (and How to Find It)?" id="pangram">
          <CalloutBox type="highlight" title="Definition">
            A pangram is a word that uses every one of the day&apos;s seven
            letters at least once. Every puzzle contains at least one
            pangram, and it always earns a seven-point bonus on top of its normal
            score.
          </CalloutBox>
          <BodyText>
            Because pangrams are worth so much, finding one is often the fastest
            way to jump a rank. The trick is to start from the assumption that
            every letter must appear. Write the seven letters down, then try to
            build a word that touches all of them — the centre letter included.
          </BodyText>
          <BodyText>
            Common patterns help. Look for standard prefixes and suffixes such as
            RE-, UN-, -ING, -ED and -ANT that let you stretch a short core word
            into something longer. If two of your letters are rare consonants,
            the pangram almost certainly uses both, so anchor your search around
            them.
          </BodyText>
        </ContentSection>

        {/* B4 — Queen Bee */}
        <ContentSection title="What Is Queen Bee?" id="queen-bee">
          <BodyText>
            Queen Bee is the unofficial top rank in the game, awarded for
            finding <strong>every single word</strong> in the puzzle — a perfect
            score with nothing left on the table. The New York Times does not
            formally crown Queen Bee inside the game the way it celebrates
            Genius, but the community treats it as the ultimate achievement.
          </BodyText>
          <BodyText>
            Hitting Queen Bee is genuinely hard. It means uncovering not just the
            obvious words but also the obscure ones — archaic terms, unusual
            spellings, and words you may never use in conversation. Most days,
            reaching Genius is a satisfying goal; Queen Bee is for when you want
            to squeeze out every last point.
          </BodyText>
        </ContentSection>

        {/* B5 — Strategies */}
        <ContentSection
          title="How to Get Queen Bee: 6 Strategies"
          id="strategies"
        >
          <SubHeading>1. Shuffle the letters constantly</SubHeading>
          <BodyText>
            Seeing the same seven letters in a new arrangement resets your brain
            and surfaces words you skimmed past. Use the shuffle button often —
            it is the single easiest way to break out of a rut.
          </BodyText>
          <SubHeading>2. Work the prefixes and suffixes</SubHeading>
          <BodyText>
            Systematically test common word beginnings and endings against your
            letters: RE-, UN-, OUT-, then -ING, -ED, -ER, -IER, -IEST. One core
            word can spawn four or five valid variations this way.
          </BodyText>
          <SubHeading>3. Scan every two-letter combination</SubHeading>
          <BodyText>
            Pair the centre letter with each other letter and ask what words
            could start there. The two-letter list at the top of this page tells
            you exactly how many answers begin with each combination, so you know
            where words are still hiding.
          </BodyText>
          <SubHeading>4. Chase the longer words first</SubHeading>
          <BodyText>
            Because points scale with length, a single seven-letter word can be
            worth as much as seven four-letter words. Hunt the long words and the
            pangram early to bank points fast and reach Genius sooner.
          </BodyText>
          <SubHeading>5. Think in word families</SubHeading>
          <BodyText>
            If CLEAN is valid, test CLEANER and CLEANEST. If you find LACE, try
            LANCE, ENLACE and ENCLAVE. The Bee rewards solvers who mine a
            root word for every legal relative — a habit shared with{" "}
            <Link
              href="/anagram-solver"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              anagram solving
            </Link>
            .
          </BodyText>
          <SubHeading>6. Come back with fresh eyes</SubHeading>
          <BodyText>
            Do not force the last few words in one sitting. Stepping away and
            returning later is a proven way to spot the obscure entries between
            you and Queen Bee. The puzzle stays live all day.
          </BodyText>
        </ContentSection>

        {/* Ad zone #2 — mid-article */}

        {/* B6 — Cryptic bridge (unique asset) */}
        <ContentSection
          title="Spelling Bee & Cryptic Crosswords: Same Brain, Better Solver"
          id="cryptic"
        >
          <BodyText>
            The mental muscles you use for the Bee — pulling words apart,
            noticing hidden letter patterns, and staying flexible about spelling —
            are exactly the ones that power cryptic crossword solving. If you
            enjoy chasing Queen Bee, you are already wired for cryptic clues.
          </BodyText>
          <BodyText>
            Anagram clues, in particular, are pure Bee training: you take
            a jumble of letters and rebuild them into a real word. The more you
            practise recombining letters, the faster you spot obscure Bee
            answers. Start with our{" "}
            <Link
              href="/cryptic-crossword-for-beginners"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic crossword for beginners
            </Link>{" "}
            guide, then try a few{" "}
            <Link
              href="/cryptic-clue-types/anagram"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              anagram clues
            </Link>{" "}
            to sharpen the same instincts.
          </BodyText>
          <CalloutBox type="tip" title="Try this next">
            Solve today&apos;s one-minute cryptic clue for a quick, self-contained
            word workout — no full crossword required.{" "}
            <Link
              href="/minute-cryptic-today"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Today&apos;s cryptic clue →
            </Link>
          </CalloutBox>
        </ContentSection>

        {/* Ad zone #3 — before FAQ */}

        {/* FAQ */}
        <ContentSection title="Spelling Bee Answers FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Recent puzzles */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Spelling Bee Puzzles" id="archive">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentPuzzles.map((p) => (
                <SpellingBeePuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/spelling-bee-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--cta))]/40 hover:bg-[hsl(var(--cta))]/5 hover:text-foreground"
              >
                View All Spelling Bee Answers →
              </Link>
            </div>
          </ContentSection>
        )}

        {/* Related / more games */}
        <RelatedLinks
          links={[
            {
              href: "/wordle-answer-today",
              title: "Wordle answers today",
              description: "Today's Wordle hints and the answer, spoiler-free.",
            },
            {
              href: "/connections-hint-today",
              title: "Connections hints today",
              description: "Clues and answers for all four Connections groups.",
            },
            {
              href: "/strands-hint-today",
              title: "Strands hints today",
              description: "Today's Strands theme, spangram and word list.",
            },
            {
              href: "/quordle",
              title: "Play Quordle",
              description: "Guess four words at once — daily and practice modes.",
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
