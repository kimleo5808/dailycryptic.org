/**
 * NYT Pips — data types.
 *
 * Pips is a daily domino-placement logic puzzle with three independent tiers
 * (Easy / Medium / Hard). Each tier gives you a set of domino tiles and a board
 * divided into regions with numeric/relational constraints; you place the
 * dominoes so every region's constraint holds.
 *
 * The domino tiles and the region constraints are the *puzzle face* (shown to
 * every player) and are stored in plain text. The `solution` (which cells each
 * domino occupies) is the answer, so it is stored base64-encoded — matching the
 * convention used by the other games on the site.
 */

export type PipsRegionType =
  | "equals"
  | "unequal"
  | "sum"
  | "greater"
  | "less"
  | "empty";

/** [row, col] board coordinate. */
export type PipsCell = [number, number];

export interface PipsRegion {
  type: PipsRegionType;
  /** Target value for sum/greater/less. Absent for equals/empty. */
  target?: number;
  indices: PipsCell[];
}

/** A single tier as stored in puzzles.json. */
export interface PipsTierRaw {
  id: number;
  /** Domino tiles available to place, each a pair of pip values 0–6. */
  dominoes: [number, number][];
  regions: PipsRegion[];
  /**
   * Base64-encoded JSON of the solution: an array of domino placements, each
   * a pair of cells [[r,c],[r,c]] in the SAME order as `dominoes`, with the
   * cell order matching the domino's value order.
   */
  solution: string;
}

export type PipsTierKey = "easy" | "medium" | "hard";

export interface PipsPuzzle {
  id: number;
  printDate: string;
  status?: "published" | "scheduled";
  editor?: string;
  tiers: Record<PipsTierKey, PipsTierRaw>;
}

export interface PipsDataFile {
  lastUpdated: string;
  puzzles: PipsPuzzle[];
}

/* ----------------------------- decoded shapes ---------------------------- */

/** A domino placement mapped onto the board, values included. */
export interface PipsPlacement {
  /** The two cells this domino occupies. */
  cells: [PipsCell, PipsCell];
  /** The pip value in each of the two cells, aligned with `cells`. */
  values: [number, number];
}

export interface PipsDecodedTier {
  id: number;
  dominoes: [number, number][];
  regions: PipsRegion[];
  placements: PipsPlacement[];
  /** Grid dimensions derived from all region + solution coordinates. */
  rows: number;
  cols: number;
  /** All cells that belong to the board (union of region indices). */
  boardCells: PipsCell[];
}

export interface PipsDecodedPuzzle {
  id: number;
  printDate: string;
  editor?: string;
  tiers: Record<PipsTierKey, PipsDecodedTier>;
}

export interface PipsMonthData {
  label: string;
  rangeLabel: string;
  puzzles: PipsDecodedPuzzle[];
}
