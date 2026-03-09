import type {
  MinuteCrypticClueType,
  MinuteCrypticDifficulty,
} from "@/types/minute-cryptic";

type TopicConfig = {
  description: string;
  detailBody: string;
  detailFocus: string;
  href: string;
  label: string;
  shortLabel: string;
};

export const CLUE_TYPE_TOPICS: Record<MinuteCrypticClueType, TopicConfig> = {
  anagram: {
    label: "Anagram Clues",
    shortLabel: "Anagram",
    href: "/cryptic-clue-types/anagram",
    description:
      "Learn how anagram clues use indicator words, fodder letters, and definition checks.",
    detailBody:
      "Anagram clues train you to connect indicator language, letter count, and definition control in one clean solve. They are especially useful because they reward proof over intuition and make it easier to see exactly why an answer works.",
    detailFocus:
      "When you review an anagram clue, focus on the indicator, the exact fodder, and whether the final answer still fits the definition fairly.",
  },
  charade: {
    label: "Charade Clues",
    shortLabel: "Charade",
    href: "/cryptic-clue-types/charade",
    description:
      "Learn how charade clues assemble answers from shorter parts in sequence.",
    detailBody:
      "Charade clues build answers from smaller pieces, so they strengthen your ability to split a clue into meaningful segments and keep those segments in the correct order. That makes them one of the best clue families for building reliable structural reading.",
    detailFocus:
      "When you review a charade clue, focus on where the clue splits, which parts are abbreviations or short synonyms, and whether the assembly order is fully justified.",
  },
  container: {
    label: "Container Clues",
    shortLabel: "Container",
    href: "/cryptic-clue-types/container",
    description:
      "Learn how container clues place one set of letters inside another.",
    detailBody:
      "Container clues sharpen positional accuracy. They force you to identify which letters belong outside, which belong inside, and how the indicator language controls that relationship. This is a strong training ground for precise parse discipline.",
    detailFocus:
      "When you review a container clue, focus on who surrounds whom, how the insertion signal works, and whether a different placement would break the answer.",
  },
  "double-definition": {
    label: "Double Definition Clues",
    shortLabel: "Double Definition",
    href: "/cryptic-clue-types/double-definition",
    description:
      "Learn how one answer can satisfy two separate meanings fairly.",
    detailBody:
      "Double definition clues are less about letter operations and more about fairness of meaning. They teach you to reject answers that only satisfy one half of the clue strongly and to stay honest about whether both senses really point to the same word.",
    detailFocus:
      "When you review a double definition clue, focus on whether both meanings feel natural, independent, and equally fair for the answer you chose.",
  },
};

export const DIFFICULTY_TOPICS: Record<
  MinuteCrypticDifficulty,
  TopicConfig
> = {
  easy: {
    label: "Easy Minute Cryptic Clues",
    shortLabel: "Easy",
    href: "/minute-cryptic/easy",
    description:
      "Beginner-friendly practice clues with clearer structure and lighter resistance.",
    detailBody:
      "Easy clues are designed to make clue structure more visible. They are where definition habits, answer-length checking, and basic clue-type recognition become repeatable instead of accidental.",
    detailFocus:
      "At easy level, focus on building clean habits: identify the likely definition, test the clue type early, and avoid spending hints before making a real first attempt.",
  },
  medium: {
    label: "Medium Minute Cryptic Clues",
    shortLabel: "Medium",
    href: "/minute-cryptic/medium",
    description:
      "Intermediate practice clues that require stronger parsing and cleaner proof.",
    detailBody:
      "Medium clues sit in the most useful training zone for many solvers. They are hard enough to expose weak reasoning, but still clear enough to teach you something specific after review.",
    detailFocus:
      "At medium level, focus on rejecting half-proved answers, tightening your parse, and using hints only after you have tested the clue structure properly.",
  },
  hard: {
    label: "Hard Minute Cryptic Clues",
    shortLabel: "Hard",
    href: "/minute-cryptic/hard",
    description:
      "Advanced practice clues for deeper review, stronger precision, and tougher structure.",
    detailBody:
      "Hard clues reward precision, patience, and good review discipline. They often expose the difference between a plausible answer and a fully proven one, which is why they are so useful for advanced improvement.",
    detailFocus:
      "At hard level, focus on resetting weak parses early, diagnosing exactly where a clue failed, and treating review as part of the solve rather than something separate.",
  },
};

export function getClueTypeTopic(clueType: MinuteCrypticClueType) {
  return CLUE_TYPE_TOPICS[clueType];
}

export function getDifficultyTopic(difficulty: MinuteCrypticDifficulty) {
  return DIFFICULTY_TOPICS[difficulty];
}

export function formatClueTypeLabel(clueType: MinuteCrypticClueType) {
  return CLUE_TYPE_TOPICS[clueType].shortLabel;
}

export function formatDifficultyLabel(difficulty: MinuteCrypticDifficulty) {
  return DIFFICULTY_TOPICS[difficulty].shortLabel;
}
