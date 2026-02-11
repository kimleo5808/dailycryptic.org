import { forgeRecentSnapshots, forgeSiteFacts } from "@/lib/forge-data";
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  CircleDot,
  Flame,
  Gift,
  ListChecks,
  SearchCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

const latestSnapshot = forgeRecentSnapshots[0];
const latestActivePreview = (latestSnapshot?.activeCodes ?? []).slice(0, 8);

const keywordSignalCards = [
  {
    label: "US Monthly Search",
    value: "5.4K",
    note: "Primary commercial region in your keyword screenshots.",
  },
  {
    label: "Global Monthly Search",
    value: "12.3K",
    note: "Total head-term demand for the forge codes family.",
  },
  {
    label: "Tracked Variations",
    value: "141+",
    note: "Strong synonym cluster such as the forge roblox codes.",
  },
  {
    label: "Question Keywords",
    value: "20+",
    note: "Includes how to redeem, how to use, and where to put flows.",
  },
];

type HomepageSubsection = {
  h3?: string;
  paragraphs: string[];
};

type HomepageSection = {
  id: string;
  title: string;
  subsections: HomepageSubsection[];
};

const homepageSections: HomepageSection[] = [
  {
    id: "the-forge-codes-2026",
    title: "The Forge Codes in 2026: Why This Keyword Matters",
    subsections: [
      {
        paragraphs: [
          "The forge codes is not a tiny niche phrase; it is a recurring intent cluster with clear user urgency. The headline query the forge codes has meaningful volume on its own, and the related variants the forge roblox codes, the forge codes roblox, codes for the forge, and new codes for the forge all sit close enough to be solved by one tightly structured content system. This is why the homepage acts as a ranking-ready pillar for the forge codes, summarizes the latest market signals, and funnels users into the live update pages without forcing extra clicks.",
        ],
      },
      {
        h3: "The Forge Roblox Codes and Related Search Variants",
        paragraphs: [
          "The strongest takeaway from the keyword data is not only volume, but intent composition. Most terms around this query are informational with immediate action behavior. A user searching this term usually wants to redeem in the next minute. A user searching how to redeem codes in the forge is even closer to action. A user searching where to put codes in the forge is blocked by UI confusion and needs one exact answer. The right model is depth plus speed: prominent quick answers, then long-form support sections below.",
          "This keyword family has many lexical variants with similar intent. This matters because search engines often rotate which page wins for each variant, especially when one site uses only one phrase repeatedly without covering adjacent language. The homepage intentionally includes the forge codes, the forge roblox codes, the forge codes roblox, codes in the forge, new codes in the forge, and all codes in the forge in naturally placed headings and paragraphs. That pattern improves semantic coverage while keeping one canonical homepage URL as the topical anchor.",
        ],
      },
      {
        h3: "Why Fresh Codes for The Forge Outperform Static Lists",
        paragraphs: [
          "Competition indicators imply that content freshness and internal authority both matter. Large domains can rank quickly with shorter pages, but a focused brand like theforgecodes can still compete by publishing clearer structure and better update hygiene. The homepage states verification timestamps, links to daily pages, and explains how the update cycle works. For the forge codes topic, users reward transparent recency. If they see when the list changed and where to check day-specific snapshots, they return. Returning users create repeat engagement signals that help the main page hold rankings longer.",
        ],
      },
    ],
  },
  {
    id: "how-to-redeem-codes-in-the-forge",
    title: "How to Redeem Codes in The Forge",
    subsections: [
      {
        paragraphs: [
          "The phrase how to redeem codes in the forge is a high-intent query cluster. The short answer is direct: open Roblox The Forge, find the in-game codes entry panel, paste one code exactly as shown, and redeem before it expires. The long answer needs failure safeguards. Tell users to avoid extra spaces, preserve capitalization, and redeem the newest code first to validate that their account and session are healthy. If the first high-confidence code fails, the issue is usually game version mismatch or UI location confusion rather than code status.",
        ],
      },
      {
        h3: "How to Enter Codes in The Forge Step by Step",
        paragraphs: [
          "To avoid cannibalization, the homepage and the /the-forge-codes hub serve different jobs. The homepage is the strategic pillar: it explains the search landscape, teaches the redeem workflow, answers common failures, and routes users to live snapshots. The /the-forge-codes URL remains the operational list page with complete active and expired tables, timeline rows, and deep archives. When someone lands on the homepage from the forge codes query, the above-the-fold area should solve three questions fast: are there active codes now, when was the latest check, and where can I see today's detailed page.",
        ],
      },
      {
        h3: "Where to Put Codes in The Forge",
        paragraphs: [
          "The phrase where to put codes in the forge deserves explicit visual language because this is where many first-time players fail. The exact target is the in-game redemption field, not Roblox catalog search, not group walls, and not off-site claim forms. Common UI labels include the gift icon or codes button. If the field does not appear after updates, rejoin a server. A section that solves where to put codes in the forge captures frustrated traffic that otherwise bounces to multiple competitor pages before finding one clear instruction.",
        ],
      },
      {
        h3: "How to Use Codes in The Forge for Rerolls and Rewards",
        paragraphs: [
          "The phrase how to use codes in the forge sounds similar to how to redeem, but users asking it often want outcome context rather than only UI steps. Codes can unlock spins, resources, progression boosts, or event rewards depending on current game patches. Usage timing matters: new codes in the forge are usually most reliable right after update windows, then degrade as players redeem and events close. By explicitly connecting new entries to practical reward timing, the homepage becomes more helpful than pages that only repeat static lists without teaching when to act.",
        ],
      },
    ],
  },
  {
    id: "why-are-the-forge-codes-not-working",
    title: "Why Are The Forge Codes Not Working?",
    subsections: [
      {
        h3: "Common Reasons The Forge Codes Fail",
        paragraphs: [
          "Major competitors rank for the forge codes because they have strong domain authority and broad game coverage. Their advantage is scale. The advantage of a dedicated tracker like theforgecodes is precision: cleaner layout, faster path to active entries, transparent daily archive, and focused topical depth. Instead of pretending every code is always working, the freshness model reminds users that codes can expire quickly. Transparent uncertainty builds more trust than overconfident claims, especially in fast-moving Roblox code cycles.",
          "A practical workflow closes the loop between content and action. First, users discover updates on the homepage. Second, they open the main list page for live status. Third, if redemption fails, they compare with today's date page and check whether a code was moved into expired. This is the biggest difference between a generic article and a truly useful platform that users bookmark and revisit.",
        ],
      },
      {
        h3: "How Long Do The Forge Codes Last",
        paragraphs: [
          "Most the forge codes are time-limited. Some expire within days of release, while others last through entire update cycles. Weekend codes typically disappear by the following week. The homepage should explain what automation can and cannot guarantee. Automation helps discover candidate codes quickly, but individual rewards can still expire between fetch windows. This is not a weakness; it is normal behavior for game code ecosystems. Users should test top entries first, then consult the same-day page if a result fails. This guidance reduces frustration and keeps your audience aligned with how codes change in real time.",
        ],
      },
    ],
  },
  {
    id: "what-codes-are-there-now-in-the-forge",
    title: "What Codes Are There Now in The Forge",
    subsections: [
      {
        h3: "Active The Forge Codes This Week",
        paragraphs: [
          "A practical homepage structure for this niche looks like this: hero summary, keyword signal cards, active preview grid, redemption mini-guide, troubleshooting guide, editorial sections on update logic, and a right sidebar Recent Codes archive. This mirrors user behavior shown by top competitors but improves clarity. On competitor pages, users often scan a long article and still struggle to find historical links. On the homepage, the Recent Codes list remains visible while scrolling so visitors can jump to date pages immediately. That makes the forge codes journey faster and keeps internal linking strong.",
          "A second advantage is archive usability. Many users check these updates repeatedly but do not remember what changed since yesterday. A sticky Recent Codes sidebar solves this immediately by giving one-click access to date pages. When a code fails, users can inspect the previous two or three days and detect movement. This is practical value that improves satisfaction and lowers bounce. It also strengthens internal linking signals because each homepage session naturally opens multiple pages in this cluster.",
        ],
      },
      {
        h3: "When Does The Forge Release New Codes",
        paragraphs: [
          "Most drops happen around game updates, events, and social milestones. The homepage carries broad intent and long-form explanations, while /the-forge-codes carries live tables, /the-forge-codes/yyyy-mm-dd carries daily snapshots, and /the-forge-codes/month-name-year carries monthly trend summaries. This layered architecture makes coverage deeper than a single page that gets overwritten daily. It also gives search engines stable URL purposes, reducing indexing confusion and helping each page rank for the most relevant part of the query family.",
          "The brand voice stays consistent: practical, direct, and timestamp-driven. Players searching the forge codes do not need hype text. They need confidence that the page is current and honest. Keep the copy factual, show last verified time, and maintain clear active versus expired separation. Over time, this consistency is how theforgecodes becomes a recognized destination, even when competing against larger general gaming publications.",
        ],
      },
    ],
  },
  {
    id: "how-the-forge-codes-stay-updated",
    title: "How The Forge Codes Stay Updated Every Day",
    subsections: [
      {
        h3: "Daily Snapshots and The Forge Beta Codes Tracking",
        paragraphs: [
          "The infrastructure already supports scheduled updates. The data feed refreshes on a predictable cadence, snapshots are generated automatically, and each snapshot is published with a date route. This tells users why they can trust recency without checking social media constantly. For SEO, this also reinforces freshness signals by pairing textual promises with real date-based pages and sitemap updates that search engines can crawl.",
          "Every section must answer a specific intent cluster in the keyword map. If text does not help someone redeem faster, verify faster, or choose the correct page faster, it should be removed. This standard keeps the long-form format useful and prevents quality loss over time as you add new monthly and daily assets around the forge codes topic.",
        ],
      },
      {
        h3: "Monthly Archives: The Forge Codes February 2026 and Beyond",
        paragraphs: [
          "Monthly summaries add another layer of value. Daily pages answer what changed today, while monthly pages explain trend behavior such as patch spikes, seasonal bursts, and keyword pattern shifts like the forge codes 2026 and the forge beta codes. The homepage links to the latest month summary so users can understand context, not just single-day noise. Context improves trust and encourages longer sessions, which supports both user retention and SEO quality for the forge codes ecosystem.",
          "Over time, this operating model creates a durable moat: homepage for strategy, hub for live action, daily pages for immutable history, and monthly pages for interpretation. This is exactly the structure needed to compete in a query space where the forge codes demand stays high but status changes quickly. The strongest sites in this niche are not only fast at publishing; they are fast at organizing information so users can decide correctly with minimal friction.",
        ],
      },
    ],
  },
];

