"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  WORD_LENGTHS,
  DEFAULT_WORD_LENGTH,
  loadGuessSet,
  type WordLength,
} from "@/lib/wordle-unlimited-data";
import { WORD_LISTS } from "@/data/wordle-words";
import WordleKeyboard, {
  type WordleKey,
} from "@/components/games/shared/WordleKeyboard";
import type { LetterState } from "@/types/quordle";

/*
 * Client-side Wordle Solver.
 *
 * The word universe (valid guesses or answer pool) is loaded lazily from the
 * same static files the games use, so nothing here bloats the Worker bundle.
 * Filtering runs entirely in the browser and updates live on every change.
 *
 * Tile model mirrors real Wordle feedback entry: type your guess (letters
 * default to gray = absent), then tap a tile to cycle gray → green → yellow.
 */

type TileState = "green" | "yellow" | "gray";
interface Tile {
  letter: string;
  state: TileState;
}

// Approximate letter frequency across Wordle answers (%). Used to rank the
// strongest remaining guesses first.
const LETTER_FREQ: Record<string, number> = {
  E: 11, A: 9, R: 8, O: 7.5, T: 7, L: 7, I: 7, S: 6.5, N: 5, U: 4.5,
  C: 4, Y: 4, H: 4, D: 4, P: 3.5, G: 3, M: 3, B: 3, F: 2.5, K: 2.5,
  W: 2.5, V: 2, X: 1, Z: 1, Q: 1, J: 1,
};

function guessScore(word: string): number {
  const seen = new Set<string>();
  let s = 0;
  for (const ch of word) {
    if (!seen.has(ch)) {
      seen.add(ch);
      s += LETTER_FREQ[ch] ?? 0;
    }
  }
  return s;
}

const CYCLE: Record<TileState, TileState> = {
  gray: "green",
  green: "yellow",
  yellow: "gray",
};

const TILE_CLASS: Record<TileState, string> = {
  green:
    "bg-[#6aaa64] border-[#6aaa64] text-white dark:bg-[#538d4e] dark:border-[#538d4e]",
  yellow:
    "bg-[#c9b458] border-[#c9b458] text-white dark:bg-[#b59f3b] dark:border-[#b59f3b]",
  gray: "bg-[#787c7e] border-[#787c7e] text-white dark:bg-[#3a3a3c] dark:border-[#3a3a3c]",
};
const TILE_EMPTY =
  "bg-white border-[#d3d6da] text-[#1a1a1b] dark:bg-transparent dark:border-[#3a3a3c] dark:text-white";

const MAX_SHOWN = 300;

function makeTiles(length: number): Tile[] {
  return Array.from({ length }, () => ({ letter: "", state: "gray" as const }));
}

