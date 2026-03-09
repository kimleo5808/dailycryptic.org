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
    question: "Are hard clues worth doing if I fail often?",
    answer:
      "Yes, as long as you review them properly. Hard clues expose weak habits very efficiently, especially in definition control and proof discipline.",
  },
  {
    question: "Should advanced solvers still use hints?",
    answer:
      "Yes. Hints are still useful when they unblock structure without replacing the solve. Controlled help is not a sign of weak solving.",
  },
  {
    question: "How should I review a missed clue?",
    answer:
      "Compare your failed approach to the published explanation and identify whether the miss came from definition reading, mechanism reading, count, or order.",
  },
  {
    question: "Do hard clues improve skill faster than easy clues?",
    answer:
      "They improve different things. Hard clues improve precision and resilience, while easy clues improve fluency and repetition. Both matter.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "HardMinuteCryptic",
    title: "Hard Minute Cryptic Clues: Advanced Daily Practice with Explanations",
    description:
      "Challenge yourself with hard minute cryptic clues and use explanations to improve advanced solving technique.",
    keywords: [
      "hard minute cryptic clues",
      "hard cryptic clues",
      "advanced cryptic practice",
    ],
    locale: locale as Locale,
    path: "/minute-cryptic/hard",
    canonicalUrl: "/minute-cryptic/hard",
  });
}

