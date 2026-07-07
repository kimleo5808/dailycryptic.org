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
import LetterBoxedPlay from "@/components/letter-boxed/LetterBoxedPlay";
import LetterBoxedPuzzleCard from "@/components/letter-boxed/LetterBoxedPuzzleCard";
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
  getTodaysLetterBoxedPuzzle,
  getRecentLetterBoxedPuzzles,
  buildLetterBoxedHints,
} from "@/lib/letter-boxed-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What is today's Letter Boxed answer?",
    answer:
      "Today's official New York Times solution is on this page, hidden behind a Reveal button so nothing is spoiled early. Read the spoiler-free hints first — how many words, their lengths, and their starting letters — then reveal the full two-word answer with the path traced on the box for you. We update it every morning.",
  },
  {
    question: "How do you play the game?",
    answer:
      "You are given a square with three letters on each side, twelve in total. Chain words together where each new word begins with the last letter of the previous word. Consecutive letters must come from different sides, letters can be reused, and your words together must use all twelve letters.",
  },
  {
    question: "What is a two-word solution?",
    answer:
      "A two-word solution uses all twelve letters in just two chained words — the last letter of the first word starts the second. The New York Times always publishes a two-word answer as its target, and reaching it in two is considered the gold standard among regular players.",
  },
  {
    question: "Can you reuse letters, and what is the side rule?",
    answer:
      "Yes, you can use any letter as many times as you like. The one hard rule is that you cannot use two letters from the same side in a row — every move must jump to a different side of the box. That single constraint is what makes the puzzle tricky.",
  },
  {
    question: "When does Letter Boxed reset each day?",
    answer:
      "A new Letter Boxed puzzle is released daily at around 3:00 AM Eastern Time, in line with the other New York Times games. Our answer and hints are refreshed each morning shortly after the new box goes live.",
  },
  {
    question: "Is the game free to play?",
    answer:
      "The puzzle is part of the New York Times Games collection and is free to play in the browser and the Games app. Reading the hints and solution here is always free, with no account or sign-up required.",
  },
  {
    question: "Is there an archive?",
    answer:
      "Yes. Our Letter Boxed answers archive keeps every past puzzle we have covered, each with its box, spoiler-free hints and the official solution. It is a good way to review a day you missed.",
  },
  {
    question: "Does the puzzle help with cryptic crosswords?",
    answer:
      "It builds the same letter-level agility — spotting which letters combine into words and thinking flexibly about spelling. That skill carries straight over to anagram clues and other cryptic wordplay, so Letter Boxed fans often take to cryptics quickly.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysLetterBoxedPuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "LetterBoxedAnswersToday",
    title: `NYT Letter Boxed Answers & Hints Today — ${dateStr}`,
    description: `Today's NYT Letter Boxed answer and hints. Spoiler-free nudges first, then the official two-word solution traced on the box. Updated daily, free.`,
    keywords: [
      "letter boxed answers today",
      "letter boxed hints today",
      "letter boxed solution",
      "nyt letter boxed two word solution",
      "nyt letter boxed answers",
      "how to play letter boxed",
    ],
    locale: locale as Locale,
    path: "/letter-boxed-answers-today",
    canonicalUrl: "/letter-boxed-answers-today",
  });
}

