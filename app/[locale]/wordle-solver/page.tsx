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
import WordleSolver from "@/components/wordle-solver/WordleSolver";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "Is this Wordle solver free?",
    answer:
      "Yes. The Wordle solver is completely free, needs no account, and has no daily limit. It runs entirely in your browser and never connects to your live New York Times game.",
  },
  {
    question: "How does a Wordle solver work?",
    answer:
      "It filters the full list of valid five-letter words against the clues you already have. It keeps only words that place your green letters in the exact same spots, contain your yellow letters somewhere else, and use none of your gray letters.",
  },
  {
    question: "Is using a Wordle solver cheating?",
    answer:
      "There is no official rulebook. Most players treat a Wordle solver as a reference tool for when they are stuck, the same way a crossword dictionary helps with a crossword. Using it every single turn removes the challenge, so we suggest reaching for it only after your own guesses stall.",
  },
  {
    question: "How many words can Wordle be?",
    answer:
      "The original Wordle list holds 12,966 valid guesses but only 2,309 of those can ever be the daily answer. Turn on the 'Answer words only' toggle to search just the answer list instead of every allowed guess.",
  },
  {
    question: "What is the best word to start Wordle?",
    answer:
      "Letter-frequency analysis rates SLATE and CRANE among the strongest openers because they test five of the most common letters. If you prefer to find vowels first, ADIEU and AUDIO each test four vowels in a single guess.",
  },
  {
    question: "Can I use the solver for 4, 6 or 7-letter Wordle games?",
    answer:
      "Yes. Switch the word length to 4, 5, 6 or 7 to solve Wordle variants and spin-offs that use longer or shorter words.",
  },
  {
    question: "Does it work for Quordle or Dordle?",
    answer:
      "Yes — solve one board at a time by entering that board's green, yellow and gray clues. Then move on to the next board and repeat.",
  },
  {
    question: "What should I do after I get the candidate list?",
    answer:
      "Pick the word that tests the most letters you have not tried yet, especially common ones. That narrows the next guess fastest. If you only want today's answer, our daily Wordle hint page reveals it with progressive clues.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Enter your green letters",
    text: "Type the letters you know and tap each tile to green if Wordle placed that letter in the correct spot.",
  },
  {
    name: "Mark your yellow letters",
    text: "Tap a tile to yellow for a letter that is in the word but sitting in the wrong position.",
  },
  {
    name: "Exclude your gray letters",
    text: "Leave typed letters gray, or add them to the 'letters not in the word' field, to remove them from every result.",
  },
  {
    name: "Read the candidate list",
    text: "The solver shows every word that still fits, sorted best-guess-first. Choose the word that tests the most new common letters.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "WordleSolver",
    title: "Free Wordle Solver — Instant Word Finder & Helper",
    description:
      "Enter your green, yellow and gray letters and get every possible Wordle word instantly. Free, no signup, sorted by best guess. Works for 4–7 letters.",
    keywords: [
      "wordle solver",
      "wordle helper",
      "wordle word finder",
      "wordle answer finder",
      "5 letter word solver",
    ],
    locale: locale as Locale,
    path: "/wordle-solver",
    canonicalUrl: "/wordle-solver",
  });
}

