import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  ExamplePuzzleGrid,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
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
    question: "Do double definition clues use indicators?",
    answer:
      "Usually not in the same way as anagrams or containers. Their logic depends more on two fair meanings than on explicit operation words.",
  },
  {
    question: "Are double definition clues easy or hard?",
    answer:
      "They can be either. They often look short and simple, but they become difficult when one meaning is subtle or when the surface misdirects strongly.",
  },
  {
    question: "How can I tell whether both meanings are fair?",
    answer:
      "If you can restate both meanings naturally and both fit the answer without forcing, the clue is likely a genuine double definition.",
  },
  {
    question: "Can a clue look like a double definition but actually be something else?",
    answer:
      "Yes. Some clues look semantically simple at first but turn out to hide structural wordplay. That is why you should test fairness carefully.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "DoubleDefinitionClues",
    title: "Double Definition Clues: How One Answer Matches Two Meanings",
    description:
      "Learn how double definition clues work and how to test whether two meanings fairly point to the same answer.",
    keywords: [
      "double definition clues",
      "double definition cryptic clues",
      "double definition examples",
    ],
    locale: locale as Locale,
    path: "/cryptic-clue-types/double-definition",
    canonicalUrl: "/cryptic-clue-types/double-definition",
  });
}

export default async function DoubleDefinitionCluesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getExampleMinuteCrypticsByClueType(
    "double-definition",
    3
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Cryptic Clue Types", url: `${BASE_URL}/cryptic-clue-types` },
          {
            name: "Double Definition Clues",
            url: `${BASE_URL}/cryptic-clue-types/double-definition`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Double Definition Clues: How One Answer Matches Two Meanings",
          description:
            "Learn how double definition clues work and how to test whether two meanings fairly point to the same answer.",
          url: `${BASE_URL}/cryptic-clue-types/double-definition`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Clue Type"
        title="Double Definition Clues"
        description="A double definition clue points to one answer through two meanings rather than through visible letter manipulation. That makes these clues compact, elegant, and often more subtle than they first appear."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-is-a-double-definition-clue", label: "What is a double definition clue?" },
            { href: "#why-double-definitions-feel-different", label: "Why they feel different" },
            { href: "#recognize-two-definitions", label: "How to recognize two definitions" },
            { href: "#test-a-candidate-answer", label: "How to test a candidate answer" },
            { href: "#double-definitions-train-fairness", label: "Why they train fairness" },
            { href: "#real-double-definition-examples", label: "Real examples" },
            { href: "#common-double-definition-mistakes", label: "Common mistakes" },
            { href: "#avoid-forcing-the-second-meaning", label: "Avoid forcing the second meaning" },
            { href: "#double-definition-faq", label: "Double definition FAQ" },
          ]}
        />

        <ContentSection title="What Is a Double Definition Clue?" id="what-is-a-double-definition-clue">
          <BodyText>
            A double definition clue gives you two separate meanings that both
            point to the same answer. Unlike anagrams, charades, or containers,
            the clue may not have obvious operational language. Instead, the
            answer succeeds because it satisfies two senses at once.
          </BodyText>
          <SubHeading>Useful Training for Semantic Discipline</SubHeading>
          <BodyText>
            That makes these clues useful training for semantic discipline. They
            force you to ask whether both meanings are fair instead of stopping
            when one interpretation feels strong enough.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Double Definition Clues Feel Different" id="why-double-definitions-feel-different">
          <SubHeading>Meaning Over Mechanics</SubHeading>
          <BodyText>
            Most clue types ask you to do something with letters. Double
            definitions often ask you to recognize the same word in two
            different semantic roles. This can feel easier at first because the
            clue is short, but it also removes many of the explicit signals that
            help beginners in more mechanical clues.
          </BodyText>
          <SubHeading>The Fairness Standard</SubHeading>
          <BodyText>
            That is why these clues are often solved by fairness testing. If one
            meaning works beautifully and the other feels strained, you are
            probably not finished yet. This clue type often feels more literary
            than mechanical, but the discipline is still rigorous — you are not
            allowed to keep a weak second meaning just because the first one is
            attractive.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Recognize Two Definitions" id="recognize-two-definitions">
          <SubHeading>The Balanced Clue Structure</SubHeading>
          <BodyText>
            The clue often feels balanced or split into two meaning zones rather
            than one meaning zone plus one operation zone. There may be no clear
            indicator words for rearrangement, insertion, or reversal. That
            should prompt a different question: can one answer satisfy both
            senses naturally?
          </BodyText>
          <SubHeading>When to Stop Looking for Hidden Machinery</SubHeading>
          <BodyText>
            This is also where misdirection happens. A clue can sound too plain,
            making the solver overcomplicate it. Sometimes the right move is not
            to search for hidden machinery, but to test whether two clean
            meanings are already present.
          </BodyText>
          <SubHeading>The Honesty Test</SubHeading>
          <BodyText>
            Double definitions are such good honesty tests because they punish
            the habit of overbuilding explanations the clue never actually asked
            for. A good working question is this: if I remove the idea of letter
            mechanics entirely, does the clue still hold together as two fair
            meanings? If yes, you may really be in double definition territory.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Test a Candidate Answer" id="test-a-candidate-answer">
          <BodyText>
            The standard is not "close enough." The standard is fair support
            from both sides, independently tested.
          </BodyText>
          <StepList
            items={[
              {
                title: "Check the First Meaning",
                description:
                  "Test your candidate answer against the first definition phrase. Does it fit cleanly — not approximately?",
              },
              {
                title: "Check the Second Meaning Independently",
                description:
                  "Now test the same answer against the second phrase, as if you had never thought of the first. If one side only works through vague association, reject the answer.",
              },
              {
                title: "Restate Both Meanings in Your Own Words",
                description:
                  "Without copying the clue, explain both meanings clearly. If you cannot do that, the clue is not yet solved to a useful standard.",
              },
            ]}
          />
          <SubHeading>The Hindsight Illusion</SubHeading>
          <BodyText>
            This testing habit is especially important because double definition
            clues create strong hindsight illusions. Once you know the answer,
            both meanings can seem obvious even if the second one was weak
            during the solve. The verbal restatement check catches this before
            you commit.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Double Definitions Train Fairness" id="double-definitions-train-fairness">
          <SubHeading>Semantic Accuracy Over Structural Cleverness</SubHeading>
          <BodyText>
            More mechanical clue types let you lean on structure heavily. Double
            definitions push you toward semantic accuracy instead. They teach
            you to respect nuance in meaning and to reject answers that only
            match one half of the clue strongly.
          </BodyText>
          <SubHeading>Building Restraint</SubHeading>
          <BodyText>
            These clues improve restraint. Many cryptic mistakes come from
            trying to manufacture a clever explanation when a clue is actually
            asking for two plain, fair senses of the same word. Double
            definition practice teaches you to stop decorating the clue and
            start checking whether the language already supports the answer
            cleanly.
          </BodyText>
          <CalloutBox type="highlight" title="Even If You Prefer Letter Wordplay">
            Double definition practice is valuable for all solver types. If your
            definition discipline is weak, these clues expose that quickly —
            making them one of the best tools for identifying gaps in your
            overall solving process.
          </CalloutBox>
        </ContentSection>

        <ExamplePuzzleGrid
          id="real-double-definition-examples"
          puzzles={puzzles}
          title="Real Double Definition Examples"
          intro="These examples show how a single answer can satisfy two meanings in real minute cryptic puzzles. When you review them, focus on fairness and semantic precision rather than letter mechanics."
        />

        <ContentSection title="Common Double Definition Mistakes" id="common-double-definition-mistakes">
          <CalloutBox type="warning" title="Patterns to Watch For">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Accepting one strong meaning and forcing the second after the fact</li>
              <li>Assuming every short clue with no clear indicator is a double definition</li>
              <li>Trusting your first answer because the clue "looks easy"</li>
            </ul>
          </CalloutBox>
          <SubHeading>Stay Open to Other Clue Types</SubHeading>
          <BodyText>
            The fix is to demand clean support from both meanings and to stay
            open to the possibility that another clue type is at work. The more
            compact the clue, the more important it is to be strict about
            fairness before committing.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Practice Double Definition Clues Efficiently" id="practice-double-definition-clues">
          <SubHeading>Write Both Meanings After Each Solve</SubHeading>
          <BodyText>
            Practice these clues by writing both meanings down after each solve.
            If one side still feels vague when you restate it, revisit the clue
            before moving on. This habit trains exactly the semantic precision
            that the clue type is designed to test.
          </BodyText>
          <SubHeading>Pair With Medium Archive Practice</SubHeading>
          <BodyText>
            Double definitions pair well with medium archive practice because
            that difficulty range often exposes whether you are solving by
            fairness or by hopeful intuition. If you can write both meanings
            clearly without copying the clue, you understood it. If not, review
            again before moving on.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Avoid Forcing the Second Meaning" id="avoid-forcing-the-second-meaning">
          <SubHeading>The Paraphrase Test</SubHeading>
          <BodyText>
            The safest test is to separate the clue into two short paraphrases
            and ask whether each one could stand alone as a fair pointer to the
            answer. If one side only works once you already know the answer, you
            should stay skeptical. Good double definitions feel fair in both
            directions, not only in hindsight.
          </BodyText>
          <SubHeading>The Rival Candidate Method</SubHeading>
          <BodyText>
            Compare your candidate answer against at least one rival. If a
            second word fits the first meaning equally well, the clue is telling
            you to be stricter about the second. This is one of the best ways
            to stop semantic laziness before it settles into your solving
            process.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Double Definitions Fit Into a Broader Solving Routine" id="double-definitions-in-broader-routine">
          <SubHeading>Mixed Practice Reveals the Contrast</SubHeading>
          <BodyText>
            These clues work best when they sit inside mixed practice rather
            than in total isolation. Solve a few more structural clues, then
            come back to one double definition and notice how different the
            proof standard feels. That contrast makes the lesson clearer.
          </BodyText>
          <SubHeading>The Review Clue Role</SubHeading>
          <BodyText>
            Double definitions are excellent review clues. They remind you that
            cryptic solving is not only about operations on letters. It is also
            about fair language, controlled meaning, and the discipline to
            reject answers that only sound right at first glance.
          </BodyText>
        </ContentSection>

        <ContentSection title="Double Definition Clue FAQ" id="double-definition-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Beginner guide",
              description:
                "Review the overall beginner workflow before tackling more semantic clue families.",
            },
            {
              href: "/minute-cryptic/medium",
              title: "Medium cryptic clues",
              description:
                "Practice more mixed clue sets once double definitions start feeling clearer.",
            },
            {
              href: "/cryptic-clue-types",
              title: "All clue types",
              description:
                "Compare double definitions with more structural clue families.",
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
