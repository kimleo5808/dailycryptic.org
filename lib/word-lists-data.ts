import ALL_WORDS from "@/data/five-letter/words.json";
import GLOSSES from "@/data/five-letter/glosses.json";
import { WORD_LISTS } from "@/data/wordle-words";

/*
 * Data layer for the 5-letter word-list cluster (/5-letter-words/*).
 *
 * Sources (all bundled, no runtime fetch):
 *  - data/five-letter/words.json   — every valid 5-letter word (the "All" tier)
 *  - data/five-letter/glosses.json — short definitions (WordNet-derived; see
 *    the attribution note rendered on each page)
 *  - WORD_LISTS[5]                 — the curated common pool (the "Common" tier)
 *
 * Indexes are built once at module load and reused across all 104 spoke pages.
 */

export type Mode = "starting-with" | "ending-in" | "with" | "middle";
export const MODES: Mode[] = ["starting-with", "ending-in", "with", "middle"];
export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface WordEntry {
  word: string;
  scrabble: number;
  wwf: number;
  def?: string;
}

const ALL: string[] = (ALL_WORDS as string[]);
const GLOSS = GLOSSES as Record<string, string>;
const COMMON_SET = new Set(
  (WORD_LISTS[5] ?? []).map((w) => w.toUpperCase()).filter((w) => w.length === 5)
);

const SCRABBLE: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1,
  M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10,
};
const WWF: Record<string, number> = {
  A: 1, B: 4, C: 4, D: 2, E: 1, F: 4, G: 3, H: 3, I: 1, J: 10, K: 5, L: 2,
  M: 4, N: 2, O: 1, P: 4, Q: 10, R: 1, S: 1, T: 1, U: 2, V: 5, W: 4, X: 8,
  Y: 3, Z: 10,
};

function score(word: string, table: Record<string, number>): number {
  let s = 0;
  for (const ch of word) s += table[ch] ?? 0;
  return s;
}

export function scrabbleScore(word: string): number {
  return score(word, SCRABBLE);
}
export function wwfScore(word: string): number {
  return score(word, WWF);
}
export function glossOf(word: string): string | undefined {
  return GLOSS[word];
}

// ── Lazily-built indexes ─────────────────────────────────────────────────────

type Index = Record<string, string[]>;
const emptyIndex = (): Index =>
  Object.fromEntries(LETTERS.map((l) => [l, [] as string[]]));

// Rank words "common first, then defined, then alphabetical" for list ordering.
function rank(word: string): number {
  if (COMMON_SET.has(word)) return 0;
  if (GLOSS[word]) return 1;
  return 2;
}

/*
 * The index is built on first access rather than at module top level. On
 * Cloudflare Workers the global scope has a strict startup-time budget, and
 * indexing 8k+ words (plus sorting) at import time can exceed it and make the
 * whole worker fail to initialise — which 500s every SSR route. Building lazily
 * keeps startup instant and memoises for the isolate's lifetime. Plain string
 * comparison is used instead of the far slower localeCompare.
 */
let _idx: Record<Mode, Index> | null = null;
function getIdx(): Record<Mode, Index> {
  if (_idx) return _idx;
  const idx: Record<Mode, Index> = {
    "starting-with": emptyIndex(),
    "ending-in": emptyIndex(),
    with: emptyIndex(),
    middle: emptyIndex(),
  };
  for (const word of ALL) {
    idx["starting-with"][word[0]]?.push(word);
    idx["ending-in"][word[4]]?.push(word);
    idx["middle"][word[2]]?.push(word);
    const seen = new Set<string>();
    for (const ch of word) {
      if (!seen.has(ch)) {
        seen.add(ch);
        idx["with"][ch]?.push(word);
      }
    }
  }
  for (const mode of MODES) {
    for (const l of LETTERS) {
      idx[mode][l].sort(
        (a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0)
      );
    }
  }
  _idx = idx;
  return idx;
}

// ── Public helpers ───────────────────────────────────────────────────────────

export function countFor(mode: Mode, letter: string): number {
  return getIdx()[mode][letter.toUpperCase()]?.length ?? 0;
}

function toEntry(word: string): WordEntry {
  const def = GLOSS[word];
  return {
    word,
    scrabble: scrabbleScore(word),
    wwf: wwfScore(word),
    ...(def ? { def } : {}),
  };
}

const MODE_LABEL: Record<Mode, string> = {
  "starting-with": "Starting With",
  "ending-in": "Ending In",
  with: "With",
  middle: "in the Middle",
};

/** H1 / title fragment, e.g. "5-Letter Words with A in the Middle". */
export function spokeHeading(mode: Mode, letter: string): string {
  const L = letter.toUpperCase();
  return mode === "middle"
    ? `5-Letter Words with ${L} in the Middle`
    : `5-Letter Words ${MODE_LABEL[mode]} ${L}`;
}

