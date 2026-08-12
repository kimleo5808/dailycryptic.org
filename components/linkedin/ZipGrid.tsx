import type { DecodedZip } from "@/types/linkedin";

/**
 * Solved Zip board: numbered waypoints plus (when the full path is known) an
 * SVG polyline drawn through every cell in order.
 */
export default function ZipGrid({ puzzle }: { puzzle: DecodedZip }) {
  const { size } = puzzle;
  const byCell = new Map(
    puzzle.waypoints.map((w) => [`${w.row},${w.col}`, w.num] as const)
  );
  const cells = [];
  for (let r = 1; r <= size; r += 1) {
    for (let c = 1; c <= size; c += 1) {
      const num = byCell.get(`${r},${c}`);
      cells.push(
        <div
          key={`${r}-${c}`}
          className="relative flex aspect-square items-center justify-center border border-slate-900/60 bg-white dark:border-slate-200/60 dark:bg-zinc-900"
        >
          {num !== undefined ? (
            <span className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white sm:h-7 sm:w-7 dark:bg-slate-100 dark:text-slate-900">
              {num}
            </span>
          ) : null}
        </div>
      );
    }
  }

  // Path polyline in a 0..100 viewBox; cell centers at (col-0.5)/size * 100.
  const points = puzzle.path
    ?.map(([r, c]) => `${((c - 0.5) / size) * 100},${((r - 0.5) / size) * 100}`)
    .join(" ");

  return (
    <figure className="mx-auto w-full max-w-[420px]">
      <div className="relative overflow-hidden rounded-xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.3)] dark:border-slate-200">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          role="img"
          aria-label={`Solved Zip board, ${size} by ${size}`}
        >
          {cells}
        </div>
        {points ? (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              points={points}
              fill="none"
              className="stroke-sky-500/80"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>
      <figcaption className="sr-only">
        {puzzle.path
          ? `Path in order: ${puzzle.path
              .map(([r, c]) => `row ${r} column ${c}`)
              .join(", ")}`
          : `Numbered cells: ${puzzle.waypoints
              .map((w) => `${w.num} at row ${w.row}, column ${w.col}`)
              .join("; ")}`}
      </figcaption>
    </figure>
  );
}
