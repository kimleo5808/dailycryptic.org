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
    title: "Connections Beginner's Guide",
    metaTitle:
      "Connections Beginner's Guide - Learn to Play NYT Connections",
    description:
      "Complete beginner's guide to NYT Connections. Learn the rules, basic strategies, and essential tips to start solving Connections puzzles like a pro.",
    keywords: [
      "connections beginner guide",
      "how to play connections",
      "connections rules",
      "connections for beginners",
      "NYT connections tutorial",
    ],
    icon: "🔰",
    readTime: "10 min read",
    level: "beginner",
    levelLabel: "Beginner Friendly",
    sections: [
      {
        id: "what-is-connections",
        icon: "🎮",
        title: "What Is Connections?",
        content:
          "Connections presents you with a 4×4 grid of 16 words. Your mission: group these words into 4 categories of 4 related words each. Sounds simple, right? The challenge lies in figuring out what connects certain words while avoiding the clever misdirections the puzzle creators have planted.",
        subsections: [
          {
            title: "Key Features",
            content:
              "Connections is The New York Times' word puzzle sensation with these key features:",
            items: [
              "Daily Puzzle — One new puzzle every day, just like Wordle or Crossword",
              "Color-Coded — Categories are revealed in colors indicating difficulty level",
              "Limited Mistakes — You get exactly 4 wrong guesses before game over",
              "Shuffle Feature — Rearrange words to see new patterns and connections",
            ],
          },
        ],
      },
      {
        id: "basic-rules",
        icon: "📏",
        title: "Basic Rules",
        content: "Here are the fundamental rules of NYT Connections:",
        subsections: [
          {
            title: "1. Select Four Words",
            content:
              "Click on 4 words you believe belong to the same category. Selected words will be highlighted.",
          },
          {
            title: "2. Submit Your Guess",
            content:
              'Once you\'ve selected 4 words, click "Submit" to see if they form a correct category.',
          },
          {
            title: "3. Correct Guesses",
            content:
              "If correct, the category is revealed with its theme and removed from the grid. Solved categories appear at the top in colored bars.",
          },
          {
            title: "4. Wrong Guesses",
            content:
              'Incorrect guesses cost you one of your 4 mistakes. The game tells you if you were "one away" (3 out of 4 words correct).',
          },
          {
            title: "5. Win or Lose",
            content:
              "Find all 4 categories to win! Use up all 4 mistakes and the puzzle reveals the remaining categories.",
          },
        ],
      },
      {
        id: "difficulty-levels",
        icon: "🌈",
        title: "Understanding Difficulty Levels",
        content:
          "Each puzzle contains categories of varying difficulty, revealed by colors when you solve them:",
        subsections: [
          {
            title: "🟨 Yellow — Straightforward",
            content:
              "Clear, unambiguous categories that most people would recognize immediately. Examples: Colors (RED, BLUE, GREEN, YELLOW), Animals (DOG, CAT, HORSE, COW).",
          },
          {
            title: "🟩 Green — Moderate",
            content:
              "Requires some specific knowledge or slightly less obvious connections. Examples: Basketball positions (CENTER, GUARD, FORWARD, POINT), Coffee drinks (LATTE, MOCHA, ESPRESSO, CAPPUCCINO).",
          },
          {
            title: "🟦 Blue — Tricky",
            content:
              'Requires lateral thinking or recognizing less obvious patterns. Examples: Things that can "break" (DAWN, FAST, RECORD, SILENCE), Words that follow "FIRE" (ALARM, DRILL, TRUCK, WORKS).',
          },
          {
            title: "🟪 Purple — Hardest",
            content:
              "The most creative, abstract, or wordplay-based connections. Examples: Words spelled backwards (STAR→RATS, LOOP→POOL, DRAW→WARD, TIME→EMIT). Save these for last when other options are eliminated.",
          },
        ],
      },
      {
        id: "first-steps",
        icon: "👣",
        title: "Your First Steps Strategy",
        content: "Follow these steps when approaching a new puzzle:",
        subsections: [
          {
            title: "1. Take a Deep Breath and Scan",
            content:
              "Don't rush! Spend 30-60 seconds just reading through all 16 words. Let your brain naturally start noticing patterns without committing to anything yet.",
          },
          {
            title: "2. Look for the Obvious First",
            content:
              "Search for the Yellow category — the most straightforward group. Common first categories include colors, animals, foods, or other basic semantic groups.",
          },
          {
            title: "3. Use the Shuffle Button",
            content:
              "Rearranging the words can reveal new patterns your brain might have missed. Sometimes seeing words in different positions helps connections become clear.",
          },
          {
            title: "4. Start with Your Most Confident Group",
            content:
              "When you're 90% sure about a category, submit it. Solving one group makes the remaining words easier to categorize and gives you confidence.",
          },
          {
            title: '5. Learn from "One Away"',
            content:
              "If the game says \"One away,\" you had 3 correct words and 1 wrong one. Don't just swap one word — reconsider the entire category. Sometimes the theme is slightly different than you thought.",
          },
        ],
      },
      {
        id: "beginner-strategies",
        icon: "🎯",
        title: "Essential Beginner Strategies",
        content:
          "Master these core strategies to improve your Connections game:",
        subsections: [
          {
            title: 'The "Multiple Meanings" Check',
            content:
              'Many words have several meanings. Before committing to a group, ask yourself: "Could this word mean something else?" For example, "BARK" could be a dog\'s sound, tree covering, or type of ship.',
          },
          {
            title: "Process of Elimination",
            content:
              "If you're stuck, try identifying which words definitely DON'T go together. This negative elimination often reveals positive connections you missed.",
          },
          {
            title: "Think Beyond Literal Meanings",
            content:
              'Advanced categories often involve wordplay, like "words that can follow FIRE" (truck, drill, place, works) rather than literal fire-related things.',
          },
          {
            title: "Trust Your First Instinct (Sometimes)",
            content:
              "Your initial gut reaction is often right for Yellow categories, but be skeptical of it for harder groups where misdirection is common.",
          },
          {
            title: "Take Breaks",
            content:
              "If you're stuck, step away for a few minutes. Fresh eyes often spot connections that escaped you during intense focus.",
          },
          {
            title: "Mental Note-Taking",
            content:
              'Keep track of possible groups in your head: "These 4 might be animals, these 3 are definitely colors, this word could go with either group..."',
          },
        ],
      },
      {
        id: "common-beginner-mistakes",
        icon: "❌",
        title: "Common Beginner Mistakes to Avoid",
        content: "Watch out for these typical beginner errors:",
        subsections: [
          {
            title: "Jumping on the First Pattern You See",
            content:
              "You spot 4 words that could be related and immediately submit without considering alternatives. Connections often includes red herring patterns designed to trick you. Always look for at least 2 possible ways to group words before committing.",
          },
          {
            title: "Not Using the Shuffle Feature",
            content:
              "Staring at the same word arrangement and getting tunnel vision. Your brain gets stuck on the visual pattern of word positions. Shuffle regularly — it's free and often reveals hidden connections.",
          },
          {
            title: "Wasting Mistakes on Random Guesses",
            content:
              "When stuck, randomly trying combinations hoping something works. You only get 4 mistakes, and random guessing rarely pays off. Only submit when you have a logical reason to believe 4 words connect.",
          },
          {
            title: "Overthinking Simple Categories",
            content:
              "Assuming every category has a trick or complex pattern. Yellow categories are genuinely straightforward — sometimes dogs are just dogs. Trust obvious connections, especially early in the puzzle.",
          },
        ],
      },
    ],
  },
  {
    slug: "strategy-tips",
    title: "NYT Connections Strategy Tips",
    metaTitle: "Connections Strategy Tips - Master NYT Connections Puzzles",
    description:
      "Master NYT Connections with proven strategies and expert tips. Learn the best approaches to solve daily puzzles, recognize patterns, and improve your success rate.",
    keywords: [
      "connections strategy",
      "connections tips",
      "NYT connections guide",
      "connections solving techniques",
      "puzzle strategies",
    ],
    icon: "🎯",
    readTime: "8 min read",
    level: "intermediate",
    levelLabel: "Expert Level",
    sections: [
      {
        id: "scanning-strategy",
        icon: "🔍",
        title: "The Scanning Strategy",
        content:
          "Before diving deep, perform a systematic scan of all 16 words to maximize your chances of finding connections quickly.",
        subsections: [
          {
            title: "First Glance Scan",
            content:
              "Perform a 30-second scan of all 16 words. Look for:",
            items: [
              "Obvious connections — Words that immediately seem related",
              "Proper nouns — Names, places, brands that often group together",
              "Similar word lengths — Sometimes a clue to grouping",
              "Unusual words — These often belong to trickier categories",
            ],
          },
          {
            title: "Mental Grouping",
            content:
              'As you scan, mentally sort words into potential groups. Don\'t commit yet — just explore possibilities. Example: Words "APPLE, ORANGE, RUBY, EMERALD, DIAMOND, PEACH, SAPPHIRE, CHERRY" — Mental note: "I see fruits (APPLE, ORANGE, PEACH, CHERRY) and gems (RUBY, EMERALD, DIAMOND, SAPPHIRE)"',
          },
        ],
      },
      {
        id: "difficulty-approach",
        icon: "📈",
        title: "Smart Difficulty Approach",
        content:
          "Work through categories in order of difficulty for the best results:",
        subsections: [
          {
            title: "🟨 Yellow (Start Here)",
            content:
              "Easiest category — Usually straightforward themes like basic categories (colors, animals, food), clear semantic relationships, and common knowledge topics. If you can't find yellow easily, scan for the most obvious group first.",
          },
          {
            title: "🟩 Green (Next Target)",
            content:
              "Medium difficulty — Requires some domain knowledge. Think about specialized vocabularies, professional terms, cultural references, or specific categories within broader themes.",
          },
          {
            title: "🟦 Blue (Challenge Mode)",
            content:
              "Harder category — Often involves wordplay or abstract thinking. Consider alternative meanings, figurative language, and less obvious connections.",
          },
          {
            title: "🟪 Purple (Expert Level)",
            content:
              "Trickiest category — Usually the most creative or complex connections involving wordplay, parts of compound words, or very abstract patterns. Save for last when you have fewer options.",
          },
        ],
      },
      {
        id: "pattern-recognition",
        icon: "🧩",
        title: "Pattern Recognition Mastery",
        content:
          "Develop your ability to identify different types of patterns in Connections puzzles:",
        subsections: [
          {
            title: "Semantic Patterns",
            content: "Words related by meaning or function:",
            items: [
              "Categories — Animals, foods, colors, professions",
              "Functions — Things that fly, things you wear, tools",
              "Properties — Hot things, round things, expensive things",
            ],
          },
          {
            title: "Wordplay Patterns",
            content: "Connections based on language structure:",
            items: [
              "Compound words — Words that combine with a common term",
              "Prefixes/Suffixes — Words that share beginnings or endings",
              "Homophones — Words that sound alike",
              "Abbreviations — Shortened forms of longer terms",
            ],
          },
          {
            title: "Cultural Patterns",
            content: "Connections requiring cultural knowledge:",
            items: [
              "Pop culture — Movies, TV shows, celebrities",
              "History — Historical figures, events, periods",
              "Geography — Countries, cities, landmarks",
              "Brands — Companies, products, logos",
            ],
          },
        ],
      },
      {
        id: "elimination-method",
        icon: "❌",
        title: "Strategic Elimination Method",
        content:
          "Use systematic elimination to narrow down your options:",
        subsections: [
          {
            title: "1. Identify Certain Groups",
            content:
              "Start with categories you're 100% confident about. Even if you can't submit yet, knowing which words belong together reduces your search space.",
          },
          {
            title: "2. Rule Out Impossible Combinations",
            content:
              "If you know APPLE and ORANGE are fruits, they can't be in the same category as unrelated words like COMPUTER or OCEAN.",
          },
          {
            title: "3. Test Edge Cases",
            content:
              "Some words could belong to multiple categories. Use the process of elimination to determine their most likely group.",
          },
          {
            title: "4. Save Mistakes for Uncertainty",
            content:
              "Only guess when you're reasonably confident. Use your 4 mistakes strategically rather than randomly guessing.",
          },
        ],
      },
      {
        id: "common-categories",
        icon: "📂",
        title: "Common Category Types",
        content:
          "Familiarize yourself with frequently appearing category types:",
        subsections: [
          {
            title: "Food & Drink",
            content: "Fruits, vegetables, meats, types of alcohol, cooking methods, kitchen utensils",
          },
          {
            title: "Actions & Verbs",
            content:
              'Things you can "break", things you can "catch", things you can "draw", ways to move',
          },
          {
            title: "Professional Terms",
            content:
              "Medical terminology, legal terms, sports equipment, business jargon",
          },
          {
            title: "Wordplay Categories",
            content:
              'Words before/after "___", compound word parts, rhyming words, words with double meanings',
          },
        ],
      },
      {
        id: "advanced-tips",
        icon: "🚀",
        title: "Advanced Pro Tips",
        content: "Take your game to the next level with these expert techniques:",
        subsections: [
          {
            title: 'The "One Away" Strategy',
            content:
              "When you get \"One away,\" don't immediately try different combinations. Step back and reconsider the entire group. Sometimes you need to swap out multiple words, not just one.",
          },
          {
            title: "Multiple Meaning Awareness",
            content:
              "Many words have multiple meanings. BARK could be a dog's sound or tree covering. PITCHER could be a baseball player or water container. Always consider alternative definitions.",
          },
          {
            title: "Mental Notes System",
            content:
              "Keep mental track of: 1) Confirmed groups, 2) Possible groups, 3) Standalone words that don't fit anywhere yet. This organization prevents confusion.",
          },
          {
            title: "Theme Thinking",
            content:
              'Sometimes the puzzle has an overall theme (like "things from the 80s" or "movie titles"). Recognizing the meta-theme can unlock multiple categories.',
          },
        ],
      },
    ],
  },
  {
    slug: "common-mistakes",
    title: "Common Connections Mistakes to Avoid",
    metaTitle: "Common Connections Mistakes to Avoid",
    description:
      "Avoid the most common Connections mistakes with this comprehensive guide. Learn from typical errors, cognitive traps, and strategic blunders that trip up players.",
    keywords: [
      "connections mistakes",
      "connections errors",
      "connections tips",
      "avoid connections traps",
      "connections problem solving",
    ],
    icon: "⚠️",
    readTime: "11 min read",
    level: "intermediate",
    levelLabel: "All Levels",
    sections: [
      {
        id: "cognitive-mistakes",
        icon: "🧠",
        title: "Cognitive Mistakes",
        content:
          "These psychological traps catch even experienced players off guard:",
        subsections: [
          {
            title: "The Anchoring Trap",
            content:
              "Spotting one obvious connection and forcing all other words to fit around it. Your first impression anchors your thinking and prevents you from seeing alternative groupings. Instead, generate multiple possible groupings before committing to any single one.",
          },
          {
            title: "Confirmation Bias",
            content:
              "Forming a hypothesis about a category and only looking for supporting evidence while ignoring contradictions. Actively look for reasons your grouping might be WRONG. Play devil's advocate with yourself.",
          },
          {
            title: "Functional Fixedness",
            content:
              'Getting stuck thinking about words in their most familiar context. For example, seeing "DIAMOND" only as a gemstone, when it could also refer to a baseball field, a card suit, or a shape. Always ask: "What else could this word mean?"',
          },
          {
            title: "Pattern Completion Compulsion",
            content:
              "Feeling compelled to complete a group once you've found 3 matching words, even when the 4th word doesn't quite fit. Having 3 matches doesn't guarantee you've found the right pattern — the puzzle designers know you'll try to force it.",
          },
        ],
      },
      {
        id: "strategic-errors",
        icon: "⚡",
        title: "Strategic Errors",
        content:
          "Avoid these tactical mistakes that waste your limited guesses:",
        subsections: [
          {
            title: "Random Guessing When Stuck",
            content:
              "Wasting precious mistakes on low-probability guesses. With only 4 mistakes allowed, each one is valuable. Instead of guessing randomly, use the shuffle button, take a break, or try a completely different approach to the puzzle.",
          },
          {
            title: "Rushing to Submit",
            content:
              "Submitting your guess without double-checking or considering alternatives. Always do a pre-submit mental check: Could any of these 4 words actually belong to a different group? Is there a word I'm overlooking?",
          },
          {
            title: "Not Using the Shuffle Feature",
            content:
              "Missing connections because you're staring at the same visual arrangement. Physical proximity of words on the grid creates false mental associations. Shuffle frequently to break these visual biases.",
          },
          {
            title: "Ignoring Difficulty Progression",
            content:
              "Not following the Yellow → Green → Blue → Purple order. Start with the easiest category first to reduce the word pool and make harder categories easier through elimination.",
          },
        ],
      },
      {
        id: "pattern-failures",
        icon: "🔍",
        title: "Pattern Recognition Failures",
        content:
          "These pattern recognition mistakes lead to incorrect groupings:",
        subsections: [
          {
            title: "Falling for Red Herrings",
            content:
              "The puzzle designers deliberately include words that SEEM to belong together but don't. If a group looks too obvious or too easy, it might be a trap. Check if those words could belong to different categories.",
          },
          {
            title: "Missing Abstract Connections",
            content:
              "Focusing only on literal, semantic relationships (like \"all animals\" or \"all colors\") while missing abstract ones (like \"words that can follow FIRE\" or \"things that are round\"). Think about functional and structural relationships too.",
          },
          {
            title: "Overlooking Letter Patterns",
            content:
              "Missing connections based on spelling and letter sequences. Words might share hidden patterns like containing a smaller word (CARPET contains CAR, PET), being palindromes, or sharing the same prefix/suffix.",
          },
        ],
      },
      {
        id: "category-confusion",
        icon: "🎭",
        title: "Category Confusion",
        content:
          "Mixing up categories is one of the most frustrating mistakes:",
        subsections: [
          {
            title: "Mixing Category Levels",
            content:
              'Grouping words at different levels of specificity. For example, mixing "animals" (broad) with "farm animals" (specific). The puzzle typically uses consistent levels of categorization within each group.',
          },
          {
            title: "Theme Drift",
            content:
              "Starting with a clear theme in mind but gradually drifting away from it. You start looking for \"fruits\" but end up with a mix of fruits and things that are red. Stay focused on your original hypothesis.",
          },
          {
            title: "Cultural Knowledge Overconfidence",
            content:
              "Being certain about cultural references but missing important context. You might know 3 TV shows but the 4th word you think is a show is actually a type of dance. Verify each word independently.",
          },
        ],
      },
      {
        id: "prevention-strategies",
        icon: "💪",
        title: "Mistake Prevention Strategies",
        content:
          "Use these proven techniques to avoid common mistakes:",
        subsections: [
          {
            title: "Pre-Submit Checklist",
            content:
              "Before submitting any guess, ask yourself: 1) Could any of these words belong elsewhere? 2) Have I considered alternative meanings? 3) Am I at least 80% confident? 4) Have I checked for red herrings?",
          },
          {
            title: "The \"One Away\" Protocol",
            content:
              "When you get \"One away\", don't just swap one word. Reconsider the entire group's theme — maybe your category definition is slightly wrong. The right theme might include different words than you expected.",
          },
          {
            title: "Multi-Perspective Thinking",
            content:
              "For each word, write down (mentally) at least 2-3 possible categories it could belong to. This prevents tunnel vision and helps you see connections you might otherwise miss.",
          },
          {
            title: "Post-Game Learning",
            content:
              "After each puzzle (win or lose), review the categories you missed. What type of connection was it? What biases led you astray? This reflection builds pattern recognition over time.",
          },
        ],
      },
    ],
  },
  {
    slug: "category-types",
    title: "Complete Guide to Connections Category Types",
    metaTitle: "Complete Guide to Connections Category Types",
    description:
      "Complete guide to all Connections category types. Learn every pattern, theme, and category style used in NYT Connections puzzles with examples and solving strategies.",
    keywords: [
      "connections category types",
      "connections themes",
      "connections patterns",
      "connections examples",
      "NYT connections categories",
    ],
    icon: "📂",
    readTime: "15 min read",
    level: "intermediate",
    levelLabel: "Comprehensive Reference",
    sections: [
      {
        id: "semantic-categories",
        icon: "🌍",
        title: "Semantic Categories",
        content:
          "The most common type of category based on meaning and classification:",
        subsections: [
          {
            title: "Basic Taxonomy",
            content: "Straightforward groupings based on classification:",
            items: [
              "Animals — farm, pets, aquatic, wild (DOG, CAT, HORSE, COW)",
              "Foods & Drinks — fruits, vegetables, beverages (APPLE, BANANA, ORANGE, CHERRY)",
              "Colors — primary, rainbow, shades (RED, BLUE, GREEN, YELLOW)",
              "Body Parts — limbs, organs, facial features (ARM, LEG, HEAD, FOOT)",
            ],
          },
          {
            title: "Objects & Places",
            content: "Categories based on physical objects and locations:",
            items: [
              "Furniture — living room, bedroom, kitchen items",
              "Clothing — formal, casual, accessories",
              "Transportation — land, sea, air vehicles",
              "Tools & Equipment — construction, kitchen, garden",
            ],
          },
          {
            title: "Professional & Academic",
            content: "Domain-specific vocabulary categories:",
            items: [
              "Occupations — medical, legal, technical professions",
              "Academic Subjects — STEM, humanities, arts",
              "Scientific Terms — chemistry, physics, biology",
              "Sports & Games — equipment, positions, rules",
            ],
          },
        ],
      },
      {
        id: "functional-categories",
        icon: "⚙️",
        title: "Functional Categories",
        content:
          "Categories based on what things do or how they relate functionally:",
        subsections: [
          {
            title: "Action Categories",
            content: "Things grouped by actions they perform or receive:",
            items: [
              'Things You Can "Break" — record, silence, dawn, fast',
              'Things You Can "Catch" — ball, cold, fire, breath',
              'Things You Can "Draw" — picture, card, curtain, blood',
              'Things You Can "Run" — marathon, bath, errands, business',
            ],
          },
          {
            title: "Location Categories",
            content: "Things grouped by where they're found:",
            items: [
              "Things Found in a Kitchen — whisk, oven, spatula, colander",
              "Things Found in Space — asteroid, nebula, comet, quasar",
              "Things Found Underground — subway, roots, pipes, fossils",
            ],
          },
          {
            title: "Property Categories",
            content: "Things grouped by shared properties:",
            items: [
              "Hot Things — sun, pepper, sauna, lava",
              "Round Things — ball, globe, wheel, coin",
              "Sharp Things — knife, wit, cheddar, turn",
            ],
          },
        ],
      },
      {
        id: "wordplay-categories",
        icon: "🎭",
        title: "Wordplay Categories",
        content:
          "These tricky categories are based on language structure rather than meaning:",
        subsections: [
          {
            title: "Compound Word Categories",
            content: "Words that combine with a common term:",
            items: [
              'Words Before "BALL" — basket, foot, base, snow',
              'Words After "FIRE" — truck, place, work, fly',
              'Words Before "HOUSE" — dog, tree, club, green',
              'Words After "WATER" — fall, melon, color, proof',
            ],
          },
          {
            title: "Letter Pattern Categories",
            content: "Words sharing spelling or letter patterns:",
            items: [
              "Palindromes — KAYAK, LEVEL, RADAR, ROTOR",
              "Anagrams — LISTEN/SILENT, EARTH/HEART",
              "Words Containing a Hidden Word — carPET, diaMOND",
              "Double Letter Words — BOOK, FEET, GOOD, KEEP",
            ],
          },
          {
            title: "Sound Pattern Categories",
            content: "Words connected by pronunciation:",
            items: [
              "Rhyming Words — CAKE, LAKE, MAKE, STAKE",
              "Homophones — BARE/BEAR, FLOWER/FLOUR",
              "Alliterative Groups — shared starting sounds",
            ],
          },
        ],
      },
      {
        id: "cultural-categories",
        icon: "🎬",
        title: "Cultural Categories",
        content:
          "Categories requiring pop culture and general knowledge:",
        subsections: [
          {
            title: "Entertainment",
            content: "Movies, TV, music, and media:",
            items: [
              "Movie Franchises — characters, titles, actors",
              "TV Show Characters — names from popular series",
              "Music — genres, instruments, famous songs",
              "Video Games — characters, titles, terms",
            ],
          },
          {
            title: "Geographic",
            content: "Places and locations around the world:",
            items: [
              "World Capitals — Paris, Tokyo, London, Cairo",
              "US States — Texas, Maine, Ohio, Alaska",
              "European Countries — France, Spain, Italy, Germany",
              "Rivers & Mountains — Nile, Amazon, Everest, Alps",
            ],
          },
          {
            title: "Historical & Brand",
            content: "History and commercial references:",
            items: [
              "US Presidents — Lincoln, Washington, Jefferson, Roosevelt",
              "Tech Companies — Apple, Google, Meta, Amazon",
              "Car Brands — Ford, Tesla, BMW, Toyota",
              "Fashion Brands — Gucci, Prada, Nike, Adidas",
            ],
          },
        ],
      },
      {
        id: "abstract-categories",
        icon: "🌟",
        title: "Abstract Categories",
        content:
          "The trickiest categories based on abstract concepts and metaphors:",
        subsections: [
          {
            title: "Conceptual Categories",
            content: "Groups based on abstract ideas:",
            items: [
              "Emotions — happy, sad, angry, afraid",
              "Time Periods — second, minute, hour, day",
              "Abstract Qualities — strength, courage, wisdom, justice",
              "Life Stages — baby, child, teen, adult",
            ],
          },
          {
            title: "Metaphorical Categories",
            content:
              "Words with both literal and figurative meanings:",
            items: [
              'Things That Can Be "Broken" — heart, news, record, ice',
              'Things That Can "Run" — water, nose, stockings, marathon',
              'Things With "Wings" — bird, airplane, building, angel',
              'Things That Are "Sharp" — knife, mind, dresser, turn',
            ],
          },
          {
            title: "Thematic Categories",
            content: "Words united by a common theme:",
            items: [
              "Wedding Related — veil, ring, cake, toast",
              "School Related — desk, bell, chalk, grade",
              "Weather Related — storm, cloud, thunder, lightning",
              "Money Related — bill, check, change, quarter",
            ],
          },
        ],
      },
      {
        id: "difficulty-guide",
        icon: "📊",
        title: "Category Difficulty Guide",
        content:
          "Understanding which category types appear at each difficulty level:",
        subsections: [
          {
            title: "Yellow (Easiest)",
            content:
              "Clear semantic relationships, common knowledge, unambiguous meanings, traditional taxonomies. These are the groups most people can spot immediately.",
          },
          {
            title: "Green (Moderate)",
            content:
              "Requires specialized knowledge, professional/academic domains, cultural references, thematic groupings. You need some domain expertise to spot these.",
          },
          {
            title: "Blue (Tricky)",
            content:
              "Abstract relationships, multiple word meanings, functional groupings, lateral thinking required. These often trip up intermediate players.",
          },
          {
            title: "Purple (Hardest)",
            content:
              "Wordplay and linguistic tricks, highly creative connections, compound word patterns, structural relationships. Often solved through elimination after finding the other groups.",
          },
        ],
      },
    ],
  },
  {
    slug: "why-so-hard",
    title: "Why Is Connections So Hard?",
    metaTitle:
      "Why Is Connections So Hard? The Psychology Behind NYT's Trickiest Puzzle",
    description:
      "Discover why NYT Connections is so challenging. Learn about the psychological tricks, word ambiguity, and complex patterns that make Connections the hardest word game.",
    keywords: [
      "connections hard",
      "why connections difficult",
      "connections tricks",
      "NYT connections challenging",
      "word game difficulty",
    ],
    icon: "🤯",
    readTime: "7 min read",
    level: "intermediate",
    levelLabel: "Psychology & Analysis",
    sections: [
      {
        id: "difficulty-by-design",
        icon: "🎯",
        title: "Difficulty by Design",
        content:
          "NYT Connections isn't accidentally hard — every aspect is carefully designed to challenge you:",
        subsections: [
          {
            title: "The 4-Mistake Limit",
            content:
              'The 4-mistake limit creates optimal "productive anxiety." You can\'t just randomly guess — each submission carries real risk. This constraint forces careful deliberation while maintaining engagement. Too many mistakes allowed would make it trivial; too few would make it frustrating.',
          },
          {
            title: "The Color-Coded Difficulty Trap",
            content:
              "Knowing that Yellow is easy and Purple is hard creates false confidence. Players often rush through Yellow, only to discover the \"easy\" category had subtle tricks. The difficulty colors can create strategic blind spots.",
          },
          {
            title: 'The "One Away" Feedback',
            content:
              "The \"One Away\" message is both helpful and torturous. It tells you you're close but doesn't tell you WHICH word is wrong. This creates a frustrating situation where you know you're almost right but can't quite solve it.",
          },
        ],
      },
      {
        id: "word-ambiguity",
        icon: "🤹",
        title: "The Art of Word Ambiguity",
        content:
          "The puzzle exploits the fact that most words have multiple meanings:",
        subsections: [
          {
            title: "Multiple Meaning Mayhem",
            content:
              "Words like \"BARK\" have multiple contexts — dog sounds, tree parts, ship types. \"DIAMOND\" can mean gems, baseball fields, card suits, or shapes. The puzzle forces you to consider ALL possible meanings simultaneously.",
          },
          {
            title: "Context Switching Exhaustion",
            content:
              "Your brain has to rapidly switch between different contexts for the same word. This mental gymnastics is exhausting and leads to cognitive fatigue, making you more likely to miss connections.",
          },
          {
            title: "Proper Noun Confusion",
            content:
              "Words like \"JORDAN\" could mean Michael Jordan (athlete), the country, the river, a first name, or the brand. This multiplied ambiguity makes categorization exponentially harder.",
          },
        ],
      },
      {
        id: "psychological-manipulation",
        icon: "🧠",
        title: "Psychological Manipulation Tactics",
        content:
          "The puzzle designers use well-known psychological principles to increase difficulty:",
        subsections: [
          {
            title: "The Red Herring Strategy",
            content:
              "The puzzle deliberately includes words that SEEM to belong together but don't. These red herrings exploit your brain's tendency to find patterns — even patterns that aren't there.",
          },
          {
            title: "Semantic Satiation",
            content:
              "The more you stare at a word, the less meaningful it becomes. This psychological phenomenon means that intense focus can actually reduce your ability to see connections, not increase it.",
          },
          {
            title: "Confirmation Bias Exploitation",
            content:
              "Once you form a hypothesis, your brain seeks confirming evidence while ignoring contradictions. The puzzle designers know this and plant words that seem to confirm wrong groupings.",
          },
          {
            title: "Cognitive Load Overload",
            content:
              "16 words, 4 categories, multiple meanings per word — the sheer volume of information creates cognitive overload. Your working memory can only hold so much, forcing you to simplify (and potentially miss things).",
          },
        ],
      },
      {
        id: "cognitive-biases",
        icon: "⚡",
        title: "Cognitive Biases That Sabotage You",
        content:
          "Your own brain works against you in these specific ways:",
        subsections: [
          {
            title: "Anchoring Bias",
            content:
              "Your first connection idea becomes an anchor that influences all subsequent thinking. Even if the first idea is wrong, you'll unconsciously try to build around it rather than starting fresh.",
          },
          {
            title: "Availability Heuristic",
            content:
              "You prioritize recently encountered or memorable associations over less obvious ones. If you recently read about basketball, you'll see basketball references everywhere — even where they don't exist.",
          },
          {
            title: "Functional Fixedness",
            content:
              "Getting stuck on a word's most common usage prevents you from seeing alternative meanings. \"PITCHER\" = baseball player? Or water container? Your brain defaults to the familiar.",
          },
          {
            title: "Pattern Recognition Overconfidence",
            content:
              "Humans are pattern-seeking creatures. We see patterns even where none exist. This overconfidence leads to false groupings based on coincidental similarities.",
          },
        ],
      },
      {
        id: "overcoming-difficulty",
        icon: "💪",
        title: "Overcoming the Designed Difficulty",
        content:
          "Use these strategies to fight back against the puzzle's psychological warfare:",
        subsections: [
          {
            title: "Metacognitive Awareness",
            content:
              "Recognize when you're falling into cognitive traps. Ask yourself: \"Am I anchoring on my first idea? Am I only looking for confirming evidence? Have I considered alternative meanings?\"",
          },
          {
            title: "Multiple Perspective Strategy",
            content:
              "For each word, force yourself to generate 2-3 different ways it could be categorized. This breaks the anchoring bias and opens up new connections.",
          },
          {
            title: "Time Pressure Management",
            content:
              "There's no timer in Connections, so use this to your advantage. Take breaks, step away, and come back with fresh eyes. The puzzle will still be there.",
          },
          {
            title: "Strategic Guessing",
            content:
              "Use your 4 mistakes strategically. If you have 2 possible groupings and can't decide, test the one you're LESS sure about. If it's wrong, you've still learned something. If it's right, you've solved the harder group first.",
          },
        ],
      },
    ],
  },
  {
    slug: "advanced-techniques",
    title: "Advanced Connections Techniques",
    metaTitle:
      "Advanced Connections Techniques - Expert Strategies for Hard Puzzles",
    description:
      "Master advanced Connections techniques with expert-level strategies, pattern recognition methods, and pro tips for consistently solving the hardest NYT Connections puzzles.",
    keywords: [
      "connections advanced techniques",
      "expert connections strategies",
      "hard connections puzzles",
      "connections wordplay",
      "connections pro tips",
    ],
    icon: "🎓",
    readTime: "12 min read",
    level: "advanced",
    levelLabel: "Expert / Master",
    sections: [
      {
        id: "meta-analysis",
        icon: "🔬",
        title: "Meta-Analysis Framework",
        content:
          "Expert players don't just solve puzzles — they analyze the puzzle's structure itself:",
        subsections: [
          {
            title: "The Puzzle Personality Assessment",
            content:
              "Before solving, categorize the puzzle type. Is it a Wordplay Enthusiast puzzle (linguistic relationships)? A Pop Culture Maven puzzle (cultural categories)? An Academic puzzle (field-specific groupings)? Or a Lateral Thinker puzzle (functional relationships)? Identifying the puzzle's personality helps you choose the right approach.",
          },
          {
            title: "The Constraint Satisfaction Approach",
            content:
              "Create an Elimination Matrix in your head. Track which words CAN'T be together based on your knowledge. As you solve groups and get feedback, update your matrix. This systematic approach ensures you're using all available information.",
          },
        ],
      },
      {
        id: "wordplay-mastery",
        icon: "🎭",
        title: "Wordplay Mastery",
        content:
          "Advanced wordplay detection is crucial for Blue and Purple categories:",
        subsections: [
          {
            title: "Advanced Anagram Detection",
            content:
              "Beyond simple anagrams, look for partial anagrams (words that share most letters), anagram families (groups of words that are anagrams of each other), and hidden words within words.",
          },
          {
            title: "Compound Word Deconstruction",
            content:
              'Break every word into potential compound parts. "BASKETBALL" = BASKET + BALL. "SUNFLOWER" = SUN + FLOWER. Look for hidden compounds (words that can be split into two valid words) and reverse compounds.',
          },
          {
            title: "Morphological Analysis",
            content:
              "Analyze words by their parts: prefixes (UN-, RE-, PRE-), suffixes (-TION, -MENT, -NESS), and roots. Words sharing the same root or affix might form a category.",
          },
        ],
      },
      {
        id: "linguistic-patterns",
        icon: "🗣️",
        title: "Advanced Linguistic Patterns",
        content:
          "Deeper language analysis reveals hidden connections:",
        subsections: [
          {
            title: "Phonetic Pattern Recognition",
            content:
              "Listen for rhyme schemes, alliteration (shared starting sounds), assonance (shared vowel sounds), and consonance (shared consonant sounds). Sometimes words connect by sound rather than meaning.",
          },
          {
            title: "Syntactic Category Analysis",
            content:
              "Group words by grammatical function: transitive verbs, modal verbs (can, will, should, must), collective nouns, abstract nouns. This linguistic approach reveals categories invisible to meaning-based analysis.",
          },
          {
            title: "Semantic Field Mapping",
            content:
              "Map words to semantic fields using relationships: hypernym/hyponym (category/member), meronym/holonym (part/whole), coordinate terms (same-level siblings), and semantic gradients (degree variations).",
          },
        ],
      },
      {
        id: "elimination-mastery",
        icon: "⚡",
        title: "Systematic Elimination Mastery",
        content:
          "Advanced elimination techniques for when you're stuck:",
        subsections: [
          {
            title: "The Forced Choice Method",
            content:
              "Identify ambiguous words that could belong to multiple groups. For each, test what happens to the remaining groups if you place it in category A vs. category B. The placement that creates valid remaining groups is correct.",
          },
          {
            title: "The Impossibility Proof",
            content:
              "Prove that certain combinations are impossible by showing they create logical contradictions. If placing word X in group A means group B has only 3 possible members, then X doesn't belong in group A.",
          },
          {
            title: "The Uniqueness Filter",
            content:
              "Look for words that can ONLY belong to one specific category. These \"anchor words\" are your starting points. Build groups around them, as they eliminate ambiguity.",
          },
        ],
      },
      {
        id: "purple-mastery",
        icon: "🟪",
        title: "Purple Category Mastery",
        content:
          "The Purple category requires a completely different mindset:",
        subsections: [
          {
            title: "The Purple Mindset Shift",
            content:
              "Purple requires shifting from meaning to structure, from literal to metaphorical, and from semantic to syntactic thinking. Stop asking \"What do these words mean?\" and start asking \"What do these words DO? How are they structured?\"",
          },
          {
            title: "Purple Pattern Library",
            content:
              "Common Purple patterns include:",
            items: [
              '"Things that can be ___" — words that follow a common verb',
              '"Words before/after ___" — compound word patterns',
              "Letter patterns — palindromes, anagrams, hidden words",
              "Compound deconstruction — words that split into two words",
              "Pop culture wordplay — names, titles with double meanings",
            ],
          },
          {
            title: "Purple Elimination Strategy",
            content:
              "The best approach to Purple: solve Yellow, Green, and Blue first. The remaining 4 words ARE the Purple category. You don't need to understand the connection — just solve the other three groups correctly.",
          },
        ],
      },
      {
        id: "psychological-countermeasures",
        icon: "🧠",
        title: "Psychological Countermeasures",
        content:
          "Fight the puzzle's psychological manipulation with these techniques:",
        subsections: [
          {
            title: "Bias Interruption Protocols",
            content:
              "Use perspective rotation (view the puzzle from different angles), play devil's advocate with your own groupings, and try role-playing as a puzzle creator to understand their intent.",
          },
          {
            title: "Cognitive Load Management",
            content:
              "Use external memory aids (mental or physical notes), focus on one group at a time in single-focus sessions, and take regular resets by looking away from the puzzle for 30 seconds.",
          },
          {
            title: "Misdirection Recognition",
            content:
              "Learn to spot red herring indicators: if a group feels too easy, it's probably a trap. If 5+ words seem to fit one category, the real category is more specific than you think. The puzzle designers WANT you to see the obvious — the real connection is hidden behind it.",
          },
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
