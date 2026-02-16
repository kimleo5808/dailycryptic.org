import { BASE_URL } from "@/config/site";
import { getGuideBySlug, GUIDE_SLUGS, GUIDES } from "@/data/guides";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ArrowLeft, BookOpen, Clock, GraduationCap } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return constructMetadata({
    page: "Guide",
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords,
    locale: locale as Locale,
    path: `/guides/${slug}`,
    canonicalUrl: `/guides/${slug}`,
  });
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Guides", url: `${BASE_URL}/guides` },
          { name: guide.title, url: `${BASE_URL}/guides/${slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: guide.metaTitle,
          description: guide.description,
          image: `${BASE_URL}/og.png`,
          author: {
            "@type": "Organization",
            name: "dailycryptic",
            url: BASE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "dailycryptic",
            logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
          },
          datePublished: "2025-01-10",
          dateModified: "2025-01-10",
          learningResourceType: "Tutorial",
          educationalLevel:
            guide.level === "beginner"
              ? "Beginner"
              : guide.level === "advanced"
                ? "Advanced"
                : "Intermediate",
          inLanguage: "en-US",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/guides/${slug}`,
          },
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <I18nLink
          href="/guides"
          prefetch={false}
          className="flex items-center gap-1 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Guides
        </I18nLink>
        <span>/</span>
        <span className="text-foreground">{guide.title}</span>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Guide
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {guide.icon} {guide.title}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {guide.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              {guide.levelLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {guide.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="mt-6 rounded-xl border border-primary/20 bg-card p-5 dark:border-primary/40">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          In This Guide
        </h2>
        <ul className="mt-3 space-y-1.5">
          {guide.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Sections */}
      <div className="mt-8 space-y-10">
        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {section.content}
            </p>

            {section.subsections && (
              <div className="mt-5 space-y-4">
                {section.subsections.map((sub, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-primary/20 bg-card p-5 dark:border-primary/30"
                  >
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {sub.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {sub.content}
                    </p>
                    {sub.items && (
                      <ul className="mt-3 space-y-1.5">
                        {sub.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related Guides */}
      <div className="mt-12 border-t border-primary/20 pt-8 dark:border-primary/40">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Related Guides
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {relatedGuides.map((g) => (
            <I18nLink
              key={g.slug}
              href={`/guides/${g.slug}`}
              prefetch={false}
              className="group rounded-xl border border-primary/20 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-primary/40 dark:hover:border-primary/60"
            >
              <div className="text-2xl">{g.icon}</div>
              <h3 className="mt-2 font-heading text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary">
                {g.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {g.description}
              </p>
            </I18nLink>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-primary-foreground">
        <h2 className="font-heading text-xl font-bold">
          Ready to practice?
        </h2>
        <p className="mt-1 text-sm opacity-90">
          Apply these strategies to today&apos;s puzzle!
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <I18nLink
            href="/minute-cryptic-today"
            prefetch={false}
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-white/90"
          >
            Today&apos;s Clue
          </I18nLink>
          <I18nLink
            href="/guides"
            prefetch={false}
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            All Guides
          </I18nLink>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const slug of GUIDE_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}
