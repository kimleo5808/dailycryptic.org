/**
 * Daily fetcher for LinkedIn games answers.
 *
 * Pulls the day's Queens / Zip / Tango / Pinpoint / Crossclimb answers from
 * several community answer sites, cross-checks whatever more than one source
 * agrees on, runs the same mechanical validation the intake script uses, and
 * writes only the games that survive into data/linkedin/incoming.json.
 *
 * It never guesses. A game with no confident parse is simply skipped — the
 * page then shows its "being verified" state rather than a wrong answer.
 *
 * Usage:
 *   node scripts/fetch-linkedin.mjs              # today (UTC)
 *   node scripts/fetch-linkedin.mjs 2026-08-12   # a specific date
 *   node scripts/fetch-linkedin.mjs --write      # also run the intake step
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const INCOMING_PATH = path.join("data", "linkedin", "incoming.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const args = process.argv.slice(2);
const doWrite = args.includes("--write");
const dateArg = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const DATE = dateArg ?? new Date().toISOString().split("T")[0];

const dateObj = new Date(`${DATE}T12:00:00Z`);
const MONTH = dateObj.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
const DAY = dateObj.getUTCDate();
const YEAR = dateObj.getUTCFullYear();

/* ------------------------------- sources --------------------------------- */

const SOURCES = [
  { name: "techwiser", url: "https://techwiser.com/linkedin-games-answers-today/" },
  {
    name: "fandomwire",
    url: `https://fandomwire.com/all-linkedin-games-solutions-today-${MONTH.toLowerCase()}-${DAY}-${YEAR}/`,
  },
  { name: "puzznest-queens", url: "https://puzznest.com/linkedin-games/queens-answer-today" },
  { name: "puzznest-crossclimb", url: "https://puzznest.com/linkedin-games/crossclimb-answer-today" },
  { name: "puzznest-pinpoint", url: "https://puzznest.com/linkedin-games/pinpoint-answer-today" },
  { name: "puzznest-tango", url: "https://puzznest.com/linkedin-games/tango-answer-today" },
  { name: "puzznest-zip", url: "https://puzznest.com/linkedin-games/zip-answer-today" },
];

async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    const html = await res.text();
    // Strip scripts/styles/tags down to readable text.
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#8217;|&rsquo;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n");
  } catch {
    return null;
  }
}

/* ------------------------------- parsers --------------------------------- */

const UP = (s) => String(s).toUpperCase().replace(/[^A-Z]/g, "");

const GAME_HEADINGS = {
  queens: /queens/i,
  zip: /\bzip\b/i,
  tango: /tango/i,
  pinpoint: /pinpoint/i,
  crossclimb: /crossclimb/i,
};

/**
 * Slice the page down to one game's own section.
 *
 * Without this, a coordinate list printed for Queens is happily re-parsed as
 * Zip waypoints — the two games use the same "row N, column M" phrasing, so a
 * whole-page regex silently produces a fabricated board.
 */
function sectionFor(text, game) {
  const lines = text.split("\n");
  const starts = [];
  lines.forEach((line, i) => {
    for (const [key, re] of Object.entries(GAME_HEADINGS)) {
      // A heading line mentions the game and little else.
      if (re.test(line) && line.trim().length < 90) starts.push({ i, key });
    }
  });
  if (starts.length === 0) return null;
  const mine = starts.filter((s) => s.key === game);
  if (mine.length === 0) return null;
  const start = mine[0].i;
  const next = starts.find((s) => s.i > start && s.key !== game);
  const slice = lines.slice(start, next ? next.i : lines.length).join("\n");
  // A section that still names another game is too ambiguous to trust.
  for (const [key, re] of Object.entries(GAME_HEADINGS)) {
    if (key !== game && re.test(slice)) return null;
  }
  return slice;
}

