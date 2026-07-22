import type { PipsDecodedTier, PipsCell, PipsRegion } from "@/types/pips";
import { PipFace } from "./PipsDomino";

/** Short badge glyph for a region constraint (inlined so this stays free of
 *  the data layer and is safe to render on the client). */
function regionBadge(region: PipsRegion): string {
  switch (region.type) {
    case "equals":
      return "=";
    case "unequal":
      return "≠";
    case "sum":
      return `${region.target}`;
    case "greater":
      return `>${region.target}`;
    case "less":
      return `<${region.target}`;
    default:
      return "";
  }
}

const CELL = 52;
const GAP = 3;

// Region tint palette, cycling the site's chart tokens.
const REGION_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function cellKey([r, c]: PipsCell) {
  return `${r},${c}`;
}

/** The region a cell belongs to, plus that region's palette index. */
function buildCellRegionMap(tier: PipsDecodedTier) {
  const map = new Map<string, { colorIndex: number; regionIndex: number }>();
  tier.regions.forEach((region, regionIndex) => {
    region.indices.forEach((cell) => {
      map.set(cellKey(cell), {
        colorIndex: regionIndex % REGION_COLORS.length,
        regionIndex,
      });
    });
  });
  return map;
}

/** Anchor cell of a region (top-most, then left-most) for the badge. */
function anchorCell(indices: PipsCell[]): PipsCell {
  return [...indices].sort((a, b) => a[0] - b[0] || a[1] - b[1])[0];
}

/**
 * The puzzle face: colored regions with constraint badges. This is NOT a
 * spoiler — it is the board every player sees. `solved` overlays the answer.
 */
export default function PipsBoard({
  tier,
  solved = false,
  className,
}: {
  tier: PipsDecodedTier;
  solved?: boolean;
  className?: string;
}) {
  const width = tier.cols * CELL;
  const height = tier.rows * CELL;
  const cellRegion = buildCellRegionMap(tier);

  // For the solved view, map each board cell to its pip value.
  const cellValue = new Map<string, number>();
  if (solved) {
    for (const p of tier.placements) {
      cellValue.set(cellKey(p.cells[0]), p.values[0]);
      cellValue.set(cellKey(p.cells[1]), p.values[1]);
    }
  }

  return (
    <div className={className ?? "overflow-x-auto"}>
      <svg
        viewBox={`-4 -4 ${width + 8} ${height + 8}`}
        className="mx-auto h-auto"
        style={{ maxWidth: Math.min(width + 8, 520), width: "100%" }}
        role="img"
        aria-label={
          solved
            ? "Solved Pips board with all dominoes placed"
            : "Pips puzzle board with region constraints"
        }
      >
        {tier.boardCells.map((cell) => {
          const [r, c] = cell;
          const info = cellRegion.get(cellKey(cell));
          const region = info ? tier.regions[info.regionIndex] : undefined;
          // "empty" is an unconstrained cell (no numbered rule) — render it
          // neutral. It still receives a domino in the solution.
          const isEmpty = region?.type === "empty";
          const color = info ? REGION_COLORS[info.colorIndex] : "var(--chart-1)";
          const x = c * CELL + GAP / 2;
          const y = r * CELL + GAP / 2;
          const size = CELL - GAP;
          const value = cellValue.get(cellKey(cell));

          return (
            <g key={cellKey(cell)}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                rx={8}
                fill={isEmpty ? "hsl(var(--muted))" : `hsl(${color})`}
                fillOpacity={isEmpty ? 1 : solved ? 0.1 : 0.16}
                stroke={isEmpty ? "hsl(var(--border))" : `hsl(${color})`}
                strokeOpacity={isEmpty ? 1 : 0.6}
                strokeWidth={1.5}
              />
              {solved && typeof value === "number" && (
                <PipFace
                  value={value}
                  x={x}
                  y={y}
                  size={size}
                  className="fill-foreground"
                />
              )}
            </g>
          );
        })}

        {/* Solved: outline each domino across its two cells in gold. */}
        {solved &&
          tier.placements.map((p, i) => {
            const [[r1, c1], [r2, c2]] = p.cells;
            const minR = Math.min(r1, r2);
            const minC = Math.min(c1, c2);
            const spanR = Math.abs(r1 - r2) + 1;
            const spanC = Math.abs(c1 - c2) + 1;
            return (
              <rect
                key={i}
                x={minC * CELL + GAP / 2}
                y={minR * CELL + GAP / 2}
                width={spanC * CELL - GAP}
                height={spanR * CELL - GAP}
                rx={8}
                fill="none"
                stroke="hsl(var(--cta))"
                strokeWidth={2.25}
              />
            );
          })}

        {/* Constraint badges at each region's anchor cell (puzzle face only). */}
        {!solved &&
          tier.regions.map((region, i) => {
            if (region.type === "empty") return null;
            const badge = regionBadge(region);
            if (!badge) return null;
            const [ar, ac] = anchorCell(region.indices);
            const cx = ac * CELL + CELL / 2;
            const cy = ar * CELL + CELL / 2;
            return (
              <text
                key={`badge-${i}`}
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground font-mono font-bold"
                style={{ fontSize: "18px" }}
              >
                {badge}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
