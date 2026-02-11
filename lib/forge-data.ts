import snapshotStoreJson from "@/data/forge/snapshots.json";

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

export type ForgeSourceHealth = {
  name: string;
  url: string;
  ok: boolean;
  fetchedAt: string;
  foundCodes: number;
  error?: string;
};

export type ForgeDailySnapshot = {
  date: string;
  generatedAt: string;
  lastVerified: string;
  activeCodes: ForgeCode[];
  expiredCodes: ForgeCode[];
  updateLog: UpdateLogItem[];
  sources: ForgeSourceHealth[];
};

type ForgeSnapshotStore = {
  version: number;
  trackedKeywords?: number;
  monthlySearchEstimate?: string;
  snapshots: ForgeDailySnapshot[];
};

const snapshotStore = snapshotStoreJson as ForgeSnapshotStore;

const fallbackSnapshot: ForgeDailySnapshot = {
  date: "2026-02-10",
  generatedAt: "2026-02-10T10:00:00.000Z",
  lastVerified: "February 10, 2026, 10:00 UTC",
  activeCodes: [],
  expiredCodes: [],
  updateLog: [],
  sources: [],
};

const sortedSnapshots = [...(snapshotStore.snapshots ?? [])].sort((a, b) =>
  a.date.localeCompare(b.date)
);

export const forgeDailySnapshots: ForgeDailySnapshot[] =
  sortedSnapshots.length > 0 ? sortedSnapshots : [fallbackSnapshot];

export const forgeLatestSnapshot: ForgeDailySnapshot =
  forgeDailySnapshots[forgeDailySnapshots.length - 1];

export const forgeRecentSnapshots = [...forgeDailySnapshots]
  .reverse()
  .slice(0, 30);

export const activeForgeCodes: ForgeCode[] = forgeLatestSnapshot.activeCodes;
export const expiredForgeCodes: ForgeCode[] = forgeLatestSnapshot.expiredCodes;
export const forgeUpdateLog: UpdateLogItem[] = forgeLatestSnapshot.updateLog;

export function getForgeSnapshotByDate(date: string): ForgeDailySnapshot | null {
  return forgeDailySnapshots.find((item) => item.date === date) ?? null;
}

export function getForgeMonthSnapshots(monthPrefix: string): ForgeDailySnapshot[] {
  return forgeDailySnapshots.filter((item) => item.date.startsWith(monthPrefix));
}

export const forgeSiteFacts = {
  lastVerified: forgeLatestSnapshot.lastVerified,
  activeCount: activeForgeCodes.length,
  expiredCount: expiredForgeCodes.length,
  trackedKeywords: snapshotStore.trackedKeywords ?? 1231,
  monthlySearchEstimate: snapshotStore.monthlySearchEstimate ?? "421K",
  latestSnapshotDate: forgeLatestSnapshot.date,
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type RedeemStep = {
  title: string;
  detail: string;
};

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
      "This site auto-collects updates from multiple public sources several times per day.",
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
      "Use the active table at the top of the page. Codes are auto-collected from public sources and updated daily.",
  },
  {
    question: "What is the difference between active and expired the forge codes?",
    answer:
      "Active codes are currently marked as working by source consensus. Expired the forge codes are repeatedly flagged as unavailable.",
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
      "Keeping expired entries prevents repeated failed attempts and keeps historical transparency.",
  },
  {
    question: "How is this page different from other the forge codes roblox pages?",
    answer:
      "This page keeps a date-by-date snapshot archive and rolls updates from multiple sources into one feed.",
  },
];

export const forgeKeywordNarrative = [
  "If you search the forge codes, you usually want one thing: a list you can redeem right now. Most users do not need a long intro, and they do not want to jump through five ad-heavy pages before seeing active rewards. This homepage is built to solve that exact problem. We update the forge codes feed every day, split active from expired, and show a clear timestamp so you can decide quickly.",
  "The challenge with the forge codes is reliability. Different sites often publish conflicting status on the same day. One page says a code works, another says it is dead, and users waste time retrying the same string repeatedly. Our workflow aggregates multiple public sources, keeps an archive, and exposes status changes in the update log.",
  "Keyword research shows strong demand around the forge codes, plus high overlap with terms like codes for the forge and new codes for the forge. That means this homepage needs both fast utility and broad context. Fast utility comes from the active table and quick copy flow. Broad context comes from redeem instructions, troubleshooting, and archive visibility.",
  "A major ranking signal for this topic is freshness. The forge codes 2026 style queries spike around updates and seasonal events, and older pages can lose trust quickly when status is outdated. This is why every section on this homepage supports freshness: active list, expired list, and timeline.",
  "Another critical signal is intent matching. People searching how to redeem codes in the forge or where to put codes in the forge are already close to action. They do not need theory; they need exact steps. Our redeem block keeps this path short and practical.",
  "The forge codes ecosystem also has high query variation. Users type the forge codes, the forge roblox codes, the forge codes roblox, and all codes in the forge interchangeably. This homepage addresses that by using one canonical content hub with structured sections, then supporting pages for redeem guide, FAQ depth, daily snapshots, and history.",
  "Most competing pages rely on domain authority and generic list format. For a focused brand like theforgecodes, authority has to be built through consistency. Consistency means code status is refreshed frequently, archived status is not hidden, and labels stay clear.",
  "From a content standpoint, the forge codes page should not read like filler. Each block should answer a specific query cluster: active list for immediate redemption, expired list for duplicate-check behavior, redeem guide for action intent, troubleshooting for failure intent, and FAQ for edge cases.",
  "As this site grows, the forge codes homepage remains the top-level authority page. Daily pages capture freshness-based demand, while the history page captures archive and transparency intent. Together, these assets help maintain relevance for the forge codes across update cycles.",
  "In short, this is the practical workflow for the forge codes: check active status, redeem immediately, verify failures in troubleshooting, and confirm changes in the update log. If you are returning every few days, bookmark this page and check the timestamp first.",
];

