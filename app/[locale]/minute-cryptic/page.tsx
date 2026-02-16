import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllMinuteCryptics,
  getLatestMinuteCryptic,
  getMinuteCrypticCount,
} from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const TAG_LINKS = [
  { label: "Today's minute cryptic", href: "/minute-cryptic-today" },
  { label: "How to play", href: "/how-to-play-minute-cryptic" },
  { label: "FAQ", href: "/minute-cryptic-faq" },
  { label: "More guides", href: "/guides" },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = await getMinuteCrypticCount();

  return constructMetadata({
    page: "Archive",
    title: "Minute Cryptic Archive: Past Daily Clues and Explanations",
    description: `Browse ${count} past minute cryptic clues with hint levels, answer checks, and full explanations.`,
    keywords: [
      "minute cryptic archive",
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
  const allPuzzles = await getAllMinuteCryptics();
  const totalCount = await getMinuteCrypticCount();
  const latestPuzzle = await getLatestMinuteCryptic();
  const visibleCountGate = Number.parseInt(
    process.env.MINUTE_CRYPTIC_VISIBLE_COUNT ?? "",
    10
  );
  const isPrelaunchLimited =
    Number.isFinite(visibleCountGate) &&
    visibleCountGate > 0 &&
    totalCount <= visibleCountGate;

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

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: BASE_URL },
            { name: "Archive", url: `${BASE_URL}/minute-cryptic` },
          ])}
        />

        <header className="py-6 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Minute Cryptic Archive
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore {totalCount} past minute cryptic clues with progressive hints,
            answer checks, and full explanations.
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
            How to use this archive
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use this archive for structured practice. Pick a date, attempt the
            clue without hints first, then reveal one hint level only if needed.
            After checking your answer, review the explanation to understand the
            definition and wordplay logic.
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

        <div className="mt-8 space-y-10">
          {months.map((month) => (
            <section key={month}>
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
            Archive FAQ
          </h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-lg border border-border/80 bg-background p-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                Where can I play today&apos;s clue?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the minute cryptic today page for the latest published clue.
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
                Start from the newest clue, solve first, use one hint level at a
                time, then read the explanation before moving to the next clue.
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
