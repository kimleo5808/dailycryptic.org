"use client";

import { useEffect, useState } from "react";
import QuordleGame from "@/components/quordle/QuordleGame";
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

  return <QuordleGame mode={mode} onModeChange={onChange} />;
}
