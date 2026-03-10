import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  DifficultyArchiveList,
  RelatedLinks,
  SimpleFaq,
  StepList,
  SubHeading,
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
          <SubHeading>Tighter Standards, Not Unfamiliar Types</SubHeading>
          <BodyText>
            Hard clues usually combine tighter definition control, subtler
            surface misdirection, and a higher penalty for small parse errors.
            The clue is still fair, but it tolerates less loose thinking.
            Solvers often feel the difference not because the clue type is
            unknown, but because the clue demands much cleaner execution.
          </BodyText>
          <SubHeading>A Well-Reviewed Miss Teaches More Than an Easy Win</SubHeading>
          <BodyText>
            That is why hard practice should not be measured only by win rate.
            A well-reviewed hard miss can teach more than an easy unexamined
            solve. The goal is not to succeed on every attempt — it is to
            extract useful information from every attempt.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Experienced Solvers Approach Hard Clues" id="experienced-solvers-approach">
          <SubHeading>Structure Before Confidence</SubHeading>
          <BodyText>
            Experienced solvers prioritize structure before confidence and proof
            before speed. They do not treat surface elegance as evidence. They
            test definitions carefully, insist on mechanical fit, and stay
            willing to reset when a clue path becomes shaky.
          </BodyText>
          <SubHeading>Precision Against Misleading Intuition</SubHeading>
          <BodyText>
            This mindset matters because hard clues often generate strong but
            misleading intuitions. Precision protects you from following those
            intuitions too far.
          </BodyText>
          <SubHeading>When to Pause and Rebuild</SubHeading>
          <BodyText>
            Hard clues are also where calmness matters. If you become too eager
            to force progress, you usually make the clue worse. The best
            advanced solvers know when to pause, reset, and rebuild the clue
            from first principles — and they do it without treating the reset as
            a failure.
          </BodyText>
        </ContentSection>

        <ContentSection title="When to Persist and When to Use a Hint" id="persist-or-use-a-hint">
          <SubHeading>One Structured Reset Before Hint Use</SubHeading>
          <BodyText>
            A good rule for hard clues is one structured reset before hint use.
            Re-evaluate the definition boundary, re-read the likely indicator,
            and check enumeration again.
          </BodyText>
          <CalloutBox type="tip" title="How to Use a Hint Well">
            If the clue still has no coherent path after resetting, reveal one
            hint level and retry immediately. Hints should unblock, not replace,
            the solve. A reset is not giving up — it is part of advanced
            technique.
          </CalloutBox>
        </ContentSection>

        <DifficultyArchiveList
          id="hard-minute-cryptic-archive"
          puzzles={puzzles}
          title="Hard Minute Cryptic Archive"
          intro="Use this archive when you want advanced resistance and stronger review value. Hard clues are most useful when you treat explanation review as part of the solve, not as a separate afterthought."
        />

        <ContentSection title="How to Review Failed Solves" id="review-failed-solves">
          <SubHeading>Specific Diagnosis Over General Frustration</SubHeading>
          <BodyText>
            The best review question is not "why did I miss in general?" It is
            "which step failed?" Did you misread the definition, misidentify the
            mechanism, ignore letter count, or place parts in the wrong order?
            Specific diagnosis turns frustration into usable training data.
          </BodyText>
          <CalloutBox type="tip" title="Log One Recurring Weakness Only">
            After each hard clue, write down one specific issue — not a general
            complaint about difficulty. If the note is specific enough to
            influence your next solve, the miss was useful. That is the standard
            to aim for.
          </CalloutBox>
          <SubHeading>Analytical, Not Emotional</SubHeading>
          <BodyText>
            Good hard-clue review should feel analytical. The information in a
            failed solve is only accessible if you can read it clearly. Emotion
            blocks that read. Calmness enables it.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Hard Clues Are Worth Practicing" id="why-hard-clues-are-worth-practicing">
          <SubHeading>Resilience, Precision, and Post-Solve Honesty</SubHeading>
          <BodyText>
            Hard clues build resilience, precision, and post-solve honesty. They
            show whether your solving habits still work when the clue becomes
            less generous. For that reason, hard practice is valuable even when
            it lowers your success rate in the short term.
          </BodyText>
          <SubHeading>Stopping the Archive From Becoming Too Comfortable</SubHeading>
          <BodyText>
            Advanced practice prevents your solving from turning into
            pattern-matching without proof. Used carefully, hard clues keep your
            standards high and your review questions sharp.
          </BodyText>
        </ContentSection>

        <ContentSection title="How to Use Hard Clues Without Burning Out" id="use-hard-clues-without-burning-out">
          <CalloutBox type="tip" title="Controlled Exposure Works Better Than Long Streaks">
            Mix one hard clue into a session that also contains medium review or
            easier reinforcement. That keeps the session demanding without making
            it unproductive. Hard clues are most valuable when they sharpen your
            process — not when they simply exhaust your attention.
          </CalloutBox>
          <SubHeading>The Right Amount</SubHeading>
          <BodyText>
            If you notice that every hard clue session ends with random guessing,
            reduce the session size. Better one carefully reviewed hard clue than
            five clues that dissolve into noise. The right amount is enough to
            challenge your habits while leaving enough energy to review the
            explanation properly afterward.
          </BodyText>
        </ContentSection>

        <ContentSection title="A Strong Hard-Clue Review Framework" id="hard-review-framework">
          <BodyText>
            After a difficult clue, write three notes only. This creates a
            compact record of advanced mistakes without drowning you in detail.
          </BodyText>
          <StepList
            items={[
              {
                title: "Note Your Initial Clue Type Read",
                description:
                  "Write what clue family you thought it was and why. This forces you to articulate an assumption that may have been invisible during the solve.",
              },
              {
                title: "Identify Where the Parse First Went Wrong",
                description:
                  "Was it the definition boundary, the mechanism, the letter count, or the word order? Name the exact step, not the general feeling.",
              },
              {
                title: "Name the Signal You Should Have Noticed Sooner",
                description:
                  "Pick one indicator word or structural element that would have redirected your thinking earlier. This is your takeaway for the next clue.",
              },
            ]}
          />
          <SubHeading>When This Framework Starts Paying Off</SubHeading>
          <BodyText>
            If you keep that habit over multiple hard clues, you start to see
            which problems repeat. That is the point where advanced practice
            becomes strategic instead of merely impressive. Hard clues start
            paying off when your review becomes specific and transferable — not
            prestige, not volume, but better standards and cleaner proof.
          </BodyText>
        </ContentSection>

        <ContentSection title="Common Mistakes Solvers Make on Hard Clues" id="hard-clue-mistakes">
          <CalloutBox type="warning" title="Advanced Traps to Avoid">
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Accepting vague definitions or partial parses because the clue "feels" hard</li>
              <li>Overcommitting to the first clever idea that appears</li>
              <li>Defending a wrong theory harder instead of resetting</li>
              <li>Treating difficulty as a reason to lower proof standards</li>
            </ul>
          </CalloutBox>
          <SubHeading>Hard Clues Punish Compromise</SubHeading>
          <BodyText>
            Hard clues often produce persuasive but wrong paths. The correct
            response when a clue stops making mechanical sense is to reset —
            not to defend the original theory. That is one of the clearest
            differences between intermediate and advanced solving behaviour.
          </BodyText>
        </ContentSection>

        <ContentSection title="How Hard Practice Fits Into a Weekly Routine" id="hard-practice-weekly-routine">
          <SubHeading>Balance Over Dominance</SubHeading>
          <BodyText>
            Hard archive work is most effective when it sits inside a balanced
            week rather than dominating it. One or two hard clues surrounded by
            medium review and easier reinforcement usually teach more than long
            streaks of pure difficulty.
          </BodyText>
          <SubHeading>Make the Lesson Repeatable</SubHeading>
          <BodyText>
            That balance matters because advanced training is only useful if you
            can still review with clarity afterward. Use this page to
            stress-test your process, then return to medium or mixed practice
            so the lesson becomes repeatable instead of remaining a one-off
            struggle.
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
