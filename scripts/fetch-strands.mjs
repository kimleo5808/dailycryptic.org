#!/usr/bin/env node

/**
 * Fetch NYT Strands puzzles and add them to puzzles.json.
 *
 * Usage:
 *   node scripts/fetch-strands.mjs                              # fetch today's puzzle
 *   node scripts/fetch-strands.mjs 2026-03-23                   # fetch a specific date
 *   node scripts/fetch-strands.mjs --batch 2026-02-01 2026-03-16  # fetch a date range
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "strands",
  "puzzles.json"
);

const BATCH_DELAY_MS = 1500;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determine spangram direction by checking which opposite edges
 * the spangram coordinates touch.
 * Board: 8 rows (0-7) x 6 columns (0-5)
 */
function getSpangramDirection(spangramCoords) {
  if (!spangramCoords || spangramCoords.length === 0) return "horizontal";

  const rows = spangramCoords.map((c) => c[0]);
  const cols = spangramCoords.map((c) => c[1]);

  const touchesTop = rows.includes(0);
  const touchesBottom = rows.includes(7);
  const touchesLeft = cols.includes(0);
  const touchesRight = cols.includes(5);

  if (touchesTop && touchesBottom) return "vertical";
  if (touchesLeft && touchesRight) return "horizontal";

  // Fallback: check which axis spans more
  const rowSpan = Math.max(...rows) - Math.min(...rows);
  const colSpan = Math.max(...cols) - Math.min(...cols);
  return rowSpan >= colSpan ? "vertical" : "horizontal";
}

/**
 * Generate a hint for the puzzle based on the theme (spangram).
 * The spangram is the theme name itself (e.g., WINDINSTRUMENT).
 */
function generateHint(spangram, themeWords) {
  const s = spangram.toLowerCase();

  // Try to split compound spangram into words for analysis
  if (s.includes("instrument")) return "Think about things you play to make music";
  if (s.includes("food") || s.includes("cuisine")) return "Consider items you might find on a menu or in a kitchen";
  if (s.includes("sport") || s.includes("game")) return "These are all related to athletics or competition";
  if (s.includes("animal") || s.includes("bird")) return "Think about creatures from the animal kingdom";
  if (s.includes("term") || s.includes("word")) return "Consider the broader category these words fall under";
  if (s.includes("break") || s.includes("crack") || s.includes("snap")) return "Think about ways something can come apart or split";
  if (s.includes("course") || s.includes("obstacle")) return "Imagine things you might encounter on a challenging path";
  if (s.includes("made") || s.includes("fit") || s.includes("perfect")) return "Look for words that describe something being just right";
  if (s.includes("nose") || s.includes("face") || s.includes("body")) return "Think about a particular part of the body";
  if (s.includes("concession")) return "Picture a venue where you buy snacks and drinks";
  if (s.includes("correspond")) return "These are all ways to communicate in writing";
  if (s.includes("generic")) return "Think about words that started as brand names but became everyday terms";
  if (s.includes("umbrella")) return "Consider the different parts that make up a common rain accessory";

  // Generic fallback based on word count
  if (themeWords.length >= 7) {
    return "The theme connects quite a few words — think broadly about the category";
  }
  return "Think about what all these words have in common with the theme";
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
  const url = `https://www.nytimes.com/svc/strands/v2/${dateStr}.json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API returned ${res.status} for ${dateStr}`);
  }

  const data = await res.json();
  return data;
}

function parseNYTData(data, dateStr) {
  const spangram = data.spangram || "";
  const themeWords = data.themeWords || [];
  const clue = data.clue || "";
  const spangramCoords = data.spangramCoords || [];

  const direction = getSpangramDirection(spangramCoords);

  // Generate a human-friendly theme name from the spangram
  // The spangram IS the theme (e.g., WINDINSTRUMENT = "Wind Instrument")
  // We store the spangram as-is for display and use it as the theme
  const themeName = spangram
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toUpperCase();

  return {
    id: data.id || 0,
    printDate: dateStr,
    status: "published",
    clue,
    hint: generateHint(spangram, themeWords),
    theme: toBase64(themeName),
    spangram: toBase64(spangram),
    spangramDirection: direction,
    spangramLetterCount: spangram.length,
    themeWords: themeWords.map(toBase64),
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
    `  #${puzzle.id}: ${Buffer.from(puzzle.spangram, "base64").toString("utf8")} (${puzzle.themeWords.length} words, ${puzzle.spangramDirection})`
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
        `  #${puzzle.id}: ${Buffer.from(puzzle.spangram, "base64").toString("utf8")} (${puzzle.themeWords.length} words)`
      );

      puzzlesData.puzzles.push(puzzle);
      existingDates.add(dateStr);
      fetched++;

      savePuzzlesData(puzzlesData);

      if (dateStr !== dates[dates.length - 1]) {
        await sleep(BATCH_DELAY_MS);
      }
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failed++;
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
