import type { MinuteCrypticPuzzle } from "@/types/minute-cryptic";
import { formatClueTypeLabel } from "@/lib/minute-cryptic-topics";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import Link from "next/link";
import type { ReactNode } from "react";

export function ContentHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 p-6 sm:p-8 dark:border-primary/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-primary/10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <span className="text-sm font-medium text-primary">{eyebrow}</span>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </header>
  );
}

export function ContentSection({
  title,
  children,
  className,
  id,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
        className
      )}
    >
      <h2 className="font-heading text-2xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function TableOfContents({
  items,
  title = "On this page",
}: {
  items: { href: string; label: string }[];
  title?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="font-heading text-xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border/80 bg-background px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BodyText({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
      {children}
    </p>
  );
}

export function SimpleFaq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="rounded-lg border border-border/80 bg-background p-3"
        >
          <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
            {item.question}
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function RelatedLinks({
  links,
  title = "Practice next",
}: {
  links: { href: string; title: string; description: string }[];
  title?: string;
}) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-6 text-primary-foreground sm:p-8">
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"
          >
            <h3 className="text-sm font-bold">{link.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ExamplePuzzleGrid({
  puzzles,
  title = "Example clues",
  intro,
  id,
}: {
  puzzles: MinuteCrypticPuzzle[];
  title?: string;
  intro: string;
  id?: string;
}) {
  return (
    <ContentSection title={title} id={id}>
      <BodyText>{intro}</BodyText>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <Link
            key={puzzle.id}
            href={`/minute-cryptic/${puzzle.printDate}`}
            className="rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dayjs(puzzle.printDate).format("MMM D, YYYY")}
            </p>
            <h3 className="mt-2 text-sm font-bold text-foreground">
              {puzzle.clue}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Type: {formatClueTypeLabel(puzzle.clueType)} | Difficulty:{" "}
              {puzzle.difficulty}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {puzzle.explanation}
            </p>
          </Link>
        ))}
      </div>
    </ContentSection>
  );
}

// ── New UI components ────────────────────────────────────────────────────────

/** H3 sub-heading used inside a ContentSection to break up long text blocks */
export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 text-base font-bold text-foreground">
      {children}
    </h3>
  );
}

/** Numbered step list with circle badge, title, and description */
export function StepList({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <div className="mt-2 space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {i + 1}
          </div>
          <div className="pt-0.5">
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Callout box for tips, warnings, or highlights */
export function CalloutBox({
  type = "tip",
  title,
  children,
}: {
  type?: "tip" | "warning" | "highlight";
  title?: string;
  children: ReactNode;
}) {
  const border = {
    tip: "border-l-blue-400 bg-blue-50/60 dark:bg-blue-950/20",
    warning: "border-l-amber-400 bg-amber-50/60 dark:bg-amber-950/20",
    highlight: "border-l-primary bg-primary/5",
  }[type];
  const titleColor = {
    tip: "text-blue-700 dark:text-blue-400",
    warning: "text-amber-700 dark:text-amber-400",
    highlight: "text-primary",
  }[type];
  return (
    <div className={cn("rounded-r-xl border border-transparent border-l-4 p-4", border)}>
      {title && (
        <p className={cn("mb-2 text-sm font-bold", titleColor)}>{title}</p>
      )}
      <div className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

/** Pill badges for displaying indicator word lists */
export function IndicatorTagList({
  tags,
  color = "default",
}: {
  tags: string[];
  color?: "default" | "blue" | "green" | "orange" | "purple" | "teal";
}) {
  const cls = {
    default: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    orange: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
    purple: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800",
    teal: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800",
  }[color];
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            cls
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Day-by-day routine card grid */
export function DayRoutineGrid({
  items,
}: {
  items: {
    day: number;
    title: string;
    description: string;
    focus?: string;
  }[];
}) {
  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.day}
          className="rounded-xl border border-border bg-background p-4"
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            Day {item.day}
          </span>
          <h3 className="mt-2 text-sm font-bold text-foreground">
            {item.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          {item.focus && (
            <p className="mt-2 text-xs font-semibold text-primary/70">
              Focus: {item.focus}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/** Learning difficulty badge for clue type cards */
export function LearningBadge({
  variant,
}: {
  variant: "easiest" | "beginner" | "intermediate" | "advanced";
}) {
  const cls = {
    easiest: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    beginner: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  }[variant];
  const label = {
    easiest: "Easiest",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        cls
      )}
    >
      {label}
    </span>
  );
}

// ── End new UI components ─────────────────────────────────────────────────────

export function DifficultyArchiveList({
  puzzles,
  title,
  intro,
  id,
}: {
  puzzles: MinuteCrypticPuzzle[];
  title: string;
  intro: string;
  id?: string;
}) {
  return (
    <ContentSection title={title} id={id}>
      <BodyText>{intro}</BodyText>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <Link
            key={puzzle.id}
            href={`/minute-cryptic/${puzzle.printDate}`}
            className="rounded-xl border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-primary/5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {dayjs(puzzle.printDate).format("MMM D, YYYY")}
            </p>
            <h3 className="mt-2 line-clamp-2 text-sm font-bold text-foreground">
              {puzzle.clue}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              #{puzzle.id} | {formatClueTypeLabel(puzzle.clueType)}
            </p>
          </Link>
        ))}
      </div>
    </ContentSection>
  );
}
