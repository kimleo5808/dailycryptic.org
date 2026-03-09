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
    question: "What is a container clue in a cryptic crossword?",
    answer:
      "A container clue tells you that one set of letters goes inside another set. The challenge is identifying the outer frame, the inner part, and the direction of insertion.",
  },
  {
    question: "How do I know which part goes outside?",
    answer:
      "The clue's indicator language usually tells you. Words like in, around, holding, or inside often reveal which component surrounds the other.",
  },
  {
    question: "Are container clues harder than charades?",
    answer:
      "They often feel harder because order and position matter more. Even with the right pieces, wrong placement can produce a near miss.",
  },
  {
    question: "Do container clues always have explicit indicators?",
    answer:
      "Most fair clues do, but some hide the structure inside smoother surface wording. That is why strict parse checking matters.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "ContainerClues",
    title: "Container Clues in Cryptic Crosswords: How Insertion Clues Work",
    description:
      "Learn how container clues work in cryptic crosswords, how to spot insertion indicators, and how to place letters in the right order.",
    keywords: [
      "container clues",
      "container cryptic clues",
      "insertion clues",
      "container clue indicators",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/container",
    canonicalUrl: "/cryptic-clue-types/container",
  });
}

export default async function ContainerCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType("container", 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          {
            name: "Container Clues",
            url: `${BASE_URL}/cryptic-clue-types/container`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Container Clues in Cryptic Crosswords: How Insertion Clues Work",
          description:
            "Learn how container clues work in cryptic crosswords, how to spot insertion indicators, and how to place letters in the right order.",
          url: `${BASE_URL}/cryptic-clue-types/container`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Container Clues"
        description="A container clue asks you to place one set of letters inside another. These clues reward careful structure reading and punish sloppy order control."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-container-clue", label: "What is a container clue?" },
            { href: "#why-container-clues-feel-tricky", label: "Why container clues feel tricky" },
            { href: "#common-container-indicators", label: "Common container indicators" },
            { href: "#outer-part-vs-inner-part", label: "Outer part vs inner part" },
            { href: "#why-order-matters-in-containers", label: "Why order matters" },
            { href: "#real-container-examples", label: "Real container examples" },
            { href: "#common-container-mistakes", label: "Common container mistakes" },
            { href: "#container-faq", label: "Container FAQ" },
          ]}
        />

        <ContentSection title="What Is a Container Clue?" id="what-is-a-container-clue">
          <BodyText>
            In a container clue, one component of the answer wraps around or
            contains another component. Instead of simply joining pieces, you
            must place one string inside another in the correct position. That
            extra structural step is what makes these clues feel more technical
            than many beginners expect.
          </BodyText>
          <BodyText>
            The challenge is rarely just finding the right letters. It is
            understanding the relationship between them. That makes container
            clues excellent training for precise, evidence-based solving.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Container Clues Feel Tricky" id="why-container-clues-feel-tricky">
          <BodyText>
            Many solvers identify the correct parts but still build the wrong
            answer because they insert them in the wrong direction. Surface
            meaning can also hide the structural signal. A clue can read like a
            natural phrase while quietly instructing you to put one unit inside
            another.
          </BodyText>
          <BodyText>
            That is why container clues respond well to slow, literal parsing.
            Instead of chasing the most elegant guess, rebuild the structure in
            a simple mechanical way and test the result.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Container Indicators" id="common-container-indicators">
          <BodyText>
            Indicator words often suggest holding, surrounding, entering, or
            being inside. Examples include in, around, about, holding, within,
            covering, inside, and containing. These words tell you not only that
            insertion is happening, but often which piece is the shell and which
            piece is inserted.
          </BodyText>
          <BodyText>
            The critical habit is to read the indicator literally. If the clue
            says A around B, that is not the same as B around A. In container
            logic, direction changes the answer.
          </BodyText>
          <BodyText>
            This literal reading is where container clues become teachable.
            Instead of reading the whole clue as atmosphere, you read the key
            phrase as an instruction about position. That shift is what makes
            the clue feel technical rather than magical.
          </BodyText>
        </ContentSection>

        <ContentSection title="Outer Part vs Inner Part" id="outer-part-vs-inner-part">
          <BodyText>
            A useful workflow is to identify the outer frame first. Ask which
            clue segment seems large enough to contain something else. Then look
            for the smaller inserted unit. Once both are clear, rebuild the
            final answer step by step and compare it to the clue definition.
          </BodyText>
          <BodyText>
            This distinction matters because container clues are easy to confuse
            with charades. If the clue is not simply joining parts in order, but
            nesting one inside another, treat it as a structural puzzle, not a
            sequence puzzle.
          </BodyText>
          <BodyText>
            A useful mental trick is to sketch the shell first. If you can see
            where the outer letters begin and end, the insertion usually becomes
            much easier to test. That is especially helpful when the clue feels
            almost like a charade at first glance.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Order Matters in Container Clues" id="why-order-matters-in-containers">
          <BodyText>
            The same two components can produce multiple wrong strings depending
            on where the insertion happens. That is why container clues are a
            great test of precision. A solver who respects order can often crack
            these clues cleanly. A solver who guesses by impression usually
            drifts into near misses.
          </BodyText>
          <BodyText>
            One strong habit is to write the outer letters first, then insert
            the inner letters physically. That makes the structure visible and
            reduces mental slipping.
          </BodyText>
          <BodyText>
            This is also why container clues are a strong intermediate training
            tool. They force you to respect both clue language and final string
            shape at the same time. If either one is treated casually, the solve
            starts to drift.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Container Clues Improve Structural Reading" id="how-containers-build-structure">
          <BodyText>
            Container clues teach you to think spatially about letter groups.
            Instead of just asking what pieces exist, you ask how those pieces
            must relate to each other. That habit strengthens many later clue
            types because it improves your ability to model structure before you
            commit to an answer.
          </BodyText>
          <BodyText>
            For many solvers, containers are the point where cryptics start to
            feel like systems rather than witty sentences. That is a valuable
            turning point in long-term skill growth.
          </BodyText>
        </ContentSection>

        <ExamplePuzzleGrid
          id="real-container-examples"
          puzzles={puzzles}
          title="Real Container Clue Examples"
          intro="These examples show how container clues work in real minute cryptic puzzles. Focus on identifying the shell, the inserted part, and the final sequence after insertion."
        />

        <ContentSection title="Common Container Mistakes" id="common-container-mistakes">
          <BodyText>
            The most common error is placing the right letters in the wrong
            order. Another is misreading the indicator and treating the clue as
            a charade. A third is stopping at a word that looks plausible
            without verifying that the insertion actually followed the clue
            language. The cure is mechanical reconstruction plus definition
            checking.
          </BodyText>
          <BodyText>
            A good review habit is to compare your failed answer with the real
            one and ask exactly where the insertion went wrong. Was the shell
            wrong, the inserted unit wrong, or the placement wrong? Specific
            diagnosis helps far more than vague frustration.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Container Clues Efficiently" id="practice-container-clues">
          <BodyText>
            The best way to practice containers is to alternate solving and
            reconstruction. Solve the clue once, then rebuild the answer again
            from the explanation without looking at the final word. That second
            reconstruction confirms whether you truly understood the insertion.
          </BodyText>
          <BodyText>
            Once basic container logic feels stable, move into medium archive
            sets and mixed clue groups. This is where your structural reading
            starts to generalize beyond one family.
          </BodyText>
        </ContentSection>

        <ContentSection title="Container Clue FAQ" id="container-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Review indicator language that signals insertion, reversal, deletion, and more.",
            },
            {
              href: "/minute-cryptic/medium",
              title: "Medium cryptic clues",
              description:
                "Practice more structural clue types in the medium archive set.",
            },
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "Compare containers with the other major clue families in one place.",
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
