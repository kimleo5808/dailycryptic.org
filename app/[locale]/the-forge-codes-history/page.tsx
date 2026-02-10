import { expiredForgeCodes, forgeUpdateLog } from "@/lib/forge-data";
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
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes History
        </h1>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          This archive keeps expired the forge codes visible for transparency.
          Keeping historical status helps users avoid retry loops and supports
          trust for long-term tracking.
        </p>
      </header>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Historical change timeline
        </h2>
        <ul className="mt-4 space-y-3">
          {forgeUpdateLog.map((item) => (
            <li
              key={`${item.time}-${item.code}`}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.time}
              </p>
              <p className="mt-1 font-mono font-semibold text-slate-900 dark:text-slate-100">
                {item.code}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Expired codes archive
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-orange-100 dark:border-orange-900/40">
                <th className="px-3 py-3 font-semibold">Code</th>
                <th className="px-3 py-3 font-semibold">Last tested</th>
                <th className="px-3 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {expiredForgeCodes.map((item) => (
                <tr
                  key={item.code}
                  className="border-b border-orange-50 last:border-none dark:border-orange-950"
                >
                  <td className="px-3 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {item.code}
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
    </div>
  );
}

