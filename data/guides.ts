export type GuideSection = {
  id: string;
  icon: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
    items?: string[];
  }[];
};

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  icon: string;
  readTime: string;
  level: string;
  levelLabel: string;
  sections: GuideSection[];
};

export const GUIDES: Guide[] = [
  {
    slug: "beginner-guide",
    title: "Minute Cryptic Beginner Guide",
    metaTitle: "Minute Cryptic Beginner Guide - Start Solving Daily Clues",
    description:
      "A practical beginner guide for minute cryptic clues. Learn clue anatomy, common indicators, and a simple daily solving routine.",
    keywords: [
      "minute cryptic beginner guide",
      "how to solve cryptic clue",
      "daily cryptic basics",
      "cryptic clue for beginners",
    ],
    icon: "B1",
    readTime: "8 min read",
    level: "beginner",
    levelLabel: "Beginner Friendly",
    sections: [
      {
        id: "what-is-minute-cryptic",
        icon: "01",
        title: "What Is Minute Cryptic?",
        content:
          "Minute cryptic is a one-clue daily format. Each clue has a straight definition and a wordplay instruction that produce the same answer.",
        subsections: [
          {
            title: "What you get each day",
            content:
              "A short clue, answer length, progressive hints, and a full explanation after checking.",
            items: [
              "One focused clue instead of a full crossword grid",
              "Hint levels that reveal information gradually",
              "Answer validation for quick feedback",
            ],
          },
        ],
      },
      {
        id: "clue-anatomy",
        icon: "02",
        title: "Clue Anatomy",
        content:
          "Most cryptic clues split into two parts: definition and wordplay. You solve by matching both parts to one answer.",
        subsections: [
          {
            title: "Definition side",
            content:
              "Usually at the start or end. Read it as a normal dictionary meaning.",
          },
          {
            title: "Wordplay side",
            content:
              "Contains indicator words that tell you how to build or transform letters.",
          },
          {
            title: "Enumeration",
            content:
              "Letter count is a hard constraint. Use it early to discard weak guesses.",
          },
        ],
      },
      {
        id: "starter-workflow",
        icon: "03",
        title: "Starter Workflow",
        content:
          "Use this repeatable order to avoid random guessing and reduce solve time.",
        subsections: [
          {
            title: "Five-step loop",
            content:
              "Run the same sequence for every clue until it becomes automatic.",
            items: [
              "Mark likely definition at start or end",
              "Circle indicator words",
              "Build one or more candidate answers",
              "Filter by letter count",
              "Confirm definition and wordplay both match",
            ],
          },
        ],
      },
      {
        id: "first-week-plan",
        icon: "04",
        title: "First Week Practice Plan",
        content:
          "The fastest way to improve is short daily reps with explanation review.",
        subsections: [
          {
            title: "Daily routine",
            content:
              "Spend 10 to 15 minutes: solve, check, read explanation, and note one new indicator.",
          },
        ],
      },
    ],
  },
  {
    slug: "strategy-tips",
    title: "Minute Cryptic Strategy Tips",
    metaTitle: "Minute Cryptic Strategy Tips - Solve Faster with Structure",
    description:
      "High-impact strategy tips for daily minute cryptic solving, including indicator tracking, candidate pruning, and hint discipline.",
    keywords: [
      "minute cryptic strategy",
      "cryptic clue solving tips",
      "daily cryptic method",
      "cryptic clue workflow",
    ],
    icon: "S1",
    readTime: "9 min read",
    level: "intermediate",
    levelLabel: "Intermediate",
    sections: [
      {
        id: "definition-first",
        icon: "01",
        title: "Definition-First Advantage",
        content:
          "Locking the definition early narrows candidate space and prevents overfitting to wordplay fragments.",
        subsections: [
          {
            title: "Why it works",
            content:
              "You avoid spending minutes on elegant but wrong constructions that fail the real meaning test.",
          },
        ],
      },
      {
        id: "indicator-bank",
        icon: "02",
        title: "Build an Indicator Bank",
        content:
          "Track indicator words by mechanism so pattern recognition compounds over time.",
        subsections: [
          {
            title: "Core buckets",
            content: "Group indicators into reusable categories.",
            items: [
              "Anagram: mixed, broken, wild",
              "Reversal: back, returned, reversed",
              "Container: in, around, holding",
              "Deletion: without, dropping, no",
              "Hidden: part of, found in, inside",
            ],
          },
        ],
      },
      {
        id: "candidate-pruning",
        icon: "03",
        title: "Candidate Pruning",
        content:
          "Generate multiple options quickly, then eliminate aggressively using constraints.",
        subsections: [
          {
            title: "Pruning checklist",
            content: "Reject candidates that fail any hard rule.",
            items: [
              "Wrong length",
              "Definition mismatch",
              "Wordplay step cannot be justified",
              "Requires unsupported abbreviation",
            ],
          },
        ],
      },
      {
        id: "hint-discipline",
        icon: "04",
        title: "Hint Discipline",
        content:
          "Hints should unblock, not replace solving. Reveal only one level, then return to independent solving.",
      },
    ],
  },
  {
    slug: "common-mistakes",
    title: "Common Minute Cryptic Mistakes",
    metaTitle: "Common Minute Cryptic Mistakes and How to Avoid Them",
    description:
      "Avoid the most common cryptic clue errors: forcing definitions, ignoring enumeration, and overusing hints.",
    keywords: [
      "minute cryptic mistakes",
      "cryptic clue errors",
      "how to avoid cryptic traps",
      "daily cryptic improvement",
    ],
    icon: "M1",
    readTime: "8 min read",
    level: "beginner",
    levelLabel: "Beginner Friendly",
    sections: [
      {
        id: "forcing-definition",
        icon: "01",
        title: "Forcing the Definition",
        content:
          "Many wrong answers come from stretching meaning too far to fit a clever letter operation.",
        subsections: [
          {
            title: "Fix",
            content:
              "Ask if the answer would still look valid in a standard dictionary sense.",
          },
        ],
      },
      {
        id: "ignoring-length",
        icon: "02",
        title: "Ignoring Enumeration",
        content:
          "If length fails, the answer fails. Do not negotiate with the count.",
      },
      {
        id: "single-path-thinking",
        icon: "03",
        title: "Single-Path Thinking",
        content:
          "Sticking to one interpretation too long wastes time and creates confirmation bias.",
        subsections: [
          {
            title: "Fix",
            content:
              "After 60 to 90 seconds, deliberately produce at least two alternative parses.",
          },
        ],
      },
      {
        id: "hint-overuse",
        icon: "04",
        title: "Hint Overuse",
        content:
          "Jumping to deep hints too early reduces learning value and slows long-term progress.",
        subsections: [
          {
            title: "Fix",
            content:
              "Use one hint level as a checkpoint, then attempt a full solve again before revealing more.",
          },
        ],
      },
    ],
  },
  {
    slug: "category-types",
    title: "Minute Cryptic Clue Types",
    metaTitle: "Minute Cryptic Clue Types - Mechanisms You Should Know",
    description:
      "A practical guide to common clue mechanisms in minute cryptic: anagram, charade, container, reversal, hidden word, and double definition.",
    keywords: [
      "cryptic clue types",
      "minute cryptic mechanisms",
      "anagram charade container reversal",
      "cryptic clue patterns",
    ],
    icon: "T1",
    readTime: "11 min read",
    level: "intermediate",
    levelLabel: "Intermediate",
    sections: [
      {
        id: "anagram",
        icon: "01",
        title: "Anagram Clues",
        content:
          "A fodder phrase is rearranged under an anagram indicator.",
        subsections: [
          {
            title: "Spotting pattern",
            content:
              "Look for a chunk of letters near words like mixed, broken, or wild.",
          },
        ],
      },
      {
        id: "charade",
        icon: "02",
        title: "Charade Clues",
        content:
          "The answer is built by joining smaller units in order.",
        subsections: [
          {
            title: "Typical pieces",
            content:
              "Abbreviations, short synonyms, and directional fragments combine into one word.",
          },
        ],
      },
      {
        id: "container-reversal",
        icon: "03",
        title: "Container and Reversal",
        content:
          "One letter group goes inside another, sometimes reversed by direction indicators.",
        subsections: [
          {
            title: "Container indicators",
            content: "in, around, holding, about",
          },
          {
            title: "Reversal indicators",
            content: "back, returned, upside down (context dependent)",
          },
        ],
      },
      {
        id: "hidden-double",
        icon: "04",
        title: "Hidden Word and Double Definition",
        content:
          "Hidden word clues embed answer letters inside the clue text. Double definition clues provide two separate meanings.",
      },
    ],
  },
  {
    slug: "why-so-hard",
    title: "Why Minute Cryptic Feels Hard",
    metaTitle: "Why Minute Cryptic Feels Hard and How to Break Through",
    description:
      "Understand why cryptic clues feel difficult at first and how to improve with structure, repetition, and post-solve review.",
    keywords: [
      "why cryptic clues are hard",
      "minute cryptic difficulty",
      "how to improve cryptic solving",
      "cryptic learning curve",
    ],
    icon: "H1",
    readTime: "7 min read",
    level: "beginner",
    levelLabel: "Beginner Friendly",
    sections: [
      {
        id: "dual-reading",
        icon: "01",
        title: "Dual Reading Load",
        content:
          "A cryptic clue must be read both as natural language and as coded instructions, which doubles cognitive load.",
      },
      {
        id: "indicator-memory",
        icon: "02",
        title: "Indicator Memory Gap",
        content:
          "Beginners lack a stable indicator vocabulary, so they miss mechanism signals that experts see instantly.",
      },
      {
        id: "ambiguity-pressure",
        icon: "03",
        title: "Ambiguity Pressure",
        content:
          "Many clues allow several plausible parses. Without a process, it feels random.",
        subsections: [
          {
            title: "Fix",
            content:
              "Use strict constraints: definition fit, mechanism validity, and exact enumeration.",
          },
        ],
      },
      {
        id: "improvement-model",
        icon: "04",
        title: "Improvement Model",
        content:
          "Progress comes from short daily repetition plus explanation review, not from marathon solving sessions.",
      },
    ],
  },
  {
    slug: "advanced-techniques",
    title: "Advanced Minute Cryptic Techniques",
    metaTitle: "Advanced Minute Cryptic Techniques for Faster Solves",
    description:
      "Advanced solving techniques for experienced players: multi-parse testing, compression notes, and timed review loops.",
    keywords: [
      "advanced minute cryptic",
      "expert cryptic techniques",
      "faster cryptic solving",
      "cryptic clue training",
    ],
    icon: "A1",
    readTime: "10 min read",
    level: "advanced",
    levelLabel: "Advanced",
    sections: [
      {
        id: "multi-parse-testing",
        icon: "01",
        title: "Multi-Parse Testing",
        content:
          "High-level solving means testing two or three parse hypotheses in parallel before committing.",
      },
      {
        id: "abbrev-library",
        icon: "02",
        title: "Abbreviation Library",
        content:
          "Maintain a compact list of frequent cryptic abbreviations and update it from solved clues.",
        subsections: [
          {
            title: "Useful categories",
            content: "direction, time, titles, geography, chemistry, and common crossword abbreviations",
          },
        ],
      },
      {
        id: "timed-loops",
        icon: "03",
        title: "Timed Solve Loops",
        content:
          "Use fixed windows to improve decision quality under pressure.",
        subsections: [
          {
            title: "Suggested loop",
            content:
              "90 seconds independent solve, 30 seconds hypothesis reset, then one hint level if blocked.",
          },
        ],
      },
      {
        id: "post-solve-notes",
        icon: "04",
        title: "Post-Solve Compression Notes",
        content:
          "After each clue, record one line: mechanism, key indicator, and what caused delay. This compounds quickly over weeks.",
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
