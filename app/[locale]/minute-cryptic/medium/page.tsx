import {
  BodyText,
  ContentHero,
  ContentSection,
  DifficultyArchiveList,
  RelatedLinks,
  SimpleFaq,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getMinuteCrypticsByDifficulty } from "@/lib/minute-cryptic-data";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

const FAQ_ITEMS = [
  {
    question: "When should I move from easy to medium clues?",
    answer:
      "Move up when easy clues feel structurally familiar and you can usually explain your solves, not just guess them.",
  },
  {
    question: "Why do medium clues feel harder than expected?",
    answer:
      "Medium clues often hide the mechanism more carefully and demand better proof, even when the clue type itself is familiar.",
  },
  {
    question: "Should I still use hints at medium level?",
    answer:
      "Yes, but more selectively. One hint after two serious attempts is usually a productive rule.",
  },
  {
    question: "What is the biggest mistake medium solvers make?",
    answer:
      "Accepting partial parses. Medium-level improvement comes from rejecting answers that only half-fit.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "MediumMinuteCryptic",
    title: "Medium Minute Cryptic Clues: Build Accuracy Beyond the Basics",
    description:
      "Practice medium cryptic clues online and improve clue parsing, pattern recognition, and answer verification.",
    keywords: [
      "medium minute cryptic clues",
      "medium cryptic clues",
      "intermediate cryptic practice",
    ],
    locale: locale as Locale,
    path: "/minute-cryptic/medium",
    canonicalUrl: "/minute-cryptic/medium",
  });
}

