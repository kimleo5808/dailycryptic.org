import { readFileSync } from "fs";
import { join } from "path";
import type {
  DecodedCrossclimb,
  DecodedLinkedInDay,
  DecodedPinpoint,
  DecodedQueens,
  DecodedTango,
  DecodedZip,
  LinkedInDataFile,
  LinkedInDay,
  LinkedInGameKey,
} from "@/types/linkedin";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodeJson<T>(encoded: string): T {
  return JSON.parse(fromBase64(encoded)) as T;
}

function decodeDay(day: LinkedInDay): DecodedLinkedInDay {
  const out: DecodedLinkedInDay = { date: day.date };
  if (day.queens) {
    out.queens = {
      puzzleNumber: day.queens.puzzleNumber,
      size: day.queens.size,
      queens: decodeJson(day.queens.solution),
      hints: day.queens.hints.map(fromBase64),
    } satisfies DecodedQueens;
  }
  if (day.zip) {
    const sol = decodeJson<{
      waypoints: DecodedZip["waypoints"];
      path: DecodedZip["path"];
    }>(day.zip.solution);
    out.zip = {
      puzzleNumber: day.zip.puzzleNumber,
      size: day.zip.size,
      waypoints: sol.waypoints,
      path: sol.path ?? null,
      hints: day.zip.hints.map(fromBase64),
    } satisfies DecodedZip;
  }
  if (day.tango) {
    out.tango = {
      puzzleNumber: day.tango.puzzleNumber,
      rows: decodeJson(day.tango.solution),
      hints: day.tango.hints.map(fromBase64),
    } satisfies DecodedTango;
  }
  if (day.pinpoint) {
    out.pinpoint = {
      puzzleNumber: day.pinpoint.puzzleNumber,
      clues: day.pinpoint.clues.map(fromBase64),
      answer: fromBase64(day.pinpoint.answer),
      hints: day.pinpoint.hints.map(fromBase64),
    } satisfies DecodedPinpoint;
  }
  if (day.crossclimb) {
    out.crossclimb = {
      puzzleNumber: day.crossclimb.puzzleNumber,
      rungs: decodeJson(day.crossclimb.rungs),
      order: decodeJson(day.crossclimb.order),
      top: fromBase64(day.crossclimb.top),
      bottom: fromBase64(day.crossclimb.bottom),
      hints: day.crossclimb.hints.map(fromBase64),
    } satisfies DecodedCrossclimb;
  }
  return out;
}

/* Lazy-load: no fs work at module import time (crashes the Worker). */
let _daysDesc: DecodedLinkedInDay[] | null = null;

function getPublished(): DecodedLinkedInDay[] {
  if (!_daysDesc) {
    const raw = JSON.parse(
      readFileSync(join(process.cwd(), "data", "linkedin", "puzzles.json"), "utf8")
    ) as LinkedInDataFile;
    const today = new Date().toISOString().split("T")[0];
    _daysDesc = raw.days
      .filter((d) => d.date <= today)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(decodeDay);
  }
  return _daysDesc;
}

export const getTodaysLinkedInDay = cache(
  async (): Promise<DecodedLinkedInDay | undefined> => getPublished()[0]
);

export const getLinkedInDayByDate = cache(
  async (date: string): Promise<DecodedLinkedInDay | undefined> =>
    getPublished().find((d) => d.date === date)
);

/** Latest day that has data for a given game (skips days a game is missing). */
export const getTodaysLinkedInGame = cache(
  async (game: LinkedInGameKey): Promise<DecodedLinkedInDay | undefined> =>
    getPublished().find((d) => d[game] !== undefined)
);

export const getRecentLinkedInDays = cache(
  async (game: LinkedInGameKey, count = 7): Promise<DecodedLinkedInDay[]> =>
    getPublished()
      .filter((d) => d[game] !== undefined)
      .slice(1, count + 1)
);

export const getAllLinkedInDates = cache(
  async (game: LinkedInGameKey): Promise<string[]> =>
    getPublished()
      .filter((d) => d[game] !== undefined)
      .map((d) => d.date)
);

export const getAdjacentLinkedInDays = cache(
  async (
    game: LinkedInGameKey,
    date: string
  ): Promise<{
    prev: DecodedLinkedInDay | undefined;
    next: DecodedLinkedInDay | undefined;
  }> => {
    const days = getPublished().filter((d) => d[game] !== undefined);
    const idx = days.findIndex((d) => d.date === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return { prev: days[idx + 1], next: idx > 0 ? days[idx - 1] : undefined };
  }
);
