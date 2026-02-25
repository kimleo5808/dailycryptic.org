import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getLatestMinuteCryptic,
  getRecentMinuteCryptics,
  getMinuteCrypticCount,
} from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Infinity,
  Lightbulb,
  MessageCircleQuestion,
  Puzzle,
  Repeat,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "What is a daily cryptic crossword?",
    answer:
      "A daily cryptic crossword is a word puzzle published every day that uses wordplay, double meanings, and hidden patterns instead of straightforward definitions. Our daily cryptic format focuses on one clue at a time, making it faster and more accessible than a full cryptic crossword grid.",
  },
  {
    question: "How do daily cryptic crosswords work?",
    answer:
      "Each daily cryptic clue contains two parts: a straight definition and a wordplay element. You decode the wordplay — which might be an anagram, charade, container, or reversal — to find the answer. Our daily cryptic includes progressive hints so you can get targeted help without spoiling the full solution.",
  },
  {
    question: "Is the daily cryptic free to play?",
    answer:
      "Yes. Every daily cryptic clue on DailyCryptic is completely free. There is no paywall, no subscription, and no account required. Just visit the site and start solving.",
  },
  {
    question: "What time is the daily cryptic published?",
    answer:
      "A new daily cryptic clue is published every day at midnight UTC. You can solve it anytime during the day, and previous clues remain available in the archive.",
  },
  {
    question: "Can I play past daily cryptic puzzles?",
    answer:
      "Absolutely. The full daily cryptic archive is available for free. You can browse by date, filter by clue type, and practice as many past puzzles as you like. There is also an unlimited mode for continuous practice.",
  },
  {
    question: "Is the daily cryptic suitable for beginners?",
    answer:
      "Yes. Our daily cryptic is designed for all skill levels. Each clue includes a difficulty label and up to four progressive hints. Beginners can start with easy clues and use hints freely, while experienced solvers can attempt harder clues without assistance.",
  },
  {
    question: "How is a daily cryptic different from a full cryptic crossword?",
    answer:
      "A full cryptic crossword typically has 15×15 grid with 28+ clues and takes 30–60 minutes. Our daily cryptic focuses on a single clue that takes 1–2 minutes. This micro-format lets you build cryptic solving skills through short, consistent daily practice.",
  },
  {
    question: "Where can I find the best daily cryptic crossword online?",
    answer:
      "DailyCryptic offers a free daily cryptic crossword clue with progressive hints, full explanations, and a complete archive. It is designed specifically for focused daily practice — one clue at a time, with tools to help you learn and improve.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    page: "DailyCryptic",
    title:
      "Daily Cryptic — Free Daily Cryptic Crossword Clue & Puzzle | DailyCryptic",
    description:
      "Play a free daily cryptic crossword clue with hints and full explanations. The best daily cryptic puzzle for beginners and experts. No signup, solve now.",
    keywords: [
      "daily cryptic",
      "daily cryptic crossword",
      "cryptic crossword daily",
      "cryptic daily",
      "daily cryptic puzzle",
      "daily cryptics",
      "daily quick cryptic",
      "best daily cryptic crossword",
      "easy cryptic crossword",
      "cryptic crossword puzzles online",
      "cryptic crosswords for beginners",
      "free daily cryptic",
      "daily cryptic clue",
      "cryptic clue today",
    ],
    locale: locale as Locale,
    path: "/daily-cryptic",
  });
}

