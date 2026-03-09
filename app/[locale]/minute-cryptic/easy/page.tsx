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
    question: "Are easy cryptic clues good for beginners?",
    answer:
      "Yes. Easy clues give you enough structure to learn clue mechanics without overwhelming you with too many competing signals.",
  },
  {
    question: "How many easy clues should I solve in one session?",
    answer:
      "Three to five clues is a strong session length. It gives repetition without turning review into fatigue.",
  },
  {
    question: "Should I use all the hints on easy clues?",
    answer:
      "No. Try one hint level at a time. Easy clues are most useful when they still require active solving.",
  },
  {
    question: "What should I do after finishing easy clues?",
    answer:
      "Move into medium clues or practice a clue-type page that matches the patterns you just encountered.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "EasyMinuteCryptic",
    title: "Easy Minute Cryptic Clues: Beginner-Friendly Practice Online",
    description:
      "Practice easy minute cryptic clues with hints, answer checks, and explanations designed for beginners.",
    keywords: [
      "easy minute cryptic clues",
      "easy cryptic clues",
      "beginner cryptic practice",
      "easy minute cryptic archive",
    ],
    locale: locale as Locale,
    path: "/minute-cryptic/easy",
    canonicalUrl: "/minute-cryptic/easy",
  });
}

export default async function EasyMinuteCrypticPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getMinuteCrypticsByDifficulty("easy");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "Easy Minute Cryptic Clues", url: `${BASE_URL}/minute-cryptic/easy` },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Easy Minute Cryptic Clues",
          description:
            "A beginner-friendly archive of easy minute cryptic clues for building confidence and clue-reading habits.",
          url: `${BASE_URL}/minute-cryptic/easy`,
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
        title="Easy Minute Cryptic Clues"
        description="Easy minute cryptic clues are the best place to build confidence. They usually have clearer structure, more visible clue types, and explanations that make the solving method easier to absorb."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-makes-a-minute-cryptic-easy", label: "What makes a clue easy?" },
            { href: "#best-easy-clue-types", label: "Best easy clue types" },
            { href: "#build-skill-with-easy-clues", label: "Build skill with easy clues" },
            { href: "#beginner-practice-method", label: "Beginner practice method" },
            { href: "#easy-minute-cryptic-archive", label: "Easy archive" },
            { href: "#move-up-to-medium", label: "When to move up to medium" },
            { href: "#five-day-easy-routine", label: "Five-day easy routine" },
            { href: "#easy-minute-cryptic-faq", label: "Easy clue FAQ" },
          ]}
        />

        <ContentSection title="What Makes a Minute Cryptic Easy?" id="what-makes-a-minute-cryptic-easy">
          <BodyText>
            Easy clues are not trivial clues. They are clues with cleaner
            structure, lighter ambiguity, and a more obvious route to proof.
            They still train real cryptic skills. The difference is that they
            make the mechanism easier to see, which lets beginners focus on
            habit-building instead of surviving confusion.
          </BodyText>
          <BodyText>
            In practice, easy clues often feature more visible anagrams or
            charades, shorter reasoning chains, and clearer definition
            boundaries. That makes them excellent practice material.
          </BodyText>
        </ContentSection>

        <ContentSection title="Best Easy Clue Types for Beginners" id="best-easy-clue-types">
          <BodyText>
            Easy anagrams are great because letter count and indicator language
            provide multiple checks. Easy charades are also strong because they
            teach segmentation and assembly without introducing too much
            structural ambiguity. If you want the fastest confidence gain, start
            with those two families and review each explanation carefully.
          </BodyText>
          <BodyText>
            That does not mean other clue types should be avoided. It means
            your first practice wins usually come from mechanisms that show
            their structure more clearly. Once easy anagrams and charades start
            feeling controlled, container and double-definition clues become
            much easier to approach without panic.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use Easy Clues to Build Skill" id="build-skill-with-easy-clues">
          <BodyText>
            Solve first, hint second. Review the explanation after each clue and
            write down one pattern you recognized. Work in short blocks of
            three to five clues. That is enough repetition to build memory
            without lowering your standard of proof.
          </BodyText>
          <BodyText>
            Easy clues are not just warm-ups. They are where your definition
            habits, indicator habits, and count discipline become automatic.
          </BodyText>
          <BodyText>
            This is why easy practice deserves real attention. If you rush
            through easy clues because they look manageable, you lose the best
            environment for building clean habits. Easy clues should feel
            controlled, not disposable.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Beginner-Friendly Practice Method" id="beginner-practice-method">
          <BodyText>
            Use a solve-first, hint-second rhythm. Read the clue once for
            surface meaning and once for structure. Mark the likely definition,
            check the answer length, then make one serious attempt before using
            any help. If you do reveal a hint, reveal only one level and retry
            immediately.
          </BodyText>
          <BodyText>
            This method keeps easy clues educational. The point is not to finish
            them as quickly as possible. The point is to turn them into repeated
            demonstrations of correct solving behavior.
          </BodyText>
        </ContentSection>

        <ContentSection title="What You Should Learn From Easy Clues" id="learn-from-easy-clues">
          <BodyText>
            Easy clues teach three things particularly well: where definitions
            often sit, how clue types announce themselves, and how answer length
            eliminates weak candidates. If you come away from an easy clue with
            a better sense of those three habits, the clue did its job.
          </BodyText>
          <BodyText>
            Over time, this matters more than raw solve count. Quantity without
            transfer creates shallow confidence. Repeated pattern recognition
            creates real skill.
          </BodyText>
          <BodyText>
            Easy clue sessions are also where you should build your review
            language. After each clue, try naming the clue type, the likely
            definition, and the mistake you almost made. That kind of short
            reflection is what turns easy practice into long-term improvement.
          </BodyText>
        </ContentSection>

        <DifficultyArchiveList
          id="easy-minute-cryptic-archive"
          puzzles={puzzles}
          title="Easy Minute Cryptic Archive"
          intro="Use this archive when you want steady, low-friction practice. The newest easy clues appear first so you can move from recent material into older examples without losing continuity."
        />

        <ContentSection title="When to Move Up to Medium" id="move-up-to-medium">
          <BodyText>
            Move up when you can solve most easy clues with limited hints and
            can explain why your answer works. If you are still finding answers
            by instinct alone, stay with easy sets a little longer. Reliable
            proof should come before speed.
          </BodyText>
          <BodyText>
            A useful benchmark is not "I got the answer." It is "I could explain
            the clue type, the definition, and the path to the answer without
            needing the official note in front of me." That is when medium clues
            start becoming useful rather than discouraging.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Five-Day Easy Clue Routine" id="five-day-easy-routine">
          <BodyText>
            Day one: solve three easy clues and focus only on definition
            boundaries. Day two: solve three more and identify the clue type
            before you submit. Day three: use no more than one hint per clue.
            Day four: review the explanations and note one repeated mistake.
            Day five: mix one easy clue from the archive with today's clue so
            you can compare controlled practice against live play.
          </BodyText>
          <BodyText>
            This routine works because it gives each day a small emphasis rather
            than asking you to improve everything at once. Easy practice is most
            powerful when the review goal is specific.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="Why Easy Clues Still Matter for Experienced Solvers"
          id="why-easy-clues-still-matter"
        >
          <BodyText>
            Easy clues are not only for beginners. They are also useful warm-up
            material for experienced solvers who want to sharpen pattern
            recognition before moving into harder sets. Because the structure is
            cleaner, easy clues let you check whether your fundamentals are
            still crisp.
          </BodyText>
          <BodyText>
            That matters because advanced solving can sometimes drift into habit
            and overconfidence. Returning to easy clues is a good way to verify
            that your basics still hold up when the clue looks simple.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="How to Turn Easy Practice Into Better Archive Sessions"
          id="easy-practice-into-archive-sessions"
        >
          <BodyText>
            The best way to use this page is not to stay here forever. Use it as
            a base. Build confidence on easier material, then move into mixed
            archive sessions where easy clues appear beside medium ones. That is
            how the solving habits you develop here start to transfer.
          </BodyText>
          <BodyText>
            A strong archive session often begins with one or two easy clues,
            then moves upward in difficulty only after your structure-reading is
            already active. This page is designed to support that progression.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Mistakes Solvers Make on Easy Clues" id="easy-clue-mistakes">
          <BodyText>
            The biggest mistake is treating easy clues as disposable. Solvers
            sometimes skim them, guess from surface meaning, then move on once
            the answer appears. That wastes the exact kind of clean repetition
            that easy clues are built to provide.
          </BodyText>
          <BodyText>
            Another common error is using too many hints too quickly because the
            clue looks short. Easy clues should train your first response to be
            structural: identify the definition, notice the answer length, and
            test the most likely clue type before you reveal anything.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Easy Clues Prepare You for the Whole Site" id="easy-clues-prepare-you">
          <BodyText>
            This page is the front door to the wider archive. The goal is not
            to keep you in permanent beginner mode. The goal is to give you a
            stable base so that later clues feel challenging for the right
            reasons rather than simply chaotic.
          </BodyText>
          <BodyText>
            If you can solve easy clues with a repeatable process, you will get
            more value from today's clue, more value from clue-type pages, and
            more value from medium archive sessions. Easy practice is where the
            site's other learning pages start to connect into one useful system.
          </BodyText>
        </ContentSection>

        <ContentSection title="Easy Minute Cryptic FAQ" id="easy-minute-cryptic-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-crossword-for-beginners",
              title: "Beginner guide",
              description:
                "Review the full beginner workflow before running longer easy sets.",
            },
            {
              href: "/cryptic-clue-types",
              title: "Clue types",
              description:
                "Compare the clue families that show up most often in easier practice sets.",
            },
            {
              href: "/minute-cryptic/medium",
              title: "Medium clues",
              description:
                "Step up once your easy clue solves start feeling controlled and repeatable.",
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
