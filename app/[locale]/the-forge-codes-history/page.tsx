import { forgeDailySnapshots } from "@/lib/forge-data";
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
    page: "History",
    title: "The Forge Codes History: Expired Archive and Change Timeline",
    description:
      "Browse archived the forge codes with status history, last tested timestamps, and transparent update timelines.",
    locale: locale as Locale,
    path: "/the-forge-codes-history",
    canonicalUrl: "/the-forge-codes-history",
  });
}

export default function ForgeHistoryPage() {
  const historyLog = [...forgeDailySnapshots]
    .reverse()
    .flatMap((snapshot) => snapshot.updateLog)
    .slice(0, 80);
  const expiredMap = new Map<
    string,
    (typeof forgeDailySnapshots)[number]["expiredCodes"][number]
  >();

  for (const snapshot of forgeDailySnapshots) {
    for (const code of snapshot.expiredCodes) {
      expiredMap.set(code.code, code);
    }
  }

  const expiredArchive = [...expiredMap.values()].sort((a, b) =>
    b.lastTested.localeCompare(a.lastTested)
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes History
        </h1>
        <p className="relative mt-4 text-slate-700 dark:text-slate-300">
          This archive keeps expired the forge codes visible for transparency.
          Keeping historical status helps users avoid retry loops and supports
          trust for long-term tracking.
        </p>
      </header>

      {/* Historical change timeline */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Historical change timeline
        </h2>
        <div className="relative mt-6 ml-4 border-l-2 border-indigo-200 pl-6 dark:border-indigo-800">
          {historyLog.map((item, index) => (
            <div
              key={`${item.time}-${item.code}-${index}`}
              className="relative pb-6 last:pb-0"
            >
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-indigo-400 bg-white dark:border-indigo-500 dark:bg-slate-950" />
              <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                {item.time}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {item.code}
              </p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Expired codes archive table */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Expired codes archive
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                <th className="px-3 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Code
                </th>
                <th className="px-3 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Last tested
                </th>
                <th className="px-3 py-3 font-heading text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {expiredArchive.map((item) => (
                <tr
                  key={item.code}
                  className="border-b border-indigo-50 last:border-none dark:border-indigo-950"
                >
                  <td className="px-3 py-3 font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                    {item.code}
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                    {item.lastTested}
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
