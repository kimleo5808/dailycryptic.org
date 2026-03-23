#!/usr/bin/env node

/**
 * Fetch today's NYT Connections puzzle and add it to puzzles.json.
 *
 * Usage:
 *   node scripts/fetch-connections.mjs            # fetch today's puzzle
 *   node scripts/fetch-connections.mjs 2026-03-23  # fetch a specific date
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

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function generateHint(groupName, words) {
  // Simple template-based hint generation
  const name = groupName.toLowerCase();

  // Pattern: "___ Word" or "Word ___"
  if (name.includes("___") || name.includes("...")) {
    return "Each word can pair with a common word";
  }
  // Pattern: "Types of X" or "Kinds of X"
  if (name.startsWith("types of") || name.startsWith("kinds of")) {
    return `Think about different ${name.replace(/^(types|kinds) of\s*/i, "")}`;
  }
  // Pattern: words meaning X
  if (name.includes("meaning") || name.includes("synonym")) {
    return "These words share a similar meaning";
  }
  // Fallback: generic hint based on first word pattern
  const firstWord = words[0] || "";
  if (firstWord.length <= 5) {
    return "Look for what these four words have in common";
  }
  return "These words all belong to the same category";
}

async function fetchPuzzle(dateStr) {
  const url = `https://www.nytimes.com/svc/connections/v2/${dateStr}.json`;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API returned ${res.status} for ${dateStr}`);
  }

  const data = await res.json();
  return data;
}

function parseNYTData(data, dateStr) {
  // NYT API format: { id, print_date, status, categories: [ { title, cards: [{ content, position }] } ] }
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

async function main() {
  const dateArg = process.argv[2];
  const dateStr =
    dateArg || new Date().toISOString().split("T")[0];

  // Load existing data
  let puzzlesData;
  try {
    const raw = fs.readFileSync(PUZZLES_PATH, "utf8");
    puzzlesData = JSON.parse(raw);
  } catch {
    puzzlesData = { lastUpdated: new Date().toISOString(), puzzles: [] };
  }

  // Check for duplicate
  const exists = puzzlesData.puzzles.some((p) => p.printDate === dateStr);
  if (exists) {
    console.log(`Puzzle for ${dateStr} already exists. Skipping.`);
    process.exit(0);
  }

  // Fetch and parse
  const nytData = await fetchPuzzle(dateStr);
  const puzzle = parseNYTData(nytData, dateStr);

  console.log(`Parsed puzzle #${puzzle.id} for ${dateStr}`);
  console.log(
    `Groups: ${puzzle.groups.map((g) => Buffer.from(g.name, "base64").toString("utf8")).join(", ")}`
  );

  // Add to puzzles array (prepend for newest-first)
  puzzlesData.puzzles.unshift(puzzle);
  puzzlesData.lastUpdated = new Date().toISOString();

  // Sort by date descending
  puzzlesData.puzzles.sort((a, b) => b.printDate.localeCompare(a.printDate));

  // Write back
  fs.writeFileSync(PUZZLES_PATH, JSON.stringify(puzzlesData, null, 2) + "\n");
  console.log(`Updated ${PUZZLES_PATH}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
