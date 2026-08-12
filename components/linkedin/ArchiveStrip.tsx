import type { DecodedLinkedInDay } from "@/types/linkedin";
import Link from "next/link";

/** Recent-dates pill row linking into a game's archive pages. */
export default function ArchiveStrip({
  days,
  slug,
  gameName,
}: {
  days: DecodedLinkedInDay[];
  slug: string;
  gameName: string;
}) {
  if (days.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <Link
          key={day.date}
          href={`/${slug}/${day.date}`}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          {gameName}{" "}
          {new Date(day.date + "T12:00:00Z").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Link>
      ))}
    </div>
  );
}
