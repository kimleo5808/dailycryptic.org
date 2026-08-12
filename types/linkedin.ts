/** LinkedIn games daily answers — raw (base64-encoded) and decoded shapes. */

export type LinkedInGameKey =
  | "queens"
  | "zip"
  | "tango"
  | "pinpoint"
  | "crossclimb";

/* ------------------------------- raw file -------------------------------- */

interface RawGameBase {
  puzzleNumber?: number;
  /** Three progressive spoiler-free hints, each base64. */
  hints: string[];
}

export interface RawQueens extends RawGameBase {
  size: number;
  /** base64 JSON: { row, col, color }[] (1-based coords) */
  solution: string;
}

export interface RawZip extends RawGameBase {
  size: number;
  /** base64 JSON: { waypoints: {num,row,col}[], path: [r,c][] | null } */
  solution: string;
}

export interface RawTango extends RawGameBase {
  /** base64 JSON: string[] rows of "S"/"M" */
  solution: string;
}

export interface RawPinpoint extends RawGameBase {
  /** base64 each */
  clues: string[];
  answer: string;
}

export interface RawCrossclimb extends RawGameBase {
  /** base64 JSON: { clue, answer }[] in given order */
  rungs: string;
  /** base64 JSON: string[] final ladder order */
  order: string;
  top: string;
  bottom: string;
}

export interface LinkedInDay {
  date: string; // YYYY-MM-DD
  queens?: RawQueens;
  zip?: RawZip;
  tango?: RawTango;
  pinpoint?: RawPinpoint;
  crossclimb?: RawCrossclimb;
}

export interface LinkedInDataFile {
  lastUpdated: string;
  days: LinkedInDay[];
}

/* ------------------------------- decoded --------------------------------- */

export interface QueensPlacement {
  row: number;
  col: number;
  color: string;
}

export interface DecodedQueens {
  puzzleNumber?: number;
  size: number;
  queens: QueensPlacement[];
  hints: string[];
}

export interface ZipWaypoint {
  num: number;
  row: number;
  col: number;
}

export interface DecodedZip {
  puzzleNumber?: number;
  size: number;
  waypoints: ZipWaypoint[];
  path: [number, number][] | null;
  hints: string[];
}

export interface DecodedTango {
  puzzleNumber?: number;
  /** rows of "S" (sun) / "M" (moon) */
  rows: string[];
  hints: string[];
}

export interface DecodedPinpoint {
  puzzleNumber?: number;
  clues: string[];
  answer: string;
  hints: string[];
}

export interface CrossclimbRung {
  clue: string;
  answer: string;
}

export interface DecodedCrossclimb {
  puzzleNumber?: number;
  rungs: CrossclimbRung[];
  order: string[];
  top: string;
  bottom: string;
  hints: string[];
}

export interface DecodedLinkedInDay {
  date: string;
  queens?: DecodedQueens;
  zip?: DecodedZip;
  tango?: DecodedTango;
  pinpoint?: DecodedPinpoint;
  crossclimb?: DecodedCrossclimb;
}
