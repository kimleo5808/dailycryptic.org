import type { ConnectionsColor } from "@/types/connections";

/**
 * Server-rendered answer board.
 *
 * Unlike the interactive reveal, every word and group name is present in the
 * server HTML so search engines can index the actual answers. The answers stay
 * spoiler-protected for humans behind a native <details> element (no JS needed),
 * whose collapsed content is still crawlable.
 */

const COLOR_BG: Record<ConnectionsColor, string> = {
  yellow:
    "bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700",
  green:
    "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700",
  blue: "bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700",
  purple:
    "bg-purple-50 border-purple-300 dark:bg-purple-950/40 dark:border-purple-700",
};

const COLOR_LABEL: Record<ConnectionsColor, string> = {
  yellow: "text-amber-800 dark:text-amber-200",
  green: "text-emerald-800 dark:text-emerald-200",
  blue: "text-blue-800 dark:text-blue-200",
  purple: "text-purple-800 dark:text-purple-200",
};

const DIFFICULTY: Record<ConnectionsColor, string> = {
  yellow: "Easiest",
  green: "Moderate",
  blue: "Tricky",
  purple: "Hardest",
};

const ORDER: ConnectionsColor[] = ["yellow", "green", "blue", "purple"];

interface AnswerGroup {
  color: ConnectionsColor;
  name: string;
  words: string[];
}

/** Join a word list into readable prose: "A, B, C and D". */
function listWords(words: string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function groupExplanation(group: AnswerGroup): string {
  const words = listWords(group.words);
  switch (group.color) {
    case "yellow":
      return `The easiest group. ${words} share the straightforward link “${group.name}”.`;
    case "green":
      return `A moderate group. ${words} come together under “${group.name}”.`;
    case "blue":
      return `A tricky group that often leans on trivia. ${words} are joined by “${group.name}”.`;
    case "purple":
      return `The hardest group, usually built on wordplay. ${words} connect through “${group.name}”.`;
  }
}

export default function ConnectionsAnswerBoard({
  groups,
  puzzleId,
  defaultOpen = false,
}: {
  groups: AnswerGroup[];
  puzzleId: number;
  defaultOpen?: boolean;
}) {
  const ordered = [...groups].sort(
    (a, b) => ORDER.indexOf(a.color) - ORDER.indexOf(b.color)
  );

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-foreground">
          Connections #{puzzleId} — Full Answers
        </span>
        <span className="rounded-lg bg-destructive px-4 py-1.5 text-xs font-semibold text-destructive-foreground transition group-open:bg-muted group-open:text-muted-foreground">
          <span className="group-open:hidden">Reveal answers</span>
          <span className="hidden group-open:inline">Hide answers</span>
        </span>
      </summary>

      <p className="mt-3 text-xs text-muted-foreground">
        Spoiler warning — the four groups and every word are shown below.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ordered.map((group) => (
          <div
            key={group.color}
            className={`rounded-xl border p-4 ${COLOR_BG[group.color]}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wide ${COLOR_LABEL[group.color]}`}
            >
              {group.color} · {DIFFICULTY[group.color]}
            </p>
            <p className="mt-1 font-heading text-base font-bold text-foreground">
              {group.name}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.words.map((word) => (
                <span
                  key={word}
                  className="rounded-md bg-background/80 px-2 py-0.5 font-mono text-sm font-medium text-foreground"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {groupExplanation(group)}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}
