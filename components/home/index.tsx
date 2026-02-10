import {
  ForgeHero,
  ForgeKeywordNarrativeSection,
  ForgeOverviewSections,
  ForgeRedeemAndTroubleshoot,
  ForgeUpdateLogAndFaq,
} from "@/components/forge/ForgeSections";

export default function HomeComponent() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <ForgeHero />
      <ForgeOverviewSections />
      <ForgeRedeemAndTroubleshoot />
      <ForgeUpdateLogAndFaq />
      <ForgeKeywordNarrativeSection />
    </div>
  );
}
