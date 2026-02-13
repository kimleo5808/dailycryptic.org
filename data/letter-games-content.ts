export type ContentSection = {
  heading: string;
  level: 2 | 3 | 4;
  paragraphs?: string[];
  items?: string[];
  ordered?: boolean;
  wordCategories?: { title: string; words: string }[];
};

export const LETTER_GAME_CONTENT: Record<number, ContentSection[]> = {
  4: [
    {
      heading: "How to Play 4-Letter Wordle",
      level: 2,
      paragraphs: [
        "4-letter Wordle follows the same rules as the classic game but with shorter words. You have **6 attempts** to guess a hidden 4-letter word. After each guess, the game reveals color-coded feedback: **green** tiles mean the letter is correct and in the right position, **yellow** tiles mean the letter exists in the word but is misplaced, and **gray** tiles mean the letter is not in the word at all.",
        "With fewer letters to work with, 4-letter Wordle games are faster — most can be solved in 2-4 guesses. This makes it a great format for quick daily practice or as a warm-up before longer word puzzles like NYT Strands.",
      ],
    },
    {
      heading: "Best Starting Words for 4-Letter Wordle",
      level: 3,
      paragraphs: [
        "Your first guess matters most. A strong opener covers high-frequency letters and reveals the word's structure early. Here are proven starting words organized by strategy:",
      ],
      wordCategories: [
        { title: "Vowel Hunters", words: "AIDE, AREA, EURO, IDEA — Test 2-3 vowels in a single guess to quickly identify which vowels the answer contains" },
        { title: "Balanced Picks", words: "SALE, TIRE, CONE, DUPE — Mix common vowels and consonants for maximum information per guess" },
        { title: "Consonant Scouts", words: "PLAN, BEST, TURN, SLIM — Prioritize high-frequency consonants (S, T, R, N, L) to map the word's skeleton" },
      ],
    },
    {
      heading: "Common 4-Letter Word Patterns",
      level: 3,
      paragraphs: [
        "Recognizing frequent letter patterns helps you narrow down possibilities faster. These are the most common structures in 4-letter English words:",
      ],
      items: [
        "**-ATE ending:** FATE, GATE, HATE, LATE, MATE, RATE — one of the most frequent 4-letter patterns",
        "**-INE ending:** FINE, LINE, MINE, PINE, VINE, WINE — common and often overlooked",
        "**-OOK ending:** BOOK, COOK, HOOK, LOOK, TOOK — double-O words appear more often than expected",
        "**-EAR ending:** BEAR, DEAR, FEAR, HEAR, NEAR, TEAR, WEAR, YEAR — a large word family",
        "**Double letters:** BALL, BELL, BILL, BUFF, BUZZ, FULL, HILL, MISS, WELL — roughly 15% of 4-letter words contain a repeated letter",
      ],
    },
    {
      heading: "4-Letter Wordle Tips and Strategy",
      level: 3,
      paragraphs: [
        "These practical techniques will help you solve 4-letter puzzles more consistently:",
      ],
      items: [
        "**Track eliminated letters:** Pay attention to gray tiles. Reusing eliminated letters wastes a guess. Use the on-screen keyboard colors as your guide",
        "**Think about letter position:** A yellow tile tells you the letter is in the word but not in that spot. Try moving it to a different position in your next guess",
        "**Don't forget double letters:** If you've found 3 letters but can't complete the word, the answer might repeat one of them (e.g., SASS, DEED, NOON)",
        "**Use your second guess wisely:** If your first guess reveals nothing (all gray), pick a word with entirely different letters to cover more ground",
      ],
    },
    {
      heading: "Sharpen Your Skills for Strands",
      level: 3,
      paragraphs: [
        "Playing 4-letter Wordle regularly trains the same skills you need for NYT Strands puzzles — pattern recognition, vocabulary recall, and thinking about how letters connect to form words. Many Strands theme words are 4-6 letters long, so practicing with short words directly improves your ability to spot them on the Strands grid.",
        "Ready for today's Strands challenge? Check out our **daily Strands hints** for step-by-step clues without full spoilers.",
      ],
    },
  ],

  5: [
    {
      heading: "How to Play 5-Letter Wordle — The Classic Format",
      level: 2,
      paragraphs: [
        "5-letter Wordle is the original format that turned a simple word game into a worldwide phenomenon. The rules are straightforward: guess the hidden 5-letter word within **6 attempts**. After each guess, every letter is marked with a color — **green** (correct letter, correct position), **yellow** (correct letter, wrong position), or **gray** (letter not in the word).",
        "The 5-letter format hits a sweet spot — long enough for real strategy, short enough to solve in minutes. The answer pool contains over 2,000 curated words, so you'll rarely see the same word twice even after months of daily play.",
      ],
    },
    {
      heading: "Best Starting Words for 5-Letter Wordle",
      level: 3,
      paragraphs: [
        "Your opening word sets the tone for the entire game. The best starters cover the most frequently used letters in English 5-letter words. Here are data-backed recommendations:",
      ],
      wordCategories: [
        { title: "Top Tier Openers", words: "CRANE, SLATE, TRACE — Cover the top-frequency letters (E, A, R, S, T, N, L, C). CRANE is widely considered the single best starting word" },
        { title: "Vowel-Heavy Openers", words: "ADIEU, AUDIO, OUIJA — Reveal 3-4 vowels in one guess. Best when you want to map the vowel structure immediately" },
        { title: "High-Frequency Picks", words: "RAISE, ARISE, TEARS, STARE — Built from the statistically most common letters. Great for consistent information gain" },
      ],
    },
    {
      heading: "Letter Frequency in 5-Letter Words",
      level: 3,
      paragraphs: [
        "Understanding which letters appear most often gives you a measurable edge. Here are the most common letters in the 5-letter Wordle word pool, ranked by frequency:",
      ],
      items: [
        "**E** — The most common letter overall, appears in ~46% of answer words",
        "**A** — Second most common, frequently found in positions 2 and 3",
        "**R** — The top consonant, often appears in positions 3 and 4",
        "**O** — Common vowel, usually in positions 2 or 3",
        "**T** — High-frequency consonant, strong in position 1",
        "**L, I, S, N** — The next tier of frequent letters, each appearing in 25-35% of words",
      ],
      ordered: true,
    },
    {
      heading: "Common 5-Letter Word Patterns",
      level: 3,
      paragraphs: [
        "Recognizing recurring patterns helps you narrow possibilities faster, especially in guesses 3-5:",
      ],
      items: [
        "**_IGHT ending:** FIGHT, LIGHT, MIGHT, NIGHT, RIGHT, SIGHT, TIGHT — a large and common word family",
        "**_OUND ending:** BOUND, FOUND, MOUND, ROUND, SOUND, WOUND — consistent pattern to watch for",
        "**_ATCH ending:** BATCH, CATCH, HATCH, LATCH, MATCH, PATCH, WATCH — frequently appears",
        "**Double letters:** APPLE, BELLE, LLAMA, PIZZA, ABBEY — roughly 10-15% of answers contain a repeated letter. Don't overlook this possibility",
        "**Silent E pattern:** CRANE, FLAME, GLAZE, SHAME, WHALE — the consonant-vowel-consonant-consonant-E structure is very common",
      ],
    },
    {
      heading: "5-Letter Wordle Strategy Guide",
      level: 3,
      paragraphs: [
        "Move beyond guesswork with these proven techniques used by top players:",
      ],
      items: [
        "**Maximize information per guess:** Choose words that test new letters rather than confirming ones you already know. A guess with 5 untested letters is more valuable than one that reuses 3 known letters",
        "**Use positional clues:** A yellow E in position 4 means E is in the word but not at the end. Mentally track where each letter can and cannot go",
        "**Try a fixed two-word opening:** Pairs like CRANE + DOUBT or SLATE + CRUMB test 10 unique letters in 2 guesses, giving you strong data for guess 3",
        "**Watch for tricky endings:** Words ending in -IGHT, -OUND, or -ATCH can have 5+ valid answers sharing the same pattern. When stuck, pick a word that distinguishes between them rather than guessing randomly",
      ],
    },
    {
      heading: "Level Up from Wordle to Strands",
      level: 3,
      paragraphs: [
        "If you enjoy 5-letter Wordle, NYT Strands takes word-finding skills to the next level. Instead of guessing one word, you search a 6x8 letter grid for multiple hidden theme words — plus a special Spangram that spans the entire board. The vocabulary instincts you build in Wordle translate directly to spotting words faster on the Strands grid.",
        "Ready for a different kind of word challenge? Try our **daily Strands hints** for progressive clues that guide you without giving away the answers.",
      ],
    },
  ],

  6: [
    {
      heading: "How to Play 6-Letter Wordle",
      level: 2,
      paragraphs: [
        "6-letter Wordle works just like the classic game — guess the hidden word within **6 attempts** using color-coded feedback. **Green** means correct letter in the correct spot, **yellow** means the letter is in the word but misplaced, and **gray** means the letter isn't in the word at all.",
        "The key difference from 5-letter Wordle is scale. The pool of valid 6-letter English words is roughly **10 times larger** (~23,000 vs ~2,300), which means more possible answers and tighter margins on every guess. Strategies that worked for 5-letter puzzles still apply, but you'll need new techniques to handle the added complexity.",
      ],
    },
    {
      heading: "Best Starting Words for 6-Letter Wordle",
      level: 3,
      paragraphs: [
        "A strong opening is even more critical with 6 letters. These starters are chosen for high letter frequency and broad coverage:",
      ],
      wordCategories: [
        { title: "Balanced Openers", words: "STRAIN, PLANET, COURSE, FRIEND — Mix common vowels and consonants to reveal the word's skeleton quickly" },
        { title: "Vowel Scouts", words: "IDEALS, OPAQUE, NEBULA — Identify 3+ vowels in a single guess to map the word's vowel structure" },
        { title: "Two-Word System", words: "Try STRAIN + COUPLE to test 12 unique letters in just 2 guesses, covering most high-frequency letters in the English language" },
      ],
    },
    {
      heading: "Why 6-Letter Wordle Is Harder Than Classic 5-Letter",
      level: 3,
      paragraphs: [
        "Understanding the difficulty jump helps you adjust your strategy:",
      ],
      items: [
        "**10x more possible answers:** ~23,000 valid 6-letter words vs ~2,300 for 5-letter. Each guess eliminates a smaller percentage of possibilities",
        "**Double letters are more common:** About 25-30% of 6-letter words contain a repeated letter (BUTTER, COFFEE, KITTEN, RABBIT, PUZZLE). In 5-letter Wordle it's closer to 15%",
        "**Prefixes and suffixes matter:** 6 letters is where UN-, RE-, IN- prefixes and -ING, -TION, -MENT suffixes become major factors. Recognizing these structures speeds up solving",
        "**More ambiguous mid-game positions:** With more letter slots, you'll often have 3-4 confirmed letters but still face 5+ possible answers. Choosing a distinguishing guess becomes a critical skill",
      ],
    },
    {
      heading: "Common 6-Letter Word Patterns",
      level: 3,
      paragraphs: [
        "Memorizing these frequent patterns gives you a significant advantage in the mid-game:",
      ],
      items: [
        "**-ING endings:** MAKING, TAKING, LIVING, GIVING, MOVING, HOPING — the most common 6-letter ending by far",
        "**-TION endings:** ACTION, NATION, MOTION, POTION, LOTION, RATION — always 6 letters with this suffix",
        "**UN- prefix words:** UNLOCK, UNWIND, UNFAIR, UNLIKE, UNSAFE, UNSEEN — a large family with predictable structure",
        "**RE- prefix words:** REFORM, RETURN, REMIND, REPORT, REPEAT, REMAIN — another high-frequency prefix group",
        "**Double letter words:** BUTTER, COFFEE, KITTEN, RABBIT, MIDDLE, BUBBLE, PEPPER, TOFFEE — watch for TT, FF, BB, DD, PP patterns",
      ],
    },
    {
      heading: "6-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "These techniques address the specific challenges of the 6-letter format:",
      ],
      items: [
        "**Chunk the word into parts:** Think of 6-letter words as prefix + root (UN+LOCK) or root + suffix (MOVE+ED). This narrows your mental search space dramatically",
        "**Test for double letters on guess 3-4:** If your first two guesses place 4 letters but the word still doesn't come together, try a guess that repeats a likely letter (T, L, S, E are the most common doubles)",
        "**Use suffix elimination:** If you suspect an -ING ending, play a word that confirms or denies it. Knowing the last 3 letters cuts the remaining possibilities sharply",
        "**Don't reuse gray letters:** With 6 positions to fill, it's tempting to recycle letters. Resist — every slot filled with a tested-gray letter is wasted information",
      ],
    },
    {
      heading: "From 6-Letter Wordle to NYT Strands",
      level: 3,
      paragraphs: [
        "6-letter Wordle builds exactly the skills you need for NYT Strands. Many Strands theme words are 5-7 letters long, and the prefix/suffix awareness you develop here translates directly to spotting hidden words on the Strands grid. The Spangram — the special word that spans the entire board — is often a longer compound word, and recognizing word chunks is key to finding it.",
        "Want to test your word skills on a different kind of puzzle? Check out our **daily Strands hints** for progressive clues.",
      ],
    },
  ],

  7: [
    {
      heading: "How to Play 7-Letter Wordle",
      level: 2,
      paragraphs: [
        "7-letter Wordle follows the same color-coded feedback system — **green** (right letter, right spot), **yellow** (right letter, wrong spot), **gray** (letter not in the word). You get **6 guesses** to find the hidden 7-letter word.",
        "At 7 letters, the word pool expands to over **34,000 possible words** — a massive jump from the ~23,000 six-letter words and ~2,300 five-letter words. This is where thinking about word construction (roots, prefixes, suffixes) becomes more valuable than guessing letter-by-letter.",
      ],
    },
    {
      heading: "Best Starting Words for 7-Letter Wordle",
      level: 3,
      paragraphs: [
        "Your first guess should test the most common letters while also probing for frequent 7-letter structures:",
      ],
      wordCategories: [
        { title: "Balanced Openers", words: "STRANGE, ROAMING, PARTIES, LOADING — Cover high-frequency letters (S, T, R, A, N, E, I, O) while testing common patterns" },
        { title: "Vowel-Heavy Openers", words: "EULOGIA, SEQUOIA, ROUTINE — Reveal 4-5 vowels in one guess. EULOGIA tests all 5 vowels plus L and G" },
        { title: "Two-Word System", words: "Try STRANGE + HOLDUP to cover 13 unique letters in 2 guesses, leaving very few unknowns for guess 3" },
      ],
    },
    {
      heading: "The Suffix Strategy — Your Biggest Advantage",
      level: 3,
      paragraphs: [
        "Suffixes dominate 7-letter words. Recognizing them early can cut your remaining possibilities by 80% or more:",
      ],
      items: [
        "**-ING (2,000+ words):** WALKING, TALKING, RUNNING, PLAYING, READING, GETTING — by far the most common 7-letter ending. If you confirm I, N, G in the right positions, you only need to solve a 4-letter root",
        "**-TION (500+ words):** STATION, AUCTION, CAUTION, FICTION, MENTION, PORTION — always produces exactly 7 letters with a 3-letter root",
        "**-MENT (300+ words):** PAYMENT, COMMENT, SEGMENT,ALMENT, GARMENT — verb-to-noun conversion pattern",
        "**-ABLE (200+ words):** CAPABLE, NOTABLE, LOVABLE, DURABLE, MOVABLE — adjective-forming suffix",
        "**-NESS (200+ words):** FITNESS, SADNESS, MADNESS, ILLNESS, WITNESS — noun-forming suffix from adjectives",
      ],
    },
    {
      heading: "Common 7-Letter Word Patterns",
      level: 3,
      paragraphs: [
        "Beyond suffixes, these structural patterns appear frequently in 7-letter answers:",
      ],
      items: [
        "**Prefix + root:** RESTART, UNHAPPY, RECOUNT, PREVIEW, MISLEAD — the prefix narrows the root to 4-5 letters",
        "**Compound words:** BEDROOM, AIRPORT, HIGHWAY, NETWORK, POPCORN — two shorter words combined into one",
        "**Double consonants:** SETTING, GETTING, RUNNING, CUTTING, SITTING — the doubled letter usually sits at the boundary between root and suffix",
        "**Silent letters:** KNIGHTS, WROUGHT, KNITTED — less common but can be tricky when they appear",
      ],
    },
    {
      heading: "7-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "These techniques are specifically designed for the challenges of 7-letter puzzles:",
      ],
      items: [
        "**Decompose mentally:** Don't think of 7 letters as 7 unknowns. Think root + affix. If you spot a likely -ING ending, you're really solving a 4-letter puzzle",
        "**Test suffixes deliberately:** If guess 1 reveals scattered letters, use guess 2 to confirm or rule out -ING, -TION, or -MENT. A word like MINTING tests both the -ING ending and common consonants",
        "**Watch for the root word trap:** Words like GETTING and SITTING share the -TTING pattern. When stuck between similar roots, pick a guess that distinguishes them (a word with E but not I, or vice versa)",
        "**Don't ignore less common structures:** Not every 7-letter word follows the root+suffix formula. Words like KITCHEN, PREMIUM, and JOURNEY have no clear affix — stay flexible",
      ],
    },
    {
      heading: "Build Word Skills for NYT Strands",
      level: 3,
      paragraphs: [
        "The morphological thinking you develop in 7-letter Wordle is exactly what helps in NYT Strands. The Strands Spangram — a special word that spans the entire grid — is often 7-9 letters long and frequently follows root+suffix patterns. Training yourself to spot WALKING, STATION, or PAYMENT-type structures helps you trace these words across the letter grid faster.",
        "Ready for a different word challenge? Try our **daily Strands hints** for progressive clues without spoilers.",
      ],
    },
  ],

  8: [
    {
      heading: "How to Play 8-Letter Wordle",
      level: 2,
      paragraphs: [
        "8-letter Wordle uses the same rules as the classic game — guess the hidden word in **6 tries** using color feedback. **Green** = correct letter and position, **yellow** = correct letter but wrong position, **gray** = letter not in the word.",
        "The challenge? Over **80,000 valid 8-letter English words** exist, and you still get only 6 guesses. That's the same number of attempts as 5-letter Wordle but with 35x more possibilities. Strategic word decomposition — breaking words into prefixes, roots, and suffixes — becomes your most powerful tool.",
      ],
    },
    {
      heading: "Best Starting Words for 8-Letter Wordle",
      level: 3,
      paragraphs: [
        "With 8 letter positions to fill, your opener needs to cover maximum ground:",
      ],
      wordCategories: [
        { title: "High-Coverage Openers", words: "ABSOLUTE, STRONGLY, CHAPTERS, STRONGLY — Test 8 unique high-frequency letters including common vowels (A, O, E) and top consonants (S, T, R, L, N)" },
        { title: "Vowel Mappers", words: "DIALOGUE, EQUATION, ROUTINES — Reveal 4-5 vowels in a single guess to immediately identify the word's vowel skeleton" },
        { title: "Two-Word System", words: "Try CHAPTERS + FUDGING to cover 15 unique letters in 2 guesses — nearly the entire high-frequency alphabet" },
      ],
    },
    {
      heading: "Compound Words — The Key to 8-Letter Success",
      level: 3,
      paragraphs: [
        "Compound words make up a significant portion of 8-letter answers. Recognizing these structures lets you solve the word as two smaller puzzles:",
      ],
      items: [
        "**OVER- compounds:** OVERCOME, OVERLOOK, OVERTIME, OVERLOAD, OVERCAST — once you spot OVER in positions 1-4, you're solving a 4-letter word",
        "**OUT- compounds:** OUTDOORS, OUTBREAK, OUTSHINE, OUTLINED, OUTWEIGH — another common first-half pattern",
        "**-BACK/-WARD:** COMEBACK, DRAWBACK, FEEDBACK, BACKWARD, WESTWARD — predictable second-half structures",
        "**UNDER- compounds:** UNDERWAY, UNDERDOG, UNDERCUT — 5-letter prefix narrows the answer to just 3 unknown letters",
        "**Two equal halves:** BASEBALL, HOMEWORK, BOOKMARK, WORKSHOP, BIRTHDAY — two 4-letter words joined together",
      ],
    },
    {
      heading: "Common 8-Letter Suffix Patterns",
      level: 3,
      paragraphs: [
        "Suffix awareness remains critical at 8 letters. These are the dominant endings:",
      ],
      items: [
        "**-TION/-SION:** POSITION, SOLUTION, DECISION, CREATION, FUNCTION — the most frequent 8-letter ending pattern",
        "**-MENT:** MOVEMENT, JUDGMENT, ARGUMENT,ALEMENT, DOCUMENT — verb-to-noun conversion",
        "**-TING/-NING/-LING:** STARTING, PLANNING, TRAVELING, HANDLING — root + double consonant + ING",
        "**-ABLE/-IBLE:** POSSIBLE, SUITABLE, RELIABLE, VALUABLE, FLEXIBLE — adjective-forming suffix",
        "**-NESS:** DARKNESS, WEAKNESS, KINDNESS, BUSINESS, RICHNESS — state/quality nouns",
      ],
    },
    {
      heading: "8-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "Expert-level techniques for solving 8-letter puzzles efficiently:",
      ],
      items: [
        "**Think compound first:** Before analyzing individual letters, ask yourself: could this be two words joined together? OVER+TIME, HOME+WORK, FIRE+SIDE? This shortcut solves many 8-letter puzzles faster than letter-by-letter deduction",
        "**Confirm the suffix by guess 2-3:** Use early guesses to test whether the word ends in -TION, -MENT, -ABLE, or -ING. Locking down the last 3-4 letters is the fastest path to solving",
        "**Watch for academic vocabulary:** 8-letter words skew toward formal and academic English — ANALYSIS, RESEARCH, STRATEGY, RESPONSE. If common everyday words don't fit, think textbook language",
        "**Use double-letter awareness:** At 8 letters, double consonants are very common (PLANNING, POSSIBLE, APPROACH). If 6-7 letters are placed but the word won't come together, try repeating a consonant",
      ],
    },
    {
      heading: "From 8-Letter Wordle to Strands",
      level: 3,
      paragraphs: [
        "The compound word skills you build in 8-letter Wordle directly help with NYT Strands. The Spangram — the special word that spans the entire Strands grid — is often 8-10 letters long and frequently a compound word or multi-morpheme term. Being able to mentally decompose OVER+TIME or BREAK+DOWN helps you trace these words across adjacent letters on the grid.",
        "Want to apply your vocabulary skills? Check out our **daily Strands hints** for progressive clues.",
      ],
    },
  ],

  9: [
    {
      heading: "How to Play 9-Letter Wordle",
      level: 2,
      paragraphs: [
        "9-letter Wordle follows the standard rules — **6 guesses** to find the hidden word, with **green**, **yellow**, and **gray** feedback after each attempt. The difference is scale and vocabulary depth.",
        "At 9 letters, you're dealing with 3-4 syllable words that often come from academic, literary, or professional contexts. Words like ALGORITHM, DANGEROUS, and EDUCATION are typical answers. The pool of valid words is enormous, so decomposing words into meaningful chunks — syllables, roots, prefixes, suffixes — is essential for consistent success.",
      ],
    },
    {
      heading: "Best Starting Words for 9-Letter Wordle",
      level: 3,
      paragraphs: [
        "Your opener needs to test as many high-frequency letters as possible across 9 positions:",
      ],
      wordCategories: [
        { title: "Vowel-Rich Openers", words: "EDUCATION, AEROPLANE, AUTHORIZE — Test 4-5 vowels plus common consonants in a single guess" },
        { title: "Consonant-Heavy Openers", words: "TRAMPLING, SPRINKLED, STRONGEST — Map the consonant skeleton when you suspect few vowels" },
        { title: "Two-Word System", words: "Try EDUCATION + SYMPHONY to cover 16 unique letters in just 2 guesses, leaving almost no common letter untested" },
      ],
    },
    {
      heading: "Compound Words in 9-Letter Wordle",
      level: 3,
      paragraphs: [
        "Compound words are a major category at 9 letters. Recognizing them transforms a 9-letter puzzle into two simpler ones:",
      ],
      items: [
        "**EVERY- compounds:** EVERYBODY, EVERGREEN, SOMETHING, ELSEWHERE — if the first 5 letters form a common word, think compound",
        "**Nature compounds:** BUTTERFLY, SUNFLOWER, WATERFALL, NIGHTFALL — vivid imagery words often appear as answers",
        "**-THING/-BODY:** SOMETHING, ANYTHING, EVERYBODY, SOMETHING — predictable second halves",
        "**Direction compounds:** ELSEWHERE, NORTHEAST, WHOLESALE, ALONGSIDE — spatial/directional words",
      ],
    },
    {
      heading: "Common 9-Letter Word Patterns",
      level: 3,
      paragraphs: [
        "Beyond compounds, these structural patterns dominate 9-letter answers:",
      ],
      items: [
        "**-TION/-SION ending:** EDUCATION, SITUATION, ATTENTION, DIRECTION, CONDITION, OPERATION — the single most common 9-letter suffix pattern",
        "**-MENT ending:** AGREEMENT, APARTMENT, EQUIPMENT, TREATMENT, STATEMENT — verb-to-noun conversion at scale",
        "**-FUL/-LESS:** BEAUTIFUL, WONDERFUL, POWERLESS, DANGEROUS — adjective-forming suffixes",
        "**UN-/RE- prefix:** UNCERTAIN, UNIVERSAL, RELUCTANT, RECOMMEND — prefix narrows the root to 5-7 letters",
        "**-TING/-NING:** ACCEPTING, BEGINNING, DESIGNING, HAPPENING — gerund forms of longer verbs",
      ],
    },
    {
      heading: "9-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "Master-level techniques for tackling 9-letter puzzles:",
      ],
      items: [
        "**Sound it out:** Break potential words into syllables mentally. 9-letter words almost always have 3-4 syllables, and sounding them out activates vocabulary you might not reach through letter-by-letter analysis",
        "**Prioritize the ending:** Confirming whether the word ends in -TION, -MENT, -ABLE, -NESS, or -ING is the single highest-value deduction at 9 letters. It eliminates thousands of possibilities instantly",
        "**Think academic:** Everyday conversational words are mostly 4-7 letters. 9-letter answers lean toward formal vocabulary — ALGORITHM, INTERVIEW, GUARANTEE, PRIVILEGE. Shift your mental dictionary accordingly",
        "**Use compound detection:** If positions 1-4 or 1-5 spell a complete word (SOME-, EVERY-, WATER-, UNDER-), you're almost certainly looking at a compound. Focus on completing the second half",
      ],
    },
    {
      heading: "Train Your Spangram Skills for Strands",
      level: 3,
      paragraphs: [
        "NYT Strands Spangrams — the special words that span the entire puzzle grid — are frequently 9-10 letters long. The decomposition skills you build here (spotting BUTTER+FLY, EVERY+BODY, or WATER+FALL within a letter grid) directly help you trace Spangrams across adjacent cells.",
        "Ready to put these skills to work? Check out our **daily Strands hints** for step-by-step clues.",
      ],
    },
  ],

  10: [
    {
      heading: "How to Play 10-Letter Wordle",
      level: 2,
      paragraphs: [
        "10-letter Wordle uses the same color-coded feedback — **green** (right letter, right spot), **yellow** (right letter, wrong spot), **gray** (not in the word). You get **6 guesses** to find the hidden 10-letter word.",
        "At this length, answers come almost exclusively from academic, professional, and scientific vocabulary. Words like ATMOSPHERE, BACKGROUND, GENERATION, and EXPERIMENT are typical. Everyday conversational words simply don't reach 10 letters, so you need to shift your mental dictionary toward formal English.",
      ],
    },
    {
      heading: "Best Starting Words for 10-Letter Wordle",
      level: 3,
      paragraphs: [
        "With 10 positions to fill and only 6 guesses, every letter tested matters:",
      ],
      wordCategories: [
        { title: "High-Coverage Openers", words: "BACKGROUND, TRAMPOLINE, BIRTHSTONE — Test 10 unique letters including the most common vowels and consonants" },
        { title: "Vowel Mappers", words: "AUTOMOBILE, TOURMALINE, AUCTIONEER — Reveal 5+ vowel positions in one guess to map the word's structure" },
        { title: "Two-Word System", words: "Try BACKGROUND + SEMIFLUX to test 18 unique letters across 2 guesses — covering nearly all high-frequency letters in the English alphabet" },
      ],
    },
    {
      heading: "Latin and Greek Roots — Your Secret Weapon",
      level: 3,
      paragraphs: [
        "Many 10-letter words are built from classical roots. Recognizing these structures transforms an impossible-seeming puzzle into a logical deduction:",
      ],
      items: [
        "**TELE- (far/remote):** TELEVISION, TELEPATHIC, TELESCOPIC — if you spot T-E-L-E in positions 1-4, the root narrows the answer dramatically",
        "**-OLOGY (study of):** TECHNOLOGY, PSYCHOLOGY, MYTHOLOGY — a predictable 5-letter ending that solves half the puzzle",
        "**-TION/-SION:** GENERATION, PRODUCTION, REVOLUTION, EXHIBITION — the most common 10-letter ending pattern by far",
        "**OVER-/UNDER-:** UNDERSTAND, OVERCHARGE, UNDERNEATH, OVERWEIGHT — compound-prefix words with predictable structure",
        "**-GRAPH/-PHONE:** PHOTOGRAPH, MICROPHONE, HOLOGRAPHY — Greek-origin technical terms",
      ],
    },
    {
      heading: "Common 10-Letter Word Categories",
      level: 3,
      paragraphs: [
        "Knowing which vocabulary domains produce 10-letter words helps you narrow guesses:",
      ],
      wordCategories: [
        { title: "Science & Nature", words: "ATMOSPHERE, EARTHQUAKE, EXPERIMENT, HYPOTHESIS, MICROSCOPE — scientific observation terms" },
        { title: "Academic & Education", words: "UNIVERSITY, LITERATURE, PHILOSOPHY, CURRICULUM, DICTIONARY — institutional and scholarly words" },
        { title: "Business & Professional", words: "MANAGEMENT, LEADERSHIP, ENTERPRISE, CONFERENCE, NEWSLETTER — workplace vocabulary" },
        { title: "Abstract & Social", words: "IMPOSSIBLE, EXPERIENCE, APPRECIATE, DIFFERENCE, GENERATION — concepts and descriptors" },
      ],
    },
    {
      heading: "10-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "At this level, every guess must be maximally efficient:",
      ],
      items: [
        "**Lock the suffix early:** Confirming -TION, -MENT, -NESS, or -ABLE in the last 4-5 positions is the single most impactful deduction. It immediately converts a 10-letter puzzle into a 5-6 letter one",
        "**Think in domains:** If letters so far suggest something scientific (M, I, C, R, O), think MICROSCOPE. If they're abstract (E, X, P), think EXPERIENCE or EXPERIMENT. Domain thinking activates the right vocabulary faster than random guessing",
        "**Use root recognition:** If you see GRAPH, PHONE, SCOPE, or OLOGY forming, the rest of the word likely comes from a Greek/Latin prefix. This is the fastest path to solving at 10 letters",
        "**Don't waste guesses confirming known letters:** With only 6 attempts for 10 letters, you can't afford to replay known letters in new positions. Each guess should introduce at least 4-5 new untested letters",
      ],
    },
    {
      heading: "Challenge Yourself Beyond Wordle",
      level: 3,
      paragraphs: [
        "If you can solve 10-letter Wordle consistently, NYT Strands will feel like a natural extension of your skills. Strands Spangrams often reach 9-12 letters, and the same root-recognition skills (spotting TELE-, OVER-, -TION within a grid of letters) help you trace these long words across adjacent cells.",
        "Test your word skills in a new format — try our **daily Strands hints** for progressive clues.",
      ],
    },
  ],

  11: [
    {
      heading: "How to Play 11-Letter Wordle",
      level: 2,
      paragraphs: [
        "11-letter Wordle is the maximum difficulty format. The rules stay the same — **6 guesses**, color-coded feedback (**green**, **yellow**, **gray**) — but the words are the longest and most complex in the English language.",
        "Every answer is a 4-5 syllable word drawn from formal, academic, or professional vocabulary: INFORMATION, DEVELOPMENT, INDEPENDENT, COMFORTABLE, TEMPERATURE. With 11 letter positions and only 6 attempts, brute-force guessing is impossible. You must think structurally — breaking words into prefixes, roots, and suffixes — to solve consistently.",
      ],
    },
    {
      heading: "Best Starting Words for 11-Letter Wordle",
      level: 3,
      paragraphs: [
        "Your opening guess needs to cover maximum ground across 11 positions:",
      ],
      wordCategories: [
        { title: "High-Coverage Openers", words: "PERSONALITY, COUNTRYSIDE, CELEBRATION — Test 11 unique letters including the top vowels (A, E, I, O) and consonants (T, R, N, S, L)" },
        { title: "Vowel Mappers", words: "AUCTIONEER, COLLABORATE, COMMUNICATE — Identify 5+ vowel positions to immediately map the word's rhythmic structure" },
        { title: "Two-Word System", words: "Try PERSONALITY + THUMBSCREW to cover 20 unique letters in 2 guesses — essentially testing the entire alphabet minus Q, X, Z, and a few others" },
      ],
    },
    {
      heading: "The 3-Part Decomposition Strategy",
      level: 3,
      paragraphs: [
        "Nearly every 11-letter word breaks down into 3 morphemes (prefix + root + suffix). This is the single most important strategy at this level:",
      ],
      items: [
        "**IN + DEPEND + ENT:** Prefix IN- (not) + root DEPEND + suffix -ENT (adjective). Spot any one part and the other two become solvable",
        "**DE + VELOP + MENT:** Prefix DE- + root VELOP + suffix -MENT (noun). The root alone narrows to very few possibilities",
        "**COM + FORT + ABLE:** Prefix COM- + root FORT + suffix -ABLE (adjective). Each part is a common English element",
        "**IN + FORMAT + ION:** Prefix IN- + root FORMAT + suffix -ION (noun). Recognizing -TION in the last 4 positions instantly solves 40% of the word",
        "**TEMPERA + TURE:** Root TEMPERA + suffix -TURE. Some 11-letter words have only 2 parts but with a long root",
      ],
    },
    {
      heading: "Common 11-Letter Word Domains",
      level: 3,
      paragraphs: [
        "11-letter words cluster heavily in specific vocabulary domains. Matching emerging letters to a domain is often faster than letter-by-letter deduction:",
      ],
      wordCategories: [
        { title: "Science & Nature", words: "TEMPERATURE, ENVIRONMENT, ELECTRICITY, OBSERVATION, EXAMINATION — scientific process and measurement terms" },
        { title: "Business & Work", words: "PERFORMANCE, COMPETITION, ESTABLISHED, COMBINATION, PARTNERSHIP — professional and organizational vocabulary" },
        { title: "Education & Ideas", words: "INFORMATION, EXPLANATION, APPLICATION, IMAGINATION, OPPORTUNITY — abstract concepts and learning terms" },
        { title: "Society & People", words: "INDEPENDENT, COMFORTABLE, RESPONSIBLE, COMMUNICATE, IMMEDIATELY — descriptions of people and behavior" },
      ],
    },
    {
      heading: "11-Letter Wordle Strategy Tips",
      level: 3,
      paragraphs: [
        "Techniques specifically designed for the maximum difficulty level:",
      ],
      items: [
        "**Identify the suffix by guess 2:** With 11 letters, the suffix is often 3-5 characters long (-TION, -MENT, -ABLE, -NESS, -TING). Confirming it converts the puzzle from 11 unknowns to 6-7 — a dramatically easier problem",
        "**Match to a domain:** If you see T, E, M, P forming, think TEMPERATURE (science). If P, E, R, F appear, think PERFORMANCE (business). Domain-matching activates relevant vocabulary clusters in your mind",
        "**Test common prefixes:** IN-, UN-, COM-, DIS-, PRE- are the most frequent 11-letter prefixes. If the first 2-3 letters look like a prefix, commit to it and focus on the root",
        "**Accept that some words are compounds:** COUNTRYSIDE, FURTHERMORE, BUTTERSCOTCH — not every 11-letter word follows the prefix+root+suffix formula. When affixes don't fit, think compound structures",
      ],
    },
    {
      heading: "The Ultimate Word Game Training Ground",
      level: 3,
      paragraphs: [
        "If you can solve 11-letter Wordle, every other word game becomes easier. The morpheme decomposition skills you build here — spotting IN-FORMAT-ION or DE-VELOP-MENT within a string of letters — are exactly what you need to find long Spangrams in NYT Strands, solve cryptic crossword clues, or ace vocabulary sections on standardized tests.",
        "Ready for a different challenge? Apply your advanced vocabulary skills to our **daily Strands hints** — you'll find Spangrams much easier to spot.",
      ],
    },
  ],
};

/**
 * Get the SEO content sections for a specific word length.
 * Returns an empty array if no content is found for the given length.
 */
export function getContentByWordLength(wordLength: number): ContentSection[] {
  return LETTER_GAME_CONTENT[wordLength] ?? [];
}