const faqItems = [
  {
    question: "Are these the forge codes guaranteed to work for every player?",
    answer:
      "No code page can guarantee permanent validity. We publish the forge codes based on the latest collected signals, then move entries to expired when repeated checks fail.",
  },
  {
    question: "How often should I check for new codes in the forge?",
    answer:
      "Check at least once per day and after major game updates. The homepage and Recent Codes sidebar are designed for this quick repeat workflow.",
  },
  {
    question: "What is the difference between the homepage and /the-forge-codes?",
    answer:
      "The homepage is the long-form pillar and guidance layer. The /the-forge-codes page is the live operational list with deeper status tables and update logs.",
  },
  {
    question: "Where do I find old the forge codes that stopped working?",
    answer:
      "Use the history and date pages from the Recent Codes list. Keeping expired records prevents repeated failed attempts.",
  },
  {
    question: "Do the forge roblox codes and the forge codes roblox mean different things?",
    answer:
      "In practice they represent the same intent cluster. We cover both language variants to match how users search in the real world.",
  },
  {
    question: "Can I rely only on one source for the forge codes?",
    answer:
      "It is safer to use an aggregated source with timestamped updates. That is why this site keeps a daily snapshot system and visible recency indicators.",
  },
];

type RecentListProps = {
  currentDate?: string;
  labels: {
    liveHub: string;
    history: string;
    recentCodes: string;
    viewAllHistory: string;
    active: string;
    expired: string;
  };
  locale: string;
};

