import { forgeRedeemSteps, forgeTroubleshooting } from "@/lib/forge-data";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { ChevronDown } from "lucide-react";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "RedeemGuide",
    title: "How to Redeem Codes in The Forge (2026 Guide)",
    description:
      "Step-by-step guide for how to redeem codes in the forge and where to put codes in the forge across Roblox devices.",
    locale: locale as Locale,
    path: "/how-to-redeem-the-forge-codes",
    canonicalUrl: "/how-to-redeem-the-forge-codes",
  });
}

export default function RedeemGuidePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          How to Redeem Codes in The Forge
        </h1>
        <p className="relative mt-4 text-slate-700 dark:text-slate-300">
          This guide answers both high-intent questions: how to redeem codes in
          the forge and where to put codes in the forge. Use this checklist
          before testing any the forge codes.
        </p>
      </header>

      {/* Step-by-step redeem flow */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Step-by-step redeem flow
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {forgeRedeemSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-indigo-100 p-4 dark:border-indigo-900/50"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-heading text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {step.detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Troubleshooting accordion */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Troubleshooting when the forge codes fail
        </h2>
        <div className="mt-6 space-y-3">
          {forgeTroubleshooting.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-indigo-100 dark:border-indigo-900/50"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-indigo-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-indigo-50 px-4 py-3 text-sm text-slate-600 dark:border-indigo-900/30 dark:text-slate-300">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
