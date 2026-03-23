export type NavLink = {
  name: string;
  href: string;
  description?: string;
};

export type NavSection = {
  title: string;
  links: NavLink[];
};

export type NavDropdownConfig = {
  label: string;
  /** All hrefs inside this dropdown — used for active-state detection */
  sections: NavSection[];
};

export const NAV_STANDALONE_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
];

export const NAV_DROPDOWNS: NavDropdownConfig[] = [
  {
    label: "Cryptic",
    sections: [
      {
        title: "Minute Cryptic",
        links: [
          {
            name: "Daily Cryptic",
            href: "/daily-cryptic",
            description: "About the daily cryptic format",
          },
          {
            name: "Today's Clue",
            href: "/minute-cryptic-today",
            description: "Solve today's daily clue",
          },
          {
            name: "Archive",
            href: "/minute-cryptic",
            description: "Browse past clues by date or difficulty",
          },
          {
            name: "Unlimited",
            href: "/minute-cryptic-unlimited",
            description: "Practice with unlimited clues",
          },
          {
            name: "Daily Solutions",
            href: "/daily-solution",
            description: "Answer breakdowns for every clue",
          },
        ],
      },
      {
        title: "Guide",
        links: [
          {
            name: "Beginner Guide",
            href: "/cryptic-crossword-for-beginners",
            description: "Start here if you're new to cryptics",
          },
          {
            name: "Clue Types",
            href: "/cryptic-clue-types",
            description: "All 8 clue families explained",
          },
          {
            name: "Indicators",
            href: "/cryptic-indicators",
            description: "Signal words for each clue type",
          },
          {
            name: "How to Solve",
            href: "/how-to-play-minute-cryptic",
            description: "Step-by-step solving method",
          },
          {
            name: "FAQ",
            href: "/minute-cryptic-faq",
            description: "Common questions answered",
          },
        ],
      },
      {
        title: "Tools",
        links: [
          {
            name: "Clue Solver",
            href: "/cryptic-crossword-solver",
            description: "Search clues by text or pattern",
          },
          {
            name: "Word Finder",
            href: "/crossword-word-finder",
            description: "Find words by letter pattern",
          },
          {
            name: "Anagram Solver",
            href: "/anagram-solver",
            description: "Unscramble letters into words",
          },
        ],
      },
      {
        title: "Reference",
        links: [
          {
            name: "Abbreviations",
            href: "/cryptic-abbreviations",
            description: "Letter codes used in wordplay",
          },
          {
            name: "Common Answers",
            href: "/common-crossword-answers",
            description: "Most frequent crossword words",
          },
          {
            name: "Glossary",
            href: "/cryptic-glossary",
            description: "Every cryptic term explained",
          },
        ],
      },
    ],
  },
  {
    label: "Games",
    sections: [
      {
        title: "NYT Connections",
        links: [
          {
            name: "Connections Hints",
            href: "/connections-hint-today",
            description: "Today's hints and answers",
          },
          {
            name: "Connections Archive",
            href: "/connections-hint",
            description: "Browse past puzzles",
          },
        ],
      },
    ],
  },
];

export const NAV_CTA: NavLink = {
  name: "Today's Clue",
  href: "/minute-cryptic-today",
};
