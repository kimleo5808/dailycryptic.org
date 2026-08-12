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

const META = LINKEDIN_GAME_BY_KEY.queens;

const FAQ_ITEMS = [
  {
    question: "What is today's LinkedIn Queens answer?",
    answer:
      "Today's LinkedIn Queens answer is on this page, held behind a reveal button so nothing is spoiled before you ask for it. Read the three graded hints first — they narrow the board without naming a single square — then tap through to the solved grid showing every crown in its region. We refresh the Queens answer each morning as soon as the new puzzle goes live.",
  },
  {
    question: "How do you play LinkedIn Queens?",
    answer:
      "Place exactly one crown in every row, every column and every coloured region of the board. Crowns may never touch, not even diagonally, so a crown blocks all eight squares around it. There is always exactly one valid arrangement, and you reach it by elimination rather than guesswork.",
  },
  {
    question: "Does LinkedIn Queens have only one solution?",
    answer:
      "Yes. Every Queens board is built to have a single valid crown placement. That matters for solving strategy: if you can prove a square must hold a crown, it does, and any line of reasoning that produces two different valid boards contains a mistake somewhere.",
  },
  {
    question: "When does LinkedIn Queens reset each day?",
    answer:
      "A new Queens puzzle appears daily at midnight in your local time zone, which is how LinkedIn keeps everyone on the same puzzle number regardless of where they are. Our Queens answer and hints are published each morning shortly after the fresh board lands.",
  },
  {
    question: "How do LinkedIn Queens streaks work?",
    answer:
      "Solving the daily board keeps your streak alive, and missing a day resets it. Because the puzzle is a pure logic grid with no randomness, streaks reward method over luck: learning to spot forced single squares in small regions is what turns a shaky streak into a long one.",
  },
  {
    question: "Is there an archive of past Queens answers?",
    answer:
      "Yes. Every Queens board we have covered stays online with its hints and solved grid, so you can revisit a day you missed or practise older puzzles. The recent dates are linked above and each one keeps its own permanent page.",
  },
  {
    question: "Are Queens crowns allowed to touch diagonally?",
    answer:
      "No. This is the rule that trips up most new players. Two crowns may not occupy squares that share an edge or a corner, so placing one crown eliminates up to eight neighbouring squares as well as the rest of its row, column and region.",
  },
  {
    question: "Does solving Queens help with word puzzles?",
    answer:
      "It trains the same constraint-driven thinking. In Queens you rule out squares until one remains; in a cryptic crossword you rule out readings of a clue until the wordplay resolves. If you enjoy the deduction in Queens, our daily cryptic clue is a natural companion puzzle.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "LinkedInQueensAnswer",
    title: "LinkedIn Queens Answer Today — Daily Hints & Solution",
    description:
      "Stuck on today's LinkedIn Queens? Get gentle hints first, then the full crown placement solution. Updated daily with an archive of past puzzles.",
    keywords: META.keywords,
    locale: locale as Locale,
    path: `/${META.slug}`,
    canonicalUrl: `/${META.slug}`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LinkedInQueensAnswerPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const day = await getTodaysLinkedInGame("queens");
  const recent = await getRecentLinkedInDays("queens", 7);

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
          { name: "Queens Answer", url: `${BASE_URL}/${META.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `LinkedIn Queens Answer Today — ${dateLabel}`,
          description:
            "Progressive hints and the full solved board for today's LinkedIn Queens puzzle.",
          url: `${BASE_URL}/${META.slug}`,
          datePublished: day?.date ?? new Date().toISOString().split("T")[0],
          dateModified: day?.date ?? new Date().toISOString().split("T")[0],
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="LinkedIn Games"
        title="LinkedIn Queens Answer Today"
        description={`${dateLabel} — three spoiler-free hints first, then the full crown placement for today's Queens board.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct-answer paragraph (GEO block) */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Today&apos;s LinkedIn Queens answer for {dateLabel} is published below.
          Start with hint one if you only need a nudge, work down to hint three
          if the board still resists, and reveal the solved grid when you want
          every crown placed. Nothing on this page spoils the puzzle until you
          tap for it, and the full{" "}
          <Link href={LINKEDIN_HUB_PATH} className="text-primary underline">
            LinkedIn games answers
          </Link>{" "}
          hub covers Zip, Tango, Pinpoint and Crossclimb the same way.
        </p>

        {day ? (
          <GameSolution game="queens" day={day} dateLabel={dateLabel} />
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Today&apos;s Queens board is being solved and verified. Check back
            shortly.
          </p>
        )}

        {recent.length > 0 ? (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recent Queens answers
            </h2>
            <ArchiveStrip days={recent} slug={META.slug} gameName="Queens" />
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with LinkedIn. Queens is a trademark of
          LinkedIn Corporation.
        </p>

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is LinkedIn Queens?" },
            { href: "#rules", label: "The rules in four lines" },
            { href: "#method", label: "A repeatable solving method" },
            { href: "#mistakes", label: "Common Queens mistakes" },
            { href: "#speed", label: "Solving Queens faster" },
            { href: "#faq", label: "FAQ" },
          ]}
        />

        <ContentSection title="What Is LinkedIn Queens?" id="what-is">
          <BodyText>
            Queens is LinkedIn&apos;s daily logic grid, and it has quietly become
            the most-played puzzle in the company&apos;s games lineup. You are
            given a square board divided into irregular coloured regions, and
            your job is to place one crown in every row, every column and every
            region at once. It takes under a minute to explain and considerably
            longer to master.
          </BodyText>
          <BodyText>
            What makes the Queens puzzle satisfying is that no vocabulary,
            trivia or general knowledge is involved. Every board is solvable by
            pure deduction from the shapes on screen, which is why players who
            find word games frustrating often stick with this one. There is
            exactly one valid answer each day, so a solved board is provably
            correct rather than merely plausible.
          </BodyText>
          <BodyText>
            A new Queens board arrives daily at midnight local time. Because the
            puzzle number is shared globally, everyone works on the same grid,
            which is what turns the result into something worth comparing with
            colleagues. Our Queens answer page follows the same daily rhythm:
            hints in the morning, solved grid immediately below them.
          </BodyText>
        </ContentSection>

        <ContentSection title="Queens Rules, in Four Lines" id="rules">
          <SubHeading>1. One crown per row</SubHeading>
          <BodyText>
            Each horizontal line of the board holds exactly one crown — never
            zero, never two. On an eight-by-eight board that means eight crowns
            in total, one per row.
          </BodyText>
          <SubHeading>2. One crown per column</SubHeading>
          <BodyText>
            The same rule applies vertically. Together the row and column rules
            reproduce the classic n-queens constraint that gives the puzzle its
            name.
          </BodyText>
          <SubHeading>3. One crown per coloured region</SubHeading>
          <BodyText>
            This is the rule Queens adds on top of the classic problem, and it
            is where the real difficulty lives. Regions are irregular blobs of
            varying size, so a small region hemmed into two or three squares is
            almost always the fastest place to start solving.
          </BodyText>
          <SubHeading>4. Crowns may never touch</SubHeading>
          <BodyText>
            No two crowns can sit in adjacent squares, including diagonally
            adjacent ones. A placed crown therefore removes its whole row, its
            whole column, its entire region and the ring of up to eight squares
            around it from consideration.
          </BodyText>
          <CalloutBox type="tip" title="Why the touch rule matters">
            Most failed Queens attempts come from forgetting the diagonal part
            of rule four. If a board seems to have no valid answer, check
            whether two of your crowns are meeting at a corner.
          </CalloutBox>
        </ContentSection>

        <ContentSection
          title="A Repeatable Method for Solving Queens"
          id="method"
        >
          <BodyText>
            Guessing works occasionally on small boards and fails reliably on
            large ones. The method below solves nearly every LinkedIn Queens
            puzzle without ever placing a speculative crown, and it is the same
            sequence we use when preparing the daily Queens solution for this
            page.
          </BodyText>
          <SubHeading>Step 1 — find the forced regions</SubHeading>
          <BodyText>
            Scan for the smallest colour regions first. A region confined to a
            single row or column forces a crown into that line, which
            immediately eliminates the rest of the row or column even before you
            know exactly which square holds the crown. Two-square regions are
            gold: they always resolve early.
          </BodyText>
          <SubHeading>Step 2 — mark eliminations, not guesses</SubHeading>
          <BodyText>
            Rather than trying crown positions, mark squares that cannot hold a
            crown. Every confirmed elimination is permanent and cannot mislead
            you later, whereas a speculative crown propagates errors across the
            whole board. Queens rewards patient subtraction.
          </BodyText>
          <SubHeading>Step 3 — use the pigeonhole squeeze</SubHeading>
          <BodyText>
            If three regions can only occupy three particular rows between them,
            no other region may use those rows. This counting argument resolves
            the crowded middle of hard boards faster than square-by-square
            checking, and it is the single most useful technique for cutting
            your solve time.
          </BodyText>
          <SubHeading>Step 4 — close out with adjacency</SubHeading>
          <BodyText>
            Once most crowns are placed, the no-touching rule usually decides the
            remainder on its own. Walk the last two or three open regions and
            check which candidate squares survive contact with the crowns you
            already trust.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Queens Mistakes" id="mistakes">
          <BodyText>
            The first mistake is starting in the largest region. Big regions
            offer the most freedom and therefore the least information; they are
            the last part of the board to resolve, not the first.
          </BodyText>
          <BodyText>
            The second is treating the region rule as optional once rows and
            columns look tidy. A board can satisfy every row and column and still
            be wrong because two crowns share a colour — always verify by region
            before declaring the Queens puzzle solved.
          </BodyText>
          <BodyText>
            The third is undoing correct work after hitting a contradiction.
            A contradiction proves that one specific assumption was wrong, not
            that the whole board is. Back up to your last certain elimination
            rather than clearing the grid.
          </BodyText>
        </ContentSection>

        <ContentSection title="Solving Queens Faster" id="speed">
          <BodyText>
            Players chasing a faster daily time tend to converge on the same
            habits. They open with a full sweep of region sizes before touching
            the board, so they know where the constraints are concentrated. They
            work eliminations in batches along a whole row rather than square by
            square. And they resist placing any crown until at least one is
            forced, which prevents the cascading corrections that eat most of
            the clock.
          </BodyText>
          <BodyText>
            If you are using this page to learn rather than to finish, try
            reading only hint one, then returning to the board for two minutes
            before looking further. The graded hints exist so you can take the
            smallest amount of help that gets you moving, which is how solving
            skill actually develops.
          </BodyText>
        </ContentSection>

        <ContentSection title="LinkedIn Queens FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            More daily puzzles
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/linkedin-zip-answer"
              className="rounded-xl border border-border p-4 transition hover:border-primary"
            >
              <p className="font-semibold text-foreground">Zip answer today</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The full numbered path through today&apos;s Zip board.
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
