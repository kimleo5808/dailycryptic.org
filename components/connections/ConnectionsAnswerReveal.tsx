"use client";

import { useState } from "react";
import type { ConnectionsColor } from "@/types/connections";

const COLOR_BG: Record<ConnectionsColor, string> = {
  yellow: "bg-amber-100 border-amber-300 dark:bg-amber-900/50 dark:border-amber-700",
  green: "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-700",
  blue: "bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700",
  purple: "bg-purple-100 border-purple-300 dark:bg-purple-900/50 dark:border-purple-700",
};

const COLOR_LABEL: Record<ConnectionsColor, string> = {
  yellow: "text-amber-800 dark:text-amber-200",
  green: "text-emerald-800 dark:text-emerald-200",
  blue: "text-blue-800 dark:text-blue-200",
  purple: "text-purple-800 dark:text-purple-200",
};

interface AnswerGroup {
  color: ConnectionsColor;
  name: string;
  words: string[];
}

interface ConnectionsAnswerRevealProps {
  groups: AnswerGroup[];
}

export default function ConnectionsAnswerReveal({
  groups,
}: ConnectionsAnswerRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {!revealed ? (
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Spoiler alert — full answers below
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-3 rounded-lg bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
          >
            Reveal All Answers
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Today&apos;s Answers
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.color}
                className={`rounded-xl border p-3 ${COLOR_BG[group.color]}`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-wide ${COLOR_LABEL[group.color]}`}
                >
                  {group.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {group.words.map((word) => (
                    <span
                      key={word}
                      className="rounded-md bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
