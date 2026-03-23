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
import AnagramSolver from "@/components/tools/AnagramSolver";
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
import Link from "next/link";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-23";

const FAQ_ITEMS = [
  {
    question: "How do you solve an anagram quickly?",
    answer:
      "Start by separating vowels from consonants — this immediately reveals possible syllable structures. Then look for common prefixes (UN-, RE-, PRE-) and suffixes (-ING, -TION, -ATE). Try pairing uncommon letters like Q, X, Z, or J first since they have fewer possible positions. If you are stuck, use an anagram solver to check all possible combinations instantly.",
  },
  {
    question:
      "How do you solve anagrams with multiple words?",
    answer:
      "For multiple-word anagrams, count the total letters and think about how they could split across two or three words. For instance, DORMITORY (9 letters) can become DIRTY ROOM (5+4). In cryptic crosswords, the clue tells you the letter count in parentheses, such as (5,4), which means a five-letter word followed by a four-letter word.",
  },
  {
    question: "What is an anagram indicator in a cryptic crossword?",
    answer:
      "An anagram indicator is a word in the clue that signals the letters need rearranging. Common indicators include words suggesting change or disorder: mixed, broken, scrambled, wild, drunk, revised, reformed, ruined, shattered, and many more. For example, in the clue 'Warning from LATER oddly mixed (5)', the word 'mixed' is the anagram indicator telling you to rearrange LATER into ALERT.",
  },
  {
    question: "Can this anagram solver find names and phrases?",
    answer:
      "This solver searches a curated dictionary of common English words from 3 to 8 letters, optimised for crossword relevance. It does not include proper nouns, place names, or multi-word phrases. For name anagrams or longer phrases, you would need a specialised name anagram tool.",
  },
  {
    question: "What is the difference between an anagram and a jumble?",
    answer:
      "An anagram rearranges all the letters of one word or phrase to form another meaningful word or phrase — every letter must be used exactly once. A jumble is a simpler puzzle where scrambled letters form a single word. In cryptic crosswords, anagram clues always rearrange a specific set of letters indicated in the clue, and the anagram indicator tells you which letters to rearrange.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "AnagramSolver",
    title:
      "Free Anagram Solver Online — Crossword & Word Puzzle Helper",
    description:
      "Free anagram solver for crossword puzzles. Unscramble letters instantly, solve multiple word anagrams, and learn how anagram clues work in cryptic crosswords.",
    keywords: [
      "anagram solver",
      "anagram solver online",
      "anagram solver free",
      "multiple word anagram solver",
      "crossword anagram solver",
      "anagram solver english",
      "anagram unscrambler",
    ],
    locale: locale as Locale,
    path: "/anagram-solver",
    canonicalUrl: "/anagram-solver",
  });
}

