import type { LinkedInGameKey } from "@/types/linkedin";

export interface LinkedInGameMeta {
  key: LinkedInGameKey;
  /** Display name, e.g. "Queens" */
  name: string;
  /** Route slug base, e.g. "linkedin-queens-answer" */
  slug: string;
  /** Tailwind bg class for the reveal button / accent */
  accent: string;
  /** Tailwind border-l class for hub tiles */
  accentBorder: string;
  tagline: string;
  keywords: string[];
}

export const LINKEDIN_GAMES: LinkedInGameMeta[] = [
  {
    key: "queens",
    name: "Queens",
    slug: "linkedin-queens-answer",
    accent: "bg-amber-400",
    accentBorder: "border-l-amber-400",
    tagline: "One crown per row, column and colour region.",
    keywords: [
      "linkedin queens answer today",
      "queens hint today",
      "linkedin queens solution",
      "queens game answer",
      "linkedin queens puzzle answer",
    ],
  },
  {
    key: "zip",
    name: "Zip",
    slug: "linkedin-zip-answer",
    accent: "bg-sky-400",
    accentBorder: "border-l-sky-500",
    tagline: "One path through every cell, hitting the numbers in order.",
    keywords: [
      "linkedin zip answer today",
      "zip solution today",
      "linkedin zip hint",
      "zip game answer",
      "linkedin zip puzzle solution",
    ],
  },
  {
    key: "tango",
    name: "Tango",
    slug: "linkedin-tango-answer",
    accent: "bg-violet-400",
    accentBorder: "border-l-violet-500",
    tagline: "Balance suns and moons without three in a row.",
    keywords: [
      "linkedin tango answer today",
      "tango solution today",
      "linkedin tango hints",
      "tango game answer",
      "linkedin tango puzzle solution",
    ],
  },
  {
    key: "pinpoint",
    name: "Pinpoint",
    slug: "linkedin-pinpoint-answer",
    accent: "bg-emerald-400",
    accentBorder: "border-l-emerald-500",
    tagline: "Guess the category from as few clues as possible.",
    keywords: [
      "linkedin pinpoint answer today",
      "pinpoint category today",
      "linkedin pinpoint hint",
      "pinpoint answer",
      "linkedin pinpoint clues today",
    ],
  },
  {
    key: "crossclimb",
    name: "Crossclimb",
    slug: "linkedin-crossclimb-answer",
    accent: "bg-rose-400",
    accentBorder: "border-l-rose-500",
    tagline: "Climb a word ladder, then cap it top and bottom.",
    keywords: [
      "linkedin crossclimb answer today",
      "crossclimb clues today",
      "crossclimb ladder answer",
      "linkedin crossclimb solution",
      "crossclimb answer",
    ],
  },
];

export const LINKEDIN_GAME_BY_KEY: Record<LinkedInGameKey, LinkedInGameMeta> =
  Object.fromEntries(LINKEDIN_GAMES.map((g) => [g.key, g])) as Record<
    LinkedInGameKey,
    LinkedInGameMeta
  >;

export const LINKEDIN_HUB_PATH = "/linkedin-games-answers";
