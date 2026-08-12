import ALL_WORDS from "@/data/five-letter/words.json";
import { WORD_LISTS } from "@/data/wordle-words";
import { glossOf, scrabbleScore, wwfScore, type WordEntry } from "@/lib/word-lists-data";

/*
 * Data layer for the 5-letter "stat list" cluster (/5-letter-words/<slug>).
 *
 * Each list is a pattern filter over the same bundled word list the letter
 * spokes use — no new data files. Every list answers one specific Wordle-era
 * search ("5 letter words with no vowels", "…with double letters", …).
 *
 * Indexes build lazily: the Worker has a strict startup budget and filtering
 * 8k+ words at import time can stop the isolate booting, which 500s every
 * SSR route.
 */

const ALL = ALL_WORDS as string[];
const COMMON_SET = new Set(
  (WORD_LISTS[5] ?? []).map((w) => w.toUpperCase()).filter((w) => w.length === 5)
);

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const countVowels = (w: string) => [...w].filter((c) => VOWELS.has(c)).length;
const distinctLetters = (w: string) => new Set([...w]).size;

export interface StatListDef {
  slug: string;
  /** H1 and hero title */
  title: string;
  /** Core keyword phrase, used in prose and metadata */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  /** Short phrase that fits "… five-letter words {phrase}" */
  phrase: string;
  /** Filter over the master word list */
  match: (word: string) => boolean;
  /** Extra prose paragraphs unique to this list (2–4 entries) */
  sections: { heading: string; paragraphs: string[] }[];
  /** Why this pattern matters when solving Wordle */
  wordleTip: string;
  /** Sort: default is common-first then alphabetical; "score" sorts by Scrabble desc */
  order?: "default" | "score";
}

