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

const META = LINKEDIN_GAME_BY_KEY.pinpoint;

const FAQ_ITEMS = [
  {
    question: "What is today's LinkedIn Pinpoint answer?",
    answer:
      "Today's LinkedIn Pinpoint answer is on this page, revealed one clue at a time so nothing is spoiled before you ask for it. Open the first clue, take your guess at the category, and keep unlocking further clues only if you need them. The final category sits behind its own button at the bottom of the block, and we refresh the Pinpoint answer every morning once the new puzzle goes live.",
  },
  {
    question: "How do you play LinkedIn Pinpoint?",
    answer:
      "Pinpoint shows you up to five clues, one after another, and asks you to name the category that connects them all. You may guess as soon as the first clue appears. A wrong guess uncovers the next clue and narrows the field, so the puzzle turns into a race between your confidence and the number of hints you are willing to spend.",
  },
  {
    question: "How many guesses do you get in Pinpoint?",
    answer:
      "You get five guesses, one for each clue in the set. Every incorrect answer reveals another clue, so a fifth-clue solve means you saw the entire list before landing the category. Running out of guesses ends the round without a solve, which is why a careful first read of clue one matters more than speed.",
  },
  {
    question: "How is Pinpoint scored?",
    answer:
      "Your result is the number of clues you needed before naming the Pinpoint category. Solving from a single clue is the best possible outcome and is genuinely rare; two or three clues is a strong everyday result. There is no timer and no points total, so the whole Pinpoint puzzle rewards precision of thought rather than speed of typing.",
  },
  {
    question: "When does LinkedIn Pinpoint reset each day?",
    answer:
      "A fresh Pinpoint puzzle arrives daily at midnight in your local time zone, in line with the rest of the LinkedIn games lineup. Everyone works on the same numbered puzzle regardless of where they are, and our clues and category answer are published each morning shortly after the new round appears.",
  },
  {
    question: "How do Pinpoint streaks work?",
    answer:
      "Solving the daily Pinpoint puzzle within five guesses keeps your streak alive, and a missed or failed day resets it to zero. Because the category is always a fair connection rather than a trick, streaks reward the habit of testing a candidate category against every clue you have seen before committing to it.",
  },
  {
    question: "Is there an archive of past Pinpoint answers?",
    answer:
      "Yes. Every Pinpoint puzzle we have covered keeps its own permanent page with the full clue list and the category answer, so you can revisit a day you missed or study how earlier categories were built. Recent dates are linked above the article, and each past Pinpoint answer stays online indefinitely.",
  },
  {
    question: "Does Pinpoint help with word association or cryptic clues?",
    answer:
      "It trains the same lateral instinct. The Pinpoint puzzle asks what a set of unrelated-looking words have in common, and a cryptic crossword clue asks what a phrase means once you stop reading it literally. Both reward the moment you drop your first assumption about a word and try its second sense instead, which is why our daily cryptic clue makes a good companion to the Pinpoint answer you came here for.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInPinpointAnswer",
    title: "LinkedIn Pinpoint Answer Today — Category & Clue Hints",
    description:
      "Today's Pinpoint category revealed gently: clue-by-clue hints first, then the answer. Updated daily with full archive.",
    keywords: META.keywords,
    locale: locale as Locale,
    path: `/${META.slug}`,
    canonicalUrl: `/${META.slug}`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInPinpointAnswerPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInGame("pinpoint");
  const recent = await getRecentLinkedInDays("pinpoint", 7);

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
          { name: "Pinpoint Answer", url: `${BASE_URL}/${META.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Pinpoint Answer Today — ${dateLabel}`,
          description:
            "Clue-by-clue hints and the full category answer for today's LinkedIn Pinpoint puzzle.",
          url: `${BASE_URL}/${META.slug}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Pinpoint Answer Today"
        description={`${dateLabel} — clues revealed one at a time, then the category answer for today's Pinpoint puzzle.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn Pinpoint answer for {dateLabel} is published
          below. Open clue one and try the category before you unlock anything
          further, then take the remaining clues only as you need them. The
          category itself stays hidden until you tap for it, and the full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Queens, Zip, Tango and Crossclimb the same way.
        </p>

        {day ? (
          <GameSolution game="pinpoint" day={day} dateLabel={dateLabel} />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Today&apos;s Pinpoint clues are being checked and verified. Check
            back shortly.
          </p>
        )}

        {recent.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recent Pinpoint answers
            </h2>
            <ArchiveStrip days={recent} slug={META.slug} gameName="Pinpoint" />
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Pinpoint is a trademark of
          LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is LinkedIn Pinpoint?" },
            { href: "#scoring", label: "How Pinpoint scoring works" },
            { href: "#earlier", label: "How to guess the category earlier" },
            { href: "#mistakes", label: "Common Pinpoint mistakes" },
            { href: "#intuition", label: "Building category intuition" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is LinkedIn Pinpoint?" id="what-is">
          <BodyText>
            Pinpoint is LinkedIn&apos;s daily association game, and it is the
            odd one out in the company&apos;s puzzle lineup. Where Queens and
            Tango are silent logic grids, this one is entirely about meaning.
            You are shown a short list of words or phrases, one at a time, and
            asked a single question: what category do all of these belong to?
          </BodyText>
          <BodyText>
            The list runs to five clues at most. The first arrives on its own,
            deliberately ambiguous, and each further clue narrows the field a
            little more. A set that opens with something like &ldquo;Mercury&rdquo;
            could be heading toward planets, chemical elements, Roman gods or
            record labels, and part of the pleasure of the Pinpoint puzzle is
            watching those options fall away as the evidence accumulates.
          </BodyText>
          <BodyText>
            Because the connection is always a fair one rather than a trick,
            every round has a defensible answer that reads as obvious in
            hindsight. That hindsight is the point. A good Pinpoint category
            makes you feel you should have seen it two clues earlier, which is
            exactly the itch that brings players back the next morning. A fresh
            round lands daily at midnight local time, and everyone worldwide
            works the same numbered puzzle.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Pinpoint Scoring Works" id="scoring">
          <BodyText>
            There is no clock and no points total in the Pinpoint puzzle. Your
            result is simply the number of clues you needed before naming the
            Pinpoint category correctly, and lower is better. Solving from clue
            one alone is the best possible finish; needing all five means you
            saw the complete list before the answer landed.
          </BodyText>
          <BodyText>
            You get five guesses, one attached to each clue. Guess wrongly and
            the next clue opens automatically, which makes every attempt a
            genuine trade. Spending a guess buys you information, but it also
            costs you the better result you were holding. Run out of all five
            and the round closes unsolved, breaking your streak.
          </BodyText>
          <BodyText>
            In practice a two or three clue solve is a strong everyday outcome
            and nothing to apologise for. One-clue solves happen, but they
            usually mean the opening clue was unusually specific rather than
            that you played brilliantly. This is why we present the Pinpoint
            answer on this page the same way the game does: clue by clue, so
            you can stop as soon as your own guess clicks into place.
          </BodyText>
          <CalloutBox type="tip" title="The cost of a cheap guess">
            A guess you would not defend out loud is worth less than the clue
            it costs you. If you cannot say why a category fits every clue you
            have seen so far, hold the guess and read the set again first.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="How to Guess the Pinpoint Category Earlier"
          id="earlier"
        >
          <BodyText>
            Most players improve at the Pinpoint puzzle not by knowing more
            facts but by reading the clue list differently. The four habits
            below are what separate a routine four-clue finish from a regular
            two-clue one, and they are the same checks we run when preparing
            each daily Pinpoint answer for this page.
          </BodyText>
          <SubHeading>Look for the least literal connection</SubHeading>
          <BodyText>
            The obvious link between two clues is rarely the one the puzzle
            wants. If the first two entries are both cities, ask what else they
            share besides being cities — a shared letter pattern, a famous
            resident, a film title, a sporting event. Categories built on the
            surface reading tend to be too broad to be interesting, and the
            Pinpoint answer is almost always the more particular idea sitting
            just underneath.
          </BodyText>
          <SubHeading>Test a category against every clue seen so far</SubHeading>
          <BodyText>
            Before committing, run your candidate back across the full list, not
            just the newest entry. A Pinpoint category that explains clue three
            beautifully but leaves clue one stranded is the wrong category, and
            that check costs you nothing. This single discipline prevents more
            wasted guesses than any amount of general knowledge.
          </BodyText>
          <SubHeading>Beware of clues that fit two categories</SubHeading>
          <BodyText>
            Puzzle setters choose opening clues precisely because they are
            ambiguous. When an early entry comfortably supports two readings,
            treat it as neutral rather than as evidence for whichever reading
            occurred to you first. Let the later clues break the tie, and be
            ready to abandon your initial theory the moment a clue refuses to
            fit it.
          </BodyText>
          <SubHeading>Think about word senses, not just topics</SubHeading>
          <BodyText>
            Some of the sharpest categories in the Pinpoint puzzle are
            linguistic rather than thematic: words that contain hidden smaller
            words, terms that double as verbs, phrases that all precede or
            follow the same word. If a set of clues seems to have no
            subject-matter link at all, stop hunting for a topic and start
            looking at the words themselves as strings of letters — that shift
            alone unlocks a surprising share of the harder Pinpoint answers.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Pinpoint Mistakes" id="mistakes">
          <BodyText>
            The first and most expensive mistake is answering too broadly. A
            Pinpoint category like &ldquo;famous people&rdquo; technically
            covers the clues but is never what the puzzle is after, and a vague
            guess burns a clue for no information in return. Aim for the most
            specific description that still covers everything you have seen.
          </BodyText>
          <BodyText>
            The second is anchoring on clue one. That opening entry is chosen to
            suggest a plausible wrong path, and players who lock onto it early
            often spend three guesses defending a theory the second clue already
            disproved. Treat your first idea as a hypothesis, not a conclusion.
          </BodyText>
          <BodyText>
            The third is ignoring the shape of the list. If four clues are
            single words and one is a two-word phrase, that asymmetry is usually
            deliberate and worth a moment&apos;s thought. Setters rarely include
            an odd-looking entry by accident, and reading the Pinpoint puzzle as
            a designed set rather than a random pile speeds up the solve
            considerably.
          </BodyText>
        </ContentSection>

        <ContentSection title="Building Category Intuition" id="intuition">
          <BodyText>
            Category intuition is trainable, and the archive is the gym. Working
            back through past rounds with the clues visible but the answer
            hidden teaches you the house style: how specific a typical Pinpoint
            category is, how often the link is linguistic rather than factual,
            and which kinds of opening clue tend to mislead. A week of old
            Pinpoint answers read this way is worth more than a month of
            playing on instinct.
          </BodyText>
          <BodyText>
            It also helps to name your reasoning out loud, even silently. Saying
            &ldquo;these are all things that can precede the word board&rdquo; is
            a testable claim; a vague feeling that the clues are somehow related
            is not. Players who articulate the connection before guessing land
            far more early solves than players who go on instinct alone.
          </BodyText>
          <BodyText>
            If you are using this page to improve rather than simply to finish,
            take one clue, close the tab, and give yourself a full minute before
            coming back. The clue-by-clue reveal exists so you can take the
            smallest amount of help that gets you moving, which is how the skill
            actually develops. That habit transfers directly to the harder
            association work in cryptic crosswords, where the whole game is
            refusing to accept your first reading of a word.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Pinpoint FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            More daily puzzles
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/linkedin-crossclimb-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">
                Crossclimb answer today
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Every clue answered plus the final ladder order.
              </p>
            </Link>
            <Link
              href="/linkedin-queens-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Queens solution</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Today&apos;s crown placement, one per row and region.
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