export default async function AnagramSolverPage({
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
            name: "Anagram Solver",
            url: `${BASE_URL}/anagram-solver`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title:
            "Free Anagram Solver Online — Crossword & Word Puzzle Helper",
          description:
            "Free anagram solver for crossword puzzles. Unscramble letters instantly, solve multiple word anagrams, and learn how anagram clues work in cryptic crosswords.",
          url: `${BASE_URL}/anagram-solver`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Tool"
        title="Free Anagram Solver for Crossword Puzzles"
        description="Unscramble letters and find every possible word instantly. Built for crossword solvers — enter your jumbled letters and discover anagrams from 3 to 8 letters long."
      />

      <div className="mt-8 space-y-8">
        <AnagramSolver />

        <TableOfContents
          items={[
            { href: "#how-to-use", label: "How to use this anagram solver" },
            { href: "#what-is-anagram", label: "What is an anagram?" },
            {
              href: "#how-to-solve",
              label: "How to solve anagrams step by step",
            },
            {
              href: "#anagrams-in-cryptics",
              label: "Anagrams in cryptic crosswords",
            },
            {
              href: "#tips",
              label: "Tips for solving anagram puzzles",
            },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        {/* Section 1: How to Use */}
        <ContentSection
          title="How to Use This Anagram Solver"
          id="how-to-use"
        >
          <SubHeading>Single Word Anagrams</SubHeading>
          <BodyText>
            Type a single word into the input field and the solver instantly
            shows all valid English words that can be formed from those exact
            letters. For example, typing LISTEN reveals SILENT, TINSEL, ENLIST,
            and INLETS.
          </BodyText>
          <SubHeading>Multiple Word Anagram Solver</SubHeading>
          <BodyText>
            To solve multi-word anagrams, type all the letters together without
            spaces. If your crossword clue has the enumeration (5,4), use the
            length filter to first find matching 5-letter words, then check
            whether the remaining letters form a valid 4-letter word.
          </BodyText>
          <SubHeading>Anagram Solver with Blanks</SubHeading>
          <BodyText>
            If you know some letters but not all, enter only the letters you are
            certain about. The solver finds all words that can be formed from
            your available letters. For a more precise pattern search where you
            know letter positions, try the{" "}
            <Link
              href="/crossword-word-finder"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              crossword word finder
            </Link>{" "}
            instead.
          </BodyText>
        </ContentSection>

        {/* Section 2: What Is an Anagram */}
        <ContentSection
          title="What Is an Anagram?"
          id="what-is-anagram"
        >
          <BodyText>
            An anagram rearranges all the letters of one word or phrase to create
            a completely different word or phrase. Every letter from the original
            must be used exactly once — nothing added, nothing removed. The
            result must be a real, meaningful word.
          </BodyText>
          <SubHeading>Anagram Examples in English</SubHeading>
          <BodyText>
            Some well-known anagrams show how simple letter rearrangement
            can produce surprisingly fitting results:
          </BodyText>
          <ul className="ml-4 list-disc space-y-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <li>
              <strong className="text-foreground">LISTEN</strong> →{" "}
              <strong className="text-foreground">SILENT</strong>
            </li>
            <li>
              <strong className="text-foreground">EARTH</strong> →{" "}
              <strong className="text-foreground">HEART</strong>
            </li>
            <li>
              <strong className="text-foreground">DANGER</strong> →{" "}
              <strong className="text-foreground">GARDEN</strong>
            </li>
            <li>
              <strong className="text-foreground">NOTES</strong> →{" "}
              <strong className="text-foreground">STONE</strong> →{" "}
              <strong className="text-foreground">ONSET</strong> →{" "}
              <strong className="text-foreground">TONES</strong>
            </li>
            <li>
              <strong className="text-foreground">ASTRONOMER</strong> →{" "}
              <strong className="text-foreground">MOON STARER</strong>
            </li>
          </ul>
          <SubHeading>Famous Anagrams in History</SubHeading>
          <BodyText>
            Anagrams have been used for centuries — scientists like Galileo
            encoded discoveries as anagrams to claim priority without revealing
            details. In literature, authors have created character names from
            anagrams. In puzzles and word games, anagrams remain one of the most
            popular and satisfying solving challenges.
          </BodyText>
        </ContentSection>

        {/* Section 3: How to Solve */}
        <ContentSection
          title="How to Solve Anagrams Step by Step"
          id="how-to-solve"
        >
          <BodyText>
            Whether you are solving a word puzzle, playing Scrabble, or tackling
            a cryptic crossword clue, these techniques help you spot anagrams
            faster without relying on a solver tool.
          </BodyText>
          <SubHeading>Separate Vowels and Consonants</SubHeading>
          <BodyText>
            Write the vowels on one side and consonants on the other. This
            reveals the syllable potential of the word. For example, CANOE has
            three vowels (A, O, E) and two consonants (C, N) — rearranging
            gives OCEAN.
          </BodyText>
          <SubHeading>Look for Common Prefixes and Suffixes</SubHeading>
          <BodyText>
            Scan for letter groups that often start or end English words: UN-,
            RE-, PRE-, -ING, -TION, -ATE, -MENT, -NESS, -ER, -ED. Locking in a
            prefix or suffix dramatically reduces the remaining possibilities.
          </BodyText>
          <SubHeading>Try Two-Word Combinations</SubHeading>
          <BodyText>
            If the anagram has many letters, it may form two words rather than
            one. In cryptic crosswords, the enumeration in parentheses tells you
            the word lengths. For a clue with (4,5), separate the 9 letters into
            groups of 4 and 5 and test combinations systematically.
          </BodyText>
          <CalloutBox type="tip" title="Start with Rare Letters">
            Letters like Q, X, Z, J, and K appear in far fewer words than
            common letters. If your jumbled letters include any of these, use
            them as your starting point — they immediately eliminate most
            possibilities and make the anagram much easier to crack.
          </CalloutBox>
        </ContentSection>

        {/* Section 4: Anagrams in Cryptic Crosswords */}
        <ContentSection
          title="Anagrams in Cryptic Crosswords"
          id="anagrams-in-cryptics"
        >
          <BodyText>
            Anagram clues are the most common clue type in cryptic crosswords
            and often the easiest to spot once you know the pattern. Every
            cryptic anagram clue contains three parts: the definition, the
            anagram indicator, and the fodder (the letters to rearrange).
          </BodyText>
          <SubHeading>What Are Anagram Indicators?</SubHeading>
          <BodyText>
            An anagram indicator is a word in the clue that signals the letters
            should be rearranged. These words suggest change, movement, disorder,
            or transformation. Common examples include: <em>mixed</em>,{" "}
            <em>broken</em>, <em>scrambled</em>, <em>wild</em>,{" "}
            <em>ruined</em>, <em>reformed</em>, <em>drunk</em>,{" "}
            <em>dancing</em>, <em>crazy</em>, and <em>scattered</em>.
            See the full list on the{" "}
            <Link
              href="/cryptic-indicators"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic indicators
            </Link>{" "}
            page.
          </BodyText>
          <SubHeading>
            Solving a Cryptic Anagram Clue — Worked Example
          </SubHeading>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 dark:bg-primary/10">
            <p className="font-heading text-base font-bold text-foreground sm:text-lg">
              &quot;Warning from LATER oddly mixed (5)&quot;
            </p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground sm:text-base">
              <p>
                <span className="inline-block w-24 font-semibold text-blue-600 dark:text-blue-400">
                  Definition:
                </span>{" "}
                &quot;Warning&quot; — this is what the answer means
              </p>
              <p>
                <span className="inline-block w-24 font-semibold text-amber-600 dark:text-amber-400">
                  Indicator:
                </span>{" "}
                &quot;mixed&quot; — tells you to rearrange letters
              </p>
              <p>
                <span className="inline-block w-24 font-semibold text-green-600 dark:text-green-400">
                  Fodder:
                </span>{" "}
                &quot;LATER&quot; — the letters to rearrange
              </p>
              <p>
                <span className="inline-block w-24 font-semibold text-purple-600 dark:text-purple-400">
                  Answer:
                </span>{" "}
                <strong className="text-foreground">ALERT</strong> — LATER
                rearranged, meaning &quot;warning&quot;
              </p>
            </div>
          </div>
          <SubHeading>Common Anagram Indicator Words</SubHeading>
          <div className="flex flex-wrap gap-1.5">
            {[
              "mixed",
              "broken",
              "scrambled",
              "wild",
              "drunk",
              "ruined",
              "reformed",
              "shattered",
              "dancing",
              "crazy",
              "scattered",
              "twisted",
              "mangled",
              "organised",
              "converted",
              "rebuilt",
              "modified",
              "confused",
              "wrecked",
              "altered",
            ].map((word) => (
              <span
                key={word}
                className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
              >
                {word}
              </span>
            ))}
          </div>
          <BodyText>
            Want to learn more about anagram clues?{" "}
            <Link
              href="/cryptic-clue-types/anagram"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Read the full anagram clue guide
            </Link>{" "}
            with worked examples and practice clues.
          </BodyText>
        </ContentSection>

        {/* Section 5: Tips */}
        <ContentSection
          title="Tips for Solving Anagram Puzzles"
          id="tips"
        >
          <SubHeading>Start with Uncommon Letters</SubHeading>
          <BodyText>
            If your letters include Q, X, Z, J, or K, place those first. They
            appear in far fewer English words, so they immediately narrow the
            search space. For example, if your letters include Q, the answer
            almost certainly contains QU.
          </BodyText>
          <SubHeading>Use Word Length as a Filter</SubHeading>
          <BodyText>
            In crossword puzzles, the answer length is always given. Use the
            length filter in this anagram solver to show only words of the right
            length. This cuts through clutter and helps you focus on the actual
            candidates.
          </BodyText>
          <SubHeading>Practice with Daily Cryptic Clues</SubHeading>
          <BodyText>
            The best way to improve at solving anagrams is regular practice.
            Try{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              today&apos;s daily cryptic clue
            </Link>{" "}
            — many of them use anagram clues, and each one comes with
            progressive hints and a full explanation to help you learn.
          </BodyText>
        </ContentSection>

        {/* FAQ */}
        <ContentSection title="Anagram Solver FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {/* Related Tools */}
        <RelatedLinks
          links={[
            {
              href: "/crossword-word-finder",
              title: "Crossword word finder",
              description:
                "Search by letter pattern when you know some positions but not all.",
            },
            {
              href: "/cryptic-clue-types/anagram",
              title: "Anagram clue guide",
              description:
                "Learn how anagram clues work in cryptic crosswords with full examples.",
            },
            {
              href: "/cryptic-crossword-solver",
              title: "Cryptic clue solver",
              description:
                "Search by clue text to find answers with full wordplay explanations.",
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
