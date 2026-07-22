import {
  BodyText,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import LetterBoxedPlay from "@/components/letter-boxed/LetterBoxedPlay";
import LetterBoxedAnswerBoard from "@/components/letter-boxed/LetterBoxedAnswerBoard";
import LetterBoxedPuzzleCard from "@/components/letter-boxed/LetterBoxedPuzzleCard";
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
  getLetterBoxedPuzzleByDate,
  getAllLetterBoxedPuzzles,
  getAdjacentLetterBoxedPuzzles,
  getRecentLetterBoxedPuzzles,
  buildLetterBoxedHints,
} from "@/lib/letter-boxed-data";
import type { DecodedLetterBoxedPuzzle } from "@/types/letter-boxed";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/** Join a list into readable prose: "A, B and C". */
function listWords(words: string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** Per-puzzle FAQ — unique to this date. Archive visitors want the answer, so
 * the first item states the solution outright; the others stay descriptive. */
function buildFaq(
  puzzle: DecodedLetterBoxedPuzzle,
  dateLabel: string
): { question: string; answer: string }[] {
  const { wordCount, wordLengths } = puzzle.stats;
  const lengths = wordLengths.join(" and ");
  return [
    {
      question: `What is the NYT Letter Boxed answer for ${dateLabel}?`,
      answer: `The official New York Times Letter Boxed solution for ${dateLabel} is ${listWords(
        puzzle.solution
      )}. The two words chain together — the second word starts on the last letter of the first — and between them they use all twelve letters around the box.`,
    },
    {
      question: `How many words is the ${dateLabel} Letter Boxed solution?`,
      answer: `The official solution solves the box in ${wordCount} word${
        wordCount === 1 ? "" : "s"
      } (${lengths} letters). You can finish Letter Boxed in more words if you like, but the NYT always publishes a two-word "our solution" as the benchmark.`,
    },
    {
      question: "What are the letters in today's Letter Boxed box?",
      answer: `The box for ${dateLabel} has these twelve letters, three on each side: ${puzzle.sides.join(
        ", "
      )}. Consecutive letters in a word must come from different sides, and every letter has to be used at least once.`,
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getLetterBoxedPuzzleByDate(date);

  if (!puzzle) {
    return constructMetadata({
      page: "LetterBoxedAnswersDate",
      title: "Letter Boxed Answer Not Found",
      description: "This Letter Boxed puzzle was not found.",
      locale: locale as Locale,
      path: `/letter-boxed-answers/${date}`,
      canonicalUrl: `/letter-boxed-answers/${date}`,
    });
  }

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "LetterBoxedAnswersDate",
    title: `NYT Letter Boxed Answer — ${dateLabel}`,
    description: `Hints and the official two-word solution for the NYT Letter Boxed puzzle on ${dateLabel}. Spoiler-free nudges first, then the answer.`,
    keywords: [
      `letter boxed answer ${dateLabel.toLowerCase()}`,
      `nyt letter boxed ${date}`,
      "nyt letter boxed solution",
      "letter boxed two word solution",
    ],
    locale: locale as Locale,
    path: `/letter-boxed-answers/${date}`,
    canonicalUrl: `/letter-boxed-answers/${date}`,
  });
}

export default async function LetterBoxedAnswersDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getLetterBoxedPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const { prev, next } = await getAdjacentLetterBoxedPuzzles(date);
  const recentPuzzles = (await getRecentLetterBoxedPuzzles(7)).filter(
    (p) => p.printDate !== date
  );

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const shortDate = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hints = buildLetterBoxedHints(puzzle);
  const faqItems = buildFaq(puzzle, shortDate);

  const { wordCount, wordLengths } = puzzle.stats;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Letter Boxed Answers",
            url: `${BASE_URL}/letter-boxed-answers`,
          },
          { name: dateLabel, url: `${BASE_URL}/letter-boxed-answers/${date}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `NYT Letter Boxed Answer — ${dateLabel}`,
          description: `Hints and the official ${wordCount}-word solution for the NYT Letter Boxed puzzle on ${dateLabel}.`,
          url: `${BASE_URL}/letter-boxed-answers/${date}`,
          datePublished: puzzle.printDate,
          dateModified: puzzle.printDate,
        })}
      />
      <JsonLd data={faqPageSchema(faqItems)} />

      <ContentHero
        eyebrow="Letter Boxed"
        title={`NYT Letter Boxed Answer — ${dateLabel}`}
        description="Spoiler-free hints first, then the official two-word solution traced on the box."
      />

      <div className="mt-8 space-y-8">
        {/* Per-puzzle intro — unique to this date, no answer spoiler */}
        <ContentSection title={`About the ${shortDate} Letter Boxed`}>
          <BodyText>
            The New York Times Letter Boxed box for {dateLabel} carries twelve
            letters, three on each of its four sides:{" "}
            {puzzle.sides.join(", ")}. Your job is to chain words around the
            square using every letter at least once, with consecutive letters
            always coming from different sides and each new word starting on the
            last letter of the one before it.
          </BodyText>
          <BodyText>
            The official solution for this box uses {wordCount} word
            {wordCount === 1 ? "" : "s"} of {wordLengths.join(" and ")} letters.
            Start with the spoiler-free hints below — how many words, how long
            each one is, and which letters they begin on — and only open the
            answer board when you want to see the exact words. New to the game?
            Our{" "}
            <Link
              href="/letter-boxed-answers-today"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Letter Boxed how-to-play guide
            </Link>{" "}
            walks through the rules and strategy.
          </BodyText>
        </ContentSection>

        {/* Interactive box + progressive hints (client) */}
        <LetterBoxedPlay
          sides={puzzle.sides}
          solution={puzzle.solution}
          hints={hints}
        />

        {/* Server-rendered, crawlable answer board */}
        <LetterBoxedAnswerBoard
          solution={puzzle.solution}
          wordLengths={wordLengths}
          dateLabel={shortDate}
        />

        {/* Per-puzzle FAQ */}
        <ContentSection title={`${shortDate} Letter Boxed FAQ`}>
          <SimpleFaq items={faqItems} />
        </ContentSection>

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times. Letter Boxed is a
          trademark of The New York Times Company.
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          {prev ? (
            <Link
              href={`/letter-boxed-answers/${prev.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← {prev.printDate}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/letter-boxed-answers-today"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Today&apos;s Answer
          </Link>
          {next ? (
            <Link
              href={`/letter-boxed-answers/${next.printDate}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {next.printDate} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Recent puzzles — internal links */}
        {recentPuzzles.length > 0 && (
          <ContentSection title="Recent Letter Boxed Puzzles">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPuzzles.slice(0, 6).map((p) => (
                <LetterBoxedPuzzleCard key={p.printDate} puzzle={p} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/letter-boxed-answers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--strands-hint))]/40 hover:bg-[hsl(var(--strands-hint))]/5 hover:text-foreground"
              >
                Browse the full Letter Boxed archive →
              </Link>
            </div>
          </ContentSection>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/letter-boxed-answers"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-[hsl(var(--strands-hint))]/40 hover:text-foreground"
          >
            Full Archive
          </Link>
          <Link
            href="/minute-cryptic-today"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Today&apos;s Cryptic Clue
          </Link>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const puzzles = await getAllLetterBoxedPuzzles();
  const recent = puzzles.slice(0, 90);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
