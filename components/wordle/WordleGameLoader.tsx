"use client";

import dynamic from "next/dynamic";

const WordleGame = dynamic(
  () => import("@/components/wordle/WordleGame"),
  { ssr: false }
);

export default function WordleGameLoader({
  wordLength,
}: {
  wordLength: number;
}) {
  return <WordleGame wordLength={wordLength} />;
}
