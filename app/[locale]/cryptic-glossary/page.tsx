import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-10";

const FAQ_ITEMS = [
  {
    question: "What is the difference between a definition and an indicator?",
    answer:
      "The definition tells you what the answer means. The indicator tells you what operation to perform on the wordplay material. Every fair cryptic clue has at least one definition.",
  },
  {
    question: "Do I need to know all these terms to solve cryptic crosswords?",
    answer:
      "No. You can solve many clues without knowing the formal terminology. But understanding terms like fodder, indicator, and enumeration helps you discuss and learn from clue explanations more efficiently.",
  },
  {
    question: "What is the most important term for beginners?",
    answer:
      "Definition. Understanding that every clue contains a fair definition of the answer is the single most important conceptual shift for new solvers.",
  },
  {
    question: "Where can I learn more about specific clue types?",
    answer:
      "Visit the Clue Types hub page for detailed guides on each of the eight main clue families, with examples and step-by-step solving methods.",
  },
];

type GlossaryEntry = { term: string; definition: string; seeAlso?: string };

function GlossarySection({ entries }: { entries: GlossaryEntry[] }) {
  return (
    <div className="mt-4 space-y-4">
      {entries.map((e) => (
        <div key={e.term} className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-heading text-sm font-bold text-foreground">{e.term}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.definition}</p>
          {e.seeAlso && (
            <p className="mt-2 text-xs text-primary">See also: {e.seeAlso}</p>
          )}
        </div>
      ))}
    </div>
  );
}

const GLOSSARY_A: GlossaryEntry[] = [
  { term: "Abbreviation", definition: "A short letter code used in wordplay, such as N for North or DR for Doctor. Common in charade and container clues.", seeAlso: "Charade, Container" },
  { term: "Across", definition: "A clue whose answer reads horizontally in a crossword grid, from left to right." },
  { term: "Anagram", definition: "A clue type where the answer is formed by rearranging the letters of the fodder. Signalled by an anagram indicator.", seeAlso: "Fodder, Indicator" },
  { term: "Anagram indicator", definition: "A word suggesting disorder, change, or rearrangement that signals an anagram clue. Examples: mixed, wild, broken, scrambled." },
  { term: "&Lit", definition: "A clue where the entire surface reading also serves as the definition. Considered the most elegant form of cryptic clue. Pronounced 'and literally.'" },
];

const GLOSSARY_B: GlossaryEntry[] = [
  { term: "Beheadment", definition: "A form of deletion clue where the first letter of a word is removed. Signalled by indicators like headless, topless, or decapitated.", seeAlso: "Deletion, Curtailment" },
  { term: "Blank", definition: "An unchecked square in a crossword grid — one that belongs to only one answer, not a crossing point." },
  { term: "Block", definition: "A black square in a crossword grid that separates answer entries." },
];

const GLOSSARY_C: GlossaryEntry[] = [
  { term: "Charade", definition: "A clue type where the answer is built by joining smaller parts in sequence, like a game of charades. Each part is typically an abbreviation, synonym, or single letter.", seeAlso: "Abbreviation" },
  { term: "Checking", definition: "The process of verifying an answer against both definition and wordplay. Also refers to squares in a grid that belong to two crossing entries." },
  { term: "Clue type", definition: "The category of wordplay mechanism used in a cryptic clue. The main types are: anagram, charade, container, double definition, hidden word, reversal, homophone, and deletion." },
  { term: "Container", definition: "A clue type where one set of letters is placed inside another. Signalled by indicators like in, around, holding, or containing.", seeAlso: "Insertion" },
  { term: "Crossword compiler", definition: "The person who creates a crossword puzzle. Also called a setter (UK) or constructor (US)." },
  { term: "Cryptic definition", definition: "A clue that consists entirely of a misleading or whimsical definition of the answer, with no separate wordplay component." },
  { term: "Curtailment", definition: "A form of deletion clue where the last letter of a word is removed. Signalled by indicators like endless, curtailed, or cut short.", seeAlso: "Deletion, Beheadment" },
];

const GLOSSARY_D: GlossaryEntry[] = [
  { term: "Definition", definition: "The part of a cryptic clue that gives a direct or near-direct meaning of the answer. Usually located at the beginning or end of the clue." },
  { term: "Deletion", definition: "A clue type where one or more letters are removed from a source word to produce the answer. Subtypes include beheadment, curtailment, and internal deletion.", seeAlso: "Beheadment, Curtailment" },
  { term: "Double definition", definition: "A clue type where two separate definitions both point to the same answer, with minimal or no additional wordplay.", seeAlso: "Definition" },
  { term: "Down", definition: "A clue whose answer reads vertically in a crossword grid, from top to bottom." },
];

