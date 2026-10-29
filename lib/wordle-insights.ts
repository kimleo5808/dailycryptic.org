import ALL_WORDS from "@/data/five-letter/words.json";
import GLOSSES from "@/data/five-letter/glosses.json";

/*
 * Per-answer solving data for the /wordle-answer/[date] pages.
 *
 * Everything is computed at build time from the bundled five-letter word list
 * (data/five-letter/words.json) and WordNet-derived glosses, so each archive
 * page carries figures that belong to its own answer: how far the usual
 * openers get you, which lookalike words could cost a streak, and how unusual
 * each letter's position is.
 */

const WORDS: string[] = (ALL_WORDS as string[]).map((w) => w.toUpperCase());
const WORD_SET = new Set(WORDS);
const GLOSS = GLOSSES as Record<string, string>;

export const OPENERS = ["CRANE", "SLATE"] as const;
const MAX_LOOKALIKES = 10;

/** Wordle colouring for one guess: G = green, Y = yellow, B = grey. */
function feedback(guess: string, answer: string): string {
  const tiles = ["B", "B", "B", "B", "B"];
  const unmatched: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) tiles[i] = "G";
    else unmatched[answer[i]] = (unmatched[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (tiles[i] === "G") continue;
    if (unmatched[guess[i]]) {
      tiles[i] = "Y";
      unmatched[guess[i]] -= 1;
    }
  }
  return tiles.join("");
}

function differsByOneLetter(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < 5; i++) if (a[i] !== b[i] && ++diff > 1) return false;
  return diff === 1;
}

export interface OpenerResult {
  opener: string;
  /** Five characters of G / Y / B. */
  pattern: string;
  /** Words in the list (answer included) that give the same colours. */
  remaining: number;
}

export interface PositionShare {
  letter: string;
  /** 1-based position in the word. */
  position: number;
  /** Percentage of listed words with this letter in this position. */
  share: number;
}

export interface WordleInsights {
  answer: string;
  gloss?: string;
  totalWords: number;
  openers: OpenerResult[];
  bothOpenersRemaining: number;
  lookalikes: string[];
  lookalikeCount: number;
  positionShares: PositionShare[];
}

export function getWordleInsights(solution: string): WordleInsights {
  const answer = solution.toUpperCase();
  // A few answers (e.g. EMOJI) are newer than the word list; count them anyway.
  const pool = WORD_SET.has(answer) ? WORDS : [...WORDS, answer];

  const openers = OPENERS.map((opener) => {
    const pattern = feedback(opener, answer);
    const remaining = pool.filter((w) => feedback(opener, w) === pattern).length;
    return { opener, pattern, remaining };
  });

  const bothOpenersRemaining = pool.filter((w) =>
    openers.every((o) => feedback(o.opener, w) === o.pattern)
  ).length;

  // Only defined words, so the list shows real lookalikes rather than obscure entries.
  const allLookalikes = WORDS.filter(
    (w) => w !== answer && GLOSS[w] && differsByOneLetter(w, answer)
  );

  const positionShares = answer.split("").map((letter, i) => ({
    letter,
    position: i + 1,
    share:
      Math.round((pool.filter((w) => w[i] === letter).length / pool.length) * 1000) / 10,
  }));

  return {
    answer,
    gloss: GLOSS[answer],
    totalWords: pool.length,
    openers,
    bothOpenersRemaining,
    lookalikes: allLookalikes.slice(0, MAX_LOOKALIKES),
    lookalikeCount: allLookalikes.length,
    positionShares,
  };
}
