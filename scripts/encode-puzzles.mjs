/**
 * One-time script to encode sensitive fields (answer, explanation, hintLevels)
 * in puzzles.json using base64, so they are not directly readable in the public repo.
 *
 * Usage: node scripts/encode-puzzles.mjs
 */
import fs from "fs";

const FILE_PATH = "data/minute-cryptic/puzzles.json";

const raw = fs.readFileSync(FILE_PATH, "utf8");
const data = JSON.parse(raw);

function toBase64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

for (const puzzle of data.puzzles) {
  puzzle.answer = toBase64(puzzle.answer);
  puzzle.explanation = toBase64(puzzle.explanation);
  puzzle.hintLevels = puzzle.hintLevels.map((hint) => toBase64(hint));
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log(
  `[encode-puzzles] Encoded ${data.puzzles.length} puzzles (answer, explanation, hintLevels).`
);
