"use client";

import { useMemo, useState } from "react";

type MinuteCrypticGameProps = {
  clue: string;
  answer: string;
  dateLabel: string;
  hints: [string, string, string, string];
};

function normalizeAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

export default function MinuteCrypticGame({
  clue,
  answer,
  dateLabel,
  hints,
}: MinuteCrypticGameProps) {
  const expected = useMemo(() => normalizeAnswer(answer), [answer]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState(0);

  const expectedLength = expected.length;

  const hintTexts = hints;

  const handleCheck = () => {
    const normalizedInput = normalizeAnswer(input);

    if (normalizedInput.length !== expectedLength) {
      setSolved(false);
      setFeedback(`Answer should be ${expectedLength} letters.`);
      return;
    }

    if (normalizedInput === expected) {
      setSolved(true);
      setFeedback("Correct.");
      return;
    }

    setSolved(false);
    setFeedback("Not quite. Check the definition side first.");
  };

  const handleClear = () => {
    setInput("");
    setFeedback("");
    setSolved(false);
  };

  const openHints = () => {
    setRevealedHintLevel(0);
    setHintsOpen(true);
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-white">
            Today&apos;s clue
          </h2>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
            {dateLabel}
          </span>
        </div>

        <p className="mt-4 text-lg font-semibold leading-relaxed text-slate-100 sm:text-xl">
          {clue}
        </p>

        <label
          htmlFor="minute-cryptic-answer"
          className="mt-6 block text-sm font-medium text-slate-300"
        >
          Your answer
        </label>
        <input
          id="minute-cryptic-answer"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer"
          autoComplete="off"
          className="mt-2 h-12 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 text-base text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCheck}
            className="inline-flex h-11 min-w-28 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Check
          </button>
          <button
            type="button"
            onClick={openHints}
            className="inline-flex h-11 min-w-28 items-center justify-center rounded-lg border border-slate-500 px-5 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-800"
          >
            Hints
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-11 min-w-28 items-center justify-center rounded-lg border border-slate-700 px-5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/70"
          >
            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-300">
          {solved ? "Solved. Nice work." : "Not solved yet"}
        </p>
        {feedback && (
          <p className="mt-1 text-sm text-amber-300">{feedback}</p>
        )}
      </section>

      {hintsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Hints
              </h3>
              <button
                type="button"
                onClick={() => setHintsOpen(false)}
                className="inline-flex h-10 min-w-20 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Reveal one level at a time.
            </p>

            <div className="mt-5 space-y-3">
              {hintTexts.map((hint, index) => {
                const level = index + 1;
                const canReveal = level <= revealedHintLevel + 1;
                const isRevealed = level <= revealedHintLevel;

                return (
                  <div
                    key={level}
                    className="rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Hint {level}
                      </p>
                      <button
                        type="button"
                        disabled={!canReveal}
                        onClick={() => setRevealedHintLevel(level)}
                        className="inline-flex h-9 min-w-24 items-center justify-center rounded-md border border-border px-3 text-xs font-semibold text-foreground transition enabled:hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRevealed ? "Revealed" : "Reveal"}
                      </button>
                    </div>
                    {isRevealed && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {hint}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
