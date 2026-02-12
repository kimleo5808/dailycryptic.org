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
      "Contact Connections Hint - Get in touch with us for support, feedback, or questions about our word puzzle games.",
    keywords: [
      "contact",
      "support",
      "feedback",
      "connections hint",
      "customer service",
    ],
    locale: locale as Locale,
    path: `/contact`,
    canonicalUrl: `/contact`,
  });
}

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Support",
    description: "For general inquiries, technical support, or feedback:",
    email: "support@connectionshint.com",
  },
  {
    icon: Lightbulb,
    title: "Feature Requests",
    description: "Have an idea for a new game mode or feature?",
    email: "feedback@connectionshint.com",
  },
  {
    icon: Bug,
    title: "Bug Reports",
    description: "Found a bug or technical issue?",
    email: "bugs@connectionshint.com",
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
      <header className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 sm:p-8 dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Contact
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;d love to hear from you! Have a question, suggestion, or
            feedback about our word puzzle games? We&apos;re here to help.
          </p>
        </div>
      </header>

      {/* Contact Methods */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CONTACT_METHODS.map((method) => (
          <div
            key={method.title}
            className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40"
          >
            <method.icon className="h-8 w-8 text-blue-500" />
            <h2 className="mt-3 font-heading text-lg font-bold text-foreground">
              {method.title}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {method.description}
            </p>
            <a
              href={`mailto:${method.email}`}
              className="mt-3 inline-block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {method.email}
            </a>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="mt-8 rounded-xl border border-blue-100 bg-card p-6 dark:border-blue-900/40">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Send Us a Message
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can also reach out to us directly using the form below:
        </p>
        <form className="mt-5 space-y-4" action="#" method="POST">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-blue-200 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-blue-900/60"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-blue-200 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-blue-900/60"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="w-full rounded-lg border border-blue-200 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-blue-900/60"
            >
              <option value="">Select a topic</option>
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="Please describe your inquiry in detail..."
              className="w-full rounded-lg border border-blue-200 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-blue-900/60"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Quick Help */}
      <div className="mt-8 rounded-xl border border-blue-100 bg-card p-6 dark:border-blue-900/40">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Quick Help
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Before reaching out, you might find answers in our resources:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <I18nLink
            href="/how-to-play-connections"
            prefetch={false}
            className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20"
          >
            <h3 className="font-heading text-sm font-bold text-foreground">
              How to Play
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Learn the rules and strategies
            </p>
          </I18nLink>
          <I18nLink
            href="/connections-hint-faq"
            prefetch={false}
            className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20"
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
      <div className="mt-8 rounded-xl border border-blue-100 bg-card p-6 dark:border-blue-900/40">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Response Time
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We strive to respond to all inquiries within 24-48 hours during
          business days. For urgent technical issues affecting gameplay, we aim
          to respond even faster.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          When contacting us about technical issues, please include:
        </p>
        <ul className="mt-2 space-y-1.5">
          {[
            "Your device type and operating system",
            "Browser name and version",
            "Steps to reproduce the issue",
            "Any error messages you encountered",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
