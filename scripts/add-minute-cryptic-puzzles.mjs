/**
 * Incremental ingest for Minute Cryptic puzzles.
 *
 * Workflow:
 *   1. Author a batch of plaintext puzzles in data/minute-cryptic/incoming.json
 *      (array of objects; see incoming.example.json for the shape — no id/date/status).
 *   2. Run: node scripts/add-minute-cryptic-puzzles.mjs   (or: pnpm add:minute-cryptic)
 *   3. Run: pnpm validate:minute-cryptic
 *
 * The script validates every draft, assigns sequential ids and one-per-day
 * printDates (continuing after the latest existing date), base64-encodes the
 * sensitive fields, appends to puzzles.json, and empties incoming.json.
 *
 * Existing puzzles are never re-encoded, so this is safe to run repeatedly
 * (unlike the one-time encode-puzzles.mjs).
 */
import fs from "fs";
import path from "path";

const PUZZLES_PATH = path.join("data", "minute-cryptic", "puzzles.json");
const INCOMING_PATH = path.join("data", "minute-cryptic", "incoming.json");

const VALID_TYPES = new Set([
  "anagram",
  "charade",
  "container",
  "double-definition",
  "hidden-word",
  "reversal",
  "homophone",
  "deletion",
]);
const VALID_DIFFICULTY = new Set(["easy", "medium", "hard"]);

const toBase64 = (str) => Buffer.from(str, "utf8").toString("base64");
const fromBase64 = (str) => Buffer.from(str, "base64").toString("utf8");
const normalizedAnswer = (v) => String(v).toUpperCase().replace(/[^A-Z]/g, "");
const parseEnumLength = (clue) => {
  const m = String(clue).match(/\((\d+)\)\s*$/);
  return m ? Number.parseInt(m[1], 10) : null;
};
const clueLetters = (clue) => normalizedAnswer(String(clue).replace(/\(\d+\)\s*$/, ""));
const sortedLetters = (v) => normalizedAnswer(v).split("").sort().join("");
/* An anagram clue must contain its fodder verbatim: some contiguous run of
   clue words whose letters are exactly the answer's letters. */
const hasAnagramFodder = (clue, answer) => {
  const target = sortedLetters(answer);
  const words = String(clue).replace(/\(\d+\)\s*$/, "").split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i += 1) {
    let acc = "";
    for (let j = i; j < words.length; j += 1) {
      acc += normalizedAnswer(words[j]);
      if (acc.length === target.length && sortedLetters(acc) === target) return true;
      if (acc.length > target.length) break;
    }
  }
  return false;
};

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

function die(msg, list) {
  console.error(`[add-minute-cryptic] ${msg}`);
  if (list) for (const e of list) console.error(`  - ${e}`);
  process.exit(1);
}

// --- Load files ---
let dataRaw;
try {
  dataRaw = JSON.parse(fs.readFileSync(PUZZLES_PATH, "utf8"));
} catch (err) {
  die(`Cannot read/parse ${PUZZLES_PATH}: ${err.message}`);
}
if (!Array.isArray(dataRaw.puzzles)) die("puzzles.json `puzzles` must be an array.");

let incoming;
try {
  incoming = JSON.parse(fs.readFileSync(INCOMING_PATH, "utf8"));
} catch (err) {
  die(`Cannot read/parse ${INCOMING_PATH}: ${err.message}`);
}
if (!Array.isArray(incoming)) die("incoming.json must be a JSON array.");
if (incoming.length === 0) {
  console.log("[add-minute-cryptic] incoming.json is empty — nothing to add.");
  process.exit(0);
}

// --- Existing state ---
const existingIds = dataRaw.puzzles.map((p) => p.id);
const existingDates = dataRaw.puzzles.map((p) => p.publishDate ?? p.printDate);
const existingAnswers = new Set(
  dataRaw.puzzles.map((p) => normalizedAnswer(fromBase64(p.answer)))
);
let nextId = Math.max(...existingIds) + 1;
let nextDate = addDays([...existingDates].sort().pop(), 1);

