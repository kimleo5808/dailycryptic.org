import { AdSlot } from "@/components/ads/AdSlot";
import {
  BodyText,
  CalloutBox,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordleUnlimitedGame from "@/components/wordle-unlimited/WordleUnlimitedGame";
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
const CANONICAL_PATH = "/wordle-unlimited";

const FAQ_ITEMS = [
  {
    question: "Is Wordle Unlimited free?",
    answer:
      "Yes. Wordle Unlimited on dailycryptic.org is completely free to play with no login, no account, and no download. You can play as many games as you want, on desktop or mobile, with no daily limit.",
  },
  {
    question: "How is this different from the official NYT Wordle?",
    answer:
      "The official New York Times Wordle gives you one puzzle per day. Wordle Unlimited is an unofficial practice version that lets you play endlessly and choose word lengths from 4 to 7 letters. For the official daily answer, see our Wordle answer today page.",
  },
  {
    question: "Can I really play Wordle more than once a day?",
    answer:
      "Yes — that is the whole point. Each time you finish a game in practice mode, press Play Again for a brand-new random word instantly. There is no 23-hour wait like the official game.",
  },
  {
    question: "What word lengths can I play?",
    answer:
      "You can choose 4, 5, 6, or 7 letters. Five letters matches classic Wordle; shorter lengths are great for kids or quick rounds, and longer ones add a tougher challenge. Each length keeps its own separate game and daily puzzle.",
  },
  {
    question: "Does it save my stats and streak?",
    answer:
      "Yes. Your games played, win percentage, and current streak are stored locally in your browser. Nothing is uploaded and no account is needed — clearing your browser data resets them.",
  },
  {
    question: "Is this the same as Quordle or other word games?",
    answer:
      "No. Wordle Unlimited is one word at a time. If you want to guess four words at once, try Quordle, or for a different challenge try Connections and Strands.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Pick a word length and mode",
    description:
      "Choose 4, 5, 6, or 7 letters, then play Practice for endless games or Daily for one shared puzzle per day.",
  },
  {
    title: "Type your first guess",
    description:
      "Enter any real word of the chosen length using your keyboard or the on-screen keys, then press Enter.",
  },
  {
    title: "Read the tile colours",
    description:
      "Green means the right letter in the right spot, yellow means the right letter in the wrong spot, and grey means the letter is not in the word.",
  },
  {
    title: "Use the clues to narrow down",
    description:
      "Reuse confirmed letters and avoid greyed-out ones to refine each guess. Turn on hard mode to force this discipline.",
  },
  {
    title: "Solve within six guesses",
    description:
      "Find the word before you run out of rows. Then press Play Again for a new word instantly — no waiting.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "WordleUnlimited",
    title: "Wordle Unlimited — Play Free, No Daily Limit (4–7)",
    description:
      "Play unlimited Wordle free — no login, no daily wait. Choose 4 to 7 letters, hard mode, dark mode, and streak tracking. Start a new game instantly.",
    keywords: [
      "wordle unlimited",
      "unlimited wordle",
      "play wordle unlimited free",
      "wordle practice",
      "wordle unlimited no limit",
    ],
    locale: locale as Locale,
    path: CANONICAL_PATH,
    canonicalUrl: CANONICAL_PATH,
  });
}

