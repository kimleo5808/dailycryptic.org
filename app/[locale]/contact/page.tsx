import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Bug, Lightbulb, Mail, MessageSquare } from "lucide-react";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Contact",
    title: "Contact Us",
    description:
      "Contact dailycryptic for minute cryptic support, clue corrections, and technical help.",
    keywords: [
      "contact",
      "minute cryptic support",
      "clue correction",
      "bug report",
      "minute cryptic",
      "dailycryptic contact",
    ],
    locale: locale as Locale,
    path: `/contact`,
    canonicalUrl: `/contact`,
  });
}

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "General Support",
    description: "Questions about daily clues, archive pages, or site usage.",
    email: "hello@dailycryptic.org",
  },
  {
    icon: Lightbulb,
    title: "Puzzle Corrections",
    description: "Report clue, hint, or explanation issues with puzzle date.",
    email: "hello@dailycryptic.org",
  },
  {
    icon: Bug,
    title: "Technical Issues",
    description: "Report loading, display, or answer-check problems.",
    email: "hello@dailycryptic.org",
  },
];

export default async function ContactPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Contact", url: `${BASE_URL}/contact` },
        ])}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Contact
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-muted-foreground">
            Contact us about minute cryptic clues, corrections, or technical
            issues. Email is the fastest way to reach us.
          </p>
        </div>
      </header>

      {/* Contact Methods */}
      <section className="mt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Contact Channels
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the same email address and include a clear subject line.
        </p>
      </section>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CONTACT_METHODS.map((method) => (
          <div
            key={method.title}
            className="rounded-xl border border-primary/20 bg-card p-5 dark:border-primary/40"
          >
            <method.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
              {method.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {method.description}
            </p>
            <a
              href={`mailto:${method.email}`}
              className="mt-3 inline-block text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {method.email}
            </a>
          </div>
        ))}
      </div>

      {/* Email Guidance */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6 dark:border-primary/40">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Email Guidance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          For fastest handling, send your message to{" "}
          <a
            href="mailto:hello@dailycryptic.org"
            className="font-medium text-primary hover:text-primary/80"
          >
            hello@dailycryptic.org
          </a>
          .
        </p>
        <h3 className="mt-5 font-heading text-base font-bold text-foreground">
          Include These Details
        </h3>
        <ul className="mt-2 space-y-1.5">
          {[
            "Puzzle date (if relevant)",
            "Short summary of the issue",
            "Expected result vs actual result",
            "Screenshot or error message (for technical bugs)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Help */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6 dark:border-primary/40">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Quick Help
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Before reaching out, you might find answers in our resources:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <I18nLink
            href="/how-to-play-minute-cryptic"
            prefetch={false}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/5 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20"
          >
            <h3 className="font-heading text-sm font-bold text-foreground">
              How to Play
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Learn the rules and strategies
            </p>
          </I18nLink>
          <I18nLink
            href="/minute-cryptic-faq"
            prefetch={false}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/5 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/20"
          >
            <h3 className="font-heading text-sm font-bold text-foreground">
              FAQ
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Frequently asked questions
            </p>
          </I18nLink>
        </div>
      </div>

      {/* Response Time */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6 dark:border-primary/40">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Response Time
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We usually respond within 1-2 business days.
        </p>
        <h3 className="mt-4 font-heading text-base font-bold text-foreground">
          Subject Line Suggestions
        </h3>
        <ul className="mt-2 space-y-1.5">
          {["General Inquiry", "Correction - YYYY-MM-DD", "Bug Report"].map(
            (item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
