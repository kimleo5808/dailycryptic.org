import {
  BodyText,
  CalloutBox,
  ContentHero,
  ContentSection,
  IndicatorTagList,
  RelatedLinks,
  SimpleFaq,
  SubHeading,
  TableOfContents,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;
const CONTENT_PUBLISHED_AT = "2026-03-09";

const FAQ_ITEMS = [
  {
    question: "What is an indicator in a cryptic clue?",
    answer:
      "An indicator is a word or phrase that signals what kind of wordplay operation the clue is using, such as rearranging, inserting, reversing, or deleting letters.",
  },
  {
    question: "Can one word act as more than one kind of indicator?",
    answer:
      "Yes. Indicator meaning depends on clue context. A word that suggests movement in one clue might suggest reversal or another operation in a different construction.",
  },
  {
    question: "Should I solve from the indicator first or the definition first?",
    answer:
      "Usually both together. A likely indicator narrows the mechanism, while a likely definition keeps you from forcing the wrong answer.",
  },
  {
    question: "Do all cryptic clues have indicators?",
    answer:
      "Not always in an obvious form. Some clue families, especially double definitions, rely less on explicit indicator language than mechanical clue types do.",
  },
];

const INDICATOR_OVERVIEW = [
  {
    id: "anagram-indicators",
    label: "Anagram",
    color: "blue" as const,
    summary: "Signal that letters should be rearranged.",
    examples: ["mixed", "wild", "broken"],
  },
  {
    id: "container-indicators",
    label: "Container",
    color: "green" as const,
    summary: "Signal that one part goes inside another.",
    examples: ["in", "around", "holding"],
  },
  {
    id: "reversal-indicators",
    label: "Reversal",
    color: "orange" as const,
    summary: "Signal that letters are read backwards.",
    examples: ["back", "returned", "reversed"],
  },
  {
    id: "deletion-indicators",
    label: "Deletion",
    color: "purple" as const,
    summary: "Signal that one or more letters are removed.",
    examples: ["without", "losing", "headless"],
  },
  {
    id: "hidden-word-indicators",
    label: "Hidden Word",
    color: "teal" as const,
    summary: "Signal that the answer hides inside the clue text.",
    examples: ["some of", "in", "part of"],
  },
  {
    id: "homophone-indicators",
    label: "Homophone",
    color: "default" as const,
    summary: "Signal that the answer sounds like another word.",
    examples: ["heard", "reportedly", "we hear"],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "CrypticIndicators",
    title: "Cryptic Indicators: Common Words That Signal the Wordplay",
    description:
      "A practical guide to cryptic indicators, including anagram, container, reversal, deletion, hidden-word, and homophone signals.",
    keywords: [
      "cryptic indicators",
      "cryptic clue indicators",
      "anagram indicators",
      "container indicators",
    ],
    locale: locale as Locale,
    path: "/cryptic-indicators",
    canonicalUrl: "/cryptic-indicators",
  });
}

