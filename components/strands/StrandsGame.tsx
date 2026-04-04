"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StrandsGameProps {
  puzzleId: number;
  clue: string;
  startingBoard: string[];
  encodedThemeCoords: Record<string, [number, number][]>;
  encodedSpangram: string;
  spangramCoords: [number, number][];
  encodedThemeWords: string[];
}

type CellState = "default" | "found" | "spangram";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fromBase64(s: string): string {
  try {
    return atob(s);
  } catch {
    return s;
  }
}

function cellKey(r: number, c: number): string {
  return `${r}-${c}`;
}

function areAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  return (
    Math.abs(r1 - r2) <= 1 &&
    Math.abs(c1 - c2) <= 1 &&
    !(r1 === r2 && c1 === c2)
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StrandsGame({
  puzzleId,
  clue,
  startingBoard,
  encodedThemeCoords,
  encodedSpangram,
  spangramCoords,
  encodedThemeWords,
}: StrandsGameProps) {
  const ROWS = startingBoard.length;
  const COLS = 6;

  /* ---------- decode ---------- */
  const themeWords = useMemo(
    () => encodedThemeWords.map(fromBase64),
    [encodedThemeWords]
  );
  const spangram = useMemo(
    () => fromBase64(encodedSpangram),
    [encodedSpangram]
  );
  const wordCoordsMap = useMemo(() => {
    const m = new Map<string, [number, number][]>();
    for (const [enc, coords] of Object.entries(encodedThemeCoords)) {
      m.set(fromBase64(enc), coords);
    }
    m.set(spangram, spangramCoords);
    return m;
  }, [encodedThemeCoords, spangramCoords, spangram]);

  /* ---------- grid letters ---------- */
  const letters = useMemo(
    () => startingBoard.map((row) => row.split("")),
    [startingBoard]
  );

  /* ---------- state ---------- */
  const [cellStates, setCellStates] = useState<Map<string, CellState>>(
    new Map()
  );
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [spangramFound, setSpangramFound] = useState(false);
  const [path, setPath] = useState<[number, number][]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<
    "success" | "error" | "info"
  >("info");
  const [hintCount, setHintCount] = useState(0);
  const [nonThemeCount, setNonThemeCount] = useState(0);
  const [shakeCells, setShakeCells] = useState(false);
  const [hintedCell, setHintedCell] = useState<string | null>(null);

  const dragging = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const gameOver = foundWords.length === themeWords.length && spangramFound;
  const foundCount = foundWords.length + (spangramFound ? 1 : 0);
  const targetCount = themeWords.length + 1;

  /* ---------- derived ---------- */
  const currentWord = useMemo(
    () => path.map(([r, c]) => letters[r][c]).join(""),
    [path, letters]
  );
  const pathSet = useMemo(() => {
    const s = new Set<string>();
    for (const [r, c] of path) s.add(cellKey(r, c));
    return s;
  }, [path]);

  /* ---------- helpers ---------- */
  const checkWord = useCallback(
    (word: string) => {
      const u = word.toUpperCase();
      if (u === spangram && !spangramFound) return "spangram";
      if (themeWords.includes(u) && !foundWords.includes(u)) return "theme";
      return null;
    },
    [spangram, spangramFound, themeWords, foundWords]
  );

  const markCells = useCallback(
    (word: string, type: CellState) => {
      const coords = wordCoordsMap.get(word);
      if (!coords) return;
      setCellStates((prev) => {
        const next = new Map(prev);
        for (const [r, c] of coords) next.set(cellKey(r, c), type);
        return next;
      });
    },
    [wordCoordsMap]
  );

  const isCellUsable = useCallback(
    (r: number, c: number) => {
      const st = cellStates.get(cellKey(r, c));
      return st !== "found" && st !== "spangram";
    },
    [cellStates]
  );

  /* ---------- submit ---------- */
  const doSubmit = useCallback(
    (p: [number, number][]) => {
      if (p.length < 3) return;
      const word = p.map(([r, c]) => letters[r][c]).join("").toUpperCase();
      const result = checkWord(word);

      if (result === "spangram") {
        setSpangramFound(true);
        markCells(spangram, "spangram");
        setFeedback("Spangram found!");
        setFeedbackType("success");
        setTimeout(() => setFeedback(null), 2000);
      } else if (result === "theme") {
        setFoundWords((prev) => [...prev, word]);
        markCells(word, "found");
        setFeedback(`Found: ${word}`);
        setFeedbackType("success");
        setTimeout(() => setFeedback(null), 2000);
      } else {
        if (word.length >= 4) {
          const nc = nonThemeCount + 1;
          setNonThemeCount(nc);
          if (nc % 3 === 0) {
            setHintCount((prev) => prev + 1);
            setFeedback("Hint earned!");
            setFeedbackType("info");
            setTimeout(() => setFeedback(null), 2000);
          } else {
            setShakeCells(true);
            setTimeout(() => setShakeCells(false), 400);
          }
        } else {
          setShakeCells(true);
          setTimeout(() => setShakeCells(false), 400);
        }
      }
    },
    [letters, checkWord, markCells, spangram, nonThemeCount]
  );

  /* ---------- hint ---------- */
  function handleHint() {
    if (hintCount <= 0) return;
    const unfound = themeWords.filter((w) => !foundWords.includes(w));
    const targets = !spangramFound ? [spangram, ...unfound] : unfound;
    if (targets.length === 0) return;
    const word = targets[Math.floor(Math.random() * targets.length)];
    const coords = wordCoordsMap.get(word);
    if (!coords || coords.length === 0) return;
    setHintedCell(cellKey(coords[0][0], coords[0][1]));
    setHintCount((prev) => prev - 1);
    setTimeout(() => setHintedCell(null), 3000);
  }

  /* ---------- coordinate hit-test from pointer position ---------- */
  const cellFromPointer = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const el = gridRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cw = rect.width / COLS;
      const ch = rect.height / ROWS;
      const col = Math.floor(x / cw);
      const row = Math.floor(y / ch);
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
      return [row, col];
    },
    [ROWS, COLS]
  );

  /* ---------- path building ---------- */
  const tryAddCell = useCallback(
    (r: number, c: number, prev: [number, number][]): [number, number][] => {
      if (!isCellUsable(r, c)) return prev;
      if (prev.length === 0) return [[r, c]];

      const [lr, lc] = prev[prev.length - 1];
      if (lr === r && lc === c) return prev; // same cell

      // undo: going back
      if (prev.length >= 2) {
        const [sr, sc] = prev[prev.length - 2];
        if (sr === r && sc === c) return prev.slice(0, -1);
      }

      if (!areAdjacent(lr, lc, r, c)) return prev; // not adjacent
      if (prev.some(([pr, pc]) => pr === r && pc === c)) return prev; // revisit
      return [...prev, [r, c]];
    },
    [isCellUsable]
  );

  /* ---------- pointer handlers (all on grid container) ---------- */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    function onDown(e: PointerEvent) {
      if (gameOver) return;
      const cell = cellFromPointer(e.clientX, e.clientY);
      if (!cell) return;
      e.preventDefault();
      dragging.current = true;
      setPath([cell]);
      setFeedback(null);
    }

    function onMove(e: PointerEvent) {
      if (!dragging.current || gameOver) return;
      e.preventDefault();
      const cell = cellFromPointer(e.clientX, e.clientY);
      if (!cell) return;
      setPath((prev) => tryAddCell(cell[0], cell[1], prev));
    }

    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      setPath((prev) => {
        if (prev.length >= 3) {
          // Use setTimeout so state updates from doSubmit don't conflict
          setTimeout(() => doSubmit(prev), 0);
        }
        return [];
      });
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointercancel", onUp);

    // Prevent touch scrolling on the grid
    const preventTouch = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchstart", preventTouch, { passive: false });
    el.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("touchstart", preventTouch);
      el.removeEventListener("touchmove", preventTouch);
    };
  }, [gameOver, cellFromPointer, tryAddCell, doSubmit]);

  /* ---------- render ---------- */
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
        {/* Left panel */}
        <div className="flex w-full max-w-xs flex-col items-center gap-4 lg:pt-8">
          {/* Current word preview */}
          <div className="h-8">
            {path.length > 0 && (
              <p className="font-heading text-xl font-bold tracking-wider text-foreground">
                {currentWord}
              </p>
            )}
          </div>

          {/* Theme card */}
          <div className="w-full rounded-lg border border-border bg-background p-4 text-center">
            <p className="mb-1 inline-block rounded-sm bg-sky-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:bg-sky-800 dark:text-sky-200">
              Today&apos;s Theme
            </p>
            <p className="font-heading text-lg font-bold text-foreground">
              {clue}
            </p>
          </div>

          {/* Progress */}
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{foundCount}</span> of{" "}
            <span className="font-bold text-foreground">{targetCount}</span>{" "}
            theme words found.
          </p>

          {/* Found words */}
          {(foundWords.length > 0 || spangramFound) && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {spangramFound && (
                <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-800 dark:text-amber-100">
                  {spangram}
                </span>
              )}
              {foundWords.map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-900 dark:bg-blue-800 dark:text-blue-100"
                >
                  {w}
                </span>
              ))}
            </div>
          )}

          {/* Hint */}
          <button
            type="button"
            onClick={handleHint}
            disabled={hintCount <= 0 || gameOver}
            className={`rounded-full border border-border px-6 py-2 text-sm font-semibold transition ${
              hintCount > 0 && !gameOver
                ? "bg-background text-foreground hover:bg-muted"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Hint{hintCount > 0 ? ` (${hintCount})` : ""}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Find 3 non-theme words to earn a hint
          </p>

          {/* Feedback */}
          {feedback && (
            <p
              className={`text-center text-sm font-semibold ${
                feedbackType === "success"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : feedbackType === "error"
                    ? "text-destructive"
                    : "text-sky-600 dark:text-sky-400"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>

        {/* Right: grid */}
        <div
          ref={gridRef}
          className={`select-none touch-none ${shakeCells ? "animate-[shake_0.3s_ease-in-out]" : ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            width: "min(360px, 85vw)",
            aspectRatio: `${COLS} / ${ROWS}`,
            cursor: gameOver ? "default" : "pointer",
          }}
        >
          {letters.flatMap((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              const state = cellStates.get(key);
              const inPath = pathSet.has(key);
              const isLast =
                path.length > 0 &&
                path[path.length - 1][0] === r &&
                path[path.length - 1][1] === c;
              const isHinted = hintedCell === key;

              let bg = "";
              let textColor = "text-foreground";
              let ring = "";

              if (state === "spangram") {
                bg = "bg-amber-300 dark:bg-amber-500";
                textColor = "text-amber-950";
              } else if (state === "found") {
                bg = "bg-blue-300 dark:bg-blue-500";
                textColor = "text-blue-950";
              } else if (isLast) {
                bg = "bg-stone-400 dark:bg-stone-500";
                textColor = "text-white";
                ring = "ring-2 ring-stone-500 dark:ring-stone-400";
              } else if (inPath) {
                bg = "bg-stone-300 dark:bg-stone-600";
                textColor = "text-stone-900 dark:text-stone-100";
              } else if (isHinted) {
                bg = "bg-amber-100 dark:bg-amber-900";
                ring = "ring-2 ring-amber-400";
              }

              return (
                <div
                  key={key}
                  className={`pointer-events-none flex items-center justify-center rounded-full text-lg font-bold sm:text-xl ${bg} ${textColor} ${ring}`}
                  style={{ margin: "2px" }}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Game over */}
      {gameOver && (
        <div
          className="mt-6 space-y-3 text-center animate-fade-in-up"
          style={{ animationDuration: "0.4s" }}
        >
          <p className="font-heading text-lg font-bold text-foreground">
            Puzzle Complete!
          </p>
          <button
            type="button"
            onClick={() => {
              const text = [
                `Strands #${puzzleId}`,
                `"${clue}"`,
                `Found all ${targetCount} words`,
                "dailycryptic.org/strands-game",
              ].join("\n");
              navigator.clipboard?.writeText(text);
              setFeedback("Copied to clipboard!");
              setFeedbackType("success");
              setTimeout(() => setFeedback(null), 2000);
            }}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Share Results
          </button>
        </div>
      )}
    </div>
  );
}
