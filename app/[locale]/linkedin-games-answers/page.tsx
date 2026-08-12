import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { LINKEDIN_GAMES, LINKEDIN_HUB_PATH } from "@/config/linkedin-games";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { getTodaysLinkedInDay } from "@/lib/linkedin-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What are today's LinkedIn games answers?",
    answer:
      "Today's answers for all five LinkedIn games — Queens, Zip, Tango, Pinpoint and Crossclimb — are linked from the cards at the top of this page. Each game has its own page with three graded hints first and the full solution behind a reveal button, so you can take the smallest amount of help that gets you moving instead of spoiling the whole board at once.",
  },
  {
    question: "When do the LinkedIn games reset each day?",
    answer:
      "A fresh set of puzzles appears daily at midnight in your local time zone. Everyone works on the same numbered puzzle regardless of where they are, which is what makes comparing results with colleagues meaningful. We publish the new LinkedIn games answers each morning shortly after the boards go live.",
  },
  {
    question: "Are the LinkedIn games free to play?",
    answer:
      "Yes. All five daily puzzles are free inside the LinkedIn app and on the LinkedIn website, with no subscription or premium tier required. Reading the hints and solutions here is free as well, and no account is needed on our side.",
  },
  {
    question: "Do you need a LinkedIn account to play?",
    answer:
      "You need a LinkedIn account to play the puzzles themselves and to keep a streak, because progress is tied to your profile. You do not need one to read this page — our hints, solved boards and archives are open to everyone.",
  },
  {
    question: "Which LinkedIn game is the hardest?",
    answer:
      "Queens and Zip are usually rated the toughest because both are pure logic puzzles that can stall completely if you place one wrong crown or path segment. Tango sits in the middle, while Pinpoint and Crossclimb lean on word association and general knowledge, so difficulty there depends more on what you happen to know than on deduction.",
  },
  {
    question: "Do you keep an archive of past LinkedIn games answers?",
    answer:
      "Yes. Every board we cover keeps a permanent dated page with its hints and full solution. LinkedIn only serves the current day inside its app, so these archives are the lasting record if you want to revisit a puzzle you missed or study how an older board resolved.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInGamesAnswers",
    title: "LinkedIn Games Answers Today — Queens, Zip, Tango & More",
    description:
      "Today's answers for every LinkedIn game: Queens, Zip, Tango, Pinpoint and Crossclimb. Hints first, spoilers on tap — updated every morning.",
    keywords: [
      "linkedin games answers today",
      "all linkedin games answers",
      "linkedin puzzle answers",
      "linkedin games hints",
      "linkedin daily games solutions",
    ],
    locale: locale as Locale,
    path: LINKEDIN_HUB_PATH,
    canonicalUrl: LINKEDIN_HUB_PATH,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInGamesAnswersPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInDay();

  const dateLabel = day
    ? new Date(day.date + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const shortDate = day
    ? new Date(day.date + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "LinkedIn Games", url: `${BASE_URL}${LINKEDIN_HUB_PATH}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Games Answers Today — ${dateLabel}`,
          description:
            "Hints and full solutions for every LinkedIn daily game: Queens, Zip, Tango, Pinpoint and Crossclimb.",
          url: `${BASE_URL}${LINKEDIN_HUB_PATH}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd
        data={itemListSchema(
          LINKEDIN_GAMES.map((game) => ({
            name: `LinkedIn ${game.name} Answer Today`,
            url: `${BASE_URL}/${game.slug}`,
            description: game.tagline,
          }))
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Games Answers Today"
        description={`${dateLabel} — hints and full solutions for Queens, Zip, Tango, Pinpoint and Crossclimb.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn games answers for {dateLabel} are linked below,
          one page per puzzle. Every game opens with three graded hints that
          narrow the board without naming a square, and the full solution sits
          behind a reveal button so nothing is spoiled until you ask for it. We
          solve and publish all five boards each morning, and every past puzzle
          keeps a permanent archive page.
        </p>

        {/* Game tiles — hub links down to every spoke */}
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKEDIN_GAMES.map((game) => {
            const solved = day?.[game.key] !== undefined;
            return (
              <Link
                key={game.key}
                href={`/${game.slug}`}
                className={`rounded-2xl border border-l-4 border-border ${game.accentBorder} bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md`}
              >
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {game.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {game.tagline}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {solved && shortDate
                    ? `Solved · ${shortDate}`
                    : "Updating shortly"}
                </p>
                <p className="mt-3 text-sm font-semibold text-primary">
                  Get hints →
                </p>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Queens, Zip, Tango,
          Pinpoint and Crossclimb are trademarks of LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-are", label: "What are the LinkedIn games?" },
            { href: "#how-hints-work", label: "How our hints work" },
            { href: "#where-to-start", label: "Which game should you start with?" },
            { href: "#streaks", label: "Streaks and scoring" },
            { href: "#habits", label: "Habits that improve every game" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Are the LinkedIn Games?" id="what-are">
          <BodyText>
            The LinkedIn games are a set of five short daily puzzles built into
            the LinkedIn app and website. They began as a single experiment and
            grew into a full lineup that now runs alongside the feed: Queens,
            Zip, Tango, Pinpoint and Crossclimb. Each one takes a few minutes,
            resets once a day, and shows you how your time compares with the
            people in your network — which is the detail that turned a quiet
            side feature into something colleagues genuinely compete over.
          </BodyText>
          <BodyText>
            Two of the puzzles are pure logic. Queens asks you to place one
            crown in every row, column and coloured region of a grid, with no
            two crowns ever touching. Zip hands you a grid with numbered
            waypoints and asks for a single unbroken path that visits every
            cell and hits those numbers in order. Neither involves vocabulary or
            trivia, which is why they attract players who normally avoid word
            games entirely.
          </BodyText>
          <BodyText>
            Tango sits between logic and pattern recognition: fill a six-by-six
            grid with suns and moons so that no three identical symbols sit in a
            row, each line balances evenly, and the small equals and cross signs
            between cells are respected. Pinpoint and Crossclimb work the other
            way round and lean on language. Pinpoint reveals clue words one at a
            time and rewards you for naming the category early, while Crossclimb
            is a word ladder where each rung differs from the last by a single
            letter, finished off with two bonus words that cap the ladder top
            and bottom.
          </BodyText>
          <BodyText>
            Because all five puzzles are numbered and identical for every
            player worldwide, searching for LinkedIn games answers has become a
            daily habit for a lot of people — not to skip the puzzle, usually,
            but to get unstuck on the one board that will not fall.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Our LinkedIn Games Hints Work" id="how-hints-work">
          <BodyText>
            Most pages offering LinkedIn puzzle answers put the solution at the
            top and spoil the board the moment it loads. We do the opposite.
            Each game page opens with three hints, graded from gentle to
            specific, and each one sits behind its own tap. Hint one points at
            the shape of the puzzle, hint two names the technique that cracks
            it, and hint three narrows things to a particular region, clue or
            starting square without handing over the finished board.
          </BodyText>
          <BodyText>
            Only after the hints does the full solution appear, and it too stays
            hidden behind a reveal button. For Queens, Zip and Tango we render
            the solved grid properly rather than posting a screenshot, so the
            crowns, path and symbols stay readable on a phone and in dark mode.
            Pinpoint reveals its clues one at a time the way the real game does,
            and Crossclimb shows each ladder rung with its own tap plus the
            final ordering.
          </BodyText>
          <CalloutBox type="tip" title="Take the smallest hint that works">
            If you are using these pages to improve rather than just to finish,
            read hint one, then go back to the board for two minutes before
            looking further. Solving skill develops from the smallest nudge that
            gets you moving again, not from the full answer.
          </CalloutBox>
          <BodyText>
            Every board also keeps a permanent dated page. LinkedIn serves only
            the current day inside its app, so once midnight passes the puzzle
            is gone from the app entirely — our archives are what let you go
            back to a board you missed.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Which LinkedIn Game Should You Start With?"
          id="where-to-start"
        >
          <BodyText>
            If you are new to the lineup, the five puzzles differ enough in
            character that the right starting point depends on what you enjoy
            rather than on difficulty alone.
          </BodyText>
          <SubHeading>Start with Tango if you want a gentle entry</SubHeading>
          <BodyText>
            Tango is the most forgiving of the logic puzzles. The six-by-six
            grid is small, the rules are visible on screen, and a wrong symbol
            is easy to spot and undo. Most players finish in one to three
            minutes once they know the balance rule.
          </BodyText>
          <SubHeading>Start with Pinpoint if you like word association</SubHeading>
          <BodyText>
            Pinpoint is the fastest game in the set and the least punishing —
            you simply guess the category, and a wrong guess costs you nothing
            but a revealed clue. It rewards lateral thinking rather than
            method, which makes it a good warm-up before the logic grids.
          </BodyText>
          <SubHeading>Save Queens and Zip for when you have time</SubHeading>
          <BodyText>
            These two are where the LinkedIn games get genuinely demanding. Both
            can stall completely if one early placement is wrong, and both
            reward the same discipline: rule out what cannot work instead of
            guessing what might. Queens in particular punishes anyone who
            forgets that crowns may not touch diagonally.
          </BodyText>
          <SubHeading>Crossclimb rewards vocabulary breadth</SubHeading>
          <BodyText>
            Crossclimb varies most from day to day, because a ladder built on
            words you happen to know feels trivial while one built on unfamiliar
            terms can be genuinely hard. The trick is to solve the clues you can
            first and let the single-letter-change rule fill the gaps between
            them.
          </BodyText>
        </ContentSection>

        <ContentSection title="How LinkedIn Game Streaks and Scoring Work" id="streaks">
          <BodyText>
            Each puzzle tracks a streak tied to your LinkedIn profile. Solving
            the daily board keeps the streak alive; missing a day resets it to
            zero. Streaks are counted separately for each game, so a long Queens
            run is unaffected by skipping Crossclimb.
          </BodyText>
          <BodyText>
            Scoring works differently across the lineup. The logic games —
            Queens, Zip and Tango — are timed, and your result is the clock
            reading when the final piece falls into place. Pinpoint scores you
            on how few clues you needed, so naming the category from the first
            word is the best possible result. Crossclimb combines both: it times
            you, and the ladder has to be fully correct before the clock stops.
          </BodyText>
          <BodyText>
            The social layer is what keeps people coming back. After finishing,
            you see how your time ranks against first-degree connections who
            also played that day, which quietly turns a two-minute puzzle into
            an office rivalry. It is also why using LinkedIn games answers to
            preserve a streak carries a small etiquette question — most players
            treat hints as fair and full solutions as a last resort, which is
            exactly why this site grades them.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Habits That Improve Every LinkedIn Game"
          id="habits"
        >
          <BodyText>
            The five puzzles look unrelated, but the players who post the
            fastest times week after week tend to share a small set of habits
            that transfer across all of them.
          </BodyText>
          <SubHeading>Survey the whole board before touching it</SubHeading>
          <BodyText>
            In Queens this means scanning region sizes; in Zip it means finding
            the two path endpoints; in Crossclimb it means reading every clue
            before answering any. Ten seconds of looking regularly saves a
            minute of backtracking, because it tells you where the puzzle is
            most constrained and therefore where it will resolve first.
          </BodyText>
          <SubHeading>Work from the most constrained point outward</SubHeading>
          <BodyText>
            Every one of these puzzles has a tightest spot: the smallest colour
            region, the most hemmed-in corridor, the clue with only one
            plausible answer. Starting there produces forced moves, and forced
            moves cannot be wrong. Starting in the open middle of a board
            produces guesses, and guesses cascade.
          </BodyText>
          <SubHeading>Eliminate rather than place</SubHeading>
          <BodyText>
            Marking what cannot be true is safer than committing to what might
            be. This is most obvious in Queens and Zip, where a single wrong
            commitment can quietly invalidate everything built on top of it, but
            it applies to Pinpoint too — ruling out categories that fail to fit
            an early clue narrows the field faster than free association.
          </BodyText>
          <SubHeading>Treat a contradiction as information</SubHeading>
          <BodyText>
            When a board refuses to close, something specific is wrong rather
            than everything. Back up to the last placement you can actually
            prove instead of clearing the grid. Players who restart from scratch
            lose far more time than players who retrace two steps, and this one
            habit does more for a streak than any amount of speed.
          </BodyText>
          <BodyText>
            If a board still will not fall after that, the graded hints on each
            game page are there precisely for the moment when method runs out —
            take hint one, not the full LinkedIn games answers.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Games FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            More daily puzzles
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/minute-cryptic-today"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Daily cryptic clue</p>
              <p className="mt-1 text-xs text-muted-foreground">
                One clue a day, with graded hints and the full wordplay
                explained.
              </p>
            </Link>
            <Link
              href="/connections-hint-today"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">
                NYT Connections hints
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Category nudges before the full grouping, updated every day.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
