import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, howToSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Lightbulb,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "HowToPlay" });

  return constructMetadata({
    page: "HowToPlay",
    title: t("title"),
    description: t("description"),
    keywords: [
      "how to solve minute cryptic",
      "minute cryptic guide",
      "cryptic clue rules",
      "cryptic clue strategy",
      "dailycryptic help",
    ],
    locale: locale as Locale,
    path: `/how-to-play-minute-cryptic`,
    canonicalUrl: `/how-to-play-minute-cryptic`,
  });
}

const KEY_CONCEPTS = [
  {
    title: "Definition",
    label: "Meaning side",
    description:
      "Every cryptic clue has a straight definition, usually at the start or end of the clue.",
  },
  {
    title: "Wordplay",
    label: "Construction side",
    description:
      "The other part tells you how to build the answer using operations like anagram, reversal, or container.",
  },
  {
    title: "Enumeration",
    label: "Answer length",
    description:
      "The answer length is your strongest check. Use it early to reject weak guesses.",
  },
];

const STRATEGIES = [
  {
    icon: Search,
    title: "Locate the definition first",
    description:
      "Test the beginning and end of the clue first. One side should read as a direct meaning of the answer.",
  },
  {
    icon: Target,
    title: "Identify indicators",
    description:
      "Words like 'mixed', 'inside', 'back', or 'about' often signal specific clue mechanisms.",
  },
  {
    icon: Brain,
    title: "Split clue into chunks",
    description:
      "Break the clue into small units and map each unit to a likely wordplay action.",
  },
  {
    icon: Lightbulb,
    title: "Use crossing logic mentally",
    description:
      "Even in a single-clue format, lock in confirmed letters and check each candidate against enumeration.",
  },
  {
    icon: CheckCircle2,
    title: "Verify both sides",
    description:
      "A valid answer must satisfy both the definition and the wordplay. If one side fails, it is not solved yet.",
  },
];

export default async function HowToPlayPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "How to Solve",
            url: `${BASE_URL}/how-to-play-minute-cryptic`,
          },
        ])}
      />
      <JsonLd
        data={howToSchema(
          "How to Solve Minute Cryptic",
          "Learn a practical workflow for solving a daily minute cryptic clue with confidence.",
          [
            {
              name: "Find the definition",
              text: "Check the start and end of the clue. One side should define the final answer directly.",
            },
            {
              name: "Mark indicator words",
              text: "Spot words that suggest operations like anagram, reversal, deletion, insertion, or charade.",
            },
            {
              name: "Build candidate answers",
              text: "Apply the wordplay operation and generate one or more candidates.",
            },
            {
              name: "Check enumeration",
              text: "Filter candidates by the required letter count.",
            },
            {
              name: "Confirm with definition",
              text: "Keep only the candidate that matches both definition and wordplay exactly.",
            },
            {
              name: "Use hints only when needed",
              text: "Reveal progressive hints in order if you are blocked, then return to independent solving.",
            },
          ]
        )}
      />

      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Guide</span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            How to Solve Minute Cryptic
          </h1>
          <p className="mt-2 text-muted-foreground">
            Learn the core pattern behind cryptic clues and solve faster with a
            repeatable method.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Core Concepts
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-1">
            {KEY_CONCEPTS.map((concept) => (
              <div key={concept.title} className="rounded-xl border border-border p-4">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {concept.title} - {concept.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Solving Workflow
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>1. Pick the likely definition side.</li>
            <li>2. Tag potential indicator words.</li>
            <li>3. Build candidate answers from wordplay.</li>
            <li>4. Filter by answer length.</li>
            <li>5. Validate with both definition and structure.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Strategies and Tips
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {STRATEGIES.map((strategy) => (
              <div
                key={strategy.title}
                className="rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <strategy.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {strategy.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground sm:p-8">
          <h2 className="font-heading text-2xl font-bold">Ready to solve?</h2>
          <p className="mt-2 opacity-90">
            Open today&apos;s clue or browse the archive.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/minute-cryptic-today"
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-white/90"
            >
              Today&apos;s Clue
            </Link>
            <Link
              href="/minute-cryptic"
              className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Browse Archive
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
