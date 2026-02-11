import {
  activeForgeCodes,
  expiredForgeCodes,
  forgeEditorialGuide,
  FAQItem,
  forgeFaq,
  forgeKeywordNarrative,
  forgeOperationsManual,
  forgeRecentSnapshots,
  forgeRedeemSteps,
  forgeSiteFacts,
  forgeTroubleshooting,
  forgeUpdateLog,
  ForgeCode,
  UpdateLogItem,
} from "@/lib/forge-data";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleX,
  Flame,
  Gift,
  Hammer,
  History,
  SearchCheck,
} from "lucide-react";
import Link from "next/link";

type CodeTableProps = {
  title: string;
  description: string;
  codes: ForgeCode[];
};

function CodeTable({ title, description, codes }: CodeTableProps) {
  return (
    <section className="w-full rounded-2xl border border-orange-100 bg-white p-6 shadow-sm dark:border-orange-900/40 dark:bg-slate-950">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-orange-100 dark:border-orange-900/40">
              <th className="px-3 py-3 font-semibold">Code</th>
              <th className="px-3 py-3 font-semibold">Reward</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Last tested</th>
              <th className="px-3 py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((item) => (
              <tr
                key={item.code}
                className="border-b border-orange-50 last:border-none dark:border-orange-950"
              >
                <td className="px-3 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {item.code}
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                  {item.reward}
                  {item.note && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.note}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                    }`}
                  >
                    {item.status === "active" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <CircleX className="h-3.5 w-3.5" />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                  {item.lastTested}
                </td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                  {item.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function eventBadge(event: UpdateLogItem["event"]) {
  if (event === "added") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  }
  if (event === "expired") {
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
  }
  return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
}

function eventLabel(event: UpdateLogItem["event"]) {
  if (event === "added") return "Added";
  if (event === "expired") return "Expired";
  return "Retested";
}

function FAQBlock({ items }: { items: FAQItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.question}
          className="rounded-xl border border-orange-100 bg-white p-5 dark:border-orange-900/40 dark:bg-slate-950"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {item.question}
          </h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{item.answer}</p>
        </article>
      ))}
    </div>
  );
}

export function ForgeHero() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl rounded-3xl border border-orange-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-6 py-12 shadow-sm dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-white/80 px-3 py-1 dark:border-orange-800 dark:bg-slate-900/80">
            <Flame className="h-3.5 w-3.5" />
            theforgecodes.app
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-white/80 px-3 py-1 dark:border-orange-800 dark:bg-slate-900/80">
            <CalendarClock className="h-3.5 w-3.5" />
            Last verified: {forgeSiteFacts.lastVerified}
          </span>
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          The Forge Codes: Active, Expired, and Daily Auto-Collected Updates
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
          This is a live answer page for <strong>the forge codes</strong>. We
          auto-collect <strong>the forge codes</strong> from public sources
          every day, split active and expired status, and publish transparent
          logs so you can redeem faster with fewer failed attempts.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-orange-200 bg-white/90 p-4 dark:border-orange-900/40 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active codes
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {forgeSiteFacts.activeCount}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-white/90 p-4 dark:border-orange-900/40 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Expired tracked
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {forgeSiteFacts.expiredCount}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-white/90 p-4 dark:border-orange-900/40 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Related keywords
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {forgeSiteFacts.trackedKeywords}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-white/90 p-4 dark:border-orange-900/40 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Avg monthly volume
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {forgeSiteFacts.monthlySearchEstimate}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#active-forge-codes"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-orange-500 dark:text-slate-950 dark:hover:bg-orange-400"
          >
            View active the forge codes
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/how-to-redeem-the-forge-codes"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-orange-100 dark:border-orange-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            How to redeem codes in the forge
            <Hammer className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Codes are automatically aggregated from public sources and may expire
          quickly. Always verify in-game before relying on rewards.
        </p>
      </div>
    </section>
  );
}

export function ForgeOverviewSections() {
  return (
    <div className="w-full space-y-8">
      <div id="active-forge-codes">
        <CodeTable
          title="Active The Forge Codes"
          description="These are the current the forge working codes. Each row shows reward, status, and last tested timestamp."
          codes={activeForgeCodes}
        />
      </div>

      <CodeTable
        title="Expired The Forge Codes"
        description="We keep expired the forge codes visible so users do not waste time retrying old codes for the forge."
        codes={expiredForgeCodes}
      />
    </div>
  );
}

export function ForgeRedeemAndTroubleshoot() {
  return (
    <section className="grid w-full gap-8 lg:grid-cols-2">
      <article className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Gift className="h-5 w-5 text-orange-500" />
          How to redeem codes in the forge
        </h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          If you search where to put codes in the forge, use this exact flow.
          It works for the forge roblox codes on both desktop and mobile.
        </p>
        <ol className="mt-5 space-y-3">
          {forgeRedeemSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-900/50 dark:bg-slate-900"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {index + 1}. {step.title}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </article>

      <article className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          Why the forge codes are not working
        </h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          Most users searching the forge codes not working can fix the issue in
          under a minute with this checklist.
        </p>
        <div className="mt-5 grid gap-3">
          {forgeTroubleshooting.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {item.question}
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export function ForgeUpdateLogAndFaq() {
  return (
    <section className="grid w-full gap-8 lg:grid-cols-2">
      <article className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <History className="h-5 w-5 text-orange-500" />
          The Forge Codes Update Log
        </h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          Each event below documents how codes moved between active and expired
          based on automated source refreshes.
        </p>
        <div className="mt-5 space-y-3">
          {forgeUpdateLog.map((item) => (
            <div
              key={`${item.time}-${item.code}`}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.time}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${eventBadge(
                    item.event
                  )}`}
                >
                  {eventLabel(item.event)}
                </span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  {item.code}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <SearchCheck className="h-5 w-5 text-orange-500" />
          The Forge Codes FAQ
        </h2>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          This FAQ covers the most searched questions around the forge codes
          roblox, redeem flow, and expiration behavior.
        </p>
        <div className="mt-5">
          <FAQBlock items={forgeFaq} />
        </div>
      </article>
    </section>
  );
}

