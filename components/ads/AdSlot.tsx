"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * In-content responsive AdSense unit. Renders nothing unless an AdSense client
 * ID is configured. Reserves a minimum height to limit layout shift (CLS).
 */
export function AdSlot({
  slot,
  className,
}: {
  slot: string;
  className?: string;
}) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not ready yet — safe to ignore.
    }
  }, [client]);

  if (!client) return null;

  return (
    <div className={`my-8 flex flex-col items-center ${className ?? ""}`}>
      <span className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 100 }}
        data-ad-client={`ca-pub-${client}`}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