export const forgeEditorialGuide = [
  "When players search the forge codes, they usually want speed, but speed without context often causes mistakes. A short list can tell you what to paste, but it does not explain when that list was refreshed, why a code appears in one article and disappears in another, or how to interpret disagreement between sources. This guide exists to solve that gap. The goal is not to pretend every code is guaranteed; the goal is to make each code entry traceable, timely, and easier to evaluate before you spend ten minutes retrying inputs that may already be stale.",
  "Use the page in three passes. First pass: read only the active table and check the timestamp column. Second pass: if a code fails, immediately check the expired table to see whether it was recently moved. Third pass: review the update log to understand whether the failure is likely a global expiration or a temporary mismatch caused by game version delay. This routine takes under one minute and gives you far better odds than copying random social snippets without context. Most wasted retries happen because people skip step two and step three.",
  "The timestamp model matters more than most users expect. In code-tracking topics, freshness is not just a ranking concept; it is a practical input to whether rewards still redeem. A code listed as active thirty minutes ago can fail now if the game pushed a silent reset. That is why this page exposes timestamps at row level instead of only a generic last-updated label at the top. Row-level timing helps you estimate trust by entry, especially when multiple codes change in different windows during event days or patch windows.",
  "Another useful signal is source spread. If the same code appears across several independent pages, confidence increases, but confidence is still not certainty. Some outlets copy from each other quickly, so a repeated typo can propagate through the ecosystem. Treat source count as a prioritization metric: test high-consensus entries first, then evaluate low-consensus entries only if you still need additional rewards. This order minimizes failed attempts and reduces the chance you conclude the entire system is broken when only one code family is unstable.",
  "For redemption execution, small formatting details produce a surprisingly high error rate. Keep capitalization exact, preserve punctuation marks, and avoid trailing spaces when copying from long articles. If a code contains symbols, verify that mobile keyboards did not auto-replace characters. Also confirm you are in the correct redeem interface inside The Forge, not a similar panel from another Roblox experience. The fastest debugging step is to paste one high-confidence code first; if that succeeds, account and interface are likely correct and failure shifts to code-specific status.",
  "Why maintain an expired archive at all? Because memory is unreliable under fast updates. Without an archive, players repeatedly test the same dead entries shared in old videos, comments, or screenshots. The archive acts as a negative knowledge base: it tells you what not to retry. Over time this saves more effort than any single active list. It also improves transparency for returning visitors, who can compare today and yesterday instead of guessing whether a code vanished due to moderation, typo correction, or genuine expiration.",
  "Daily pages are the long-tail backbone of this project. The main page answers immediate intent, while date-stamped pages capture historical intent and preserve state changes for auditing. If someone asks what happened on a specific day, you can point to a frozen snapshot instead of reconstructing events manually. This structure also keeps internal linking clean: summary page to daily page, daily page back to summary, and both connected to history and FAQ. That mesh creates a stronger topical cluster than a single page that keeps overwriting itself with no trace.",
  "From an SEO perspective, differentiation between the homepage and the forge-codes hub is essential. Homepage should remain a brand gateway and navigation node; this page should remain the operational code center. When both pages carry identical blocks, search engines may struggle to decide which URL best satisfies the query, and users may bounce after seeing duplicated sections. Clear role separation improves index clarity, crawl efficiency, and user orientation. It also lets you evolve the hub aggressively without destabilizing the homepage experience.",
  "As traffic grows, quality control should focus on stability signals: fewer abrupt swings in active counts, clearer change reasons in the timeline, and fewer ambiguous labels like unknown reward. Even in an auto-collected model, presentation quality can separate your site from generic copy lists. Explain uncertainty directly. Mark likely stale entries clearly. Prefer transparent notes over artificial certainty. Users usually accept that code status changes quickly; what they dislike is hidden ambiguity. Transparency creates repeat visits, and repeat visits are the long-term moat.",
  "The practical takeaway is simple. Treat this page as a workflow tool, not a static article. Start with active rows sorted by confidence, redeem in order, check failures against the archive, and use the timeline to understand movement. If a code fails despite recent activity signals, wait for the next refresh window instead of brute-force retries. This approach is faster, less frustrating, and more consistent with how code ecosystems actually behave. Over repeated visits, you will spend less time chasing noise and more time redeeming what still works.",
];