export default async function WordleSolverPage({
  params,
}: {
  params: Params;
}) {
  await params;

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Wordle Solver",
    description:
      "Free tool that filters every valid Wordle word by your green, yellow and gray clues.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    url: `${BASE_URL}/wordle-solver`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Wordle Solver", url: `${BASE_URL}/wordle-solver` },
        ])}
      />
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd
        data={howToSchema(
          "How to Use the Wordle Solver",
          "Enter your Wordle clues to find every word that still fits.",
          HOWTO_STEPS
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Wordle · Solver"
        title="Free Wordle Solver: Find Every Word That Still Fits"
        description="Type the letters you already know — green for the right spot, yellow for the wrong spot, gray for letters not in the word — and this Wordle solver filters all 12,966 valid words down to the ones that can still win."
      />

      {/* TOOL — above the fold */}
      <div className="mt-6">
        <WordleSolver />
      </div>

      {/* Long-form content below the tool */}
      <div className="mt-10 space-y-8">
        <TableOfContents
          items={[
            { href: "#why", label: "Why a Wordle solver helps" },
            { href: "#what-is", label: "What is a Wordle solver?" },
            { href: "#how-to", label: "How to use it in 4 steps" },
            { href: "#uses", label: "What you can do with it" },
            { href: "#starting-words", label: "Best Wordle starting words" },
            { href: "#letters", label: "Most common letters in Wordle" },
            { href: "#cheating", label: "Is it cheating?" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="Why a Wordle Solver Helps When You're Stuck" id="why">
          <BodyText>
            Wordle has <strong>12,966 valid guesses</strong> but only{" "}
            <strong>2,309 words</strong> that can ever be the answer. When you are
            three or four guesses in with two green tiles and a floating yellow,
            your brain runs out of matching words long before the list does.
          </BodyText>
          <BodyText>
            That is the gap a Wordle solver closes. Instead of staring at the grid,
            you hand the tool everything the puzzle has already told you and it
            collapses thousands of possibilities into the short list that still
            fits — usually in well under a second.
          </BodyText>
          <BodyText>
            The point is not to skip the puzzle. Used well, the candidate list
            teaches you which letter patterns are worth testing, so over time you
            reach the answer in fewer guesses on your own. Think of it as a
            reference, the way a{" "}
            <Link
              href="/crossword-word-finder"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              word finder
            </Link>{" "}
            helps with a crossword rather than solving it for you.
          </BodyText>
        </ContentSection>

        <ContentSection title="What Is a Wordle Solver?" id="what-is">
          <CalloutBox type="highlight" title="In one sentence">
            A Wordle solver is a free tool that filters the list of valid
            five-letter Wordle words using the clues you already have — green
            letters locked to a position, yellow letters present but misplaced,
            and gray letters excluded — and returns every word that can still be
            the answer.
          </CalloutBox>
          <BodyText>
            What it is <em>not</em> is just as important. It is not an official New
            York Times product, it is not connected to your live game, and it does
            not guarantee a solve in a set number of guesses. It simply narrows the
            field so you can make a smarter next move.
          </BodyText>
          <BodyText>The tool reads three kinds of clue:</BodyText>
          <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              <strong className="text-[#6aaa64] dark:text-[#7cbf70]">Green</strong>{" "}
              — the letter is correct and in that exact position.
            </li>
            <li>
              <strong className="text-[#b59f3b] dark:text-[#c9b458]">Yellow</strong>{" "}
              — the letter is in the word, but not in that spot.
            </li>
            <li>
              <strong className="text-[#787c7e]">Gray</strong> — the letter is not
              in the word at all.
            </li>
          </ul>
        </ContentSection>

        <ContentSection title="How to Use the Wordle Solver in 4 Steps" id="how-to">
          <div className="space-y-3">
            {HOWTO_STEPS.map((step, i) => (
              <div key={step.name} className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-sm font-bold text-foreground">{step.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CalloutBox type="tip" title="Pro tip — use a probe word">
            When ten or more candidates remain, don&apos;t guess one of them.
            Guess a word that tests the letters they <em>differ</em> by. You spend
            a turn, but you usually guarantee the next one. Example: with{" "}
            <span className="font-mono">_ R A _ E</span> and BRAVE, CRAVE, GRAVE and
            GRADE all live, a word testing B, C, G and D at once tells you which
            branch to take.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="What You Can Do With the Solver" id="uses">
          <SubHeading>Break a two-green stall</SubHeading>
          <BodyText>
            The classic use: you have the shape of the word but the remaining
            letters won&apos;t come. Enter the greens and the letters you have
            ruled out, and the shortlist appears at once.
          </BodyText>
          <SubHeading>Solve longer and shorter variants</SubHeading>
          <BodyText>
            Switch the word length to 4, 6 or 7 to handle spin-off games, then jump
            straight into{" "}
            <Link
              href="/wordle-unlimited"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              unlimited Wordle
            </Link>{" "}
            to practise with no daily cap.
          </BodyText>
          <SubHeading>Clear a Quordle board</SubHeading>
          <BodyText>
            Four grids at once gets overwhelming fast. Solve one board at a time,
            then carry the shared letters over to the next. Play{" "}
            <Link
              href="/quordle"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Quordle
            </Link>{" "}
            when you want the full challenge.
          </BodyText>
          <SubHeading>Unscramble the letters you know</SubHeading>
          <BodyText>
            If you already have the right letters but not the order, our{" "}
            <Link
              href="/anagram-solver"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              anagram solver
            </Link>{" "}
            rearranges them into every real word.
          </BodyText>
        </ContentSection>

        <ContentSection title="Best Wordle Starting Words" id="starting-words">
          <BodyText>
            A strong opener tests common letters in one go. These words rank near
            the top of letter-frequency and solver analyses. Pick a frequency-first
            word like SLATE, or a vowel-first word like AUDIO if you would rather
            pin down the vowels early.
          </BodyText>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Word</th>
                  <th className="px-3 py-2">Letters tested</th>
                  <th className="px-3 py-2">Style</th>
                  <th className="px-3 py-2">Why it&apos;s strong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["SLATE", "S L A T E", "Frequency", "Three of the most common letters plus two frequent consonants"],
                  ["CRANE", "C R A N E", "Frequency", "Balanced consonant coverage; a long-time solver favourite"],
                  ["TRACE", "T R A C E", "Frequency", "Same strong letters as CRATE in a different order"],
                  ["SLANT", "S L A N T", "Frequency", "Good when you want to rule out T, N and L early"],
                  ["ADIEU", "A D I E U", "Vowel-first", "Four vowels in one guess"],
                  ["AUDIO", "A U D I O", "Vowel-first", "Tests four vowels; pairs well with a consonant-heavy second guess"],
                ].map((row) => (
                  <tr key={row[0]} className="even:bg-muted/40">
                    <td className="px-3 py-2 font-mono font-semibold">{row[0]}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{row[1]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row[2]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BodyText>
            Whatever you open with, follow it with a second guess that tests five
            completely different letters. Two well-chosen guesses routinely clear
            ten of the twenty-six letters and leave the solver with a tiny shortlist.
          </BodyText>
        </ContentSection>

        <ContentSection title="Most Common Letters in Wordle" id="letters">
          <BodyText>
            Knowing which letters appear most often tells you what to test first.
            Across the 2,309 answer words, these letters lead the pack:
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
                  ["1", "E", "Very common at the end and second-to-last position"],
                  ["2", "A", "Frequent in the middle two positions"],
                  ["3", "R", "Common as a second or fourth letter"],
                  ["4", "O", "Often the second letter"],
                  ["5", "T", "Frequent first and last letter"],
                  ["6", "L, I, S, N", "Broadly spread; S rarely ends answer words"],
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
          <BodyText>
            One quirk worth remembering: although S is a very common letter, the
            answer list rarely ends in S, because plurals are mostly excluded. The
            solver already knows the real word list, so it will never suggest a word
            that cannot be the answer.
          </BodyText>
        </ContentSection>

        <ContentSection title="Is Using a Wordle Solver Cheating?" id="cheating">
          <BodyText>
            There is no referee, so the honest answer is: it depends on how you use
            it. Leaning on the solver for every guess turns the game into data
            entry. Reaching for it once, after your own ideas dry up, is closer to
            checking a dictionary — a reference, not a shortcut past the whole
            puzzle.
          </BodyText>
          <BodyText>
            If you would rather sharpen your unaided game, three habits help most.
            First, open with a word that tests five common letters. Second, use your
            second guess to test five brand-new letters rather than chasing a single
            yellow. Third, when a guess comes back &quot;one away,&quot; change only
            one letter at a time.
          </BodyText>
          <BodyText>
            Prefer just the answer without the work? Our{" "}
            <Link
              href="/wordle-answer-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              today&apos;s Wordle answer and hints
            </Link>{" "}
            page reveals it one clue at a time, and the{" "}
            <Link
              href="/wordle-answer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              full answer archive
            </Link>{" "}
            covers every past puzzle.
          </BodyText>
        </ContentSection>

        <ContentSection title="Wordle Solver FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/wordle-answer-today",
              title: "Today's Wordle answer",
              description: "Progressive hints and the answer for today's puzzle.",
            },
            {
              href: "/wordle-unlimited",
              title: "Wordle Unlimited",
              description: "Play endless Wordle from 4 to 7 letters, no daily cap.",
            },
            {
              href: "/quordle",
              title: "Play Quordle",
              description: "Guess four words at once in nine tries.",
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
