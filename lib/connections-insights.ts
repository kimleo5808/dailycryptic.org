import type { DecodedConnectionsPuzzle } from "@/types/connections";

/*
 * Archive cross-references for a /connections-hint/[date] page: which of the
 * sixteen words have appeared in earlier puzzles (and under which category),
 * and which groups reuse a trick the puzzle has played before. Everything is
 * derived from the bundled archive, with links back to the earlier puzzles.
 */

const MAX_RETURNING = 6;

/** Recognisable category tricks, matched against the upper-cased group name. */
const TRICKS: { key: string; label: string; test: RegExp }[] = [
  { key: "blank", label: "fill-in-the-blank", test: /_{2,}/ },
  { key: "homophone", label: "homophone", test: /HOMOPHONE|SOUNDS? LIKE/ },
  { key: "anagram", label: "anagram", test: /ANAGRAM/ },
  {
    key: "letter",
    label: "letter-change",
    test: /LETTER (CHANGED|ADDED|REMOVED|DROPPED|SWAPPED)|(MINUS|PLUS|MISSING|WITHOUT|LOSING|ADD) (A |ONE |THEIR |ITS |THE )?(FIRST |LAST )?LETTER/,
  },
  {
    key: "starts-ends",
    label: "start-or-end-of-word",
    test: /^(STARTS?|ENDS?|BEGINNINGS?) OF\b|STARTING WITH|ENDING (WITH|IN)/,
  },
  { key: "rhyme", label: "rhyme", test: /RHYM/ },
  { key: "reversal", label: "reversal", test: /BACKWARD|REVERSED|IN REVERSE/ },
];

// Group names repeat across every page render, so classify each one once.
const trickCache = new Map<string, (typeof TRICKS)[number] | undefined>();

function trickOf(name: string) {
  if (!trickCache.has(name)) {
    const up = name.toUpperCase();
    trickCache.set(name, TRICKS.find((t) => t.test.test(up)));
  }
  return trickCache.get(name);
}

/** The fixed word of a fill-in-the-blank category, e.g. "___ BELL" → "BELL". */
function blankAnchor(name: string): string {
  return name.toUpperCase().replace(/_+/g, " ").replace(/[^A-Z' ]/g, " ").replace(/\s+/g, " ").trim();
}

export interface PastAppearance {
  id: number;
  printDate: string;
  category: string;
}

export interface ReturningWord {
  word: string;
  /** Earlier puzzles in the archive that used this word. */
  times: number;
  last: PastAppearance;
}

export interface TrickNote {
  category: string;
  trickLabel: string;
  /** Earlier groups in the archive using the same trick. */
  earlierCount: number;
  /** Most recent earlier group with the same trick (or same blank anchor). */
  example?: PastAppearance;
  /** For fill-in-the-blank groups: an earlier group with the same fixed word. */
  sameAnchor?: PastAppearance;
}

export interface ConnectionsInsights {
  archiveSize: number;
  archiveStart: string;
  hasEarlierPuzzles: boolean;
  returning: ReturningWord[];
  returningCount: number;
  newWordCount: number;
  tricks: TrickNote[];
}

export function getConnectionsInsights(
  puzzle: DecodedConnectionsPuzzle,
  archive: DecodedConnectionsPuzzle[]
): ConnectionsInsights {
  // Newest first, so the first match found is the most recent appearance.
  const earlier = archive
    .filter((p) => p.printDate < puzzle.printDate)
    .sort((a, b) => b.printDate.localeCompare(a.printDate));
  const earlierGroups = earlier.flatMap((p) =>
    p.groups.map((g) => ({ id: p.id, printDate: p.printDate, group: g }))
  );

  const words = puzzle.groups.flatMap((g) => g.words);
  const returningAll: ReturningWord[] = [];
  for (const word of words) {
    const hits = earlierGroups.filter((e) => e.group.words.includes(word));
    if (hits.length === 0) continue;
    returningAll.push({
      word,
      times: hits.length,
      last: { id: hits[0].id, printDate: hits[0].printDate, category: hits[0].group.name },
    });
  }
  returningAll.sort((a, b) => b.times - a.times || a.word.localeCompare(b.word));

  const tricks: TrickNote[] = [];
  for (const g of puzzle.groups) {
    const trick = trickOf(g.name);
    if (!trick) continue;
    const same = earlierGroups.filter((e) => trickOf(e.group.name)?.key === trick.key);
    const note: TrickNote = {
      category: g.name,
      trickLabel: trick.label,
      earlierCount: same.length,
      example: same[0]
        ? { id: same[0].id, printDate: same[0].printDate, category: same[0].group.name }
        : undefined,
    };
    if (trick.key === "blank") {
      const anchor = blankAnchor(g.name);
      const match = same.find((e) => anchor && blankAnchor(e.group.name) === anchor);
      if (match) {
        note.sameAnchor = { id: match.id, printDate: match.printDate, category: match.group.name };
      }
    }
    tricks.push(note);
  }

  return {
    archiveSize: archive.length,
    archiveStart: archive.reduce(
      (min, p) => (p.printDate < min ? p.printDate : min),
      puzzle.printDate
    ),
    hasEarlierPuzzles: earlier.length > 0,
    returning: returningAll.slice(0, MAX_RETURNING),
    returningCount: returningAll.length,
    newWordCount: words.length - returningAll.length,
    tricks,
  };
}
