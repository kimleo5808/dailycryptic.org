"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { LetterState } from "@/types/quordle";

export type WordleKey = string | "enter" | "backspace";

interface WordleKeyboardProps {
  onKey: (key: WordleKey) => void;
  letterStates?: Record<string, LetterState>;
  disabled?: boolean;
  colorBlind?: boolean;
  className?: string;
}

const ROWS: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

function keyClass(state: LetterState | undefined, colorBlind: boolean): string {
  switch (state) {
    case "correct":
      return colorBlind
        ? "bg-blue-500 text-white dark:bg-blue-600"
        : "bg-emerald-500 text-white dark:bg-emerald-600";
    case "present":
      return colorBlind
        ? "bg-orange-400 text-white dark:bg-orange-500"
        : "bg-amber-400 text-white dark:bg-amber-500";
    case "absent":
      return "bg-zinc-400 text-white dark:bg-zinc-700";
    default:
      return "bg-zinc-200 text-foreground hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700";
  }
}

function isTypingInFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  return false;
}

export default function WordleKeyboard({
  onKey,
  letterStates = {},
  disabled = false,
  colorBlind = false,
  className,
}: WordleKeyboardProps) {
  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingInFormField(e.target)) return;
      const k = e.key;
      if (k === "Enter") {
        e.preventDefault();
        onKey("enter");
        return;
      }
      if (k === "Backspace") {
        e.preventDefault();
        onKey("backspace");
        return;
      }
      if (/^[a-zA-Z]$/.test(k)) {
        e.preventDefault();
        onKey(k.toLowerCase());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, onKey]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col gap-1.5 select-none",
        className,
      )}
      role="group"
      aria-label="Virtual keyboard"
    >
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((k) => {
            const isWide = k === "enter" || k === "backspace";
            const label =
              k === "enter" ? "Enter" : k === "backspace" ? "⌫" : k.toUpperCase();
            const state = k.length === 1 ? letterStates[k.toUpperCase()] : undefined;
            return (
              <button
                key={k}
                type="button"
                onClick={() => !disabled && onKey(k)}
                disabled={disabled}
                aria-label={k === "backspace" ? "Backspace" : label}
                className={cn(
                  "rounded-md font-heading text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  "h-12 sm:h-14",
                  isWide
                    ? "flex-[1.5] px-2 text-xs sm:text-sm"
                    : "flex-1 px-1",
                  keyClass(state, colorBlind),
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