/** Queens: lines like "Queen 1: Row 3, Column 5" / "Row 3 - Column 5 (purple)". */
function parseQueens(text) {
  const coords = [];
  const re =
    /row\s*(\d+)\s*(?:,|-|–|—|:)?\s*(?:and\s*)?col(?:umn)?\s*(\d+)\s*(?:\(?\s*([a-z]+)\s*\)?)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const row = Number(m[1]);
    const col = Number(m[2]);
    const color = (m[3] ?? "").toLowerCase();
    if (row < 1 || col < 1 || row > 12 || col > 12) continue;
    if (coords.some((c) => c.row === row && c.col === col)) continue;
    const KNOWN_COLORS = [
      "purple", "orange", "blue", "green", "yellow",
      "red", "pink", "gray", "grey", "teal", "brown", "white",
    ];
    coords.push({
      row,
      col,
      color: KNOWN_COLORS.includes(color) ? color.replace("grey", "gray") : "amber",
    });
  }
  if (coords.length < 5) return null;
  const size = Math.max(...coords.map((c) => Math.max(c.row, c.col)));
  if (coords.length !== size) return null;
  return { size, queens: coords };
}

/** Tango: lines like "Row 1: Moon, Sun, Sun, Moon, Sun, Moon". */
function parseTango(text) {
  const rows = [];
  const re = /row\s*(\d+)\s*:?\s*((?:(?:sun|moon)\s*[,\-–]?\s*){4,8})/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const idx = Number(m[1]);
    const cells = m[2]
      .toLowerCase()
      .match(/sun|moon/g)
      ?.map((c) => (c === "sun" ? "S" : "M"));
    if (!cells) continue;
    rows[idx - 1] = cells.join("");
  }
  const filled = rows.filter(Boolean);
  if (filled.length < 4 || filled.length !== rows.length) return null;
  const n = filled.length;
  if (filled.some((r) => r.length !== n)) return null;
  return { rows: filled };
}

const WORD_NUM = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};
const MOVE_DIR = {
  up: [-1, 0], upwards: [-1, 0], upward: [-1, 0],
  down: [1, 0], downwards: [1, 0], downward: [1, 0],
  left: [0, -1], right: [0, 1],
};

/**
 * Zip: walk the prose move directions ("move one block downwards, then one
 * block to the left to reach 2") from an arbitrary origin, then normalise.
 *
 * This is self-verifying: a real Zip path covers every cell of a square grid
 * exactly once, so a misparse essentially never yields N distinct cells
 * filling an exact N×N box. Anything that fails that test is discarded.
 */
function parseZip(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /to reach\s+\d+/i.test(l));
  if (lines.length < 3) return null;

  const legs = [];
  for (const line of lines) {
    const target = Number(line.match(/to reach\s+(\d+)/i)[1]);
    const moves = [];
    const re =
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+blocks?\s+(?:to the\s+)?(up\w*|down\w*|left|right)/gi;
    let m;
    while ((m = re.exec(line)) !== null) {
      const raw = m[1].toLowerCase();
      const n = WORD_NUM[raw] ?? Number(raw);
      const d = MOVE_DIR[m[2].toLowerCase()];
      if (!n || !d || n > 20) return null;
      for (let k = 0; k < n; k += 1) moves.push(d);
    }
    if (moves.length === 0) return null;
    legs.push({ target, moves });
  }

  let r = 0;
  let c = 0;
  const path = [[r, c]];
  const waypoints = [{ num: 1, row: r, col: c }];
  for (const leg of legs) {
    for (const [dr, dc] of leg.moves) {
      r += dr;
      c += dc;
      path.push([r, c]);
    }
    waypoints.push({ num: leg.target, row: r, col: c });
  }

  const minR = Math.min(...path.map((p) => p[0]));
  const minC = Math.min(...path.map((p) => p[1]));
  const norm = path.map(([pr, pc]) => [pr - minR + 1, pc - minC + 1]);
  const rows = Math.max(...norm.map((p) => p[0]));
  const cols = Math.max(...norm.map((p) => p[1]));

  if (rows !== cols) return null;
  if (new Set(norm.map((p) => p.join(","))).size !== norm.length) return null;
  if (norm.length !== rows * cols) return null;

  // Waypoint numbers must run 1..n in order.
  for (let i = 0; i < waypoints.length; i += 1) {
    if (waypoints[i].num !== i + 1) return null;
  }

  return {
    size: rows,
    waypoints: waypoints.map((w) => ({
      num: w.num,
      row: w.row - minR + 1,
      col: w.col - minC + 1,
    })),
    path: norm,
  };
}