export const forgeOperationsManual = [
  "Operationally, a code page succeeds when users can answer three questions in seconds: what is likely working right now, what already failed recently, and what changed since the last visit. Everything else should support those questions. If a section cannot help users decide whether to redeem now or wait for another refresh, it should be shortened or moved below the fold. This principle keeps the page practical even as content grows. Large pages can still feel fast when the top modules are purpose-built for immediate action.",
  "Daily snapshot discipline is the core of trust. A snapshot should be immutable after publication except for clear correction events. If you rewrite old dates silently, users lose the ability to audit changes, and search engines may see unstable content patterns. Keeping date pages stable while pushing all new status shifts into the newest snapshot provides a clean historical trail. It also helps you answer comments with exact links instead of paraphrasing memory. Stability of history is often more important than perfection of any single run.",
  "Source diversity should be treated as a signal, not a verdict. Two sites can quote each other and still be wrong together. To reduce this risk, rank signals by origin type: official channels first, independent editorial sites second, community chatter last. Even without manual validation, this weighting model reduces drift toward copied noise. If you later add advanced parsing, preserve source-type weighting as a first-class feature. It creates a stronger baseline than pure frequency counting and better reflects how gaming news actually propagates.",
  "Presentation order affects user behavior more than people expect. Put the actionable code table first, but keep a short instruction bar directly above it: exact casing required, verify game version, and check timestamp before retrying. That one micro-instruction can reduce repeated failures dramatically. Then keep the expired table visible but collapsed by default. Users who fail a redemption naturally expand the archive and self-debug, while users who only want fast copies are not slowed by extra scrolling. This is a small UX pattern with high practical value.",
  "For content quality, avoid generic filler around redemption mechanics. Readers searching this topic already know what a Roblox code is; they need specific execution checks. Replace abstract advice with deterministic checks: where the redeem input appears, what punctuation often breaks, when to rejoin servers, and how update windows can invalidate previously working strings. Specificity lowers bounce and increases return rate because users learn that the page helps resolve real friction, not just repeats the same broad definitions found everywhere else.",
  "Internal linking should match journey stages. Discovery stage links should point from homepage to the main hub. Action stage links should point from hub to redeem guide and troubleshooting. Verification stage links should point from hub to daily snapshots and history archives. When link labels align with intent, users self-select the right depth instead of leaving for competitor pages. This alignment also improves crawl context because each cluster communicates purpose through anchor text and surrounding copy, not only through URL naming conventions.",
  "Archive hygiene is another long-term advantage. Over months, code pages accumulate typo variants and outdated seasonal entries. If you keep these without labeling, the archive becomes noisy and weakens confidence. Use short notes to explain why entries are archived: season ended, replaced by new series, or no longer recognized across sources. Even simple labels make the archive useful. A clean archive prevents support-style comments from repeating the same questions and lets returning users understand transitions between event cycles quickly.",
  "A robust update cadence does not mean constant publishing; it means predictable windows. Three refreshes per day often outperform random hourly attempts because users learn when to check. Predictability also helps you monitor anomalies. If a normal window produces zero valid candidates while sources are reachable, you can flag the run as low-confidence rather than publishing empty lists. Consistency in cadence plus transparent confidence language creates credibility. Users tolerate uncertainty when timing and messaging are reliable.",
  "When monetization elements are present, keep them separate from the code action path. Ad density around the copy/redeem zone can increase misclicks and frustration, especially on mobile where keyboard and banners compete for space. Place monetization blocks between non-critical sections such as extended commentary and deep FAQ, not inside the primary active table. This keeps user trust intact and protects core engagement metrics. A page that frustrates users in the first thirty seconds loses far more long-term value than any short-term ad uplift.",
  "Finally, measure outcomes that reflect user success, not only traffic. Useful indicators include repeat visits within seven days, click-through from snapshot list to daily pages, and lower fallback to expired entries after failed attempts. These metrics show whether the page actually helps users complete their task. If traffic rises but these behaviors worsen, the content may be attracting clicks without delivering clarity. The objective for this hub should be simple: faster decisions, fewer failed retries, and a reliable daily experience that people choose to return to.",
];