export function ForgeKeywordNarrativeSection() {
  return (
    <section className="w-full rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        The Forge Codes SEO and Content Intelligence
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This narrative block is intentionally detailed. It targets head term
        demand for the forge codes while naturally covering related intent
        phrases like the forge codes roblox, codes for the forge, and new codes
        for the forge.
      </p>
      <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
        {forgeKeywordNarrative.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function ForgeEditorialGuideSection() {
  return (
    <section className="w-full rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        The Forge Codes Daily Strategy Guide
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This long-form section explains how to interpret the forge codes feed,
        how to avoid false positives, and how to use daily snapshots for better
        decisions. It is intentionally comprehensive so this page works as a
        reference hub, not only a short code list.
      </p>
      <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
        {forgeEditorialGuide.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function ForgeOperationsManualSection() {
  return (
    <section className="w-full rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        The Forge Codes Content Operations Manual
      </h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This section documents the operating model behind the page so returning
        users can understand how the list evolves across days and why some
        entries move quickly between states.
      </p>
      <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
        {forgeOperationsManual.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

type ForgeDailySnapshotArchiveProps = {
  currentDate?: string;
};

function formatRecentDate(dateText: string) {
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ForgeDailySnapshotArchive({
  currentDate,
}: ForgeDailySnapshotArchiveProps) {
  return (
    <aside className="rounded-xl border border-orange-200/70 bg-white p-4 shadow-sm dark:border-orange-900/40 dark:bg-slate-950">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/the-forge-codes"
          className="rounded-md bg-slate-900 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"
        >
          Latest
        </Link>
        <Link
          href="/the-forge-codes-history"
          className="rounded-md bg-slate-900 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"
        >
          History
        </Link>
      </div>

      <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-slate-100">
        Recent Codes
      </h2>

      <div className="mt-3 overflow-hidden rounded-lg border border-orange-100 dark:border-orange-900/50">
        {forgeRecentSnapshots.slice(0, 30).map((item) => (
          <Link
            key={item.date}
            href={`/the-forge-codes/${item.date}`}
            className={`block border-b border-orange-100 px-3 py-3 text-sm transition last:border-b-0 dark:border-orange-900/50 ${
              currentDate === item.date
                ? "bg-orange-100/70 font-semibold text-slate-900 dark:bg-orange-900/30 dark:text-slate-100"
                : "text-slate-700 hover:bg-orange-50 dark:text-slate-300 dark:hover:bg-orange-900/10"
            }`}
          >
            <p>
              The Forge Codes ({formatRecentDate(item.date)})
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.activeCodes.length} active · {item.expiredCodes.length} expired
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Latest snapshot date: {forgeSiteFacts.latestSnapshotDate}
      </p>
    </aside>
  );
}
