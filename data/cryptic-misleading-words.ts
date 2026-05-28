export type MisleadingWordCategory =
  | "er-agent"
  | "people-role"
  | "cryptic-definition";

export type MisleadingWord = {
  /** The clue-surface word as it appears in a puzzle */
  word: string;
  category: MisleadingWordCategory;
  /** What a solver is tempted to read it as (the decoy) */
  looksLike: string;
  /** What setters actually use it to mean */
  crypticMeaning: string;
  /** Why it works — the wordplay logic */
  wordplay: string;
  /** Illustrative example clue (classic textbook style, not a live puzzle) */
  example: string;
};

export const MISLEADING_WORD_CATEGORIES: {
  id: MisleadingWordCategory;
  label: string;
  blurb: string;
}[] = [
  {
    id: "er-agent",
    label: '"-er" agent nouns',
    blurb:
      'A verb plus "-er" meaning "one who" or "that which" — flower is a thing that flows.',
  },
  {
    id: "people-role",
    label: "People & roles",
    blurb:
      "Everyday job and people words that stand for short letter codes in the grid.",
  },
  {
    id: "cryptic-definition",
    label: "Double meanings",
    blurb:
      "Common words with a second, less obvious meaning the surface hides.",
  },
];

export const MISLEADING_WORDS: MisleadingWord[] = [
  // ── "-er" agent nouns ──────────────────────────────────────────────────────
  {
    word: "Flower",
    category: "er-agent",
    looksLike: "a plant or bloom",
    crypticMeaning: "a river",
    wordplay: 'flow + er = "a thing that flows", i.e. a river.',
    example: "Flower flowing through Paris (5) → SEINE",
  },
  {
    word: "Banker",
    category: "er-agent",
    looksLike: "someone who works in finance",
    crypticMeaning: "a river",
    wordplay: 'a thing that has banks — read as "bank-er", not "one who banks".',
    example: "Banker running through Italy (2) → PO",
  },
  {
    word: "Number",
    category: "er-agent",
    looksLike: "a digit or figure",
    crypticMeaning: "an anaesthetic, painkiller, or intense cold",
    wordplay: 'numb + er = "a thing that numbs".',
    example: "Number applied before the injection (11) → ANAESTHETIC",
  },
  {
    word: "Runner",
    category: "er-agent",
    looksLike: "an athlete or sprinter",
    crypticMeaning: "a river, bean, carpet, or messenger",
    wordplay: 'run + er = "a thing that runs" — water, a bean plant, a rug.',
    example: "Runner laid down the hall (6) → CARPET",
  },
  {
    word: "Bloomer",
    category: "er-agent",
    looksLike: "underwear or a blunder",
    crypticMeaning: "a flower (or a loaf of bread)",
    wordplay: 'bloom + er = "a thing that blooms".',
    example: "Bloomer found in the garden bed (5) → TULIP",
  },
  {
    word: "Butter",
    category: "er-agent",
    looksLike: "the spread for toast",
    crypticMeaning: "a goat or ram",
    wordplay: 'butt + er = "a thing that butts", an animal with horns.',
    example: "Butter charging across the field (4) → GOAT",
  },
  {
    word: "Sewer",
    category: "er-agent",
    looksLike: "a drain or waste pipe",
    crypticMeaning: "one who sews (a tailor or seamstress)",
    wordplay:
      'sew + er = "one who sews" — note the trap of two pronunciations.',
    example: "Sewer working with thread (6) → TAILOR",
  },
  {
    word: "Summer",
    category: "er-agent",
    looksLike: "the warm season",
    crypticMeaning: "an adding machine or accountant",
    wordplay: 'sum + er = "a thing that sums".',
    example: "Summer totalling the bill (6) → ADDER",
  },
  {
    word: "Driver",
    category: "er-agent",
    looksLike: "a motorist",
    crypticMeaning: "a golf club",
    wordplay: 'drive + er = "a thing that drives" the ball.',
    example: "Driver in the golfer's bag (4) → CLUB",
  },
  {
    word: "Skier",
    category: "er-agent",
    looksLike: "someone on the slopes",
    crypticMeaning: "a high ball in cricket",
    wordplay: 'sky + er = "a thing hit to the sky" — the double-bluff word.',
    example: "Skier's high one in cricket (3) → SKY",
  },
  {
    word: "Better",
    category: "er-agent",
    looksLike: "improved or superior",
    crypticMeaning: "a gambler",
    wordplay: 'bet + er = "one who bets".',
    example: "Better at the racecourse (6) → PUNTER",
  },
  {
    word: "Mister",
    category: "er-agent",
    looksLike: "a form of address (Mr)",
    crypticMeaning: "a spray bottle",
    wordplay: 'mist + er = "a thing that makes mist".',
    example: "Mister dampening the leaves (7) → SPRAYER",
  },
  {
    word: "Layer",
    category: "er-agent",
    looksLike: "a level or stratum",
    crypticMeaning: "a hen",
    wordplay: 'lay + er = "a thing that lays" eggs.',
    example: "Layer in the coop (3) → HEN",
  },

  // ── People & roles (letter codes) ──────────────────────────────────────────
  {
    word: "Sailor",
    category: "people-role",
    looksLike: "a member of a ship's crew",
    crypticMeaning: "AB, TAR, or SALT",
    wordplay: "AB = able-bodied seaman; TAR and SALT are old slang.",
    example: "Sailor's brief rank in the navy (2) → AB",
  },
  {
    word: "Doctor",
    category: "people-role",
    looksLike: "a physician",
    crypticMeaning: "DR or MO (and as a verb, to alter)",
    wordplay:
      "DR = doctor; MO = medical officer. As a verb it can signal an anagram.",
    example: "Doctor's title up front (2) → DR",
  },
  {
    word: "Worker",
    category: "people-role",
    looksLike: "an employee or labourer",
    crypticMeaning: "ANT or BEE",
    wordplay: "Social insects are the classic cryptic workers.",
    example: "Worker in the colony (3) → ANT",
  },
  {
    word: "Soldier",
    category: "people-role",
    looksLike: "a member of the army",
    crypticMeaning: "GI, RE, OR, or TA",
    wordplay:
      "GI = US soldier; RE = Royal Engineers; OR = other ranks; TA = Territorial Army.",
    example: "American soldier on parade (2) → GI",
  },
  {
    word: "Learner",
    category: "people-role",
    looksLike: "a student or beginner",
    crypticMeaning: "L",
    wordplay: "L = the learner-driver plate, a single letter.",
    example: "Learner's mark on the car (1) → L",
  },
  {
    word: "Duck",
    category: "people-role",
    looksLike: "a water bird (or to dodge)",
    crypticMeaning: "O (zero)",
    wordplay: "A duck is a score of nothing in cricket — the letter O.",
    example: "Duck on the scoreboard (1) → O",
  },
  {
    word: "Love",
    category: "people-role",
    looksLike: "affection",
    crypticMeaning: "O (nil)",
    wordplay: "Love means zero in tennis — represented by O.",
    example: "Love seen at the tennis (1) → O",
  },
  {
    word: "Queen",
    category: "people-role",
    looksLike: "a monarch",
    crypticMeaning: "ER, R, or Q",
    wordplay: "ER = Elizabeth Regina; R = Regina; Q in chess notation.",
    example: "Queen's monogram on the post box (2) → ER",
  },
  {
    word: "Point",
    category: "people-role",
    looksLike: "a tip or a score",
    crypticMeaning: "N, S, E, or W",
    wordplay: "A point of the compass — one of the four directions.",
    example: "Point on the map heading up (1) → N",
  },

  // ── Double meanings ─────────────────────────────────────────────────────────
  {
    word: "Capital",
    category: "cryptic-definition",
    looksLike: "a country's main city",
    crypticMeaning: "an upper-case letter (or money/excellent)",
    wordplay: '"Capital letter" — often just signals the first letter.',
    example: "Capital sum invested wisely (5) → ASSET",
  },
  {
    word: "Notes",
    category: "cryptic-definition",
    looksLike: "written reminders",
    crypticMeaning: "money or musical sounds",
    wordplay: "Banknotes, or the notes do-re-mi.",
    example: "Notes from the band's brass section (5) → BRASS",
  },
  {
    word: "Lead",
    category: "cryptic-definition",
    looksLike: "to be in front",
    crypticMeaning: "a metal, a dog's leash, or a clue",
    wordplay: "Pronounced two ways — the metal Pb or the verb to lead.",
    example: "Lead held by the dog walker (5) → LEASH",
  },
  {
    word: "Novel",
    category: "cryptic-definition",
    looksLike: "a work of fiction",
    crypticMeaning: "new or fresh (often an anagram signal)",
    wordplay: 'As an adjective, "novel" means new — and can hint at a mix.',
    example: "Novel idea that's never been tried (3) → NEW",
  },
  {
    word: "Flowers",
    category: "cryptic-definition",
    looksLike: "a bunch of blooms",
    crypticMeaning: "rivers (plural)",
    wordplay: "Same flow + er trick, just pluralised.",
    example: "Flowers running through the valley (6) → RIVERS",
  },
  {
    word: "Revolver",
    category: "cryptic-definition",
    looksLike: "a handgun",
    crypticMeaning: "a turntable or anything that revolves",
    wordplay: '"A thing that revolves" — also a reversal signal.',
    example: "Revolver spinning the records (9) → TURNTABLE",
  },
  {
    word: "Light",
    category: "cryptic-definition",
    looksLike: "a lamp or brightness",
    crypticMeaning: "not heavy, or to ignite",
    wordplay: "Several meanings: pale, weightless, to set alight.",
    example: "Light meal before the show (5) → SNACK",
  },
  {
    word: "Present",
    category: "cryptic-definition",
    looksLike: "a gift",
    crypticMeaning: "now (the current time) or to introduce",
    wordplay: "Pronounced two ways — a gift, or to present something.",
    example: "Present time for action (3) → NOW",
  },
];
