import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getArchiveMinuteCrypticCount,
  getArchiveMinuteCryptics,
  getLatestMinuteCryptic,
  getMinuteCrypticCount,
} from "@/lib/minute-cryptic-data";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  CLUE_TYPE_TOPICS,
  DIFFICULTY_TOPICS,
} from "@/lib/minute-cryptic-topics";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const TAG_LINKS = [
  { label: "Today's daily cryptic", href: "/minute-cryptic-today" },
  { label: "How to play", href: "/how-to-play-minute-cryptic" },
  { label: "Beginner guide", href: "/cryptic-crossword-for-beginners" },
  { label: "Clue types", href: "/cryptic-clue-types" },
  { label: "Easy clues", href: "/minute-cryptic/easy" },
  { label: "Medium clues", href: "/minute-cryptic/medium" },
  { label: "Hard clues", href: "/minute-cryptic/hard" },
  { label: "FAQ", href: "/minute-cryptic-faq" },
  { label: "About", href: "/about" },
];

const FAQ_ITEMS = [
  {
    question: "Where can I play today's clue?",
    answer:
      "Open the minute cryptic today page for the latest published daily cryptic clue.",
  },
  {
    question: "Are past minute cryptics free?",
    answer:
      "Yes. Archive clues, hints, and explanations are available without an account.",
  },
  {
    question: "How should beginners use this page?",
    answer:
      "Start with the beginner guide or easy archive, solve one clue at a time, then review the explanation before moving on.",
  },
];

function monthAnchor(month: string) {
  return `month-${month}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = await getArchiveMinuteCrypticCount();

  return constructMetadata({
    page: "Archive",
    title: "Minute Cryptic Archive: Daily Cryptic History, Answers, and Explanations",
    description: `Free minute cryptic archive with ${count} daily cryptic clues. Browse the full minute cryptic archive online with progressive hints, instant answer checks, and detailed explanations for every clue.`,
    keywords: [
      "minute cryptic archive",
      "minute cryptic archive free",
      "minute cryptic archive free online",
      "minute cryptic archives",
      "daily cryptic archive",
      "daily cryptic history",
      "past minute cryptics",
      "daily minute cryptic",
      "minute cryptic answers",
      "cryptic clue archive",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic`,
    canonicalUrl: `/minute-cryptic`,
  });
}

