"use client";

import { BASE_URL } from "@/config/site";

const SHARE_URL = BASE_URL;
const SHARE_TEXT =
  "Strands Hint — Daily hints and answers for NYT Strands puzzle. Progressive clues, Spangram reveals, and theme words.";

const socialPlatforms = [
  {
    name: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.044 1.545.112v3.287a10 10 0 0 0-.827-.025c-1.173 0-1.628.443-1.628 1.598v2.586h3.274l-.562 3.667h-2.712v8.168C19.396 23.209 24 18.135 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.628 3.875 10.35 9.101 11.691" />
      </svg>
    ),
  },
  {
    name: "X",
    href: `https://x.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(SHARE_URL)}&description=${encodeURIComponent(SHARE_TEXT)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0" />
      </svg>
    ),
  },
];

export default function SocialShare() {
  return (
    <div className="mt-5 flex items-center gap-2">
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Share on ${platform.name}`}
          title={`Share on ${platform.name}`}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-primary hover:bg-primary/10 hover:text-white"
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
}
