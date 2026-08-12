import fs from "fs";

const FILE_PATH = "data/minute-cryptic/puzzles.json";
const TODAY = new Date().toISOString().split("T")[0];

function fromBase64(str) {
  return Buffer.from(str, "base64").toString("utf8");
}
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUS = new Set(["published", "scheduled", "draft"]);
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

function normalizedAnswer(value) {
  return String(value).toUpperCase().replace(/[^A-Z]/g, "");
}

function isValidDateString(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

function parseEnumLength(clue) {
  const m = String(clue).match(/\((\d+)\)\s*$/);
  return m ? Number.parseInt(m[1], 10) : null;
}

function clueLetters(clue) {
  return normalizedAnswer(String(clue).replace(/\(\d+\)\s*$/, ""));
}

function sortedLetters(value) {
  return normalizedAnswer(value).split("").sort().join("");
}

/* An anagram clue must contain its fodder verbatim: some contiguous run of
   clue words whose letters are exactly the answer's letters. */
function hasAnagramFodder(clue, answer) {
  const target = sortedLetters(answer);
  const words = String(clue)
    .replace(/\(\d+\)\s*$/, "")
    .split(/\s+/)
    .filter(Boolean);
  for (let i = 0; i < words.length; i += 1) {
    let acc = "";
    for (let j = i; j < words.length; j += 1) {
      acc += normalizedAnswer(words[j]);
      if (acc.length === target.length && sortedLetters(acc) === target) return true;
      if (acc.length > target.length) break;
    }
  }
  return false;
}

const errors = [];
const warnings = [];

let raw;
try {
  raw = fs.readFileSync(FILE_PATH, "utf8");
} catch (err) {
  console.error(`[validate-minute-cryptic] Cannot read ${FILE_PATH}`);
  console.error(err);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`[validate-minute-cryptic] Invalid JSON in ${FILE_PATH}`);
  console.error(err);
  process.exit(1);
}

if (!data || typeof data !== "object") {
  errors.push("Top-level JSON must be an object.");
}

if (!Array.isArray(data?.puzzles)) {
  errors.push("`puzzles` must be an array.");
}

const puzzlesRaw = Array.isArray(data?.puzzles) ? data.puzzles : [];
const puzzles = puzzlesRaw.map((p) => {
  if (!p || typeof p !== "object") return p;
  return {
    ...p,
    answer: typeof p.answer === "string" ? fromBase64(p.answer) : p.answer,
    explanation:
      typeof p.explanation === "string"
        ? fromBase64(p.explanation)
        : p.explanation,
    hintLevels: Array.isArray(p.hintLevels)
      ? p.hintLevels.map((h) => (typeof h === "string" ? fromBase64(h) : h))
      : p.hintLevels,
  };
});
const seenIds = new Set();
const seenDates = new Set();
const seenAnswers = new Map();

