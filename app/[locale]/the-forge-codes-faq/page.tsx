import { forgeFaq, forgeTroubleshooting } from "@/lib/forge-data";
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
    page: "FAQ",
    title: "The Forge Codes FAQ: Why Codes Fail and How to Fix",
    description:
      "Common questions about the forge codes roblox, including failed redemptions, expiration behavior, and redeem troubleshooting.",
    locale: locale as Locale,
    path: "/the-forge-codes-faq",
    canonicalUrl: "/the-forge-codes-faq",
  });
}

export default function ForgeFaqPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes FAQ
        </h1>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          This FAQ is built for the forge codes search intent. It answers why
          codes fail, how expiration works, and what to do before retrying.
        </p>
      </header>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Core FAQ
        </h2>
        <div className="mt-4 grid gap-3">
          {forgeFaq.map((item) => (
            <article
              key={item.question}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {item.question}
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Fast failure checklist
        </h2>
        <ul className="mt-4 grid gap-3">
          {forgeTroubleshooting.map((item) => (
            <li
              key={item.question}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {item.question}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

