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
import PipsTierView from "@/components/pips/PipsTierView";
import PipsPuzzleCard from "@/components/pips/PipsPuzzleCard";
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
  getTodaysPipsPuzzle,
  getRecentPipsPuzzles,
  buildStrategyHint,
} from "@/lib/pips-data";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What are today's NYT Pips answers?",
    answer:
      "Today's fully solved Pips boards for Easy, Medium and Hard are on this page, each hidden behind a Reveal button so nothing is spoiled before you want it. Switch difficulty with the tabs, read the spoiler-free strategy hint, then reveal the solved board with every domino placed. We update all three tiers every morning.",
  },
  {
    question: "How do you play NYT Pips?",
    answer:
      "You are given a set of domino tiles and a board split into coloured regions. Place every domino flat on the board so that each region satisfies its constraint — cells that must be equal, add up to a target, or stay under or over a number. Some cells carry no rule at all. When every region's constraint is met, the puzzle is solved.",
  },
  {
    question: "What do the numbers and symbols on the Pips board mean?",
    answer:
      "Each coloured region carries a constraint. A single number means the domino halves in that region must add up to that sum. An equals sign means every cell in the region must show the same value. A greater-than or less-than symbol means the region total must be above or below that number. Plain, unmarked cells have no rule of their own and can take any value.",
  },
  {
    question: "Is NYT Pips different every day for Easy, Medium and Hard?",
    answer:
      "Yes. Pips publishes three separate puzzles each day — Easy, Medium and Hard — and all three change daily. Easy uses fewer dominoes and looser constraints; Hard packs in more tiles and tighter rules. You can play and solve each tier independently.",
  },
  {
    question: "When does NYT Pips reset each day?",
    answer:
      "A new Pips puzzle is released daily around 3:00 AM Eastern Time, in line with the other New York Times games. Our answers and hints for all three difficulties are refreshed each morning shortly after the new board goes live.",
  },
  {
    question: "Is NYT Pips free to play?",
    answer:
      "Pips is part of the New York Times Games collection. A limited amount is playable for free, while full daily access is included with a Games subscription. Reading hints and solutions here is always free, with no account required.",
  },
  {
    question: "Is there a Pips archive I can browse?",
    answer:
      "Yes. Our Pips answers archive keeps every past puzzle we have covered, each with all three difficulty boards, strategy hints and full solutions. It is handy for reviewing a day you missed or practising older boards.",
  },
  {
    question: "Do logic puzzles like Pips help with cryptic crosswords?",
    answer:
      "They share a core skill: working from constraints toward a single consistent answer. The deductive, rule-out-what-can't-fit thinking that solves Pips is exactly what cracks a cryptic clue's wordplay. If you enjoy Pips, our beginner cryptic guides are a natural next step.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getTodaysPipsPuzzle();
  const dateStr = puzzle
    ? new Date(puzzle.printDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return constructMetadata({
    page: "PipsAnswersToday",
    title: `NYT Pips Answers & Hints Today — Easy, Medium, Hard ${dateStr}`,
    description: `Today's NYT Pips answers and hints for Easy, Medium and Hard. Spoiler-free strategy first, then the full solved board. Updated daily, free.`,
    keywords: [
      "nyt pips answers today",
      "pips answers today",
      "pips hints today",
      "nyt pips solution",
      "pips hard solution",
      "how to play nyt pips",
      "nyt pips easy medium hard",
    ],
    locale: locale as Locale,
    path: "/pips-answers-today",
    canonicalUrl: "/pips-answers-today",
  });
}

export default async function PipsAnswersTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getTodaysPipsPuzzle();
  const recentPuzzles = await getRecentPipsPuzzles(4);

  if (!puzzle) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ContentHero
          eyebrow="Pips"
          title="NYT Pips Answers & Hints"
          description="Today's puzzle is being updated. Please check back shortly."
        />
      </div>
    );
  }

  const dateObj = new Date(puzzle.printDate + "T12:00:00Z");
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const tierEntries = [
    { key: "easy" as const, label: "Easy", tier: puzzle.tiers.easy, strategyHint: buildStrategyHint(puzzle.tiers.easy) },
    { key: "medium" as const, label: "Medium", tier: puzzle.tiers.medium, strategyHint: buildStrategyHint(puzzle.tiers.medium) },
    { key: "hard" as const, label: "Hard", tier: puzzle.tiers.hard, strategyHint: buildStrategyHint(puzzle.tiers.hard) },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Pips Answers", url: `${BASE_URL}/pips-answers-today` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Pips Answers & Hints Today — ${dateLabel}`,
          description:
            "Spoiler-free strategy hints and the full solved board for today's NYT Pips puzzle across Easy, Medium and Hard.",
          url: `${BASE_URL}/pips-answers-today`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Pips"
        title="NYT Pips Answers & Hints Today"
        description={`${dateLabel} — spoiler-free strategy first, then the full solved board for Easy, Medium and Hard.`}
      />

      <div className="mt-8 space-y-8">
        {/* Interactive tiers */}
        <PipsTierView tiers={tierEntries} />

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Pips is a
          trademark of The New York Times Company.
        </p>

        {/* Ad zone #1 — after the solution block, before evergreen content */}

        <TableOfContents
          items={[
            { href: "#what-is", label: "What is NYT Pips?" },
            { href: "#how-to-play", label: "How to play Pips" },
            { href: "#constraints", label: "Region constraints explained" },
            { href: "#difficulty", label: "Easy vs Medium vs Hard" },
            { href: "#strategies", label: "How to solve Pips" },
            { href: "#cryptic", label: "Pips & cryptic crosswords" },
            { href: "#faq", label: "FAQ" },
            { href: "#archive", label: "Past puzzles" },
          ]}
        />

        {/* B1 */}
        <ContentSection title="What Is NYT Pips?" id="what-is">
          <BodyText>
            NYT Pips is a daily logic puzzle from The New York Times built around
            dominoes. Each day you are handed a set of domino tiles and a board
            divided into coloured regions, and your task is to place every
            domino so that each region obeys its own numeric or relational rule.
          </BodyText>
          <BodyText>
            What makes Pips different from a word game is that there is no
            vocabulary involved at all — only deduction. Every board has exactly
            one valid arrangement, and finding it is a matter of testing which
            values can and cannot fit each region until only one layout remains.
          </BodyText>
          <BodyText>
            Pips ships three separate puzzles every day: Easy, Medium and Hard.
            A fresh set is released at around 3:00 AM Eastern Time, alongside the
            other New York Times games. Because the three tiers are independent,
            you can treat Easy as a warm-up and Hard as the real test.
          </BodyText>
        </ContentSection>

        {/* B2 */}
        <ContentSection title="How to Play Pips: The Rules in 4 Steps" id="how-to-play">
          <SubHeading>1. Read the region constraints</SubHeading>
          <BodyText>
            Every coloured region on the board carries a rule — a target sum, an
            equals sign, or a greater-than or less-than symbol. Plain, unmarked
            cells simply have no rule. Understanding each one is the whole game.
          </BodyText>
          <SubHeading>2. Match dominoes to the tightest regions</SubHeading>
          <BodyText>
            Look at your domino tiles and find where the most restrictive rules
            force a placement. A region that must sum to a small number can only
            take low values, which immediately narrows your options.
          </BodyText>
          <SubHeading>3. Place dominoes flat, covering two cells</SubHeading>
          <BodyText>
            Each domino covers two adjacent cells, one value in each. A single
            domino can straddle two different regions, so its two halves may need
            to satisfy two separate rules at once.
          </BodyText>
          <SubHeading>4. Keep going until every region is satisfied</SubHeading>
          <BodyText>
            The puzzle is solved when all dominoes are placed and every region's
            constraint holds true. If a rule is broken, one of your earlier
            placements is wrong — back up and try a different value there.
          </BodyText>
        </ContentSection>

        {/* B3 */}
        <ContentSection title="Pips Region Constraints Explained" id="constraints">
          <BodyText>
            The board&apos;s coloured regions each enforce one of a small set of
            rules. Learn these five and you can read any Pips board at a glance.
          </BodyText>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[440px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-heading font-bold text-foreground">
                    On the board
                  </th>
                  <th className="py-2 font-heading font-bold text-foreground">
                    What it means
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono">=</td>
                  <td className="py-2">Every cell in the region shows the same value.</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono">6</td>
                  <td className="py-2">The values in the region add up to that number.</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono">&gt;2</td>
                  <td className="py-2">The region total must be greater than the number.</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono">&lt;3</td>
                  <td className="py-2">The region total must be less than the number.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">plain</td>
                  <td className="py-2">
                    An unmarked cell has no rule of its own — any domino value may go there.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <BodyText>
            The trick is that a domino can bridge two regions, so its two halves
            may answer to different rules. That overlap is where most of the
            puzzle&apos;s difficulty — and satisfaction — comes from.
          </BodyText>
        </ContentSection>

        {/* B4 */}
        <ContentSection title="Pips Easy vs Medium vs Hard" id="difficulty">
          <BodyText>
            The three daily tiers are genuinely different puzzles, not the same
            board at different sizes. Choosing the right one keeps the challenge
            enjoyable rather than frustrating.
          </BodyText>
          <SubHeading>Easy</SubHeading>
          <BodyText>
            A compact board with fewer dominoes and looser constraints. Most
            regions can be satisfied in only one or two ways, so Easy is ideal
            for learning how the rules interact.
          </BodyText>
          <SubHeading>Medium</SubHeading>
          <BodyText>
            More tiles and a mix of sum and equals regions that interlock. Medium
            usually needs you to hold two or three possibilities in mind before
            committing to a placement.
          </BodyText>
          <SubHeading>Hard</SubHeading>
          <BodyText>
            A larger grid, many more dominoes, and tightly overlapping
            constraints. Hard rewards patient elimination and often has a single
            keystone region that unlocks the rest once you spot it.
          </BodyText>
        </ContentSection>

        {/* Ad zone #2 — mid-article */}

        {/* B5 */}
        <ContentSection title="How to Solve Pips: 6 Strategies" id="strategies">
          <SubHeading>1. Start with the equals regions</SubHeading>
          <BodyText>
            Regions where every cell must match are the most constrained. Pin
            them down first — they eliminate large numbers of impossible values
            across the whole board.
          </BodyText>
          <SubHeading>2. Attack the smallest sums</SubHeading>
          <BodyText>
            A region that must total a low number can only hold low pip values.
            Solving these early removes those small tiles from contention
            elsewhere.
          </BodyText>
          <SubHeading>3. Pin down greater-than and less-than bounds</SubHeading>
          <BodyText>
            A greater-than or less-than region only rules out part of the range,
            but combined with your remaining tiles it often leaves just one legal
            value. Use these bounds to trim possibilities in neighbouring
            regions.
          </BodyText>
          <SubHeading>4. Track which tiles remain</SubHeading>
          <BodyText>
            Keep a running list of the dominoes you have not yet placed. As the
            pool shrinks, the remaining regions often have only one tile that can
            possibly fit.
          </BodyText>
          <SubHeading>5. Exploit cross-region dominoes</SubHeading>
          <BodyText>
            When a domino spans two regions, both halves must satisfy their own
            rule at once. These double constraints are usually the most
            revealing placements on the board.
          </BodyText>
          <SubHeading>6. Eliminate, don&apos;t guess</SubHeading>
          <BodyText>
            Pips always has a single solution, so a confident deduction beats a
            hopeful guess. If you feel stuck, look for the region with the fewest
            legal options and work outward from there — the same discipline used
            by strong{" "}
            <Link
              href="/cryptic-crossword-solver"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic solvers
            </Link>
            .
          </BodyText>
        </ContentSection>

        {/* B6 — cryptic bridge (unique asset) */}
        <ContentSection
          title="Pips & Cryptic Crosswords: Logic That Transfers"
          id="cryptic"
        >
          <BodyText>
            Pips and cryptic crosswords look nothing alike, yet they reward the
            same habit of mind: taking a tight set of constraints and reasoning
            your way to the one answer that fits. In Pips the constraints are
            numeric; in a cryptic clue they are hidden inside wordplay — but the
            deductive move is identical.
          </BodyText>
          <BodyText>
            A cryptic clue gives you a definition plus a piece of wordplay that
            must produce the same answer. Just as you rule out impossible domino
            values, you rule out readings of a clue until only one word can
            satisfy both halves. If Pips clicks for you, the leap to cryptics is
            smaller than it looks — start with our{" "}
            <Link
              href="/cryptic-crossword-for-beginners"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              cryptic crossword for beginners
            </Link>{" "}
            guide.
          </BodyText>
          <CalloutBox type="tip" title="Try this next">
            Warm up the same logic muscles on a self-contained puzzle — solve
            today&apos;s one-minute cryptic clue.{" "}
            <Link
              href="/minute-cryptic-today"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Today&apos;s cryptic clue →
            </Link>
          </CalloutBox>
        </ContentSection>

        {/* Ad zone #3 — before FAQ */}

        <ContentSection title="NYT Pips FAQ" id="faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Pips Puzzles" id="archive">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentPuzzles.map((p) => (
                <PipsPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/pips-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
              >
                View All Pips Answers →
              </Link>
            </div>
          </ContentSection>
        )}

        <RelatedLinks
          links={[
            {
              href: "/spelling-bee-answers-today",
              title: "Spelling Bee answers today",
              description: "Hints, pangram and the full word list for today.",
            },
            {
              href: "/connections-hint-today",
              title: "Connections hints today",
              description: "Clues and answers for all four Connections groups.",
            },
            {
              href: "/wordle-answer-today",
              title: "Wordle answers today",
              description: "Today's Wordle hints and the answer, spoiler-free.",
            },
            {
              href: "/minute-cryptic-today",
              title: "Today's cryptic clue",
              description: "Solve a daily one-clue cryptic crossword with hints.",
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