const GLOSSARY_E: GlossaryEntry[] = [
  { term: "Enumeration", definition: "The number in parentheses at the end of a clue, indicating the length of the answer. For example, (5) means a five-letter word. Multi-word answers show each word length: (3,4)." },
  { term: "Entry", definition: "An answer placed in the crossword grid. Also called a light." },
];

const GLOSSARY_F: GlossaryEntry[] = [
  { term: "Fodder", definition: "The letters that will be rearranged in an anagram clue. The fodder must contain exactly the same letters as the answer, in any order.", seeAlso: "Anagram" },
  { term: "Fair", definition: "A clue quality standard meaning that the answer can be justified from both the definition and the wordplay independently, without requiring external knowledge or leaps of faith." },
];

const GLOSSARY_G_H: GlossaryEntry[] = [
  { term: "Grid", definition: "The pattern of white and black squares that holds crossword answers. Standard UK cryptic grids are 15x15 with rotational symmetry." },
  { term: "Hidden word", definition: "A clue type where the answer appears as a consecutive letter run inside the clue text. Signalled by indicators like part of, some, or held in.", seeAlso: "Indicator" },
  { term: "Homophone", definition: "A clue type where the answer sounds like another word. Signalled by hearing indicators like we hear, reportedly, or sounds like." },
];

const GLOSSARY_I_L: GlossaryEntry[] = [
  { term: "Indicator", definition: "A word or phrase in a cryptic clue that signals the type of wordplay operation. Each clue type has its own family of indicators.", seeAlso: "Anagram indicator" },
  { term: "Insertion", definition: "Placing one set of letters inside another. The same operation as a container clue, described from the perspective of the inner component.", seeAlso: "Container" },
  { term: "Light", definition: "A white square or series of white squares in a crossword grid. Sometimes used to mean an individual answer entry." },
  { term: "Linking word", definition: "A short word connecting the definition to the wordplay, such as is, gives, or for. Not all clues have them." },
];

const GLOSSARY_M_P: GlossaryEntry[] = [
  { term: "Misdirection", definition: "The art of making a clue's surface reading point away from the actual answer. Good misdirection creates a plausible but misleading narrative." },
  { term: "Nina", definition: "A hidden message spelled out by specific squares in a crossword grid, usually along the perimeter. An optional flourish by the setter." },
  { term: "Parse", definition: "The complete breakdown of a cryptic clue into its structural components: definition, indicator, wordplay material, and any linking words." },
  { term: "Primer", definition: "An introductory or teaching clue designed to help new solvers learn a particular clue type or technique." },
];

const GLOSSARY_R_S: GlossaryEntry[] = [
  { term: "Reversal", definition: "A clue type where a word or phrase is read backwards to produce the answer. Signalled by indicators like back, returned, or reversed.", seeAlso: "Indicator" },
  { term: "Setter", definition: "The person who writes a cryptic crossword puzzle. UK term; called compiler or constructor in other traditions." },
  { term: "Surface reading", definition: "The apparent plain-English meaning of a cryptic clue before you start parsing it for wordplay. Good clues have an entertaining or plausible surface." },
  { term: "Subsidiary indication", definition: "The wordplay portion of a clue — everything that is not the definition. Also called the subsidiary." },
  { term: "Symmetry", definition: "The visual pattern of a crossword grid. UK cryptic grids typically have 180-degree rotational symmetry." },
];

const GLOSSARY_T_Z: GlossaryEntry[] = [
  { term: "Theme", definition: "A unifying subject that connects some or all answers in a crossword. Themed puzzles are more common in some publications than others." },
  { term: "Unch", definition: "Short for unchecked letter — a letter in the grid that belongs to only one answer. Important for solving because these letters have no crossing confirmation." },
  { term: "Wordplay", definition: "The non-definition part of a cryptic clue that constructs or encodes the answer through letter manipulation, abbreviation, or sound. The wordplay must independently produce the same answer as the definition." },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrypticGlossary",
    title: "Cryptic Crossword Glossary: Every Term Explained",
    description:
      "A comprehensive glossary of cryptic crossword terminology, from anagram to wordplay, with clear definitions for beginners and experienced solvers.",
    keywords: [
      "cryptic crossword glossary",
      "crossword terminology",
      "cryptic crossword terms",
      "crossword glossary",
    ],
    locale: locale as Locale,
    path: "/cryptic-glossary",
    canonicalUrl: "/cryptic-glossary",
  });
}

