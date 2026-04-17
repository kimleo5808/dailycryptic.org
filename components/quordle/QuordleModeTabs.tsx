"use client";

import { cn } from "@/lib/utils";
import type { QuordleMode } from "@/types/quordle";

interface QuordleModeTabsProps {
  mode: QuordleMode;
  onChange: (mode: QuordleMode) => void;
  className?: string;
}

const TABS: { id: QuordleMode; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "practice", label: "Practice" },
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
        "inline-flex rounded-md border border-border bg-muted/40 p-0.5",
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
              "rounded px-3 py-1 text-xs font-semibold transition",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