export default async function WordleUnlimitedPage({
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
          { name: "Wordle Unlimited", url: `${BASE_URL}${CANONICAL_PATH}` },
        ])}
      />
      <JsonLd
        data={videoGameSchema({
          name: "Wordle Unlimited",
          description:
            "Play unlimited Wordle free with no daily limit. Choose 4 to 7 letter words, hard mode, and streak tracking.",
          url: `${BASE_URL}${CANONICAL_PATH}`,
          genre: "Word puzzle",
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <JsonLd
        data={howToSchema(
          "How to Play Wordle Unlimited",
          "Guess the hidden word in six tries using colour clues, with no daily limit.",
          HOW_TO_STEPS.map((s) => ({ name: s.title, text: s.description })),
        )}
      />

      {/* Compact header — keep the board near the top */}
      <header className="text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Wordle Unlimited
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Play as many Wordle games as you want — free, no login, no daily limit.
          Pick your word length, turn on hard mode, and keep your streak going.
        </p>
      </header>

      {/* The game */}
      <div className="mt-6">
        <WordleUnlimitedGame />
      </div>

      {/* Honesty / trust disclosure */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Unofficial practice game. Not affiliated with The New York Times. For the
        official daily answer, see{" "}
        <Link href="/wordle-answer-today" className="text-primary underline">
          Wordle answer today
        </Link>
        .
      </p>

      <AdSlot slot="0000000002" />

      <div className="mt-4 space-y-8">
        <TableOfContents
          items={[
            { href: "#how-to-play", label: "How to play" },
            { href: "#vs-official", label: "Unlimited vs official NYT Wordle" },
            { href: "#why-unlimited", label: "Why play unlimited" },
            { href: "#best-start-words", label: "Best starting words" },
            { href: "#strategy", label: "Strategy: win more often" },
            { href: "#modes", label: "Game modes & options" },
            { href: "#wordle-unlimited-faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="How to Play Wordle Unlimited" id="how-to-play">
          <BodyText>
            Wordle Unlimited works just like classic Wordle, with one difference:
            you never have to wait. Guess the hidden word within six tries, then
            start another game instantly.
          </BodyText>
          <CalloutBox type="tip" title="The colour rule">
            Green means the right letter in the right spot, yellow means the
            right letter in the wrong spot, and grey means the letter is not in
            the word.
          </CalloutBox>
          <StepList items={HOW_TO_STEPS} />
        </ContentSection>

        <ContentSection
          title="Wordle Unlimited vs Official NYT Wordle"
          id="vs-official"
        >
          <BodyText>
            Wordle Unlimited is a free, unofficial practice version that lets you
            play endless Wordle puzzles without the once-a-day New York Times
            limit. It is not affiliated with the NYT, and it does not replace the
            official daily puzzle — it is a place to practise as much as you like.
          </BodyText>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-background">
                  <th className="px-4 py-3 font-heading text-foreground">
                    Feature
                  </th>
                  <th className="px-4 py-3 font-heading text-foreground">
                    Official NYT Wordle
                  </th>
                  <th className="px-4 py-3 font-heading text-foreground">
                    Wordle Unlimited
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Games per day", "One", "Unlimited"],
                  ["Login required", "No", "No"],
                  ["Word lengths", "5 letters", "4, 5, 6, 7 letters"],
                  ["Cost", "Free", "Free"],
                  ["Hard mode", "Yes", "Yes"],
                  ["Daily + practice", "Daily only", "Both"],
                ].map(([f, a, b]) => (
                  <tr
                    key={f}
                    className="border-t border-border odd:bg-card even:bg-background/60"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-semibold text-foreground"
                    >
                      {f}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{a}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <BodyText>
            Looking for the answer to today&apos;s official puzzle instead? Read
            our{" "}
            <Link href="/wordle-answer-today" className="text-primary underline">
              Wordle answer today
            </Link>{" "}
            page, or browse the{" "}
            <Link href="/wordle-answer" className="text-primary underline">
              Wordle answer archive
            </Link>
            .
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Play Unlimited Instead of Once a Day" id="why-unlimited">
          <BodyText>
            The official game gives you a single puzzle every 24 hours. Unlimited
            mode removes that wait so you can keep playing whenever you want.
          </BodyText>
          <SubHeading>Great Reasons to Play More</SubHeading>
          <BodyText>
            Use unlimited games to test new opening words, warm up before the
            official daily puzzle, play shorter four-letter rounds with kids, or
            chase a long winning streak. Practice is the fastest way to get
            better at spotting common letter patterns.
          </BodyText>
        </ContentSection>

        <ContentSection title="Best Starting Words for Wordle" id="best-start-words">
          <BodyText>
            A strong opener tests several common letters at once. For five-letter
            games, CRANE, SLATE, and TRACE each cover three of the most frequent
            English letters, while AUDIO front-loads four vowels.
          </BodyText>
          <SubHeading>Quick Picks by Length</SubHeading>
          <BodyText>
            For four letters, try TALE or CARE. For six letters, MASTER or
            PLANET work well. For seven letters, COUNTER or PICTURE spread your
            letters efficiently. Whatever length you choose, aim to learn the
            most about the word with your first two guesses.
          </BodyText>
          <CalloutBox type="highlight" title="The logic behind a good opener">
            The best first word is not about luck — it is about coverage. Testing
            five common, distinct letters gives you the most information before
            you commit to an answer.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Wordle Strategy: How to Win More Often" id="strategy">
          <BodyText>
            Once your opener reveals a few letters, every later guess should earn
            its place. The most common mistake is wasting a turn confirming
            letters you already know.
          </BodyText>
          <CalloutBox type="warning" title="Mistakes to avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Repeating grey letters that are already ruled out</li>
              <li>Keeping a yellow letter in the same wrong position</li>
              <li>Guessing a plausible word without checking the clues</li>
            </ul>
          </CalloutBox>
          <BodyText>
            Move yellow letters to new positions, save tricky double letters for
            when you have more information, and switch on hard mode when you want
            the game to enforce good habits for you.
          </BodyText>
        </ContentSection>

        <ContentSection title="Game Modes & Options Explained" id="modes">
          <BodyText>
            Wordle Unlimited gives you several ways to play, all in your browser
            with nothing to install.
          </BodyText>
          <SubHeading>What Each Option Does</SubHeading>
          <BodyText>
            The length selector switches between 4, 5, 6, and 7 letters, each
            with its own saved game. Practice mode gives endless random words;
            Daily mode gives one shared puzzle per length each day. Hard mode
            forces you to reuse revealed clues, and your stats and streak are
            saved locally so you can track progress over time.
          </BodyText>
        </ContentSection>

        <AdSlot slot="0000000003" />

        <ContentSection title="Wordle Unlimited FAQ" id="wordle-unlimited-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/quordle",
              title: "Play Quordle",
              description:
                "Guess four words at once in nine tries — daily and unlimited practice.",
            },
            {
              href: "/wordle-answer-today",
              title: "Wordle answer today",
              description:
                "Hints and the answer for the official New York Times daily Wordle.",
            },
            {
              href: "/connections-game",
              title: "Play Connections",
              description:
                "Group sixteen words into four hidden categories in today's puzzle.",
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