export default async function HardMinuteCrypticPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzles = await getMinuteCrypticsByDifficulty("hard");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Hard Minute Cryptic Clues",
            url: `${BASE_URL}/minute-cryptic/hard`,
          },
        ])}
      />
      <JsonLd
        data={collectionPageSchema({
          name: "Hard Minute Cryptic Clues",
          description:
            "An archive of hard minute cryptic clues for advanced review, higher precision, and tougher solving practice.",
          url: `${BASE_URL}/minute-cryptic/hard`,
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
        title="Hard Minute Cryptic Clues"
        description="Hard minute cryptic clues reward precision, patience, and disciplined review. Even missed solves can create strong improvement if you analyze them properly."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-makes-a-clue-hard", label: "What makes a clue hard?" },
            { href: "#experienced-solvers-approach", label: "How experienced solvers approach hard clues" },
            { href: "#persist-or-use-a-hint", label: "When to persist or use a hint" },
            { href: "#hard-minute-cryptic-archive", label: "Hard archive" },
            { href: "#review-failed-solves", label: "How to review failed solves" },
            { href: "#why-hard-clues-are-worth-practicing", label: "Why hard clues are worth practicing" },
            { href: "#hard-review-framework", label: "Hard-clue review framework" },
            { href: "#hard-minute-cryptic-faq", label: "Hard clue FAQ" },
          ]}
        />

        <ContentSection title="What Makes a Clue Hard?" id="what-makes-a-clue-hard">
          <BodyText>
            Hard clues usually combine tighter definition control, subtler
            surface misdirection, and a higher penalty for small parse errors.
            The clue is still fair, but it tolerates less loose thinking.
            Solvers often feel the difference not because the clue type is
            unknown, but because the clue demands much cleaner execution.
          </BodyText>
          <BodyText>
            That is why hard practice should not be measured only by win rate. A
            well-reviewed hard miss can teach more than an easy unexamined
            solve.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Experienced Solvers Approach Hard Clues" id="experienced-solvers-approach">
          <BodyText>
            Experienced solvers prioritize structure before confidence and proof
            before speed. They do not treat surface elegance as evidence. They
            test definitions carefully, insist on mechanical fit, and stay
            willing to reset when a clue path becomes shaky.
          </BodyText>
          <BodyText>
            This mindset matters because hard clues often generate strong but
            misleading intuitions. Precision protects you from following those
            intuitions too far.
          </BodyText>
          <BodyText>
            Hard clues are also where calmness matters. If you become too eager
            to force progress, you usually make the clue worse. The best
            advanced solvers know when to pause, reset, and rebuild the clue
            from first principles.
          </BodyText>
        </ContentSection>

        <ContentSection title="When to Persist and When to Use a Hint" id="persist-or-use-a-hint">
          <BodyText>
            A good rule for hard clues is one structured reset before hint use.
            Re-evaluate the definition boundary, re-read the likely indicator,
            and check enumeration again. If the clue still has no coherent path,
            reveal one hint level and retry immediately. Hints should unblock,
            not replace, the solve.
          </BodyText>
          <BodyText>
            This matters because hard clues can easily consume too much time if
            you stay attached to one bad answer path. A reset is not giving up.
            It is part of advanced technique.
          </BodyText>
        </ContentSection>

        <DifficultyArchiveList
          id="hard-minute-cryptic-archive"
          puzzles={puzzles}
          title="Hard Minute Cryptic Archive"
          intro="Use this archive when you want advanced resistance and stronger review value. Hard clues are most useful when you treat explanation review as part of the solve, not as a separate afterthought."
        />

        <ContentSection title="How to Review Failed Solves" id="review-failed-solves">
          <BodyText>
            The best review question is not why did I miss in general. It is
            which step failed. Did you misread the definition, misidentify the
            mechanism, ignore letter count, or place parts in the wrong order?
            Specific diagnosis turns frustration into usable training data.
          </BodyText>
          <BodyText>
            After each hard clue, log one recurring weakness only. That keeps
            the review loop concrete and prevents overload.
          </BodyText>
          <BodyText>
            Good hard-clue review should feel analytical, not emotional. If the
            note you write after a failed clue is specific enough to influence
            the next solve, the miss was useful. If it is only a complaint about
            difficulty, the review has not yet done its job.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Hard Clues Are Worth Practicing" id="why-hard-clues-are-worth-practicing">
          <BodyText>
            Hard clues build resilience, precision, and post-solve honesty. They
            show whether your solving habits still work when the clue becomes
            less generous. For that reason, hard practice is valuable even when
            it lowers your success rate in the short term.
          </BodyText>
          <BodyText>
            They also stop the archive from becoming too comfortable. Advanced
            practice prevents your solving from turning into pattern-matching
            without proof. Used carefully, hard clues keep your standards high.
          </BodyText>
          <BodyText>
            Hard clues also create better review questions. When a clue resists
            you, it forces you to inspect your process more closely. That level
            of inspection is often where the most valuable adjustments happen.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use Hard Clues Without Burning Out" id="use-hard-clues-without-burning-out">
          <BodyText>
            The best approach is controlled exposure. Do not run a long block of
            hard clues unless you are deliberately training endurance. Instead,
            mix one hard clue into a session that also contains medium review or
            easier reinforcement. That keeps the session demanding without
            making it unproductive.
          </BodyText>
          <BodyText>
            Hard clues are most valuable when they sharpen your process, not
            when they simply exhaust your attention. The right amount is enough
            to challenge your habits while leaving enough energy to review the
            explanation properly afterward.
          </BodyText>
          <BodyText>
            If you notice that every hard clue session ends with random guessing,
            reduce the session size. Better one carefully reviewed hard clue than
            five clues that dissolve into noise.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Strong Hard-Clue Review Framework" id="hard-review-framework">
          <BodyText>
            After a difficult clue, write three notes only: what I thought the
            clue type was, where my parse first went wrong, and which signal I
            should have respected sooner. This creates a compact record of
            advanced mistakes without drowning you in detail.
          </BodyText>
          <BodyText>
            If you keep that habit over multiple hard clues, you start to see
            which problems repeat. That is the point where advanced practice
            becomes strategic instead of merely impressive.
          </BodyText>
        </ContentSection>

        <ContentSection title="When Hard Clues Start Paying Off" id="when-hard-clues-pay-off">
          <BodyText>
            Hard clues start paying off when your review becomes specific and
            transferable. If you can finish a difficult clue and identify one
            principle that will help on the next one, the session was productive
            even if the solve itself was messy.
          </BodyText>
          <BodyText>
            That is the real purpose of advanced archive work on a site like
            this. Not prestige. Not volume. Better standards, cleaner proof, and
            stronger self-diagnosis.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Mistakes Solvers Make on Hard Clues" id="hard-clue-mistakes">
          <BodyText>
            The most common advanced mistake is treating difficulty as a reason
            to lower standards. Solvers sometimes accept vague definitions,
            partial parses, or answers that only work emotionally because the
            clue feels tough. Hard clues punish that compromise sharply.
          </BodyText>
          <BodyText>
            Another common problem is overcommitting to the first clever idea.
            Hard clues often produce persuasive but wrong paths. If a clue stops
            making mechanical sense, the correct response is to reset, not to
            defend the original theory harder.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Hard Practice Fits Into a Weekly Routine" id="hard-practice-weekly-routine">
          <BodyText>
            Hard archive work is most effective when it sits inside a balanced
            week rather than dominating it. One or two hard clues surrounded by
            medium review and easier reinforcement usually teach more than long
            streaks of pure difficulty.
          </BodyText>
          <BodyText>
            That balance matters because advanced training is only useful if you
            can still review with clarity afterward. Use this page to stress-test
            your process, then return to medium or mixed practice so the lesson
            becomes repeatable instead of remaining a one-off struggle.
          </BodyText>
        </ContentSection>

        <ContentSection title="Hard Minute Cryptic FAQ" id="hard-minute-cryptic-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/minute-cryptic/medium",
              title: "Medium clues",
              description:
                "Return to medium sets when you want cleaner repetition between harder sessions.",
            },
            {
              href: "/cryptic-indicators",
              title: "Cryptic indicators",
              description:
                "Tighten your signal reading to reduce wasted time in harder clues.",
            },
            {
              href: "/minute-cryptic",
              title: "Full archive",
              description:
                "Switch between dates, clue types, and difficulty levels to vary your practice load.",
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
