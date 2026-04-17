import {
  BodyText,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import QuordleApp from "@/components/quordle/QuordleApp";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
  videoGameSchema,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const CANONICAL_PATH = "/quordle";

const FAQ_ITEMS = [
  {
    question: "Is Quordle free to play?",
    answer:
      "Yes. Quordle on dailycryptic.org is completely free. There are no accounts, no downloads, and no paywalls. Every daily puzzle and unlimited practice games are available immediately in your browser.",
  },
  {
    question: "How many guesses do you get in Quordle?",
    answer:
      "You get nine total guesses to solve all four words. Each guess you type is scored against every board at the same time, so a single entry gives you clues for four puzzles simultaneously.",
  },
  {
    question: "What time does the daily Quordle reset?",
    answer:
      "The daily puzzle on this site resets at midnight UTC. That means new answers appear at 7:00 PM Eastern Time the previous day, 4:00 PM Pacific Time, and midnight in London during GMT. Everyone worldwide sees the same four words on the same UTC calendar day.",
  },
  {
    question: "What's the difference between Quordle and Wordle?",
    answer:
      "Wordle asks you to guess one five-letter word in six tries. Quordle asks you to guess four five-letter words at the same time in nine tries. Each guess you enter is scored against all four boards in parallel, which forces you to track multiple sets of clues at once.",
  },
  {
    question: "Are the four Quordle words related to each other?",
    answer:
      "No. The four answers are independent. They are not a theme, a category, or a word ladder. Treat each board as its own puzzle that happens to share your input with the other three.",
  },
  {
    question: "What are the best starting words for Quordle?",
    answer:
      "Strong openers cover as many common vowels and consonants as possible. ADIEU, AUDIO, STARE, RAISE, and CRANE are popular choices. Many players use two different starting words to cover ten unique letters before trying to solve.",
  },
  {
    question: "Can I play past Quordle puzzles?",
    answer:
      "Daily mode locks each calendar day to its own puzzle, but you can switch to Practice mode for unlimited random games. A dated archive of past daily puzzles is planned for a future update.",
  },
  {
    question: "Is Quordle harder than Wordle?",
    answer:
      "Quordle is harder in two ways. You must solve four answers, not one, and your input has to serve four boards simultaneously. A guess that reveals useful information on one board can waste a turn on another. The nine-guess allowance is generous, but the cognitive load is significantly higher than Wordle.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Start with a strong opener",
    text: "Type any valid five-letter word and press Enter. Your guess appears on all four boards at once and each letter is color-coded against each target.",
  },
  {
    name: "Read the four sets of clues in parallel",
    text: "Green means the letter is in the correct position for that board. Yellow means the letter is in the word but in a different slot. Gray means the letter is not in that word at all.",
  },
  {
    name: "Pick a second guess that covers new letters",
    text: "Rather than chasing greens immediately, spend your second turn on five unused common letters. Two well-chosen openers can reveal feedback on ten letters across all four boards.",
  },
  {
    name: "Solve one board when you are confident",
    text: "Once a board shows four greens in one guess away, commit that guess. Locking in a board removes it from your attention and frees cognitive space for the remaining puzzles.",
  },
  {
    name: "Finish the remaining boards before running out",
    text: "You have nine total guesses to solve all four. Avoid repeating guesses that no longer give new information. If you see two plausible answers for one board, guess the one that also reveals letters for the others.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "Quordle",
    title:
      "Quordle — Play Today's Daily 4-Word Puzzle (Free, No Sign-In)",
    description:
      "Play Quordle free online. Guess 4 five-letter words in 9 tries. New daily puzzle every day, plus unlimited practice mode and strategy tips.",
    keywords: [
      "quordle",
      "quordle today",
      "quordle game",
      "daily quordle",
      "quordle hint",
      "play quordle",
      "quordle online",
      "how to play quordle",
      "what is quordle",
      "quordle practice",
    ],
    locale: locale as Locale,
    path: CANONICAL_PATH,
    canonicalUrl: CANONICAL_PATH,
  });
}

