import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return constructMetadata({
    page: "FAQ",
    title: t("title"),
    description: t("description"),
    keywords: [
      "minute cryptic faq",
      "daily cryptic faq",
      "daily cryptic",
      "daily cryptic questions",
      "cryptic clue help",
      "how minute cryptic works",
      "dailycryptic faq",
    ],
    locale: locale as Locale,
    path: `/minute-cryptic-faq`,
    canonicalUrl: `/minute-cryptic-faq`,
  });
}

const FAQ_ITEMS = [
  {
    question: "What is minute cryptic?",
    answer:
      "Minute cryptic is a daily cryptic one-clue puzzle format. You get one clue, an answer length, and optional progressive hints.",
  },
  {
    question: "How often is a new daily cryptic clue published?",
    answer:
      "A new clue is published every day on dailycryptic. The archive keeps previous clues for practice.",
  },
  {
    question: "How do hints work?",
    answer:
      "Hints are progressive. You can reveal one level at a time, starting broad and ending with direct letter guidance.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. You can solve the daily clue and browse the archive without creating an account.",
  },
  {
    question: "Is dailycryptic free?",
    answer:
      "Yes. The core experience is free, including the daily clue, answer checking, and archive access.",
  },
  {
    question: "What clue types appear?",
    answer:
      "You will see common cryptic clue types such as anagram, charade, container, reversal, hidden word, and double definition.",
  },
  {
    question: "How are answers checked?",
    answer:
      "Answer checking is exact-match and not case-sensitive. Use the clue's letter count to avoid near misses.",
  },
  {
    question: "Can I review old clues and explanations?",
    answer:
      "Yes. Each archived clue includes the answer, hint levels, and a breakdown of the clue mechanism.",
  },
];

export default async function FAQPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "FAQ", url: `${BASE_URL}/minute-cryptic-faq` },
        ])}
      />
      <JsonLd
        data={faqPageSchema(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        )}
      />

      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Minute Cryptic FAQ
          </h1>
          <p className="mt-2 text-muted-foreground">
            Quick answers about solving, hints, and daily cryptic puzzle rules.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group rounded-xl border border-primary/20 bg-card transition-colors open:bg-primary/5 dark:border-primary/40 dark:open:bg-primary/10"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:text-primary dark:hover:text-primary [&::-webkit-details-marker]:hidden">
              <h2 className="text-[0.95rem] leading-snug">{item.question}</h2>
              <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">Need more help?</h2>
        <p className="mt-1 text-sm opacity-90">
          Read the solving guide or go straight to today&apos;s clue.
        </p>
        <div className="mt-5 grid gap-3 text-left sm:grid-cols-3">
          <Link
            href="/cryptic-crossword-for-beginners"
            className="rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"
          >
            <h3 className="text-sm font-bold">Cryptic crossword for beginners</h3>
            <p className="mt-2 text-sm text-white/85">
              Use the start-here guide if you want a simpler learning route.
            </p>
          </Link>
          <Link
            href="/cryptic-clue-types"
            className="rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"
          >
            <h3 className="text-sm font-bold">Cryptic clue types</h3>
            <p className="mt-2 text-sm text-white/85">
              Learn how anagram, charade, container, and double definition clues differ.
            </p>
          </Link>
          <Link
            href="/minute-cryptic/easy"
            className="rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"
          >
            <h3 className="text-sm font-bold">Easy cryptic clues</h3>
            <p className="mt-2 text-sm text-white/85">
              Move from answers and questions into beginner-friendly practice.
            </p>
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/how-to-play-minute-cryptic"
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            How to Solve Cryptic Clues
          </Link>
          <Link
            href="/minute-cryptic-today"
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Minute Cryptic Answer Today
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
