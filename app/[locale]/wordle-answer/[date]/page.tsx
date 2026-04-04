import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordleHintCard from "@/components/wordle/WordleHintCard";
import WordleAnswerReveal from "@/components/wordle/WordleAnswerReveal";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  getWordlePuzzleByDate,
  getAdjacentWordlePuzzles,
  getAllWordlePuzzles,
} from "@/lib/wordle-data";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/* ------------------------------------------------------------------ */
/*  Auto-generated answer analysis                                     */
/* ------------------------------------------------------------------ */

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const COMMON_LETTERS = new Set([
  "E", "A", "R", "O", "T", "L", "I", "S", "N", "C",
]);

function analyzeWord(word: string) {
  const upper = word.toUpperCase();
  const letters = upper.split("");
  const vowelCount = letters.filter((l) => VOWELS.has(l)).length;
  const consonantCount = 5 - vowelCount;
  const uniqueLetters = new Set(letters).size;
  const hasDouble = uniqueLetters < 5;
  const doubleLetters = letters.filter(
    (l, i) => letters.indexOf(l) !== i
  );
  const commonCount = letters.filter((l) => COMMON_LETTERS.has(l)).length;
  const uncommonLetters = letters.filter((l) => !COMMON_LETTERS.has(l));

  let difficulty = "average";
  if (hasDouble && uncommonLetters.length >= 2) difficulty = "hard";
  else if (commonCount >= 4 && !hasDouble) difficulty = "easy";
  else if (uncommonLetters.length >= 3) difficulty = "hard";

  return {
    upper,
    letters,
    vowelCount,
    consonantCount,
    uniqueLetters,
    hasDouble,
    doubleLetters: [...new Set(doubleLetters)],
    commonCount,
    uncommonLetters,
    difficulty,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getWordlePuzzleByDate(date);
  if (!puzzle) return {};

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return constructMetadata({
    page: "WordleAnswer",
    title: `Wordle Answer and Hints — ${dateLabel} (#${puzzle.id})`,
    description: `Wordle #${puzzle.id} hints and answer for ${dateLabel}. Progressive hints from vague to specific.`,
    keywords: [
      `wordle answer ${date}`,
      `wordle ${puzzle.id}`,
      "wordle hints",
      "wordle answer",
    ],
    locale: locale as Locale,
    path: `/wordle-answer/${date}`,
    canonicalUrl: `/wordle-answer/${date}`,
  });
}

export default async function WordleDatePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getWordlePuzzleByDate(date);
  if (!puzzle) notFound();

  const { prev, next } = await getAdjacentWordlePuzzles(date);

  const dateLabel = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Read raw puzzle for encoded solution (fs to avoid bundling into Worker)
  const { readFileSync } = await import("fs");
  const { join } = await import("path");
  const rawData = JSON.parse(
    readFileSync(join(process.cwd(), "data", "wordle", "puzzles.json"), "utf8")
  );
  const rawPuzzle = (rawData.puzzles as { printDate: string; solution: string }[]).find(
    (p) => p.printDate === date
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Wordle Hints", url: `${BASE_URL}/wordle-answer-today` },
          { name: `#${puzzle.id}`, url: `${BASE_URL}/wordle-answer/${date}` },
        ])}
      />

      <ContentHero
        eyebrow="Wordle"
        title={`Wordle Answer and Hints — ${dateLabel}`}
        description={`Wordle #${puzzle.id}. Use the hints below before revealing the answer.`}
      />

      <div className="mt-8 space-y-8">
        <WordleHintCard
          hint1={puzzle.hint1}
          hint2={puzzle.hint2}
          hint3={puzzle.hint3}
        />

        {rawPuzzle && (
          <WordleAnswerReveal encodedSolution={rawPuzzle.solution} />
        )}

        {/* Answer analysis */}
        {(() => {
          const a = analyzeWord(puzzle.solution);
          return (
            <>
              <ContentSection
                title={`How to Solve Wordle #${puzzle.id}`}
                id="how-to-solve"
              >
                <SubHeading>Letter Breakdown</SubHeading>
                <BodyText>
                  Today&apos;s answer has {a.vowelCount} vowel{a.vowelCount !== 1 ? "s" : ""} and{" "}
                  {a.consonantCount} consonant{a.consonantCount !== 1 ? "s" : ""}.{" "}
                  {a.hasDouble
                    ? `It contains a double letter (${a.doubleLetters.join(", ")}), which makes it trickier since many players avoid guessing repeated letters early.`
                    : "All five letters are unique, so there are no repeated letters to trip you up."}{" "}
                  The word starts with {a.letters[0]} and ends with {a.letters[4]}.
                </BodyText>

                <SubHeading>Difficulty Rating</SubHeading>
                <BodyText>
                  {a.difficulty === "easy"
                    ? `This was a relatively easy Wordle. With ${a.commonCount} out of 5 letters being among the most frequent in English (E, A, R, O, T, L, I, S, N, C), most popular starting words would have uncovered several letters quickly.`
                    : a.difficulty === "hard"
                      ? `This was a tricky one. ${a.hasDouble ? "The double letter is easy to miss, " : ""}${a.uncommonLetters.length >= 2 ? `and the less common letters (${a.uncommonLetters.join(", ")}) are unlikely to appear in typical starting words.` : "and the letter combination is not immediately obvious."} Many players likely needed 4-5 guesses or more.`
                      : `This was a moderate-difficulty Wordle. ${a.commonCount >= 3 ? "Several common letters gave solvers a foothold, " : "A few uncommon letters made it challenging, "}but the overall word is familiar enough that most players could work it out in 3-4 guesses.`}
                </BodyText>

                <SubHeading>Solving Strategy</SubHeading>
                <BodyText>
                  A strong opening word like CRANE or SLATE would have revealed{" "}
                  {(() => {
                    const starters = "CRANE".split("");
                    const hits = starters.filter((l) =>
                      a.letters.includes(l)
                    );
                    return hits.length > 0
                      ? `${hits.length} letter${hits.length !== 1 ? "s" : ""} (${hits.join(", ")}) from this answer`
                      : "no direct hits, making a second guess with different common letters essential";
                  })()}
                  . From there,{" "}
                  {a.hasDouble
                    ? "the key challenge was recognising the repeated letter — once solvers suspected a double, the answer would click into place."
                    : "systematically placing green and yellow letters while eliminating greys would narrow it down within a few more guesses."}
                </BodyText>
              </ContentSection>

              <ContentSection
                title="Quick Stats"
                id="stats"
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Puzzle", value: `#${puzzle.id}` },
                    { label: "Letters", value: a.letters.join(" ") },
                    { label: "Vowels", value: String(a.vowelCount) },
                    {
                      label: "Double",
                      value: a.hasDouble ? a.doubleLetters.join(", ") : "None",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-card p-3 text-center"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-heading text-lg font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentSection>
            </>
          );
        })()}

        {/* Nav */}
        <div className="flex items-center justify-between text-sm">
          {prev ? (
            <Link
              href={`/wordle-answer/${prev.printDate}`}
              className="text-primary hover:underline"
            >
              ← #{prev.id}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/wordle-answer/${next.printDate}`}
              className="text-primary hover:underline"
            >
              #{next.id} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This site is not affiliated with The New York Times.
        </p>

        <RelatedLinks
          links={[
            {
              href: "/wordle-answer-today",
              title: "Today's Wordle",
              description: "Hints and answer for today's puzzle.",
            },
            {
              href: "/wordle-answer",
              title: "Wordle archive",
              description: "Browse all past Wordle answers.",
            },
            {
              href: "/connections-hint-today",
              title: "Connections hints",
              description: "Today's NYT Connections hints and answers.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const puzzles = await getAllWordlePuzzles();
  const recent = puzzles.slice(0, 30);
  const params: { locale: string; date: string }[] = [];
  for (const locale of LOCALES) {
    for (const puzzle of recent) {
      params.push({ locale, date: puzzle.printDate });
    }
  }
  return params;
}
