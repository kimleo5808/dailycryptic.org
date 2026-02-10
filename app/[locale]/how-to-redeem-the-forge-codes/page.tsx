import { forgeRedeemSteps, forgeTroubleshooting } from "@/lib/forge-data";
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
      <header className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 dark:border-orange-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          How to Redeem Codes in The Forge
        </h1>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          This guide answers both high-intent questions: how to redeem codes in
          the forge and where to put codes in the forge. Use this checklist
          before testing any the forge codes.
        </p>
      </header>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Step-by-step redeem flow
        </h2>
        <ol className="mt-4 space-y-4">
          {forgeRedeemSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-orange-100 p-4 dark:border-orange-900/50"
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
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-6 dark:border-orange-900/40 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Troubleshooting when the forge codes fail
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