/** Human phrase used inside prose, e.g. "with A in the middle". */
export function spokePhrase(mode: Mode, letter: string): string {
  const L = letter.toUpperCase();
  switch (mode) {
    case "starting-with":
      return `starting with ${L}`;
    case "ending-in":
      return `ending in ${L}`;
    case "with":
      return `with ${L} in them`;
    case "middle":
      return `with ${L} in the middle`;
  }
}

const CAP_ALL = 150; // rows rendered in the "All" table (common/defined first)

export interface SpokeData {
  mode: Mode;
  letter: string;
  heading: string;
  phrase: string;
  count: number;
  common: WordEntry[];
  all: WordEntry[];
  allTruncated: boolean;
  highest: WordEntry | null;
  topCommonWords: string[];
  glossary: WordEntry[];
  strategy: string;
  faqItems: { question: string; answer: string }[];
}

export function getSpokeData(mode: Mode, letterRaw: string): SpokeData | null {
  const letter = letterRaw.toUpperCase();
  if (!LETTERS.includes(letter)) return null;
  const words = getIdx()[mode][letter];
  if (!words || words.length === 0) return null;

  const commonWords = words.filter((w) => COMMON_SET.has(w));
  const common = commonWords.map(toEntry);
  const all = words.slice(0, CAP_ALL).map(toEntry);
  const allTruncated = words.length > CAP_ALL;

  const highest = words.reduce<WordEntry | null>((best, w) => {
    const e = toEntry(w);
    return !best || e.scrabble > best.scrabble ? e : best;
  }, null);

  const topCommonWords = (commonWords.length ? commonWords : words).slice(0, 10);

  // Glossary: defined words that are NOT in the common pool (the "tricky" ones),
  // preferring shorter, punchier definitions.
  const glossary = words
    .filter((w) => GLOSS[w] && !COMMON_SET.has(w))
    .slice(0, 8)
    .map(toEntry);

  return {
    mode,
    letter,
    heading: spokeHeading(mode, letter),
    phrase: spokePhrase(mode, letter),
    count: words.length,
    common,
    all,
    allTruncated,
    highest,
    topCommonWords,
    glossary,
    strategy: strategyFor(mode, letter, topCommonWords),
    faqItems: faqFor(mode, letter, words.length, highest, topCommonWords),
  };
}

function strategyFor(mode: Mode, letter: string, top: string[]): string {
  const L = letter.toUpperCase();
  const picks = top.slice(0, 3).join(", ");
  switch (mode) {
    case "starting-with":
      return `If Wordle has turned ${L} green in the first position, lock it in and spend your next guess testing the most common unused letters — E, A, R, O and T. Strong words to try from this list include ${picks}, which cover several high-frequency letters at once.`;
    case "ending-in":
      return `A confirmed ${L} at the end narrows the field fast, because relatively few five-letter words end this way. Keep the ${L} fixed and probe fresh vowels and common consonants in the first four slots. Good picks here are ${picks}.`;
    case "with":
      return `A yellow ${L} means the letter is in the word but not where you placed it. Move ${L} to a different slot and fill the rest with untested common letters. From this list, ${picks} are efficient guesses that also test new ground.`;
    case "middle":
      return `A green ${L} in the third slot is one of Wordle's most useful clues, because it splits the word neatly. Hold ${L} in the centre and test high-frequency letters on either side. Try ${picks} to cover the most likely surrounding letters.`;
  }
}

function faqFor(
  mode: Mode,
  letter: string,
  count: number,
  highest: WordEntry | null,
  top: string[]
): { question: string; answer: string }[] {
  const L = letter.toUpperCase();
  const phrase = spokePhrase(mode, L);
  const items = [
    {
      question: `How many 5-letter words are there ${phrase}?`,
      answer: `There are ${count} five-letter words ${phrase} in our word list. The most common ones — the words most likely to appear in Wordle — are ${top.slice(0, 6).join(", ")}.`,
    },
    {
      question: `What is the highest-scoring 5-letter word ${phrase} in Scrabble?`,
      answer: highest
        ? `${highest.word} is the highest-scoring five-letter word ${phrase}, worth ${highest.scrabble} points in Scrabble.`
        : `The scores depend on the letters; rarer letters like Q, Z, X and J push the total up.`,
    },
    {
      question: `What is a good Wordle guess ${phrase}?`,
      answer: `${top.slice(0, 3).join(", ")} are strong choices because they combine the fixed clue with several common untested letters, narrowing the remaining possibilities quickly.`,
    },
    {
      question: `Are these words valid in Scrabble and Words With Friends?`,
      answer: `Yes. Every word on this page is a valid five-letter word, and each row shows both its Scrabble and Words With Friends point value.`,
    },
  ];
  return items;
}

// ── Hub data ─────────────────────────────────────────────────────────────────

export function getBestStarters(): WordEntry[] {
  return ["SLATE", "CRANE", "TRACE", "SLANT", "CRATE", "AUDIO"].map(toEntry);
}

export function totalWordCount(): number {
  return ALL.length;
}
