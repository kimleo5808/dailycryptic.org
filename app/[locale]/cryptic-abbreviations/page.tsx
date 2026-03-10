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
    question: "Why do cryptic crosswords use abbreviations?",
    answer:
      "Abbreviations let setters build compact wordplay. A single letter or short string can represent a whole word, making charade and container constructions possible within tight letter counts.",
  },
  {
    question: "Do I need to memorise all abbreviations?",
    answer:
      "No. Start with the most common ones — directions, single-letter codes, and Roman numerals. You will pick up the rest through regular solving and review.",
  },
  {
    question: "Are abbreviations the same across all cryptic crosswords?",
    answer:
      "Most standard abbreviations are widely shared, but some setters or publications use less common conventions. The core set listed here covers the vast majority of cases.",
  },
  {
    question: "How do I know when a word is being used as an abbreviation?",
    answer:
      "Context tells you. If a word in the clue seems too short or plain to be part of the definition, it may be serving as an abbreviation for a single letter or short string in the wordplay.",
  },
];

type AbbrevEntry = { abbrev: string; meaning: string };

function AbbrevTable({ entries, columns = 2 }: { entries: AbbrevEntry[]; columns?: number }) {
  const gridClass = columns === 3
    ? "grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid gap-x-6 gap-y-1 sm:grid-cols-2";

  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className={gridClass}>
        {entries.map((e) => (
          <div key={`${e.abbrev}-${e.meaning}`} className="flex gap-2 py-1.5 text-sm border-b border-border/50 last:border-0">
            <span className="w-12 shrink-0 font-mono font-bold text-primary">{e.abbrev}</span>
            <span className="text-muted-foreground">{e.meaning}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DIRECTIONS: AbbrevEntry[] = [
  { abbrev: "N", meaning: "North" },
  { abbrev: "S", meaning: "South" },
  { abbrev: "E", meaning: "East" },
  { abbrev: "W", meaning: "West" },
  { abbrev: "NE", meaning: "North-East" },
  { abbrev: "SE", meaning: "South-East" },
  { abbrev: "NW", meaning: "North-West" },
  { abbrev: "SW", meaning: "South-West" },
  { abbrev: "L", meaning: "Left" },
  { abbrev: "R", meaning: "Right" },
];

const ROMAN_NUMERALS: AbbrevEntry[] = [
  { abbrev: "I", meaning: "1" },
  { abbrev: "V", meaning: "5" },
  { abbrev: "X", meaning: "10" },
  { abbrev: "L", meaning: "50" },
  { abbrev: "C", meaning: "100" },
  { abbrev: "D", meaning: "500" },
  { abbrev: "M", meaning: "1000" },
];

const PEOPLE_PROFESSIONS: AbbrevEntry[] = [
  { abbrev: "DR", meaning: "Doctor" },
  { abbrev: "MO", meaning: "Medical Officer" },
  { abbrev: "GP", meaning: "General Practitioner" },
  { abbrev: "RE", meaning: "Royal Engineer" },
  { abbrev: "RA", meaning: "Royal Artillery" },
  { abbrev: "AB", meaning: "Able-Bodied seaman" },
  { abbrev: "OS", meaning: "Ordinary Seaman" },
  { abbrev: "GI", meaning: "American soldier" },
  { abbrev: "MP", meaning: "Member of Parliament" },
  { abbrev: "PM", meaning: "Prime Minister" },
  { abbrev: "SS", meaning: "Saints / Steamship" },
  { abbrev: "ST", meaning: "Saint / Street" },
  { abbrev: "REV", meaning: "Reverend" },
  { abbrev: "SIR", meaning: "Knight" },
];

const MUSIC_ARTS: AbbrevEntry[] = [
  { abbrev: "P", meaning: "Piano (soft)" },
  { abbrev: "PP", meaning: "Pianissimo (very soft)" },
  { abbrev: "F", meaning: "Forte (loud)" },
  { abbrev: "FF", meaning: "Fortissimo (very loud)" },
  { abbrev: "OP", meaning: "Opus (work)" },
  { abbrev: "DA", meaning: "District Attorney" },
  { abbrev: "BA", meaning: "Bachelor of Arts" },
  { abbrev: "MA", meaning: "Master of Arts" },
  { abbrev: "RA", meaning: "Royal Academy" },
];

const COUNTRIES_PLACES: AbbrevEntry[] = [
  { abbrev: "US", meaning: "United States / America" },
  { abbrev: "UK", meaning: "United Kingdom" },
  { abbrev: "CH", meaning: "Switzerland" },
  { abbrev: "FR", meaning: "France" },
  { abbrev: "GR", meaning: "Greece" },
  { abbrev: "IT", meaning: "Italy" },
  { abbrev: "NI", meaning: "Northern Ireland" },
  { abbrev: "SA", meaning: "South Africa" },
  { abbrev: "NZ", meaning: "New Zealand" },
  { abbrev: "IE", meaning: "Ireland" },
];

const SINGLE_LETTER: AbbrevEntry[] = [
  { abbrev: "A", meaning: "Article / Ace / Area" },
  { abbrev: "B", meaning: "Born / Bishop / Black" },
  { abbrev: "C", meaning: "Century / Caught / About (circa)" },
  { abbrev: "D", meaning: "Died / Penny (old) / 500" },
  { abbrev: "E", meaning: "East / Energy / Note" },
  { abbrev: "F", meaning: "Female / Forte / Following" },
  { abbrev: "G", meaning: "Good / Gravity / Grand" },
  { abbrev: "H", meaning: "Hard / Hospital / Henry" },
  { abbrev: "I", meaning: "One / Island / Iodine" },
  { abbrev: "J", meaning: "Jack / Judge / Joule" },
  { abbrev: "K", meaning: "King / Thousand / Kelvin" },
  { abbrev: "L", meaning: "Left / Fifty / Learner" },
  { abbrev: "M", meaning: "Maiden / Thousand / Male" },
  { abbrev: "N", meaning: "North / New / Nitrogen" },
  { abbrev: "O", meaning: "Zero / Love / Old / Oxygen" },
  { abbrev: "P", meaning: "Page / Piano / Penny" },
  { abbrev: "Q", meaning: "Queen / Question" },
  { abbrev: "R", meaning: "Right / River / Rex/Regina" },
  { abbrev: "S", meaning: "South / Second / Singular" },
  { abbrev: "T", meaning: "Time / Ton / Tee" },
  { abbrev: "U", meaning: "Upper-class / University / Uranium" },
  { abbrev: "V", meaning: "Five / Versus / Volt" },
  { abbrev: "W", meaning: "West / With / Wicket / Watt" },
  { abbrev: "X", meaning: "Ten / Kiss / Unknown / Cross" },
  { abbrev: "Y", meaning: "Why / Yard / Year" },
  { abbrev: "Z", meaning: "Zero / Zed" },
];

const COMMON_SHORT: AbbrevEntry[] = [
  { abbrev: "AD", meaning: "Advertisement / Anno Domini" },
  { abbrev: "AI", meaning: "Artificial Intelligence" },
  { abbrev: "CO", meaning: "Company / Commanding Officer" },
  { abbrev: "DD", meaning: "Doctor of Divinity" },
  { abbrev: "EG", meaning: "For example" },
  { abbrev: "ET", meaning: "And (Latin)" },
  { abbrev: "EX", meaning: "Former" },
  { abbrev: "ID", meaning: "Identity / I had" },
  { abbrev: "IE", meaning: "That is" },
  { abbrev: "IN", meaning: "Fashionable" },
  { abbrev: "IT", meaning: "Italian / Sex appeal" },
  { abbrev: "NT", meaning: "New Testament" },
  { abbrev: "OT", meaning: "Old Testament / Overtime" },
  { abbrev: "PI", meaning: "Private Investigator / Greek letter" },
  { abbrev: "RE", meaning: "About / Concerning" },
  { abbrev: "UN", meaning: "United Nations / French 'one'" },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrypticAbbreviations",
    title: "Cryptic Crossword Abbreviations: The Complete Reference Guide",
    description:
      "A comprehensive guide to abbreviations used in cryptic crosswords, including directions, Roman numerals, single-letter codes, and common short forms.",
    keywords: [
      "cryptic crossword abbreviations",
      "crossword abbreviations list",
      "cryptic crossword letter codes",
      "crossword abbreviations guide",
    ],
    locale: locale as Locale,
    path: "/cryptic-abbreviations",
    canonicalUrl: "/cryptic-abbreviations",
  });
}

export default async function CrypticAbbreviationsPage({
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
          { name: "Cryptic Abbreviations", url: `${BASE_URL}/cryptic-abbreviations` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Cryptic Crossword Abbreviations: The Complete Reference Guide",
          description:
            "A comprehensive guide to abbreviations used in cryptic crosswords, including directions, Roman numerals, single-letter codes, and common short forms.",
          url: `${BASE_URL}/cryptic-abbreviations`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Reference Guide"
        title="Cryptic Crossword Abbreviations"
        description="Abbreviations are the building blocks of charade and container wordplay. This reference covers the most common codes used in cryptic crosswords, from single-letter conventions to standard short forms."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#how-abbreviations-work", label: "How abbreviations work in clues" },
            { href: "#single-letter-codes", label: "Single-letter codes (A–Z)" },
            { href: "#directions", label: "Directions and compass points" },
            { href: "#roman-numerals", label: "Roman numerals" },
            { href: "#people-professions", label: "People and professions" },
            { href: "#music-arts", label: "Music and arts" },
            { href: "#countries-places", label: "Countries and places" },
            { href: "#common-short-forms", label: "Common short forms" },
            { href: "#abbreviations-faq", label: "Abbreviations FAQ" },
          ]}
        />

        <ContentSection title="How Abbreviations Work in Cryptic Clues" id="how-abbreviations-work">
          <BodyText>
            In cryptic crosswords, abbreviations let setters pack more
            wordplay into fewer letters. A single letter can represent an
            entire concept — E for East, O for love, L for learner — and
            these tiny units become the building blocks of charade and
            container constructions.
          </BodyText>
          <SubHeading>Why You Need to Know Them</SubHeading>
          <BodyText>
            When a charade clue says "doctor" and needs two letters, it
            probably means DR. When it says "king" and needs one letter, it
            probably means K or R (Rex). Without this vocabulary, many
            charade and container clues feel impossible. With it, the
            wordplay becomes visible.
          </BodyText>
          <CalloutBox type="tip" title="The Most Important Ten">
            If you only learn ten abbreviations today, start with these:
            N/S/E/W (directions), R (right/river/king), L (left/learner/fifty),
            O (zero/love), I (one), and RE (about/concerning). These appear
            in a huge proportion of cryptic clues.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Single-Letter Codes (A–Z)" id="single-letter-codes">
          <BodyText>
            Every letter of the alphabet has at least one common crossword
            meaning. These single-letter abbreviations appear most often in
            charade clues, where they contribute one letter to the final
            answer.
          </BodyText>
          <AbbrevTable entries={SINGLE_LETTER} columns={2} />
          <SubHeading>Multiple Meanings Per Letter</SubHeading>
          <BodyText>
            Most letters have several valid meanings. The clue context tells
            you which one applies. If the clue mentions "love," O is
            probably zero (from tennis). If it mentions "nothing," O is
            probably the numeral. The right meaning is whichever one makes
            the full wordplay work.
          </BodyText>
        </ContentSection>

        <ContentSection title="Directions and Compass Points" id="directions">
          <BodyText>
            Compass directions are among the most common single-letter
            abbreviations in cryptic crosswords. They appear frequently in
            charade constructions.
          </BodyText>
          <AbbrevTable entries={DIRECTIONS} />
        </ContentSection>

        <ContentSection title="Roman Numerals" id="roman-numerals">
          <BodyText>
            Roman numerals provide another source of single-letter codes.
            When a clue mentions a number, it may be asking for the Roman
            numeral form rather than the Arabic digit.
          </BodyText>
          <AbbrevTable entries={ROMAN_NUMERALS} />
          <CalloutBox type="tip" title="Number Words in Clues">
            Clue words like "fifty" often mean L, "hundred" means C,
            "thousand" means M, and "five hundred" means D. Watch for
            number words that seem out of place in the clue surface.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="People and Professions" id="people-professions">
          <BodyText>
            Many profession and title abbreviations appear regularly in
            cryptic wordplay. These are especially common in charade clues
            where a role name maps to a short letter string.
          </BodyText>
          <AbbrevTable entries={PEOPLE_PROFESSIONS} />
          <SubHeading>Military and Naval Terms</SubHeading>
          <BodyText>
            Cryptic crosswords have a long tradition of using military
            abbreviations. AB (able-bodied seaman), RE (Royal Engineer), RA
            (Royal Artillery), and GI (American soldier) appear frequently.
            The clue may use the role description rather than the
            abbreviation itself.
          </BodyText>
        </ContentSection>

        <ContentSection title="Music and Arts" id="music-arts">
          <BodyText>
            Musical dynamics provide useful single-letter abbreviations,
            especially P (piano/soft) and F (forte/loud). Academic
            qualifications also appear as short forms.
          </BodyText>
          <AbbrevTable entries={MUSIC_ARTS} />
        </ContentSection>

        <ContentSection title="Countries and Places" id="countries-places">
          <BodyText>
            Country codes follow ISO standards in most cases. When a clue
            mentions a country name in a context that seems too brief, it
            may be asking for the two-letter code.
          </BodyText>
          <AbbrevTable entries={COUNTRIES_PLACES} />
        </ContentSection>

        <ContentSection title="Common Short Forms" id="common-short-forms">
          <BodyText>
            These two-letter abbreviations appear across many clue types.
            Some of them double as ordinary English words, which makes them
            effective for misdirection.
          </BodyText>
          <AbbrevTable entries={COMMON_SHORT} />
          <SubHeading>When Short Words Are Abbreviations</SubHeading>
          <BodyText>
            Words like "in" (fashionable), "it" (sex appeal), and "re"
            (about) can serve as ordinary English words in the clue surface
            while simultaneously functioning as abbreviation codes in the
            wordplay. This dual role is one of the things that makes cryptic
            clues feel elegant.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use This Reference While Solving" id="how-to-use">
          <SubHeading>Build Recognition Gradually</SubHeading>
          <BodyText>
            You do not need to memorise this entire list before you start
            solving. Instead, solve clues normally and check this page when
            an explanation uses an abbreviation you did not recognize. After
            a few weeks of regular solving, the most common codes will feel
            natural.
          </BodyText>
          <SubHeading>Cross-Reference with Clue Types</SubHeading>
          <BodyText>
            Abbreviations appear most often in charade and container clues.
            If you are studying those clue types, keep this reference open
            as a companion. Seeing how abbreviations fit into real wordplay
            is much more effective than studying them in isolation.
          </BodyText>
        </ContentSection>

        <ContentSection title="Abbreviations FAQ" id="abbreviations-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/charade",
              title: "Charade clues",
              description:
                "See how abbreviations serve as building blocks in charade wordplay.",
            },
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Learn the signal words that tell you what type of wordplay to expect.",
            },
            {
              href: "/common-crossword-answers",
              title: "Common answers",
              description:
                "See the words that appear most frequently as cryptic crossword answers.",
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