// --- Validate batch (fail fast, write nothing on any error) ---
const errors = [];
const batchAnswers = new Set();
incoming.forEach((p, i) => {
  const at = `incoming[${i}]`;
  if (!p || typeof p !== "object") return errors.push(`${at} must be an object.`);
  if (typeof p.clue !== "string" || !p.clue.trim()) errors.push(`${at}.clue must be a non-empty string.`);
  if (typeof p.answer !== "string" || !p.answer.trim()) errors.push(`${at}.answer must be a non-empty string.`);
  if (!VALID_TYPES.has(p.clueType)) errors.push(`${at}.clueType invalid: ${p.clueType}`);
  if (!VALID_DIFFICULTY.has(p.difficulty)) errors.push(`${at}.difficulty invalid: ${p.difficulty}`);
  if (!Array.isArray(p.hintLevels) || p.hintLevels.length !== 4) {
    errors.push(`${at}.hintLevels must be an array of exactly 4 strings.`);
  } else if (p.hintLevels.some((h) => typeof h !== "string" || !h.trim())) {
    errors.push(`${at}.hintLevels must not contain empty items.`);
  }
  if (typeof p.explanation !== "string" || !p.explanation.trim()) errors.push(`${at}.explanation must be a non-empty string.`);

  if (typeof p.clue === "string" && typeof p.answer === "string") {
    const enumLen = parseEnumLength(p.clue);
    const ansLen = normalizedAnswer(p.answer).length;
    if (!enumLen) errors.push(`${at}.clue must end with an enumeration like "(5)".`);
    else if (enumLen !== ansLen) errors.push(`${at} enumeration mismatch: clue(${enumLen}) vs answer(${ansLen}).`);

    const key = normalizedAnswer(p.answer);
    if (existingAnswers.has(key)) errors.push(`${at}.answer "${p.answer}" already exists in puzzles.json.`);
    if (batchAnswers.has(key)) errors.push(`${at}.answer "${p.answer}" is duplicated within this batch.`);
    batchAnswers.add(key);

    if (p.clueType === "hidden-word" && !clueLetters(p.clue).includes(key)) {
      errors.push(`${at} hidden-word: answer "${p.answer}" is not concealed contiguously in the clue.`);
    }
    if (p.clueType === "anagram" && !hasAnagramFodder(p.clue, p.answer)) {
      errors.push(`${at} anagram: no contiguous clue words have exactly the letters of "${p.answer}".`);
    }
    if (Array.isArray(p.hintLevels)) {
      const m = String(p.hintLevels[3] ?? "").match(/^Starts with ['"]?([A-Za-z])/);
      if (m && m[1].toUpperCase() !== key[0]) {
        errors.push(`${at}.hintLevels[3] says "Starts with ${m[1]}" but answer is "${p.answer}".`);
      }
    }
  }
});
if (errors.length) die(`Batch rejected with ${errors.length} error(s):`, errors);

// --- Build encoded entries ---
const added = incoming.map((p) => {
  const printDate = nextDate;
  const entry = {
    id: nextId,
    printDate,
    publishDate: printDate,
    status: "scheduled",
    clue: p.clue,
    answer: toBase64(p.answer),
    clueType: p.clueType,
    difficulty: p.difficulty,
    hintLevels: p.hintLevels.map(toBase64),
    explanation: toBase64(p.explanation),
  };
  nextId += 1;
  nextDate = addDays(nextDate, 1);
  return entry;
});

dataRaw.puzzles.push(...added);
dataRaw.lastUpdated = new Date().toISOString();

fs.writeFileSync(PUZZLES_PATH, JSON.stringify(dataRaw, null, 2) + "\n", "utf8");
fs.writeFileSync(INCOMING_PATH, "[]\n", "utf8");

const first = added[0];
const last = added[added.length - 1];
console.log(
  `[add-minute-cryptic] Added ${added.length} puzzle(s): ` +
    `id ${first.id}–${last.id}, dates ${first.printDate} → ${last.printDate}. ` +
    `Library now ${dataRaw.puzzles.length} total.`
);
console.log("[add-minute-cryptic] incoming.json reset to []. Next: pnpm validate:minute-cryptic");
