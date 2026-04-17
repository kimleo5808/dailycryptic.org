"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuordleShareButtonProps {
  puzzleNumber: number | null;
  mode: "daily" | "practice";
  guessesPerBoard: (number | null)[];
  guessLimit: number;
  className?: string;
}

function formatShare({
  puzzleNumber,
  mode,
  guessesPerBoard,
  guessLimit,
}: {
  puzzleNumber: number | null;
  mode: "daily" | "practice";
  guessesPerBoard: (number | null)[];
  guessLimit: number;
}): string {
  const header =
    mode === "daily" && puzzleNumber
      ? `Daily Quordle #${puzzleNumber}`
      : "Practice Quordle";
  const cell = (n: number | null) => {
    if (n === null) return "🟥";
    if (n > 9) return "🔟";
    return ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"][n];
  };
  const g = guessesPerBoard;
  const line1 = `${cell(g[0])}${cell(g[1])}`;
  const line2 = `${cell(g[2])}${cell(g[3])}`;
  const totalText =
    mode === "daily"
      ? `${g.filter((x) => x !== null).length}/4 solved in ${guessLimit} guesses`
      : "Practice mode";
  return `${header}\n${totalText}\n${line1}\n${line2}\ndailycryptic.org/quordle`;
}

export default function QuordleShareButton(props: QuordleShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const text = formatShare(props);
    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* user cancelled or share failed — fall through to clipboard */
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