export default async function CrypticIndicatorsPage({
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
          { name: "Cryptic Indicators", url: `${BASE_URL}/cryptic-indicators` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: "Cryptic Indicators: Common Words That Signal the Wordplay",
          description:
            "A practical guide to cryptic indicators, including anagram, container, reversal, deletion, hidden-word, and homophone signals.",
          url: `${BASE_URL}/cryptic-indicators`,
          datePublished: CONTENT_PUBLISHED_AT,
          dateModified: CONTENT_PUBLISHED_AT,
        })}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      <ContentHero
        eyebrow="Reference Guide"
        title="Cryptic Indicators"
        description="Indicators are the signal words that tell you what kind of wordplay to test. They do not solve the clue for you, but they make your solving much more disciplined and much less random."
      />

      <div className="mt-8 space-y-8">
        <TableOfContents
          items={[
            { href: "#what-are-cryptic-indicators", label: "What are cryptic indicators?" },
            { href: "#why-indicators-matter", label: "Why indicators matter" },
            { href: "#anagram-indicators", label: "Anagram indicators" },
            { href: "#container-indicators", label: "Container indicators" },
            { href: "#reversal-indicators", label: "Reversal indicators" },
            { href: "#deletion-indicators", label: "Deletion indicators" },
            { href: "#hidden-word-indicators", label: "Hidden word indicators" },
            { href: "#homophone-indicators", label: "Homophone indicators" },
            { href: "#use-indicators-without-guessing", label: "Use indicators without guessing" },
            { href: "#cryptic-indicators-faq", label: "Indicators FAQ" },
          ]}
        />

        {/* Quick-reference overview grid */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Quick Reference: 6 Indicator Types
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Jump to any section below, or use these cards as a fast reminder while solving.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDICATOR_OVERVIEW.map((ind) => (
              <a
                key={ind.id}
                href={`#${ind.id}`}
                className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground">{ind.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {ind.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ind.examples.map((ex) => (
                    <span
                      key={ex}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <ContentSection title="What Are Cryptic Indicators?" id="what-are-cryptic-indicators">
          <BodyText>
            A cryptic indicator is a word or phrase that points toward the
            mechanism of the clue. It may tell you to rearrange letters, place
            one part inside another, reverse a string, drop letters, find a
            hidden run, or think of a sound-alike form. Indicators matter
            because they narrow the set of possible operations quickly.
          </BodyText>
          <CalloutBox type="warning" title="Indicators Are Contextual">
            A word that looks like a classic anagram signal in one clue might
            not be functioning as an indicator in another. You have to test
            indicator, structure, and definition together — never in isolation.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Why Indicators Matter" id="why-indicators-matter">
          <SubHeading>Turning Guessing Into Decision-Making</SubHeading>
          <BodyText>
            Indicators reduce blind guessing. If a clue contains language that
            strongly suggests rearrangement, you can test an anagram route first
            instead of trying unrelated operations. If it suggests insertion,
            you know to look for inner and outer parts. This turns clue solving
            into a sequence of decisions rather than a search for inspiration.
          </BodyText>
          <SubHeading>The Beginner Foothold</SubHeading>
          <BodyText>
            Indicators are especially useful for beginners because they provide
            an early foothold. When the surface reading feels misleading,
            indicator language often gives you the first reliable structural
            clue — a place to start rather than a blank page.
          </BodyText>
        </ContentSection>

        <ContentSection title="Anagram Indicators" id="anagram-indicators">
          <BodyText>
            Anagram indicators usually suggest change, disorder, movement, or
            instability. These signals tell you that the clue likely wants the
            fodder letters rebuilt into a new form.
          </BodyText>
          <IndicatorTagList
            tags={["mixed", "altered", "wild", "broken", "scrambled", "arranged", "confused", "upset", "chaotic", "troubled"]}
            color="blue"
          />
          <SubHeading>The Fodder Pairing Rule</SubHeading>
          <BodyText>
            The indicator alone is not enough. You still need to identify the
            correct fodder, verify the length, and confirm the definition. This
            pairing is important because anagram indicators are some of the
            easiest to over-trust — a clue can contain a lively word without
            actually instructing a rearrangement.
          </BodyText>
          <BodyText>
            A word only functions as an indicator when it actually directs a
            letter transformation inside that specific clue. Good solving means
            matching the indicator to the actual grammar of the clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="Container Indicators" id="container-indicators">
          <BodyText>
            Container indicators suggest holding, surrounding, covering, or
            placing something inside something else.
          </BodyText>
          <IndicatorTagList
            tags={["in", "around", "within", "holding", "containing", "about", "inside", "surrounding", "swallowing", "embracing"]}
            color="green"
          />
          <SubHeading>Two Questions to Ask Immediately</SubHeading>
          <BodyText>
            When you see container language, ask two questions right away: what
            is the shell, and what is being inserted? That habit solves many
            container clues faster than hunting for the answer directly.
          </BodyText>
          <SubHeading>Direction Matters</SubHeading>
          <BodyText>
            Container indicators often also imply direction, which matters a lot
            because A around B is not the same thing as B around A. These
            indicators train directional reading — not just spotting a family
            label, but extracting positional information from the clue text.
          </BodyText>
        </ContentSection>

        <ContentSection title="Reversal Indicators" id="reversal-indicators">
          <BodyText>
            Reversal indicators suggest turning back or reversing direction.
            These signals matter because reversal is often a small operation
            with a large impact on the final answer.
          </BodyText>
          <IndicatorTagList
            tags={["back", "returned", "reversed", "turned", "reflected", "about-turn", "going west", "from the east"]}
            color="orange"
          />
          <SubHeading>Across vs. Down Clues</SubHeading>
          <BodyText>
            In grid crosswords, directional language differs for across and down
            clues — "going up" signals reversal for a down answer but not an
            across one. In minute cryptic puzzles, the phrasing usually makes
            the direction unambiguous, but it is worth noting.
          </BodyText>
          <BodyText>
            Learning reversal signals also improves your wider cryptic literacy.
            It helps you distinguish clues that build letters forward from clues
            that ask you to flip the structure.
          </BodyText>
        </ContentSection>

        <ContentSection title="Deletion Indicators" id="deletion-indicators">
          <BodyText>
            Deletion indicators suggest removing or losing part of a word.
          </BodyText>
          <IndicatorTagList
            tags={["without", "dropping", "losing", "headless", "endless", "decapitated", "curtailed", "cut short"]}
            color="purple"
          />
          <SubHeading>Small Operations, Real Impact</SubHeading>
          <BodyText>
            Deletion indicators are useful to study early because they teach a
            valuable general lesson: clue operations can be very small. The clue
            may only remove one letter while leaving the rest untouched. You do
            not always need a dramatic transformation for a clue to be cryptic.
          </BodyText>
          <BodyText>
            These clues reward close attention because the specific letter being
            removed — first, last, or somewhere in the middle — changes the
            answer completely.
          </BodyText>
        </ContentSection>

        <ContentSection title="Hidden Word Indicators" id="hidden-word-indicators">
          <BodyText>
            Hidden word indicators imply that the answer lies inside a larger
            phrase, spelled out across adjacent letters in the clue.
          </BodyText>
          <IndicatorTagList
            tags={["in", "part of", "contained in", "some of", "hidden in", "within", "found in", "embedded in"]}
            color="teal"
          />
          <SubHeading>Training Visual Precision</SubHeading>
          <BodyText>
            Hidden-word practice is useful because it teaches you to respect
            contiguous letter runs. This sharpens visual discipline and helps
            prevent overly imaginative solving when the clue is actually much
            simpler than it appears.
          </BodyText>
          <BodyText>
            Notice that "in" appears here and in the container list. Context
            determines which operation it signals — another reason to test
            indicator and structure together rather than relying on one alone.
          </BodyText>
        </ContentSection>

        <ContentSection title="Homophone Indicators" id="homophone-indicators">
          <BodyText>
            Homophone indicators suggest hearing, saying, or sounding like
            another word. These clues rely on pronunciation rather than
            spelling, which makes them feel different from most letter-driven
            clue families.
          </BodyText>
          <IndicatorTagList
            tags={["heard", "reportedly", "we hear", "by the sound of it", "sounds like", "in speech", "orally", "they say"]}
            color="default"
          />
          <SubHeading>A Note on Accents</SubHeading>
          <BodyText>
            Pronunciation varies by accent and region, so homophone clues are
            best approached as fair sound approximations rather than as
            perfectly identical spoken forms. They also require humility — if
            a clue depends on a regional pronunciation you do not share,
            the published explanation will clarify the intended sound.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="How to Use Indicators Without Guessing Blindly"
          id="use-indicators-without-guessing"
        >
          <SubHeading>Combine Indicator and Definition</SubHeading>
          <BodyText>
            The best workflow is to combine indicator and definition, not to use
            either in isolation. Start by asking what the clue probably means,
            then ask what operation the clue seems to signal. If both point
            toward the same answer path, continue. If they conflict, your parse
            is probably weak.
          </BodyText>
          <SubHeading>Indicators Narrow the Field — They Do Not Replace Proof</SubHeading>
          <BodyText>
            Indicators can create false confidence. A clue may contain a word
            that looks like a known signal, but if the answer does not satisfy
            the full clue fairly, you still need to reject it.
          </BodyText>
          <CalloutBox type="tip" title="The Right Mental Model">
            Use indicators as a filter, not a shortcut. They help you ask better
            questions earlier. They do not give you permission to stop checking
            count, structure, and definition. Solvers who remember that use
            indicator knowledge well. Solvers who forget it become overconfident
            very quickly.
          </CalloutBox>
        </ContentSection>

        <ContentSection title="Cryptic Indicators FAQ" id="cryptic-indicators-faq">
          <SimpleFaq items={FAQ_ITEMS} />
        </ContentSection>

        <RelatedLinks
          links={[
            {
              href: "/cryptic-clue-types/anagram",
              title: "Anagram clues",
              description:
                "See how indicator language works inside a specific clue family.",
            },
            {
              href: "/cryptic-clue-types/container",
              title: "Container clues",
              description:
                "Practice insertion logic and indicator direction in detail.",
            },
            {
              href: "/how-to-play-minute-cryptic",
              title: "How to solve minute cryptic",
              description:
                "Apply indicator reading inside the full daily solving workflow.",
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