function formatRecentDate(dateText: string, locale: string) {
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  const localeMap: Record<string, string> = { en: "en-US", zh: "zh-CN", ja: "ja-JP" };
  return date.toLocaleDateString(localeMap[locale] || "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function RecentCodesList({ currentDate, labels, locale }: RecentListProps) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg dark:border-indigo-900/40 dark:bg-slate-950">
      <div className="grid grid-cols-2 gap-2 p-4">
        <Link
          href="/the-forge-codes"
          className="rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-indigo-700"
        >
          {labels.liveHub}
        </Link>
        <Link
          href="/the-forge-codes-history"
          className="rounded-lg bg-violet-600 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-violet-700"
        >
          {labels.history}
        </Link>
      </div>

      <div className="px-4 pb-2">
        <h2 className="font-heading text-2xl text-slate-900 dark:text-slate-100">
          {labels.recentCodes}
        </h2>
      </div>

      <div className="border-t border-indigo-100 dark:border-indigo-900/50">
        {forgeRecentSnapshots.slice(0, 7).map((item) => (
          <Link
            key={item.date}
            href={`/the-forge-codes/${item.date}`}
            className={`block border-b border-indigo-50 px-4 py-3 text-sm transition-colors last:border-b-0 dark:border-indigo-900/30 ${
              currentDate === item.date
                ? "bg-indigo-50 font-semibold text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200"
                : "text-slate-700 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/10"
            }`}
          >
            <p>The Forge Codes ({formatRecentDate(item.date, locale)})</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.activeCodes.length}</span> {labels.active} |{" "}
              <span className="font-semibold text-red-500">{item.expiredCodes.length}</span> {labels.expired}
            </p>
          </Link>
        ))}
      </div>

      <div className="border-t border-indigo-100 px-4 py-3 dark:border-indigo-900/50">
        <Link
          href="/the-forge-codes-history"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {labels.viewAllHistory}
        </Link>
      </div>
    </aside>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-indigo-100 transition-colors open:bg-indigo-50/40 dark:border-indigo-900/40 dark:open:bg-indigo-900/10">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition-colors hover:text-indigo-700 dark:text-slate-100 dark:hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
        <h3 className="text-[0.95rem] leading-snug">{question}</h3>
        <ChevronDown className="h-4 w-4 shrink-0 text-indigo-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {answer}
        </p>
      </div>
    </details>
  );
}

