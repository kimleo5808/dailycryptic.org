#!/usr/bin/env node

/**
 * Fetch the NYT Spelling Bee puzzle and add it to puzzles.json.
 *
 * Unlike Connections/Strands, the NYT Spelling Bee has no per-date JSON
 * endpoint. The data is embedded in the puzzle page as a `window.gameData`
 * object containing `today` and `yesterday`. We parse that blob and store both.
 *
 * Usage:
 *   node scripts/fetch-spelling-bee.mjs                 # fetch today's (and yesterday's) puzzle
 *   node scripts/fetch-spelling-bee.mjs --today         # fetch only today's puzzle
 *   node scripts/fetch-spelling-bee.mjs --file page.html  # parse a locally-saved page
 *
 * There is no historical backfill by date — the archive grows day by day.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "spelling-bee",
  "puzzles.json"
);

const SB_URL = "https://www.nytimes.com/puzzles/spelling-bee";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

/** Extract the balanced JSON object that follows `window.gameData = `. */
function extractGameData(html) {
  const marker = "window.gameData";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("window.gameData not found on page");

  const eq = html.indexOf("=", start);
  let i = html.indexOf("{", eq);
  if (i === -1) throw new Error("gameData object start not found");

  let depth = 0;
  let inStr = false;
  let escaped = false;
  const objStart = i;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(html.slice(objStart, i + 1));
      }
    }
  }
  throw new Error("Unbalanced gameData object");
}

/**
 * NYT Spelling Bee scoring:
 *   - 4-letter word = 1 point
 *   - Longer words = 1 point per letter
 *   - Pangram = word length + 7 bonus points
 * Genius rank = 70% of the maximum score (rounded down).
 */
function computeStats(answers, pangrams) {
  const pangramSet = new Set(pangrams);
  let maxScore = 0;
  for (const word of answers) {
    let pts = word.length === 4 ? 1 : word.length;
    if (pangramSet.has(word)) pts += 7;
    maxScore += pts;
  }
  const startLetters = new Set(answers.map((w) => w[0]));
  return {
    wordCount: answers.length,
    pangramCount: pangrams.length,
    maxScore,
    geniusScore: Math.floor(maxScore * 0.7),
    isBingo: startLetters.size >= 7,
  };
}

function toPuzzle(day) {
  const answers = (day.answers || []).map((w) => w.toLowerCase());
  const pangrams = (day.pangrams || []).map((w) => w.toLowerCase());
  return {
    puzzle: {
      id: day.id || 0,
      printDate: day.printDate,
      status: "published",
      centerLetter: (day.centerLetter || "").toLowerCase(),
      outerLetters: (day.outerLetters || []).map((l) => l.toLowerCase()),
      answers: answers.map(toBase64),
      pangrams: pangrams.map(toBase64),
    },
    stats: computeStats(answers, pangrams),
  };
}

/* ------------------------------------------------------------------ */
/*  Load / save                                                        */
/* ------------------------------------------------------------------ */

function loadPuzzlesData() {
  try {
    return JSON.parse(fs.readFileSync(PUZZLES_PATH, "utf8"));
  } catch {
    return { lastUpdated: new Date().toISOString(), puzzles: [] };
  }
}

function savePuzzlesData(data) {
  data.puzzles.sort((a, b) => b.printDate.localeCompare(a.printDate));
  data.lastUpdated = new Date().toISOString();
  fs.mkdirSync(path.dirname(PUZZLES_PATH), { recursive: true });
  fs.writeFileSync(PUZZLES_PATH, JSON.stringify(data, null, 2) + "\n");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function fetchHtml() {
  const fileIdx = process.argv.indexOf("--file");
  if (fileIdx !== -1 && process.argv[fileIdx + 1]) {
    return fs.readFileSync(process.argv[fileIdx + 1], "utf8");
  }
  const res = await fetch(SB_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Spelling Bee page returned ${res.status}`);
  return res.text();
}

async function main() {
  const onlyToday = process.argv.includes("--today");

  const html = await fetchHtml();
  const gameData = extractGameData(html);

  const days = [gameData.today];
  if (!onlyToday && gameData.yesterday) days.push(gameData.yesterday);

  const data = loadPuzzlesData();
  const existing = new Set(data.puzzles.map((p) => p.printDate));

  let added = 0;
  for (const day of days) {
    if (!day || !day.printDate) continue;
    if (existing.has(day.printDate)) {
      console.log(`Puzzle for ${day.printDate} already exists. Skipping.`);
      continue;
    }
    const { puzzle, stats } = toPuzzle(day);
    data.puzzles.push(puzzle);
    existing.add(day.printDate);
    added++;
    console.log(
      `Added ${day.printDate} #${puzzle.id}: ${stats.wordCount} words, ` +
        `${stats.pangramCount} pangram(s), max ${stats.maxScore}.`
    );
  }

  if (added > 0) {
    savePuzzlesData(data);
    console.log(`Saved. Total puzzles: ${data.puzzles.length}`);
  } else {
    console.log("Nothing new to add.");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
