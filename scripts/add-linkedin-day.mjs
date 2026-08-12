/**
 * Incremental ingest for LinkedIn games daily answers.
 *
 * Workflow:
 *   1. Author a day (or several) in plaintext in data/linkedin/incoming.json —
 *      an array of day objects shaped like:
 *      [{
 *        "date": "2026-08-12",
 *        "queens": { "puzzleNumber": 123, "size": 8,
 *                    "queens": [{"row":1,"col":4,"color":"purple"}, ...],
 *                    "hints": ["...", "...", "..."] },
 *        "zip": { "puzzleNumber": 1, "size": 6,
 *                 "waypoints": [{"num":1,"row":1,"col":1}, ...],
 *                 "path": [[1,1],[1,2], ...] | null,
 *                 "hints": [...] },
 *        "tango": { "puzzleNumber": 1, "rows": ["SMSMSM", ...], "hints": [...] },
 *        "pinpoint": { "puzzleNumber": 1, "clues": ["a","b","c","d","e"],
 *                      "answer": "...", "hints": [...] },
 *        "crossclimb": { "puzzleNumber": 1,
 *                        "rungs": [{"clue":"...","answer":"WORD"}, ...],
 *                        "order": ["WORD", ...], "top": "...", "bottom": "...",
 *                        "hints": [...] }
 *      }]
 *      Every game key is optional — include only what you have.
 *   2. Run: node scripts/add-linkedin-day.mjs   (or: pnpm add:linkedin)
 *
 * Sensitive fields are base64-encoded on the way in, matching every other game
 * in this repo. Re-running is safe: an existing date is replaced, not duplicated.
 */
import fs from "fs";
import path from "path";

const PUZZLES_PATH = path.join("data", "linkedin", "puzzles.json");
const INCOMING_PATH = path.join("data", "linkedin", "incoming.json");

