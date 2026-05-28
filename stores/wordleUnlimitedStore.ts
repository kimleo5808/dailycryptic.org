"use client";

import { create } from "zustand";
import type { QuordleMode } from "@/types/quordle";
import type { WordLength } from "@/lib/wordle-unlimited-data";

interface GameState {
  answer: string;
  guesses: string[];
  startedAt: number | null;
  finishedAt: number | null;
}

interface DailyGame extends GameState {
  dateKey: string;
}

export interface WordleStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  /** index 0..MAX_GUESSES-1 = solved in N+1 guesses; "fail" tallied separately via played-wins */
  distribution: number[];
}

function emptyStats(): WordleStats {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  };
}

/** key = `${length}` for practice, `${length}:${dateKey}` for daily */
interface WordleUnlimitedStore {
  hydrated: boolean;
  hardMode: boolean;
  stats: WordleStats;
  practiceByLength: Record<string, GameState>;
  dailyByKey: Record<string, DailyGame>;

  hydrate: () => void;
  ensurePractice: (length: WordLength, answer: string) => void;
  ensureDaily: (length: WordLength, dateKey: string, answer: string) => void;
  addGuess: (
    mode: QuordleMode,
    length: WordLength,
    dateKey: string,
    guess: string,
  ) => void;
  finish: (
    mode: QuordleMode,
    length: WordLength,
    dateKey: string,
    won: boolean,
    guessCount: number,
  ) => void;
  resetPractice: (length: WordLength, answer: string) => void;
  setHardMode: (v: boolean) => void;
}

const LS_PRACTICE = "wordle-unlimited:practice:v1";
const LS_DAILY = "wordle-unlimited:daily:v1";
const LS_STATS = "wordle-unlimited:stats:v1";
const LS_HARD = "wordle-unlimited:hard:v1";
const MAX_DAILY_HISTORY = 60;

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota or privacy mode — ignore */
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function pruneDaily(map: Record<string, DailyGame>): Record<string, DailyGame> {
  const keys = Object.keys(map);
  if (keys.length <= MAX_DAILY_HISTORY) return map;
  const sorted = keys.sort((a, b) => {
    const da = map[a].dateKey;
    const db = map[b].dateKey;
    return da.localeCompare(db);
  });
  const keep = sorted.slice(sorted.length - MAX_DAILY_HISTORY);
  const next: Record<string, DailyGame> = {};
  for (const k of keep) next[k] = map[k];
  return next;
}

export const useWordleUnlimitedStore = create<WordleUnlimitedStore>(
  (set, get) => ({
    hydrated: false,
    hardMode: false,
    stats: emptyStats(),
    practiceByLength: {},
    dailyByKey: {},

    hydrate: () => {
      if (get().hydrated) return;
      set({
        practiceByLength: parse(safeGet(LS_PRACTICE), {}),
        dailyByKey: pruneDaily(parse(safeGet(LS_DAILY), {})),
        stats: parse(safeGet(LS_STATS), emptyStats()),
        hardMode: safeGet(LS_HARD) === "1",
        hydrated: true,
      });
    },

    ensurePractice: (length, answer) => {
      const key = String(length);
      if (get().practiceByLength[key]) return;
      const next = {
        ...get().practiceByLength,
        [key]: { answer, guesses: [], startedAt: null, finishedAt: null },
      };
      set({ practiceByLength: next });
      safeSet(LS_PRACTICE, JSON.stringify(next));
    },

    ensureDaily: (length, dateKey, answer) => {
      const key = `${length}:${dateKey}`;
      if (get().dailyByKey[key]) return;
      const next = pruneDaily({
        ...get().dailyByKey,
        [key]: { dateKey, answer, guesses: [], startedAt: null, finishedAt: null },
      });
      set({ dailyByKey: next });
      safeSet(LS_DAILY, JSON.stringify(next));
    },

    addGuess: (mode, length, dateKey, guess) => {
      const up = guess.toUpperCase();
      if (mode === "daily") {
        const key = `${length}:${dateKey}`;
        const game = get().dailyByKey[key];
        if (!game || game.finishedAt) return;
        const next = {
          ...get().dailyByKey,
          [key]: {
            ...game,
            startedAt: game.startedAt ?? Date.now(),
            guesses: [...game.guesses, up],
          },
        };
        set({ dailyByKey: next });
        safeSet(LS_DAILY, JSON.stringify(next));
      } else {
        const key = String(length);
        const game = get().practiceByLength[key];
        if (!game || game.finishedAt) return;
        const next = {
          ...get().practiceByLength,
          [key]: {
            ...game,
            startedAt: game.startedAt ?? Date.now(),
            guesses: [...game.guesses, up],
          },
        };
        set({ practiceByLength: next });
        safeSet(LS_PRACTICE, JSON.stringify(next));
      }
    },

    finish: (mode, length, dateKey, won, guessCount) => {
      // Mark the game finished.
      if (mode === "daily") {
        const key = `${length}:${dateKey}`;
        const game = get().dailyByKey[key];
        if (!game || game.finishedAt) return;
        const next = {
          ...get().dailyByKey,
          [key]: { ...game, finishedAt: Date.now() },
        };
        set({ dailyByKey: next });
        safeSet(LS_DAILY, JSON.stringify(next));
      } else {
        const key = String(length);
        const game = get().practiceByLength[key];
        if (!game || game.finishedAt) return;
        const next = {
          ...get().practiceByLength,
          [key]: { ...game, finishedAt: Date.now() },
        };
        set({ practiceByLength: next });
        safeSet(LS_PRACTICE, JSON.stringify(next));
      }

      // Update aggregate stats.
      const s = get().stats;
      const dist = [...s.distribution];
      if (won && guessCount >= 1 && guessCount <= dist.length) {
        dist[guessCount - 1] += 1;
      }
      const currentStreak = won ? s.currentStreak + 1 : 0;
      const stats: WordleStats = {
        played: s.played + 1,
        wins: s.wins + (won ? 1 : 0),
        currentStreak,
        maxStreak: Math.max(s.maxStreak, currentStreak),
        distribution: dist,
      };
      set({ stats });
      safeSet(LS_STATS, JSON.stringify(stats));
    },

    resetPractice: (length, answer) => {
      const key = String(length);
      const next = {
        ...get().practiceByLength,
        [key]: { answer, guesses: [], startedAt: null, finishedAt: null },
      };
      set({ practiceByLength: next });
      safeSet(LS_PRACTICE, JSON.stringify(next));
    },

    setHardMode: (v) => {
      set({ hardMode: v });
      safeSet(LS_HARD, v ? "1" : "0");
    },
  }),
);
