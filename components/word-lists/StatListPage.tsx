import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  SimpleFaq,
} from "@/components/minute-cryptic-content/ContentBlocks";
import WordListTable from "@/components/word-lists/WordListTable";
import { BASE_URL } from "@/config/site";
import {
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import { getStatListData, STAT_LISTS } from "@/lib/word-stat-lists";

/**
 * One 5-letter "stat list" page: a pattern-filtered word list (no vowels,
 * double letters, Q without U, …) with its own evergreen copy.
 */
export default function StatListPage({ slug }: { slug: string }) {
  const data = getStatListData(slug);
  if (!data) notFound();

  const { def } = data;
  const path = `/5-letter-words/${def.slug}`;
  // Link to every sibling: 14 links keeps the whole cluster one hop apart.
  const siblings = STAT_LISTS.filter((l) => l.slug !== def.slug);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "5-Letter Words", url: `${BASE_URL}/5-letter-words` },
          { name: def.title, url: `${BASE_URL}${path}` },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          data.topWords.map((w) => ({ name: w, url: `${BASE_URL}${path}` }))
        )}
      />
      <JsonLd data={faqPageSchema(data.faqItems)} />

      <ContentHero
        eyebrow="Words · 5 Letters"
        title={def.title}
        description={`All ${data.count} five-letter words ${def.phrase}, with Scrabble scores and definitions to help you crack today's Wordle.`}
      />

      <div className="mt-8 space-y-8">
        {/* Direct answer (GEO block) */}
        <div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are{" "}
            <span className="font-heading text-xl font-bold text-[hsl(var(--cta))]">
              {data.count}
            </span>{" "}
            five-letter words {def.phrase}. The most common are:
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.topWords.map((w) => (
              <span
                key={w}
                className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-wide text-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <WordListTable
          common={data.common}
          all={data.all}
          allTruncated={data.truncated}
          totalCount={data.count}
        />

        <CalloutBox type="tip" title="Why this pattern matters in Wordle">
          {def.wordleTip}
        </CalloutBox>

        {data.highest && (
          <CalloutBox type="highlight" title="Highest-scoring word">
            <span className="font-mono font-bold">{data.highest.word}</span> is
            the top scorer here at {data.highest.scrabble} points in Scrabble (
            {data.highest.wwf} in Words With Friends).
          </CalloutBox>
        )}

        {def.sections.map((section) => (
          <ContentSection key={section.heading} title={section.heading}>
            {section.paragraphs.map((p, i) => (
              <BodyText key={i}>{p}</BodyText>
            ))}
          </ContentSection>
        ))}

        <ContentSection title={`${def.title} — FAQ`}>
          <SimpleFaq items={data.faqItems} />
        </ContentSection>

        <ContentSection title="More 5-Letter Word Lists">
          <div className="grid gap-2 sm:grid-cols-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/5-letter-words/${s.slug}`}
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </ContentSection>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/wordle-solver"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Filter these with the Wordle Solver →
          </Link>
          <Link
            href="/wordle-answer-today"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            Today&apos;s Wordle answer
          </Link>
          <Link
            href="/5-letter-words"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            All 5-letter word lists
          </Link>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Definitions derived from WordNet (Princeton University), used under its
          permissive licence.
        </p>
      </div>
    </div>
  );
}
