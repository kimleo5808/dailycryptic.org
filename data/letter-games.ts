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
    title: "4 Letter Wordle - Free Unlimited Word Game",
    description: "Play 4-letter Wordle online for free. Guess the hidden word in 6 tries with unlimited games, strategy tips, and best starting words. No download required.",
    keywords: ["4 letter wordle", "4 letter word game", "wordle 4 letters", "4 letter wordle unlimited", "4 letter wordle free", "4 letter word guessing game", "easy wordle", "short word puzzle"],
    intro: "Guess a hidden 4-letter word in 6 tries. After each guess, tiles change color to show how close you are — green means correct, yellow means right letter wrong spot, gray means not in the word. The shorter format makes every guess count.",
    strategies: [
      { title: "Start with SALE or TIRE", content: "These words cover high-frequency letters (S, A, L, E, T, I, R) and quickly reveal the word's structure." },
      { title: "Eliminate Vowels Early", content: "4-letter words usually have 1-2 vowels. Try AIDE or EURO first to pin down which vowels are in play." },
      { title: "Watch for Double Letters", content: "Words like BOOK, FEET, and BALL are common. If your first guesses leave few options, consider repeated letters." },
    ],
    benefits: [
      "Fastest Wordle format — most games solved in 2-4 guesses",
      "Great warm-up before tackling NYT Strands or longer puzzles",
      "Builds pattern recognition useful for all word games",
      "Unlimited free games with no account required",
    ],
  },
  {
    wordLength: 5,
    slug: "5-letters",
    title: "5 Letter Wordle - The Classic Free Word Game",
    description: "Play the classic 5-letter Wordle online for free. The original format with unlimited games, best starting words, and strategy tips. No download required.",
    keywords: ["5 letter wordle", "classic wordle", "wordle 5 letters", "5 letter word game", "5 letter wordle free", "5 letter wordle unlimited", "wordle game online", "five letter word game"],
    intro: "The original 5-letter format that made Wordle a global phenomenon. Guess the hidden word in 6 tries using color-coded feedback — green for correct, yellow for misplaced, gray for absent. With over 2,000 possible answer words, every game is a fresh challenge.",
    strategies: [
      { title: "Start with CRANE or SLATE", content: "These words cover E, A, R, S, T, L, N, C — the most frequent letters in 5-letter English words. Either one reveals critical information on guess #1." },
      { title: "Two-Word Opening", content: "Play CRANE then DOUBT to test 10 different high-frequency letters in just 2 guesses, leaving you well-positioned to solve by guess 3 or 4." },
      { title: "Vowel-First Approach", content: "Try ADIEU or AUDIO to locate 4 vowels immediately. Once you know which vowels are present, consonant placement becomes much easier." },
    ],
    benefits: [
      "The classic Wordle format — the gold standard of word puzzles",
      "Over 2,000 answer words for unlimited variety",
      "Ideal strategic depth for daily vocabulary training",
      "Sharpens pattern recognition skills useful for NYT Strands",
    ],
  },
  {
    wordLength: 6,
    slug: "6-letters",
    title: "6 Letter Wordle - Free Unlimited Word Game Online",
    description: "Play 6-letter Wordle free online with unlimited games. Guess the hidden 6-letter word in 6 tries. Strategy tips, best starting words, and prefix/suffix guides. No download required.",
    keywords: ["6 letter wordle", "6 letter word game", "wordle 6 letters", "6 letter wordle free", "6 letter wordle unlimited", "six letter wordle", "6 letter word puzzle", "6 letter wordle online"],
    intro: "6-letter Wordle steps up the challenge from the classic format. With roughly 10x more possible answer words than 5-letter Wordle, every guess demands sharper thinking. Prefixes, suffixes, and double letters all become key factors in your strategy.",
    strategies: [
      { title: "Start with STRAIN or PLANET", content: "These cover high-frequency 6-letter consonants and vowels (S, T, R, A, I, N, P, L, E). Both test common patterns found in 6-letter words." },
      { title: "Think in Prefixes + Roots", content: "6 letters is where UN-, RE-, and IN- prefixes become common (UNLOCK, REFORM, INSURE). If early guesses reveal a prefix, focus on the root word." },
      { title: "Expect Double Letters", content: "About 25-30% of 6-letter words contain a repeated letter (BUTTER, COFFEE, KITTEN). If you're stuck with 4-5 known letters, try doubling one." },
    ],
    benefits: [
      "The natural next step after mastering classic 5-letter Wordle",
      "Builds prefix and suffix awareness useful across all word games",
      "Double-letter patterns train deeper vocabulary intuition",
      "Unlimited free games — no account or download needed",
    ],
  },
  {
    wordLength: 7,
    slug: "7-letters",
    title: "7 Letter Wordle - Free Advanced Word Game",
    description: "Play 7-letter Wordle free online. Advanced word puzzle with 34,000+ possible words. Master root words, suffixes, and compound word strategies. Unlimited games.",
    keywords: ["7 letter wordle", "7 letter word game", "wordle 7 letters", "7 letter wordle free", "7 letter wordle unlimited", "seven letter wordle", "advanced wordle", "hard word game"],
    intro: "7-letter Wordle is where vocabulary depth becomes essential. With over 34,000 possible words — and common suffixes like -ING appearing in thousands of them — you need to think about word structure, not just individual letters. Identify roots, prefixes, and suffixes to crack these longer puzzles.",
    strategies: [
      { title: "Start with STRANGE or ROAMING", content: "These test 7 unique high-frequency letters and include common 7-letter patterns (consonant clusters, -ING ending)." },
      { title: "Spot the Suffix First", content: "Over 2,000 seven-letter words end in -ING alone. If early guesses reveal I, N, G — lock in the suffix and focus on the 4-letter root." },
      { title: "Think Root + Affix", content: "Most 7-letter words are built from a shorter root plus a prefix or suffix: RE+START, WALK+ING, UN+HAPPY. Decompose the word mentally." },
    ],
    benefits: [
      "Builds morphological awareness — understand how words are constructed",
      "Over 34,000 possible words for endless variety",
      "Trains suffix/prefix recognition useful for Strands and crosswords",
      "Unlimited free games with no account required",
    ],
  },
  {
    wordLength: 8,
    slug: "8-letters",
    title: "8 Letter Wordle - Free Expert Word Game",
    description: "Play 8-letter Wordle free online. Expert-level word puzzle with 80,000+ possible words. Compound word strategies, academic vocabulary, and unlimited games.",
    keywords: ["8 letter wordle", "8 letter word game", "wordle 8 letters", "8 letter wordle free", "8 letter wordle unlimited", "eight letter wordle", "expert word game", "hard wordle game"],
    intro: "8-letter Wordle is expert territory. The word pool explodes to over 80,000 possibilities, featuring academic terms, compound words, and complex prefix-root-suffix combinations. You still get only 6 guesses, so every attempt must be highly strategic.",
    strategies: [
      { title: "Start with ABSOLUTE or STRONGLY", content: "These test 8 unique high-frequency letters across common positions. Both probe typical 8-letter word structures." },
      { title: "Decompose into Parts", content: "Most 8-letter words break into 2-3 parts: OVER+COME, BASE+BALL, UN+COVER+S. Identify one part and the rest follows." },
      { title: "Target Common Endings", content: "Suffixes like -TION, -MENT, -ABLE, -NESS, -TING appear in thousands of 8-letter words. Confirming the ending early narrows your search dramatically." },
    ],
    benefits: [
      "Expert-level challenge with 80,000+ word possibilities",
      "Builds academic and professional vocabulary naturally",
      "Compound word awareness improves all word game performance",
      "Unlimited free games — no download or account needed",
    ],
  },
  {
    wordLength: 9,
    slug: "9-letters",
    title: "9 Letter Wordle - Free Master-Level Word Game",
    description: "Play 9-letter Wordle free online. Master-level word puzzle with 3-4 syllable words, compound structures, and academic vocabulary. Unlimited games, no download.",
    keywords: ["9 letter wordle", "9 letter word game", "wordle 9 letters", "9 letter wordle free", "9 letter wordle unlimited", "nine letter wordle", "master word game", "hard word puzzle"],
    intro: "9-letter Wordle is a master-level challenge built for serious word game players. Most answers are 3-4 syllable words drawn from academic, professional, and literary vocabulary. Compound words, multi-affix structures, and less common letter combinations make every solved puzzle a genuine accomplishment.",
    strategies: [
      { title: "Start with EDUCATION or TRAMPLING", content: "EDUCATION tests 5 vowels + common consonants. TRAMPLING covers top consonants (T, R, M, P, L, N, G) plus I and A." },
      { title: "Think in Syllable Chunks", content: "9-letter words have 3-4 syllables. Sound them out mentally: BEAU-TI-FUL, DAN-GER-OUS, CHOC-O-LATE. This narrows possibilities faster than letter-by-letter thinking." },
      { title: "Check for Compound Structures", content: "SOMETHING, BUTTERFLY, EVERYBODY, SUNFLOWER — many 9-letter words are two smaller words joined. If the first 4-5 letters form a word, the answer is likely a compound." },
    ],
    benefits: [
      "Master-level challenge for dedicated word game players",
      "Builds academic and literary vocabulary naturally",
      "Compound word recognition transfers to Strands Spangrams",
      "Unlimited free games — no account or download needed",
    ],
  },
  {
    wordLength: 10,
    slug: "10-letters",
    title: "10 Letter Wordle - Free Ultimate Word Challenge",
    description: "Play 10-letter Wordle free online. The ultimate word puzzle with 4+ syllable words, Latin/Greek roots, and professional vocabulary. Unlimited games, no download.",
    keywords: ["10 letter wordle", "10 letter word game", "wordle 10 letters", "10 letter wordle free", "10 letter wordle unlimited", "ten letter wordle", "ultimate word game", "extreme word puzzle"],
    intro: "10-letter Wordle pushes vocabulary to its limits. Answers typically have 4+ syllables and draw from professional, scientific, and literary English — words like ATMOSPHERE, BACKGROUND, and IMPOSSIBLE. With only 6 guesses for 10 letters, Latin and Greek root knowledge becomes a genuine advantage.",
    strategies: [
      { title: "Start with BACKGROUND or LEMONGRASS", content: "These cover 10 unique high-frequency letters across natural 10-letter word structures." },
      { title: "Know Your Latin/Greek Roots", content: "TELE- (far), MICRO- (small), -GRAPH (write), -OLOGY (study) — many 10-letter words are built from classical roots. Recognizing them cuts the puzzle in half." },
      { title: "Lock Down the Suffix First", content: "At 10 letters, suffixes like -TION, -MENT, -ABLE, -NESS, -TING are even more dominant. Confirming the last 4 letters reduces the problem to a 6-letter solve." },
    ],
    benefits: [
      "The ultimate vocabulary challenge for word game masters",
      "Builds professional and academic vocabulary naturally",
      "Latin/Greek root skills transfer to all standardized tests",
      "Unlimited free games — no account or download needed",
    ],
  },
  {
    wordLength: 11,
    slug: "11-letters",
    title: "11 Letter Wordle - The Ultimate Word Challenge",
    description: "Play 11-letter Wordle free online. The hardest word puzzle format with 4-5 syllable words like INFORMATION and DEVELOPMENT. For true word game masters. Unlimited games.",
    keywords: ["11 letter wordle", "11 letter word game", "wordle 11 letters", "11 letter wordle free", "11 letter wordle unlimited", "eleven letter wordle", "hardest wordle", "extreme word puzzle"],
    intro: "11-letter Wordle is the maximum difficulty word puzzle. Every answer is a 4-5 syllable word — INFORMATION, DEVELOPMENT, INDEPENDENT, COMFORTABLE. With only 6 guesses for 11 letters, you must decompose words into morphemes (prefix + root + suffix) and think in vocabulary domains to have any chance of solving.",
    strategies: [
      { title: "Start with PERSONALITY or COUNTRYSIDE", content: "These test 11 unique letters across natural multi-syllable structures, probing both common vowels and consonants." },
      { title: "Decompose into 3 Parts", content: "Almost every 11-letter word has 3+ morphemes: IN+DEPEND+ENT, DE+VELOP+MENT, COM+FORT+ABLE. Identify any one part and the others follow." },
      { title: "Think in Domains", content: "Science (TEMPERATURE), business (PERFORMANCE), education (EXPLANATION), technology (INFORMATION) — 11-letter words cluster in specific fields. Match emerging letters to a domain." },
    ],
    benefits: [
      "The absolute ceiling of word puzzle difficulty",
      "Builds professional and academic vocabulary at the highest level",
      "Multi-morpheme analysis skills transfer to all word games",
      "Unlimited free games — no account or download needed",
    ],
  },
];

export function getLetterGameBySlug(slug: string): LetterGameData | undefined {
  return LETTER_GAMES.find((g) => g.slug === slug);
}

export const LETTER_GAME_SLUGS = LETTER_GAMES.map((g) => g.slug);
