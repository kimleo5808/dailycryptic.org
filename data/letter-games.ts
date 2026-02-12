export type LetterGameData = {
  wordLength: number;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  strategies: { title: string; content: string }[];
  benefits: string[];
};

export const LETTER_GAMES: LetterGameData[] = [
  {
    wordLength: 4,
    slug: "4-letters",
    title: "4 Letter Wordle Game",
    description: "Play 4-letter Wordle game online. Quick and fun word puzzle perfect for beginners and daily brain training.",
    keywords: ["4 letter wordle", "easy wordle", "4 letter word game", "quick puzzle"],
    intro: "Welcome to the world of 4 letter Wordle, the ideal starting point for both newcomers and experienced word puzzle enthusiasts. This format provides the perfect balance of challenge and accessibility, making it the most popular entry point into word-based brain teasers.",
    strategies: [
      { title: "Vowel-Rich Starters", content: "AREA, IDEA, EURO — Maximize vowel information early to narrow down possibilities." },
      { title: "Balanced Options", content: "CARE, TALE, HOPE, TIME — Optimal letter frequency for maximum information gain." },
      { title: "Consonant Focus", content: "PLAN, BEST, TURN — High-value consonants reveal word structure quickly." },
    ],
    benefits: [
      "Perfect for beginners or a fast daily challenge",
      "Develops pattern recognition and vocabulary skills",
      "Quick games fit into any schedule — typically 2-4 guesses",
      "Builds foundational puzzle-solving strategies",
    ],
  },
  {
    wordLength: 5,
    slug: "5-letters",
    title: "5 Letter Wordle Game",
    description: "Play the classic 5-letter Wordle game online. The original word puzzle format with strategic depth and daily fun.",
    keywords: ["5 letter wordle", "wordle game", "5 letter word game", "classic wordle"],
    intro: "The classic 5-letter Wordle format that started the global word puzzle craze. With the perfect balance of complexity and solvability, 5-letter Wordle remains the gold standard for word puzzle games.",
    strategies: [
      { title: "CRANE Strategy", content: "Start with CRANE — it covers the most common letters in English 5-letter words." },
      { title: "SLATE Method", content: "SLATE covers S, L, A, T, E — five of the most frequent letters in the English language." },
      { title: "Two-Word Opening", content: "Use CRANE then DOUBT to cover 10 different common letters in your first two guesses." },
    ],
    benefits: [
      "The classic format — most strategic depth",
      "Thousands of possible words for endless variety",
      "Perfect for intermediate players",
      "Share results and compare with friends",
    ],
  },
  {
    wordLength: 6,
    slug: "6-letters",
    title: "6 Letter Wordle Game",
    description: "Play 6-letter Wordle game online. Extended word puzzle challenge for players ready to level up from the classic format.",
    keywords: ["6 letter wordle", "hard wordle", "6 letter word game", "extended wordle"],
    intro: "Ready to go beyond the classic 5-letter format? 6-letter Wordle adds an extra layer of complexity with one additional letter position, significantly expanding the possible word combinations and requiring deeper strategic thinking.",
    strategies: [
      { title: "Double Letter Awareness", content: "6-letter words frequently contain double letters (BUTTER, COFFEE). Keep this in mind." },
      { title: "Prefix/Suffix Strategy", content: "Common prefixes (UN-, RE-) and suffixes (-ING, -TION) help narrow options quickly." },
      { title: "Vowel Distribution", content: "6-letter words typically have 2-3 vowels. Identify vowel positions early." },
    ],
    benefits: [
      "Greater challenge than classic 5-letter format",
      "Expands vocabulary with longer words",
      "More strategic possibilities per guess",
      "Trains pattern recognition for complex words",
    ],
  },
  {
    wordLength: 7,
    slug: "7-letters",
    title: "7 Letter Wordle Game",
    description: "Play 7-letter Wordle game online. Advanced word puzzle for experienced players seeking a serious challenge.",
    keywords: ["7 letter wordle", "advanced wordle", "7 letter word game", "challenging wordle"],
    intro: "7-letter Wordle is where word puzzles get serious. With exponentially more possible combinations, this format demands strong vocabulary knowledge, strategic letter placement, and the ability to think about word structure at a deeper level.",
    strategies: [
      { title: "Root Word Strategy", content: "Many 7-letter words are built from shorter roots + affixes. Identify the root first." },
      { title: "Common Endings", content: "Look for -ING, -TION, -MENT, -NESS — these common endings eliminate many possibilities." },
      { title: "Structural Analysis", content: "Think about consonant clusters and syllable patterns to narrow your guesses." },
    ],
    benefits: [
      "Serious challenge for advanced players",
      "Dramatically improves vocabulary",
      "Develops deep word structure understanding",
      "Highly satisfying when solved",
    ],
  },
  {
    wordLength: 8,
    slug: "8-letters",
    title: "8 Letter Wordle Game",
    description: "Play 8-letter Wordle game online. Expert-level word puzzle challenge with complex vocabulary.",
    keywords: ["8 letter wordle", "expert wordle", "8 letter word game", "difficult wordle"],
    intro: "8-letter Wordle pushes your word knowledge to expert levels. These longer words often feature complex morphology, multiple syllables, and less common letter combinations. Solving one is a genuine achievement.",
    strategies: [
      { title: "Morpheme Mapping", content: "Break potential words into morphemes: prefix + root + suffix. This systematic approach is essential." },
      { title: "Elimination Efficiency", content: "Each guess should test maximum unique letters. Avoid repeating confirmed letters in new positions." },
      { title: "Word Family Thinking", content: "Think in word families — COMPLETE, COMPUTER, COMBINED all share patterns." },
    ],
    benefits: [
      "Expert-level vocabulary development",
      "Trains systematic analytical thinking",
      "Covers academic and professional vocabulary",
      "Ultimate brain training workout",
    ],
  },
  {
    wordLength: 9,
    slug: "9-letters",
    title: "9 Letter Wordle Game",
    description: "Play 9-letter Wordle game online. Master-level word puzzle for vocabulary experts and serious puzzle enthusiasts.",
    keywords: ["9 letter wordle", "master wordle", "9 letter word game", "hard word puzzle"],
    intro: "9-letter Wordle is a master-level challenge. With vast possible word combinations, you need exceptional vocabulary, pattern recognition, and strategic thinking. Only the most dedicated word puzzle enthusiasts conquer this format consistently.",
    strategies: [
      { title: "Syllable Counting", content: "9-letter words typically have 3-4 syllables. Count syllables to narrow possibilities." },
      { title: "Common Patterns", content: "Look for -TION, -MENT, -ABLE, -NESS endings — they appear frequently in 9-letter words." },
      { title: "Compound Detection", content: "Some 9-letter words are compounds (BUTTERFLY, SOMETHING). Consider compound structures." },
    ],
    benefits: [
      "Master-level vocabulary expansion",
      "Exceptional cognitive training",
      "Develops advanced pattern recognition",
      "Prestigious achievement when solved",
    ],
  },
  {
    wordLength: 10,
    slug: "10-letters",
    title: "10 Letter Wordle Game",
    description: "Play 10-letter Wordle game online. Ultimate word puzzle challenge for the most dedicated word game enthusiasts.",
    keywords: ["10 letter wordle", "ultimate wordle", "10 letter word game", "extreme wordle"],
    intro: "10-letter Wordle represents the pinnacle of word puzzle difficulty. These words are often academic, professional, or technical in nature, requiring an extensive vocabulary and sophisticated strategic approach to solve.",
    strategies: [
      { title: "Academic Vocabulary", content: "Many 10-letter words come from academic domains — think about formal, technical vocabulary." },
      { title: "Latin/Greek Roots", content: "Understanding Latin and Greek roots (TELE-, MICRO-, -GRAPH) is invaluable at this level." },
      { title: "Process of Elimination", content: "With 6 guesses for 10 letters, every guess must be highly strategic. Eliminate letter groups systematically." },
    ],
    benefits: [
      "Tests the absolute limits of vocabulary",
      "Professional-grade word knowledge development",
      "Unmatched cognitive challenge",
      "Bragging rights for successful solvers",
    ],
  },
  {
    wordLength: 11,
    slug: "11-letters",
    title: "11 Letter Wordle Game",
    description: "Play 11-letter Wordle game online. The ultimate word puzzle challenge — only for the most fearless word game masters.",
    keywords: ["11 letter wordle", "hardest wordle", "11 letter word game", "extreme word puzzle"],
    intro: "11-letter Wordle is the ultimate test of word mastery. With the longest words and the most complex structures, this format demands encyclopedic vocabulary knowledge, advanced morphological analysis, and exceptional strategic planning.",
    strategies: [
      { title: "Morphological Decomposition", content: "Break words into prefix + root + suffix combinations. Most 11-letter words have 3+ morphemes." },
      { title: "High-Frequency Patterns", content: "Focus on common patterns: -TION, -MENT, -ABLE, -NESS, UN-, RE-, DIS-, OVER-." },
      { title: "Contextual Guessing", content: "Think about word contexts — business, science, education — to guide your guesses." },
    ],
    benefits: [
      "The ultimate word puzzle achievement",
      "Develops encyclopedic vocabulary",
      "Sharpens analytical and deductive reasoning",
      "Reserved for true word game masters",
    ],
  },
];

export function getLetterGameBySlug(slug: string): LetterGameData | undefined {
  return LETTER_GAMES.find((g) => g.slug === slug);
}

export const LETTER_GAME_SLUGS = LETTER_GAMES.map((g) => g.slug);