export default async function CrypticGlossaryPage({
  params,
}: {
  params: Params;
}) {
  await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Glossary", url: `${BASE_URL}/cryptic-glossary` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Cryptic Crossword Glossary: Every Term Explained",
          description:
            "A comprehensive glossary of cryptic crossword terminology, from anagram to wordplay, with clear definitions for beginners and experienced solvers.",
          url: `${BASE_URL}/cryptic-glossary`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Reference Guide"
        title="Cryptic Crossword Glossary"
        description="A complete reference for cryptic crossword terminology. Use this glossary when you encounter unfamiliar terms in clue explanations, setter commentary, or solving guides."
      />

      <div className="mt-8 space-y-8">
        {/* Alphabet jump bar */}
        <nav className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-card p-3 sm:p-4">
          {["A", "B", "C", "D", "E", "F", "G–H", "I–L", "M–P", "R–S", "T–Z"].map((letter) => (
            <a
              key={letter}
              href={`#glossary-${letter.toLowerCase().replace("–", "-")}`}
              className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {letter}
            </a>
          ))}
        </nav>

        <TableOfContents
          items={[
            { href: "#glossary-a", label: "A — Abbreviation to &Lit" },
            { href: "#glossary-b", label: "B — Beheadment to Block" },
            { href: "#glossary-c", label: "C — Charade to Curtailment" },
            { href: "#glossary-d", label: "D — Definition to Down" },
            { href: "#glossary-e", label: "E — Enumeration to Entry" },
            { href: "#glossary-f", label: "F — Fodder to Fair" },
            { href: "#glossary-g-h", label: "G–H — Grid to Homophone" },
            { href: "#glossary-i-l", label: "I–L — Indicator to Linking word" },
            { href: "#glossary-m-p", label: "M–P — Misdirection to Primer" },
            { href: "#glossary-r-s", label: "R–S — Reversal to Symmetry" },
            { href: "#glossary-t-z", label: "T–Z — Theme to Wordplay" },
            { href: "#glossary-faq", label: "Glossary FAQ" },
          ]}
        />

        <ContentSection title="A" id="glossary-a">
          <GlossarySection entries={GLOSSARY_A} />
        </ContentSection>

        <ContentSection title="B" id="glossary-b">
          <GlossarySection entries={GLOSSARY_B} />
        </ContentSection>

        <ContentSection title="C" id="glossary-c">
          <GlossarySection entries={GLOSSARY_C} />
        </ContentSection>

        <ContentSection title="D" id="glossary-d">
          <GlossarySection entries={GLOSSARY_D} />
        </ContentSection>

        <ContentSection title="E" id="glossary-e">
          <GlossarySection entries={GLOSSARY_E} />
        </ContentSection>

        <ContentSection title="F" id="glossary-f">
          <GlossarySection entries={GLOSSARY_F} />
        </ContentSection>

        <ContentSection title="G–H" id="glossary-g-h">
          <GlossarySection entries={GLOSSARY_G_H} />
        </ContentSection>

        <ContentSection title="I–L" id="glossary-i-l">
          <GlossarySection entries={GLOSSARY_I_L} />
        </ContentSection>

        <ContentSection title="M–P" id="glossary-m-p">
          <GlossarySection entries={GLOSSARY_M_P} />
        </ContentSection>

        <ContentSection title="R–S" id="glossary-r-s">
          <GlossarySection entries={GLOSSARY_R_S} />
        </ContentSection>

        <ContentSection title="T–Z" id="glossary-t-z">
          <GlossarySection entries={GLOSSARY_T_Z} />
        </ContentSection>

        <ContentSection title="Key Concepts for Beginners" id="key-concepts">
          <CalloutBox type="highlight" title="The 5 Terms Every Beginner Needs">
            If you are just starting out, focus on these five terms first:
            <strong> Definition</strong> (what the answer means),
            <strong> Wordplay</strong> (how the answer is constructed),
            <strong> Indicator</strong> (what signals the wordplay type),
            <strong> Enumeration</strong> (the answer length), and
            <strong> Parse</strong> (the full structural breakdown).
          </CalloutBox>
          <SubHeading>Build Vocabulary Through Solving</SubHeading>
          <BodyText>
            You do not need to memorise this glossary before solving your
            first clue. Most solvers learn terminology naturally through
            practice and explanation review. Use this page as a reference
            when you encounter an unfamiliar term, not as required reading.
          </BodyText>
        </ContentSection>

        <ContentSection title="Glossary FAQ" id="glossary-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types",
              title: "Clue types",
              description:
                "See detailed guides for each of the eight main clue families.",
            },
            {
              href: "/cryptic-abbreviations",
              title: "Abbreviations reference",
              description:
                "Look up the letter codes used as building blocks in wordplay.",
            },
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Beginner guide",
              description:
                "Start here if you are new to cryptic crosswords.",
            },
          ]}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
