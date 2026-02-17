import MinuteCrypticHeroGame from "@/components/home/MinuteCrypticHeroGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getLatestMinuteCryptic,
  getRecentMinuteCryptics,
} from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

type ClueTypeGuide = {
  label: string;
  noSpoilerPattern: string;
  commonMiss: string;
  practiceFocus: string;
};

const TODAY_FAQ_ITEMS = [
  {
    question: "Where can I find minute cryptic answer today?",
    answer:
      "Solve in the game panel first, then use hints and check. If you need review later, this date's archive detail page stores the full explanation.",
  },
  {
    question: "What does today's difficulty label actually mean?",
    answer:
      "It is a pacing label based on clue construction profile, not a promise of universal solve time. Use it as guidance, not as a strict benchmark.",
  },
  {
    question: "Should I reveal all hints when I am stuck?",
    answer:
      "Usually no. Reveal one level, retry, and only continue if parse is still blocked. This keeps challenge intact while still giving targeted support.",
  },
  {
    question: "What should I do after solving today's clue?",
    answer:
      "Practice two archive entries of mixed type and compare your parse quality. Short post-solve repetition is the fastest path to reliable daily cryptic improvement.",
  },
];

function getClueTypeGuide(clueType: string): ClueTypeGuide {
  const normalized = clueType.trim().toLowerCase();

  if (normalized.includes("anagram")) {
    return {
      label: "Anagram",
      noSpoilerPattern:
        "Look for an indicator word that signals movement, disorder, or rearrangement, then test whether the fodder letters can be rebuilt into a valid answer that matches the definition.",
      commonMiss:
        "Many solvers pick a plausible word from the letter pool but skip definition validation, which creates near-miss answers that look right but fail clue fairness.",
      practiceFocus:
        "Practice exact letter accounting: every letter in the candidate answer must come from the stated fodder, no extras and no missing characters.",
    };
  }

  if (normalized.includes("container")) {
    return {
      label: "Container",
      noSpoilerPattern:
        "Find outer and inner parts first, then apply insertion order exactly as the clue signals; position usually matters more than first impressions.",
      commonMiss:
        "A frequent mistake is placing the right pieces in the wrong order, producing a word that almost fits but breaks the stated containment logic.",
      practiceFocus:
        "Read containment indicators literally and rebuild the full string step by step before checking meaning.",
    };
  }

  if (normalized.includes("charade")) {
    return {
      label: "Charade",
      noSpoilerPattern:
        "Split the clue into short chunks and map each chunk to an abbreviation, synonym, or letter segment, then concatenate in order.",
      commonMiss:
        "Solvers often find one strong segment and guess the rest, which leads to answers that pass surface sense but fail parse completeness.",
      practiceFocus:
        "Write part-by-part assembly notes; charades reward disciplined segmentation and final full-string verification.",
    };
  }

  if (normalized.includes("double")) {
    return {
      label: "Double Definition",
      noSpoilerPattern:
        "Treat the clue as two definitions pointing to one answer, and require both senses to be fair and independently defensible.",
      commonMiss:
        "Most misses happen when one definition is accepted quickly while the second is forced after the fact.",
      practiceFocus:
        "Pause until you can restate both meanings cleanly; if one side remains vague, keep searching.",
    };
  }

  return {
    label: clueType || "Cryptic",
    noSpoilerPattern:
      "Identify the likely definition boundary first, then parse the remaining text as explicit wordplay instructions.",
    commonMiss:
      "The most common error is committing to a guessed answer before proving both definition and mechanism.",
    practiceFocus:
      "Run a two-check protocol: semantic fit plus mechanical fit, then submit.",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getLatestMinuteCryptic();
  const dateStr = puzzle
    ? dayjs(puzzle.printDate).format("MMMM D, YYYY")
    : "Today";

  return constructMetadata({
    page: "MinuteCrypticToday",
    title: `Minute Cryptic Today - Daily Cryptic Clue for ${dateStr}`,
    description:
      "Solve today's minute cryptic in a daily cryptic format with progressive hints and instant answer checks.",
    keywords: [
      "minute cryptic today",
      "daily cryptic",
      "daily cryptic today",
      "daily cryptic clue",
      "cryptic clue hints",
      "dailycryptic",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic-today`,
    canonicalUrl: `/minute-cryptic-today`,
  });
}

export default async function MinuteCrypticTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getLatestMinuteCryptic();
  const recentPuzzles = await getRecentMinuteCryptics(7);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">No Clue Available</h1>
        <p className="mt-4 text-muted-foreground">
          Today&apos;s minute cryptic clue has not been published yet.
        </p>
      </div>
    );
  }

  const dateLabel = dayjs(puzzle.printDate).format("dddd, MMMM D, YYYY");
  const clueTypeGuide = getClueTypeGuide(puzzle.clueType);
  const answerLength = puzzle.answer.replace(/[^A-Za-z]/g, "").length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Minute Cryptic Today",
            url: `${BASE_URL}/minute-cryptic-today`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(TODAY_FAQ_ITEMS)} />

      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Minute Cryptic Today
        </h1>
        <p className="mt-2 text-muted-foreground">
          Solve today&apos;s daily cryptic clue, reveal hints only when needed,
          and check your answer instantly.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        <MinuteCrypticHeroGame
          clue={puzzle.clue}
          answer={puzzle.answer}
          dateLabel={dateLabel}
          printDate={puzzle.printDate}
          hints={puzzle.hintLevels}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Clue Breakdown
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Type: {puzzle.clueType} | Difficulty: {puzzle.difficulty}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {puzzle.explanation}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Recent clues
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentPuzzles
            .filter((p) => p.printDate !== puzzle.printDate)
            .slice(0, 6)
            .map((p) => (
              <Link
                key={p.id}
                href={`/minute-cryptic/${p.printDate}`}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {dayjs(p.printDate).format("MMM D, YYYY")}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  #{p.id} | {p.clueType}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {p.clue}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open clue
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Minute Cryptic Deep Guide
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This page is designed to do more than show a single daily cryptic
          clue. The goal is to help you solve minute cryptic today with a
          repeatable method that improves long-term accuracy. You can play first
          in the game panel above, reveal hints only when needed, and then use
          the guidance below to understand why the clue works. That sequence is
          important: attempt first, analyze second. It protects challenge while
          still building skill. For many solvers, this format is the fastest way
          to move from guess-based solving to evidence-based solving. If you are
          searching for minute cryptic today, daily cryptic clue today, or how
          to solve minute cryptic without spoilers, this section is written for
          exactly that intent.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          How To Approach Today&apos;s Clue (No Spoilers)
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Start by marking likely definition territory. In most cryptic clues,
          the definition is at the beginning or end. Next, isolate possible
          operation language in the remaining words. Ask what the clue is asking
          you to do: rearrange, insert, join, reverse, select, or reinterpret.
          Before typing any answer, confirm length discipline. Today&apos;s clue
          targets {answerLength} letters, so every candidate must satisfy that
          hard constraint immediately. This one rule filters many false starts.
          Then check for dual validity. A strong minute cryptic answer should
          satisfy definition and wordplay independently, not only by vague
          surface meaning. If one side is weak, continue searching. The fastest
          improvement does not come from speed alone; it comes from clean proof.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          For today specifically, treat the clue type as{" "}
          <span className="font-semibold text-foreground">
            {clueTypeGuide.label}
          </span>
          . A no-spoiler parse pattern that fits this type is:{" "}
          {clueTypeGuide.noSpoilerPattern} Keep your first attempt conservative.
          If uncertain, reveal only one hint level and retry immediately. Do not
          jump to full reveal. Progressive hint use keeps your reasoning active
          and makes each solve transferable to the next daily clue.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          Clue Anatomy for {dateLabel}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every minute cryptic clue can be understood as two cooperating parts:
          a definition layer and a construction layer. The definition tells you
          what the answer means. The construction layer tells you how to build
          the answer. Many solving errors come from blending these roles too
          early. A better workflow is to separate them on paper or mentally.
          First propose a small set of definition targets. Then parse the rest
          for mechanism signals. In daily cryptic solving, this separation gives
          you a reliable fallback when intuition fails. If you cannot parse the
          full mechanism yet, do not discard structure. Hold candidate fragments
          and continue testing. In most cases, structure eventually resolves the
          ambiguity.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Today&apos;s clue metadata provides useful context: type{" "}
          <span className="font-semibold text-foreground">{puzzle.clueType}</span>,
          difficulty{" "}
          <span className="font-semibold text-foreground">
            {puzzle.difficulty}
          </span>
          , and clear explanation after attempt. Use that explanation as a
          calibration tool, not as a shortcut. Compare your own parse with the
          published parse and identify where your logic diverged. Was the miss in
          definition targeting, operation detection, letter accounting, or order
          control? Recording that one miss category is enough to improve your
          next solve. Over a week of daily practice, this small review loop
          produces noticeable gains in consistency.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          What This Clue Type Teaches
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Today&apos;s clue type is ideal for training one high-value habit:{" "}
          {clueTypeGuide.practiceFocus} Solvers who plateau usually know many
          clue patterns but apply them inconsistently under time pressure. The
          fix is not more theory volume. The fix is a short, repeatable quality
          check before submission. Run this checklist: definition fit, length
          fit, operation fit, and final spelling fit. If all four are true, you
          submit. If one is uncertain, you continue parsing. This discipline is
          what turns random wins into stable performance on minute cryptic today
          and future archive clues.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A common miss pattern for this clue type is straightforward:{" "}
          {clueTypeGuide.commonMiss} You can prevent this by writing two short
          proof statements after solving: one sentence for definition, one
          sentence for wordplay. If either sentence feels forced, revisit before
          final check. This extra twenty seconds is usually enough to avoid most
          near misses.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          Difficulty, Par, and Hint Strategy
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Difficulty labels should be treated as pacing guidance, not absolute
          truth. A clue marked medium can still feel hard if it uses a mechanism
          you are currently learning. Likewise, a hard clue may become fast once
          you recognize its structure family. Par language is similar: it helps
          benchmark solving rhythm, but your primary goal should be clean parse
          quality. If you need hints, use them in layers. Level one should shift
          direction, not reveal answer shape. Level two should clarify
          mechanism. Level three should narrow structural options. Level four can
          provide targeted rescue. This sequence keeps the puzzle educational and
          still respects user time.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          On dailycryptic, hints are intentionally progressive so you can stay in
          control of spoiler depth. A practical policy is: two independent parse
          attempts, then one hint reveal, then immediate retry. Avoid opening
          multiple hint levels in one step. The reason is simple: stacking hints
          quickly moves you from solving to reading. Keeping a short retry cycle
          preserves learning value and improves retention across daily cryptic
          sessions.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          Common Mistakes and Quick Corrections
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Mistake one: solving from surface story only. Correction: force a
          mechanism hypothesis before final answer. Mistake two: ignoring letter
          count under confidence pressure. Correction: reject any candidate that
          violates {answerLength}-letter enumeration. Mistake three: accepting
          partial parse because definition feels close. Correction: require full
          parse accountability. Mistake four: using hints as immediate reveal.
          Correction: one-level reveal policy, followed by instant re-attempt.
          These are small habits, but they create large reliability differences
          over time. When users ask how to improve at minute cryptic today, this
          is usually the highest return set of adjustments.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          Five-Minute Practice Plan After Today&apos;s Solve
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          After you complete today&apos;s clue, open two recent archive clues and
          run the same process: first attempt, one-level hint if needed, then
          explanation review. Keep a brief log with one line per clue: solved or
          not solved, clue type, and main error category. You do not need a full
          study journal. A light process is enough if repeated daily. This is
          the reason archive continuity matters: improvement comes from pattern
          repetition, not isolated wins. If you want structured help, continue to
          the{" "}
          <Link
            href="/how-to-play-minute-cryptic"
            className="font-semibold text-primary hover:text-primary/80"
          >
            How to Play guide
          </Link>{" "}
          and the{" "}
          <Link
            href="/minute-cryptic-faq"
            className="font-semibold text-primary hover:text-primary/80"
          >
            FAQ
          </Link>
          . For extra volume, use the{" "}
          <Link
            href="/minute-cryptic"
            className="font-semibold text-primary hover:text-primary/80"
          >
            archive
          </Link>{" "}
          to practice by date.
        </p>

        <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
          FAQ for Today&apos;s Puzzle
        </h3>
        <div className="mt-4 space-y-3">
          <details className="rounded-lg border border-border/80 bg-background p-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              Where can I find minute cryptic answer today?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Solve in the game panel first, then use hints and check. If you
              need review later, this date&apos;s archive detail page stores the
              full explanation.
            </p>
          </details>
          <details className="rounded-lg border border-border/80 bg-background p-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              What does today&apos;s difficulty label actually mean?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              It is a pacing label based on clue construction profile, not a
              promise of universal solve time. Use it as guidance, not as a
              strict benchmark.
            </p>
          </details>
          <details className="rounded-lg border border-border/80 bg-background p-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              Should I reveal all hints when I am stuck?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Usually no. Reveal one level, retry, and only continue if parse is
              still blocked. This keeps challenge intact while still giving
              targeted support.
            </p>
          </details>
          <details className="rounded-lg border border-border/80 bg-background p-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              What should I do after solving today&apos;s clue?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice two archive entries of mixed type and compare your parse
              quality. Short post-solve repetition is the fastest path to
              reliable daily cryptic improvement.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
