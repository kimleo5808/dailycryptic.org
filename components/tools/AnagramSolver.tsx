"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

// Anagram index: sorted-letters key -> list of words
type AnagramIndex = Map<string, string[]>;

function sortLetters(word: string): string {
  return word.split("").sort().join("");
}

function buildIndex(words: string[]): AnagramIndex {
  const index: AnagramIndex = new Map();
  for (const word of words) {
    const key = sortLetters(word);
    const arr = index.get(key);
    if (arr) arr.push(word);
    else index.set(key, [word]);
  }
  return index;
}

function findAnagrams(
  input: string,
  filterLength: number | null,
  index: AnagramIndex
): string[] {
  const clean = input.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length < 2) return [];

  const targetCount: Record<string, number> = {};
  for (const ch of clean) targetCount[ch] = (targetCount[ch] || 0) + 1;

  const results: string[] = [];

  for (const [key, words] of index) {
    // Skip if key is longer than input
    if (key.length > clean.length) continue;
    // Apply length filter if set
    if (filterLength && key.length !== filterLength) continue;
    // Skip very short if showing all
    if (!filterLength && key.length < 3) continue;

    // Check if key letters are a subset of input letters
    const available = { ...targetCount };
    let valid = true;
    for (const ch of key) {
      if (!available[ch] || available[ch] <= 0) {
        valid = false;
        break;
      }
      available[ch]--;
    }

    if (valid) {
      for (const w of words) {
        // Exclude the input word itself for exact-length matches
        if (w === clean) continue;
        results.push(w);
      }
    }
  }

  return results.sort((a, b) => b.length - a.length || a.localeCompare(b));
}

export default function AnagramSolver() {
  const [input, setInput] = useState("");
  const [filterLength, setFilterLength] = useState<number | null>(null);
  const [index, setIndex] = useState<AnagramIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Load word list on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/data/wordlist.txt")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const words = text.trim().split("\n");
        setIndex(buildIndex(words));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!index) return [];
    return findAnagrams(input, filterLength, index);
  }, [input, filterLength, index]);

  const clean = input.toUpperCase().replace(/[^A-Z]/g, "");
  const hasInput = clean.length >= 2;

  // Group results by length
  const grouped = useMemo(() => {
    const map = new Map<number, string[]>();
    for (const w of results) {
      const len = w.length;
      const arr = map.get(len);
      if (arr) arr.push(w);
      else map.set(len, [w]);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [results]);

  const maxFilterLength = Math.min(clean.length, 8);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      setFilterLength(null);
    },
    []
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="font-heading text-lg font-bold text-foreground">
        Anagram Solver
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter letters and find all possible words. Use the length filter to
        narrow results.
      </p>

      <div className="mt-4 grid gap-3">
        <div>
          <label
            htmlFor="anagram-input"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Enter your letters
          </label>
          <input
            id="anagram-input"
            type="text"
            placeholder={loading ? "Loading dictionary..." : "e.g. LISTEN"}
            value={input}
            onChange={handleInputChange}
            disabled={loading || error}
            className="w-full rounded-lg border-2 border-border bg-background px-3 py-2.5 font-mono text-lg font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:text-sm placeholder:tracking-normal placeholder:normal-case focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 sm:max-w-sm"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {loading && (
          <p className="text-xs text-muted-foreground animate-pulse-soft">
            Loading 80,000+ word dictionary...
          </p>
        )}

        {error && (
          <p className="text-xs text-destructive">
            Failed to load dictionary. Please refresh the page and try again.
          </p>
        )}

        {hasInput && !loading && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Filter by word length
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterLength(null)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filterLength === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                All
              </button>
              {Array.from(
                { length: Math.max(maxFilterLength - 2, 0) },
                (_, i) => i + 3
              ).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFilterLength(n)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    filterLength === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasInput && !loading && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">
            {results.length === 0
              ? "No anagrams found."
              : `${results.length} word${results.length !== 1 ? "s" : ""} found`}
          </p>
          {grouped.map(([len, words]) => (
            <div key={len} className="mt-3">
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                {len}-letter words ({words.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {words.map((word) => (
                  <span
                    key={word}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-sm font-medium text-foreground"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasInput && !loading && !error && (
        <p className="mt-4 text-xs text-muted-foreground">
          Type at least 2 letters to start finding anagrams. For example, type
          LISTEN to find SILENT, TINSEL, ENLIST, INLETS, and 70+ more words.
        </p>
      )}
    </div>
  );
}
