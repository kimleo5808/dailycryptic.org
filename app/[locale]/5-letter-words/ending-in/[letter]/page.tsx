import FiveLetterSpoke, {
  buildSpokeMetadata,
} from "@/components/word-lists/FiveLetterSpoke";
import { LETTERS, type Mode } from "@/lib/word-lists-data";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const MODE: Mode = "ending-in";
type Params = Promise<{ locale: string; letter: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, letter } = await params;
  const m = buildSpokeMetadata(MODE, letter);
  return constructMetadata({
    page: "FiveLetterWords",
    title: m.title,
    description: m.description,
    locale: locale as Locale,
    path: m.path,
    canonicalUrl: m.path,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { letter } = await params;
  return <FiveLetterSpoke mode={MODE} letter={letter} />;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const out: { locale: string; letter: string }[] = [];
  for (const locale of LOCALES)
    for (const l of LETTERS) out.push({ locale, letter: l.toLowerCase() });
  return out;
}
