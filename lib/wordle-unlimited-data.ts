import { WORD_LISTS } from "@/data/wordle-words";

export {
  scoreGuess,
  aggregateLetterState,
  getUtcDateKey,
  getDailyPuzzleNumber,
} from "@/lib/quordle-data";

export const WORD_LENGTHS = [4, 5, 6, 7] as const;
export type WordLength = (typeof WORD_LENGTHS)[number];
export const DEFAULT_WORD_LENGTH: WordLength = 5;
export const MAX_GUESSES = 6;

/** Curated common-word answer pools (deduped), one per length. */
const POOLS: Record<number, readonly string[]> = Object.fromEntries(
  WORD_LENGTHS.map((len) => [
    len,
    [...new Set((WORD_LISTS[len] ?? []).map((w) => w.toUpperCase()))],
  ]),
);
const POOL_SETS: Record<number, ReadonlySet<string>> = Object.fromEntries(
  WORD_LENGTHS.map((len) => [len, new Set(POOLS[len])]),
);

/**
 * Lazily-loaded, larger valid-guess dictionaries (one chunk per length).
 * Decoupled from the answer pool so players can enter any real word, not
 * just the curated answers. Cached after first load.
 */
const guessSetCache = new Map<WordLength, Set<string>>();

export async function loadGuessSet(length: WordLength): Promise<Set<string>> {
  const cached = guessSetCache.get(length);
  if (cached) return cached;
  let words = "";
  switch (length) {
    case 4:
      words = (await import("@/data/wordle-guesses/len4")).WORDS;
      break;
    case 5:
      words = (await import("@/data/wordle-guesses/len5")).WORDS;
      break;
    case 6:
      words = (await import("@/data/wordle-guesses/len6")).WORDS;
      break;
    case 7:
      words = (await import("@/data/wordle-guesses/len7")).WORDS;
      break;
  }
  const set = new Set(words ? words.split(" ") : []);
  // Guarantee every answer is itself an accepted guess.
  for (const a of POOLS[length]) set.add(a);
  guessSetCache.set(length, set);
  return set;
}

export function isWordLength(n: number): n is WordLength {
  return (WORD_LENGTHS as readonly number[]).includes(n);
}

function cyrb128(str: string): number {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(pool: readonly string[], rand: () => number): string {
  if (pool.length === 0) {
    throw new Error("Wordle Unlimited word pool is empty");
  }
  return pool[Math.floor(rand() * pool.length)];
}

/** A fresh random answer for practice mode. */
export function getRandomAnswer(length: WordLength): string {
  return pick(POOLS[length], Math.random);
}

/** A deterministic daily answer, stable per length per UTC day. */
export function getDailyAnswer(length: WordLength, dateKey: string): string {
  const seed = cyrb128(`wordle-unlimited:${length}:${dateKey}`);
  return pick(POOLS[length], mulberry32(seed));
}

/** True if the guess is the right length and in that length's word list. */
export function isValidGuess(word: string, length: WordLength): boolean {
  if (typeof word !== "string" || word.length !== length) return false;
  return POOL_SETS[length].has(word.toUpperCase());
}
