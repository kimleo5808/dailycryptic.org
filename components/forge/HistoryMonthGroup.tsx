"use client";

import { ChevronDown, ChevronUp, CircleDot, CircleX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type SnapshotCard = {
  date: string;
  activeCount: number;
  expiredCount: number;
};

type HistoryLabels = {
  snapshotCount: string;
  snapshotsCount: string;
  latest: string;
  active: string;
  expired: string;
  viewDetails: string;
  showMore: string;
  showLess: string;
};

type Props = {
  monthLabel: string;
  snapshots: SnapshotCard[];
  latestDate: string;
  defaultOpen?: boolean;
  labels?: HistoryLabels;
  locale?: string;
};

const VISIBLE_COUNT = 6;

function formatCardDate(dateStr: string, locale?: string) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const localeMap: Record<string, string> = { en: "en-US", zh: "zh-CN", ja: "ja-JP" };
  return d.toLocaleDateString(localeMap[locale ?? "en"] || "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const defaultLabels: HistoryLabels = {
  snapshotCount: "{count} snapshot",
  snapshotsCount: "{count} snapshots",
  latest: "Latest",
  active: "active",
  expired: "expired",
  viewDetails: "View Details →",
  showMore: "Show More",
  showLess: "Show Less",
};

export default function HistoryMonthGroup({
  monthLabel,
  snapshots,
  latestDate,
  defaultOpen = false,
  labels = defaultLabels,
  locale,
}: Props) {
  const [sectionOpen, setSectionOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(false);

  const hasMore = snapshots.length > VISIBLE_COUNT;
  const visibleSnapshots = expanded ? snapshots : snapshots.slice(0, VISIBLE_COUNT);

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white shadow-sm dark:border-indigo-900/40 dark:bg-slate-950">
      {/* Month header — always visible, toggles open/close */}
      <button
        type="button"
        onClick={() => setSectionOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20"
      >
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
            {monthLabel}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {(snapshots.length !== 1 ? labels.snapshotsCount : labels.snapshotCount).replace("{count}", String(snapshots.length))}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-indigo-400 transition-transform duration-200 ${sectionOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Card grid — conditionally rendered */}
      {sectionOpen && (
        <div className="px-6 pb-6">
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSnapshots.map((snap) => {
                const isLatest = snap.date === latestDate;
                return (
                  <Link
                    key={snap.date}
                    href={`/the-forge-codes/${snap.date}`}
                    className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-indigo-900/50 dark:bg-slate-900/50 dark:hover:border-indigo-700"
                  >
                    {/* Date + Latest badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading text-base font-bold text-slate-900 dark:text-slate-100">
                          {formatCardDate(snap.date, locale)}
                        </p>
                        {isLatest && (
                          <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            {labels.latest}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-3 flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-sm">
                          <CircleDot className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {snap.activeCount}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {labels.active}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-sm">
                          <CircleX className="h-3.5 w-3.5 text-red-400" />
                          <span className="font-semibold text-red-500">
                            {snap.expiredCount}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {labels.expired}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-4 flex items-center justify-between border-t border-indigo-50 pt-3 dark:border-indigo-900/40">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {snap.date}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-800 dark:text-indigo-400 dark:group-hover:text-indigo-300">
                        {labels.viewDetails}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Fade overlay when collapsed and has more */}
            {hasMore && !expanded && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
            )}
          </div>

          {/* Show More / Show Less */}
          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-white px-6 py-2.5 text-sm font-semibold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
              >
                {expanded ? (
                  <>
                    {labels.showLess} <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {labels.showMore} <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
