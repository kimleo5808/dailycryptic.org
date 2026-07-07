#!/usr/bin/env node

/**
 * Fetch the NYT Letter Boxed puzzle and add it to puzzles.json.
 *
 * Data source: the puzzle page embeds a `window.gameData` object containing
 * `sides` (the four sides of three letters), `ourSolution` (the official
 * two-word solution) and a full `dictionary`. Only `sides` + `ourSolution`
 * are stored; the dictionary is discarded to keep the bundle small.
 *
 * Only today's puzzle is available on the page (no historical backfill), so
 * the archive grows one day at a time.
 *
 * Usage:
 *   node scripts/fetch-letter-boxed.mjs                 # fetch today
 *   node scripts/fetch-letter-boxed.mjs --file page.html  # parse a saved page
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUZZLES_PATH = path.join(
  __dirname,
  "..",
  "data",
  "letter-boxed",
  "puzzles.json"
);

const LB_URL = "https://www.nytimes.com/puzzles/letter-boxed";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

/** Extract the balanced JSON object following `window.gameData = `. */
function extractGameData(html) {
  const start = html.indexOf("window.gameData");
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
      if (depth === 0) return JSON.parse(html.slice(objStart, i + 1));
    }
  }
  throw new Error("Unbalanced gameData object");
}

function toPuzzle(data) {
  const solution = (data.ourSolution || []).map((w) => w.toUpperCase());
  return {
    id: data.id || 0,
    printDate: data.printDate,
    status: "published",
    sides: (data.sides || []).map((s) => s.toUpperCase()),
    solution: toBase64(JSON.stringify(solution)),
  };
}

async function fetchHtml() {
  const fileIdx = process.argv.indexOf("--file");
  if (fileIdx !== -1 && process.argv[fileIdx + 1]) {
    return fs.readFileSync(process.argv[fileIdx + 1], "utf8");
  }
  const res = await fetch(LB_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Letter Boxed page returned ${res.status}`);
  return res.text();
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

async function main() {
  const gameData = extractGameData(await fetchHtml());
  if (!gameData.printDate) throw new Error("gameData missing printDate");

  const data = loadPuzzlesData();
  if (data.puzzles.some((p) => p.printDate === gameData.printDate)) {
    console.log(`Puzzle for ${gameData.printDate} already exists. Skipping.`);
    return;
  }

  const puzzle = toPuzzle(gameData);
  data.puzzles.push(puzzle);
  saveData(data);
  console.log(
    `Added ${puzzle.printDate} #${puzzle.id}: sides ${puzzle.sides.join("-")}, ` +
      `${(gameData.ourSolution || []).length}-word solution.`
  );
  console.log(`Saved. Total puzzles: ${data.puzzles.length}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
