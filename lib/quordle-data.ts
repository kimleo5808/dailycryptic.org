import { WORD_LISTS } from "@/data/wordle-words";
import type { LetterState, QuordleAnswers } from "@/types/quordle";

export const QUORDLE_WORD_LENGTH = 5;
export const QUORDLE_MAX_GUESSES = 9;
export const QUORDLE_NUM_BOARDS = 4;

const ANSWER_POOL: readonly string[] = (WORD_LISTS[5] ?? []).map((w) =>
  w.toUpperCase(),
);
const GUESS_POOL: ReadonlySet<string> = new Set(ANSWER_POOL);

// Epoch day 1 = 2024-01-01 UTC. Used to derive a stable "Quordle #N" number.
const DAILY_EPOCH_UTC_MS = Date.UTC(2024, 0, 1);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function cyrb128(str: string): [number, number, number, number] {
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
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
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

export function getUtcDateKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyPuzzleNumber(date: Date = new Date()): number {
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const diff = utcMidnight - DAILY_EPOCH_UTC_MS;
  return Math.max(1, Math.floor(diff / MS_PER_DAY) + 1);
}

function pickFourDistinct(rand: () => number): QuordleAnswers {
  if (ANSWER_POOL.length < 4) {
    throw new Error("Quordle answer pool must contain at least 4 words");
  }
  const indices = new Set<number>();
  while (indices.size < 4) {
    indices.add(Math.floor(rand() * ANSWER_POOL.length));
  }
  const [a, b, c, d] = [...indices];
  return [
    ANSWER_POOL[a],
    ANSWER_POOL[b],
    ANSWER_POOL[c],
    ANSWER_POOL[d],
  ];
}

export function getTodayAnswers(date: Date = new Date()): QuordleAnswers {
  const key = getUtcDateKey(date);
  const [seed] = cyrb128(`quordle:${key}`);
  return pickFourDistinct(mulberry32(seed));
}

export function getRandomAnswers(): QuordleAnswers {
  return pickFourDistinct(Math.random);
}

export function isValidGuess(word: string): boolean {
  if (typeof word !== "string" || word.length !== QUORDLE_WORD_LENGTH) {
    return false;
  }
  return GUESS_POOL.has(word.toUpperCase());
}

export function scoreGuess(guess: string, answer: string): LetterState[] {
  const g = guess.toUpperCase();
  const a = answer.toUpperCase();
  const n = g.length;
  const result: LetterState[] = Array(n).fill("absent");
  const remaining: (string | null)[] = a.split("");

  for (let i = 0; i < n; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }
  for (let i = 0; i < n; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(g[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = null;
    }
  }
  return result;
}

export function aggregateLetterState(
  current: LetterState | undefined,
  next: LetterState,
): LetterState {
  const rank: Record<LetterState, number> = {
    empty: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };
  if (!current) return next;
  return rank[next] > rank[current] ? next : current;
}

export function getAnswerPoolSize(): number {
  return ANSWER_POOL.length;
}
