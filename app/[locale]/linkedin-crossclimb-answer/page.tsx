import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import ArchiveStrip from "@/components/linkedin/ArchiveStrip";
import GameSolution from "@/components/linkedin/GameSolution";
import { LINKEDIN_GAME_BY_KEY, LINKEDIN_HUB_PATH } from "@/config/linkedin-games";
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
  getRecentLinkedInDays,
  getTodaysLinkedInGame,
} from "@/lib/linkedin-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const META = LINKEDIN_GAME_BY_KEY.crossclimb;

const FAQ_ITEMS = [
  {
    question: "What is today's LinkedIn Crossclimb answer?",
    answer:
      "Today's LinkedIn Crossclimb answer is on this page, with every rung held behind its own reveal button so you only uncover what you ask for. Read the graded hints first, then tap any single clue to see just that word, or work down the ladder in order. The full Crossclimb answer — all clue words, the finished ladder order, and the top and bottom bonus words — is refreshed here every morning.",
  },
  {
    question: "How do you play LinkedIn Crossclimb?",
    answer:
      "Crossclimb runs in three stages. First you solve a stack of trivia-style clues whose answers are all words of the same length. Then you reorder those words into a ladder where every neighbouring pair differs by exactly one letter. Finally you fill the empty slots above and below the ladder with two bonus words that answer a single linked clue. The puzzle is complete only when the ladder is ordered correctly and both caps are in place.",
  },
  {
    question: "What are the top and bottom words in Crossclimb?",
    answer:
      "They are the two bonus words that cap the finished ladder, and they share one clue between them rather than having a clue each. Each cap must also obey the one-letter rule against the rung it touches, so the top word differs by a single letter from the first ladder word and the bottom word differs by a single letter from the last. Solving the ladder first usually makes the caps obvious.",
  },
  {
    question: "Is the Crossclimb ladder order unique?",
    answer:
      "Effectively yes, apart from direction. There is one chain that links every clue word by single-letter steps, and the puzzle accepts it in the orientation that lets both bonus caps attach. If you find two orderings that seem to work, one of them almost always breaks the one-letter rule at a pair you have not checked closely.",
  },
  {
    question: "When does LinkedIn Crossclimb reset each day?",
    answer:
      "A fresh Crossclimb puzzle arrives daily at midnight local time, in line with the rest of the LinkedIn games lineup. Everyone plays the same numbered puzzle wherever they are, and our Crossclimb answer and hints go up each morning shortly after the new ladder is released.",
  },
  {
    question: "How do Crossclimb streaks work?",
    answer:
      "Finishing the daily ladder keeps your streak running, and skipping a day resets it to zero. Crossclimb streaks reward vocabulary breadth more than speed: the clue answers lean on general knowledge, so the players with the longest runs are usually the ones who fill gaps from the letter pattern rather than stalling on a clue they cannot place.",
  },
  {
    question: "Is there an archive of past Crossclimb answers?",
    answer:
      "Yes. Every Crossclimb puzzle we cover keeps its own permanent page with the clues, the solved ladder and the bonus caps. Recent dates are linked above, so you can catch up on a day you missed or replay an older ladder for practice.",
  },
  {
    question: "How does Crossclimb relate to cryptic crossword wordplay?",
    answer:
      "Word ladders and cryptic clues both hinge on treating a word as a string of letters you can alter. Changing one letter to climb a Crossclimb rung is the same mental move as a cryptic substitution or deletion, where swapping or dropping a single character turns one word into another. If the letter-level thinking in Crossclimb appeals to you, our daily cryptic clue extends it into full wordplay.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInCrossclimbAnswer",
    title: "LinkedIn Crossclimb Answer Today — All Clues & Ladder",
    description:
      "Every Crossclimb clue answered plus the final ladder order for today's LinkedIn puzzle. Hints before spoilers, archive included.",
    keywords: META.keywords,
    locale: locale as Locale,
    path: `/${META.slug}`,
    canonicalUrl: `/${META.slug}`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInCrossclimbAnswerPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInGame("crossclimb");
  const recent = await getRecentLinkedInDays("crossclimb", 7);

  const dateLabel = day
    ? new Date(day.date + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "today";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
          { name: "Crossclimb Answer", url: `${BASE_URL}/${META.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Crossclimb Answer Today — ${dateLabel}`,
          description:
            "Every clue answered plus the finished ladder and bonus caps for today's LinkedIn Crossclimb puzzle.",
          url: `${BASE_URL}/${META.slug}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Crossclimb Answer Today"
        description={`${dateLabel} — graded hints first, then every clue word, the finished ladder order and both bonus caps.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn Crossclimb answer for {dateLabel} is published
          below. Take hint one if a single clue is blocking you, work down to
          hint three if the ladder order is the problem, then reveal individual
          rungs one at a time — nothing is spoiled until you tap for it. The
          full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Queens, Zip, Tango and Pinpoint the same way.
        </p>

        {day ? (
          <GameSolution game="crossclimb" day={day} dateLabel={dateLabel} />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Today&apos;s Crossclimb ladder is being solved and verified. Check
            back shortly.
          </p>
        )}

        {recent.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recent Crossclimb answers
            </h2>
            <ArchiveStrip days={recent} slug={META.slug} gameName="Crossclimb" />
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Crossclimb is a trademark
          of LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is LinkedIn Crossclimb?" },
            { href: "#how-it-works", label: "How Crossclimb works" },
            { href: "#method", label: "A repeatable solving method" },
            { href: "#caps", label: "Finding the top and bottom words" },
            { href: "#mistakes", label: "Common Crossclimb mistakes" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is LinkedIn Crossclimb?" id="what-is">
          <BodyText>
            Crossclimb is LinkedIn&apos;s daily word-ladder puzzle, and it is the
            most word-driven game in the company&apos;s lineup. Where Queens and
            Tango are pure logic grids, Crossclimb asks you to know things: each
            rung of the ladder starts life as a short trivia clue, and you cannot
            climb until you have turned enough of those clues into words. That
            mix of general knowledge and letter-level puzzling is what gives the
            game its particular rhythm.
          </BodyText>
          <BodyText>
            The shape of the puzzle is consistent from day to day. You are handed
            a small stack of clues whose answers are all the same length —
            usually four letters — plus two empty slots, one above the stack and
            one below. Solving every clue is only half the job. The Crossclimb
            ladder is not finished until those words sit in an order where each
            neighbouring pair differs by exactly one letter, and both empty caps
            are filled.
          </BodyText>
          <BodyText>
            A new puzzle lands daily at midnight local time, and because everyone
            plays the same numbered board, the day&apos;s Crossclimb answer is
            worth comparing with colleagues. That shared-board design is also why
            a page like this one exists: when a single clue stalls you, a
            targeted nudge is far more useful than a full spoiler, and the reveal
            buttons above are built so you can take exactly as much help as you
            need and no more.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Crossclimb Works" id="how-it-works">
          <BodyText>
            The puzzle runs in three distinct stages, and knowing which stage you
            are stuck in is the fastest way to unstick yourself. Most players who
            describe the Crossclimb puzzle as hard are actually stuck in stage
            two while still trying to fix it with stage-one thinking.
          </BodyText>
          <SubHeading>Stage 1 — solve the clues</SubHeading>
          <BodyText>
            Every clue is a short factual or definitional prompt, and every
            answer is a word of the same fixed length. Crossclimb clues are
            deliberately uneven in difficulty: some are near-instant, others
            depend on a piece of knowledge you either have or do not. Crucially,
            the clues arrive in a scrambled order that has nothing to do with the
            final Crossclimb ladder, so there is no point trying to read meaning
            into their starting positions.
          </BodyText>
          <SubHeading>Stage 2 — climb the ladder</SubHeading>
          <BodyText>
            Now reorder the words so that each one differs from the word directly
            above and below it by exactly one letter, with all other letters
            staying in place. This is the step that makes the puzzle a ladder
            rather than a quiz. A pair like CARD and CORD is a legal step; CARD
            and CORE is not, because two letters have moved. The Crossclimb
            ladder has one valid chain, and finding it is a matter of comparing
            words in pairs rather than shuffling at random.
          </BodyText>
          <SubHeading>Stage 3 — cap the ladder</SubHeading>
          <BodyText>
            The final stage fills the two empty slots. Unlike the rungs, these
            two words share a single clue between them, phrased so that both
            answers together satisfy it. Each cap must still obey the one-letter
            rule against the rung it touches, which constrains them tightly. Once
            the ladder is ordered, the caps usually resolve in seconds, which is
            why experienced players never chase the bonus words first.
          </BodyText>
          <CalloutBox type="tip" title="The one-letter rule is positional">
            A legal Crossclimb step changes one letter in place. It does not let
            you add a letter, remove one, or rearrange the word. Checking pairs
            letter-by-letter in the same position catches most ordering errors
            before they cost you time.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="A Repeatable Method for Solving Crossclimb"
          id="method"
        >
          <BodyText>
            The sequence below is the one we use when preparing the daily
            Crossclimb answer for this page. It works because it never asks you
            to hold the whole puzzle in your head at once — each step narrows the
            board enough that the next becomes easy.
          </BodyText>
          <SubHeading>Step 1 — bank the easy clues first</SubHeading>
          <BodyText>
            Read every clue before answering any of them, then fill in only the
            ones you are certain about. Two or three confident words are enough
            to start the ladder, and partial information is far more valuable in
            a Crossclimb ladder than in a standard quiz, because each solved word
            constrains its neighbours. Never grind on a hard Crossclimb clue
            while easy ones remain untouched.
          </BodyText>
          <SubHeading>Step 2 — sort by letter difference, not clue order</SubHeading>
          <BodyText>
            Take the words you have and compare them in pairs, counting how many
            letter positions differ. Pairs that differ by exactly one are
            adjacent in the finished Crossclimb ladder; pairs that differ by
            three or four are far apart. Chaining the one-letter pairs you find
            gives you fragments of the ladder long before you have solved every
            clue, and those fragments tell you what the missing words must look
            like.
          </BodyText>
          <SubHeading>Step 3 — use the fixed letters to crack stubborn clues</SubHeading>
          <BodyText>
            This is the step that separates a fast solve from a stalled one. If
            you know a missing word sits between BOLD and BALE, it has to be
            BALD, and the clue becomes a confirmation rather than a puzzle. Work
            backwards from the ladder to the clue whenever a Crossclimb clue
            resists you directly — the letter pattern is usually a stronger lead
            than the wording.
          </BodyText>
          <SubHeading>Step 4 — verify every rung before capping</SubHeading>
          <BodyText>
            Before filling the bonus slots, walk the Crossclimb ladder from top
            to bottom and confirm each adjacent pair differs by exactly one
            letter in one position. A single bad rung invalidates both caps and
            sends people hunting for bonus words that cannot exist. Thirty
            seconds of checking here saves several minutes of confusion later.
          </BodyText>
        </ContentSection>

        <ContentSection title="Finding the Top and Bottom Words" id="caps">
          <BodyText>
            The bonus caps are where the Crossclimb puzzle stops being a
            mechanical exercise and asks for a small leap. The two words answer
            one clue jointly, so the clue is usually phrased as a pairing, a
            contrast, or a two-part phrase — think of prompts that naturally
            resolve into two related answers rather than one.
          </BodyText>
          <BodyText>
            Approach them from the letters rather than the meaning. The top cap
            differs by exactly one letter from the first rung and the bottom cap
            differs by exactly one letter from the last, which typically leaves
            only a handful of real words in each slot. Generate that short list
            first, then check which pair satisfies the shared clue. Working in
            the other direction — guessing from the clue and hoping the letters
            fit — is far slower.
          </BodyText>
          <BodyText>
            One structural detail helps here: the Crossclimb ladder can be read
            in either direction, and the caps decide which orientation is
            correct. If your candidate words fit the letter rule but not the
            clue, try flipping the whole ladder end over end before assuming a
            rung is wrong. This single check resolves a surprising share of
            failed Crossclimb attempts.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Crossclimb Mistakes" id="mistakes">
          <BodyText>
            The most common mistake is solving all the Crossclimb clues before
            touching the ladder. The puzzle is designed so that ordering and
            answering feed each other, and players who insist on finishing stage
            one first give up the letter patterns that would have handed them the
            hardest clue for free.
          </BodyText>
          <BodyText>
            The second is misreading the one-letter rule as an anagram step.
            Rearranging letters, adding one, or dropping one are all illegal
            moves; only substitution in place counts. Words that feel closely
            related, like STAR and RATS, are not neighbours on any Crossclimb
            ladder.
          </BodyText>
          <BodyText>
            The third is chasing the bonus caps too early. Until the ladder is
            ordered you do not know which rungs the caps must attach to, so any
            guess is unconstrained. Order first, cap second — every fast solve
            follows that sequence.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Crossclimb FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            More daily puzzles
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/linkedin-pinpoint-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Pinpoint answer</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Today&apos;s category, revealed one clue at a time.
              </p>
            </Link>
            <Link
              href="/linkedin-tango-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Tango solution</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Suns, moons and the finished six-by-six grid.
              </p>
            </Link>
            <Link
              href="/minute-cryptic-today"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Daily cryptic clue</p>
              <p className="mt-1 text-xs text-muted-foreground">
                One clue a day, with graded hints and full wordplay.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
