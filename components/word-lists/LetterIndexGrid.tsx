import Link from "next/link";
import { cn } from "@/lib/utils";
import { LETTERS, countFor, type Mode } from "@/lib/word-lists-data";

/**
 * Reusable A–Z index. Renders 26 links to the sibling pages of one mode, each
 * showing how many words match. Server component — pure links, fully crawlable.
 */
export default function LetterIndexGrid({
  mode,
  active,
  title,
}: {
  mode: Mode;
  active?: string;
  title?: string;
}) {
  return (
    <div>
      {title && (
        <h3 className="mb-3 text-sm font-bold text-foreground">{title}</h3>
      )}
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:grid-cols-13">
        {LETTERS.map((l) => {
          const isActive = active?.toUpperCase() === l;
          const count = countFor(mode, l);
          return (
            <Link
              key={l}
              href={`/5-letter-words/${mode}/${l.toLowerCase()}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center rounded-lg border py-1.5 transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <span className="font-heading text-base font-bold uppercase">
                {l}
              </span>
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
