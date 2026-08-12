"use client";

import type { DecodedCrossclimb } from "@/types/linkedin";
import { useState } from "react";

function Rung({
  clue,
  answer,
  index,
}: {
  clue: string;
  answer: string;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="relative rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 shadow-[3px_3px_0_0_rgba(15,23,42,0.2)] dark:border-slate-200 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">{clue}</p>
        {open ? (
          <span className="mc-pop shrink-0 font-mono text-sm font-bold uppercase tracking-wide text-foreground">
            {answer}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-md border border-dashed border-slate-400 px-2 py-0.5 text-xs font-semibold text-muted-foreground hover:border-slate-900 hover:text-foreground dark:hover:border-slate-200"
          >
            Reveal
          </button>
        )}
      </div>
      {index !== undefined ? (
        <span className="absolute -left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-900 bg-amber-400 text-xs font-bold text-slate-900">
          {index}
        </span>
      ) : null}
    </li>
  );
}

/** Ladder view: clue rungs (given order) + final order chips + cap words. */
export default function CrossclimbLadder({
  puzzle,
}: {
  puzzle: DecodedCrossclimb;
}) {
  const orderIndex = new Map(
    puzzle.order.map((w, i) => [w.toUpperCase(), i + 1] as const)
  );
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Top word
      </p>
      <ul className="space-y-3 border-l-4 border-r-4 border-rose-500/60 px-4 py-1">
        <Rung clue="Bonus — connects to the top" answer={puzzle.top} />
        {puzzle.rungs.map((rung) => (
          <Rung
            key={rung.answer}
            clue={rung.clue}
            answer={rung.answer}
            index={orderIndex.get(rung.answer.toUpperCase())}
          />
        ))}
        <Rung clue="Bonus — connects to the bottom" answer={puzzle.bottom} />
      </ul>
      <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Bottom word
      </p>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Amber chips show the final ladder order (1 = top).
      </p>
    </div>
  );
}
