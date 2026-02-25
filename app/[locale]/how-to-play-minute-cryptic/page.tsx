import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Lightbulb,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

type ClueTypeCard = {
  name: string;
  signal: string;
  approach: string;
};

const KEY_CONCEPTS = [
  {
    title: "Definition",
    label: "Meaning side",
    description:
      "Every minute cryptic clue contains a direct definition of the answer. In most clues, this definition appears near the beginning or end, so your first task is to test those boundaries instead of guessing from the full sentence.",
  },
  {
    title: "Wordplay",
    label: "Construction side",
    description:
      "The second part tells you how to construct the same answer through cryptic operations. This can involve reordering, insertion, deletion, containment, or charade assembly. A solve is valid only when this mechanism is explicit and reproducible.",
  },
  {
    title: "Enumeration",
    label: "Answer length",
    description:
      "Letter count is a hard technical constraint, not a soft hint. Good solvers apply enumeration early to reject weak candidates quickly. If the length does not fit, the answer is wrong, even if it looks semantically reasonable.",
  },
];

const CLUE_TYPES: ClueTypeCard[] = [
  {
    name: "Anagram",
    signal: "Words suggesting movement, disorder, or mixing.",
    approach:
      "Identify fodder letters, confirm count, and rebuild into one candidate that also matches the definition.",
  },
  {
    name: "Charade",
    signal: "Short components that combine in sequence.",
    approach:
      "Break the clue into chunks, map each to abbreviation or synonym, and join in the exact given order.",
  },
  {
    name: "Container",
    signal: "Indicators like in, around, holding, inside.",
    approach:
      "Find outer shell and inserted unit first, then test placement. Order errors cause most misses here.",
  },
  {
    name: "Reversal",
    signal: "Back, returned, reversed, reflected, up (in downs).",
    approach:
      "Generate base string, reverse it once, then validate both length and definition before committing.",
  },
  {
    name: "Hidden Word",
    signal: "Part of, found in, some of, contained in.",
    approach:
      "Scan clue text for contiguous letter runs that match enumeration and definition simultaneously.",
  },
  {
    name: "Double Definition",
    signal: "Two meanings with no heavy operation markers.",
    approach:
      "Require both definitions to be fair and independent. If one feels forced, keep searching.",
  },
];

const COMMON_MISTAKES = [
  {
    title: "Surface-first guessing",
    description:
      "Reading clue surface as plain prose and entering the first plausible word. Correction: identify definition and operation words before any answer attempt.",
  },
  {
    title: "Skipping letter discipline",
    description:
      "Accepting candidates that fail enumeration by one letter. Correction: treat count mismatch as immediate disqualification.",
  },
  {
    title: "Partial parse confidence",
    description:
      "Finding one convincing segment and assuming the rest. Correction: force full parse accountability for every letter.",
  },
  {
    title: "Early deep-hint reveal",
    description:
      "Opening multiple hint levels at once. Correction: reveal one level, retry immediately, then escalate only if still blocked.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is minute cryptic in practical terms?",
    answer:
      "Minute cryptic is a one-clue daily cryptic format. You solve one clue with optional progressive hints, check your answer, and review explanation so each session stays short but educational.",
  },
  {
    question: "How should beginners use hints without losing challenge?",
    answer:
      "Use a two-attempt rule before revealing any hint. Then reveal one level only, retry, and continue gradually. This keeps reasoning active and prevents passive reveal behavior.",
  },
  {
    question: "What does par mean in minute cryptic discussions?",
    answer:
      "Par is a benchmark idea for pace or expected resistance in a format, not a fixed rule. Use it for self-tracking trend, not as a strict success threshold.",
  },
  {
    question: "How can I improve if I solve slowly?",
    answer:
      "Prioritize parse accuracy first. Log one repeated mistake per day, then do a short archive block of two to five clues. Consistent correction improves speed naturally.",
  },
  {
    question: "Where should I practice after reading this guide?",
    answer:
      "Start with today's clue, then continue in the archive by date. Combine solve-attempt, hint discipline, and explanation review for fastest compounding progress.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowToPlay" });

  return constructMetadata({
    page: "HowToPlay",
    title: t("title"),
    description: t("description"),
    keywords: [
      "how to solve minute cryptic",
      "how to play minute cryptic",
      "what is minute cryptic",
      "minute cryptic guide",
      "minute cryptic hints",
      "what does par mean in minute cryptic",
      "cryptic clue rules",
      "cryptic clue strategy",
      "dailycryptic help",
    ],
    locale: locale as Locale,
    path: `/how-to-play-minute-cryptic`,
    canonicalUrl: `/how-to-play-minute-cryptic`,
  });
}

