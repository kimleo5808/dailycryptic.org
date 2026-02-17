"use client";

import dayjs from "dayjs";
import { ArrowLeft, Check, Delete, HelpCircle, Info } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MinuteCrypticHeroGameProps = {
  clue: string;
  answer: string;
  dateLabel: string;
  printDate?: string;
  hints: [string, string, string, string];
};

type FeedbackState = "idle" | "correct" | "incorrect";

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function normalizeAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

export default function MinuteCrypticHeroGame({
  clue,
  answer,
  dateLabel,
  printDate,
  hints,
}: MinuteCrypticHeroGameProps) {
  const expected = useMemo(() => normalizeAnswer(answer), [answer]);
  const expectedLength = expected.length;
  const displayDate = useMemo(() => {
    const parsed = dayjs(printDate || dateLabel);
    return parsed.isValid() ? parsed.format("D MMMM YYYY") : dateLabel;
  }, [printDate, dateLabel]);
  const maxHintLevel = hints.filter(Boolean).length;

  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState(0);

  const resetFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearFeedbackTimer = useCallback(() => {
    if (resetFeedbackTimerRef.current) {
      clearTimeout(resetFeedbackTimerRef.current);
      resetFeedbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  const triggerIncorrectFeedback = useCallback(
    (nextMessage: string) => {
      setFeedback("incorrect");
      setMessage(nextMessage);
      clearFeedbackTimer();
      resetFeedbackTimerRef.current = setTimeout(() => {
        setFeedback("idle");
      }, 500);
    },
    [clearFeedbackTimer]
  );

  const handleInput = useCallback(
    (char: string) => {
      if (solved) return;
      if (!/^[A-Z]$/.test(char)) return;
      if (guess.length >= expectedLength) return;

      setGuess((prev) => prev + char);
      setFeedback("idle");
      setMessage("");
    },
    [guess.length, expectedLength, solved]
  );

  const handleDelete = useCallback(() => {
    if (solved) return;
    setGuess((prev) => prev.slice(0, -1));
    setFeedback("idle");
    setMessage("");
  }, [solved]);

  const handleCheck = useCallback(() => {
    if (solved) return;

    if (guess.length !== expectedLength) {
      triggerIncorrectFeedback(`Answer should be ${expectedLength} letters.`);
      return;
    }

    if (guess === expected) {
      clearFeedbackTimer();
      setFeedback("correct");
      setSolved(true);
      setMessage("Correct.");
      return;
    }

    triggerIncorrectFeedback("Not quite. Check definition and wordplay.");
  }, [
    clearFeedbackTimer,
    expected,
    expectedLength,
    guess,
    solved,
    triggerIncorrectFeedback,
  ]);

  const handleRevealHint = useCallback(() => {
    if (solved) return;
    if (!maxHintLevel) return;
    setRevealedHintLevel((prev) => Math.min(prev + 1, maxHintLevel));
    setMessage("");
  }, [maxHintLevel, solved]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        handleDelete();
        return;
      }

      if (event.key === "Enter") {
        handleCheck();
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleCheck, handleDelete, handleInput]);

  const currentHint = revealedHintLevel > 0 ? hints[revealedHintLevel - 1] : "";
  const stepCount = maxHintLevel + 1;
  const currentStep = revealedHintLevel + 1;

  const cellSizeClass =
    expectedLength <= 8
      ? "h-14 w-12 text-3xl"
      : expectedLength <= 12
        ? "h-12 w-10 text-2xl"
        : "h-10 w-8 text-xl";

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-sky-200/70 bg-[#b8d8fa] px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.16)] sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.46),transparent_52%)]" />

      <div className="relative mx-auto flex min-h-[760px] w-full max-w-2xl flex-col text-slate-800">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/minute-cryptic"
              aria-label="Open archive"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/20 bg-white/35 transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/35"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="font-heading text-lg font-bold leading-tight text-slate-900">
                {displayDate}
              </p>
              <p className="text-xs font-medium text-slate-700/75">
                By dailycryptic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/minute-cryptic-faq"
              aria-label="Open FAQ"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/20 bg-white/35 transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/35"
            >
              <Info className="h-5 w-5" />
            </Link>
            <Link
              href="/minute-cryptic-today"
              aria-label="Open today's clue"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-black px-2.5 text-base font-extrabold text-white"
            >
              M
            </Link>
          </div>
        </header>

        <article className="relative mt-7 rounded-2xl border border-slate-900/12 bg-white/92 p-6 shadow-[0_6px_0_0_rgba(100,116,139,0.2)] sm:p-8">
          <div className="absolute left-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r from-sky-500 via-indigo-400 to-violet-500" />
          <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
            {clue}
          </h2>
        </article>

        <div className="mt-8 flex flex-col items-center">
          <div
            className={`flex max-w-full flex-wrap justify-center gap-2 ${feedback === "incorrect" ? "mc-wiggle" : ""}`}
          >
            {Array.from({ length: expectedLength }).map((_, index) => {
              const char = guess[index] || "";
              const isFilled = Boolean(char);
              const isIncorrectFull = feedback === "incorrect" && guess.length === expectedLength;
              return (
                <div
                  key={index}
                  className={[
                    "rounded-md border-2 font-bold uppercase shadow-[2px_2px_0_0_rgba(15,23,42,0.35)] transition-all duration-150",
                    "flex items-center justify-center",
                    cellSizeClass,
                    feedback === "correct"
                      ? "mc-pop border-emerald-500 bg-emerald-100 text-emerald-800"
                      : isIncorrectFull && isFilled
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-slate-900 bg-white text-slate-900",
                  ].join(" ")}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  {char}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-2">
            {Array.from({ length: stepCount }).map((_, index) => (
              <span
                key={index}
                className={[
                  "h-2.5 w-2.5 rounded-full transition-all",
                  index === currentStep - 1
                    ? "scale-110 bg-black"
                    : index < currentStep - 1
                      ? "bg-slate-700/55"
                      : "bg-white/70",
                ].join(" ")}
              />
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold italic text-slate-700/65">
            par {currentStep} of {stepCount}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRevealHint}
              disabled={solved || revealedHintLevel >= maxHintLevel}
              className="inline-flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-amber-400 px-6 text-base font-bold text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,0.35)] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(15,23,42,0.35)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <HelpCircle className="h-4 w-4" />
              hints
            </button>
            <button
              type="button"
              onClick={handleCheck}
              disabled={solved}
              className="inline-flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-sky-500 px-6 text-base font-bold text-white shadow-[3px_3px_0_0_rgba(15,23,42,0.35)] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(15,23,42,0.35)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Check className="h-4 w-4" />
              check
            </button>
          </div>

          {message ? (
            <p
              className={`mt-4 text-sm font-medium ${feedback === "correct" ? "text-emerald-700" : "text-slate-700"}`}
            >
              {message}
            </p>
          ) : null}

          {currentHint ? (
            <div className="mt-4 w-full max-w-xl rounded-xl border border-slate-200 bg-white/90 p-4 text-sm leading-relaxed text-slate-700">
              <p className="font-semibold text-slate-900">
                Hint {revealedHintLevel}
              </p>
              <p className="mt-1">{currentHint}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-auto pt-10">
          <div className="mx-auto w-full max-w-[520px] select-none rounded-2xl bg-white/15 p-3">
            <div className="space-y-2">
              {KEY_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                  {row.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleInput(key)}
                      disabled={solved}
                      className="h-11 w-8 rounded-md border border-slate-300 bg-white text-base font-semibold text-slate-700 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-10 md:w-11"
                    >
                      {key}
                    </button>
                  ))}
                  {rowIndex === 2 ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={solved}
                      aria-label="Delete one letter"
                      className="inline-flex h-11 w-10 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-700 transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-12 md:w-14"
                    >
                      <Delete className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
