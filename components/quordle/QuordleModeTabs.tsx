"use client";

import { cn } from "@/lib/utils";
import type { QuordleMode } from "@/types/quordle";

interface QuordleModeTabsProps {
  mode: QuordleMode;
  onChange: (mode: QuordleMode) => void;
  className?: string;
}

const TABS: { id: QuordleMode; label: string; sub: string }[] = [
  { id: "daily", label: "Daily", sub: "One puzzle / day" },
  { id: "practice", label: "Practice", sub: "Unlimited" },
];

export default function QuordleModeTabs({
  mode,
  onChange,
  className,
}: QuordleModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Quordle mode"
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted/50 p-1",
        className,
      )}
    >
      {TABS.map((t) => {
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex min-w-[7.5rem] flex-col items-center gap-0.5 rounded-md px-4 py-1.5 text-sm font-semibold transition",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{t.label}</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              {t.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
