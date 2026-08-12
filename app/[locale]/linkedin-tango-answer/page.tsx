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

const META = LINKEDIN_GAME_BY_KEY.tango;

const FAQ_ITEMS = [
  {
    question: "What is today's LinkedIn Tango answer?",
    answer:
      "Today's LinkedIn Tango answer sits on this page behind a reveal button, so nothing is spoiled until you ask for it. Read the three graded hints first — they point at the row or column that cracks open, without naming a single cell — then tap through to the finished sun and moon grid. We refresh the Tango answer every morning once the new board goes live.",
  },
  {
    question: "How do you play LinkedIn Tango?",
    answer:
      "Fill a six-by-six grid so that every row and every column holds three suns and three moons, and no three identical symbols ever sit next to each other in a line. A handful of cells start pre-filled, and the signs between cells add extra constraints. There is exactly one valid grid each day, reachable by deduction alone.",
  },
  {
    question: "What do the = and × signs mean in Tango?",
    answer:
      "They are constraints printed on the edge between two neighbouring cells. An equals sign means those two cells hold the same symbol — two suns or two moons. A cross means they must differ, so one is a sun and the other a moon. These signs carry a large share of the puzzle's information and are usually the fastest route into a stubborn Tango board.",
  },
  {
    question: "Does LinkedIn Tango have only one solution?",
    answer:
      "Yes. Each Tango puzzle is constructed to have a single valid arrangement of suns and moons. That guarantee is what makes pure logic sufficient: if a chain of reasoning produces two different complete grids, one of the steps along the way was wrong.",
  },
  {
    question: "When does LinkedIn Tango reset each day?",
    answer:
      "A fresh Tango board arrives daily at midnight in your local time zone, matching the rest of the LinkedIn games lineup. Everyone plays the same numbered puzzle, and our Tango solution is published each morning shortly after the new grid appears.",
  },
  {
    question: "How do LinkedIn Tango streaks work?",
    answer:
      "Finishing the daily grid extends your streak, and skipping a day resets it to zero. Because Tango is pure deduction with no luck involved, a long streak is really a record of method: players who learn to read the equals and cross signs early rarely lose a day to a board they cannot finish.",
  },
  {
    question: "Is there an archive of past Tango answers?",
    answer:
      "Yes. Every Tango puzzle we cover keeps a permanent page with its hints and completed grid, so you can go back to a day you missed or practise older boards. Recent dates are linked above, and each archived Tango answer stays online indefinitely.",
  },
  {
    question: "Does solving Tango help with word puzzles?",
    answer:
      "It builds the same constraint-driven habit of mind. In Tango you eliminate impossible symbols until one remains; in a cryptic crossword you eliminate readings of a clue until the wordplay resolves cleanly. If the deduction in the Tango puzzle appeals to you, our daily cryptic clue is a natural next step.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInTangoAnswer",
    title: "LinkedIn Tango Answer Today — Grid Solution & Hints",
    description:
      "Solve today's LinkedIn Tango with progressive hints and the full sun/moon grid solution. New answer every day, past puzzles archived.",
    keywords: META.keywords,
    locale: locale as Locale,
    path: `/${META.slug}`,
    canonicalUrl: `/${META.slug}`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInTangoAnswerPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInGame("tango");
  const recent = await getRecentLinkedInDays("tango", 7);

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
          { name: "Tango Answer", url: `${BASE_URL}/${META.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Tango Answer Today — ${dateLabel}`,
          description:
            "Progressive hints and the full solved sun and moon grid for today's LinkedIn Tango puzzle.",
          url: `${BASE_URL}/${META.slug}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Tango Answer Today"
        description={`${dateLabel} — three spoiler-free hints first, then the complete sun and moon grid for today's Tango board.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn Tango answer for {dateLabel} is published below.
          Take hint one if you only need a nudge, work down to hint three if the
          grid still resists, and reveal the finished board when you want every
          sun and moon placed. Nothing here spoils the puzzle until you tap for
          it, and the full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Queens, Zip, Pinpoint and Crossclimb the same way.
        </p>

        {day ? (
          <GameSolution game="tango" day={day} dateLabel={dateLabel} />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Today&apos;s Tango board is being solved and verified. Check back
            shortly.
          </p>
        )}

        {recent.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recent Tango answers
            </h2>
            <ArchiveStrip days={recent} slug={META.slug} gameName="Tango" />
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Tango is a trademark of
          LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is LinkedIn Tango?" },
            { href: "#rules", label: "The rules in four lines" },
            { href: "#method", label: "A repeatable solving method" },
            { href: "#mistakes", label: "Common Tango mistakes" },
            { href: "#speed", label: "Solving Tango faster" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is LinkedIn Tango?" id="what-is">
          <BodyText>
            Tango is LinkedIn&apos;s daily balance puzzle, and it plays like a
            gentler cousin of Sudoku built out of suns and moons instead of
            numbers. You are handed a six-by-six grid with a few symbols already
            placed, and your job is to fill every remaining cell so that the
            whole board stays in balance. The rules fit in a sentence; the
            middle of a hard board does not.
          </BodyText>
          <BodyText>
            What makes the Tango puzzle so approachable is that it asks nothing
            of your vocabulary or general knowledge. Every board can be reasoned
            out from the symbols and signs already on screen, which is why it
            travels well across languages and why players who bounce off word
            games often stay loyal to this one. Each grid resolves to exactly one
            valid arrangement, so a completed Tango answer is provably right
            rather than merely plausible.
          </BodyText>
          <BodyText>
            A new board lands daily at midnight local time, and because the
            puzzle number is shared worldwide, you and your colleagues are
            working the same grid. That shared board is what turns a solve into
            something worth comparing over coffee. This page keeps the same
            rhythm: graded hints published in the morning, with the full Tango
            solution sitting immediately below them for whenever you want it.
          </BodyText>
        </ContentSection>

        <ContentSection title="Tango Rules, in Four Lines" id="rules">
          <SubHeading>1. The board is six by six</SubHeading>
          <BodyText>
            Thirty-six cells, each of which ends up holding either a sun or a
            moon. A handful arrive pre-filled as your starting foothold, and
            every other cell is decided by deduction from the rules below.
          </BodyText>
          <SubHeading>2. Every row and column splits three and three</SubHeading>
          <BodyText>
            Each of the six rows finishes with exactly three suns and three
            moons, and so does each of the six columns. This balance rule is what
            lets you complete a line the moment one symbol reaches its quota:
            if a row already holds three suns, every empty cell in that row is a
            moon.
          </BodyText>
          <SubHeading>3. Never three identical symbols in a row</SubHeading>
          <BodyText>
            No three consecutive cells in any row or column may share a symbol.
            Two suns side by side are fine; a third is illegal. This constraint
            generates most of the early moves in a Tango puzzle, because any pair
            of matching neighbours immediately forces the cells on either side of
            them.
          </BodyText>
          <SubHeading>4. The = and × signs bind neighbouring cells</SubHeading>
          <BodyText>
            An equals sign printed between two cells means they hold the same
            symbol. A cross means they hold different symbols. These signs travel
            with the board rather than the solve, so they are true from the first
            move onward and are usually the richest source of information on the
            grid.
          </BodyText>
          <CalloutBox type="tip" title="The rule people forget">
            The three-in-a-row ban applies to columns exactly as it does to rows.
            When a Tango board refuses to come out, the culprit is very often a
            vertical run of three that slipped past unnoticed.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="A Repeatable Method for Solving Tango"
          id="method"
        >
          <BodyText>
            Filling cells at random works on an easy grid and collapses on a hard
            one. The sequence below solves nearly every LinkedIn Tango puzzle
            without a single guess, and it is the same order of operations we
            follow when preparing the daily Tango solution for this page.
          </BodyText>
          <SubHeading>Step 1 — resolve every pair first</SubHeading>
          <BodyText>
            Sweep the board for two identical symbols that already sit next to
            each other, horizontally or vertically. The three-in-a-row rule
            forces the cells on both ends of that pair to take the opposite
            symbol. These moves cost nothing to spot and often cascade into four
            or five further placements.
          </BodyText>
          <SubHeading>Step 2 — cash in the equals and cross signs</SubHeading>
          <BodyText>
            Work every sign whose partner cell is already known. An equals sign
            copies a known symbol across; a cross flips it. Signs attached to two
            empty cells still carry weight, because the pair they define behaves
            as a single unit for counting purposes later in the solve.
          </BodyText>
          <SubHeading>Step 3 — count each line toward its quota</SubHeading>
          <BodyText>
            Walk every row and column and count what is already placed. Any line
            holding three of one symbol is finished for that symbol, so the
            remaining cells fill in automatically. This counting pass is where a
            half-finished Tango board usually falls apart in your favour.
          </BodyText>
          <SubHeading>Step 4 — test the gaps that only fit one way</SubHeading>
          <BodyText>
            For the last stubborn cells, try one symbol and check whether it
            forces an illegal triple or breaks a line&apos;s count. If it does,
            the other symbol is correct, and you have proved it rather than
            guessed it. Two or three of these checks will close out any Tango
            answer that survives the first three steps.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Tango Mistakes" id="mistakes">
          <BodyText>
            The first mistake is treating the balance rule as a row-only rule.
            Columns need exactly three suns and three moons as well, and a grid
            that satisfies every row can still be wrong vertically. Count both
            directions before you call a Tango puzzle finished.
          </BodyText>
          <BodyText>
            The second is ignoring signs that sit between two empty cells.
            Players tend to skip them and return later, but a cross between two
            unknowns already tells you that pair contains exactly one sun and one
            moon, which is often enough to settle a line&apos;s count on its own.
          </BodyText>
          <BodyText>
            The third is clearing the whole board after hitting a contradiction.
            A contradiction only proves that one specific placement was wrong, so
            back up to the last cell you deduced with certainty instead of
            throwing away twenty correct moves along with the bad one.
          </BodyText>
        </ContentSection>

        <ContentSection title="Solving Tango Faster" id="speed">
          <BodyText>
            Players chasing a quicker daily time converge on much the same
            habits. They scan the entire grid for adjacent pairs before placing
            anything, so the free moves all land at once. They treat the equals
            and cross signs as their primary map rather than as decoration. And
            they recount rows and columns after every few placements, because a
            line that quietly reached its quota is the cheapest source of new
            cells on the board.
          </BodyText>
          <BodyText>
            If you are here to improve rather than simply to finish, take only
            hint one and go back to the grid for two minutes before reading
            further. The hints are deliberately graded so you can take the
            smallest amount of help that unsticks you, which is how solving skill
            actually compounds from one Tango board to the next.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Tango FAQ" id="faq">
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
              href="/linkedin-pinpoint-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Pinpoint category</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Clue-by-clue hints, then today&apos;s category.
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
