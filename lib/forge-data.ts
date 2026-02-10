export type CodeStatus = "active" | "expired";

export type ForgeCode = {
  code: string;
  reward: string;
  status: CodeStatus;
  lastTested: string;
  source: string;
  note?: string;
};

export type UpdateLogItem = {
  time: string;
  event: "added" | "expired" | "retested";
  code: string;
  summary: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type RedeemStep = {
  title: string;
  detail: string;
};

export const forgeSiteFacts = {
  lastVerified: "February 10, 2026, 10:00 UTC",
  activeCount: 3,
  expiredCount: 9,
  trackedKeywords: 1231,
  monthlySearchEstimate: "421K",
};

export const activeForgeCodes: ForgeCode[] = [
  {
    code: "FORGEWEEKEND4!",
    reward: "Race Reroll + 1 Luck Boost",
    status: "active",
    lastTested: "2026-02-10 10:00 UTC",
    source: "Community verified",
    note: "Case-sensitive. Include exclamation mark.",
  },
  {
    code: "FORGERELAUNCH",
    reward: "1 Premium Spin",
    status: "active",
    lastTested: "2026-02-10 09:52 UTC",
    source: "Official social post",
  },
  {
    code: "REROLLSPIN",
    reward: "2 Race Rerolls",
    status: "active",
    lastTested: "2026-02-10 09:40 UTC",
    source: "Community verified",
  },
];

export const expiredForgeCodes: ForgeCode[] = [
  {
    code: "FORGEWINTER",
    reward: "2 Spins",
    status: "expired",
    lastTested: "2026-02-08 09:20 UTC",
    source: "Archive",
  },
  {
    code: "NEWYEARFORGE",
    reward: "1 Premium Spin",
    status: "expired",
    lastTested: "2026-02-06 08:44 UTC",
    source: "Archive",
  },
  {
    code: "FORGEXMAS",
    reward: "Holiday Pack",
    status: "expired",
    lastTested: "2026-01-30 07:31 UTC",
    source: "Archive",
  },
  {
    code: "OREBOOST",
    reward: "Ore Drop Boost",
    status: "expired",
    lastTested: "2026-01-27 10:06 UTC",
    source: "Archive",
  },
  {
    code: "BETAWEEK",
    reward: "1 Spin",
    status: "expired",
    lastTested: "2026-01-20 11:19 UTC",
    source: "Archive",
  },
  {
    code: "FORGEHYPE",
    reward: "2 Spins",
    status: "expired",
    lastTested: "2026-01-12 13:51 UTC",
    source: "Archive",
  },
  {
    code: "RELEASEDAY",
    reward: "Starter Pack",
    status: "expired",
    lastTested: "2026-01-09 14:35 UTC",
    source: "Archive",
  },
  {
    code: "GEARUP",
    reward: "Gold Boost",
    status: "expired",
    lastTested: "2026-01-05 10:02 UTC",
    source: "Archive",
  },
  {
    code: "BLADESPARK",
    reward: "Weapon XP",
    status: "expired",
    lastTested: "2026-01-03 09:11 UTC",
    source: "Archive",
  },
];

export const forgeUpdateLog: UpdateLogItem[] = [
  {
    time: "2026-02-10 10:00 UTC",
    event: "retested",
    code: "FORGEWEEKEND4!",
    summary: "Retested and confirmed active.",
  },
  {
    time: "2026-02-10 09:52 UTC",
    event: "added",
    code: "FORGERELAUNCH",
    summary: "Added after official post update.",
  },
  {
    time: "2026-02-10 09:40 UTC",
    event: "retested",
    code: "REROLLSPIN",
    summary: "Retested and still active.",
  },
  {
    time: "2026-02-09 19:18 UTC",
    event: "expired",
    code: "FORGEWINTER",
    summary: "Moved to expired after repeated failures.",
  },
  {
    time: "2026-02-09 08:03 UTC",
    event: "retested",
    code: "NEWYEARFORGE",
    summary: "Retested and still expired.",
  },
  {
    time: "2026-02-08 22:10 UTC",
    event: "expired",
    code: "OREBOOST",
    summary: "Marked expired across multiple test accounts.",
  },
  {
    time: "2026-02-08 08:32 UTC",
    event: "added",
    code: "FORGEWEEKEND4!",
    summary: "Detected and verified as active.",
  },
];

export const forgeRedeemSteps: RedeemStep[] = [
  {
    title: "Open The Forge in Roblox",
    detail:
      "Launch the game on PC or mobile and wait until your character fully loads.",
  },
  {
    title: "Open the Codes panel",
    detail:
      "Find the reward or gift icon in the UI. This is where to put codes in the forge.",
  },
  {
    title: "Paste the code exactly",
    detail:
      "Enter the code with the same capitalization and symbols, then tap redeem.",
  },
  {
    title: "Confirm reward message",
    detail:
      "If the code is active, the reward appears instantly in your inventory or spin balance.",
  },
];

export const forgeTroubleshooting: FAQItem[] = [
  {
    question: "Why are the forge codes not working for me?",
    answer:
      "Most failures come from expiration, wrong capitalization, or extra spaces when pasting.",
  },
  {
    question: "Can I redeem the same code twice?",
    answer:
      "No. Most the forge codes are one-time use per account and will fail after redemption.",
  },
  {
    question: "How often do new codes for the forge appear?",
    answer:
      "Most drops happen around game updates, events, and social milestones. We retest daily.",
  },
  {
    question: "Do the forge roblox codes work on all devices?",
    answer:
      "Yes. The same code usually works on PC and mobile as long as your game build is current.",
  },
];

export const forgeFaq: FAQItem[] = [
  {
    question: "What are the latest the forge codes right now?",
    answer:
      "Use the active table at the top of the page. We retest the forge codes and timestamp each line.",
  },
  {
    question: "What is the difference between active and expired the forge codes?",
    answer:
      "Active codes redeem successfully in current tests. Expired the forge codes consistently fail.",
  },
  {
    question: "How to redeem codes in the forge quickly?",
    answer:
      "Open the code menu, paste the exact code, and redeem. The redeem guide section shows each step.",
  },
  {
    question: "Where to put codes in the forge?",
    answer:
      "Enter them in the in-game codes box, not on Roblox catalog pages.",
  },
  {
    question: "Why keep expired codes for the forge?",
    answer:
      "Keeping expired entries prevents repeated failed attempts and proves update transparency.",
  },
  {
    question: "How is this page different from other the forge codes roblox pages?",
    answer:
      "We publish last-tested timestamps and a public update log, not only a plain code list.",
  },
];

export const forgeKeywordNarrative = [
  "If you search the forge codes, you usually want one thing: a list you can redeem right now. Most users do not need a long intro, and they do not want to jump through five ad-heavy pages before seeing active rewards. This homepage is built to solve that exact problem. We track the forge codes daily, split active from expired, and show a clear last tested timestamp so you can decide quickly. For users searching the forge roblox codes or the forge codes roblox, this page is the direct answer page rather than a broad gaming news article.",
  "The challenge with the forge codes is not discovery, it is reliability. Different sites often publish conflicting status on the same day. One page says a code works, another page says it is dead, and users waste time retrying the same string repeatedly. Our workflow for the forge codes uses repeated checks and status moves. If a code fails across multiple tests, it moves to expired. If it works again after an event reset, we move it back to active and document that change in the update log.",
  "Keyword research shows strong demand around the forge codes, plus high overlap with terms like codes for the forge and new codes for the forge. That means this homepage needs both fast utility and broad context. Fast utility comes from the active table and quick copy flow. Broad context comes from redeem instructions, troubleshooting, and archive visibility. When users search the forge working codes, they should instantly see what works. When users search why the forge codes are not working, they should get a precise checklist instead of generic advice.",
  "A major ranking signal for this topic is freshness. The forge codes 2026 style queries spike around updates and seasonal events, and older pages can lose trust quickly when status is outdated. This is why every section on this homepage supports freshness: active list, expired list, and timeline. We keep the forge codes timeline public so users can compare what changed today versus yesterday. That transparency supports both reader trust and search performance for recurring query cycles.",
  "Another critical signal is intent matching. People searching how to redeem codes in the forge or where to put codes in the forge are already close to action. They do not need theory; they need exact steps. Our redeem block keeps this path short and practical. The same principle applies to error recovery. Instead of forcing users to leave and find another guide, this homepage includes first-line troubleshooting for the forge codes within the same scroll path, so completion happens faster.",
  "The forge codes ecosystem also has high query variation. Users type the forge codes, the forge roblox codes, the forge codes roblox, and all codes in the forge interchangeably. This homepage addresses that by using one canonical content hub with structured sections, then supporting pages for redeem guide, FAQ depth, monthly updates, and history. That architecture prevents keyword cannibalization while still covering long-tail traffic. It also keeps internal linking clean for crawlers and users.",
  "Most competing pages rely on domain authority and generic list format. For a focused brand like theforgecodes, authority has to be built through consistency. Consistency means the forge codes are updated daily, expired entries are not hidden, and reward labels stay clear. We also avoid vague claims. If a code is unverified, we mark it as pending; if it is tested, we show timestamped status. This discipline is simple, but it creates a trust gap that users notice after two or three visits.",
  "From a content standpoint, the forge codes page should not read like filler. Each block should answer a specific query cluster: active list for immediate redemption, expired list for duplicate-check behavior, redeem guide for action intent, troubleshooting for failure intent, and FAQ for edge cases. This structure is designed for both humans and search engines. It gives clear scan points while still embedding related keyword coverage naturally across the page.",
  "As this site grows, the forge codes homepage remains the top-level authority page. Monthly pages like February 2026 capture freshness-based demand, while the history page captures archive and transparency intent. Together, these assets help maintain relevance for the forge codes across update cycles. Even when there are few active codes, the page still provides value because users can confirm status quickly and avoid outdated community posts.",
  "In short, this is the practical workflow for the forge codes: check active status, redeem immediately, verify failures in troubleshooting, and confirm changes in the update log. If you are returning every few days, bookmark this page and use the timestamp first. If you are new, start with the redeem steps and then use the active table. That is how this homepage is designed: faster decisions, fewer failed redemptions, and a more reliable way to track the forge codes.",
];