export const STAT_LISTS: StatListDef[] = [
  {
    slug: "no-vowels",
    title: "5-Letter Words With No Vowels",
    keyword: "5 letter words with no vowels",
    metaTitle: "5-Letter Words With No Vowels — Full List",
    metaDescription:
      "Every five-letter word with no A, E, I, O or U, with Scrabble scores and definitions. The complete vowel-less list for Wordle and word games.",
    phrase: "with no vowels",
    match: (w) => countVowels(w) === 0,
    wordleTip:
      "Vowel-less words are the classic Wordle trap. If you have ruled out A, E, I, O and U, the answer almost certainly leans on Y as its vowel sound, and this short list is the whole field you are choosing from.",
    sections: [
      {
        heading: "Why so few words have no vowels",
        paragraphs: [
          "English builds nearly every syllable around a vowel sound, so a five-letter word with no A, E, I, O or U has to find that sound somewhere else. Almost always the job falls to Y, which behaves as a vowel in words like GYPSY and CRYPT even though the alphabet files it with the consonants.",
          "A handful of the remaining words dodge the problem entirely by being borrowings, interjections or specialist terms where the consonant cluster is the whole word. That is why the list below is short enough to read in one sitting, and why it is worth skimming before you burn a Wordle guess.",
        ],
      },
      {
        heading: "How Y does a vowel's work",
        paragraphs: [
          "In these words Y carries either a long vowel sound, as in DRYLY, or a short one, as in MYTHS. Once you accept Y as the vowel, the spelling stops looking impossible and starts looking ordinary: CRYPT is simply C-R-Y-P-T around a Y, exactly as CRAFT sits around an A.",
          "This matters for guessing because Y is rarely among a solver's opening letters. If four guesses have eliminated every true vowel, switching to a Y-centred word is usually the fastest route to the answer rather than a desperate last resort.",
        ],
      },
    ],
  },
  {
    slug: "one-vowel",
    title: "5-Letter Words With Only One Vowel",
    keyword: "5 letter words with one vowel",
    metaTitle: "5-Letter Words With Only One Vowel — Full List",
    metaDescription:
      "All five-letter words containing exactly one vowel, ranked common-first with Scrabble scores and definitions for Wordle and Scrabble players.",
    phrase: "with exactly one vowel",
    match: (w) => countVowels(w) === 1,
    wordleTip:
      "A single-vowel answer defeats most opening guesses, because standard starters like SLATE and AUDIO spend two or three slots on vowels. When two vowels have come back grey, shift to a consonant-heavy word from this list.",
    sections: [
      {
        heading: "Where the fifth letter goes",
        paragraphs: [
          "With only one vowel to spend, these words pack four consonants around it, which forces heavy use of the letters that blend easily — R, L, S, T, N and the CH, SH and TH digraphs. That is why the list is dominated by words like SHIRT, STOMP and CRUSH rather than anything exotic.",
          "The vowel itself sits in the middle far more often than at either end. A word such as BRUSH puts it in slot three, and once you know the vowel's identity, guessing its position correctly usually resolves the puzzle in one more move.",
        ],
      },
      {
        heading: "Using single-vowel words as guesses",
        paragraphs: [
          "These words make poor opening guesses precisely because they test so few vowels, but they are excellent third and fourth guesses. By that point you often know which vowel survives, and a consonant-dense word tests four new letters at once instead of re-testing vowels you have already placed.",
        ],
      },
    ],
  },
  {
    slug: "two-vowels",
    title: "5-Letter Words With Two Vowels",
    keyword: "5 letter words with two vowels",
    metaTitle: "5-Letter Words With Two Vowels — Complete List",
    metaDescription:
      "Every five-letter word with exactly two vowels, sorted common-first with Scrabble scores and definitions. The largest group in the five-letter word list.",
    phrase: "with exactly two vowels",
    match: (w) => countVowels(w) === 2,
    wordleTip:
      "Two vowels is the most likely shape for a Wordle answer, so this list is where the odds sit. If your guesses have confirmed two vowels and you are stuck on the consonants, the words here are the realistic candidates.",
    sections: [
      {
        heading: "The most common shape in English",
        paragraphs: [
          "Roughly half of all five-letter words carry exactly two vowels, which makes this the default shape a solver should assume until evidence says otherwise. Words like HOUSE, TRAIN, PLACE and MONEY all follow it, and so do the majority of Wordle answers across the game's history.",
          "The two vowels are rarely adjacent. Far more often they straddle a consonant cluster in the middle, producing the consonant-vowel-consonant-vowel-consonant rhythm that English favours. Knowing that pattern lets you place a confirmed vowel with much better than random accuracy.",
        ],
      },
      {
        heading: "Which vowel pairs turn up most",
        paragraphs: [
          "A and E dominate, followed by O; I and U appear together far less often. If you have one vowel confirmed and are guessing the second, testing E first and then A will beat testing them in alphabetical order most of the time.",
        ],
      },
    ],
  },
  {
    slug: "three-vowels",
    title: "5-Letter Words With Three Vowels",
    keyword: "5 letter words with three vowels",
    metaTitle: "5-Letter Words With Three Vowels — Full List",
    metaDescription:
      "All five-letter words containing three or more vowels, with Scrabble scores and definitions. Vowel-heavy words for Wordle openers and endgames.",
    phrase: "with three or more vowels",
    match: (w) => countVowels(w) >= 3,
    wordleTip:
      "Vowel-heavy answers catch solvers out because most guessing strategies assume two vowels at most. If three vowels have come back green or yellow, stop hunting for consonants and work through this list instead.",
    sections: [
      {
        heading: "Vowel-heavy words and where they come from",
        paragraphs: [
          "Words with three vowels in five letters tend to arrive from Latin, French or Greek roots, or from the -EOUS, -IOUS and -AEO clusters that those roots leave behind. AUDIO, QUEUE and OUIJA all sit here, along with quieter examples like ADIEU and AROSE.",
          "Because they leave only two slots for consonants, these words often repeat a vowel rather than spreading five different letters. That repetition is what makes them hard to guess: a solver who has confirmed three vowel positions may still be choosing between several words that differ by a single consonant.",
        ],
      },
      {
        heading: "The best vowel-testing openers",
        paragraphs: [
          "AUDIO and ADIEU are the classic vowel-first opening guesses, and both appear on this list. They trade consonant coverage for maximum vowel information, which suits players who prefer to lock the vowel skeleton first and fill consonants afterwards.",
        ],
      },
    ],
  },
  {
    slug: "double-letters",
    title: "5-Letter Words With Double Letters",
    keyword: "5 letter words with double letters",
    metaTitle: "5-Letter Words With Double Letters — Full List",
    metaDescription:
      "Every five-letter word containing a repeated letter, with Scrabble scores and definitions. The list Wordle players need when a letter appears twice.",
    phrase: "with a repeated letter",
    match: (w) => distinctLetters(w) < 5,
    wordleTip:
      "Repeated letters are the single most common reason a Wordle streak ends. Standard guessing habits assume five different letters, so when the answer hides a second L or E, solvers keep testing new consonants that were never there.",
    sections: [
      {
        heading: "Why repeated letters break guessing habits",
        paragraphs: [
          "Most solvers open with words made of five distinct letters, which is efficient for gathering information but quietly teaches the wrong instinct. When a word like SPILL or GEESE turns up, the second copy of the letter is invisible to that strategy until very late in the game.",
          "Wordle's colour feedback compounds the confusion. A letter that appears twice in your guess but once in the answer comes back with one green or yellow and one grey, which reads at a glance like a contradiction. Learning to interpret that split correctly is worth several saved guesses.",
        ],
      },
      {
        heading: "Which letters double most often",
        paragraphs: [
          "E, L, S, O and T account for the large majority of doubled letters in five-letter words. If your remaining candidates all seem wrong, try doubling one of those five before anything else — it resolves the puzzle far more often than testing a fresh rare consonant.",
        ],
      },
    ],
  },
  {
    slug: "double-letters-together",
    title: "5-Letter Words With Two Same Letters in a Row",
    keyword: "5 letter words with double letters in a row",
    metaTitle: "5-Letter Words With Double Letters in a Row",
    metaDescription:
      "All five-letter words where the same letter appears twice consecutively, like SPILL or GEESE, with Scrabble scores and definitions.",
    phrase: "with the same letter twice in a row",
    match: (w) => /(.)\1/.test(w),
    wordleTip:
      "Adjacent doubles are the harder half of the repeated-letter problem. Knowing that a repeat is side by side rather than split across the word narrows the field sharply, because only certain letters double comfortably in English.",
    sections: [
      {
        heading: "Adjacent doubles versus split repeats",
        paragraphs: [
          "There are two ways a letter can repeat in a five-letter word: side by side, as in SPILL, or separated, as in LEVEL. This page covers only the first kind, which is both the more common pattern and the easier one to spot once you suspect it.",
          "Double consonants at the end of a word — LL, SS, TT, FF — are especially frequent because English uses them to mark a short vowel before them. That single spelling rule explains a large share of the list below.",
        ],
      },
      {
        heading: "Spotting a double from the colours",
        paragraphs: [
          "If a letter comes back green and you have exhausted sensible words around it, try placing a second copy immediately beside it. Solvers routinely overlook this move because it feels like wasting a slot, yet it is often the only remaining possibility.",
        ],
      },
    ],
  },
  {
    slug: "no-repeating-letters",
    title: "5-Letter Words With No Repeating Letters",
    keyword: "5 letter words with no repeating letters",
    metaTitle: "5-Letter Words With No Repeating Letters",
    metaDescription:
      "Five-letter words made of five different letters — the best Wordle opening guesses. Full list with Scrabble scores and definitions.",
    phrase: "with five different letters",
    match: (w) => distinctLetters(w) === 5,
    wordleTip:
      "Words with five distinct letters are the most efficient opening guesses in Wordle, because every slot tests something new. Every well-known starter — SLATE, CRANE, TRACE, AUDIO — comes from this list.",
    sections: [
      {
        heading: "Why distinct letters make the best openers",
        paragraphs: [
          "An opening guess is an information-gathering move, not an attempt to win. A word with a repeated letter spends two of its five slots asking the same question, which cuts the information you get back by twenty percent before the game has really started.",
          "The strongest openers go further and choose letters by frequency as well as distinctness. SLATE and CRANE both combine the most common consonants with two of the most common vowels, which is why they consistently outperform more unusual words that happen to have five different letters.",
        ],
      },
      {
        heading: "Building a two-guess opening pair",
        paragraphs: [
          "Many strong players fix two opening words in advance that share no letters at all, covering ten distinct letters across two guesses. Pairing something like SLATE with a word built from unused consonants and vowels reliably leaves only a handful of candidates by guess three.",
        ],
      },
    ],
  },
  {
    slug: "q-without-u",
    title: "5-Letter Words With Q and No U",
    keyword: "5 letter words with q and no u",
    metaTitle: "5-Letter Words With Q but No U — Complete List",
    metaDescription:
      "Every five-letter word containing Q without a following U, with Scrabble scores and definitions. The list Scrabble and Wordle players search for.",
    phrase: "containing Q but no U",
    match: (w) => w.includes("Q") && !w.includes("U"),
    order: "score",
    wordleTip:
      "A Q with no U is the rarest shape in the five-letter list and one of the hardest Wordle endings to guess. If Q has come back green and U is grey, the answer is almost certainly on this very short list.",
    sections: [
      {
        heading: "Why Q usually needs a U",
        paragraphs: [
          "English inherited the QU pair from Latin, and the convention is so strong that Q without U looks like a misprint. The exceptions are nearly all loanwords — from Arabic, Chinese, Hebrew and Inuit languages — where Q transcribes a sound English has no letter for.",
          "That borrowed origin explains their value in Scrabble. A Q is worth ten points, and being able to play it without holding a U turns an otherwise dead tile into a scoring move, which is why competitive players memorise this handful of words outright.",
        ],
      },
      {
        heading: "Learning the short list",
        paragraphs: [
          "There are few enough of these words that memorising them is genuinely practical, unlike most word-list advice. Ten minutes spent on the list below covers essentially every situation where a Q arrives without a U to support it.",
        ],
      },
    ],
  },
  {
    slug: "rare-letters",
    title: "5-Letter Words With Rare Letters (J, Q, X, Z)",
    keyword: "5 letter words with rare letters",
    metaTitle: "5-Letter Words With J, Q, X or Z — Full List",
    metaDescription:
      "All five-letter words containing J, Q, X or Z — the rarest letters in English — ranked by Scrabble score with definitions.",
    phrase: "containing J, Q, X or Z",
    match: (w) => /[JQXZ]/.test(w),
    order: "score",
    wordleTip:
      "Rare letters are usually the last thing a solver tests, which is exactly why Wordle answers containing them break so many streaks. If four guesses have eliminated the common letters, work through this list rather than reshuffling what you already know.",
    sections: [
      {
        heading: "The four letters English almost never uses",
        paragraphs: [
          "J, Q, X and Z are the least frequent letters in written English, and all four carry the highest Scrabble values as a result. In five-letter words they cluster into recognisable shapes: Z doubles or sits mid-word, X favours the end, J almost always opens, and Q needs its U.",
          "Because they are rare, they are also extremely informative. A single confirmed Z or X often reduces the candidate list to a few words, where a confirmed E might leave hundreds.",
        ],
      },
      {
        heading: "Rare letters in Scrabble",
        paragraphs: [
          "The same words that frustrate Wordle players win Scrabble games. Every entry below is worth well above the average five-letter score, and placing one across a premium square is frequently the difference between a close game and a comfortable one.",
        ],
      },
    ],
  },
  {
    slug: "same-start-and-end",
    title: "5-Letter Words That Start and End With the Same Letter",
    keyword: "5 letter words that start and end with the same letter",
    metaTitle: "5-Letter Words Starting and Ending With the Same Letter",
    metaDescription:
      "Every five-letter word whose first and last letter match, like LEVEL and SALSA, with Scrabble scores and definitions.",
    phrase: "that start and end with the same letter",
    match: (w) => w[0] === w[4],
    wordleTip:
      "This shape catches solvers who assume a confirmed first letter cannot also be the last. When both ends of the grid resist you, checking whether the answer simply repeats its opening letter often solves it immediately.",
    sections: [
      {
        heading: "A pattern that hides in plain sight",
        paragraphs: [
          "Words like LEVEL, SALSA, DECAD and TRUST-adjacent shapes share a quiet symmetry: the letter that opens the word also closes it. Wordle's colour feedback handles this correctly, but human pattern-matching often does not, because a green first letter feels like it has been used up.",
          "Several of these words are also palindromes or near-palindromes, which makes them satisfying to spot and easy to remember once you have seen the list. That memorability is worth more than it sounds when you meet the same shape again months later.",
        ],
      },
      {
        heading: "Using the pattern deliberately",
        paragraphs: [
          "If you have a confirmed letter in slot one and every candidate for slot five has failed, deliberately test the opening letter again in the final position. It costs one guess and eliminates an entire category of answers that standard strategies never reach.",
        ],
      },
    ],
  },
  {
    slug: "highest-scoring",
    title: "Highest-Scoring 5-Letter Words in Scrabble",
    keyword: "highest scoring 5 letter words",
    metaTitle: "Highest-Scoring 5-Letter Words in Scrabble",
    metaDescription:
      "The top-scoring five-letter words in Scrabble and Words With Friends, ranked by points with definitions for every entry.",
    phrase: "worth the most points in Scrabble",
    match: (w) => scrabbleScore(w) >= 16,
    order: "score",
    wordleTip:
      "High-scoring words lean on rare letters, which makes them disproportionately common as Wordle answers late in a puzzle. The same qualities that make a word valuable on a Scrabble board make it hard to guess in six tries.",
    sections: [
      {
        heading: "What makes a five-letter word score",
        paragraphs: [
          "Scrabble scoring is driven almost entirely by letter rarity. A word carrying a Z or Q starts at ten points before anything else is counted, and stacking a second high-value letter alongside it produces the totals at the top of this list.",
          "Words With Friends uses a different table, which is why the two columns below sometimes disagree. J and X are worth more in Words With Friends, while several mid-value consonants are worth less, so the best word for one game is not automatically the best for the other.",
        ],
      },
      {
        heading: "Points versus placement",
        paragraphs: [
          "A high base score only matters if the board lets you place it. Experienced players hold a strong word until a double or triple word square is reachable, since tripling a twenty-point word beats playing it flat for a small gain.",
        ],
      },
    ],
  },
  {
    slug: "three-consonants-in-a-row",
    title: "5-Letter Words With Three Consonants in a Row",
    keyword: "5 letter words with three consonants in a row",
    metaTitle: "5-Letter Words With Three Consonants in a Row",
    metaDescription:
      "Five-letter words containing three consecutive consonants, like SPLIT and SHRUB, with Scrabble scores and definitions.",
    phrase: "with three consonants in a row",
    match: (w) => {
      for (let i = 0; i <= 2; i += 1) {
        const trio = w.slice(i, i + 3);
        if ([...trio].every((c) => !VOWELS.has(c))) return true;
      }
      return false;
    },
    wordleTip:
      "Consonant clusters are hard to guess because solvers instinctively space vowels out evenly. When a confirmed vowel refuses to fit anywhere comfortable, a three-consonant run is usually the reason.",
    sections: [
      {
        heading: "How English stacks consonants",
        paragraphs: [
          "English tolerates three consonants together only in specific combinations. At the start of a word the cluster almost always begins with S — SPL, SPR, STR, SCR — and in the middle it usually spans a syllable boundary, as in the NCH of BUNCH or the RTH of WORTH.",
          "Once you know those patterns, a three-consonant run stops being a guessing problem and becomes a lookup. If you have an S in slot one and a consonant in slot two, the third slot is very likely L or R.",
        ],
      },
      {
        heading: "Where the vowel ends up",
        paragraphs: [
          "A five-letter word with three consecutive consonants has room for at most two vowels, and often only one. That vowel tends to land immediately after the cluster, which is a reliable enough rule to guide a guess when you have run out of better information.",
        ],
      },
    ],
  },
  {
    slug: "y-as-the-only-vowel",
    title: "5-Letter Words With Y as the Only Vowel",
    keyword: "5 letter words with y as the only vowel",
    metaTitle: "5-Letter Words With Y as the Only Vowel",
    metaDescription:
      "Every five-letter word where Y does the vowel's work and no A, E, I, O or U appears — with Scrabble scores and definitions.",
    phrase: "where Y is the only vowel",
    match: (w) => countVowels(w) === 0 && w.includes("Y"),
    wordleTip:
      "When every true vowel has come back grey, Y is carrying the word. This list is the complete set of answers still available to you at that point, which makes it one of the most directly useful pages here.",
    sections: [
      {
        heading: "Y as a working vowel",
        paragraphs: [
          "Y is the only letter in English that switches roles depending on where it sits. At the start of a word it behaves as a consonant, as in YEARN, but anywhere else it usually supplies the vowel sound outright — the Y in GYPSY does exactly what the I in GIPSY would.",
          "Wordle treats Y as just another letter, which is why players who mentally file it with the consonants keep getting caught. Adding Y to your list of vowels to test, rather than to your list of leftovers, is a small habit that pays off repeatedly.",
        ],
      },
      {
        heading: "The shapes these words take",
        paragraphs: [
          "Most words here put Y in the middle or at the end, surrounded by the consonants that blend most easily: CR, DR, GL, TR and the ending -LY. Recognising those frames narrows the list quickly even before you know which consonants are in play.",
        ],
      },
    ],
  },
  {
    slug: "starting-with-a-vowel",
    title: "5-Letter Words Starting With a Vowel",
    keyword: "5 letter words starting with a vowel",
    metaTitle: "5-Letter Words Starting With a Vowel — Full List",
    metaDescription:
      "All five-letter words beginning with A, E, I, O or U, sorted common-first with Scrabble scores and definitions.",
    phrase: "beginning with a vowel",
    match: (w) => VOWELS.has(w[0]),
    wordleTip:
      "Solvers habitually assume a word opens with a consonant, so a vowel in slot one is a frequent blind spot. If a confirmed vowel keeps failing in the middle positions, try it at the front before anything else.",
    sections: [
      {
        heading: "Vowel openings are rarer than they feel",
        paragraphs: [
          "Only about one five-letter word in six begins with a vowel, and the distribution among the five is lopsided: A leads by a wide margin, followed by O and E, with I and U trailing well behind. That imbalance is worth exploiting when you are choosing which vowel to test first.",
          "Words opening with A frequently continue with a consonant cluster — ABOUT, ADOPT, AMBER — while those opening with O and E lean toward a second vowel or a single soft consonant. Knowing the tendency helps you build a sensible second guess.",
        ],
      },
      {
        heading: "Using vowel-initial words as guesses",
        paragraphs: [
          "AUDIO and ADIEU both open with a vowel and test three or four of them at once, which makes them popular first guesses for players who prefer to settle the vowel skeleton early. They pair well with a consonant-heavy second guess drawn from the single-vowel list.",
        ],
      },
    ],
  },
  {
    slug: "ending-with-a-vowel",
    title: "5-Letter Words Ending With a Vowel",
    keyword: "5 letter words ending with a vowel",
    metaTitle: "5-Letter Words Ending With a Vowel — Full List",
    metaDescription:
      "Every five-letter word ending in A, E, I, O or U, with Scrabble scores and definitions, sorted common-first for Wordle players.",
    phrase: "ending with a vowel",
    match: (w) => VOWELS.has(w[4]),
    wordleTip:
      "A vowel in the final slot is far more common than players expect, largely because of the silent E ending. If your candidates all end in a consonant and none of them fit, the answer probably closes on a vowel.",
    sections: [
      {
        heading: "The silent E effect",
        paragraphs: [
          "A large share of these words end in E, and most of the time that E is silent — it exists to lengthen the vowel before it, as in HOUSE, PLACE and STONE. That single spelling convention makes E by far the most likely letter in the fifth slot of any five-letter word.",
          "The other vowel endings are much narrower. Words ending in A are often names, borrowings or plurals of Latin origin; endings in O tend to be borrowings or informal shortenings; and endings in I or U are rare enough to be worth memorising individually.",
        ],
      },
      {
        heading: "Guessing the last letter",
        paragraphs: [
          "If you have four letters placed and the fifth is unknown, testing E before any consonant is the percentage play. It appears in the final position more often than S, the next most likely candidate, despite S being the obvious guess for plurals.",
        ],
      },
    ],
  },
];

