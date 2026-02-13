"use client";

import type { StrandsPuzzle } from "@/types/strands";

/**
 * Displays the 6×8 Strands letter grid with highlighted found words.
 * - Theme words highlighted in blue
 * - Spangram highlighted in amber/gold
 */

interface StrandsGridProps {
  puzzle: StrandsPuzzle;
  showAnswers?: boolean;
}

/** Build a lookup: [row][col] → { type, word } */
function buildCellMap(puzzle: StrandsPuzzle) {
  const map: Record<string, { type: "theme" | "spangram"; word: string }> = {};

  for (const coord of puzzle.spangramCoords) {
    map[`${coord[0]}-${coord[1]}`] = {
      type: "spangram",
      word: puzzle.spangram,
    };
  }

  for (const [word, coords] of Object.entries(puzzle.themeCoords)) {
    for (const coord of coords) {
      map[`${coord[0]}-${coord[1]}`] = { type: "theme", word };
    }
  }

  return map;
}

const CELL_BASE =
  "flex items-center justify-center rounded-md text-sm font-bold uppercase select-none aspect-square transition-colors";

const CELL_DEFAULT =
  "bg-strands-grid text-foreground";

const CELL_THEME =
  "bg-strands-theme text-white";

const CELL_SPANGRAM =
  "bg-strands-spangram text-amber-950";

export function StrandsGrid({ puzzle, showAnswers = false }: StrandsGridProps) {
  const cellMap = showAnswers ? buildCellMap(puzzle) : {};

  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="grid grid-cols-6 gap-1">
        {puzzle.startingBoard.map((row, rowIdx) =>
          row.split("").map((letter, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const cell = cellMap[key];

            let cellStyle = CELL_DEFAULT;
            if (cell?.type === "spangram") cellStyle = CELL_SPANGRAM;
            else if (cell?.type === "theme") cellStyle = CELL_THEME;

            return (
              <div key={key} className={`${CELL_BASE} ${cellStyle}`}>
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Static version that always shows answers */
export function StrandsGridStatic({ puzzle }: { puzzle: StrandsPuzzle }) {
  return <StrandsGrid puzzle={puzzle} showAnswers />;
}
