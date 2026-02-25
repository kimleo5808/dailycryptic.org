import UnlimitedGame from "@/components/minute-cryptic-unlimited/UnlimitedGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzlesForUnlimited } from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Infinity,
  Library,
  Lightbulb,
  RefreshCw,
  Shuffle,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const UNLIMITED_FAQ_ITEMS = [
  {
    question: "Is minute cryptic unlimited really free?",
    answer:
      "Yes. Minute cryptic unlimited is completely free to play. There are no paywalls, no sign-ups, and no limits on how many puzzles you can solve in a single session.",
  },
  {
    question:
      "How is minute cryptic unlimited different from the daily puzzle?",
    answer:
      "The daily puzzle gives you one new clue per day. Minute cryptic unlimited removes that restriction entirely — you can solve puzzle after puzzle without waiting. Both modes use the same clue quality and hint system.",
  },
  {
    question: "Does minute cryptic unlimited track my progress?",
    answer:
      "Yes. Your solve count, current streak, and best streak are saved locally in your browser. You can reset your progress at any time using the reset button in the stats bar.",
  },
  {
    question: "Will I see the same puzzles again in minute cryptic unlimited?",
    answer:
      "Minute cryptic unlimited prioritizes unsolved puzzles first. Once you have completed every available puzzle, it cycles back through the full library so you can practice again.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "MinuteCrypticUnlimited",
    title:
      "Minute Cryptic Unlimited — Free Unlimited Cryptic Puzzles Online",
    description:
      "Play minute cryptic unlimited for free. Solve unlimited cryptic clues online with progressive hints, full explanations, and progress tracking. No daily limit — practice as many minute cryptic puzzles as you want.",
    keywords: [
      "minute cryptic unlimited",
      "unlimited minute cryptic",
      "minute cryptic unlimited free",
      "minute cryptic unlimited online",
      "minute cryptic crossword unlimited",
      "past minute cryptics unlimited",
      "one minute cryptic unlimited",
      "cryptic minute unlimited",
      "minutecryptic unlimited",
      "minute cryptic puzzles",
      "free cryptic clues online",
    ],
    locale: locale as Locale,
    path: "/minute-cryptic-unlimited",
  });
}