export default async function QuordlePage({ params }: { params: Params }) {
  await params;
  const pageUrl = `${BASE_URL}${CANONICAL_PATH}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Games", url: BASE_URL },
          { name: "Quordle", url: pageUrl },
        ])}
      />
      <JsonLd
        data={videoGameSchema({
          name: "Quordle — Daily 4-Word Puzzle",
          description:
            "A free online Quordle game. Guess four five-letter words in nine tries. Includes a daily puzzle and unlimited practice mode.",
          url: pageUrl,
          genre: "Word puzzle",
        })}
      />
      <JsonLd
        data={howToSchema(
          "How to Play Quordle",
          "Quordle is a four-board Wordle played in parallel. You have nine total guesses to solve all four five-letter words. Every guess is scored against every board at once.",
          HOW_TO_STEPS,
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <header className="text-center">
        <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          Play Quordle — Daily 4-Word Puzzle
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Guess 4 five-letter words in 9 tries · new puzzle daily · unlimited practice
        </p>
      </header>

      {/* Above-the-fold game */}
      <div className="mt-3">
        <QuordleApp />
      </div>

      <div className="mt-10 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-quordle", label: "What is Quordle?" },
            { href: "#how-to-play", label: "How to play Quordle" },
            { href: "#rules-glance", label: "Rules at a glance" },
            { href: "#strategies", label: "10 strategies to solve faster" },
            { href: "#starting-words", label: "Best starting words" },
            { href: "#compare", label: "Quordle vs Wordle, Dordle, Octordle" },
            { href: "#daily", label: "Daily Quordle & reset time" },
            { href: "#hard-mode", label: "Hard-mode tips" },
            { href: "#mistakes", label: "5 common mistakes to avoid" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is Quordle?" id="what-is-quordle">
          <BodyText>
            Quordle is a daily word game where you try to guess four different
            five-letter words at the same time. Every guess you type appears on
            all four boards simultaneously, and each letter is scored against
            each of the four hidden answers.
          </BodyText>
          <BodyText>
            Think of it as four parallel games of Wordle that share a single
            input. The rules are familiar: a green tile means the letter is in
            the right spot, yellow means the letter exists in the word but in a
            different position, and gray means the letter is not in that
            particular word.
          </BodyText>
          <BodyText>
            The game was created in 2022 by Freddie Meyer as a harder
            alternative to Wordle, inspired by Dordle (two boards) and
            Octordle (eight boards). Today the name &quot;Quordle&quot; is
            almost a genre of its own. On this page you can play a daily
            four-board puzzle, or switch to Practice mode for unlimited random
            games.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Play Quordle" id="how-to-play">
          <SubHeading>Objective</SubHeading>
          <BodyText>
            Solve all four hidden five-letter words within nine total guesses.
            Each guess must be a real word, and your input is scored against
            every board at once.
          </BodyText>
          <SubHeading>Color scoring</SubHeading>
          <BodyText>
            Green tiles mean the letter is in the correct position for that
            board. Yellow tiles mean the letter is in the word but in a
            different position. Gray tiles mean the letter does not appear in
            that board&apos;s answer. The same letter can score differently on
            each board because each board has its own answer.
          </BodyText>
          <SubHeading>Guess limit</SubHeading>
          <BodyText>
            You have nine guesses to solve four words. That is more generous
            than Wordle&apos;s six guesses for one word, but it is also much
            harder. A single guess gives you information on four puzzles, so
            efficient openers matter.
          </BodyText>
          <SubHeading>Daily versus Practice</SubHeading>
          <BodyText>
            In Daily mode every player worldwide gets the same four answers
            tied to the current UTC date. Practice mode generates four fresh
            random answers each time you start a new game, and lets you play
            as many rounds as you want.
          </BodyText>
          <SubHeading>Sharing your result</SubHeading>
          <BodyText>
            After you finish, use the Share button to copy or share a
            spoiler-free emoji grid. It lists how many guesses each of the
            four boards required, without revealing the actual words.
          </BodyText>
        </ContentSection>

        <ContentSection title="Quordle Rules at a Glance" id="rules-glance">
          <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            <li>Guess four five-letter words.</li>
            <li>You have nine total guesses, not nine per board.</li>
            <li>Every guess is scored against every board at the same time.</li>
            <li>Green = correct letter and correct position.</li>
            <li>Yellow = correct letter, wrong position.</li>
            <li>Gray = the letter is not in that board&apos;s answer.</li>
            <li>Guesses must be valid English words from the dictionary.</li>
            <li>All four boards must be solved for a win.</li>
          </ul>
        </ContentSection>

        <ContentSection
          title="10 Strategies to Solve Quordle Faster"
          id="strategies"
        >
          <SubHeading>1. Cover the vowels on your first guess</SubHeading>
          <BodyText>
            Your opening word should include as many common vowels as possible.
            Words like ADIEU and AUDIO hit four vowels in one turn, which
            gives you immediate feedback on every board.
          </BodyText>
          <SubHeading>2. Use a consonant-heavy second guess</SubHeading>
          <BodyText>
            Once your first guess has surveyed the vowels, spend your second
            turn on five common consonants you have not tried yet. This
            two-word opening can give you feedback on ten unique letters
            before you try to solve anything.
          </BodyText>
          <SubHeading>3. Treat each board as an independent puzzle</SubHeading>
          <BodyText>
            Do not assume the four answers are thematically linked. They are
            chosen independently. Solve each board on its own terms rather
            than looking for a pattern across them.
          </BodyText>
          <SubHeading>4. Solve the easiest board first</SubHeading>
          <BodyText>
            Scan the four boards after each guess and focus on the one with
            the most green and yellow tiles. Locking in that answer removes
            it from your attention and frees working memory for the others.
          </BodyText>
          <SubHeading>5. Do not waste guesses on one board</SubHeading>
          <BodyText>
            If you are close to solving a single board but three others are
            still blank, resist the temptation to &quot;just try&quot; a
            candidate. A guess that only helps one board is expensive when
            three puzzles still need information.
          </BodyText>
          <SubHeading>6. Reuse confirmed green letters</SubHeading>
          <BodyText>
            When a letter is green on one board, keep it in that position on
            your future guesses for that board. Do not experiment with
            already-solved positions.
          </BodyText>
          <SubHeading>7. Watch for double letters</SubHeading>
          <BodyText>
            Words like BERRY, LLAMA, and ABBEY repeat letters. A single green
            or yellow hit does not rule out a double. When you suspect a
            double, try a guess that places the letter in both candidate
            positions.
          </BodyText>
          <SubHeading>8. Work systematically, not emotionally</SubHeading>
          <BodyText>
            Quordle punishes panic. When you are stuck, write down the
            letters you know are in and out for each board before typing.
            Two minutes of thinking is worth three wasted guesses.
          </BodyText>
          <SubHeading>9. Time-box each guess</SubHeading>
          <BodyText>
            Avoid staring at a single board for more than a minute. If you
            can&apos;t see the next move, look at the other boards — a
            breakthrough on one often unlocks insight for the others through
            shared letters.
          </BodyText>
          <SubHeading>10. Know when to guess versus calculate</SubHeading>
          <BodyText>
            If one board has two possible answers and you still have three
            guesses left, a calculated coin flip is often better than spending
            a turn narrowing it down. Information has a cost in Quordle, and
            sometimes the fastest route is the bold one.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Best Starting Words for Quordle"
          id="starting-words"
        >
          <BodyText>
            The strongest Quordle openers cover a lot of vowels or a lot of
            common consonants. Here is a short table of frequently recommended
            starters, with notes on why each one works.
          </BodyText>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/60 text-left">
                  <th className="border border-border px-3 py-2 font-semibold">Word</th>
                  <th className="border border-border px-3 py-2 font-semibold">Vowels</th>
                  <th className="border border-border px-3 py-2 font-semibold">Consonants</th>
                  <th className="border border-border px-3 py-2 font-semibold">Why it works</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">ADIEU</td>
                  <td className="border border-border px-3 py-2">A, I, E, U</td>
                  <td className="border border-border px-3 py-2">D</td>
                  <td className="border border-border px-3 py-2">Four vowels in one guess.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">AUDIO</td>
                  <td className="border border-border px-3 py-2">A, U, I, O</td>
                  <td className="border border-border px-3 py-2">D</td>
                  <td className="border border-border px-3 py-2">Four vowels plus a common D.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">STARE</td>
                  <td className="border border-border px-3 py-2">A, E</td>
                  <td className="border border-border px-3 py-2">S, T, R</td>
                  <td className="border border-border px-3 py-2">Three of the top-six consonants.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">RAISE</td>
                  <td className="border border-border px-3 py-2">A, I, E</td>
                  <td className="border border-border px-3 py-2">R, S</td>
                  <td className="border border-border px-3 py-2">Balanced vowel + consonant mix.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">CRANE</td>
                  <td className="border border-border px-3 py-2">A, E</td>
                  <td className="border border-border px-3 py-2">C, R, N</td>
                  <td className="border border-border px-3 py-2">Information-dense per MIT study.</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2 font-mono font-semibold text-foreground">ROATE</td>
                  <td className="border border-border px-3 py-2">O, A, E</td>
                  <td className="border border-border px-3 py-2">R, T</td>
                  <td className="border border-border px-3 py-2">Three vowels and two frequent consonants.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <BodyText>
            A popular two-guess opening is ADIEU followed by a consonant-heavy
            word like CHOMP, SHOUT, or PLUMB. Together those two guesses
            survey ten common letters and leave you seven guesses to solve
            four boards.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Quordle vs Wordle, Dordle, and Octordle"
          id="compare"
        >
          <SubHeading>Quordle vs Wordle</SubHeading>
          <BodyText>
            Wordle is one board, one answer, and six guesses. Quordle is four
            boards, four answers, and nine guesses. The math changes
            completely: in Wordle every guess helps you converge on a single
            word, while in Quordle every guess has to pull double, triple, or
            quadruple duty.
          </BodyText>
          <SubHeading>Quordle vs Dordle</SubHeading>
          <BodyText>
            Dordle is the two-board version that originally inspired Quordle.
            You get seven guesses for two words. The strategy feels much
            closer to regular Wordle because you can afford to chase a near
            solve on one board.
          </BodyText>
          <SubHeading>Quordle vs Octordle</SubHeading>
          <BodyText>
            Octordle bumps the board count to eight and gives you thirteen
            guesses. It is the hardest cousin of the family. Many players use
            Quordle as practice before attempting Octordle because the
            parallel-thinking skill is the same.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Daily Quordle: Reset Time and Archive"
          id="daily"
        >
          <BodyText>
            The daily puzzle on this page resets at midnight UTC, which means
            7:00 PM Eastern Time the previous evening, 4:00 PM Pacific Time,
            and midnight in London during GMT. Everyone worldwide plays the
            same four answers on a given UTC day.
          </BodyText>
          <BodyText>
            Your progress is saved locally in your browser, so you can close
            the tab and return later to finish the same puzzle. The next day
            brings a new set of four answers automatically. If you want
            unlimited games, switch to Practice mode with the tabs above the
            board.
          </BodyText>
        </ContentSection>

        <ContentSection title="Quordle Hard-Mode Tips" id="hard-mode">
          <BodyText>
            If the standard game feels too easy, you can impose a self-hard
            mode: commit to using every confirmed green and yellow letter in
            every subsequent guess for that board. It sounds strict, but it
            forces you to think about which letters each answer needs rather
            than throwing probes.
          </BodyText>
          <BodyText>
            Another self-imposed challenge is to solve in six or fewer
            guesses. Because Quordle allows nine, treating the last three as
            unusable simulates the Wordle-style pressure and rewards more
            efficient openers.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="5 Common Mistakes to Avoid"
          id="mistakes"
        >
          <SubHeading>Chasing one board too early</SubHeading>
          <BodyText>
            Solving the first board in three guesses feels satisfying, but it
            can leave you with only six guesses for three still-blank boards.
            Spread information across all four boards early.
          </BodyText>
          <SubHeading>Ignoring confirmed letters</SubHeading>
          <BodyText>
            If you know a letter is gray for a board, do not place it there
            again. If a letter is green, keep it in that slot. Sloppy reuse
            wastes entire guesses.
          </BodyText>
          <SubHeading>Repeating known-gray letters</SubHeading>
          <BodyText>
            Resist the urge to retype a letter you already know isn&apos;t in
            any word. Those guesses add no new information.
          </BodyText>
          <SubHeading>Typing uncommon words as probes</SubHeading>
          <BodyText>
            Fancy five-letter words might survey rare letters, but they often
            fail the dictionary check. Stick to common English words unless
            you know the guess will be accepted.
          </BodyText>
          <SubHeading>Running out of time on one board</SubHeading>
          <BodyText>
            Do not let one stubborn board eat your entire turn count. When a
            board is too ambiguous, switch your attention to another and
            return with fresh context.
          </BodyText>
        </ContentSection>

        <ContentSection title="Quordle FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          title="More daily puzzles to play"
          links={[
            {
              href: "/connections-hint-today",
              title: "Connections Hints Today",
              description:
                "Progressive hints and full answers for the NYT Connections puzzle, updated every day.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Minute Cryptic Today",
              description:
                "Today's Minute Cryptic clue with layered hints and a clean answer reveal.",
            },
            {
              href: "/strands-game",
              title: "Strands Game",
              description:
                "Play the NYT Strands themed word-search with interactive highlighting.",
            },
          ]}
        />

        <section className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            About this Quordle page
          </h2>
          <p className="mt-2">
            This free Quordle game is published by{" "}
            <Link
              href="/"
              className="text-primary underline-offset-4 hover:underline"
            >
              dailycryptic.org
            </Link>
            , an independent site that covers word puzzles including Minute
            Cryptic, Connections, Strands, and Wordle-style games. The daily
            answers are generated deterministically from the UTC date using
            an open algorithm so every visitor sees the same four words on a
            given day. This site is not affiliated with Merriam-Webster,
            Quordle, Wordle, or The New York Times.
          </p>
        </section>
      </div>
    </div>
  );
}
