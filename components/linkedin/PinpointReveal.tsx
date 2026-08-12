"use client";

import type { DecodedPinpoint } from "@/types/linkedin";
import { useState } from "react";

/** Clue-by-clue reveal, then the category answer — mirrors real Pinpoint play. */
export default function PinpointReveal({ puzzle }: { puzzle: DecodedPinpoint }) {
  const [shown, setShown] = useState(1);
  const [answerShown, setAnswerShown] = useState(false);
  return (
    <div className="mx-auto w-full max-w-[420px] space-y-3">
      {puzzle.clues.map((clue, i) => (
        <div
          key={i}
          className="rounded-xl border-2 border-slate-900 bg-white p-3 text-center shadow-[3px_3px_0_0_rgba(15,23,42,0.2)] dark:border-slate-200 dark:bg-zinc-900"
        >
          {i < shown ? (
            <p className="text-sm font-semibold text-foreground">{clue}</p>
          ) : (
            <button
              type="button"
              onClick={() => setShown(i + 1)}
              disabled={i > shown}
              className="text-sm font-semibold text-muted-foreground disabled:opacity-50"
            >
              Reveal clue {i + 1} of {puzzle.clues.length}
            </button>
          )}
        </div>
      ))}
      <div className="rounded-xl border-2 border-slate-900 bg-emerald-100 p-4 text-center shadow-[3px_3px_0_0_rgba(15,23,42,0.25)] dark:border-slate-200 dark:bg-emerald-900/40">
        {answerShown ? (
          <p className="mc-pop text-lg font-bold text-emerald-900 dark:text-emerald-200">
            {puzzle.answer}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setAnswerShown(true)}
            className="text-sm font-bold text-emerald-800 dark:text-emerald-300"
          >
            Reveal today&apos;s Pinpoint category
          </button>
        )}
      </div>
    </div>
  );
}
