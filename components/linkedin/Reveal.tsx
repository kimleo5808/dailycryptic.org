"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, Eye } from "lucide-react";

/** Progressive spoiler-free hints: each row flips from a blurred teaser to text. */
export function HintList({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState<number>(0);
  return (
    <ol className="space-y-3">
      {hints.map((hint, i) => {
        const open = i < revealed;
        return (
          <li
            key={i}
            className="rounded-xl border-2 border-slate-900 bg-white p-3 shadow-[3px_3px_0_0_rgba(15,23,42,0.2)] dark:border-slate-200 dark:bg-zinc-900 dark:shadow-[3px_3px_0_0_rgba(226,232,240,0.15)]"
          >
            {open ? (
              <p className="text-sm text-foreground">
                <span className="mr-2 font-bold">Hint {i + 1}:</span>
                {hint}
              </p>
            ) : (
              <button
                type="button"
                aria-expanded={false}
                disabled={i > revealed}
                onClick={() => setRevealed(i + 1)}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-muted-foreground disabled:opacity-50"
              >
                <span>
                  {i === revealed
                    ? `Tap to reveal hint ${i + 1}`
                    : `Hint ${i + 1} — unlock the previous hint first`}
                </span>
                <Eye className="h-4 w-4 shrink-0" aria-hidden />
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Full-width solution gate; children mount only after reveal (mc-pop entrance). */
export function SolutionReveal({
  label,
  accentClass,
  children,
}: {
  label: string;
  accentClass: string; // e.g. "bg-amber-400"
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (open) {
    return <div className="mc-pop">{children}</div>;
  }
  return (
    <button
      type="button"
      aria-expanded={false}
      onClick={() => setOpen(true)}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 ${accentClass} px-6 py-4 text-base font-bold text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,0.35)] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(15,23,42,0.35)]`}
    >
      <ChevronDown className="h-5 w-5" aria-hidden />
      {label}
    </button>
  );
}

/** Per-item tap-to-reveal (Crossclimb rung answers, Pinpoint answer). */
export function InlineReveal({
  placeholder,
  children,
}: {
  placeholder: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return (
    <button
      type="button"
      aria-expanded={false}
      onClick={() => setOpen(true)}
      className="rounded-md border border-dashed border-slate-400 px-2 py-0.5 text-xs font-semibold text-muted-foreground hover:border-slate-900 hover:text-foreground dark:hover:border-slate-200"
    >
      {placeholder}
    </button>
  );
}
