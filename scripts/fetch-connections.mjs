#!/usr/bin/env node

/**
 * Fetch NYT Connections puzzles and add them to puzzles.json.
 *
 * Usage:
 *   node scripts/fetch-connections.mjs                              # fetch today's puzzle
 *   node scripts/fetch-connections.mjs 2026-03-23                   # fetch a specific date
 *   node scripts/fetch-connections.mjs --batch 2026-02-01 2026-03-16  # fetch a date range
 *
 * Batch mode fetches one puzzle per day in the range (inclusive),
 * sleeps 1.5s between requests, and skips dates that already exist.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "connections",
  "puzzles.json"
);

const BATCH_DELAY_MS = 1500; // delay between requests in batch mode

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateHint(groupName, words) {
  const name = groupName.toLowerCase();

  if (name.includes("___") || name.includes("...")) {
    return "Each word can pair with a common word";
  }
  if (name.startsWith("types of") || name.startsWith("kinds of")) {
    return `Think about different ${name.replace(/^(types|kinds) of\s*/i, "")}`;
  }
  if (name.includes("meaning") || name.includes("synonym")) {
    return "These words share a similar meaning";
  }
  if (name.includes("ending in") || name.includes("starting with") || name.includes("begins with")) {
    return "Pay attention to the letters in each word";
  }
  if (name.includes("metaphor") || name.includes("slang")) {
    return "Think figuratively, not literally";
  }
  if (name.includes("things that") || name.includes("things with") || name.includes("things you")) {
    return "Think about objects or actions that share a trait";
  }
  if (name.includes("react") || name.includes("response")) {
    return "Imagine your physical or emotional response";
  }
  if (name.includes("component") || name.includes("parts of") || name.includes("pieces of")) {
    return "Think about parts that make up a whole";
  }
  if (name.includes("words on") || name.includes("found on") || name.includes("seen on")) {
    return "Think about where you might read these words";
  }
  if (name.includes("figure") || name.includes("character")) {
    return "Think about well-known people or characters";
  }

  const firstWord = words[0] || "";
  if (firstWord.length <= 5) {
    return "Look for what these four words have in common";
  }
  return "These words all belong to the same category";
}

/** Generate all dates in range [start, end] inclusive */
function dateRange(startStr, endStr) {
  const dates = [];
  const start = new Date(startStr + "T12:00:00Z");
  const end = new Date(endStr + "T12:00:00Z");
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().split("T")[0]);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/* ------------------------------------------------------------------ */
/*  Fetch & parse                                                      */
/* ------------------------------------------------------------------ */

async function fetchPuzzle(dateStr) {
  const url = `https://www.nytimes.com/svc/connections/v2/${dateStr}.json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API returned ${res.status} for ${dateStr}`);
  }

  const data = await res.json();
  return data;
}

function parseNYTData(data, dateStr) {
  const categories = data.categories || [];
  const colorOrder = ["yellow", "green", "blue", "purple"];

  const groups = categories.map((cat, idx) => {
    const color = colorOrder[idx] || "yellow";
    const words = (cat.cards || [])
      .sort((a, b) => a.position - b.position)
      .map((card) => card.content);
    const groupName = cat.title || `Group ${idx + 1}`;

    return {
      color,
      name: toBase64(groupName),
      hint: generateHint(groupName, words),
      words: words.map(toBase64),
    };
  });

  return {
    id: data.id || 0,
    printDate: dateStr,
    status: "published",
    groups,
  };
}

/* ------------------------------------------------------------------ */
/*  Load / save                                                        */
/* ------------------------------------------------------------------ */

function loadPuzzlesData() {
  try {
    const raw = fs.readFileSync(PUZZLES_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { lastUpdated: new Date().toISOString(), puzzles: [] };
  }
}

function savePuzzlesData(puzzlesData) {
  puzzlesData.puzzles.sort((a, b) => b.printDate.localeCompare(a.printDate));
  puzzlesData.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PUZZLES_PATH, JSON.stringify(puzzlesData, null, 2) + "\n");
}

/* ------------------------------------------------------------------ */
/*  Single date fetch                                                  */
/* ------------------------------------------------------------------ */

async function fetchSingle(dateStr) {
  const puzzlesData = loadPuzzlesData();

  const exists = puzzlesData.puzzles.some((p) => p.printDate === dateStr);
  if (exists) {
    console.log(`Puzzle for ${dateStr} already exists. Skipping.`);
    return;
  }

  console.log(`Fetching: ${dateStr}`);
  const nytData = await fetchPuzzle(dateStr);
  const puzzle = parseNYTData(nytData, dateStr);

  console.log(
    `  #${puzzle.id}: ${puzzle.groups.map((g) => Buffer.from(g.name, "base64").toString("utf8")).join(" | ")}`
  );

  puzzlesData.puzzles.push(puzzle);
  savePuzzlesData(puzzlesData);
  console.log(`Saved.`);
}

/* ------------------------------------------------------------------ */
/*  Batch fetch                                                        */
/* ------------------------------------------------------------------ */

async function fetchBatch(startDate, endDate) {
  const dates = dateRange(startDate, endDate);
  console.log(
    `Batch: ${dates.length} dates from ${startDate} to ${endDate}`
  );
  console.log(`Delay between requests: ${BATCH_DELAY_MS}ms`);
  console.log("");

  const puzzlesData = loadPuzzlesData();
  const existingDates = new Set(puzzlesData.puzzles.map((p) => p.printDate));

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const dateStr of dates) {
    if (existingDates.has(dateStr)) {
      skipped++;
      continue;
    }

    try {
      console.log(
        `[${fetched + skipped + failed + 1}/${dates.length}] Fetching ${dateStr}...`
      );
      const nytData = await fetchPuzzle(dateStr);
      const puzzle = parseNYTData(nytData, dateStr);

      console.log(
        `  #${puzzle.id}: ${puzzle.groups.map((g) => Buffer.from(g.name, "base64").toString("utf8")).join(" | ")}`
      );

      puzzlesData.puzzles.push(puzzle);
      existingDates.add(dateStr);
      fetched++;

      // Save after every puzzle (crash-safe)
      savePuzzlesData(puzzlesData);

      // Delay before next request
      if (dateStr !== dates[dates.length - 1]) {
        await sleep(BATCH_DELAY_MS);
      }
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failed++;
      // Continue to next date, don't abort the whole batch
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log("");
  console.log(`Done. Fetched: ${fetched}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`Total puzzles in file: ${puzzlesData.puzzles.length}`);
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "--batch" && args[1] && args[2]) {
    await fetchBatch(args[1], args[2]);
  } else {
    const dateStr = args[0] || new Date().toISOString().split("T")[0];
    await fetchSingle(dateStr);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
