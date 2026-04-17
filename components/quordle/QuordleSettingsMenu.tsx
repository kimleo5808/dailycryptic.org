"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuordleStore } from "@/stores/quordleStore";

interface QuordleSettingsMenuProps {
  className?: string;
}

export default function QuordleSettingsMenu({
  className,
}: QuordleSettingsMenuProps) {
  const colorBlind = useQuordleStore((s) => s.colorBlind);
  const setColorBlind = useQuordleStore((s) => s.setColorBlind);
  const hydrate = useQuordleStore((s) => s.hydrate);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const effectiveColorBlind = mounted ? colorBlind : false;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-border bg-popover p-3 text-sm text-popover-foreground shadow-lg"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Display
          </p>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-1 py-1.5">
            <span>
              <span className="block font-medium text-foreground">
                Color-blind mode
              </span>
              <span className="block text-xs text-muted-foreground">
                Blue/orange instead of green/yellow
              </span>
            </span>
            <input
              type="checkbox"
              checked={effectiveColorBlind}
              onChange={(e) => setColorBlind(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-primary"
            />
          </label>

          <div className="my-3 h-px bg-border" />

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            How to play
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
            <li>Guess four 5-letter words at the same time.</li>
            <li>Each guess scores on all four boards at once.</li>
            <li>
              <span className="font-semibold text-emerald-600 dark:text-emerald-500">
                Green
              </span>{" "}
              = right letter, right spot.
            </li>
            <li>
              <span className="font-semibold text-amber-500">Yellow</span> =
              right letter, wrong spot.
            </li>
            <li>You have 9 total guesses to solve all 4.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