export default async function HomeComponent() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex flex-col gap-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 shadow-md dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-800 dark:bg-slate-900/80 dark:text-indigo-300">
                <Flame className="h-3.5 w-3.5" />
                theforgecodes.app
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                The Forge Codes Homepage: Daily-Updated Strategy, Trends, and
                Redemption Guidance
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                This homepage is designed to rank for <strong className="text-slate-800 dark:text-slate-100">the forge codes</strong>{" "}
                and help users act fast. It combines keyword insights, redemption
                guidance, troubleshooting logic, and direct links to live and
                historical pages so visitors can find <strong className="text-slate-800 dark:text-slate-100">the forge codes</strong>{" "}
                they need without guessing where to start.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                If you only need the latest list, open the live hub first. If you
                want the full strategy behind <strong className="text-slate-800 dark:text-slate-100">the forge codes</strong>,
                keep reading this page. It was intentionally expanded to a
                long-form pillar so it can capture both quick-intent users and
                deep-research users from Google.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                <Image
                  src="/images/the-forge-roblox-official-artwork.jpg"
                  alt="The Forge Roblox game official artwork showing a blacksmith forging weapons with sparks and the game logo"
                  width={960}
                  height={540}
                  className="w-full object-cover"
                  priority
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/the-forge-codes"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero.openLiveHub")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
                <Link
                  href="/the-forge-codes-history"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                >
                  {t("hero.browseHistory")}
                  <ListChecks className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Keyword Signal Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keywordSignalCards.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border-l-4 border-l-indigo-500 border-t border-r border-b border-t-slate-100 border-r-slate-100 border-b-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800 dark:bg-slate-950"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 font-heading text-3xl text-indigo-600 dark:text-indigo-400">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.note}
                </p>
              </article>
            ))}
          </section>

          {/* Quick Active Preview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <Gift className="h-5 w-5 text-indigo-500" />
              {t("quickPreview.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t("quickPreview.description") }}>

            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {latestActivePreview.map((item) => (
                <div
                  key={item.code}
                  className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-800"
                >
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-emerald-500" />
                    <p className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {item.code}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {item.reward}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/the-forge-codes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {t("quickPreview.seeFullTables")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Operational Snapshot */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <CalendarClock className="h-5 w-5 text-indigo-500" />
              {t("snapshot.title")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.activeCodes")}
                </p>
                <p className="mt-1 font-heading text-3xl text-emerald-600 dark:text-emerald-400">
                  {forgeSiteFacts.activeCount}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.expiredTracked")}
                </p>
                <p className="mt-1 font-heading text-3xl text-red-500">
                  {forgeSiteFacts.expiredCount}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.latestSnapshot")}
                </p>
                <p className="mt-1 font-heading text-3xl text-indigo-600 dark:text-indigo-400">
                  {forgeSiteFacts.latestSnapshotDate}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.avgSearch")}
                </p>
                <p className="mt-1 font-heading text-3xl text-violet-600 dark:text-violet-400">
                  {forgeSiteFacts.monthlySearchEstimate}
                </p>
              </article>
            </div>
          </section>

          {/* SEO Content Sections */}
          {homepageSections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={section.id}
              className={`rounded-2xl border border-slate-100 p-6 shadow-sm dark:border-slate-800 ${
                sectionIndex % 2 === 0
                  ? "bg-white dark:bg-slate-950"
                  : "bg-slate-50/70 dark:bg-slate-900/50"
              }`}
            >
              <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl text-slate-900 dark:text-slate-100">
                {section.title}
              </h2>
              <div className="mt-5 space-y-5">
                {section.subsections.map((sub, si) => (
                  <div key={si}>
                    {sub.h3 && (
                      <h3 className="mb-3 text-lg font-bold text-indigo-700 dark:text-indigo-400">
                        {sub.h3}
                      </h3>
                    )}
                    {sub.paragraphs.map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="mt-3 text-[0.95rem] leading-relaxed text-slate-600 first:mt-0 dark:text-slate-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Crafting UI Preview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <Zap className="h-5 w-5 text-indigo-500" />
              {t("crafting.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("crafting.description")}
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <Image
                src="/images/the-forge-crafting-interface.webp"
                alt="The Forge crafting interface showing Knight Leggings item with masterwork percentage, materials, defense stats, and price"
                width={800}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <SearchCheck className="h-5 w-5 text-indigo-500" />
              {t("faq.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t("faq.description") }}>

            </p>
            <div className="mt-5 flex flex-col gap-3">
              {faqItems.map((item) => (
                <FaqAccordionItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-20">
          <RecentCodesList
            locale={locale}
            labels={{
              liveHub: t("sidebar.liveHub"),
              history: t("sidebar.history"),
              recentCodes: t("sidebar.recentCodes"),
              viewAllHistory: t("sidebar.viewAllHistory"),
              active: t("sidebar.active"),
              expired: t("sidebar.expired"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
