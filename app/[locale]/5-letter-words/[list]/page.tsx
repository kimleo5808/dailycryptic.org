import StatListPage from "@/components/word-lists/StatListPage";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { getStatListDef, STAT_LIST_SLUGS } from "@/lib/word-stat-lists";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; list: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, list } = await params;
  const def = getStatListDef(list);
  if (!def) {
    return constructMetadata({
      page: "FiveLetterWords",
      title: "Word List Not Found",
      description: "This 5-letter word list was not found.",
      locale: locale as Locale,
      noIndex: true,
    });
  }
  return constructMetadata({
    page: "FiveLetterWords",
    title: def.metaTitle,
    description: def.metaDescription,
    keywords: [def.keyword, `${def.keyword} wordle`, "5 letter words", "wordle help"],
    locale: locale as Locale,
    path: `/5-letter-words/${def.slug}`,
    canonicalUrl: `/5-letter-words/${def.slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { list } = await params;
  if (!getStatListDef(list)) notFound();
  return <StatListPage slug={list} />;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    STAT_LIST_SLUGS.map((list) => ({ locale, list }))
  );
}
