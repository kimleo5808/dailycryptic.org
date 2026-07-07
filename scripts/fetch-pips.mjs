#!/usr/bin/env node

/**
 * Fetch the NYT Pips puzzle and add it to puzzles.json.
 *
 * Data source: https://www.nytimes.com/svc/pips/v1/{date}.json — a public JSON
 * endpoint (same family as Connections/Strands) containing easy/medium/hard
 * tiers, each with `dominoes`, `regions`, and `solution`.
 *
 * Usage:
 *   node scripts/fetch-pips.mjs                 # fetch today's puzzle
 *   node scripts/fetch-pips.mjs 2026-07-06      # fetch a specific date
 *   node scripts/fetch-pips.mjs --batch 2026-07-01 2026-07-06
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(__dirname, "..", "data", "pips", "puzzles.json");
const BATCH_DELAY_MS = 1500;

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function dateRange(startStr, endStr) {
  const dates = [];
  const cursor = new Date(startStr + "T12:00:00Z");
  const end = new Date(endStr + "T12:00:00Z");
  while (cursor <= end) {
    dates.push(cursor.toISOString().split("T")[0]);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

async function fetchPuzzle(dateStr) {
  const url = `https://www.nytimes.com/svc/pips/v1/${dateStr}.json`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`API returned ${res.status} for ${dateStr}`);
  return res.json();
}

function parseTier(tier) {
  return {
    id: tier.id || 0,
    dominoes: tier.dominoes || [],
    regions: (tier.regions || []).map((r) => {
      const region = { type: r.type, indices: r.indices };
      if (typeof r.target === "number") region.target = r.target;
      return region;
    }),
    // The answer — base64-encoded so it is not trivially scraped from the JSON.
    solution: toBase64(JSON.stringify(tier.solution || [])),
  };
}

function parseNYTData(data, dateStr) {
  return {
    id: data.easy?.id || 0,
    printDate: dateStr,
    status: "published",
    editor: data.editor || "",
    tiers: {
      easy: parseTier(data.easy || {}),
      medium: parseTier(data.medium || {}),
      hard: parseTier(data.hard || {}),
    },
  };
}

function loadPuzzlesData() {
  try {
    return JSON.parse(fs.readFileSync(PUZZLES_PATH, "utf8"));
  } catch {
    return { lastUpdated: new Date().toISOString(), puzzles: [] };
  }
}

function saveData(data) {
  data.puzzles.sort((a, b) => b.printDate.localeCompare(a.printDate));
  data.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(PUZZLES_PATH), { recursive: true });
  fs.writeFileSync(PUZZLES_PATH, JSON.stringify(data, null, 2) + "\n");
}

async function fetchSingle(dateStr) {
  const data = loadPuzzlesData();
  if (data.puzzles.some((p) => p.printDate === dateStr)) {
    console.log(`Puzzle for ${dateStr} already exists. Skipping.`);
    return;
  }
  console.log(`Fetching: ${dateStr}`);
  const puzzle = parseNYTData(await fetchPuzzle(dateStr), dateStr);
  const counts = ["easy", "medium", "hard"]
    .map((t) => `${t}:${puzzle.tiers[t].dominoes.length}`)
    .join(" ");
  console.log(`  ${dateStr} — dominoes ${counts}`);
  data.puzzles.push(puzzle);
  saveData(data);
  console.log("Saved.");
}

async function fetchBatch(startDate, endDate) {
  const dates = dateRange(startDate, endDate);
  console.log(`Batch: ${dates.length} dates from ${startDate} to ${endDate}`);
  const data = loadPuzzlesData();
  const existing = new Set(data.puzzles.map((p) => p.printDate));
  let fetched = 0,
    skipped = 0,
    failed = 0;
  for (const dateStr of dates) {
    if (existing.has(dateStr)) {
      skipped++;
      continue;
    }
    try {
      const puzzle = parseNYTData(await fetchPuzzle(dateStr), dateStr);
      data.puzzles.push(puzzle);
      existing.add(dateStr);
      fetched++;
      saveData(data);
      console.log(`  [${fetched + skipped + failed}/${dates.length}] ${dateStr} ok`);
      if (dateStr !== dates[dates.length - 1]) await sleep(BATCH_DELAY_MS);
    } catch (err) {
      console.error(`  FAILED ${dateStr}: ${err.message}`);
      failed++;
      await sleep(BATCH_DELAY_MS);
    }
  }
  console.log(`Done. Fetched: ${fetched}, Skipped: ${skipped}, Failed: ${failed}`);
}

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
