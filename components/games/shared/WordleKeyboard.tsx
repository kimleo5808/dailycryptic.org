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

/*
 * Keyboard palette mirrors Wordle's proven high-contrast keys:
 *   neutral key: #d3d6da / #818384
 *   correct:     #6aaa64 / #538d4e
 *   present:     #c9b458 / #b59f3b
 *   absent:      #787c7e / #3a3a3c
 */
function keyClass(state: LetterState | undefined, colorBlind: boolean): string {
  switch (state) {
    case "correct":
      return colorBlind
        ? "bg-[#3b82f6] text-white hover:bg-[#2563eb] dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8]"
        : "bg-[#6aaa64] text-white hover:bg-[#5f9a5a] dark:bg-[#538d4e] dark:hover:bg-[#487b44]";
    case "present":
      return colorBlind
        ? "bg-[#f97316] text-white hover:bg-[#ea580c] dark:bg-[#ea580c] dark:hover:bg-[#c2410c]"
        : "bg-[#c9b458] text-white hover:bg-[#b49f4e] dark:bg-[#b59f3b] dark:hover:bg-[#9c8833]";
    case "absent":
      return "bg-[#787c7e] text-white hover:bg-[#6a6e70] dark:bg-[#3a3a3c] dark:hover:bg-[#2d2d2e]";
    default:
      return "bg-[#d3d6da] text-[#1a1a1b] hover:bg-[#bbbec0] active:bg-[#a8abae] dark:bg-[#818384] dark:text-white dark:hover:bg-[#6e7073] dark:active:bg-[#595a5b]";
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
        "mx-auto flex w-full max-w-lg flex-col gap-1.5 select-none",
        className,
      )}
      role="group"
      aria-label="Virtual keyboard"
    >
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-[6px]">
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
                  "rounded-[4px] font-heading font-bold uppercase transition-all active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60",
                  "h-[52px] sm:h-[58px]",
                  isWide
                    ? "flex-[1.6] px-1 text-[11px] sm:text-xs"
                    : "flex-1 px-0.5 text-base sm:text-lg",
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
