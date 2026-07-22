import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import LetterIndexGrid from "@/components/word-lists/LetterIndexGrid";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { getBestStarters, totalWordCount } from "@/lib/word-lists-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "How many 5-letter words are there?",
    answer:
      "English has several thousand five-letter words. Wordle itself accepts 12,966 five-letter guesses, of which 2,309 can be the daily answer. Our lists cover the common, real words most useful for solving.",
  },
  {
    question: "What are the best 5-letter words to start Wordle?",
    answer:
      "Words that test common letters win the most information. SLATE and CRANE are top-rated openers because they cover three of the most frequent letters. ADIEU and AUDIO are the best choice if you would rather find the vowels first.",
  },
  {
    question: "What 5-letter word has the most vowels?",
    answer:
      "ADIEU, AUDIO, OUIJA and QUEUE each contain four vowels. If you only count distinct vowels, ADIEU covers A, I, E and U in a single guess, which makes it a popular opening word.",
  },
  {
    question: "Which letters are most common in 5-letter words?",
    answer:
      "E, A, R, O and T appear most often, followed by L, I, S and N. S is common overall but rarely ends a Wordle answer, because most plurals are excluded from the answer list.",
  },
  {
    question: "Are these words valid in Scrabble and Words With Friends?",
    answer:
      "Yes. Every word in these lists is a valid five-letter word, and each one shows its Scrabble and Words With Friends point value so you can use the lists for those games too.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "FiveLetterWords",
    title: "5-Letter Words — Full List & Wordle Finder by Letter",
    description:
      "Every 5-letter word, sorted and filterable. Browse by starting letter, ending letter, or letter position to crack today's Wordle. Free, no signup.",
    keywords: [
      "5 letter words",
      "five letter words",
      "5 letter words for wordle",
      "5 letter words by letter",
    ],
    locale: locale as Locale,
    path: "/5-letter-words",
    canonicalUrl: "/5-letter-words",
  });
}

