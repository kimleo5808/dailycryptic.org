"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StrandsGameProps {
  puzzleId: number;
  clue: string;
  /** 8×6 letter grid */
  startingBoard: string[];
  /** base64-encoded theme word keys → coordinates */
  encodedThemeCoords: Record<string, [number, number][]>;
  /** base64-encoded spangram */
  encodedSpangram: string;
  /** spangram coordinates */
  spangramCoords: [number, number][];
  /** base64-encoded theme words */
  encodedThemeWords: string[];
}

interface Cell {
  row: number;
  col: number;
  letter: string;
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

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

function areAdjacent(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
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
  /* ---------- decode data client-side ---------- */
  const themeWords = useMemo(
    () => encodedThemeWords.map(fromBase64),
    [encodedThemeWords]
  );

  const spangram = useMemo(() => fromBase64(encodedSpangram), [encodedSpangram]);

  // Map: decoded word → its coordinates
  const wordCoordsMap = useMemo(() => {
    const m = new Map<string, [number, number][]>();
    for (const [encoded, coords] of Object.entries(encodedThemeCoords)) {
      m.set(fromBase64(encoded), coords);
    }
    m.set(spangram, spangramCoords);
    return m;
  }, [encodedThemeCoords, spangramCoords, spangram]);

  const totalThemeWords = themeWords.length;

  /* ---------- grid ---------- */
  const grid: Cell[][] = useMemo(
    () =>
      startingBoard.map((row, r) =>
        row.split("").map((letter, c) => ({ row: r, col: c, letter }))
      ),
    [startingBoard]
  );

  /* ---------- state ---------- */
  const [cellStates, setCellStates] = useState<Map<string, CellState>>(
    new Map()
  );
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [spangramFound, setSpangramFound] = useState(false);
  const [path, setPath] = useState<[number, number][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info">("info");
  const [hintCount, setHintCount] = useState(0);
  const [nonThemeCount, setNonThemeCount] = useState(0);
  const [shakeCells, setShakeCells] = useState(false);
  const [hintedCell, setHintedCell] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const gameOver = foundWords.length === totalThemeWords && spangramFound;
  const foundCount = foundWords.length + (spangramFound ? 1 : 0);
  const targetCount = totalThemeWords + 1; // theme words + spangram

  /* ---------- word from path ---------- */
  const currentWord = useMemo(
    () => path.map(([r, c]) => grid[r][c].letter).join(""),
    [path, grid]
  );

  /* ---------- path set for quick lookup ---------- */
  const pathSet = useMemo(() => {
    const s = new Set<string>();
    for (const [r, c] of path) s.add(cellKey(r, c));
    return s;
  }, [path]);

  /* ---------- check if a word matches any theme word or spangram ---------- */
  const checkWord = useCallback(
    (word: string) => {
      const upper = word.toUpperCase();
      if (upper === spangram && !spangramFound) return "spangram";
      if (themeWords.includes(upper) && !foundWords.includes(upper))
        return "theme";
      return null;
    },
    [spangram, spangramFound, themeWords, foundWords]
  );

  /* ---------- mark cells for a found word ---------- */
  const markCells = useCallback(
    (word: string, type: CellState) => {
      const coords = wordCoordsMap.get(word);
      if (!coords) return;
      setCellStates((prev) => {
        const next = new Map(prev);
        for (const [r, c] of coords) {
          next.set(cellKey(r, c), type);
        }
        return next;
      });
    },
    [wordCoordsMap]
  );

  /* ---------- submit current path ---------- */
  const submitPath = useCallback(() => {
    if (path.length < 3) {
      setPath([]);
      return;
    }

    const word = path.map(([r, c]) => grid[r][c].letter).join("").toUpperCase();
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
      // Not a theme word - count towards hint
      if (word.length >= 4) {
        const newCount = nonThemeCount + 1;
        setNonThemeCount(newCount);
        if (newCount % 3 === 0) {
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
    setPath([]);
  }, [path, grid, checkWord, markCells, spangram, nonThemeCount]);

  /* ---------- use hint ---------- */
  function useHint() {
    if (hintCount <= 0) return;

    // Find an unfound theme word and highlight its first letter
    const unfound = themeWords.filter(
      (w) => !foundWords.includes(w)
    );
    const target = !spangramFound ? [spangram, ...unfound] : unfound;
    if (target.length === 0) return;

    const word = target[Math.floor(Math.random() * target.length)];
    const coords = wordCoordsMap.get(word);
    if (!coords || coords.length === 0) return;

    const [r, c] = coords[0];
    setHintedCell(cellKey(r, c));
    setHintCount((prev) => prev - 1);
    setTimeout(() => setHintedCell(null), 3000);
  }

  /* ---------- cell hit-testing ---------- */
  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      // Use elementFromPoint for accurate hit-testing
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return null;
      const attr = el.getAttribute("data-cell");
      if (!attr) return null;
      const [r, c] = attr.split("-").map(Number);
      if (isNaN(r) || isNaN(c)) return null;
      return [r, c];
    },
    []
  );

  const isCellUsable = useCallback(
    (r: number, c: number): boolean => {
      const state = cellStates.get(cellKey(r, c));
      return state !== "found" && state !== "spangram";
    },
    [cellStates]
  );

  /* ---------- add cell to path (shared by drag + click) ---------- */
  const addCellToPath = useCallback(
    (r: number, c: number) => {
      if (!isCellUsable(r, c)) return;

      setPath((prev) => {
        if (prev.length === 0) return [[r, c]];

        const last = prev[prev.length - 1];
        // Same cell — ignore
        if (last[0] === r && last[1] === c) return prev;

        // Going back to previous cell — undo last step
        if (prev.length >= 2) {
          const secondLast = prev[prev.length - 2];
          if (secondLast[0] === r && secondLast[1] === c) {
            return prev.slice(0, -1);
          }
        }

        // Must be adjacent
        if (!areAdjacent(last[0], last[1], r, c)) return prev;

        // No revisiting
        if (prev.some(([pr, pc]) => pr === r && pc === c)) return prev;

        return [...prev, [r, c]];
      });
    },
    [isCellUsable]
  );

  /* ---------- drag handlers (pointer events on grid container) ---------- */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (gameOver) return;
      const cell = getCellFromPoint(e.clientX, e.clientY);
      if (!cell || !isCellUsable(cell[0], cell[1])) return;

      e.preventDefault();
      // Capture pointer on the grid container itself
      gridRef.current?.setPointerCapture(e.pointerId);
      setIsDragging(true);
      setPath([cell]);
      setFeedback(null);
    },
    [gameOver, getCellFromPoint, isCellUsable]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || gameOver) return;
      const cell = getCellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      addCellToPath(cell[0], cell[1]);
    },
    [isDragging, gameOver, getCellFromPoint, addCellToPath]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      gridRef.current?.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      // Only auto-submit on drag if we dragged through multiple cells
      if (path.length >= 3) {
        submitPath();
      }
      // If path is 1-2 cells from a very short drag, keep path for click-mode continuation
    },
    [isDragging, path.length, submitPath]
  );

  /* ---------- click handler (tap individual cells) ---------- */
  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (gameOver || isDragging) return;
      if (!isCellUsable(r, c)) return;

      setFeedback(null);

      // If no path yet, start one
      if (path.length === 0) {
        setPath([[r, c]]);
        return;
      }

      const last = path[path.length - 1];

      // Clicking the same cell as last — ignore
      if (last[0] === r && last[1] === c) return;

      // Clicking the second-to-last cell — undo
      if (path.length >= 2) {
        const secondLast = path[path.length - 2];
        if (secondLast[0] === r && secondLast[1] === c) {
          setPath(path.slice(0, -1));
          return;
        }
      }

      // Adjacent — add to path
      if (areAdjacent(last[0], last[1], r, c)) {
        // Not already in path
        if (!path.some(([pr, pc]) => pr === r && pc === c)) {
          setPath([...path, [r, c]]);
          return;
        }
      }

      // Not adjacent or already visited — start a new path from this cell
      setPath([[r, c]]);
    },
    [gameOver, isDragging, isCellUsable, path]
  );

  /* ---------- prevent scroll while dragging on mobile ---------- */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (isDragging) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, [isDragging]);

  /* ---------- render ---------- */
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Layout: stacked on mobile, side by side on desktop */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
        {/* Left: theme + progress + hint */}
        <div className="flex w-full max-w-xs flex-col items-center gap-4 lg:pt-8">
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

          {/* Found words list */}
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

          {/* Hint button */}
          <button
            type="button"
            onClick={useHint}
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

          {/* Current selection preview */}
          {path.length > 0 && (
            <div className="rounded-lg bg-muted px-4 py-2 text-center">
              <p className="font-heading text-lg font-bold tracking-wider text-foreground">
                {currentWord}
              </p>
            </div>
          )}

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

        {/* Right: letter grid + actions */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={gridRef}
            className={`grid select-none touch-none ${shakeCells ? "animate-[shake_0.3s_ease-in-out]" : ""}`}
            style={{
              gridTemplateColumns: "repeat(6, 1fr)",
              gridTemplateRows: `repeat(${startingBoard.length}, 1fr)`,
              width: "min(360px, 85vw)",
              aspectRatio: `6 / ${startingBoard.length}`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {grid.flatMap((row) =>
              row.map((cell) => {
                const key = cellKey(cell.row, cell.col);
                const state = cellStates.get(key);
                const inPath = pathSet.has(key);
                const isHinted = hintedCell === key;
                const isLast =
                  path.length > 0 &&
                  path[path.length - 1][0] === cell.row &&
                  path[path.length - 1][1] === cell.col;

                let bg = "";
                let textColor = "text-foreground";

                if (state === "spangram") {
                  bg = "bg-amber-300 dark:bg-amber-500";
                  textColor = "text-amber-950";
                } else if (state === "found") {
                  bg = "bg-blue-300 dark:bg-blue-500";
                  textColor = "text-blue-950";
                } else if (isLast) {
                  bg = "bg-sky-400 dark:bg-sky-600";
                  textColor = "text-white";
                } else if (inPath) {
                  bg = "bg-sky-200 dark:bg-sky-700";
                } else if (isHinted) {
                  bg = "bg-amber-100 dark:bg-amber-900 ring-2 ring-amber-400";
                }

                return (
                  <div
                    key={key}
                    data-cell={key}
                    onClick={() => handleCellClick(cell.row, cell.col)}
                    className={`flex items-center justify-center rounded-sm text-lg font-bold transition-colors duration-100 sm:text-xl ${bg} ${textColor} ${
                      state ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    {cell.letter}
                  </div>
                );
              })
            )}
          </div>

          {/* Submit / Clear buttons for click mode */}
          {!gameOver && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPath([])}
                disabled={path.length === 0}
                className={`rounded-full border border-border px-5 py-2 text-sm font-semibold transition ${
                  path.length > 0
                    ? "bg-background text-foreground hover:bg-muted"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={submitPath}
                disabled={path.length < 3}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  path.length >= 3
                    ? "bg-stone-800 text-white hover:bg-stone-900 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-100"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600"
                }`}
              >
                Submit
              </button>
            </div>
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