export default async function HowToPlayPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "How to Solve",
            url: `${BASE_URL}/how-to-play-minute-cryptic`,
          },
        ])}
      />
      <JsonLd
        data={howToSchema(
          "How to Solve Minute Cryptic",
          "A practical system for solving minute cryptic clues using definition-first parsing, indicator detection, letter discipline, and structured hint usage.",
          [
            {
              name: "Find likely definition boundaries",
              text: "Check clue start and clue end first; one side usually contains direct meaning.",
            },
            {
              name: "Tag indicator language",
              text: "Mark words that signal operations such as anagram, insertion, reversal, or deletion.",
            },
            {
              name: "Generate mechanism candidates",
              text: "Build one to three candidate answers from the cryptic operation, not from guesswork.",
            },
            {
              name: "Filter by enumeration immediately",
              text: "Reject all candidates that do not match letter count before deeper validation.",
            },
            {
              name: "Confirm definition fit",
              text: "Keep only candidates that read as fair definition matches.",
            },
            {
              name: "Use progressive hints with control",
              text: "Reveal one hint level at a time and re-attempt after each reveal.",
            },
            {
              name: "Review explanation for transfer",
              text: "After solving, compare your parse with official explanation and log one correction point.",
            },
          ]
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Guide</span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            How to Solve Minute Cryptic
          </h1>
          <p className="mt-2 text-muted-foreground">
            Learn a repeatable daily cryptic method that works under time
            pressure: parse cleanly, use hints with discipline, and improve with
            short daily practice.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            What Is Minute Cryptic and Why This Format Works
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Minute cryptic is a one-clue format designed for focused daily
            training. You are not solving a full crossword grid. You are solving
            one clue deeply: identify definition, parse mechanism, verify answer,
            and learn from explanation. This smaller structure is a feature, not
            a limitation. It reduces friction for beginners while preserving the
            exact skills that make cryptic solving transferable: indicator
            recognition, letter accounting, and proof-based validation. Many
            users search for how to play minute cryptic because traditional
            crossword tutorials feel too broad. This guide narrows the scope to
            the actions that produce reliable progress in short sessions.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The key advantage of the daily clue model is feedback density. You
            can run complete solve cycles quickly: attempt, hint if needed,
            check, review. Repeating that cycle daily creates pattern memory much
            faster than occasional long sessions. If your goal is to solve
            minute cryptic today with confidence and also improve over time, the
            strategy is consistent process, not random volume.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Seven-Step Solve Workflow
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              1. Scan the clue once for plain meaning, then once for structure.
            </li>
            <li>
              2. Mark likely definition candidates at clue boundaries.
            </li>
            <li>
              3. Identify operation words that act as mechanism indicators.
            </li>
            <li>
              4. Build one to three candidates from wordplay instructions.
            </li>
            <li>5. Apply enumeration as a hard filter before further effort.</li>
            <li>
              6. Confirm both sides: definition fit and mechanism fit.
            </li>
            <li>
              7. If blocked, reveal one hint level only, then retry immediately.
            </li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This workflow is intentionally strict. Cryptic clues reward coherent
            reasoning, not lucky intuition. If you apply the same seven steps
            across daily clues, speed improves naturally because your parse
            decisions become predictable and testable.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Brain className="h-5 w-5 text-primary" />
            Core Concepts You Must Internalize
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-1">
            {KEY_CONCEPTS.map((concept) => (
              <div key={concept.title} className="rounded-xl border border-border p-4">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {concept.title} - {concept.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            If you remember only one rule from this page, use this: an answer is
            solved only when definition and wordplay independently point to the
            same result with correct enumeration. That single standard eliminates
            most false positives.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Clue Anatomy and Type Recognition
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Pattern recognition is the fastest acceleration path for minute
            cryptic solvers. You do not need to memorize thousands of words
            first. You need to map recurring structural patterns to reliable
            actions. Below are core clue families and the most useful no-spoiler
            handling strategy for each one.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {CLUE_TYPES.map((type) => (
              <div
                key={type.name}
                className="rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground">{type.name}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Signal
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{type.signal}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Approach
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {type.approach}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Search className="h-5 w-5 text-primary" />
            Indicator Cheat Sheet and Parse Discipline
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Indicator language is operational language. Build a compact personal
            dictionary over time. For anagrams, watch for words like mixed,
            broken, wild, or scrambled. For containment, watch in, around,
            holding, about. For reversal, look for back, returned, reversed.
            For deletion, note without, dropping, losing, no. For hidden words,
            scan phrases like in, part of, found in. Do not treat indicators as
            decorative vocabulary. Treat them as instructions you can execute.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A disciplined parse loop is simple: identify indicator, isolate
            fodder, perform operation once, check count, check definition. If
            any step is weak, reset. This prevents over-attachment to elegant
            but incorrect guesses and keeps your solving process stable across
            clue types.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Target className="h-5 w-5 text-primary" />
            What Does “Par” Mean in Minute Cryptic?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Par is best treated as a reference pace, not a strict pass-fail
            standard. It helps compare your own trend over time. If you are
            above par today, that usually means this clue type or mechanism is a
            current learning edge, not that you failed. If you are below par,
            confirm that your parse quality stayed clean and you did not skip
            verification just to move quickly. In practical training, par is
            useful only when paired with quality signals: number of hints used,
            parse completeness, and post-solve confidence.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Use par to calibrate sessions, not to pressure them. Your strongest
            long-term metric is consistency: daily solve attempts with controlled
            hint usage and clear explanation review.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            Common Mistakes and Fast Fixes
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {COMMON_MISTAKES.map((item) => (
              <div key={item.title} className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The reason these corrections work is that they reduce variance. You
            shift from emotional guessing to procedural solving. Over two weeks,
            that shift usually improves both speed and confidence.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Seven-Day Practice Plan
          </h2>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Day 1: Solve one clue with no hints; review full explanation.</li>
            <li>Day 2: Solve one clue and log one indicator word you learned.</li>
            <li>Day 3: Solve one clue plus one archive clue of a different type.</li>
            <li>Day 4: Use one-hint-only policy and track whether solve improves.</li>
            <li>Day 5: Focus on enumeration discipline and eliminate count misses.</li>
            <li>Day 6: Compare two clue types and note your weaker parse step.</li>
            <li>Day 7: Run a three-clue mini block and summarize one key pattern.</li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This plan is short by design. Sustainable volume beats occasional
            intensity. For most users, five to fifteen minutes daily is enough
            to create measurable progress if method quality stays high.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="rounded-lg border border-border/80 bg-background p-3"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground sm:p-8">
          <h2 className="font-heading text-2xl font-bold">Ready to practice?</h2>
          <p className="mt-2 opacity-90">
            Apply this workflow on today&apos;s clue, then reinforce with short
            archive blocks.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/minute-cryptic-today"
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-white/90"
            >
              Minute Cryptic Today
            </Link>
            <Link
              href="/minute-cryptic"
              className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Browse the Minute Cryptic Archive
            </Link>
            <Link
              href="/minute-cryptic-faq"
              className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              FAQ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