export default function WordleSolver() {
  const [length, setLength] = useState<WordLength>(DEFAULT_WORD_LENGTH);
  const [tiles, setTiles] = useState<Tile[]>(() =>
    makeTiles(DEFAULT_WORD_LENGTH)
  );
  const [extraGray, setExtraGray] = useState<string[]>([]);
  const [grayInput, setGrayInput] = useState("");
  const [answerOnly, setAnswerOnly] = useState(false);
  const [sort, setSort] = useState<"best" | "az">("best");
  const [universe, setUniverse] = useState<string[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Reset the board when the word length changes.
  useEffect(() => {
    setTiles(makeTiles(length));
    setExtraGray([]);
    setGrayInput("");
    setShowAll(false);
  }, [length]);

  // Load the word universe for the current length + mode.
  useEffect(() => {
    let cancelled = false;
    setUniverse(null);
    async function load() {
      if (answerOnly) {
        const pool = [
          ...new Set((WORD_LISTS[length] ?? []).map((w) => w.toUpperCase())),
        ];
        if (!cancelled) setUniverse(pool);
      } else {
        const set = await loadGuessSet(length);
        if (!cancelled) setUniverse([...set]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [length, answerOnly]);

  const fillLetter = useCallback((raw: string) => {
    const L = raw.toUpperCase();
    if (!/^[A-Z]$/.test(L)) return;
    setTiles((prev) => {
      const idx = prev.findIndex((t) => t.letter === "");
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { letter: L, state: "gray" };
      return next;
    });
  }, []);

  const clearLast = useCallback(() => {
    setTiles((prev) => {
      let idx = prev.findIndex((t) => t.letter === "");
      idx = idx === -1 ? prev.length - 1 : idx - 1;
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { letter: "", state: "gray" };
      return next;
    });
  }, []);

  const cycleTile = useCallback((i: number) => {
    setTiles((prev) => {
      if (!prev[i].letter) return prev;
      const next = [...prev];
      next[i] = { ...next[i], state: CYCLE[next[i].state] };
      return next;
    });
  }, []);

  const onKey = useCallback(
    (k: WordleKey) => {
      if (k === "enter") return;
      if (k === "backspace") {
        clearLast();
        return;
      }
      fillLetter(k);
    },
    [clearLast, fillLetter]
  );

  const clearAll = useCallback(() => {
    setTiles(makeTiles(length));
    setExtraGray([]);
    setGrayInput("");
    setShowAll(false);
  }, [length]);

  function addGrayFromInput(value: string) {
    const letters = value
      .toUpperCase()
      .split("")
      .filter((c) => /[A-Z]/.test(c));
    if (letters.length === 0) return;
    setExtraGray((prev) => [...new Set([...prev, ...letters])]);
    setGrayInput("");
  }

  // Keyboard letter-state coloring: green beats yellow beats gray.
  const letterStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    const rank: Record<TileState, number> = { green: 3, yellow: 2, gray: 1 };
    const stateRank: Record<string, number> = {
      correct: 3,
      present: 2,
      absent: 1,
    };
    const apply = (L: string, s: LetterState, r: number) => {
      const existingRank = map[L] ? (stateRank[map[L]] ?? 0) : 0;
      if (r > existingRank) map[L] = s;
    };
    tiles.forEach((t) => {
      if (!t.letter) return;
      const s: LetterState =
        t.state === "green" ? "correct" : t.state === "yellow" ? "present" : "absent";
      apply(t.letter, s, rank[t.state]);
    });
    extraGray.forEach((L) => apply(L, "absent", 1));
    return map;
  }, [tiles, extraGray]);

  const { candidates, hasConstraint } = useMemo(() => {
    const greens: { i: number; L: string }[] = [];
    const yellows: { i: number; L: string }[] = [];
    const grays = new Set<string>(extraGray);
    const required = new Set<string>();
    tiles.forEach((t, i) => {
      if (!t.letter) return;
      if (t.state === "green") {
        greens.push({ i, L: t.letter });
        required.add(t.letter);
      } else if (t.state === "yellow") {
        yellows.push({ i, L: t.letter });
        required.add(t.letter);
      } else {
        grays.add(t.letter);
      }
    });
    // A letter that is required elsewhere must not be treated as absent.
    required.forEach((L) => grays.delete(L));

    const constrained =
      greens.length > 0 || yellows.length > 0 || grays.size > 0;

    if (!universe) return { candidates: [] as string[], hasConstraint: constrained };
    if (!constrained) return { candidates: [], hasConstraint: false };

    const out = universe.filter((word) => {
      for (const g of greens) if (word[g.i] !== g.L) return false;
      for (const y of yellows) {
        if (!word.includes(y.L)) return false;
        if (word[y.i] === y.L) return false;
      }
      for (const L of grays) if (word.includes(L)) return false;
      return true;
    });

    out.sort((a, b) =>
      sort === "az" ? a.localeCompare(b) : guessScore(b) - guessScore(a) || a.localeCompare(b)
    );
    return { candidates: out, hasConstraint: true };
  }, [universe, tiles, extraGray, sort]);

  const loading = universe === null;
  const shown = showAll ? candidates : candidates.slice(0, MAX_SHOWN);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Input tiles */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-[6px]" role="group" aria-label="Wordle clue tiles">
          {tiles.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => cycleTile(i)}
              aria-label={
                t.letter
                  ? `${t.letter}, ${t.state === "green" ? "correct spot" : t.state === "yellow" ? "wrong spot" : "not in word"} — tap to change`
                  : "empty tile"
              }
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-[4px] border-2 font-heading text-xl font-extrabold uppercase transition-colors sm:h-14 sm:w-14 sm:text-2xl",
                t.letter ? TILE_CLASS[t.state] : TILE_EMPTY
              )}
            >
              {t.letter}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Type your letters, then tap a tile:{" "}
          <span className="font-semibold text-[#6aaa64] dark:text-[#7cbf70]">green</span> = right spot,{" "}
          <span className="font-semibold text-[#b59f3b] dark:text-[#c9b458]">yellow</span> = wrong spot,{" "}
          <span className="font-semibold text-[#787c7e]">gray</span> = not in the word.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {/* Length switch */}
        <div className="inline-flex overflow-hidden rounded-lg border border-border">
          {WORD_LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setLength(n)}
              className={cn(
                "px-3 py-1.5 text-sm font-semibold transition",
                length === n
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
              aria-pressed={length === n}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Answer-only toggle */}
        <button
          type="button"
          onClick={() => setAnswerOnly((v) => !v)}
          aria-pressed={answerOnly}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition",
            answerOnly
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {answerOnly ? "Answer words only" : "All valid guesses"}
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          Clear
        </button>
      </div>

      {/* Extra gray letters */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">
          Letters not in the word:
        </label>
        {extraGray.map((L) => (
          <button
            key={L}
            type="button"
            onClick={() => setExtraGray((prev) => prev.filter((x) => x !== L))}
            className="inline-flex items-center gap-1 rounded-md bg-[#787c7e] px-2 py-0.5 font-mono text-xs font-semibold text-white dark:bg-[#3a3a3c]"
            aria-label={`Remove ${L} from excluded letters`}
          >
            {L} ✕
          </button>
        ))}
        <input
          value={grayInput}
          onChange={(e) => setGrayInput(e.target.value.replace(/[^a-zA-Z]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === ",") {
              e.preventDefault();
              addGrayFromInput(grayInput);
            }
          }}
          onBlur={() => addGrayFromInput(grayInput)}
          placeholder="e.g. slo"
          className="w-24 rounded-md border border-input bg-background px-2 py-1 font-mono text-sm outline-none focus:border-primary"
          aria-label="Add letters that are not in the word"
        />
      </div>

      {/* Results header */}
      <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-4">
        <div aria-live="polite">
          <span className="font-heading text-3xl font-extrabold tabular-nums text-[hsl(var(--cta))]">
            {loading ? "…" : hasConstraint ? candidates.length : "—"}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {hasConstraint ? "possible words" : "enter your clues"}
          </span>
        </div>
        {hasConstraint && candidates.length > 0 && (
          <div className="inline-flex overflow-hidden rounded-lg border border-border text-xs">
            {(["best", "az"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSort(m)}
                className={cn(
                  "px-2.5 py-1 font-semibold transition",
                  sort === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                )}
                aria-pressed={sort === m}
              >
                {m === "best" ? "Best guess" : "A–Z"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-3 min-h-[3rem]">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading word list…</p>
        ) : !hasConstraint ? (
          <p className="text-sm text-muted-foreground">
            Tap a tile and set a green, yellow or gray clue — or add letters that
            aren&apos;t in the word — to see every word that still fits.
          </p>
        ) : candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No words match these clues. Double-check for a letter marked both
            present and not-in-word.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {shown.map((word) => (
                <span
                  key={word}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-sm font-medium uppercase tracking-wide text-foreground"
                >
                  {word}
                </span>
              ))}
            </div>
            {!showAll && candidates.length > MAX_SHOWN && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Show all {candidates.length} words →
              </button>
            )}
          </>
        )}
      </div>

      {/* On-screen keyboard (also captures physical typing) */}
      <div className="mt-6">
        <WordleKeyboard onKey={onKey} letterStates={letterStates} />
      </div>
    </div>
  );
}
