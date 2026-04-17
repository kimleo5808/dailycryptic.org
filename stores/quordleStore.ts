"use client";

import { create } from "zustand";
import type { QuordleAnswers, QuordleMode } from "@/types/quordle";

interface DailyGame {
  dateKey: string;
  answers: QuordleAnswers;
  guesses: string[];
  startedAt: number | null;
  finishedAt: number | null;
}

interface PracticeGame {
  answers: QuordleAnswers;
  guesses: string[];
  startedAt: number | null;
  finishedAt: number | null;
}

interface QuordleStore {
  hydrated: boolean;
  dailyByDate: Record<string, DailyGame>;
  practice: PracticeGame | null;
  colorBlind: boolean;

  hydrate: () => void;
  ensureDaily: (dateKey: string, answers: QuordleAnswers) => void;
  ensurePractice: (answers: QuordleAnswers) => void;
  addGuess: (mode: QuordleMode, dateKey: string, guess: string) => void;
  markFinished: (mode: QuordleMode, dateKey: string) => void;
  resetPractice: (answers: QuordleAnswers) => void;
  setColorBlind: (v: boolean) => void;
}

const LS_DAILY = "quordle:daily:v1";
const LS_PRACTICE = "quordle:practice:v1";
const LS_COLOR_BLIND = "quordle:colorBlind:v1";
const MAX_DAILY_HISTORY = 45;

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

function pruneDaily(map: Record<string, DailyGame>): Record<string, DailyGame> {
  const keys = Object.keys(map).sort();
  if (keys.length <= MAX_DAILY_HISTORY) return map;
  const keep = keys.slice(keys.length - MAX_DAILY_HISTORY);
  const next: Record<string, DailyGame> = {};
  for (const k of keep) next[k] = map[k];
  return next;
}

function persistDaily(map: Record<string, DailyGame>): void {
  safeSet(LS_DAILY, JSON.stringify(map));
}

function persistPractice(game: PracticeGame | null): void {
  if (!game) {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(LS_PRACTICE);
      } catch {
        /* noop */
      }
    }
    return;
  }
  safeSet(LS_PRACTICE, JSON.stringify(game));
}

function persistColorBlind(v: boolean): void {
  safeSet(LS_COLOR_BLIND, v ? "1" : "0");
}

export const useQuordleStore = create<QuordleStore>((set, get) => ({
  hydrated: false,
  dailyByDate: {},
  practice: null,
  colorBlind: false,

  hydrate: () => {
    if (get().hydrated) return;
    let daily: Record<string, DailyGame> = {};
    let practice: PracticeGame | null = null;
    let colorBlind = false;
    const rawDaily = safeGet(LS_DAILY);
    if (rawDaily) {
      try {
        daily = JSON.parse(rawDaily) ?? {};
      } catch {
        daily = {};
      }
    }
    const rawPractice = safeGet(LS_PRACTICE);
    if (rawPractice) {
      try {
        practice = JSON.parse(rawPractice);
      } catch {
        practice = null;
      }
    }
    const rawCB = safeGet(LS_COLOR_BLIND);
    colorBlind = rawCB === "1";
    set({ dailyByDate: pruneDaily(daily), practice, colorBlind, hydrated: true });
  },

  ensureDaily: (dateKey, answers) => {
    const existing = get().dailyByDate[dateKey];
    if (existing) return;
    const next: DailyGame = {
      dateKey,
      answers,
      guesses: [],
      startedAt: null,
      finishedAt: null,
    };
    const map = pruneDaily({ ...get().dailyByDate, [dateKey]: next });
    set({ dailyByDate: map });
    persistDaily(map);
  },

  ensurePractice: (answers) => {
    if (get().practice) return;
    const next: PracticeGame = {
      answers,
      guesses: [],
      startedAt: null,
      finishedAt: null,
    };
    set({ practice: next });
    persistPractice(next);
  },

  addGuess: (mode, dateKey, guess) => {
    const up = guess.toUpperCase();
    if (mode === "daily") {
      const game = get().dailyByDate[dateKey];
      if (!game || game.finishedAt) return;
      const updated: DailyGame = {
        ...game,
        startedAt: game.startedAt ?? Date.now(),
        guesses: [...game.guesses, up],
      };
      const map = { ...get().dailyByDate, [dateKey]: updated };
      set({ dailyByDate: map });
      persistDaily(map);
    } else {
      const game = get().practice;
      if (!game || game.finishedAt) return;
      const updated: PracticeGame = {
        ...game,
        startedAt: game.startedAt ?? Date.now(),
        guesses: [...game.guesses, up],
      };
      set({ practice: updated });
      persistPractice(updated);
    }
  },

  markFinished: (mode, dateKey) => {
    if (mode === "daily") {
      const game = get().dailyByDate[dateKey];
      if (!game || game.finishedAt) return;
      const updated: DailyGame = { ...game, finishedAt: Date.now() };
      const map = { ...get().dailyByDate, [dateKey]: updated };
      set({ dailyByDate: map });
      persistDaily(map);
    } else {
      const game = get().practice;
      if (!game || game.finishedAt) return;
      const updated: PracticeGame = { ...game, finishedAt: Date.now() };
      set({ practice: updated });
      persistPractice(updated);
    }
  },

  resetPractice: (answers) => {
    const next: PracticeGame = {
      answers,
      guesses: [],
      startedAt: null,
      finishedAt: null,
    };
    set({ practice: next });
    persistPractice(next);
  },

  setColorBlind: (v) => {
    set({ colorBlind: v });
    persistColorBlind(v);
  },
}));
