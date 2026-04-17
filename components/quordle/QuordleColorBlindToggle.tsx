"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuordleStore } from "@/stores/quordleStore";

interface QuordleColorBlindToggleProps {
  className?: string;
}

export default function QuordleColorBlindToggle({
  className,
}: QuordleColorBlindToggleProps) {
  const colorBlind = useQuordleStore((s) => s.colorBlind);
  const setColorBlind = useQuordleStore((s) => s.setColorBlind);
  const hydrate = useQuordleStore((s) => s.hydrate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? colorBlind : false}
      onClick={() => setColorBlind(!colorBlind)}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-3 w-3 rounded-full border",
          mounted && colorBlind
            ? "bg-blue-500 border-blue-600"
            : "bg-emerald-500 border-emerald-600",
        )}
      />
      {mounted && colorBlind ? "Color-blind mode" : "Standard colors"}
    </button>
  );
}
