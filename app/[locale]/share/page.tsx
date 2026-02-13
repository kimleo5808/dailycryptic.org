import { BASE_URL, siteConfig } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  Brain,
  Copy,
  ExternalLink,
  Heart,
  Mail,
  Share2,
  Smartphone,
  Trophy,
} from "lucide-react";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Share",
    title: "Share Strands Hint",
    description:
      "Share Strands Hint with friends and family. Spread the love of word puzzles and brain challenges!",
    keywords: [
      "share",
      "social media",
      "word puzzles",
      "strands hint",
      "invite friends",
    ],
    locale: locale as Locale,
    path: `/share`,
    canonicalUrl: `/share`,
  });
}

const SOCIAL_LINKS = [
  {
    name: "Twitter",
    icon: "𝕏",
    href: `https://twitter.com/intent/tweet?text=Check%20out%20Strands%20Hint%20-%20Amazing%20word%20puzzles%20with%20daily%20hints!&url=${encodeURIComponent(BASE_URL)}`,
    className:
      "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
  },
  {
    name: "Facebook",
    icon: "f",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(BASE_URL)}`,
    className: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    name: "LinkedIn",
    icon: "in",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BASE_URL)}`,
    className: "bg-blue-700 text-white hover:bg-blue-800",
  },
  {
    name: "Reddit",
    icon: "r/",
    href: `https://www.reddit.com/submit?url=${encodeURIComponent(BASE_URL)}&title=Amazing%20Word%20Puzzle%20Games%20-%20Strands%20Hint`,
    className: "bg-orange-600 text-white hover:bg-orange-700",
  },
  {
    name: "WhatsApp",
    icon: "wa",
    href: `https://wa.me/?text=Check%20out%20this%20awesome%20word%20puzzle%20site:%20${encodeURIComponent(BASE_URL)}`,
    className: "bg-green-500 text-white hover:bg-green-600",
  },
];

const REASONS = [
  {
    icon: Brain,
    title: "Brain Training",
    description:
      "Help friends improve their vocabulary and cognitive skills through fun puzzles",
  },
  {
    icon: Trophy,
    title: "Friendly Competition",
    description:
      "Challenge each other and compare solving strategies and techniques",
  },
  {
    icon: Heart,
    title: "Completely Free",
    description: "Share unlimited entertainment with no cost or hidden fees",
  },
  {
    icon: Smartphone,
    title: "Play Anywhere",
    description:
      "Works perfectly on all devices — phones, tablets, and computers",
  },
];

export default async function SharePage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Share", url: `${BASE_URL}/share` },
        ])}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Share
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Share the Fun
          </h1>
          <p className="mt-2 text-muted-foreground">
            Love our word puzzles? Help us grow the community by sharing
            Strands Hint with your friends, family, and fellow puzzle
            enthusiasts!
          </p>
        </div>
      </header>

      {/* Social Share Buttons */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Share on Social Media
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${link.className}`}
            >
              <span className="font-bold">{link.icon}</span>
              Share on {link.name}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          ))}
        </div>
      </div>

      {/* Copy Link */}
      <div className="mt-6 rounded-xl border border-primary/20 bg-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Copy & Share Link
        </h2>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={siteConfig.url}
            className="flex-1 rounded-lg border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground dark:border-primary/20"
          />
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={undefined}
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
      </div>

      {/* Email Share */}
      <div className="mt-6 rounded-xl border border-primary/20 bg-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Share via Email
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send a personalized message to friends and family:
        </p>
        <a
          href={`mailto:?subject=Check%20out%20Strands%20Hint!&body=Hi!%20I%20found%20this%20amazing%20word%20puzzle%20website%20and%20thought%20you'd%20love%20it.%20They%20have%20daily%20Strands%20hints%20and%20word%20games%20with%204-11%20letter%20challenges!%0A%0ACheck%20it%20out:%20${encodeURIComponent(siteConfig.url)}%0A%0AHappy%20puzzling!`}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <Mail className="h-4 w-4" />
          Send Email
        </a>
      </div>

      {/* Why Share */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Why Share Strands Hint?
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="rounded-xl border border-primary/20 bg-card p-5"
            >
              <reason.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                {reason.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 rounded-xl border border-primary/20 bg-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Spread the Puzzle Love
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          When you share Strands Hint, you&apos;re helping:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "Friends discover new challenges — Introduce them to engaging brain teasers",
            "Build a community — Create a network of puzzle enthusiasts",
            "Support our mission — Help us reach more puzzle lovers worldwide",
            "Improve the games — More players means more feedback and better features",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-2xl bg-primary p-6 text-center text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">
          Thank You for Sharing!
        </h2>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Every share helps us reach more puzzle enthusiasts. We appreciate your
          support!
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <I18nLink
            href="/"
            prefetch={false}
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            Start Playing
          </I18nLink>
          <I18nLink
            href="/about"
            prefetch={false}
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Learn More About Us
          </I18nLink>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
