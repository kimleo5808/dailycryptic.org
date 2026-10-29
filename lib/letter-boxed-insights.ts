import spellingBeeJson from "@/data/spelling-bee/puzzles.json";
import { WORD_LISTS } from "@/data/wordle-words";
import type { DecodedLetterBoxedPuzzle } from "@/types/letter-boxed";
import type { SpellingBeeDataFile } from "@/types/spelling-bee";

/*
 * Box-specific facts for a /letter-boxed-answers/[date] page.
 *
 * The NYT's daily Letter Boxed dictionary is not stored, so "playable words"
 * are checked against our own list: every answer in the Spelling Bee archive
 * (already curated by the NYT, so no obscure or offensive entries) plus the
 * curated common-word lists. That is enough to suggest strong opening words
 * and to compare boxes, though it is not the official dictionary — the copy on
 * the page says so.
 */

const MAX_OPENERS = 8;
const MAX_ALTERNATIVES = 5;
const RARE_SHARE = 0.2;

let _dictionary: string[] | null = null;

function dictionary(): string[] {
  if (!_dictionary) {
    const words = new Set<string>();
    const sb = spellingBeeJson as unknown as SpellingBeeDataFile;
    for (const p of sb.puzzles) {
      for (const a of p.answers) words.add(Buffer.from(a, "base64").toString("utf8").toUpperCase());
    }
    for (const list of Object.values(WORD_LISTS)) {
      for (const w of list) words.add(w.toUpperCase());
    }
    _dictionary = [...words].filter((w) => /^[A-Z]{3,}$/.test(w));
  }
  return _dictionary;
}

export interface LetterBoxedInsights {
  dictionarySize: number;
  /** Words from our list that can be played in this box (solution excluded). */
  playableCount: number;
  /** Playable words covering the most distinct letters. */
  openers: { word: string; letters: number }[];
  /** Distinct letters the first solution word covers. */
  firstWordCoverage: number;
  chainLetter: string;
  /** Letters the official solution uses more than once. */
  repeatedLetters: string[];
  /** Letters in this box that appear in few archive boxes. */
  rareLetters: { letter: string; boxes: number }[];
  archiveSize: number;
  /** Percentage of archive solutions with fewer total letters. */
  shorterThanPct: number;
  totalLetters: number;
  /** Other two-word solutions found with our list. */
  alternatives: [string, string][];
}

export function getLetterBoxedInsights(
  puzzle: DecodedLetterBoxedPuzzle,
  archive: DecodedLetterBoxedPuzzle[]
): LetterBoxedInsights {
  const sideOf = new Map<string, number>();
  puzzle.sides.forEach((side, i) => side.split("").forEach((c) => sideOf.set(c, i)));

  const isPlayable = (w: string) =>
    w.split("").every(
      (c, i) => sideOf.has(c) && (i === 0 || sideOf.get(c) !== sideOf.get(w[i - 1]))
    );

  const solution = puzzle.solution;
  const solutionSet = new Set(solution);
  const playable = dictionary().filter(isPlayable);
  const others = playable.filter((w) => !solutionSet.has(w));
  const distinct = (w: string) => new Set(w).size;

  const openers = [...others]
    .sort((a, b) => distinct(b) - distinct(a) || b.length - a.length || a.localeCompare(b))
    .slice(0, MAX_OPENERS)
    .map((word) => ({ word, letters: distinct(word) }));

  // Letters used across the solution, counting each chain letter once.
  const used = solution.map((w, i) => (i === 0 ? w : w.slice(1))).join("");
  const letterCounts = new Map<string, number>();
  for (const c of used) letterCounts.set(c, (letterCounts.get(c) ?? 0) + 1);
  const repeatedLetters = [...letterCounts]
    .filter(([, n]) => n > 1)
    .map(([c]) => c)
    .sort();

  const rareLetters = puzzle.letters
    .map((letter) => ({
      letter,
      boxes: archive.filter((p) => p.letters.includes(letter)).length,
    }))
    .filter((r) => r.boxes / archive.length <= RARE_SHARE)
    .sort((a, b) => a.boxes - b.boxes || a.letter.localeCompare(b.letter))
    .slice(0, 3);

  const totalLetters = solution.reduce((n, w) => n + w.length, 0);
  const totalOf = (p: DecodedLetterBoxedPuzzle) =>
    p.solution.reduce((n, w) => n + w.length, 0);

  const byFirst = new Map<string, string[]>();
  for (const w of playable) {
    const list = byFirst.get(w[0]) ?? [];
    list.push(w);
    byFirst.set(w[0], list);
  }
  const alternatives: [string, string][] = [];
  for (const w1 of playable) {
    for (const w2 of byFirst.get(w1[w1.length - 1]) ?? []) {
      if (w1 === solution[0] && w2 === solution[1]) continue;
      if (new Set(w1 + w2).size === 12) alternatives.push([w1, w2]);
    }
  }
  alternatives.sort((a, b) => a[0].length + a[1].length - (b[0].length + b[1].length));

  return {
    dictionarySize: dictionary().length,
    playableCount: others.length,
    openers,
    firstWordCoverage: distinct(solution[0]),
    chainLetter: solution[0][solution[0].length - 1],
    repeatedLetters,
    rareLetters,
    archiveSize: archive.length,
    shorterThanPct: Math.round(
      (archive.filter((p) => totalOf(p) < totalLetters).length / archive.length) * 100
    ),
    totalLetters,
    alternatives: alternatives.slice(0, MAX_ALTERNATIVES),
  };
}
