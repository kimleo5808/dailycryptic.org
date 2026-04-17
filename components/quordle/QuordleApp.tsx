"use client";

import { useEffect, useState } from "react";
import QuordleGame from "@/components/quordle/QuordleGame";
import QuordleModeTabs from "@/components/quordle/QuordleModeTabs";
import QuordleHowToPlay from "@/components/quordle/QuordleHowToPlay";
import QuordleColorBlindToggle from "@/components/quordle/QuordleColorBlindToggle";
import type { QuordleMode } from "@/types/quordle";

const VALID_MODES: QuordleMode[] = ["daily", "practice"];

function readModeFromHash(): QuordleMode | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "").toLowerCase();
  return VALID_MODES.includes(h as QuordleMode) ? (h as QuordleMode) : null;
}

export default function QuordleApp() {
  const [mode, setMode] = useState<QuordleMode>("daily");

  useEffect(() => {
    const initial = readModeFromHash();
    if (initial) setMode(initial);
    const onHash = () => {
      const next = readModeFromHash();
      if (next) setMode(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onChange = (next: QuordleMode) => {
    setMode(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = next;
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <section
      aria-label="Quordle game"
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-card/40 px-3 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <QuordleModeTabs mode={mode} onChange={onChange} />
        <QuordleColorBlindToggle />
      </div>

      <QuordleGame mode={mode} />

      <QuordleHowToPlay />
    </section>
  );
}
