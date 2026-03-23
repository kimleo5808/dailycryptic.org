export type ConnectionsColor = "yellow" | "green" | "blue" | "purple";

export interface ConnectionsGroup {
  color: ConnectionsColor;
  /** Base64-encoded group name */
  name: string;
  /** Plain-text vague hint */
  hint: string;
  /** Base64-encoded words */
  words: string[];
}

export interface ConnectionsPuzzle {
  id: number;
  printDate: string;
  status?: "published" | "scheduled";
  groups: ConnectionsGroup[];
}

export interface ConnectionsDataFile {
  lastUpdated: string;
  puzzles: ConnectionsPuzzle[];
}

export interface DecodedConnectionsGroup {
  color: ConnectionsColor;
  name: string;
  hint: string;
  words: string[];
}

export interface DecodedConnectionsPuzzle {
  id: number;
  printDate: string;
  groups: DecodedConnectionsGroup[];
}

export interface ConnectionsMonthData {
  label: string;
  rangeLabel: string;
  puzzles: DecodedConnectionsPuzzle[];
}
