import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://strandshint.app";

export const siteConfig: SiteConfig = {
  name: "StrandsHint",
  tagLine: "Daily hints and answers for NYT Strands puzzle",
  description:
    "Get today's NYT Strands hints, answers, and archive. Progressive clues for theme words and spangram with daily puzzle tracking.",
  url: BASE_URL,
  authors: [
    {
      name: "StrandsHint",
      url: "https://strandshint.app",
    },
  ],
  creator: "@strandshint",
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  defaultNextTheme: "system",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
