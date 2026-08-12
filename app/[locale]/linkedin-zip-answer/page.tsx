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

const META = LINKEDIN_GAME_BY_KEY.zip;

const FAQ_ITEMS = [
  {
    question: "What is today's LinkedIn Zip answer?",
    answer:
      "Today's LinkedIn Zip answer sits at the top of this page, held behind a reveal button so the board is never spoiled before you ask for it. Read the three graded hints first — they tell you where the path is forced without tracing it for you — then tap through to the complete numbered route. We solve and publish the Zip answer every morning, shortly after the fresh board goes live.",
  },
  {
    question: "How do you play LinkedIn Zip?",
    answer:
      "Draw a single unbroken line that starts at the cell numbered one and finishes at the highest number on the grid. The line moves only horizontally or vertically between neighbouring cells, it must pass through the numbered cells in ascending order, and it has to cover every square on the board exactly once. Walls between cells block the route, and the puzzle is solved when one continuous path satisfies all of those conditions at once.",
  },
  {
    question: "Does the Zip path have to fill every cell?",
    answer:
      "Yes, and this is the constraint that decides most boards. The completed route is a Hamiltonian path: it visits every single square exactly once, with no gaps left behind and no square entered twice. If your line reaches the final number while any cell is still empty, the route is wrong even though the numbers were hit in the right order.",
  },
  {
    question: "When does LinkedIn Zip reset each day?",
    answer:
      "A new Zip puzzle appears daily at midnight in your local time zone, matching the rest of the LinkedIn games lineup. Everyone worldwide plays the same numbered board, which is what makes comparing times with colleagues meaningful. Our hints and the full Zip solution are refreshed each morning as soon as the new grid lands.",
  },
  {
    question: "How do LinkedIn Zip streaks work?",
    answer:
      "Finishing the daily board keeps your streak alive and skipping a day resets it to zero. Because Zip is pure deduction with no hidden information or luck, a streak is a genuine record of method rather than fortune. Players who learn to read forced corners and dead ends early tend to hold much longer streaks than players who trace routes by trial and error.",
  },
  {
    question: "Is there an archive of past Zip answers?",
    answer:
      "Yes. Every Zip board we have covered keeps its own permanent page with the same graded hints and the full numbered path. The most recent dates are linked above, so you can catch up on a day you missed or replay an older grid for practice without hunting through a feed of dated articles.",
  },
  {
    question: "What do the walls in LinkedIn Zip mean?",
    answer:
      "A wall is a thick edge drawn between two neighbouring cells, and your line may never cross it. Walls are the puzzle's main source of difficulty: they turn otherwise open regions into corridors with a single way in and out. Reading the walls before you draw anything is the fastest way to see where the route has no choice at all.",
  },
  {
    question: "Does solving Zip help with word puzzles?",
    answer:
      "It exercises the same habit of ruling things out. In Zip you eliminate impossible moves until one route survives; in a cryptic crossword you eliminate readings of a clue until the wordplay resolves into a single answer. If you enjoy the deductive squeeze of this puzzle, our daily cryptic clue makes a natural companion.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInZipAnswer",
    title: "LinkedIn Zip Answer Today — Path Solution & Hints",
    description:
      "Today's LinkedIn Zip answer with the complete numbered path, gentle hints first, and a daily archive. Updated every morning.",
    keywords: META.keywords,
    locale: locale as Locale,
    path: `/${META.slug}`,
    canonicalUrl: `/${META.slug}`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInZipAnswerPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInGame("zip");
  const recent = await getRecentLinkedInDays("zip", 7);

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
          { name: "Zip Answer", url: `${BASE_URL}/${META.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Zip Answer Today — ${dateLabel}`,
          description:
            "Progressive hints and the complete numbered path for today's LinkedIn Zip puzzle.",
          url: `${BASE_URL}/${META.slug}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Zip Answer Today"
        description={`${dateLabel} — three spoiler-free hints first, then the complete numbered path through today's Zip board.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn Zip answer for {dateLabel} is published below.
          Take hint one if you only need a nudge toward the opening move, work
          down to hint three when the middle of the grid stalls, and reveal the
          traced route when you want every cell accounted for. Nothing here
          spoils the board until you tap for it, and the full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Queens, Tango, Pinpoint and Crossclimb the same way.
        </p>

        {day ? (
          <GameSolution game="zip" day={day} dateLabel={dateLabel} />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Today&apos;s Zip board is being solved and verified. Check back
            shortly.
          </p>
        )}

        {recent.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recent Zip answers
            </h2>
            <ArchiveStrip days={recent} slug={META.slug} gameName="Zip" />
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Zip is a trademark of
          LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is LinkedIn Zip?" },
            { href: "#rules", label: "The rules in four lines" },
            { href: "#method", label: "A repeatable solving method" },
            { href: "#mistakes", label: "Common Zip mistakes" },
            { href: "#speed", label: "Solving Zip faster" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is LinkedIn Zip?" id="what-is">
          <BodyText>
            Zip is LinkedIn&apos;s daily path-tracing puzzle, and it is the most
            spatial of the company&apos;s games. You are handed a small grid with
            a handful of numbered cells scattered across it, and your task is to
            draw one continuous line that touches every square on the board while
            hitting those numbers in order. The rules fit in a sentence; the
            boards do not give themselves up nearly so easily.
          </BodyText>
          <BodyText>
            What separates this puzzle from a maze is that there is no wrong
            turn to back out of — there is only one route that works, and every
            square is part of it. Mathematicians call that a Hamiltonian path,
            and the numbered checkpoints plus the walls between cells are what
            reduce the enormous space of possible routes down to a single valid
            Zip solution. No vocabulary, trivia or outside knowledge is involved
            at any point.
          </BodyText>
          <BodyText>
            A fresh board arrives daily at midnight local time, and because the
            puzzle number is shared globally, everyone works the same grid on the
            same day. That is what makes a solve time worth comparing with
            colleagues, and it is why a page like this one exists: when a board
            resists, most players want the smallest possible nudge rather than
            the whole route. Our Zip answer page follows the same daily rhythm,
            with graded hints on top and the traced path immediately below them.
          </BodyText>
        </ContentSection>

        <ContentSection title="Zip Rules, in Four Lines" id="rules">
          <SubHeading>1. Follow the numbers in order</SubHeading>
          <BodyText>
            Your line begins at the cell marked one and ends at the highest
            number on the grid, visiting two, three, four and the rest in strict
            ascending sequence along the way. Reaching a checkpoint out of order
            invalidates the route even if the drawing looks tidy.
          </BodyText>
          <SubHeading>2. Move only to orthogonal neighbours</SubHeading>
          <BodyText>
            The path steps up, down, left or right between adjacent cells.
            Diagonal moves are never allowed, which is why corner squares are so
            constrained — a corner has only two possible connections in the
            entire grid.
          </BodyText>
          <SubHeading>3. Cover every single cell</SubHeading>
          <BodyText>
            Every square on the board must be used exactly once. This is the rule
            that makes the puzzle hard, because it forbids the tempting shortcut
            of running straight between checkpoints and leaving the corners
            empty. If a cell is stranded, the route is wrong.
          </BodyText>
          <SubHeading>4. Never cross a wall</SubHeading>
          <BodyText>
            Thick edges drawn between neighbouring cells are walls, and the line
            cannot pass through them. Walls carve the grid into corridors and
            pockets, and reading them properly before drawing anything is what
            separates a two-minute solve from a ten-minute one.
          </BodyText>
          <CalloutBox type="tip" title="Why the fill rule matters">
            Most failed attempts satisfy the numbers but abandon a cell in a
            corner or along an edge. If your line reaches the last checkpoint
            early, count the empty squares before assuming the board is broken —
            almost always the route went wrong several moves back.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="A Repeatable Method for Solving Zip"
          id="method"
        >
          <BodyText>
            Tracing hopeful routes and undoing them works on small boards and
            collapses on larger ones. The sequence below solves nearly every
            LinkedIn Zip puzzle without a single speculative line, and it is the
            same order of operations we use when preparing the daily Zip solution
            for this page.
          </BodyText>
          <SubHeading>Step 1 — settle the endpoints and corners</SubHeading>
          <BodyText>
            Start where the board has the least freedom rather than where the
            line starts. Any cell with only two open neighbours — every corner,
            plus anything boxed in by walls — must use both of those connections,
            because the path has to enter and leave it. Marking those forced
            segments first often produces long stretches of route before you have
            made a single choice.
          </BodyText>
          <SubHeading>Step 2 — read the walls as corridors</SubHeading>
          <BodyText>
            Walls rarely appear at random; they usually seal off a pocket of the
            grid with exactly one or two openings. A pocket with a single opening
            must be entered and exited through it, which is impossible unless a
            checkpoint sits inside, so that shape alone can tell you which
            direction the line travels through half the board.
          </BodyText>
          <SubHeading>Step 3 — connect checkpoints under the fill rule</SubHeading>
          <BodyText>
            Between consecutive numbers, ask not what the shortest route is but
            what the longest necessary one is. The line has to absorb every cell
            in the region it passes through, so a leg from three to four often
            has to detour deliberately into a bay it would otherwise skip. Count
            the free squares in each region and match them to the legs available.
          </BodyText>
          <SubHeading>Step 4 — prune dead ends before committing</SubHeading>
          <BodyText>
            Before you accept a segment, check that it does not isolate any cell.
            If a square would end up with all its neighbours consumed by a line
            that never touches it, the segment is wrong no matter how natural it
            looks. This single check catches most of the routes that otherwise
            fail three moves from the end.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Zip Mistakes" id="mistakes">
          <BodyText>
            The first mistake is treating the puzzle as a shortest-path problem.
            Players race between the numbered cells and only then notice the
            stranded squares behind them. The route is not trying to be
            efficient; it is trying to be exhaustive, and planning it that way
            from the first move avoids most restarts.
          </BodyText>
          <BodyText>
            The second is ignoring parity on larger grids. On a board with an
            even number of cells, a path alternates between two sets of squares
            in a fixed rhythm, so the starting and ending checkpoints have to sit
            on the correct sides of that alternation. When a Zip puzzle feels
            impossible despite clean logic, a parity clash is often the reason.
          </BodyText>
          <BodyText>
            The third is redrawing everything after hitting a contradiction. A
            dead end proves that one specific segment was wrong, not that the
            whole board is. Back up to the last forced connection you are certain
            about — the corners and wall corridors from step one never need to be
            touched again.
          </BodyText>
        </ContentSection>

        <ContentSection title="Solving Zip Faster" id="speed">
          <BodyText>
            Players chasing a quicker daily time converge on the same habits.
            They scan the whole grid for two-neighbour cells before drawing
            anything, so the forced skeleton of the route appears before any
            decision is made. They treat walls as information rather than
            obstacles. And they resist drawing a long leg until the cells around
            it are accounted for, which prevents the cascading corrections that
            eat most of the clock.
          </BodyText>
          <BodyText>
            If you are here to improve rather than simply to finish, try reading
            only the first hint, then returning to the board for two minutes
            before looking any further. The hints are graded precisely so you can
            take the smallest amount of help that gets you unstuck, which is how
            solving skill actually develops over a run of daily boards.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Zip FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            More daily puzzles
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/linkedin-queens-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Queens answer today</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Every crown placed on today&apos;s Queens board.
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
