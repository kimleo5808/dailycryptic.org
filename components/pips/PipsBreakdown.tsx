import {
  BodyText,
  ContentSection,
  SubHeading,
} from "@/components/minute-cryptic-content/ContentBlocks";
import { getPipsInsights, RULE_LABELS } from "@/lib/pips-insights";
import type { PipsDecodedPuzzle, PipsRegionType } from "@/types/pips";

const TIER_NAMES = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;
const RULE_ORDER: PipsRegionType[] = ["sum", "equals", "unequal", "greater", "less", "empty"];

function ruleSummary(counts: Partial<Record<PipsRegionType, number>>): string {
  return RULE_ORDER.filter((t) => counts[t])
    .map((t) => `${counts[t]} ${RULE_LABELS[t]}`)
    .join(", ");
}

/**
 * Archive comparison for a Pips answer page: domino counts per tier against
 * the archive, doubles, the mix of rule types and the rarer "all different"
 * rule. Placed below the solutions.
 */
export default function PipsBreakdown({
  puzzle,
  archive,
}: {
  puzzle: PipsDecodedPuzzle;
  archive: PipsDecodedPuzzle[];
}) {
  const data = getPipsInsights(puzzle, archive);
  const hard = data.tiers.find((t) => t.tier === "hard");

  return (
    <ContentSection title="Set Breakdown" id="breakdown">
      <BodyText>
        How this day&apos;s three boards compare with the {data.archiveSize} Pips
        puzzles in our archive.
      </BodyText>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Tier</th>
              <th className="py-2 pr-3 font-semibold">Dominoes</th>
              <th className="py-2 pr-3 font-semibold">Archive range</th>
              <th className="py-2 pr-3 font-semibold">Doubles</th>
              <th className="py-2 font-semibold">Rule regions</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {data.tiers.map((t) => (
              <tr key={t.tier} className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 font-semibold text-foreground">{TIER_NAMES[t.tier]}</td>
                <td className="py-2 pr-3">{t.dominoes}</td>
                <td className="py-2 pr-3">
                  {t.archiveMin}–{t.archiveMax}
                </td>
                <td className="py-2 pr-3">{t.doubles}</td>
                <td className="py-2">{ruleSummary(t.ruleCounts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubHeading>What stands out</SubHeading>
      <BodyText>
        {data.tiers
          .map((t) => {
            const name = TIER_NAMES[t.tier];
            if (t.dominoes === t.archiveMax) return `The ${name} board uses ${t.dominoes} dominoes, matching the largest ${name} board in our archive.`;
            if (t.dominoes === t.archiveMin) return `The ${name} board uses just ${t.dominoes} dominoes, matching the smallest ${name} board in our archive.`;
            return `The ${name} board uses ${t.dominoes} dominoes; ${t.fewerDominoesPct}% of ${name} boards in our archive use fewer.`;
          })
          .join(" ")}{" "}
        {hard?.biggestSum !== undefined
          ? `The biggest sum target on the Hard board is ${hard.biggestSum}. `
          : ""}
        {data.usesUnequal
          ? `This set also includes an "all different" rule, which appears in only ${data.unequalPuzzles} of the ${data.archiveSize} puzzles in our archive — every cell in that region must hold a different number.`
          : `Doubles (dominoes with the same number on both halves) slot neatly into "equal" regions, so try them there first.`}
      </BodyText>
    </ContentSection>
  );
}