/** Pinpoint: five clues then a category line. */
function parsePinpoint(text) {
  const block = text.match(
    /pinpoint[\s\S]{0,1200}?((?:^\s*\d[.)]\s*.+\n){4,6})[\s\S]{0,400}?(?:category|answer)\s*:?\s*(.+)/im
  );
  if (!block) return null;
  const clues = block[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\d[.)]\s*/, "").replace(/["“”]/g, "").trim())
    .filter(Boolean);
  const answer = block[2].replace(/["“”]/g, "").trim();
  if (clues.length < 4 || !answer || answer.length > 120) return null;
  return { clues, answer };
}

/** Crossclimb: clue/answer pairs plus top and bottom words. */
function parseCrossclimb(text) {
  const rungs = [];
  const re = /^\s*(?:[-•*]\s*)?["“]?([A-Za-z][^:\n"”]{6,80})["”]?\s*:\s*([A-Za-z]{3,8})\s*$/gm;
  let m;
  const section = text.slice(Math.max(0, text.toLowerCase().indexOf("crossclimb")));
  while ((m = re.exec(section)) !== null) {
    const clue = m[1].trim();
    const answer = UP(m[2]);
    if (/^(top|bottom)\b/i.test(clue)) continue;
    if (rungs.some((r) => r.answer === answer)) continue;
    rungs.push({ clue, answer });
    if (rungs.length >= 8) break;
  }
  const top = section.match(/top\s*(?:row|word)?\s*:?\s*([A-Za-z]{3,8})\b/i);
  const bottom = section.match(/bottom\s*(?:row|word)?\s*:?\s*([A-Za-z]{3,8})\b/i);
  if (rungs.length < 4 || !top || !bottom) return null;
  const len = rungs[0].answer.length;
  if (rungs.some((r) => r.answer.length !== len)) return null;
  return {
    rungs,
    order: rungs.map((r) => r.answer),
    top: UP(top[1]),
    bottom: UP(bottom[1]),
  };
}

/* ----------------------------- validation -------------------------------- */

function queensValid(q) {
  if (q.queens.length !== q.size) return false;
  const rows = new Set();
  const cols = new Set();
  for (const c of q.queens) {
    if (rows.has(c.row) || cols.has(c.col)) return false;
    rows.add(c.row);
    cols.add(c.col);
  }
  for (let a = 0; a < q.queens.length; a += 1) {
    for (let b = a + 1; b < q.queens.length; b += 1) {
      const p = q.queens[a];
      const r = q.queens[b];
      if (Math.abs(p.row - r.row) <= 1 && Math.abs(p.col - r.col) <= 1) return false;
    }
  }
  return true;
}

function tangoValid(t) {
  const n = t.rows.length;
  const half = n / 2;
  if (n % 2 !== 0) return false;
  for (const row of t.rows) {
    if (row.length !== n) return false;
    if ((row.match(/S/g) ?? []).length !== half) return false;
    if (/SSS|MMM/.test(row)) return false;
  }
  for (let c = 0; c < n; c += 1) {
    const col = t.rows.map((r) => r[c]).join("");
    if ((col.match(/S/g) ?? []).length !== half) return false;
    if (/SSS|MMM/.test(col)) return false;
  }
  return true;
}

function crossclimbValid(c) {
  for (let i = 1; i < c.order.length; i += 1) {
    const a = c.order[i - 1];
    const b = c.order[i];
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let k = 0; k < a.length; k += 1) if (a[k] !== b[k]) diff += 1;
    if (diff !== 1) return false;
  }
  return true;
}

/* -------------------------------- driver --------------------------------- */

const PARSERS = {
  queens: { parse: parseQueens, valid: queensValid, key: (v) => JSON.stringify(v.queens) },
  tango: { parse: parseTango, valid: tangoValid, key: (v) => v.rows.join("|") },
  zip: {
    parse: parseZip,
    // parseZip only returns a board that already covers an exact N×N grid.
    valid: (v) => v.path !== null && v.path.length === v.size * v.size,
    key: (v) => JSON.stringify(v.waypoints),
  },
  pinpoint: {
    parse: parsePinpoint,
    valid: (v) => v.clues.length >= 4 && v.answer.length > 2,
    key: (v) => UP(v.answer),
  },
  crossclimb: {
    parse: parseCrossclimb,
    valid: crossclimbValid,
    key: (v) => v.order.join("|"),
  },
};

const HINTS = {
  queens: [
    "Start with the smallest colour region — it forces a crown fastest.",
    "Remember crowns may never touch, not even diagonally.",
    "One row still has only a single square left open.",
  ],
  zip: [
    "Begin at number 1 and look for the forced first move.",
    "Every cell must be used exactly once, so avoid leaving pockets.",
    "Work backwards from the highest number to meet in the middle.",
  ],
  tango: [
    "Find a row already holding two of the same symbol in a row.",
    "Each row and column needs an equal count of suns and moons.",
    "The = and × signs settle the last stubborn pair.",
  ],
  pinpoint: [
    "The first clue is deliberately broad — hold your guess.",
    "Look for the least literal connection between the clues.",
    "Test your category against every clue revealed so far.",
  ],
  crossclimb: [
    "Solve the easiest clue first and let the letters spread.",
    "Neighbouring rungs differ by exactly one letter.",
    "The top and bottom words form a single phrase together.",
  ],
};

const results = {};
const report = [];

for (const source of SOURCES) {
  const text = await fetchText(source.url);
  if (!text) {
    report.push(`${source.name}: unreachable`);
    continue;
  }
  const found = [];
  for (const [game, spec] of Object.entries(PARSERS)) {
    const section = sectionFor(text, game);
    if (!section) continue;
    let parsed;
    try {
      parsed = spec.parse(section);
    } catch {
      parsed = null;
    }
    if (!parsed || !spec.valid(parsed)) continue;
    found.push(game);
    results[game] ??= [];
    results[game].push({ source: source.name, value: parsed, key: spec.key(parsed) });
  }
  report.push(`${source.name}: ${found.length ? found.join(", ") : "nothing parsed"}`);
}

const day = { date: DATE };
const accepted = [];
const rejected = [];

for (const [game, candidates] of Object.entries(results)) {
  // Prefer a value two sources agree on; otherwise take a lone confident parse.
  const counts = new Map();
  for (const c of candidates) counts.set(c.key, (counts.get(c.key) ?? 0) + 1);
  const [bestKey, bestCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const winner = candidates.find((c) => c.key === bestKey);
  const agreeing = candidates.filter((c) => c.key === bestKey).map((c) => c.source);

  if (candidates.length > 1 && bestCount === 1) {
    rejected.push(`${game}: sources disagree (${candidates.map((c) => c.source).join(" vs ")})`);
    continue;
  }

  day[game] = { ...winner.value, hints: HINTS[game] };
  accepted.push(`${game} (${agreeing.join("+")}${bestCount > 1 ? ", agreed" : ", single source"})`);
}

console.log(`[fetch-linkedin] ${DATE}`);
for (const line of report) console.log(`  · ${line}`);
if (rejected.length) for (const r of rejected) console.log(`  ! ${r}`);

if (accepted.length === 0) {
  console.log("[fetch-linkedin] No game parsed confidently — nothing written.");
  process.exit(0);
}

fs.writeFileSync(INCOMING_PATH, JSON.stringify([day], null, 2) + "\n", "utf8");
console.log(`[fetch-linkedin] Wrote ${INCOMING_PATH}: ${accepted.join("; ")}`);

if (doWrite) {
  execFileSync("node", ["scripts/add-linkedin-day.mjs"], { stdio: "inherit" });
}
