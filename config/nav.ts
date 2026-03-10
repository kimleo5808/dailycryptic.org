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
            description: "Anagram, charade, container, and more",
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
    ],
  },
];

export const NAV_CTA: NavLink = {
  name: "Today's Clue",
  href: "/minute-cryptic-today",
};