export const STAT_LIST_SLUGS = STAT_LISTS.map((l) => l.slug);

export function getStatListDef(slug: string): StatListDef | undefined {
  return STAT_LISTS.find((l) => l.slug === slug);
}

/* Lazily-built, memoised per slug — see the note at the top of this file. */
const _cache = new Map<string, string[]>();

function wordsFor(def: StatListDef): string[] {
  const cached = _cache.get(def.slug);
  if (cached) return cached;
  const words = ALL.filter(def.match);
  if (def.order === "score") {
    words.sort(
      (a, b) => scrabbleScore(b) - scrabbleScore(a) || (a < b ? -1 : a > b ? 1 : 0)
    );
  } else {
    const rank = (w: string) => (COMMON_SET.has(w) ? 0 : glossOf(w) ? 1 : 2);
    words.sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0));
  }
  _cache.set(def.slug, words);
  return words;
}

function toEntry(word: string): WordEntry {
  const def = glossOf(word);
  return {
    word,
    scrabble: scrabbleScore(word),
    wwf: wwfScore(word),
    ...(def ? { def } : {}),
  };
}

const CAP = 200;

export interface StatListData {
  def: StatListDef;
  count: number;
  common: WordEntry[];
  all: WordEntry[];
  truncated: boolean;
  highest: WordEntry | null;
  topWords: string[];
  faqItems: { question: string; answer: string }[];
}

