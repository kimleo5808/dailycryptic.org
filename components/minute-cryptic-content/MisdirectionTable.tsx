"use client";

import {
  MISLEADING_WORD_CATEGORIES,
  type MisleadingWord,
  type MisleadingWordCategory,
} from "@/data/cryptic-misleading-words";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type Filter = MisleadingWordCategory | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...MISLEADING_WORD_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

export function MisdirectionTable({ words }: { words: MisleadingWord[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (filter !== "all" && w.category !== filter) return false;
      if (!q) return true;
      return (
        w.word.toLowerCase().includes(q) ||
        w.crypticMeaning.toLowerCase().includes(q) ||
        w.looksLike.toLowerCase().includes(q)
      );
    });
  }, [words, query, filter]);

  return (
    <section
      id="misleading-word-list"
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-heading text-2xl font-bold text-foreground">
        The Complete Cryptic Misleading-Word List
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
        Bookmark this — search a word or filter by family. Each entry shows the
        decoy meaning, what setters really intend, and the wordplay logic. Example
        clues are illustrative.
      </p>

      {/* Controls */}
      <div className="mt-5 space-y-3">
        <label htmlFor="misleading-search" className="sr-only">
          Search misleading words
        </label>
        <input
          id="misleading-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a word or meaning, e.g. river, golf, money…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Showing {filtered.length} of {words.length} words
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-border bg-background p-8 text-center text-sm text-muted-foreground">
          No words match — try clearing the search or filter.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-5 hidden overflow-hidden rounded-xl border border-border sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-background">
                  <th scope="col" className="px-4 py-3 font-heading text-foreground">
                    Word
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading text-foreground">
                    Looks like
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading text-foreground">
                    Cryptic meaning
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading text-foreground">
                    Why (wordplay)
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading text-foreground">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr
                    key={w.word}
                    className="border-t border-border odd:bg-card even:bg-background/60"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 align-top font-heading text-base font-bold text-foreground"
                    >
                      {w.word}
                    </th>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {w.looksLike}
                    </td>
                    <td className="px-4 py-3 align-top font-semibold text-primary">
                      {w.crypticMeaning}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {w.wordplay}
                    </td>
                    <td className="px-4 py-3 align-top text-xs italic text-muted-foreground">
                      {w.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-5 space-y-2 sm:hidden">
            {filtered.map((w) => (
              <details
                key={w.word}
                className="rounded-lg border border-border bg-background p-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-foreground">
                  <span className="font-heading">{w.word}</span>
                  <span className="text-right font-normal text-primary">
                    {w.crypticMeaning}
                  </span>
                </summary>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Looks like
                    </dt>
                    <dd className="text-muted-foreground">{w.looksLike}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Why
                    </dt>
                    <dd className="text-muted-foreground">{w.wordplay}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Example
                    </dt>
                    <dd className="italic text-muted-foreground">{w.example}</dd>
                  </div>
                </dl>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
