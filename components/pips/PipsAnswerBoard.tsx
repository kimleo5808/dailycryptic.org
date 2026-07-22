import type { PipsDecodedTier, PipsCell, PipsPlacement } from "@/types/pips";
import { describeRegion } from "@/lib/pips-data";
import PipsBoard from "./PipsBoard";

/**
 * Server-rendered answer board for Pips.
 *
 * Unlike the interactive {@link PipsTierView} (which only mounts one tier at a
 * time on the client after a click), this component renders the full solution
 * for ALL three tiers directly in the server HTML so search engines can index
 * the actual answers. Because `PipsBoard` is a pure SVG component with no hooks,
 * we render the solved board server-side; alongside it we also emit a plain-text
 * breakdown of every region and every domino placement — the crawlable core of
 * the answer, unique to each date.
 *
 * The whole thing stays spoiler-protected for humans behind a native <details>
 * element (no JS needed), whose collapsed content is still present in the DOM
 * and fully crawlable.
 */

interface TierEntry {
  key: string;
  label: string;
  tier: PipsDecodedTier;
}

/** 1-indexed, human-readable coordinate for a board cell. */
function cellLabel([r, c]: PipsCell): string {
  return `row ${r + 1}, column ${c + 1}`;
}

/** Build a map from "r,c" to the pip value placed there in the solution. */
function valueMap(tier: PipsDecodedTier): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of tier.placements) {
    map.set(`${p.cells[0][0]},${p.cells[0][1]}`, p.values[0]);
    map.set(`${p.cells[1][0]},${p.cells[1][1]}`, p.values[1]);
  }
  return map;
}

/** Natural-language description of a single domino's placement. */
function describePlacement(p: PipsPlacement): string {
  const [[r1, c1], [r2, c2]] = p.cells;
  const [v1, v2] = p.values;
  const orientation = r1 === r2 ? "horizontally" : "vertically";
  return `The ${v1}-${v2} domino sits ${orientation}: ${v1} at ${cellLabel([
    r1,
    c1,
  ])} and ${v2} at ${cellLabel([r2, c2])}.`;
}

/** Verification sentence for one constrained region, with the values filled. */
function describeSolvedRegion(
  tier: PipsDecodedTier,
  regionIndex: number,
  values: Map<string, number>
): string | null {
  const region = tier.regions[regionIndex];
  if (region.type === "empty") return null;

  const pips = region.indices.map((cell) => values.get(`${cell[0]},${cell[1]}`));
  if (pips.some((v) => typeof v !== "number")) return null;
  const nums = pips as number[];
  const total = nums.reduce((a, b) => a + b, 0);
  const list = nums.join(", ");

  switch (region.type) {
    case "equals":
      return `The "equal" region (${region.indices.length} cells) is filled with ${list} — every cell matches, as required.`;
    case "unequal":
      return `The "all different" region (${region.indices.length} cells) is filled with ${list} — no value repeats.`;
    case "sum":
      return `The "sum to ${region.target}" region is filled with ${list}, which totals ${total}.`;
    case "greater":
      return `The "greater than ${region.target}" region is filled with ${list}, totalling ${total} — above ${region.target}.`;
    case "less":
      return `The "less than ${region.target}" region is filled with ${list}, totalling ${total} — below ${region.target}.`;
    default:
      return `The ${describeRegion(region)} region is filled with ${list}.`;
  }
}

function TierSolution({ label, tier }: { label: string; tier: PipsDecodedTier }) {
  const values = valueMap(tier);
  const regionLines = tier.regions
    .map((_, i) => describeSolvedRegion(tier, i, values))
    .filter((line): line is string => line !== null);

  return (
    <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <h3 className="font-heading text-base font-bold text-foreground">
        {label} — solved board
      </h3>

      {/* Server-rendered solved board (SVG, no client JS). */}
      <div className="mt-3">
        <PipsBoard tier={tier} solved />
      </div>

      {/* Crawlable text solution: how every region is satisfied. */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          How each region is satisfied
        </p>
        <ul className="mt-2 space-y-1.5">
          {regionLines.map((line, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Crawlable text solution: exact domino placements. */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Domino placements ({tier.placements.length})
        </p>
        <ul className="mt-2 space-y-1.5">
          {tier.placements.map((p, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {describePlacement(p)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PipsAnswerBoard({
  tiers,
  printDate,
  defaultOpen = false,
}: {
  tiers: TierEntry[];
  printDate: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-foreground">
          Full Pips Solutions — {printDate}
        </span>
        <span className="rounded-lg bg-destructive px-4 py-1.5 text-xs font-semibold text-destructive-foreground transition group-open:bg-muted group-open:text-muted-foreground">
          <span className="group-open:hidden">Reveal answers</span>
          <span className="hidden group-open:inline">Hide answers</span>
        </span>
      </summary>

      <p className="mt-3 text-xs text-muted-foreground">
        Spoiler warning — the solved board and every domino placement for Easy,
        Medium and Hard are shown below.
      </p>

      <div className="mt-4 space-y-4">
        {tiers.map((entry) => (
          <TierSolution key={entry.key} label={entry.label} tier={entry.tier} />
        ))}
      </div>
    </details>
  );
}
