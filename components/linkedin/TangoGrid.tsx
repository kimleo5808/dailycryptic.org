import type { DecodedTango } from "@/types/linkedin";

/** Solved Tango board: suns and moons. */
export default function TangoGrid({ puzzle }: { puzzle: DecodedTango }) {
  const size = puzzle.rows.length;
  return (
    <figure className="mx-auto w-full max-w-[360px]">
      <div
        className="grid overflow-hidden rounded-xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.3)] dark:border-slate-200"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Solved Tango board, ${size} by ${size}`}
      >
        {puzzle.rows.flatMap((row, r) =>
          row.split("").map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="flex aspect-square items-center justify-center border border-slate-900/60 bg-white text-lg sm:text-xl dark:border-slate-200/60 dark:bg-zinc-900"
            >
              <span aria-hidden>{cell === "S" ? "☀️" : "🌙"}</span>
            </div>
          ))
        )}
      </div>
      <figcaption className="sr-only">
        {puzzle.rows
          .map(
            (row, r) =>
              `Row ${r + 1}: ${row
                .split("")
                .map((x) => (x === "S" ? "sun" : "moon"))
                .join(", ")}`
          )
          .join(". ")}
      </figcaption>
    </figure>
  );
}
