import {
  BodyText,
  ContentHero,
  ContentSection,
  ExamplePuzzleGrid,
  RelatedLinks,
  SimpleFaq,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getExampleMinuteCrypticsByClueType } from "@/lib/minute-cryptic-data";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-09";

const FAQ_ITEMS = [
  {
    question: "What makes a clue a charade?",
    answer:
      "A charade clue builds the answer from shorter parts placed in order, usually through abbreviations, short synonyms, or letter chunks.",
  },
  {
    question: "Do charade clues always use abbreviations?",
    answer:
      "No. Many charades use abbreviations, but others use ordinary short synonyms or direct letter components.",
  },
  {
    question: "How do I know where one part ends and another begins?",
    answer:
      "You test the clue in chunks. If one segmentation produces a complete answer that fits both meaning and order, that is usually the right split.",
  },
  {
    question: "Why do charade clues feel obvious only after the answer?",
    answer:
      "Because the clue surface often hides the join points. Once you know the final answer, the parts look natural in hindsight.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CharadeClues",
    title: "Charade Clues Explained: How to Build Answers Part by Part",
    description:
      "Learn how charade clues work in cryptic crosswords and how to assemble answers from smaller parts in the right order.",
    keywords: [
      "charade clues",
      "charade cryptic clues",
      "charade clue examples",
      "how to solve charade clues",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/charade",
    canonicalUrl: "/cryptic-clue-types/charade",
  });
}