export default async function MinuteCrypticUnlimitedPage() {
  const puzzles = await getAllPuzzlesForUnlimited();

  return (
    <div className="w-full">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Minute Cryptic Unlimited",
            url: `${BASE_URL}/minute-cryptic-unlimited`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(UNLIMITED_FAQ_ITEMS)} />

      {/* Hero game section */}
      <section className="w-full bg-[#b8d8fa] py-6 sm:py-8 lg:min-h-[calc(100svh-64px)] lg:py-4">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold text-slate-900 sm:text-5xl">
              Minute Cryptic Unlimited
            </h1>
            <p className="mt-3 text-base text-slate-700 sm:text-lg">
              Solve as many minute cryptic puzzles as you want. No daily limit —
              just pick a clue, solve it, and move to the next one.
            </p>
          </div>

          <div className="mt-4 flex-1">
            <UnlimitedGame puzzles={puzzles} />
          </div>
        </div>
      </section>

      {/* Section 1: What Is — white bg */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What Is Minute Cryptic Unlimited
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Minute cryptic unlimited is a free, browser-based mode that lets you
            solve cryptic clues without any daily restriction. The standard
            minute cryptic format delivers one puzzle per day, which is ideal
            for building a consistent habit. But when you want more practice or
            simply enjoy the challenge, minute cryptic unlimited opens the full
            puzzle library so you can play at your own pace.
          </p>

          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
            No Daily Limit
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Every puzzle in minute cryptic unlimited uses the same format you
            already know: a single cryptic clue, a letter grid, progressive
            hints, and a full explanation after you solve. The difference is
            simple — once you finish one clue, you tap Next Puzzle and a new
            minute cryptic unlimited clue appears immediately. There is no
            waiting, no countdown, and no cap on how many you can complete.
          </p>

          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
            Full Puzzle Library
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            This mode draws from the complete archive of published minute
            cryptic clues. That means you get a mix of anagrams, charades,
            containers, and double definitions across easy, medium, and hard
            difficulty levels. Minute cryptic unlimited is designed for anyone
            who wants to sharpen their solving skills faster than the one-a-day
            schedule allows.
          </p>
        </div>
      </section>

      {/* Section 2: How It Works — grey bg, 3-col cards */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            How Minute Cryptic Unlimited Works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <Shuffle className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Solve and Move On
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                When you load minute cryptic unlimited, a random unsolved puzzle
                is selected from the library. Read the clue, type your answer,
                and press Check. If correct, the explanation appears and you move
                to the next one. If not, try again or use hints.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Progressive Hints in Unlimited Mode
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Each minute cryptic unlimited puzzle has four hint levels that
                gradually narrow the solving path. Level one offers a general
                direction. Level four gives a strong pointer. You control how
                much help you receive, keeping the challenge intact.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <BookOpen className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Learn from Every Clue
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                After solving or revealing the answer, minute cryptic unlimited
                shows the full clue breakdown: the definition, the wordplay
                mechanism, and how the letters map to the answer. This feedback
                loop makes minute cryptic unlimited effective for learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Play — white bg, 2-col */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Why Play Minute Cryptic Unlimited
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Build Pattern Recognition Faster
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The daily minute cryptic is a great anchor habit, but one puzzle
                per day limits how fast you can improve. Minute cryptic unlimited
                removes that ceiling. Repetition across varied clue types is the
                fastest way to build pattern recognition. In minute cryptic
                unlimited, you encounter anagrams, charades, containers, and
                double definitions in random order, forcing genuine flexibility.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Warm Up Before Full Grids
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If you are preparing for a cryptic crossword competition or
                warming up before tackling a full grid, minute cryptic unlimited
                gives you the volume you need. Solve five or ten quick clues to
                get your brain into cryptic mode, then move to your main puzzle
                with sharper instincts. Minute cryptic unlimited is also useful
                for beginners who want to build confidence before attempting
                longer formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: vs Daily — grey bg, comparison cards */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Minute Cryptic Unlimited vs Daily Mode
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted-foreground">
            Both modes share the same puzzle quality, hint system, and
            explanation format. Think of the daily mode as your anchor and
            minute cryptic unlimited as your training ground.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/30 bg-card p-6">
              <div className="flex items-center gap-3">
                <Infinity className="h-7 w-7 text-primary" />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Minute Cryptic Unlimited
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  Solve as many puzzles as you want per session
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  Random puzzle selection from full library
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  Tracks total solves, current streak, and best streak
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  Ideal for focused practice and skill building
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  Free, no account required
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-7 w-7 text-muted-foreground" />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Daily Minute Cryptic
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  One new clue published each day
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  Builds a consistent daily solving habit
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  Same progressive hint system
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  Ideal for maintaining a lightweight routine
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  Free, no account required
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Tips — white bg, 4-col cards */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Tips for Minute Cryptic Unlimited Puzzles
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Each clue type in minute cryptic unlimited has its own logic. Here
            are quick pointers for the four main types you will encounter.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Anagrams
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Look for indicator words like &quot;mixed&quot;,
                &quot;broken&quot;, or &quot;arranged&quot;. Count the fodder
                letters carefully — every letter must be used exactly once in
                your minute cryptic unlimited answer.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Charades
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Split the clue into short chunks. Map each chunk to an
                abbreviation, synonym, or letter segment, then concatenate in
                reading order to form the minute cryptic unlimited answer.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Containers
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Find the outer and inner parts, then apply insertion order
                exactly as the clue signals. Position matters more than first
                impressions in minute cryptic unlimited container clues.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Double Definitions
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The clue contains two separate definitions for the same word.
                Identify where the clue splits and find a word that satisfies
                both meanings in your minute cryptic unlimited solve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Progress — grey bg */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Track Your Minute Cryptic Unlimited Progress
          </h2>

          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
            Solve Count and Streaks
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Minute cryptic unlimited tracks three metrics locally in your
            browser: total puzzles solved, your current consecutive correct
            streak, and your all-time best streak. These numbers appear in the
            stats bar above the puzzle area. Watching your streak grow is a
            simple motivator that keeps minute cryptic unlimited sessions
            focused and rewarding.
          </p>

          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
            Reset and Replay
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If you want a fresh start, the reset button clears your solved
            history and stats. This lets you replay the entire minute cryptic
            unlimited library from scratch. Revisiting clues you solved weeks
            ago is a strong way to test whether your pattern recognition has
            genuinely improved or whether you simply remembered the answer.
          </p>
        </div>
      </section>

      {/* Section 7: FAQ — white bg */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Minute Cryptic Unlimited FAQ
          </h2>
          <div className="mt-6 space-y-3">
            {UNLIMITED_FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="rounded-lg border border-border/80 bg-background p-3"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: CTA — blue bg */}
      <section className="bg-[#b8d8fa] py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            Start Playing Minute Cryptic Unlimited
          </h2>
          <p className="mt-4 text-slate-700">
            Use one hint if needed, check your answer, read the explanation, and
            then hit Next Puzzle. After five solves, you will already notice
            patterns repeating across clue types. That recognition is the core
            skill that minute cryptic unlimited builds.
          </p>
          <a
            href="#top"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowUp className="h-4 w-4" />
            Play Minute Cryptic Unlimited Now
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/minute-cryptic-today"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              Daily minute cryptic
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/minute-cryptic"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              Minute cryptic archive
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/how-to-play-minute-cryptic"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              How to solve cryptic clues
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
