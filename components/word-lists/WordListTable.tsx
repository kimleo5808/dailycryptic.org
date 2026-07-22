"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { WordEntry } from "@/lib/word-lists-data";

/*
 * Common / All sortable word table.
 *
 * BOTH tabs' rows are rendered into the DOM (the inactive one is only hidden
 * with CSS), so every word is in the initial server HTML and crawlable. The
 * client layer just switches which table is visible and re-orders rows — it
 * never gates the word list behind a click.
 */

type SortKey = "default" | "az" | "scrabble" | "wwf";

function sortRows(rows: WordEntry[], key: SortKey): WordEntry[] {
  if (key === "default") return rows;
  const copy = [...rows];
  if (key === "az") copy.sort((a, b) => a.word.localeCompare(b.word));
  else if (key === "scrabble") copy.sort((a, b) => b.scrabble - a.scrabble);
  else if (key === "wwf") copy.sort((a, b) => b.wwf - a.wwf);
  return copy;
}

function WordTable({
  rows,
  sort,
  onSort,
}: {
  rows: WordEntry[];
  sort: SortKey;
  onSort: (k: SortKey) => void;
}) {
  const headerBtn = (key: SortKey, label: string, alignRight?: boolean) => (
    <button
      type="button"
      onClick={() => onSort(key)}
      className={cn(
        "flex items-center gap-1 font-semibold uppercase tracking-wide transition hover:text-foreground",
        sort === key ? "text-foreground" : "text-muted-foreground",
        alignRight && "ml-auto"
      )}
    >
      {label}
      {sort === key && <span aria-hidden>▾</span>}
    </button>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-xs">
          <tr>
            <th className="px-3 py-2">{headerBtn("az", "Word")}</th>
            <th className="px-3 py-2 text-right">
              {headerBtn("scrabble", "Scrabble", true)}
            </th>
            <th className="px-3 py-2 text-right">
              {headerBtn("wwf", "WWF", true)}
            </th>
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
  const [tab, setTab] = useState<"common" | "all">(
    hasCommon ? "common" : "all"
  );
  const [sort, setSort] = useState<SortKey>("default");

  const commonRows = useMemo(() => sortRows(common, sort), [common, sort]);
  const allRows = useMemo(() => sortRows(all, sort), [all, sort]);

  return (
    <div>
      {/* Tabs + sort */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-lg border border-border text-sm">
          {hasCommon && (
            <button
              type="button"
              onClick={() => setTab("common")}
              className={cn(
                "px-3 py-1.5 font-semibold transition",
                tab === "common"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
              aria-pressed={tab === "common"}
            >
              Common ({common.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab("all")}
            className={cn(
              "px-3 py-1.5 font-semibold transition",
              tab === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            aria-pressed={tab === "all"}
          >
            All words
          </button>
        </div>
        {sort !== "default" && (
          <button
            type="button"
            onClick={() => setSort("default")}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset order
          </button>
        )}
      </div>

      {/* Both tables live in the DOM (crawlable); the inactive one is hidden. */}
      {hasCommon && (
        <div className={tab === "common" ? "" : "hidden"}>
          <WordTable rows={commonRows} sort={sort} onSort={setSort} />
        </div>
      )}
      <div className={tab === "all" ? "" : "hidden"}>
        <WordTable rows={allRows} sort={sort} onSort={setSort} />
        {allTruncated && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing the {all.length} most common and notable words of{" "}
            {totalCount} total.
          </p>
        )}
      </div>
    </div>
  );
}