for (let i = 0; i < puzzles.length; i += 1) {
  const p = puzzles[i];
  const label = `puzzles[${i}]`;

  if (!p || typeof p !== "object") {
    errors.push(`${label} must be an object.`);
    continue;
  }

  if (!Number.isInteger(p.id) || p.id <= 0) {
    errors.push(`${label}.id must be a positive integer.`);
  } else if (seenIds.has(p.id)) {
    errors.push(`${label}.id is duplicated: ${p.id}`);
  } else {
    seenIds.add(p.id);
  }

  if (!isValidDateString(p.printDate)) {
    errors.push(`${label}.printDate must be YYYY-MM-DD: ${p.printDate}`);
  } else if (seenDates.has(p.printDate)) {
    errors.push(`${label}.printDate is duplicated: ${p.printDate}`);
  } else {
    seenDates.add(p.printDate);
  }

  if (p.publishDate !== undefined && !isValidDateString(p.publishDate)) {
    errors.push(`${label}.publishDate must be YYYY-MM-DD: ${p.publishDate}`);
  }

  if (p.status !== undefined && !VALID_STATUS.has(p.status)) {
    errors.push(`${label}.status must be one of: published|scheduled|draft`);
  }

  if (typeof p.clue !== "string" || p.clue.trim().length === 0) {
    errors.push(`${label}.clue must be a non-empty string.`);
  }

  if (typeof p.answer !== "string" || p.answer.trim().length === 0) {
    errors.push(`${label}.answer must be a non-empty string.`);
  } else {
    const key = normalizedAnswer(p.answer);
    if (seenAnswers.has(key)) {
      errors.push(
        `${label}.answer is duplicated with puzzles[${seenAnswers.get(key)}]: ${p.answer}`
      );
    } else {
      seenAnswers.set(key, i);
    }
  }

  if (!VALID_TYPES.has(p.clueType)) {
    errors.push(`${label}.clueType is invalid: ${p.clueType}`);
  }

  if (!VALID_DIFFICULTY.has(p.difficulty)) {
    errors.push(`${label}.difficulty is invalid: ${p.difficulty}`);
  }

  if (!Array.isArray(p.hintLevels) || p.hintLevels.length !== 4) {
    errors.push(`${label}.hintLevels must be an array of 4 strings.`);
  } else if (p.hintLevels.some((x) => typeof x !== "string" || x.trim() === "")) {
    errors.push(`${label}.hintLevels must not contain empty items.`);
  }

  if (typeof p.explanation !== "string" || p.explanation.trim().length === 0) {
    errors.push(`${label}.explanation must be a non-empty string.`);
  }

  const enumLen = parseEnumLength(p.clue);
  if (enumLen) {
    const answerLen = normalizedAnswer(p.answer).length;
    if (answerLen !== enumLen) {
      errors.push(
        `${label} enumeration mismatch: clue(${enumLen}) vs answer(${answerLen})`
      );
    }
  }

  /* Mechanical soundness checks per clue type */
  if (p.clueType === "hidden-word" && typeof p.clue === "string" && typeof p.answer === "string") {
    if (!clueLetters(p.clue).includes(normalizedAnswer(p.answer))) {
      errors.push(
        `${label} hidden-word: answer "${p.answer}" is not concealed contiguously in the clue.`
      );
    }
  }
  if (p.clueType === "anagram" && typeof p.clue === "string" && typeof p.answer === "string") {
    if (!hasAnagramFodder(p.clue, p.answer)) {
      errors.push(
        `${label} anagram: no contiguous clue words have exactly the letters of "${p.answer}".`
      );
    }
  }
  if (Array.isArray(p.hintLevels) && typeof p.answer === "string") {
    const m = String(p.hintLevels[3] ?? "").match(/^Starts with ['"]?([A-Za-z])/);
    if (m && m[1].toUpperCase() !== normalizedAnswer(p.answer)[0]) {
      errors.push(
        `${label} hintLevels[3] says "Starts with ${m[1]}" but answer is "${p.answer}".`
      );
    }
  }

  const publishDate = p.publishDate ?? p.printDate;
  if (p.status === "published" && publishDate > TODAY) {
    warnings.push(
      `${label} is marked published but publishDate is in future: ${publishDate}`
    );
  }
}

const sortedIds = [...seenIds].sort((a, b) => a - b);
for (let i = 0; i < sortedIds.length; i += 1) {
  const expected = i + 1;
  if (sortedIds[i] !== expected) {
    warnings.push(`ID sequence has a gap near expected id ${expected}.`);
    break;
  }
}

if (errors.length > 0) {
  console.error(`[validate-minute-cryptic] FAILED with ${errors.length} error(s).`);
  for (const e of errors) console.error(`- ${e}`);
  if (warnings.length > 0) {
    console.error(`[validate-minute-cryptic] warnings (${warnings.length}):`);
    for (const w of warnings) console.error(`- ${w}`);
  }
  process.exit(1);
}

console.log(`[validate-minute-cryptic] PASS (${puzzles.length} puzzles checked).`);
if (warnings.length > 0) {
  console.log(`[validate-minute-cryptic] warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`- ${w}`);
}
