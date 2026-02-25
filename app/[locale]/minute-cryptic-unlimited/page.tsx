import UnlimitedGame from "@/components/minute-cryptic-unlimited/UnlimitedGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzlesForUnlimited } from "@/lib/minute-cryptic-data";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight } from "lucide-react";
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

      {/* SEO content sections */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What Is Minute Cryptic Unlimited
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Minute cryptic unlimited is a free, browser-based mode that lets you
            solve cryptic clues without any daily restriction. The standard
            minute cryptic format delivers one puzzle per day, which is ideal for
            building a consistent habit. But when you want more practice or
            simply enjoy the challenge, minute cryptic unlimited opens the full
            puzzle library so you can play at your own pace.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every puzzle in minute cryptic unlimited uses the same format you
            already know: a single cryptic clue, a letter grid, progressive
            hints, and a full explanation after you solve. The difference is
            simple — once you finish one clue, you tap Next Puzzle and a new
            minute cryptic unlimited clue appears immediately. There is no
            waiting, no countdown, and no cap on how many you can complete.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This mode draws from the complete archive of published minute
            cryptic clues. That means you get a mix of anagrams, charades,
            containers, and double definitions across easy, medium, and hard
            difficulty levels. Minute cryptic unlimited is designed for anyone
            who wants to sharpen their solving skills faster than the one-a-day
            schedule allows.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            How Minute Cryptic Unlimited Works
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Playing minute cryptic unlimited follows a straightforward loop.
            When you load the page, a random unsolved puzzle is selected from
            the library. You read the clue, type your answer using the on-screen
            keyboard or your physical keyboard, and press Check. If your answer
            is correct, the explanation appears and you can move on. If not, you
            can try again or use the progressive hint system.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The hint system in minute cryptic unlimited works exactly like the
            daily version. Each puzzle has four hint levels that gradually narrow
            the solving path without giving away the answer outright. Level one
            offers a general direction. Level two identifies the clue type.
            Level three provides a more specific nudge. Level four gives a
            strong pointer. You control how much help you receive, which keeps
            the challenge intact even in unlimited mode.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            After solving or revealing the answer, minute cryptic unlimited
            shows the full clue breakdown: the definition component, the
            wordplay mechanism, and how the letters map to the final answer.
            This feedback loop is what makes minute cryptic unlimited effective
            for learning, not just entertainment. Every solve teaches you
            something about how cryptic clues are constructed.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Why Play Minute Cryptic Unlimited
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The daily minute cryptic is a great anchor habit, but one puzzle per
            day limits how fast you can improve. Minute cryptic unlimited
            removes that ceiling. If you are preparing for a cryptic crossword
            competition, warming up before a full grid, or simply in the mood to
            solve, minute cryptic unlimited gives you the volume you need.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Repetition across varied clue types is the fastest way to build
            pattern recognition. In minute cryptic unlimited, you encounter
            anagram indicators, charade joins, container signals, and double
            definitions in rapid succession. This variety trains your brain to
            identify clue structures quickly, which directly translates to
            faster solving in any cryptic crossword context.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Minute cryptic unlimited is also useful for beginners who want to
            build confidence before committing to a full daily routine. Solving
            five or ten clues in a single session gives you a concentrated
            learning experience that would otherwise take a week or more in
            daily mode. The explanations after each solve reinforce the
            mechanics so you retain what you learn.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Minute Cryptic Unlimited vs Daily Mode
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Both modes serve different purposes and complement each other well.
            The daily minute cryptic gives you a single fresh clue each day,
            which builds consistency and makes solving a low-effort daily habit.
            Minute cryptic unlimited, on the other hand, is session-based — you
            decide how many puzzles to tackle and when to stop.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            In daily mode, your progress is tied to the calendar. In minute
            cryptic unlimited, progress is measured by total solves and streaks.
            Your streak in minute cryptic unlimited counts consecutive correct
            answers without using the reveal button. This adds a light
            competitive element that motivates careful solving rather than
            rushing through clues.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A practical approach is to use both: start with the daily minute
            cryptic to maintain your streak, then switch to minute cryptic
            unlimited when you want extra practice. The puzzle libraries overlap,
            but minute cryptic unlimited randomizes the order so you get a
            different experience each session.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Tips for Solving Minute Cryptic Unlimited Puzzles
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Start every minute cryptic unlimited clue by identifying the
            definition. In most cryptic clues, the definition sits at the
            beginning or end of the clue text. Once you have a candidate
            definition, the remaining words form the wordplay component. This
            split is the foundation of every solve in minute cryptic unlimited.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            For anagram clues in minute cryptic unlimited, look for indicator
            words that suggest rearrangement: mixed, broken, wild, dancing,
            reformed. The fodder — the letters to rearrange — is usually
            adjacent to the indicator. Count the letters carefully and confirm
            they match the answer length shown in the grid.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Charade clues in minute cryptic unlimited build the answer by
            joining smaller pieces in sequence. Each piece maps to a short
            synonym, abbreviation, or letter fragment. Read the clue left to
            right and try to map each segment to a component. Container clues
            work similarly but involve one piece sitting inside another — watch
            for words like holding, around, within, or embracing.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Double definitions are often the quickest to solve in minute cryptic
            unlimited. The clue gives two separate definitions for the same
            word, usually with a linking word between them. If a clue feels
            unusually short and direct, consider whether it might be a double
            definition before looking for complex wordplay.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Track Your Minute Cryptic Unlimited Progress
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Minute cryptic unlimited tracks three key metrics in your browser:
            total puzzles solved, current streak, and best streak. Your current
            streak increments each time you solve a puzzle without using the
            reveal button. Using reveal resets the current streak to zero but
            does not affect your best streak record.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            These stats are stored locally, so they persist between sessions on
            the same device. If you want a fresh start, the reset button clears
            your solved history and stats. This can be useful if you want to
            replay the full minute cryptic unlimited library from scratch or
            challenge yourself to beat a previous best streak.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Tracking progress in minute cryptic unlimited helps you see
            improvement over time. A rising best streak indicates that your
            pattern recognition and clue parsing are getting stronger. If your
            streak plateaus, consider spending time with the{" "}
            <Link
              href="/how-to-play-minute-cryptic"
              className="text-primary underline underline-offset-2"
            >
              solving guide
            </Link>{" "}
            to refresh your understanding of specific clue types before
            returning to minute cryptic unlimited.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-3">
            {UNLIMITED_FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
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

          <h2 className="mt-12 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Next Action
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Scroll up and solve your first minute cryptic unlimited puzzle now.
            Use one hint if needed, check your answer, read the explanation, and
            then hit Next Puzzle. After five solves, you will already notice
            patterns repeating across clue types. That recognition is the core
            skill that minute cryptic unlimited builds.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            If you prefer a structured daily routine, try the{" "}
            <Link
              href="/minute-cryptic-today"
              className="text-primary underline underline-offset-2"
            >
              daily minute cryptic
            </Link>{" "}
            for one fresh clue each day. Browse the{" "}
            <Link
              href="/minute-cryptic"
              className="text-primary underline underline-offset-2"
            >
              minute cryptic archive
            </Link>{" "}
            to revisit specific dates. Or read the{" "}
            <Link
              href="/how-to-play-minute-cryptic"
              className="text-primary underline underline-offset-2"
            >
              how to solve cryptic clues guide
            </Link>{" "}
            to strengthen your technique before your next minute cryptic
            unlimited session.
          </p>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
