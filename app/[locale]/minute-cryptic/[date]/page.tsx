import MinuteCrypticGame from "@/components/home/MinuteCrypticGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllMinuteCryptics,
  getMinuteCrypticByDate,
  getMinuteCrypticsByClueType,
  getMinuteCrypticsByDifficulty,
  getRelatedMinuteCryptics,
} from "@/lib/minute-cryptic-data";
import {
  getClueTypeTopic,
  getDifficultyTopic,
} from "@/lib/minute-cryptic-topics";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getMinuteCrypticByDate(date);
  if (!puzzle) return {};

  const formattedDate = dayjs(date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Minute Cryptic for ${formattedDate} (Daily Cryptic Clue #${puzzle.id})`,
    description: `Solve minute cryptic clue #${puzzle.id} for ${formattedDate} in our daily cryptic archive, with progressive hints, answer check, and full explanation.`,
    keywords: [
      `minute cryptic ${date}`,
      `minute cryptic #${puzzle.id}`,
      `daily cryptic ${date}`,
      "daily cryptic",
      "minute cryptic answer",
      "daily cryptic clue",
      "cryptic clue explanation",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic/${date}`,
    canonicalUrl: `/minute-cryptic/${date}`,
  });
}

export default async function DailyPuzzlePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getMinuteCrypticByDate(date);

  if (!puzzle) notFound();

  const allPuzzles = await getAllMinuteCryptics();
  const currentIndex = allPuzzles.findIndex((p) => p.printDate === date);
  const prevPuzzle =
    currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;
  const nextPuzzle = currentIndex > 0 ? allPuzzles[currentIndex - 1] : null;
  const sameClueTypePuzzles = (await getMinuteCrypticsByClueType(puzzle.clueType))
    .filter((p) => p.printDate !== puzzle.printDate)
    .slice(0, 3);
  const sameDifficultyPuzzles = (
    await getMinuteCrypticsByDifficulty(puzzle.difficulty)
  )
    .filter(
      (p) =>
        p.printDate !== puzzle.printDate && p.clueType !== puzzle.clueType
    )
    .slice(0, 3);
  const relatedPuzzles = await getRelatedMinuteCryptics(puzzle, 6);
  const clueTypeTopic = getClueTypeTopic(puzzle.clueType);
  const difficultyTopic = getDifficultyTopic(puzzle.difficulty);

  const formattedDate = dayjs(puzzle.printDate).format("dddd, MMMM D, YYYY");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Archive", url: `${BASE_URL}/minute-cryptic` },
          {
            name: `Clue #${puzzle.id}`,
            url: `${BASE_URL}/minute-cryptic/${date}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `Minute Cryptic ${dayjs(puzzle.printDate).format("MMMM D, YYYY")} - Daily Cryptic Clue #${puzzle.id}`,
          description: puzzle.clue,
          url: `${BASE_URL}/minute-cryptic/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />

      <nav className="mb-6 flex items-center justify-between">
        {prevPuzzle ? (
          <Link
            href={`/minute-cryptic/${prevPuzzle.printDate}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {dayjs(prevPuzzle.printDate).format("MMM D")} previous clue
          </Link>
        ) : (
          <span />
        )}
        {nextPuzzle ? (
          <Link
            href={`/minute-cryptic/${nextPuzzle.printDate}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Next clue {dayjs(nextPuzzle.printDate).format("MMM D")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Minute Cryptic for {dayjs(puzzle.printDate).format("MMMM D, YYYY")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Clue #{puzzle.id} | {formattedDate}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Try to solve this daily cryptic clue before revealing help. The answer
          and explanation are available below after your attempt.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <MinuteCrypticGame
          clue={puzzle.clue}
          answer={puzzle.answer}
          dateLabel={formattedDate}
          printDate={puzzle.printDate}
          puzzleId={puzzle.id}
          hints={puzzle.hintLevels}
        />
      </div>

      <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Answer and Explanation
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Type: {puzzle.clueType} | Difficulty: {puzzle.difficulty}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Answer
        </h3>
        <p className="mt-2 text-base font-semibold text-foreground">
          Answer: {puzzle.answer}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Why this answer fits
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {puzzle.explanation}
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Hint strategy for this clue
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use one hint level at a time. Start with direction, then mechanism,
          then structure. Only reveal deeper help if your current parse still
          fails both definition and wordplay checks.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Learn from this clue type
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This puzzle is tagged as {puzzle.clueType} and {puzzle.difficulty}.
          If you want more than one-off solving, study the clue family and then
          repeat the same difficulty range while the pattern is still fresh.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href={clueTypeTopic.href}
            className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <h3 className="text-sm font-bold text-foreground">
              {clueTypeTopic.label}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {clueTypeTopic.description}
            </p>
          </Link>
          <Link
            href={difficultyTopic.href}
            className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <h3 className="text-sm font-bold text-foreground">
              {difficultyTopic.label}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {difficultyTopic.description}
            </p>
          </Link>
          <Link
            href="/cryptic-clue-types"
            className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <h3 className="text-sm font-bold text-foreground">
              Cryptic clue types
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare clue families and choose a more focused practice route.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          What this {clueTypeTopic.shortLabel.toLowerCase()} clue is teaching
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {clueTypeTopic.detailBody}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {clueTypeTopic.detailFocus}
        </p>
        <h3 className="mt-5 text-sm font-bold text-foreground">
          Why the {difficultyTopic.shortLabel.toLowerCase()} difficulty matters
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {difficultyTopic.detailBody}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {difficultyTopic.detailFocus}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          If you want to turn this one solve into a repeatable lesson, move next
          to the{" "}
          <Link
            href={clueTypeTopic.href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {clueTypeTopic.label.toLowerCase()}
          </Link>{" "}
          page for mechanism-specific guidance, or stay inside the{" "}
          <Link
            href={difficultyTopic.href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {difficultyTopic.label.toLowerCase()}
          </Link>{" "}
          archive for more clues at the same pressure level.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Practice the same pattern next
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The best follow-up clue is usually not just the most recent one. It is
          a clue that keeps either the same mechanism or the same resistance
          level active while the lesson from this solve is still fresh.
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              More {clueTypeTopic.label.toLowerCase()}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Stay with the same clue family to reinforce recognition,
              structure, and proof on a familiar mechanism.
            </p>
            <div className="mt-4 grid gap-3">
              {sameClueTypePuzzles.map((p) => (
                <Link
                  key={`type-${p.id}`}
                  href={`/minute-cryptic/${p.printDate}`}
                  className="group rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {dayjs(p.printDate).format("MMM D, YYYY")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    #{p.id} | {p.clueType} | {p.difficulty}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {p.clue}
                  </p>
                  <span className="mt-3 inline-flex text-xs font-semibold text-primary">
                    Solve a similar clue
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">
              More {difficultyTopic.label.toLowerCase()}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Keep the difficulty steady if you want more repetition at the same
              pressure level without repeating the exact same mechanism.
            </p>
            <div className="mt-4 grid gap-3">
              {sameDifficultyPuzzles.map((p) => (
                <Link
                  key={`difficulty-${p.id}`}
                  href={`/minute-cryptic/${p.printDate}`}
                  className="group rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {dayjs(p.printDate).format("MMM D, YYYY")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    #{p.id} | {p.clueType} | {p.difficulty}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {p.clue}
                  </p>
                  <span className="mt-3 inline-flex text-xs font-semibold text-primary">
                    Solve at the same level
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl">
        <h2 className="font-heading text-xl font-bold text-foreground">
          More related archive clues
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If you want a broader run of connected practice, these picks mix the
          same clue type, the same difficulty, and the nearest useful archive
          fallbacks.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedPuzzles.map((p) => (
              <Link
                key={p.id}
                href={`/minute-cryptic/${p.printDate}`}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {dayjs(p.printDate).format("MMM D, YYYY")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  #{p.id} | {p.clueType} | {p.difficulty}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {p.clue}
                </p>
                <span className="mt-3 inline-flex text-xs font-semibold text-primary">
                  Open related clue
                </span>
              </Link>
            ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Keep solving
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Browse the full{" "}
          <Link
            href="/minute-cryptic"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            minute cryptic archive
          </Link>{" "}
          for more daily cryptic clues with hints and explanations. Want
          today&apos;s puzzle? Head to{" "}
          <Link
            href="/minute-cryptic-today"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            minute cryptic today
          </Link>{" "}
          for the latest clue. New to cryptics? Our{" "}
          <Link
            href={clueTypeTopic.href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {clueTypeTopic.label.toLowerCase()}
          </Link>{" "}
          or revisit the{" "}
          <Link
            href={difficultyTopic.href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {difficultyTopic.label.toLowerCase()}
          </Link>{" "}
          page for more controlled practice.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Found an issue in this clue?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If you notice an unclear definition, ambiguous parse, or explanation
          issue, contact us with the puzzle date and your reasoning so we can
          review and correct quickly.
        </p>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const allPuzzles = await getAllMinuteCryptics();
  const params: { locale: string; date: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of allPuzzles) {
      params.push({ locale, date: puzzle.printDate });
    }
  }

  return params;
}
