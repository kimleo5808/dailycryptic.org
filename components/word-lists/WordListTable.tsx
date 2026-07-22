import type { WordEntry } from "@/lib/word-lists-data";

/*
 * Common / All word tables — server component.
 *
 * Rendered entirely on the server (no "use client"), so nothing here has to
 * serialize a large word array into the client flight payload. Both tabs' words
 * live in the initial HTML — the "All" set sits inside a native <details> so it
 * stays crawlable while collapsed. Rows are pre-sorted (common/defined first)
 * by the data layer.
 */

function WordTable({ rows }: { rows: WordEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2">Word</th>
            <th className="px-3 py-2 text-right">Scrabble</th>
            <th className="px-3 py-2 text-right">WWF</th>
            <th className="px-3 py-2">Meaning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.word} className="even:bg-muted/40">
              <td className="px-3 py-2 font-mono font-semibold uppercase tracking-wide">
                {r.word}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                {r.scrabble}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                {r.wwf}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{r.def ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WordListTable({
  common,
  all,
  allTruncated,
  totalCount,
}: {
  common: WordEntry[];
  all: WordEntry[];
  allTruncated: boolean;
  totalCount: number;
}) {
  const hasCommon = common.length > 0;

  return (
    <div className="space-y-4">
      {hasCommon && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-foreground">
            Common words ({common.length})
          </h3>
          <WordTable rows={common} />
        </div>
      )}

      <details className="group rounded-xl border border-border bg-card p-3 sm:p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground">
          <span>
            {hasCommon ? "Show all" : "All"} {totalCount} words
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground group-open:hidden">
            Show
          </span>
        </summary>
        <div className="mt-3">
          <WordTable rows={all} />
          {allTruncated && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing the {all.length} most common and notable words of{" "}
              {totalCount} total.
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
