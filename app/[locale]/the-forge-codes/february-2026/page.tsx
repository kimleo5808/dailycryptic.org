import {
  activeForgeCodes,
  expiredForgeCodes,
  forgeUpdateLog,
} from "@/lib/forge-data";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Month",
    title: "The Forge Codes February 2026: New, Active, and Expired",
    description:
      "Track The Forge codes February 2026 updates with active and expired status, timestamped verification, and change logs.",
    locale: locale as Locale,
    path: "/the-forge-codes/february-2026",
    canonicalUrl: "/the-forge-codes/february-2026",
  });
}

export default function February2026Page() {
  const februaryEvents = forgeUpdateLog.filter((item) =>
    item.time.startsWith("2026-02")
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <p className="text-xs uppercase tracking-[0.16em] text-orange-700 dark:text-orange-300">
          Monthly archive
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes February 2026
        </h1>
        <p className="mt-4 max-w-3xl text-slate-700 dark:text-slate-300">
          This page tracks monthly changes for the forge codes 2026 cycle. Use
          it when you specifically search new codes for the forge in February
          and want a clean monthly view.
        </p>
      </header>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Active The Forge Codes (February 2026)
        </h2>
        <ul className="mt-4 grid gap-3">
          {activeForgeCodes.map((item) => (
            <li
              key={item.code}
              className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-900/20"
            >
              <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {item.code}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Reward: {item.reward} | Last tested: {item.lastTested}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Expired The Forge Codes (February 2026 checks)
        </h2>
        <ul className="mt-4 grid gap-3">
          {expiredForgeCodes.slice(0, 6).map((item) => (
            <li
              key={item.code}
              className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-900/20"
            >
              <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {item.code}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Last tested: {item.lastTested} | Source: {item.source}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          February Change Log
        </h2>
        <ul className="mt-4 space-y-3">
          {februaryEvents.map((item) => (
            <li
              key={`${item.time}-${item.code}`}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.time}
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {item.code}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

