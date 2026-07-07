/**
 * Pip-face rendering for Pips dominoes. `PipFace` draws the standard die-face
 * dot layout for a value 0–6 inside a 1×1 unit cell placed at (x, y) with a
 * given `size`. Used by the solved-board renderer (and partial hints).
 */

// Dot positions as fractions of the cell, in standard die layout.
const P = {
  TL: [0.28, 0.28],
  TR: [0.72, 0.28],
  ML: [0.28, 0.5],
  MR: [0.72, 0.5],
  C: [0.5, 0.5],
  BL: [0.28, 0.72],
  BR: [0.72, 0.72],
} as const;

const LAYOUTS: Record<number, (readonly [number, number])[]> = {
  0: [],
  1: [P.C],
  2: [P.TL, P.BR],
  3: [P.TL, P.C, P.BR],
  4: [P.TL, P.TR, P.BL, P.BR],
  5: [P.TL, P.TR, P.C, P.BL, P.BR],
  6: [P.TL, P.TR, P.ML, P.MR, P.BL, P.BR],
};

export function PipFace({
  value,
  x,
  y,
  size,
  className = "fill-foreground",
}: {
  value: number;
  x: number;
  y: number;
  size: number;
  className?: string;
}) {
  const dots = LAYOUTS[value] ?? [];
  const r = size * 0.075;
  return (
    <g>
      {dots.map(([fx, fy], i) => (
        <circle
          key={i}
          cx={x + fx * size}
          cy={y + fy * size}
          r={r}
          className={className}
        />
      ))}
    </g>
  );
}
