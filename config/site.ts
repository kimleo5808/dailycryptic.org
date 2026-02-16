import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dailycryptic.org";

export const siteConfig: SiteConfig = {
  name: "dailycryptic",
  tagLine: "Daily minute cryptic hints and answers",
  description:
    "Get today's minute cryptic hints, answers, and archive. Progressive clues, solving help, and daily puzzle tracking.",
  url: BASE_URL,
  authors: [
    {
      name: "dailycryptic",
      url: "https://dailycryptic.org",
    },
  ],
  creator: "@dailycryptic",
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