const b64 = (str) => Buffer.from(String(str), "utf8").toString("base64");
const b64json = (value) => b64(JSON.stringify(value));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function die(msg, list) {
  console.error(`[add-linkedin] ${msg}`);
  if (list) for (const e of list) console.error(`  - ${e}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(PUZZLES_PATH, "utf8"));
} catch (err) {
  die(`Cannot read/parse ${PUZZLES_PATH}: ${err.message}`);
}
if (!Array.isArray(data.days)) die("puzzles.json `days` must be an array.");

let incoming;
try {
  incoming = JSON.parse(fs.readFileSync(INCOMING_PATH, "utf8"));
} catch (err) {
  die(`Cannot read/parse ${INCOMING_PATH}: ${err.message}`);
}
if (!Array.isArray(incoming)) die("incoming.json must be a JSON array.");
if (incoming.length === 0) {
  console.log("[add-linkedin] incoming.json is empty — nothing to add.");
  process.exit(0);
}

/* ------------------------------ validation ------------------------------- */

const errors = [];

function checkHints(hints, at) {
  if (!Array.isArray(hints) || hints.length !== 3) {
    errors.push(`${at}.hints must be an array of exactly 3 strings.`);
  } else if (hints.some((h) => typeof h !== "string" || !h.trim())) {
    errors.push(`${at}.hints must not contain empty items.`);
  }
}

incoming.forEach((day, i) => {
  const at = `incoming[${i}]`;
  if (!day || typeof day !== "object") return errors.push(`${at} must be an object.`);
  if (!DATE_RE.test(day.date ?? "")) errors.push(`${at}.date must be YYYY-MM-DD.`);

  const games = ["queens", "zip", "tango", "pinpoint", "crossclimb"].filter(
    (k) => day[k] !== undefined
  );
  if (games.length === 0) errors.push(`${at} has no game data at all.`);

  if (day.queens) {
    const q = day.queens;
    checkHints(q.hints, `${at}.queens`);
    if (!Number.isInteger(q.size) || q.size < 4) errors.push(`${at}.queens.size invalid.`);
    if (!Array.isArray(q.queens) || q.queens.length === 0) {
      errors.push(`${at}.queens.queens must be a non-empty array.`);
    } else {
      if (q.queens.length !== q.size) {
        errors.push(
          `${at}.queens: ${q.queens.length} crowns on a ${q.size}x${q.size} board (expected ${q.size}).`
        );
      }
      const rows = new Set();
      const cols = new Set();
      for (const c of q.queens) {
        if (!Number.isInteger(c.row) || !Number.isInteger(c.col)) {
          errors.push(`${at}.queens has a crown with non-integer coordinates.`);
          continue;
        }
        if (c.row < 1 || c.row > q.size || c.col < 1 || c.col > q.size) {
          errors.push(`${at}.queens crown (${c.row},${c.col}) is off the board.`);
        }
        if (rows.has(c.row)) errors.push(`${at}.queens has two crowns in row ${c.row}.`);
        if (cols.has(c.col)) errors.push(`${at}.queens has two crowns in column ${c.col}.`);
        rows.add(c.row);
        cols.add(c.col);
      }
      // No two crowns may touch, including diagonally.
      for (let a = 0; a < q.queens.length; a += 1) {
        for (let b = a + 1; b < q.queens.length; b += 1) {
          const p = q.queens[a];
          const r = q.queens[b];
          if (Math.abs(p.row - r.row) <= 1 && Math.abs(p.col - r.col) <= 1) {
            errors.push(
              `${at}.queens crowns (${p.row},${p.col}) and (${r.row},${r.col}) touch.`
            );
          }
        }
      }
    }
  }

  if (day.zip) {
    const z = day.zip;
    checkHints(z.hints, `${at}.zip`);
    if (!Number.isInteger(z.size) || z.size < 3) errors.push(`${at}.zip.size invalid.`);
    if (!Array.isArray(z.waypoints) || z.waypoints.length === 0) {
      errors.push(`${at}.zip.waypoints must be a non-empty array.`);
    }
    if (z.path != null) {
      if (!Array.isArray(z.path)) {
        errors.push(`${at}.zip.path must be an array of [row, col] pairs or null.`);
      } else {
        if (z.path.length !== z.size * z.size) {
          errors.push(
            `${at}.zip.path covers ${z.path.length} cells but the board has ${z.size * z.size}.`
          );
        }
        for (let k = 1; k < z.path.length; k += 1) {
          const [pr, pc] = z.path[k - 1];
          const [cr, cc] = z.path[k];
          if (Math.abs(pr - cr) + Math.abs(pc - cc) !== 1) {
            errors.push(`${at}.zip.path jumps between step ${k} and ${k + 1}.`);
            break;
          }
        }
      }
    }
  }

  if (day.tango) {
    const t = day.tango;
    checkHints(t.hints, `${at}.tango`);
    if (!Array.isArray(t.rows) || t.rows.length === 0) {
      errors.push(`${at}.tango.rows must be a non-empty array.`);
    } else {
      const n = t.rows.length;
      for (const [ri, row] of t.rows.entries()) {
        if (typeof row !== "string" || row.length !== n || /[^SM]/.test(row)) {
          errors.push(`${at}.tango.rows[${ri}] must be ${n} chars of S/M.`);
        }
      }
    }
  }

  if (day.pinpoint) {
    const p = day.pinpoint;
    checkHints(p.hints, `${at}.pinpoint`);
    if (!Array.isArray(p.clues) || p.clues.length === 0) {
      errors.push(`${at}.pinpoint.clues must be a non-empty array.`);
    }
    if (typeof p.answer !== "string" || !p.answer.trim()) {
      errors.push(`${at}.pinpoint.answer must be a non-empty string.`);
    }
  }

  if (day.crossclimb) {
    const c = day.crossclimb;
    checkHints(c.hints, `${at}.crossclimb`);
    if (!Array.isArray(c.rungs) || c.rungs.length === 0) {
      errors.push(`${at}.crossclimb.rungs must be a non-empty array.`);
    } else if (
      c.rungs.some(
        (r) => !r || typeof r.clue !== "string" || typeof r.answer !== "string"
      )
    ) {
      errors.push(`${at}.crossclimb.rungs need a clue and answer each.`);
    }
    if (!Array.isArray(c.order) || c.order.length !== (c.rungs?.length ?? -1)) {
      errors.push(`${at}.crossclimb.order must list every rung answer once.`);
    } else {
      // Neighbouring ladder words must differ by exactly one letter.
      for (let k = 1; k < c.order.length; k += 1) {
        const a = String(c.order[k - 1]).toUpperCase();
        const b = String(c.order[k]).toUpperCase();
        if (a.length !== b.length) {
          errors.push(`${at}.crossclimb ladder words "${a}" and "${b}" differ in length.`);
          continue;
        }
        let diff = 0;
        for (let x = 0; x < a.length; x += 1) if (a[x] !== b[x]) diff += 1;
        if (diff !== 1) {
          errors.push(
            `${at}.crossclimb ladder step "${a}" → "${b}" changes ${diff} letters (expected 1).`
          );
        }
      }
    }
    if (typeof c.top !== "string" || typeof c.bottom !== "string") {
      errors.push(`${at}.crossclimb needs top and bottom bonus words.`);
    }
  }
});

if (errors.length) die(`Batch rejected with ${errors.length} error(s):`, errors);

/* -------------------------------- encode --------------------------------- */

function encodeDay(day) {
  const out = { date: day.date };
  if (day.queens) {
    out.queens = {
      ...(day.queens.puzzleNumber !== undefined
        ? { puzzleNumber: day.queens.puzzleNumber }
        : {}),
      size: day.queens.size,
      solution: b64json(day.queens.queens),
      hints: day.queens.hints.map(b64),
    };
  }
  if (day.zip) {
    out.zip = {
      ...(day.zip.puzzleNumber !== undefined
        ? { puzzleNumber: day.zip.puzzleNumber }
        : {}),
      size: day.zip.size,
      solution: b64json({ waypoints: day.zip.waypoints, path: day.zip.path ?? null }),
      hints: day.zip.hints.map(b64),
    };
  }
  if (day.tango) {
    out.tango = {
      ...(day.tango.puzzleNumber !== undefined
        ? { puzzleNumber: day.tango.puzzleNumber }
        : {}),
      solution: b64json(day.tango.rows),
      hints: day.tango.hints.map(b64),
    };
  }
  if (day.pinpoint) {
    out.pinpoint = {
      ...(day.pinpoint.puzzleNumber !== undefined
        ? { puzzleNumber: day.pinpoint.puzzleNumber }
        : {}),
      clues: day.pinpoint.clues.map(b64),
      answer: b64(day.pinpoint.answer),
      hints: day.pinpoint.hints.map(b64),
    };
  }
  if (day.crossclimb) {
    out.crossclimb = {
      ...(day.crossclimb.puzzleNumber !== undefined
        ? { puzzleNumber: day.crossclimb.puzzleNumber }
        : {}),
      rungs: b64json(day.crossclimb.rungs),
      order: b64json(day.crossclimb.order),
      top: b64(day.crossclimb.top),
      bottom: b64(day.crossclimb.bottom),
      hints: day.crossclimb.hints.map(b64),
    };
  }
  return out;
}

let added = 0;
let replaced = 0;
for (const day of incoming) {
  const encoded = encodeDay(day);
  const idx = data.days.findIndex((d) => d.date === day.date);
  if (idx === -1) {
    data.days.push(encoded);
    added += 1;
  } else {
    // Merge per game, never whole-day replace: a fetch that only resolved two
    // games must not wipe the others already stored for that date.
    data.days[idx] = { ...data.days[idx], ...encoded };
    replaced += 1;
  }
}

data.days.sort((a, b) => a.date.localeCompare(b.date));
data.lastUpdated = new Date().toISOString();

fs.writeFileSync(PUZZLES_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
fs.writeFileSync(INCOMING_PATH, "[]\n", "utf8");

console.log(
  `[add-linkedin] ${added} day(s) added, ${replaced} replaced. Library now ${data.days.length} day(s).`
);