export default async function MediumMinuteCrypticPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getMinuteCrypticsByDifficulty("medium");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Medium Minute Cryptic Clues",
            url: `${BASE_URL}/minute-cryptic/medium`,
          },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Medium Minute Cryptic Clues",
          description:
            "An archive of medium minute cryptic clues for improving clue parsing, proof quality, and intermediate solving control.",
          url: `${BASE_URL}/minute-cryptic/medium`,
        })}
      />
      <JsonLd
        data={itemListSchema(
          puzzles.map((puzzle) => ({
            name: `Minute Cryptic #${puzzle.id}`,
            url: `${BASE_URL}/minute-cryptic/${puzzle.printDate}`,
            description: puzzle.clue,
          }))
        )}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Difficulty Practice"
        title="Medium Minute Cryptic Clues"
        description="Medium cryptic clues sit between recognition and mastery. They demand better clue-type control, cleaner parsing, and less dependence on hints than beginner-level practice."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-makes-a-clue-medium", label: "What makes a clue medium?" },
            { href: "#how-medium-clues-differ", label: "How medium clues differ" },
            { href: "#best-habits-for-medium-solvers", label: "Best habits for medium solvers" },
            { href: "#medium-minute-cryptic-archive", label: "Medium archive" },
            { href: "#reduce-hint-dependence", label: "How to reduce hint dependence" },
            { href: "#when-to-try-hard-clues", label: "When to try hard clues" },
            { href: "#medium-review-routine", label: "Medium review routine" },
            { href: "#medium-minute-cryptic-faq", label: "Medium clue FAQ" },
          ]}
        />

        <ContentSection title="What Makes a Clue Medium?" id="what-makes-a-clue-medium">
          <BodyText>
            Medium clues are usually familiar in mechanism but less generous in
            surface clarity. The answer path is still fair, but you often need
            better control of clue type, stronger discipline with count and
            order, and a stricter proof standard before you can submit with
            confidence.
          </BodyText>
          <BodyText>
            This is where many solvers stop making obvious mistakes and start
            confronting subtler ones. That is exactly why medium practice is so
            valuable.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Medium Clues Differ from Easy Ones" id="how-medium-clues-differ">
          <BodyText>
            Easy clues usually announce their structure more clearly. Medium
            clues often require one extra layer of interpretation. The clue type
            may still be recognizable, but the definition may be tighter, the
            indicator less obvious, or the surface more deceptive.
          </BodyText>
          <BodyText>
            The solution is not more aggression. It is more control. Medium
            clues reward solvers who slow down just enough to check whether each
            step is actually justified.
          </BodyText>
        </ContentSection>

        <ContentSection title="Best Habits for Medium Solvers" id="best-habits-for-medium-solvers">
          <BodyText>
            Write down the likely structure before you guess. Use fewer hints,
            but review explanations more carefully. Reject half-proved answers
            instead of hoping they will become right once you see the feedback.
            Medium-level growth happens when you turn almost right into provably
            right.
          </BodyText>
          <BodyText>
            This is the stage where many solvers plateau. They know the clue
            types, but they still trust intuition too early. Medium practice is
            where you learn to slow the mind just enough to preserve proof
            quality without losing momentum.
          </BodyText>
        </ContentSection>

        <ContentSection title="What Medium Clues Usually Expose" id="what-medium-clues-expose">
          <BodyText>
            Medium clues expose weak structure reading. They also expose weak
            answer verification. You may identify the right clue family but miss
            the exact insertion order, the better definition boundary, or the
            one letter that makes the whole parse fail. That is why medium clues
            are so valuable: they highlight which part of your process still
            breaks under pressure.
          </BodyText>
          <BodyText>
            If you review them honestly, medium clues become the bridge between
            beginner familiarity and advanced reliability.
          </BodyText>
          <BodyText>
            This is also where clue-type awareness either becomes real or stays
            superficial. At medium level, it is not enough to know the labels.
            You need to recognize how the labels change your solving behavior in
            practice.
          </BodyText>
        </ContentSection>

        <DifficultyArchiveList
          id="medium-minute-cryptic-archive"
          puzzles={puzzles}
          title="Medium Minute Cryptic Archive"
          intro="Use this archive when easy sets start feeling stable but hard sets still feel too costly. Medium clues are where proof quality becomes the main training objective."
        />

        <ContentSection title="How to Reduce Hint Dependence" id="reduce-hint-dependence">
          <BodyText>
            A useful medium-level rule is two real attempts before one hint.
            Reveal only one hint level, then retry immediately. This keeps your
            reasoning engaged while still preventing long dead ends. Hint use at
            this level should unblock structure, not replace it.
          </BodyText>
          <BodyText>
            Another useful rule is to describe the clue type before you reveal a
            hint. Even if your guess is wrong, that moment of commitment trains
            better self-diagnosis. You are not only solving clues. You are also
            learning how your own solving process fails.
          </BodyText>
          <BodyText>
            The goal is not zero hints at all costs. The goal is strategic help.
            If one hint gets you back into active solving, it is useful. If
            three hints turn the clue into passive reading, the learning value
            drops sharply.
          </BodyText>
        </ContentSection>

        <ContentSection title="When to Try Hard Clues" id="when-to-try-hard-clues">
          <BodyText>
            Move into hard clues when you can usually explain a medium solve in
            full and when missed clues feel like specific errors rather than
            total confusion. Hard practice works best when it exposes a narrow
            weakness, not when it overwhelms your whole process.
          </BodyText>
          <BodyText>
            A useful sign of readiness is emotional, not just technical. If you
            can miss a medium clue, review it, and immediately understand what
            went wrong, you are in a good position to learn from harder clues as
            well.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Medium-Level Review Routine" id="medium-review-routine">
          <BodyText>
            After each medium clue, ask four questions. What was the likely
            definition? What clue type did I think this was? What evidence did I
            trust too early? What one thing would I do differently on a similar
            clue next time? These questions turn review from passive reading
            into active calibration.
          </BodyText>
          <BodyText>
            Medium-level progress often comes from making fewer repeated errors,
            not from discovering entirely new theory. That is why a short review
            routine pays off so well here.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Medium Practice Builds Long-Term Accuracy" id="medium-builds-accuracy">
          <BodyText>
            Medium clues are where you start proving that your solving process is
            reliable rather than lucky. They are difficult enough to punish weak
            habits, but still fair enough to teach you something specific after
            review. That balance makes them one of the best long-term training
            zones on the site.
          </BodyText>
          <BodyText>
            If you spend time here consistently, you usually notice a change in
            the quality of your misses. Instead of feeling lost, you start
            seeing exactly what kind of clue decision failed. That is a real
            improvement signal.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use Medium Clues in Mixed Sessions" id="medium-in-mixed-sessions">
          <BodyText>
            A strong mixed session often starts with one easy clue, continues
            with two medium clues, and ends with either a review note or one
            carefully chosen hard clue. Medium clues sit in the center of that
            session because they translate theory into pressure-tested practice.
          </BodyText>
          <BodyText>
            Use this page when you want archive practice that still teaches you
            something concrete every day, not just challenge for its own sake.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Medium-Level Errors to Watch For" id="medium-level-errors">
          <BodyText>
            The classic medium-level mistake is mistaking recognition for proof.
            You may spot that a clue feels like a container or charade, then
            stop checking whether the letters, order, and definition all support
            the same answer. Medium clues punish that shortcut more reliably
            than easy ones.
          </BodyText>
          <BodyText>
            Another frequent error is abandoning the clue too early because it
            no longer feels obvious. Medium practice works best when you stay
            patient for one more round of structured reading before reaching for
            a hint. That extra pass is often where the mechanism finally
            becomes visible.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Medium Clues Prepare You for Harder Solving" id="medium-prepares-you-for-harder-solving">
          <BodyText>
            Medium clues are the best bridge to advanced practice because they
            teach pressure without chaos. They force you to tighten your
            standards while still giving you enough structure to learn from the
            result. That is a better training environment than jumping straight
            from easy to hard and hoping intensity alone will improve you.
          </BodyText>
          <BodyText>
            If you build consistency here, harder archive work becomes much more
            productive. You start carrying forward clue-type awareness,
            definition discipline, and better review habits instead of trying to
            invent those skills under maximum difficulty.
          </BodyText>
        </ContentSection>

        <ContentSection title="Medium Minute Cryptic FAQ" id="medium-minute-cryptic-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/minute-cryptic/easy",
              title: "Easy clues",
              description:
                "Drop back to easier sets when you want tighter repetition on fundamentals.",
            },
            {
              href: "/minute-cryptic/hard",
              title: "Hard clues",
              description:
                "Step up once medium clue proof feels consistent and controlled.",
            },
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Sharpen the signal words that help medium-level parsing become faster.",
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