export default async function FiveLetterWordsHub({
  params,
}: {
  params: Params;
}) {
  await params;
  const starters = getBestStarters();
  const total = totalWordCount();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "5-Letter Words", url: `${BASE_URL}/5-letter-words` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "5-Letter Words",
          description:
            "Browse every 5-letter word by starting letter, ending letter, contained letter, or middle letter to solve Wordle.",
          url: `${BASE_URL}/5-letter-words`,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Words · 5 Letters"
        title="5-Letter Words: The Complete List & Wordle Finder"
        description="Browse every five-letter word by the letters you already know. Pick a starting letter, an ending letter, or a letter locked in the middle to narrow down today's Wordle in seconds."
      />

      <div className="mt-8 space-y-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Pick the letter you already know to see every matching five-letter
          word, common words first — ideal for cracking today&apos;s Wordle.
        </p>

        <ContentSection title="Browse 5-Letter Words by Starting Letter" id="starting">
          <BodyText>
            Choose the letter your word begins with. Each page lists every
            five-letter word starting with that letter, common words first.
          </BodyText>
          <LetterIndexGrid mode="starting-with" />
        </ContentSection>

        <ContentSection title="Browse 5-Letter Words by Ending Letter" id="ending">
          <BodyText>
            Confirmed the last letter? These lists are usually shorter, so a known
            final letter narrows the answer quickly.
          </BodyText>
          <LetterIndexGrid mode="ending-in" />
        </ContentSection>

        <ContentSection title="Browse 5-Letter Words by Middle Letter" id="middle">
          <BodyText>
            A green letter in the third position is one of Wordle&apos;s most
            useful clues. Pick the middle letter to see every word built around it.
          </BodyText>
          <LetterIndexGrid mode="middle" />
        </ContentSection>

        <ContentSection title="Browse 5-Letter Words Containing a Letter" id="containing">
          <BodyText>
            Have a yellow tile? These lists collect every five-letter word that
            contains the letter anywhere, so you can find a spot for it.
          </BodyText>
          <LetterIndexGrid mode="with" />
        </ContentSection>

        <ContentSection title="How Many 5-Letter Words Are There?" id="how-many">
          <BodyText>
            There are several thousand five-letter words in English. The game of
            Wordle accepts <strong>12,966</strong> five-letter guesses, and{" "}
            <strong>2,309</strong> of those can ever be the daily answer. Our
            lists index {total.toLocaleString()} genuine five-letter words and
            rank the common ones first, so the words you actually need rise to the
            top.
          </BodyText>
          <BodyText>
            Five letters is the sweet spot for word games. It is long enough for
            real variety yet short enough to hold in your head, which is exactly
            why Wordle, Scrabble openings and countless spelling puzzles lean on
            five-letter words. Whether you are chasing a green tile or a
            high-scoring Scrabble play, the same core vocabulary does the work.
          </BodyText>
          <BodyText>
            Every list on this page is filterable by the clue you already have.
            Know the first letter? Use the starting-letter index. Stuck on the
            middle? Jump to the middle-letter pages. Each list shows Scrabble and
            Words With Friends scores plus a short definition for the trickier
            words.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use These Lists for Wordle" id="use-for-wordle">
          <BodyText>
            Wordle gives you three kinds of clue, and each one maps to a different
            list. A <strong>green</strong> letter is locked to its position, so if
            your green tile is the first letter, open the matching
            starting-letter list. A green letter in the third slot points you to
            the middle-letter list.
          </BodyText>
          <BodyText>
            A <strong>yellow</strong> letter is in the word but in the wrong spot.
            The &quot;words with a letter&quot; lists gather every word that
            contains that letter, so you can scan for candidates that place it
            somewhere new. Cross-reference two yellows and the field shrinks fast.
          </BodyText>
          <BodyText>
            A <strong>gray</strong> letter is not in the word at all. Use the lists
            to spot words that avoid your gray letters while still testing fresh
            ones. When several candidates remain, the best next guess is often a
            word that tests the letters they differ by — even if it cannot be the
            answer itself. For that, feed your clues into the{" "}
            <Link
              href="/wordle-solver"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Wordle solver
            </Link>
            , which filters all of these words live.
          </BodyText>
        </ContentSection>

        <ContentSection title="Best 5-Letter Words to Start Wordle" id="best-starters">
          <BodyText>
            A strong opener tests as many common letters as possible in one go.
            These words rank near the top of letter-frequency analysis. Pick a
            frequency-first word like SLATE, or a vowel-first word like AUDIO if
            you prefer to pin the vowels down early.
          </BodyText>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Word</th>
                  <th className="px-3 py-2 text-right">Scrabble</th>
                  <th className="px-3 py-2">Why it works</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {starters.map((s, i) => (
                  <tr key={s.word} className="even:bg-muted/40">
                    <td className="px-3 py-2 font-mono font-semibold">{s.word}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {s.scrabble}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {
                        [
                          "Tests three of the most common letters plus two frequent consonants.",
                          "Balanced consonant coverage; a long-time solver favourite.",
                          "The same strong letters as CRATE in a different order.",
                          "Good for ruling out T, N and L early.",
                          "An anagram of TRACE with equally strong coverage.",
                          "A vowel-first opener that tests four vowels at once.",
                        ][i]
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BodyText>
            Whatever you open with, follow it with a second guess made of five
            completely different letters. Two well-chosen guesses routinely clear
            ten of the twenty-six letters and leave only a handful of candidates.
          </BodyText>
        </ContentSection>

        <ContentSection title="Most Common Letters in 5-Letter Words" id="common-letters">
          <BodyText>
            Knowing which letters appear most often tells you what to test first.
            Across common five-letter words, these lead the pack:
          </BodyText>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Letter</th>
                  <th className="px-3 py-2">Where it tends to sit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["1", "E", "Very common at the end and second-to-last slot"],
                  ["2", "A", "Frequent in the middle two positions"],
                  ["3", "R", "Common as a second or fourth letter"],
                  ["4", "O", "Often the second letter"],
                  ["5", "T", "Frequent first and last letter"],
                  ["6", "L, I, S, N", "Broadly spread across positions"],
                ].map((row) => (
                  <tr key={row[0]} className="even:bg-muted/40">
                    <td className="px-3 py-2 font-mono text-muted-foreground">{row[0]}</td>
                    <td className="px-3 py-2 font-mono font-semibold">{row[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SubHeading>A quick note on vowels</SubHeading>
          <BodyText>
            Most five-letter words carry one or two vowels, but a few pack in
            three or four. Testing several vowels early — with a word like ADIEU
            or AUDIO — is a reliable way to fix the shape of the answer before you
            chase consonants.
          </BodyText>
        </ContentSection>

        <ContentSection title="Five-Letter Words Beyond Wordle">
          <BodyText>
            Wordle made five-letter words famous, but they earn their keep across
            dozens of games. In Scrabble and Words With Friends, a well-placed
            five-letter word can open a triple-word score or dump an awkward Q, Z
            or X for a big haul — which is why every list on this site shows both
            scores. Anagram games, crosswords and the daily word puzzles that
            followed Wordle all draw from the same pool.
          </BodyText>
          <BodyText>
            That overlap is useful. The vocabulary that makes a strong Wordle
            guess — common letters, balanced vowels, no repeated tiles — tends to
            be the same vocabulary that scores well elsewhere. Learn the common
            five-letter words once and the payoff shows up in every word game you
            play.
          </BodyText>
          <BodyText>
            If you want to keep the practice going, our{" "}
            <Link
              href="/wordle-unlimited"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              unlimited Wordle
            </Link>{" "}
            game lets you play as many rounds as you like with word lengths from
            four to seven, so you can drill the patterns these lists reveal without
            waiting for tomorrow&apos;s puzzle.
          </BodyText>
        </ContentSection>

        <ContentSection title="5-Letter Words FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/wordle-solver",
              title: "Wordle Solver",
              description: "Filter every 5-letter word by your green, yellow and gray clues.",
            },
            {
              href: "/wordle-answer-today",
              title: "Today's Wordle answer",
              description: "Progressive hints and the answer for today's puzzle.",
            },
            {
              href: "/anagram-solver",
              title: "Anagram solver",
              description: "Rearrange letters you already have into real words.",
            },
          ]}
        />

        <p className="text-center text-[11px] text-muted-foreground">
          Definitions derived from WordNet (Princeton University), used under its
          permissive licence.
        </p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