export default async function MinuteCrypticArchivePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getArchiveMinuteCryptics();
  const displayedCount = await getArchiveMinuteCrypticCount();
  const totalCount = await getMinuteCrypticCount();
  const latestPuzzle = await getLatestMinuteCryptic();
  const isPrelaunchLimited = displayedCount < totalCount;

  const groupedByMonth = allPuzzles.reduce<Record<string, typeof allPuzzles>>(
    (acc, puzzle) => {
      const month = puzzle.printDate.slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(puzzle);
      return acc;
    },
    {}
  );

  const months = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));
  const clueTypeCounts = Object.entries(CLUE_TYPE_TOPICS).map(([key, topic]) => ({
    key,
    topic,
    count: allPuzzles.filter((puzzle) => puzzle.clueType === key).length,
  }));
  const difficultyCounts = Object.entries(DIFFICULTY_TOPICS).map(
    ([key, topic]) => ({
      key,
      topic,
      count: allPuzzles.filter((puzzle) => puzzle.difficulty === key).length,
    })
  );

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: BASE_URL },
            { name: "Minute Cryptic Archive", url: `${BASE_URL}/minute-cryptic` },
          ])}
        />
        <JsonLd
          data={collectionPageSchema({
            name: "Minute Cryptic Archive",
            description:
              "A free archive of daily minute cryptic clues with hints, answer checks, and full explanations.",
            url: `${BASE_URL}/minute-cryptic`,
          })}
        />
        <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
        <JsonLd
          data={itemListSchema(
            allPuzzles.slice(0, 12).map((puzzle) => ({
              name: `Minute Cryptic #${puzzle.id}`,
              url: `${BASE_URL}/minute-cryptic/${puzzle.printDate}`,
              description: puzzle.clue,
            }))
          )}
        />

        <header className="py-6 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Minute Cryptic Archive
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse the complete minute cryptic archive with {displayedCount} daily
            cryptic clues available free online. Each clue includes progressive
            hints, an instant answer check, and a full explanation of the
            definition and wordplay.
          </p>
          {isPrelaunchLimited && (
            <p className="mx-auto mt-3 max-w-2xl rounded-lg border border-amber-300/50 bg-amber-100/60 px-4 py-2 text-xs font-medium text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200">
              Prelaunch note: this archive currently shows a limited set of
              puzzles.
            </p>
          )}
        </header>

        <nav className="py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {TAG_LINKS.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="mt-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            How to Use the Minute Cryptic Archive
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use this archive for structured practice. Pick a date, attempt the
            clue without hints first, then reveal one hint level only if needed.
            After checking your answer, review the explanation to understand the
            definition and wordplay logic behind each daily cryptic clue.
          </p>
          <h3 className="mt-5 font-heading text-base font-bold text-foreground">
            What you can find here
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>Daily clue text and clue type</li>
            <li>Difficulty labels for pacing your practice</li>
            <li>Progressive hints and answer checks</li>
            <li>Explanation pages for review and learning</li>
          </ul>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Practice by learning stage
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If you are new to cryptics, start with the beginner guide and easy
            clue archive. If you already recognize clue families, use the clue
            type guides and difficulty routes to build more intentional practice
            blocks.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/cryptic-crossword-for-beginners"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <h3 className="text-sm font-bold text-foreground">
                Cryptic crossword for beginners
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Learn the most reliable start-here solving workflow.
              </p>
            </Link>
            <Link
              href="/cryptic-clue-types"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <h3 className="text-sm font-bold text-foreground">Cryptic clue types</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Compare clue families and choose a focused study path.
              </p>
            </Link>
            <Link
              href="/minute-cryptic/easy"
              className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <h3 className="text-sm font-bold text-foreground">Easy cryptic clues</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Move into practice sets that keep structure readable.
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Browse by clue type
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Practice several clues from the same mechanism in a row when you
            want stronger pattern recognition. This is usually the fastest way
            to make clue structure feel familiar instead of random.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {clueTypeCounts.map(({ key, topic, count }) => (
              <Link
                key={key}
                href={topic.href}
                className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="text-sm font-bold text-foreground">
                  {topic.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  {count} archive clues
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Browse by difficulty
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use difficulty pages when you want to control resistance more than
            clue mechanism. This is useful for building confidence, finding the
            right challenge level, or keeping a session consistent.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {difficultyCounts.map(({ key, topic, count }) => (
              <Link
                key={key}
                href={topic.href}
                className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="text-sm font-bold text-foreground">
                  {topic.label}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  {count} archive clues
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Jump to archive month
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If you prefer browsing by date, jump directly to a month below and
            pick a run of clues from the same publishing window.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {months.map((month) => (
              <Link
                key={month}
                href={`#${monthAnchor(month)}`}
                className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {dayjs(`${month}-01`).format("MMM YYYY")}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 space-y-10">
          {months.map((month) => (
            <section key={month} id={monthAnchor(month)} className="scroll-mt-24">
              <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
                {dayjs(`${month}-01`).format("MMMM YYYY")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedByMonth[month].map((puzzle) => (
                  <Link
                    key={puzzle.id}
                    href={`/minute-cryptic/${puzzle.printDate}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                        Clue #{puzzle.id}
                      </span>
                      {latestPuzzle?.id === puzzle.id && (
                        <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                          Latest
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-bold text-foreground">
                      {puzzle.clue}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {dayjs(puzzle.printDate).format("MMM D, YYYY")} |{" "}
                      {puzzle.difficulty} | {puzzle.clueType}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                      Solve this clue
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            About the Minute Cryptic Archive
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The minute cryptic archive is a free, ever-growing collection of
            daily cryptic clues published on Daily Cryptic. Every past clue is
            stored here and can be solved online at any time with no downloads, no
            accounts, no paywalls. The archive updates automatically each day
            when a new minute cryptic is released.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You can browse the minute cryptic archives by month, pick any date
            that interests you, and work through the clue at your own pace. Each
            entry includes four progressive hint levels so you can get just
            enough help without spoiling the solve, plus an instant answer check
            and a detailed explanation of the definition and wordplay.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Whether you are a beginner learning how cryptic clues work or an
            experienced solver looking for daily practice, this archive has
            something for you. Start with easier clues to build confidence, then
            challenge yourself to solve harder puzzles without any hints. Many
            solvers use the minute cryptic archive as a free online training
            ground to sharpen their cryptic crossword skills.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Unlike a static PDF archive, every clue here is fully interactive.
            You get letter-grid input, a virtual keyboard, animated feedback,
            and step-by-step hints all in your browser. No need to print or
            download anything. The minute cryptic archive free online experience
            is designed to be fast, focused, and fun on both desktop and mobile.
          </p>
        </section>

        <section className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Minute Cryptic Archive FAQ
          </h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-lg border border-border/80 bg-background p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                Where can I play today&apos;s clue?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the minute cryptic today page for the latest published
                daily cryptic clue.
              </p>
            </details>
            <details className="rounded-lg border border-border/80 bg-background p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                Are past minute cryptics free?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Yes. Archive clues, hints, and explanations are available without
                an account.
              </p>
            </details>
            <details className="rounded-lg border border-border/80 bg-background p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                How should beginners use this page?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with the beginner guide or easy archive, solve one clue at
                a time, then read the explanation before moving to the next
                clue.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