export function getStatListData(slug: string): StatListData | null {
  const def = getStatListDef(slug);
  if (!def) return null;
  const words = wordsFor(def);
  if (words.length === 0) return null;

  const commonWords = words.filter((w) => COMMON_SET.has(w));
  const highest = words.reduce<WordEntry | null>((best, w) => {
    const e = toEntry(w);
    return !best || e.scrabble > best.scrabble ? e : best;
  }, null);
  const topWords = (commonWords.length ? commonWords : words).slice(0, 10);

  return {
    def,
    count: words.length,
    common: commonWords.slice(0, CAP).map(toEntry),
    all: words.slice(0, CAP).map(toEntry),
    truncated: words.length > CAP,
    highest,
    topWords,
    faqItems: [
      {
        question: `How many 5-letter words are there ${def.phrase}?`,
        answer: `There are ${words.length} five-letter words ${def.phrase} in our word list${
          commonWords.length
            ? `, of which ${commonWords.length} are common enough to appear as a Wordle answer`
            : ""
        }. The most familiar are ${topWords.slice(0, 6).join(", ")}.`,
      },
      {
        question: `What is a good Wordle guess ${def.phrase}?`,
        answer: `${topWords.slice(0, 3).join(", ")} are strong choices. ${def.wordleTip}`,
      },
      {
        question: `What is the highest-scoring 5-letter word ${def.phrase}?`,
        answer: highest
          ? `${highest.word} scores ${highest.scrabble} points in Scrabble and ${highest.wwf} in Words With Friends, the best of any five-letter word ${def.phrase}.`
          : `Scores depend on the letters involved; rarer letters such as Q, Z, X and J raise the total sharply.`,
      },
      {
        question: `Are all of these words valid in Scrabble?`,
        answer: `Yes. Every entry on this page is a valid five-letter word, and each row lists both its Scrabble and Words With Friends score so you can compare them at a glance.`,
      },
    ],
  };
}
