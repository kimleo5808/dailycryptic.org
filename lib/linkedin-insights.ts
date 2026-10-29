import type {
  DecodedLinkedInDay,
  DecodedQueens,
  DecodedTango,
  DecodedZip,
} from "@/types/linkedin";

/*
 * Board-specific facts for the LinkedIn Queens, Tango and Zip archive pages,
 * computed from the stored solution of each day. The NYT-style hints on those
 * pages are generic, so these figures are what makes each archive page about
 * its own board: where the crowns fall, how the sun/moon grid is built, and
 * where the Zip route spends its moves.
 */

/* ------------------------------- Queens ---------------------------------- */

export interface QueensInsights {
  size: number;
  /** Crown column for each row, top to bottom (1-based). */
  columnsByRow: number[];
  biggestJump: { fromRow: number; toRow: number; columns: number };
  edgeCrowns: number;
  sameSizeCount: number;
  archiveSize: number;
}

export function getQueensInsights(
  queens: DecodedQueens,
  archive: DecodedLinkedInDay[]
): QueensInsights {
  const n = queens.size;
  const columnsByRow = [...queens.queens]
    .sort((a, b) => a.row - b.row)
    .map((q) => q.col);

  let biggestJump = { fromRow: 1, toRow: 2, columns: 0 };
  for (let i = 1; i < columnsByRow.length; i++) {
    const jump = Math.abs(columnsByRow[i] - columnsByRow[i - 1]);
    if (jump > biggestJump.columns) biggestJump = { fromRow: i, toRow: i + 1, columns: jump };
  }

  const edgeCrowns = queens.queens.filter(
    (q) => q.row === 1 || q.row === n || q.col === 1 || q.col === n
  ).length;

  const sized = archive.filter((d) => d.queens);
  return {
    size: n,
    columnsByRow,
    biggestJump,
    edgeCrowns,
    sameSizeCount: sized.filter((d) => d.queens?.size === n).length,
    archiveSize: sized.length,
  };
}

/* -------------------------------- Tango ---------------------------------- */

export interface TangoInsights {
  /** Side-by-side matching pairs within rows. */
  rowPairs: number;
  /** Stacked matching pairs within columns. */
  columnPairs: number;
  /** Rows that strictly alternate (SMSMSM / MSMSMS), 1-based. */
  alternatingRows: number[];
  /** Pairs of rows that are exact opposites of each other, 1-based. */
  oppositeRows: [number, number][];
  /** Rows that repeat an earlier row exactly, as [earlier, later], 1-based. */
  repeatedRows: [number, number][];
}

function countPairs(lines: string[]): number {
  let pairs = 0;
  for (const line of lines) {
    for (let i = 1; i < line.length; i++) if (line[i] === line[i - 1]) pairs++;
  }
  return pairs;
}

export function getTangoInsights(tango: DecodedTango): TangoInsights {
  const rows = tango.rows;
  const columns = rows[0].split("").map((_, c) => rows.map((r) => r[c]).join(""));
  const flip = (s: string) => s.replace(/[SM]/g, (c) => (c === "S" ? "M" : "S"));

  const alternatingRows: number[] = [];
  const oppositeRows: [number, number][] = [];
  const repeatedRows: [number, number][] = [];
  rows.forEach((row, i) => {
    if (countPairs([row]) === 0) alternatingRows.push(i + 1);
    for (let j = i + 1; j < rows.length; j++) {
      if (rows[j] === flip(row)) oppositeRows.push([i + 1, j + 1]);
      if (rows[j] === row) repeatedRows.push([i + 1, j + 1]);
    }
  });

  return {
    rowPairs: countPairs(rows),
    columnPairs: countPairs(columns),
    alternatingRows,
    oppositeRows,
    repeatedRows,
  };
}

/* --------------------------------- Zip ----------------------------------- */

export interface ZipInsights {
  size: number;
  checkpoints: number;
  /** Null when the stored solution has no traced path. */
  route: {
    turns: number;
    longestStraight: number;
    longestStretch: { from: number; to: number; moves: number };
    shortestStretch: { from: number; to: number; moves: number };
  } | null;
  sameSizeCount: number;
  /** Average checkpoints on same-size boards in the archive. */
  sameSizeAvgCheckpoints: number;
}

export function getZipInsights(zip: DecodedZip, archive: DecodedLinkedInDay[]): ZipInsights {
  let route: ZipInsights["route"] = null;
  const path = zip.path;
  if (path && path.length > 1) {
    let turns = 0;
    let run = 1;
    let longestStraight = 1;
    for (let i = 1; i < path.length; i++) {
      const dir = `${path[i][0] - path[i - 1][0]},${path[i][1] - path[i - 1][1]}`;
      const prev = i > 1 ? `${path[i - 1][0] - path[i - 2][0]},${path[i - 1][1] - path[i - 2][1]}` : dir;
      if (dir === prev) run++;
      else {
        turns++;
        run = 2;
      }
      longestStraight = Math.max(longestStraight, run);
    }

    const indexOf = (row: number, col: number) =>
      path.findIndex(([r, c]) => r === row && c === col);
    const points = [...zip.waypoints].sort((a, b) => a.num - b.num);
    const stretches = points.slice(1).map((p, i) => ({
      from: points[i].num,
      to: p.num,
      moves: indexOf(p.row, p.col) - indexOf(points[i].row, points[i].col),
    }));
    if (stretches.length > 0 && stretches.every((s) => s.moves > 0)) {
      const longest = stretches.reduce((a, b) => (b.moves > a.moves ? b : a));
      const shortest = stretches.reduce((a, b) => (b.moves < a.moves ? b : a));
      route = { turns, longestStraight, longestStretch: longest, shortestStretch: shortest };
    }
  }

  const sameSize = archive.filter((d) => d.zip?.size === zip.size);
  const avg =
    sameSize.reduce((n, d) => n + (d.zip?.waypoints.length ?? 0), 0) / Math.max(sameSize.length, 1);
  return {
    size: zip.size,
    checkpoints: zip.waypoints.length,
    route,
    sameSizeCount: sameSize.length,
    sameSizeAvgCheckpoints: Math.round(avg * 10) / 10,
  };
}
