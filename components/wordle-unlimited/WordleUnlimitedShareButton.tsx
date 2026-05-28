"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LetterState } from "@/types/quordle";

interface ShareProps {
  mode: "daily" | "practice";
  length: number;
  puzzleNumber: number | null;
  evaluations: LetterState[][];
  won: boolean;
  guessLimit: number;
  className?: string;
}

const TILE: Record<LetterState, string> = {
  correct: "🟩",
  present: "🟨",
  absent: "⬛",
  empty: "⬜",
};

function buildShareText({
  mode,
  length,
  puzzleNumber,
  evaluations,
  won,
  guessLimit,
}: ShareProps): string {
  const header =
    mode === "daily" && puzzleNumber
      ? `Wordle Unlimited ${length}-letter #${puzzleNumber}`
      : `Wordle Unlimited ${length}-letter`;
  const score = won ? `${evaluations.length}/${guessLimit}` : `X/${guessLimit}`;
  const grid = evaluations
    .map((row) => row.map((s) => TILE[s] ?? TILE.absent).join(""))
    .join("\n");
  return `${header} ${score}\n${grid}\ndailycryptic.org/wordle-unlimited`;
}

export default function WordleUnlimitedShareButton(props: ShareProps) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const text = buildShareText(props);
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* cancelled — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — noop */
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90",
        props.className,
      )}
    >
      {copied ? "Copied!" : "Share result"}
    </button>
  );
}
