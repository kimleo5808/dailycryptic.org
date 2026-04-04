#!/usr/bin/env node

/**
 * Fetch NYT Wordle puzzles and add them to puzzles.json.
 *
 * Usage:
 *   node scripts/fetch-wordle.mjs                              # fetch today
 *   node scripts/fetch-wordle.mjs 2026-04-04                   # fetch specific date
 *   node scripts/fetch-wordle.mjs --batch 2026-03-01 2026-03-30  # fetch range
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(__dirname, "..", "data", "wordle", "puzzles.json");
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

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function generateHints(solution) {
  const word = solution.toUpperCase();
  const letters = word.split("");
  const vowelCount = letters.filter((l) => VOWELS.has(l)).length;
  const consonantCount = 5 - vowelCount;

  // hint1: vague thematic clue
  const hint1 = generateThematicHint(word);

  // hint2: structural clue
  const hint2 = `The word starts with ${letters[0]} and has ${vowelCount} vowel${vowelCount !== 1 ? "s" : ""}.`;

  // hint3: partial reveal — show 1st, 3rd, 5th letters
  const partial = letters
    .map((l, i) => (i === 0 || i === 2 || i === 4 ? l : "_"))
    .join(" ");
  const hint3 = partial;

  return { hint1, hint2, hint3 };
}

function generateThematicHint(word) {
  // Simple heuristics for common patterns
  const w = word.toLowerCase();

  if (w.endsWith("ly")) return "This word is likely an adverb or describes a manner.";
  if (w.endsWith("ed")) return "This word is in the past tense.";
  if (w.endsWith("er")) return "This word could compare things or describe a person.";
  if (w.endsWith("ty") || w.endsWith("ny") || w.endsWith("ry"))
    return "This word ends with a common suffix.";
  if (w.endsWith("ck")) return "This word has a sharp ending sound.";
  if (w.endsWith("ng")) return "This word ends with a nasal sound.";
  if (w.endsWith("sh")) return "This word ends with a hushing sound.";
  if (w.endsWith("th")) return "This word ends with a soft consonant blend.";

  // Vowel-heavy
  const vowels = w.split("").filter((c) => VOWELS.has(c.toUpperCase())).length;
  if (vowels >= 3) return "This word is vowel-heavy — think about open, flowing sounds.";

  // Double letters
  for (let i = 0; i < 4; i++) {
    if (w[i] === w[i + 1])
      return "This word contains a double letter.";
  }

  // Fallback based on starting letter
  const starters = {
    a: "Think of a word that starts from the beginning of the alphabet.",
    b: "This word begins with a bold consonant.",
    c: "This word starts with a versatile letter — could be hard or soft.",
    d: "Think of something that starts with a sturdy sound.",
    f: "This word begins with a breathy consonant.",
    g: "This word starts with a letter that can be hard or soft.",
    h: "This word begins with an aspirated sound.",
    j: "This word starts with an uncommon letter.",
    k: "This word begins with a crisp sound.",
    l: "This word starts with a liquid consonant.",
    m: "This word begins with a humming sound.",
    n: "This word starts with a nasal consonant.",
    p: "This word begins with a popping sound.",
    q: "This word starts with one of the rarest letters.",
    r: "This word begins with a rolling sound.",
    s: "This word starts with the most common starting letter in Wordle.",
    t: "This word begins with a sharp tap sound.",
    u: "This word starts with a vowel — less common in Wordle.",
    v: "This word begins with a vibrating consonant.",
    w: "This word starts with a rounded sound.",
    x: "This word starts with a very rare letter.",
    y: "This word begins with a letter that can be vowel or consonant.",
    z: "This word starts with one of the rarest letters.",
  };

  return starters[w[0]] || "Think carefully about today's five-letter word.";
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
  const url = `https://www.nytimes.com/svc/wordle/v2/${dateStr}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API returned ${res.status} for ${dateStr}`);
  return res.json();
}

function parseNYTData(data, dateStr) {
  const solution = data.solution || "";
  const hints = generateHints(solution);

  return {
    id: data.days_since_launch || 0,
    printDate: dateStr,
    status: "published",
    solution: toBase64(solution),
    hint1: hints.hint1,
    hint2: hints.hint2,
    hint3: hints.hint3,
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
/*  Single + Batch                                                     */
/* ------------------------------------------------------------------ */

async function fetchSingle(dateStr) {
  const puzzlesData = loadPuzzlesData();
  if (puzzlesData.puzzles.some((p) => p.printDate === dateStr)) {
    console.log(`Puzzle for ${dateStr} already exists. Skipping.`);
    return;
  }

  console.log(`Fetching: ${dateStr}`);
  const nytData = await fetchPuzzle(dateStr);
  const puzzle = parseNYTData(nytData, dateStr);
  console.log(`  #${puzzle.id}: ${Buffer.from(puzzle.solution, "base64").toString("utf8")}`);

  puzzlesData.puzzles.push(puzzle);
  savePuzzlesData(puzzlesData);
  console.log(`Saved.`);
}

async function fetchBatch(startDate, endDate) {
  const dates = dateRange(startDate, endDate);
  console.log(`Batch: ${dates.length} dates from ${startDate} to ${endDate}`);

  const puzzlesData = loadPuzzlesData();
  const existing = new Set(puzzlesData.puzzles.map((p) => p.printDate));

  let fetched = 0, skipped = 0, failed = 0;

  for (const dateStr of dates) {
    if (existing.has(dateStr)) { skipped++; continue; }

    try {
      console.log(`[${fetched + failed + 1}/${dates.length - skipped}] ${dateStr}...`);
      const nytData = await fetchPuzzle(dateStr);
      const puzzle = parseNYTData(nytData, dateStr);
      console.log(`  #${puzzle.id}: ${Buffer.from(puzzle.solution, "base64").toString("utf8")}`);

      puzzlesData.puzzles.push(puzzle);
      existing.add(dateStr);
      fetched++;

      if (fetched % 10 === 0) {
        savePuzzlesData(puzzlesData);
        console.log(`  (saved, total: ${puzzlesData.puzzles.length})`);
      }
      await sleep(BATCH_DELAY_MS);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failed++;
      await sleep(BATCH_DELAY_MS);
    }
  }

  savePuzzlesData(puzzlesData);
  console.log(`\nDone. Fetched: ${fetched}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log(`Total: ${puzzlesData.puzzles.length}`);
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