export default async function DailyCrypticPage() {
  const latest = await getLatestMinuteCryptic();
  const recentPuzzles = await getRecentMinuteCryptics(10);
  const totalCount = await getMinuteCrypticCount();

  return (
    <div className="w-full">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Daily Cryptic", url: `${BASE_URL}/daily-cryptic` },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* ============ Section 1: Hero ============ */}
      <section className="w-full bg-[#b8d8fa] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Free &middot; No signup &middot; Updated every day
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
            Daily Cryptic — A Free Cryptic Crossword Clue Every Day
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-700 sm:text-xl">
            Sharpen your cryptic crossword skills with one focused daily cryptic
            clue. Progressive hints, instant answer checks, and full
            explanations — all completely free.
          </p>

          {latest && (
            <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-white/50 bg-white/70 p-5 shadow-md backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Today&apos;s Daily Cryptic
              </p>
              <p className="mt-2 font-heading text-lg font-bold text-slate-900 sm:text-xl">
                &ldquo;{latest.clue}&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                  {latest.clueType}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
                  {latest.difficulty}
                </span>
              </div>
              <Link
                href="/minute-cryptic-today"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.97]"
              >
                Solve Today&apos;s Clue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ Section 2: Three Entry Cards ============ */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <Link
              href="/minute-cryptic-today"
              className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                Today&apos;s Daily Cryptic
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Solve the latest daily cryptic clue with hints and a full
                explanation.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
                Play now <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/minute-cryptic"
              className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                Daily Cryptic Archive
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Browse {totalCount}+ past daily cryptic puzzles sorted by date
                and clue type.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
                Browse archive <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/minute-cryptic-unlimited"
              className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Infinity className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                Unlimited Cryptic Puzzles
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                No daily limit — solve cryptic crossword puzzles online at your
                own pace.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
                Start solving <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Section 3: What Is a Daily Cryptic? ============ */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What Is a Daily Cryptic?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A daily cryptic is a cryptic crossword clue published once every
            day. Unlike a traditional full-grid cryptic crossword that can take
            30 to 60 minutes, a daily cryptic focuses on a single clue you can
            solve in one to two minutes. This micro-format makes cryptic
            crossword practice accessible to anyone — whether you are a
            complete beginner or an experienced solver looking for a quick daily
            challenge.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                <Puzzle className="h-5 w-5 text-primary" />
                One Clue, One Solve
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Each daily cryptic presents a single cryptic clue with a
                definition component and a wordplay component. You parse the
                wordplay, confirm against the definition, and type your answer.
                It is the fastest way to build cryptic crossword fluency.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Built for Daily Practice
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Consistency beats intensity. Solving one daily cryptic clue
                every day trains pattern recognition across anagrams, charades,
                containers, and more. Over weeks, you will notice clue types
                faster and parse wordplay with less effort.
              </p>
            </div>
          </div>

          <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
            Daily Cryptic vs. Full Cryptic Crossword
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-6 font-semibold text-foreground">Feature</th>
                  <th className="pb-3 pr-6 font-semibold text-foreground">Daily Cryptic</th>
                  <th className="pb-3 font-semibold text-foreground">Full Cryptic Crossword</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-6 font-medium text-foreground">Clues per session</td>
                  <td className="py-3 pr-6">1 focused clue</td>
                  <td className="py-3">28+ interlocking clues</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-6 font-medium text-foreground">Time required</td>
                  <td className="py-3 pr-6">1–2 minutes</td>
                  <td className="py-3">30–60 minutes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-6 font-medium text-foreground">Hints available</td>
                  <td className="py-3 pr-6">4-level progressive hints</td>
                  <td className="py-3">Usually none</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-6 font-medium text-foreground">Explanation</td>
                  <td className="py-3 pr-6">Full breakdown after solve</td>
                  <td className="py-3">Rarely provided</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-medium text-foreground">Best for</td>
                  <td className="py-3 pr-6">Daily habit, skill building</td>
                  <td className="py-3">Extended challenge sessions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ Section 4: How Our Daily Cryptic Works ============ */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            How Our Daily Cryptic Crossword Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Four simple steps from clue to comprehension. Every daily cryptic
            puzzle follows the same flow so you can focus on solving, not
            figuring out the interface.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative rounded-xl border border-border bg-background p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700">
                1
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                Read the Clue
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                A new daily cryptic clue appears every day at midnight UTC.
                Read it carefully — the definition hides in plain sight.
              </p>
            </div>

            <div className="relative rounded-xl border border-border bg-background p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                2
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                Use Hints If Needed
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Stuck? Reveal progressive hints one level at a time. Start
                broad and get more specific — perfect for easy cryptic
                crossword practice.
              </p>
            </div>

            <div className="relative rounded-xl border border-border bg-background p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                3
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                Submit Your Answer
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Type your answer into the letter grid and check instantly.
                Correct answers light up green — wrong guesses let you retry.
              </p>
            </div>

            <div className="relative rounded-xl border border-border bg-background p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                4
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                Learn the Breakdown
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Every daily cryptic crossword clue includes a full explanation
                showing how the definition and wordplay combine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Section 5: Clue Types ============ */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Daily Cryptic Clue Types You&apos;ll Encounter
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every daily cryptic puzzle uses one of these core wordplay
            techniques. Learning to spot them is the key to solving cryptic
            crossword clues quickly and confidently.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Repeat,
                name: "Anagram",
                color: "bg-rose-100 text-rose-600",
                desc: "Letters of a word or phrase are rearranged. Look for indicator words like \"mixed\", \"broken\", or \"wild\".",
                example: "\"Wild cat\" → ACT",
              },
              {
                icon: ArrowRight,
                name: "Charade",
                color: "bg-sky-100 text-sky-600",
                desc: "Parts are joined in sequence. Each piece of the clue gives a fragment of the answer.",
                example: "\"Air + mail\" → AIRMAIL",
              },
              {
                icon: Target,
                name: "Container",
                color: "bg-amber-100 text-amber-600",
                desc: "One word is placed inside another. Indicators include \"within\", \"around\", or \"holding\".",
                example: "\"P(art)Y\" → PARTY",
              },
              {
                icon: Search,
                name: "Hidden Word",
                color: "bg-emerald-100 text-emerald-600",
                desc: "The answer is hidden inside the clue text itself. Look for \"in\", \"part of\", or \"some\".",
                example: "\"resiDENTal\" → DENT",
              },
              {
                icon: Zap,
                name: "Double Definition",
                color: "bg-violet-100 text-violet-600",
                desc: "Two separate definitions for the same word sit side by side in the clue.",
                example: "\"Spring flower\" → ROSE",
              },
              {
                icon: Repeat,
                name: "Reversal",
                color: "bg-pink-100 text-pink-600",
                desc: "A word is spelled backwards. Indicators include \"back\", \"returned\", or \"up\" (in down clues).",
                example: "\"Pot returned\" → TOP",
              },
              {
                icon: MessageCircleQuestion,
                name: "Homophone",
                color: "bg-teal-100 text-teal-600",
                desc: "The answer sounds like another word. Indicators include \"heard\", \"say\", or \"on the radio\".",
                example: "\"Flower heard\" → FLOUR",
              },
              {
                icon: Sparkles,
                name: "Deletion",
                color: "bg-orange-100 text-orange-600",
                desc: "A letter or letters are removed from a word. Indicators include \"headless\", \"endless\", or \"losing\".",
                example: "\"Headless beast\" → EAST",
              },
            ].map((type) => (
              <div
                key={type.name}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${type.color}`}
                >
                  <type.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 font-heading text-sm font-bold text-foreground">
                  {type.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {type.desc}
                </p>
                <p className="mt-2 rounded-md bg-muted/50 px-2.5 py-1.5 font-mono text-xs text-foreground">
                  {type.example}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-to-play-minute-cryptic"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Learn All Cryptic Clue Types
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Section 6: Why Daily Cryptic Practice Works ============ */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Why Daily Cryptic Practice Works
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Cryptic crossword ability is not a talent — it is a trainable skill.
            Research on spaced repetition shows that short, consistent practice
            sessions outperform long, irregular ones. A daily cryptic habit
            gives your brain exactly the right dose of pattern exposure to build
            lasting fluency.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  1–2 Minutes a Day
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Each daily cryptic clue takes just a minute or two. That is
                  less time than checking social media — but the cognitive
                  payoff is far greater.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Pattern Recognition
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solving a daily cryptic crossword trains you to spot anagram
                  indicators, container signals, and definition boundaries
                  faster each time.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Build a Streak
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  The daily format creates natural momentum. Solve one daily
                  cryptic puzzle today, come back tomorrow, and watch your
                  streak grow alongside your skills.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Easy to Advanced Path
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with easy cryptic crossword clues using all four hints.
                  As you improve, try solving with fewer hints or tackle harder
                  daily cryptics from the archive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Section 7: Recent Daily Cryptics ============ */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Recent Daily Cryptics
          </h2>
          <p className="mt-3 text-muted-foreground">
            Missed a day? Browse the latest daily cryptic clues below. Every
            puzzle includes hints and a full explanation.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-semibold text-foreground">Date</th>
                  <th className="pb-3 pr-4 font-semibold text-foreground">Clue</th>
                  <th className="hidden pb-3 pr-4 font-semibold text-foreground sm:table-cell">Type</th>
                  <th className="hidden pb-3 pr-4 font-semibold text-foreground sm:table-cell">Difficulty</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {recentPuzzles.map((puzzle) => (
                  <tr key={puzzle.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 text-foreground">
                      {dayjs(puzzle.printDate).format("MMM D")}
                    </td>
                    <td className="max-w-[200px] truncate py-3 pr-4 sm:max-w-xs">
                      {puzzle.clue}
                    </td>
                    <td className="hidden py-3 pr-4 sm:table-cell">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                        {puzzle.clueType}
                      </span>
                    </td>
                    <td className="hidden py-3 pr-4 sm:table-cell">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                        {puzzle.difficulty}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/minute-cryptic/${puzzle.printDate}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Solve <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/minute-cryptic"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore the Full Daily Cryptic Archive
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Section 8: What Makes the Best Daily Cryptic ============ */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What Makes the Best Daily Cryptic Crossword?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Not all daily cryptic crossword puzzles are created equal. The best
            daily cryptic crossword combines fair clue construction with genuine
            learning value. Here is what sets a quality cryptic daily apart from
            a frustrating one.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Fair Wordplay
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Every daily cryptic clue should have a clear definition and
                legitimate wordplay. No obscure abbreviations or unfair tricks
                — just clean, solvable construction.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-blue-400 bg-blue-50 p-5 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Learning Built In
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The best daily cryptic includes explanations after each solve.
                You should walk away understanding why the answer works, not
                just what it is.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-emerald-400 bg-emerald-50 p-5 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Accessible Difficulty
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                A great cryptic crossword daily offers a range of difficulty
                levels. Cryptic crosswords for beginners need gentler clues and
                hint support, while veterans want harder challenges.
              </p>
            </div>
          </div>

          <p className="mt-8 leading-relaxed text-muted-foreground">
            DailyCryptic is built around these principles. Every daily cryptic
            puzzle is reviewed for fairness, tagged by clue type and difficulty,
            and paired with a four-level hint system. Whether you are looking
            for an easy cryptic crossword to start your morning or a tough
            challenge to test your skills, you will find cryptic crossword
            puzzles online here that respect your time and reward your effort.
          </p>
        </div>
      </section>

      {/* ============ Section 9: FAQ ============ */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageCircleQuestion className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Daily Cryptic Crossword FAQ
            </h2>
            <p className="mt-2 text-muted-foreground">
              Common questions about our daily cryptic puzzles, answered.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
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

      {/* ============ Section 10: Bottom CTA ============ */}
      <section className="bg-[#b8d8fa] py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Trophy className="mx-auto h-8 w-8 text-amber-600" />
          <h2 className="mt-3 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            Start Your Daily Cryptic Streak
          </h2>
          <p className="mt-4 text-slate-700">
            One clue a day is all it takes. Solve today&apos;s daily cryptic,
            check the explanation, and come back tomorrow. Your future self will
            thank you for the practice.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/minute-cryptic-today"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.97]"
            >
              Solve Today&apos;s Daily Cryptic
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/minute-cryptic-unlimited"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-400 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white/90"
            >
              <Infinity className="h-4 w-4" />
              Try Unlimited Mode
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/how-to-play-minute-cryptic"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              How to solve cryptic clues
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/minute-cryptic"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              Browse the archive
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/minute-cryptic-faq"
              className="inline-flex items-center gap-1 font-medium text-slate-800 underline underline-offset-2 hover:text-slate-900"
            >
              Minute cryptic FAQ
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