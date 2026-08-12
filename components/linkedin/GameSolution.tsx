import { LINKEDIN_GAME_BY_KEY } from "@/config/linkedin-games";
import type { DecodedLinkedInDay, LinkedInGameKey } from "@/types/linkedin";
import CrossclimbLadder from "./CrossclimbLadder";
import PinpointReveal from "./PinpointReveal";
import QueensBoard from "./QueensBoard";
import TangoGrid from "./TangoGrid";
import ZipGrid from "./ZipGrid";
import { HintList, SolutionReveal } from "./Reveal";

/**
 * Answer block for one game on one day: hints first, then the solution behind
 * a reveal gate. Rendered above the evergreen copy on both today and archive
 * pages.
 */
export default function GameSolution({
  game,
  day,
  dateLabel,
}: {
  game: LinkedInGameKey;
  day: DecodedLinkedInDay;
  dateLabel: string;
}) {
  const meta = LINKEDIN_GAME_BY_KEY[game];
  const data = day[game];
  if (!data) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Today&apos;s {meta.name} answer is being verified and will appear here
        shortly.
      </p>
    );
  }

  const puzzleLabel =
    data.puzzleNumber !== undefined ? `#${data.puzzleNumber}` : dateLabel;

  let board: React.ReactNode = null;
  if (game === "queens" && day.queens) board = <QueensBoard puzzle={day.queens} />;
  if (game === "zip" && day.zip) board = <ZipGrid puzzle={day.zip} />;
  if (game === "tango" && day.tango) board = <TangoGrid puzzle={day.tango} />;

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {meta.name} hints for {dateLabel}
        </h2>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
          {puzzleLabel}
        </span>
      </div>

      <HintList hints={data.hints} />

      {game === "pinpoint" && day.pinpoint ? (
        <PinpointReveal puzzle={day.pinpoint} />
      ) : game === "crossclimb" && day.crossclimb ? (
        <CrossclimbLadder puzzle={day.crossclimb} />
      ) : board ? (
        <SolutionReveal
          label={`Reveal the ${meta.name} solution`}
          accentClass={meta.accent}
        >
          {board}
        </SolutionReveal>
      ) : null}
    </section>
  );
}