export default async function CharadeCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("charade", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          { name: "Charade Clues", url: `${BASE_URL}/cryptic-clue-types/charade` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Charade Clues Explained: How to Build Answers Part by Part",
          description:
            "Learn how charade clues work in cryptic crosswords and how to assemble answers from smaller parts in the right order.",
          url: `${BASE_URL}/cryptic-clue-types/charade`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Charade Clues"
        description="A charade clue builds the answer by joining smaller parts in sequence. These clues train segmentation, abbreviation awareness, and order control better than almost any other family."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-charade-clue", label: "What is a charade clue?" },
            { href: "#why-charade-clues-matter", label: "Why charade clues matter" },
            { href: "#split-a-charade-clue", label: "How to split a charade clue" },
            { href: "#abbreviations-and-short-synonyms", label: "Abbreviations and short synonyms" },
            { href: "#why-order-matters-in-charades", label: "Why order matters" },
            { href: "#real-charade-examples", label: "Real charade examples" },
            { href: "#common-charade-mistakes", label: "Common charade mistakes" },
            { href: "#charade-faq", label: "Charade FAQ" },
          ]}
        />

        <ContentSection title="What Is a Charade Clue?" id="what-is-a-charade-clue">
          <BodyText>
            In a charade clue, the answer is assembled from separate units that
            appear in order. One unit may come from an abbreviation, another
            from a short synonym, and another from a single letter. The clue
            often feels natural as a sentence, but underneath that surface it is
            really asking you to piece together fragments.
          </BodyText>
          <BodyText>
            Charades matter because they appear constantly in cryptic solving.
            They reward structured reading more than clever guessing. Once you
            learn to split the clue into workable chunks, you start seeing how
            often cryptic answers are built rather than transformed.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Charade Clues Matter" id="why-charade-clues-matter">
          <BodyText>
            Charades are core cryptic training because they teach segmentation.
            Many beginners read the entire clue at once and try to find a word
            that matches the surface meaning. Charade clues punish that habit.
            They ask you to break the sentence down into useful units and then
            rebuild the answer carefully.
          </BodyText>
          <BodyText>
            This habit transfers across the whole puzzle ecosystem. Even when a
            clue is not a pure charade, the ability to identify meaningful
            chunks helps you test definitions, abbreviations, and operations
            more cleanly.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Split a Charade Clue into Parts" id="split-a-charade-clue">
          <BodyText>
            Start by looking for short, clue-sized chunks that could map to
            brief synonyms or familiar abbreviations. Then test whether those
            parts can be joined in the exact order presented. If the full answer
            emerges and still matches the definition, the segmentation is
            probably correct.
          </BodyText>
          <BodyText>
            This is one of the few clue types where writing the parts down often
            helps immediately. It slows you just enough to stop the brain from
            leaping toward a half-proved answer.
          </BodyText>
          <BodyText>
            Charade clues become much easier once you accept that the clue is
            not asking for one big leap. It is asking for a series of small
            decisions. Find one part, then the next, then test the final string.
            That is a very different mindset from trying to guess the whole word
            and explain it afterward.
          </BodyText>
        </ContentSection>

        <ContentSection title="Abbreviations and Short Synonyms" id="abbreviations-and-short-synonyms">
          <BodyText>
            Charades often use small building blocks: common abbreviations, one-
            letter indicators, or compact synonyms. Beginners sometimes reject a
            correct parse because the clue part feels too short or too plain.
            That is a mistake. In charades, tiny components are normal.
          </BodyText>
          <BodyText>
            The right standard is not elegance. It is fit. If each part is fair
            and the final assembly produces the answer in order, the clue is
            doing exactly what it should.
          </BodyText>
          <BodyText>
            This is also why charades are good for learning cryptic economy.
            Very small clue units can do real work. Once you accept that, you
            stop dismissing viable parses simply because one component feels too
            plain or too short.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Order Matters in Charade Clues" id="why-order-matters-in-charades">
          <BodyText>
            Order is not decorative in charades. If you reverse two valid
            pieces, you usually create a wrong answer or a near miss. That is
            why charades are so useful for disciplined solving. They reward
            exact assembly, not broad intuition.
          </BodyText>
          <BodyText>
            A common correction is to speak the parts aloud from left to right
            before you submit. If the full string only works when you change the
            sequence, your parse is probably wrong.
          </BodyText>
          <BodyText>
            Order is what separates a solved charade from a nearly solved one.
            This is why charade clues are so good at exposing lazy proof habits.
            A solver who respects sequence will usually catch the mistake before
            pressing check.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Charade Clues Make Better Solvers" id="why-charades-build-skill">
          <BodyText>
            Charades train one of the most transferable cryptic skills: the
            ability to break a clue into functional units. That skill does not
            only help on charades. It improves how you read containers, mixed
            clues, and many clue surfaces that rely on compact abbreviations.
          </BodyText>
          <BodyText>
            For that reason, charade practice is valuable even if charades are
            not your favorite clue type. They improve the kind of structural
            patience that strengthens the rest of your solving.
          </BodyText>
        </ContentSection>

        <ExamplePuzzleGrid
          id="real-charade-examples"
          puzzles={puzzles}
          title="Real Charade Clue Examples"
          intro="These site examples show how charade clues assemble answers from smaller parts. Look for the clue chunks, decide how each chunk contributes, and then check whether the final order stays intact."
        />

        <ContentSection title="Common Charade Mistakes" id="common-charade-mistakes">
          <BodyText>
            Many solvers find one convincing segment and then guess the rest.
            Others choose elegant synonyms that feel clever but do not match the
            clue's actual assembly logic. The third common error is ignoring
            order. The fix in all three cases is the same: write the parts down,
            join them exactly as given, and then check the definition.
          </BodyText>
          <BodyText>
            Another useful correction is to test whether each part contributes
            something visible. If one segment has no clear role, your parse is
            probably incomplete. A strong charade solve usually leaves no
            unexplained fragment behind.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Charade Clues Efficiently" id="practice-charade-clues">
          <BodyText>
            Practice charades in small groups and compare how the clue splits.
            After each solve, ask whether your first segmentation matched the
            final explanation. If not, what boundary did you miss? That one
            question improves your next charade much more than rereading the
            same clue passively.
          </BodyText>
          <BodyText>
            If you are still developing confidence, pair charade study with easy
            archive sets. Once your segmentation starts to feel more reliable,
            move into medium clues where the parts are less generously exposed.
          </BodyText>
        </ContentSection>

        <ContentSection title="Charade Clue FAQ" id="charade-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "Compare charades with anagrams, containers, and double definitions.",
            },
            {
              href: "/minute-cryptic/easy",
              title: "Easy cryptic clues",
              description:
                "Use easier archive sets to build segmentation confidence first.",
            },
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Beginner guide",
              description:
                "Return to the main beginner workflow if you want the full solving system.",
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
