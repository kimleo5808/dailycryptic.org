import {
  ForgeDailySnapshotArchive,
  ForgeEditorialGuideSection,
  ForgeHero,
  ForgeKeywordNarrativeSection,
  ForgeOperationsManualSection,
  ForgeOverviewSections,
  ForgeRedeemAndTroubleshoot,
  ForgeUpdateLogAndFaq,
} from "@/components/forge/ForgeSections";

export default function ForgeHubPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col gap-8">
          <ForgeHero />
          <ForgeOverviewSections />
          <ForgeRedeemAndTroubleshoot />
          <ForgeUpdateLogAndFaq />
          <ForgeKeywordNarrativeSection />
          <ForgeEditorialGuideSection />
          <ForgeOperationsManualSection />
        </div>

        <div className="lg:sticky lg:top-20">
          <ForgeDailySnapshotArchive />
        </div>
      </div>
    </div>
  );
}