export default async function LetterBoxedAnswersTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysLetterBoxedPuzzle();
  const recentPuzzles = await getRecentLetterBoxedPuzzles(4);

  if (!puzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Letter Boxed"
          title="NYT Letter Boxed Answers & Hints"
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
  const hints = buildLetterBoxedHints(puzzle);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Letter Boxed Answers", url: `${BASE_URL}/letter-boxed-answers-today` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Letter Boxed Answers & Hints Today — ${dateLabel}`,
          description:
            "Spoiler-free hints and the official two-word solution for today's NYT Letter Boxed puzzle.",
          url: `${BASE_URL}/letter-boxed-answers-today`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Letter Boxed"
        title="NYT Letter Boxed Answers & Hints Today"
        description={`${dateLabel} — spoiler-free hints first, then the official solution traced on the box.`}
      />

      <div className="mt-8 space-y-8">
        <LetterBoxedPlay
          sides={puzzle.sides}
          solution={puzzle.solution}
          hints={hints}
        />

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Letter Boxed is a
          trademark of The New York Times Company.
        </p>

        {/* Ad zone #1 — after the answer block, before evergreen content */}

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is NYT Letter Boxed?" },
            { href: "#how-to-play", label: "How to play Letter Boxed" },
            { href: "#reading-box", label: "Reading the box & the side rule" },
            { href: "#two-word", label: "How to find a two-word solution" },
            { href: "#strategies", label: "6 solving strategies" },
            { href: "#cryptic", label: "Letter Boxed & cryptic crosswords" },
            { href: "#faq", label: "FAQ" },
            { href: "#archive", label: "Past puzzles" },
          ]}
        />

        {/* B1 */}
        <ContentSection title="What Is NYT Letter Boxed?" id="what-is">
          <BodyText>
            NYT Letter Boxed is a daily word game from The New York Times played on a square. Three letters sit on each of the four sides — twelve
            letters in all — and your goal is to spell words that together use
            every one of them.
          </BodyText>
          <BodyText>
            Words are joined in a chain: each new word must begin with the last
            letter of the word before it. The New York Times sets every puzzle so
            that a two-word solution exists, and finding that tidy two-word answer
            is the challenge most players chase.
          </BodyText>
          <BodyText>
            A fresh box is released every day at around 3:00 AM Eastern Time, alongside the other New York Times games. It is free to play in the
            browser, and there is no time limit — you can keep refining your chain
            until every letter is used.
          </BodyText>
        </ContentSection>

        {/* B2 */}
        <ContentSection title="How to Play Letter Boxed: The Rules" id="how-to-play">
          <SubHeading>Use letters from any side</SubHeading>
          <BodyText>
            You may build words from any of the twelve letters around the box, and
            you can reuse a letter as often as you need. Long words that sweep up
            several fresh letters at once are the most valuable.
          </BodyText>
          <SubHeading>Never use two letters from the same side in a row</SubHeading>
          <BodyText>
            This is the rule that gives Letter Boxed its bite. Each move must jump
            to a different side, so letters that share a side can never sit next
            to each other in a word.
          </BodyText>
          <SubHeading>Chain your words</SubHeading>
          <BodyText>
            The last letter of one word becomes the first letter of the next. You
            can use as many words as you like, but the puzzle is designed to be
            beaten in two.
          </BodyText>
          <SubHeading>Use all twelve letters</SubHeading>
          <BodyText>
            The puzzle is solved only when every one of the twelve letters has
            appeared at least once across your chain. Any letter left untouched
            means you are not finished.
          </BodyText>
        </ContentSection>

        {/* B3 */}
        <ContentSection title="Reading the Box and the Side Rule" id="reading-box">
          <BodyText>
            Before spelling anything, study which letters share a side. Because no
            two letters from the same side can be adjacent, those pairings quietly
            rule out a huge number of otherwise-valid words.
          </BodyText>
          <BodyText>
            The hardest letters to place — J, K, Q, X and Z — deserve attention
            first. Work out which vowel on another side can follow them, and you
            have a foothold. Everything else on the box tends to fall into place
            once the awkward letters are handled.
          </BodyText>
          <CalloutBox type="tip" title="The side rule in one line">
            You can repeat letters and roam anywhere on the box — you just can
            never step to a second letter on the same side without leaving it
            first.
          </CalloutBox>
        </ContentSection>

        {/* B4 */}
        <ContentSection title="How to Find a Two-Word Solution" id="two-word">
          <BodyText>
            A two-word solution is the target the New York Times sets for every
            box. Reaching it means covering all twelve letters in just two chained
            words — a satisfying, minimal answer.
          </BodyText>
          <SubHeading>Pick a strong first word</SubHeading>
          <BodyText>
            Aim for a first word that sweeps up many of the twelve letters,
            especially the awkward ones, and that ends on a letter which can
            comfortably begin a second word. The more letters the first word
            clears, the easier the second becomes.
          </BodyText>
          <SubHeading>Leave a useful pivot letter</SubHeading>
          <BodyText>
            The last letter of your first word is the hinge. Choose a first word
            that ends in a versatile letter — one that begins many words — so your
            second word has room to cover whatever letters remain.
          </BodyText>
          <SubHeading>Count the leftovers</SubHeading>
          <BodyText>
            After the first word, list the letters you still need. If four or five
            remain and they can plausibly sit in one word starting from your pivot
            letter, a two-word solution is within reach.
          </BodyText>
        </ContentSection>

        {/* Ad zone #2 — mid-article */}

        {/* B5 */}
        <ContentSection title="6 Letter Boxed Solving Strategies" id="strategies">
          <SubHeading>1. Clear the rare letters first</SubHeading>
          <BodyText>
            Deal with J, K, Q, X and Z immediately by pairing them with a vowel on
            another side. Postponing them almost always leads to a dead end.
          </BodyText>
          <SubHeading>2. Hunt for long, letter-hungry words</SubHeading>
          <BodyText>
            A single long word that uses seven or eight of the twelve letters puts
            a two-word finish within easy reach. Favour words that cover new
            letters over ones that repeat what you already have.
          </BodyText>
          <SubHeading>3. Lean on prefixes and suffixes</SubHeading>
          <BodyText>
            Endings like -ING, -TION and -ED and beginnings like RE- and UN- help
            you stretch a core word and hop across sides — the same instinct that
            powers our{" "}
            <Link
              href="/anagram-solver"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              anagram solver
            </Link>
            .
          </BodyText>
          <SubHeading>4. Track the letters you still need</SubHeading>
          <BodyText>
            Keep a mental or written list of unused letters. The puzzle is not
            solved until that list is empty, so let it steer your next word.
          </BodyText>
          <SubHeading>5. End on a flexible letter</SubHeading>
          <BodyText>
            Finishing a word on a common starting letter — like T, R, S-free
            consonants, or a vowel — keeps your options open for the next link in
            the chain.
          </BodyText>
          <SubHeading>6. Do not fear obscure words</SubHeading>
          <BodyText>
            The two-word gold standard often leans on an unusual word. If a real
            but uncommon word covers the letters you need, it is fair game.
          </BodyText>
        </ContentSection>

        {/* B6 — cryptic bridge */}
        <ContentSection
          title="Letter Boxed & Cryptic Crosswords: The Same Letter Sense"
          id="cryptic"
        >
          <BodyText>
            Letter Boxed and cryptic crosswords both reward a sharp sense of how
            letters combine. In Letter Boxed you rearrange twelve letters into
            chained words; in a cryptic clue you rearrange the letters of an
            anagram into the answer. The underlying skill — seeing the words
            hidden inside a pile of letters — is identical.
          </BodyText>
          <BodyText>
            That is why players of the daily box tend to pick up anagram clues quickly.
            If you enjoy the daily box, the natural next step is a cryptic clue,
            where the same letter agility meets a bit of playful misdirection.
            Start with our{" "}
            <Link
              href="/cryptic-crossword-for-beginners"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic crossword for beginners
            </Link>{" "}
            guide.
          </BodyText>
          <CalloutBox type="tip" title="Try this next">
            Give the same letter-sense a different workout — solve today&apos;s
            one-minute cryptic clue.{" "}
            <Link
              href="/minute-cryptic-today"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Today&apos;s cryptic clue →
            </Link>
          </CalloutBox>
        </ContentSection>

        {/* Ad zone #3 — before FAQ */}

        <ContentSection title="Letter Boxed FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Letter Boxed Puzzles" id="archive">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentPuzzles.map((p) => (
                <LetterBoxedPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/letter-boxed-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--strands-hint))]/40 hover:bg-[hsl(var(--strands-hint))]/5 hover:text-foreground"
              >
                View All Letter Boxed Answers →
              </Link>
            </div>
          </ContentSection>
        )}

        <RelatedLinks
          links={[
            {
              href: "/spelling-bee-answers-today",
              title: "Spelling Bee answers today",
              description: "Hints, pangram and the full word list for today.",
            },
            {
              href: "/pips-answers-today",
              title: "Pips answers today",
              description: "Strategy hints and full solutions for all three tiers.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description: "Unscramble letters and find every possible word.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description: "Solve a daily one-clue cryptic crossword with hints.",
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
