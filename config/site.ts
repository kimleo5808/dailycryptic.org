import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://theforgecodes.app";

const EMAIL_URL = "hello@theforgecodes.app";
const GITHUB_URL = "https://github.com/weijunext/nextjs-starter";

export const siteConfig: SiteConfig = {
  name: "theforgecodes",
  tagLine: "Daily verified The Forge Roblox code tracker",
  description:
    "Find active and expired the forge codes with daily verification, timestamps, redeem instructions, and troubleshooting.",
  url: BASE_URL,
  authors: [
    {
      name: "theforgecodes",
      url: "https://theforgecodes.app",
    },
  ],
  creator: "@theforgecodes",
  socialLinks: {
    github: GITHUB_URL,
    email: EMAIL_URL,
  },
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  defaultNextTheme: "system", // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
};
