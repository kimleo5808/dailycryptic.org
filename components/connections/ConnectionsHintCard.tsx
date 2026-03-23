"use client";

import { useState } from "react";
import type { ConnectionsColor } from "@/types/connections";

const COLOR_CONFIG: Record<
  ConnectionsColor,
  {
    label: string;
    difficulty: string;
    bg: string;
    border: string;
    dot: string;
    badge: string;
    btnActive: string;
  }
> = {
  yellow: {
    label: "Yellow",
    difficulty: "Easiest",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-700",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    btnActive: "bg-amber-400 text-amber-950",
  },
  green: {
    label: "Green",
    difficulty: "Moderate",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-300 dark:border-emerald-700",
    dot: "bg-emerald-400",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    btnActive: "bg-emerald-400 text-emerald-950",
  },
  blue: {
    label: "Blue",
    difficulty: "Tricky",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-300 dark:border-blue-700",
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    btnActive: "bg-blue-400 text-blue-950",
  },
  purple: {
    label: "Purple",
    difficulty: "Hardest",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-300 dark:border-purple-700",
    dot: "bg-purple-400",
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    btnActive: "bg-purple-400 text-purple-950",
  },
};

interface ConnectionsHintCardProps {
  color: ConnectionsColor;
  hint: string;
  groupName: string;
  words: string[];
}

export default function ConnectionsHintCard({
  color,
  hint,
  groupName,
  words,
}: ConnectionsHintCardProps) {
  const [level, setLevel] = useState(0); // 0=closed, 1=hint, 2=group, 3=words
  const config = COLOR_CONFIG[color];

  return (
    <div
      className={`overflow-hidden rounded-xl border-2 ${config.border} ${config.bg} transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-3.5 w-3.5 rounded-full ${config.dot}`} />
          <span className="font-heading text-sm font-bold text-foreground">
            {config.label}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}
          >
            {config.difficulty}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={() => setLevel(level >= 1 ? 0 : 1)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 1
              ? config.btnActive
              : "bg-background text-foreground border border-border hover:bg-muted"
          }`}
        >
          {level >= 1 ? "Hide Hint" : "See Hint"}
        </button>
        <button
          type="button"
          onClick={() => setLevel(level >= 2 ? 1 : 2)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 2
              ? config.btnActive
              : "bg-background text-foreground border border-border hover:bg-muted"
          }`}
        >
          {level >= 2 ? "Hide Group" : "See Group"}
        </button>
        <button
          type="button"
          onClick={() => setLevel(level >= 3 ? 2 : 3)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            level >= 3
              ? config.btnActive
              : "bg-background text-foreground border border-border hover:bg-muted"
          }`}
        >
          {level >= 3 ? "Hide Words" : "See Words"}
        </button>
      </div>

      {/* Reveal content */}
      {level >= 1 && (
        <div className="space-y-2 border-t border-border/50 px-4 py-3 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          {/* Level 1: Hint */}
          <p className="text-sm italic text-muted-foreground">{hint}</p>

          {/* Level 2: Group name */}
          {level >= 2 && (
            <p className="font-heading text-base font-bold text-foreground">
              {groupName}
            </p>
          )}

          {/* Level 3: Words */}
          {level >= 3 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {words.map((word) => (
                <span
                  key={word}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-sm font-medium text-foreground"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
