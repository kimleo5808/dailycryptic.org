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
