import type { DecodedQueens } from "@/types/linkedin";

const REGION_COLORS: Record<string, string> = {
  purple: "bg-violet-300 dark:bg-violet-500",
  orange: "bg-orange-300 dark:bg-orange-500",
  blue: "bg-sky-300 dark:bg-sky-500",
  green: "bg-emerald-300 dark:bg-emerald-500",
  yellow: "bg-amber-300 dark:bg-amber-500",
  red: "bg-rose-300 dark:bg-rose-500",
  pink: "bg-pink-300 dark:bg-pink-500",
  gray: "bg-slate-300 dark:bg-slate-500",
  teal: "bg-teal-300 dark:bg-teal-500",
  brown: "bg-yellow-600/60 dark:bg-yellow-700",
  white: "bg-slate-100 dark:bg-slate-400",
};

/** Solved Queens board: crowns on their region-colored cells. */
export default function QueensBoard({ puzzle }: { puzzle: DecodedQueens }) {
  const byCell = new Map(
    puzzle.queens.map((q) => [`${q.row},${q.col}`, q] as const)
  );
  const cells = [];
  for (let r = 1; r <= puzzle.size; r += 1) {
    for (let c = 1; c <= puzzle.size; c += 1) {
      const q = byCell.get(`${r},${c}`);
      cells.push(
        <div
          key={`${r}-${c}`}
          className={`flex aspect-square items-center justify-center border border-slate-900/70 text-lg sm:text-xl dark:border-slate-200/70 ${
            q
              ? (REGION_COLORS[q.color] ?? "bg-amber-300 dark:bg-amber-500")
              : "bg-white dark:bg-zinc-900"
          }`}
        >
          {q ? (
            <span className="mc-pop text-slate-900" aria-hidden>
              ♛
            </span>
          ) : null}
        </div>
      );
    }
  }
  return (
    <figure className="mx-auto w-full max-w-[420px]">
      <div
        className="grid overflow-hidden rounded-xl border-2 border-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.3)] dark:border-slate-200"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Solved Queens board, ${puzzle.size} by ${puzzle.size}`}
      >
        {cells}
      </div>
      <figcaption className="sr-only">
        {puzzle.queens
          .map((q) => `${q.color} queen: row ${q.row}, column ${q.col}`)
          .join("; ")}
      </figcaption>
    </figure>
  );
}
