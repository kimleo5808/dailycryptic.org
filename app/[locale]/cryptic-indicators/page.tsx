import {
  BodyText,
  ContentHero,
  ContentSection,
  RelatedLinks,
  SimpleFaq,
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

        <ContentSection title="What Are Cryptic Indicators?" id="what-are-cryptic-indicators">
          <BodyText>
            A cryptic indicator is a word or phrase that points toward the
            mechanism of the clue. It may tell you to rearrange letters, place
            one part inside another, reverse a string, drop letters, find a
            hidden run, or think of a sound-alike form. Indicators matter
            because they narrow the set of possible operations quickly.
          </BodyText>
          <BodyText>
            The most important caution is that indicators are contextual. A word
            that looks like a classic anagram signal in one clue might not be
            functioning as an indicator in another. You have to test indicator,
            structure, and definition together.
          </BodyText>
        </ContentSection>

        <ContentSection title="Why Indicators Matter" id="why-indicators-matter">
          <BodyText>
            Indicators reduce blind guessing. If a clue contains language that
            strongly suggests rearrangement, you can test an anagram route first
            instead of trying unrelated operations. If it suggests insertion,
            you know to look for inner and outer parts. This turns clue solving
            into a sequence of decisions rather than a search for inspiration.
          </BodyText>
          <BodyText>
            They are especially useful for beginners because they provide an
            early foothold. When the surface reading feels misleading, indicator
            language often gives you the first reliable structural clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="Anagram Indicators" id="anagram-indicators">
          <BodyText>
            Anagram indicators usually suggest change, disorder, movement, or
            instability. Words like mixed, altered, wild, broken, scrambled, and
            arranged are common examples. These signals tell you that the clue
            likely wants the fodder letters rebuilt into a new form.
          </BodyText>
          <BodyText>
            The indicator alone is not enough. You still need to identify the
            correct fodder, verify the length, and confirm the definition. That
            is why anagram solving works best when indicator and letter count
            are checked together.
          </BodyText>
          <BodyText>
            This pairing is important because anagram indicators are some of the
            easiest to over-trust. A clue can contain a lively word without
            actually instructing a rearrangement. Good solving means matching
            the indicator to the actual grammar of the clue.
          </BodyText>
        </ContentSection>

        <ContentSection title="Container Indicators" id="container-indicators">
          <BodyText>
            Container indicators suggest holding, surrounding, covering, or
            placing something inside something else. Common signals include in,
            around, within, holding, containing, and about. They often also
            imply direction, which matters a lot because A around B is not the
            same thing as B around A.
          </BodyText>
          <BodyText>
            When you see this kind of language, ask two questions immediately:
            what is the shell, and what is being inserted? That one habit solves
            many container clues faster than hunting for the answer directly.
          </BodyText>
          <BodyText>
            Container indicators also train directional reading. You are not
            just spotting a family label. You are extracting positional
            information from the clue. That makes these indicators especially
            useful for strengthening structural discipline.
          </BodyText>
        </ContentSection>

        <ContentSection title="Reversal Indicators" id="reversal-indicators">
          <BodyText>
            Reversal indicators suggest turning back or reversing direction.
            Common examples include back, returned, reversed, and turned. These
            indicators matter because reversal is often a small operation with a
            large impact on the final answer.
          </BodyText>
          <BodyText>
            Even when reversal is not the main focus of your current archive,
            learning its signals improves your wider cryptic literacy. It helps
            you distinguish clues that build letters forward from clues that ask
            you to flip the structure.
          </BodyText>
        </ContentSection>

        <ContentSection title="Deletion Indicators" id="deletion-indicators">
          <BodyText>
            Deletion indicators suggest removing or losing part of a word. Words
            like without, dropping, losing, headless, or endless often perform
            this function. These clues reward close attention because the clue
            may only remove one letter while leaving the rest untouched.
          </BodyText>
          <BodyText>
            Deletion indicators are useful to study early because they teach a
            useful general lesson: clue operations can be very small. You do not
            always need a dramatic transformation for a clue to be cryptic.
          </BodyText>
        </ContentSection>

        <ContentSection title="Hidden Word Indicators" id="hidden-word-indicators">
          <BodyText>
            Hidden word indicators imply that the answer lies inside a larger
            phrase. Common signals include in, part of, contained in, some of,
            and hidden in. These clues train close scanning and exact letter
            matching rather than abstract transformation.
          </BodyText>
          <BodyText>
            Hidden-word practice is useful because it teaches you to respect
            contiguous letter runs. This sharpens visual discipline and helps
            prevent overly imaginative solving when the clue is actually much
            simpler than it appears.
          </BodyText>
        </ContentSection>

        <ContentSection title="Homophone Indicators" id="homophone-indicators">
          <BodyText>
            Homophone indicators suggest hearing, saying, or sounding like
            another word. Examples include heard, reportedly, we hear, and by
            the sound of it. These clues rely on pronunciation rather than
            spelling, which makes them feel different from most letter-driven
            clue families.
          </BodyText>
          <BodyText>
            They also require humility. Pronunciation varies by accent and
            region, so homophone clues are best approached as fair sound
            approximations rather than as perfectly identical spoken forms.
          </BodyText>
        </ContentSection>

        <ContentSection
          title="How to Use Indicators Without Guessing Blindly"
          id="use-indicators-without-guessing"
        >
          <BodyText>
            The best workflow is to combine indicator and definition, not to use
            either in isolation. Start by asking what the clue probably means,
            then ask what operation the clue seems to signal. If both point
            toward the same answer path, continue. If they conflict, your parse
            is probably weak.
          </BodyText>
          <BodyText>
            This discipline matters because indicators can create false
            confidence. A clue may contain a word that looks like a known
            signal, but if the answer does not satisfy the full clue fairly, you
            still need to reject it. Indicators narrow the field; they do not
            replace proof.
          </BodyText>
          <BodyText>
            The best long-term use of indicators is as a filter, not as a
            shortcut. They help you ask better questions earlier. They do not
            give you permission to stop checking count, structure, and
            definition. Solvers who remember that use indicator knowledge well.
            Solvers who forget it become overconfident very quickly.
          </BodyText>
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
