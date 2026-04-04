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

const rawData = JSON.parse(
  readFileSync(join(process.cwd(), "data", "connections", "puzzles.json"), "utf8")
) as ConnectionsDataFile;
const today = new Date().toISOString().split("T")[0];

const rawPublished = rawData.puzzles
  .filter((p) => {
    if (p.status === "scheduled") return p.printDate <= today;
    return true;
  })
  .sort((a, b) => b.printDate.localeCompare(a.printDate));

const publishedPuzzles = rawPublished.map(decodePuzzle);

export const getAllConnectionsPuzzles = cache(
  async (): Promise<DecodedConnectionsPuzzle[]> => {
    return publishedPuzzles;
  }
);

export const getConnectionsPuzzleByDate = cache(
  async (date: string): Promise<DecodedConnectionsPuzzle | undefined> => {
    return publishedPuzzles.find((p) => p.printDate === date);
  }
);

export const getTodaysConnectionsPuzzle = cache(
  async (): Promise<DecodedConnectionsPuzzle | undefined> => {
    if (publishedPuzzles.length === 0) return undefined;
    return publishedPuzzles[0];
  }
);

/** Returns the raw (base64-encoded) puzzle for client-side game component */
export const getRawTodaysConnectionsPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    if (rawPublished.length === 0) return undefined;
    return rawPublished[0];
  }
);

export const getRecentConnectionsPuzzles = cache(
  async (count: number = 4): Promise<DecodedConnectionsPuzzle[]> => {
    return publishedPuzzles.slice(1, count + 1);
  }
);

export const getConnectionsPuzzlesByMonth = cache(
  async (): Promise<ConnectionsMonthData[]> => {
    const months = new Map<string, DecodedConnectionsPuzzle[]>();

    for (const puzzle of publishedPuzzles) {
      const monthKey = puzzle.printDate.slice(0, 7); // "2026-03"
      const arr = months.get(monthKey);
      if (arr) arr.push(puzzle);
      else months.set(monthKey, [puzzle]);
    }

    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, puzzles]) => {
        const [year, month] = key.split("-");
        const monthName = new Date(`${key}-01`).toLocaleString("en", {
          month: "long",
        });
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
  async (
    date: string
  ): Promise<{
    prev: DecodedConnectionsPuzzle | undefined;
    next: DecodedConnectionsPuzzle | undefined;
  }> => {
    const idx = publishedPuzzles.findIndex((p) => p.printDate === date);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: publishedPuzzles[idx + 1],
      next: idx > 0 ? publishedPuzzles[idx - 1] : undefined,
    };
  }
);
