import { readFileSync } from "fs";
import { join } from "path";
import type {
  ConnectionsDataFile,
  ConnectionsPuzzle,
  DecodedConnectionsGroup,
  DecodedConnectionsPuzzle,
  ConnectionsMonthData,
} from "@/types/connections";
import { cache } from "react";

function fromBase64(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf8");
}

function decodeGroup(
  group: ConnectionsPuzzle["groups"][number]
): DecodedConnectionsGroup {
  return {
    color: group.color,
    name: fromBase64(group.name),
    hint: group.hint,
    words: group.words.map(fromBase64),
  };
}

function decodePuzzle(puzzle: ConnectionsPuzzle): DecodedConnectionsPuzzle {
  return {
    id: puzzle.id,
    printDate: puzzle.printDate,
    groups: puzzle.groups.map(decodeGroup),
  };
}

/* Lazy-load: only read from fs when first accessed (build time),
   not at module import time (which also runs in the Worker). */
let _raw: ConnectionsPuzzle[] | null = null;
let _decoded: DecodedConnectionsPuzzle[] | null = null;

function getRawPublished(): ConnectionsPuzzle[] {
  if (!_raw) {
    const rawData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "connections", "puzzles.json"), "utf8")
    ) as ConnectionsDataFile;
    const today = new Date().toISOString().split("T")[0];
    _raw = rawData.puzzles
      .filter((p) => (p.status === "scheduled" ? p.printDate <= today : true))
      .sort((a, b) => b.printDate.localeCompare(a.printDate));
  }
  return _raw;
}

function getPublished(): DecodedConnectionsPuzzle[] {
  if (!_decoded) {
    _decoded = getRawPublished().map(decodePuzzle);
  }
  return _decoded;
}

export const getAllConnectionsPuzzles = cache(
  async (): Promise<DecodedConnectionsPuzzle[]> => {
    return getPublished();
  }
);

export const getConnectionsPuzzleByDate = cache(
  async (date: string): Promise<DecodedConnectionsPuzzle | undefined> => {
    return getPublished().find((p) => p.printDate === date);
  }
);

export const getTodaysConnectionsPuzzle = cache(
  async (): Promise<DecodedConnectionsPuzzle | undefined> => {
    const puzzles = getPublished();
    return puzzles.length > 0 ? puzzles[0] : undefined;
  }
);

export const getRawTodaysConnectionsPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const raw = getRawPublished();
    return raw.length > 0 ? raw[0] : undefined;
  }
);

export const getRecentConnectionsPuzzles = cache(
  async (count: number = 4): Promise<DecodedConnectionsPuzzle[]> => {
    return getPublished().slice(1, count + 1);
  }
);

export const getConnectionsPuzzlesByMonth = cache(
  async (): Promise<ConnectionsMonthData[]> => {
    const months = new Map<string, DecodedConnectionsPuzzle[]>();
    for (const puzzle of getPublished()) {
      const monthKey = puzzle.printDate.slice(0, 7);
      const arr = months.get(monthKey);
      if (arr) arr.push(puzzle);
      else months.set(monthKey, [puzzle]);
    }
    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, puzzles]) => {
        const [year] = key.split("-");
        const monthName = new Date(`${key}-01`).toLocaleString("en", { month: "long" });
        const first = puzzles[puzzles.length - 1];
        const last = puzzles[0];
        return {
          label: `${monthName} ${year}`,
          rangeLabel: `Connections #${first.id}–#${last.id} (${monthName} ${year})`,
          puzzles,
        };
      });
  }
);

export const getAdjacentConnectionsPuzzles = cache(
  async (date: string): Promise<{
    prev: DecodedConnectionsPuzzle | undefined;
    next: DecodedConnectionsPuzzle | undefined;
  }> => {
    const puzzles = getPublished();
    const idx = puzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: puzzles[idx + 1],
      next: idx > 0 ? puzzles[idx - 1] : undefined,
    };
  }
);
