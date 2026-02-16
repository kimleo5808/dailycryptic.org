import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized:
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES &&
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES === "false",
    remotePatterns: [
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              hostname: process.env.R2_PUBLIC_URL.replace("https://", ""),
            },
          ]
        : []),
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy generic paths
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },

      // Legacy short aliases
      { source: "/today", destination: "/minute-cryptic-today", permanent: true },
      { source: "/archive", destination: "/minute-cryptic", permanent: true },
      { source: "/hints", destination: "/minute-cryptic", permanent: true },
      { source: "/answers", destination: "/minute-cryptic", permanent: true },
      { source: "/faq", destination: "/minute-cryptic-faq", permanent: true },
      {
        source: "/how-to-play",
        destination: "/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/strategy",
        destination: "/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/tips",
        destination: "/how-to-play-minute-cryptic",
        permanent: true,
      },
      { source: "/archive/:date", destination: "/minute-cryptic/:date", permanent: true },

      // Legacy Strands namespace
      { source: "/nyt-strands-hint", destination: "/minute-cryptic", permanent: true },
      { source: "/strands-hint-archive", destination: "/minute-cryptic", permanent: true },
      { source: "/strands-hint", destination: "/minute-cryptic", permanent: true },
      {
        source: "/strands-hint-today",
        destination: "/minute-cryptic-today",
        permanent: true,
      },
      {
        source: "/strands-hint-faq",
        destination: "/minute-cryptic-faq",
        permanent: true,
      },
      {
        source: "/strands-hint/:date",
        destination: "/minute-cryptic/:date",
        permanent: true,
      },
      {
        source: "/how-to-play-strands",
        destination: "/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/:locale/strands-hint",
        destination: "/:locale/minute-cryptic",
        permanent: true,
      },
      {
        source: "/:locale/strands-hint-today",
        destination: "/:locale/minute-cryptic-today",
        permanent: true,
      },
      {
        source: "/:locale/strands-hint-faq",
        destination: "/:locale/minute-cryptic-faq",
        permanent: true,
      },
      {
        source: "/:locale/strands-hint/:date",
        destination: "/:locale/minute-cryptic/:date",
        permanent: true,
      },
      {
        source: "/:locale/how-to-play-strands",
        destination: "/:locale/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/blog/strands-strategies-guide",
        destination: "/blog/minute-cryptic-strategy-guide",
        permanent: true,
      },
      {
        source: "/blog/common-strands-patterns",
        destination: "/blog/common-minute-cryptic-patterns",
        permanent: true,
      },
      {
        source: "/blog/beginners-guide-strands",
        destination: "/blog/minute-cryptic-beginner-guide",
        permanent: true,
      },

      // Locale aliases: English
      { source: "/en/today", destination: "/en/minute-cryptic-today", permanent: true },
      { source: "/en/archive", destination: "/en/minute-cryptic", permanent: true },
      { source: "/en/hints", destination: "/en/minute-cryptic", permanent: true },
      { source: "/en/answers", destination: "/en/minute-cryptic", permanent: true },
      { source: "/en/faq", destination: "/en/minute-cryptic-faq", permanent: true },
      {
        source: "/en/how-to-play",
        destination: "/en/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/en/strategy",
        destination: "/en/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/en/tips",
        destination: "/en/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/en/archive/:date",
        destination: "/en/minute-cryptic/:date",
        permanent: true,
      },
      { source: "/en/strands-hint", destination: "/en/minute-cryptic", permanent: true },
      {
        source: "/en/strands-hint-today",
        destination: "/en/minute-cryptic-today",
        permanent: true,
      },
      {
        source: "/en/strands-hint-faq",
        destination: "/en/minute-cryptic-faq",
        permanent: true,
      },
      {
        source: "/en/strands-hint/:date",
        destination: "/en/minute-cryptic/:date",
        permanent: true,
      },
      {
        source: "/en/how-to-play-strands",
        destination: "/en/how-to-play-minute-cryptic",
        permanent: true,
      },
      {
        source: "/en/blog/strands-strategies-guide",
        destination: "/en/blog/minute-cryptic-strategy-guide",
        permanent: true,
      },
      {
        source: "/en/blog/common-strands-patterns",
        destination: "/en/blog/common-minute-cryptic-patterns",
        permanent: true,
      },
      {
        source: "/en/blog/beginners-guide-strands",
        destination: "/en/blog/minute-cryptic-beginner-guide",
        permanent: true,
      },

      // Locale aliases: Spanish routes to default English content
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/hints", destination: "/minute-cryptic", permanent: true },
      { source: "/es/answers", destination: "/minute-cryptic", permanent: true },
      { source: "/es/archive", destination: "/minute-cryptic", permanent: true },
      { source: "/es/archive/:date", destination: "/minute-cryptic/:date", permanent: true },
      { source: "/es/faq", destination: "/minute-cryptic-faq", permanent: true },
      { source: "/es/about", destination: "/about", permanent: true },
      { source: "/es/contact", destination: "/contact", permanent: true },
      { source: "/es/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/es/terms", destination: "/terms-of-service", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
