/**
 * Merge structured per-clue analysis into puzzles.json.
 *
 * Authoring stays in plaintext (`data/minute-cryptic/analysis.source.json`),
 * keyed by puzzle id. This script base64-encodes each field (matching how
 * answer/explanation/hintLevels are stored) and writes it onto the matching
 * puzzle's `analysis` field. Safe to re-run: it always re-encodes from the
 * plaintext source, so it never double-encodes.
 *
 * Usage: node scripts/apply-minute-cryptic-analysis.mjs
 */
import fs from "fs";

const PUZZLES_PATH = "data/minute-cryptic/puzzles.json";
const SOURCE_PATH = "data/minute-cryptic/analysis.source.json";

const toBase64 = (str) => Buffer.from(String(str), "utf8").toString("base64");

const data = JSON.parse(fs.readFileSync(PUZZLES_PATH, "utf8"));
const source = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));

const byId = new Map(data.puzzles.map((p) => [p.id, p]));

let applied = 0;
const missing = [];

for (const entry of source.analyses) {
  const puzzle = byId.get(entry.id);
  if (!puzzle) {
    missing.push(entry.id);
    continue;
  }
  const { definition, device, steps, note } = entry;
  if (!definition || !device || !Array.isArray(steps) || !steps.length || !note) {
    throw new Error(
      `Analysis for puzzle #${entry.id} is incomplete (need definition, device, steps[], note).`
    );
  }
  puzzle.analysis = {
    definition: toBase64(definition),
    device: toBase64(device),
    steps: steps.map(toBase64),
    note: toBase64(note),
  };
  applied += 1;
}

fs.writeFileSync(PUZZLES_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(`[apply-analysis] Applied analysis to ${applied} puzzle(s).`);
if (missing.length) {
  console.warn(`[apply-analysis] No puzzle found for ids: ${missing.join(", ")}`);
}
