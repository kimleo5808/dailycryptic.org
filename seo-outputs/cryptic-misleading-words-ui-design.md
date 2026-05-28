# UI Design Plan — /cryptic-misleading-words

> Constraint: **must match existing cryptic learning pages** (e.g. `/cryptic-clue-types/anagram`).
> Existing aesthetic = clean editorial-reference: `rounded-2xl` cards, `border-border` + `bg-card` + `shadow-sm`,
> `font-heading` headings, `primary` accent via CSS vars, full light/dark support, generous spacing.
> Decision: **reuse the `@/components/minute-cryptic-content/ContentBlocks` library** for 90% of the page,
> and add **2 new signature components** in the exact same visual language to carry the unique asset.

---

## 1. Design language (inherited — do NOT reinvent)

| Token | Existing pattern (keep) |
|---|---|
| Container | `mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8` |
| Section card | `rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8` |
| Hero | `ContentHero` — gradient `from-primary/5 via-white to-primary/5` + blurred orbs |
| Headings | `font-heading`, H2 `text-2xl font-bold`, H3 via `SubHeading` |
| Body | `BodyText` — muted-foreground, `text-sm sm:text-[0.95rem] leading-relaxed` |
| Accents | `CalloutBox` (tip/warning/highlight), `IndicatorTagList` pills, `StepList` numbered circles |
| Closer | `RelatedLinks` — primary gradient card with 3 link tiles |

The page should feel like a sibling of the anagram clue-type page. No new fonts, no new color system.

---

## 2. Page skeleton (top → bottom) with component mapping

1. **`ContentHero`** — eyebrow `"Solving Guide"`, H1 `Why "Flower" Means River in Cryptic Crosswords`, description = the 30-sec promise.
2. **`TableOfContents`** — anchors to all H2s (reuse as-is).
3. **★ NEW `ClueParseBreakdown`** (signature #1) — the marquee `FLOW + ER → RIVER` decomposition, placed right after the TOC so the "aha" is above the fold.
4. **`ContentSection` ×2** — "The 30-second answer" + "Why setters are allowed to do this" (with `CalloutBox highlight` for the rule, `IndicatorTagList` for the two mechanism families).
5. **`AdSlot` (NEW, in-content)** — after the first explanatory section, before the big table. (See §4.)
6. **★ NEW `MisdirectionTable`** (signature #2) — the searchable/filterable misleading-word list. The unique asset.
7. **`ContentSection`** — "The double-bluff" reversal section (`CalloutBox warning`).
8. **`ExamplePuzzleGrid`** — reuse as-is, pulls real clues from `data/minute-cryptic/puzzles.json` (worked examples).
9. **`AdSlot` (NEW)** — before FAQ (per AdSense rules in docs/adsense-zones.md: "Before FAQ on long-form pages").
10. **`ContentSection` + `SimpleFaq`** — FAQ with FAQPage schema.
11. **`RelatedLinks`** — primary-gradient closer (practice CTAs + lateral learning links).

---

## 3. Signature component #1 — `ClueParseBreakdown`

**Purpose:** turn the abstract "-er rule" into a visual, scannable decomposition. This is what users screenshot and what earns the featured snippet.

**Layout (same card language):**
```
┌─ rounded-2xl border bg-card shadow-sm p-6 sm:p-8 ───────────────┐
│  eyebrow: "The textbook example"                                 │
│                                                                  │
│   FLOWER                                                         │
│   ─────────────────────────────                                 │
│   [ FLOW ]  +  [ -ER ]   →   RIVER                              │
│    verb        "one that"     answer                            │
│   "to flow"   (agent noun)   a thing that flows                 │
│                                                                  │
│   ✗ Looks like: a plant / daisy   (the decoy)                   │
│   ✓ Means: a river                                              │
└──────────────────────────────────────────────────────────────┘
```

**Visual treatment (consistent tokens):**
- The split blocks `[FLOW]` `[-ER]` = pills styled like `IndicatorTagList` (rounded-full, `bg-primary/10 text-primary border-primary/20`).
- The `→` arrow + `RIVER` result emphasised in `text-primary font-bold`.
- "Looks like" decoy line uses the `CalloutBox warning` amber treatment (✗); "Means" uses `highlight` primary (✓) — reusing existing color semantics so it reads as familiar.
- **Motion (subtle, page-load only):** staggered fade-in of FLOW → ER → RIVER using `animation-delay` (CSS-only, matches the skill's "one orchestrated load" guidance; respect `prefers-reduced-motion`).
- **Reusable:** accept props `{ word, parts: [{text,label}], decoy, meaning }` so the same component can render `BANKER`, `NUMBER` breakdowns later (and on sibling pages).

---

## 4. Signature component #2 — `MisdirectionTable` (the unique asset)

**Purpose:** the complete, *searchable + filterable* misleading-word reference no competitor has. Client component (`"use client"`).

**Controls row (sticky on scroll within section, mobile-friendly):**
- Search input — filters by word / meaning (debounced, instant).
- Filter chips (reuse `IndicatorTagList` pill styling, but as toggle buttons): `All` · `"-er" agents` · `People & roles` · `Cryptic definitions`.
- Result count: `"Showing 16 of 34 words"` (muted text).

**Row design — responsive strategy (critical for mobile):**
- **Desktop (`sm+`):** real `<table>` — columns `Word | Looks like | Cryptic meaning | Why (wordplay) | Example`. Zebra via `bg-card`/`bg-background`, `border-border` dividers.
- **Mobile (`< sm`):** collapse each row into an **expandable card** (reuse `<details>` pattern from `SimpleFaq`): summary shows `WORD → cryptic meaning`; expanding reveals the wordplay logic + example clue. Avoids horizontal scroll — matches existing mobile-first habit.

**Cell content tokens:**
- `Word` = bold uppercase, `font-heading`.
- `Looks like` = muted (`text-muted-foreground`), the decoy.
- `Cryptic meaning` = `text-primary font-semibold`.
- `Example` clue = italic muted; where the clue is a real library puzzle, wrap in a `Link` to `/minute-cryptic/[date]` (same hover lift as `ExamplePuzzleGrid`).

**Empty state:** "No words match — try clearing filters." in a muted centered card.

**A11y:** proper `<th scope>`, `aria-expanded` on mobile toggles, search input `<label>` (visually hidden), focus-visible rings using existing `ring` tokens.

**Data source:** a typed array (e.g. `data/cryptic-misleading-words.ts` or a `lib/` const) — `{ word, category, looksLike, crypticMeaning, wordplay, example, exampleDate? }`. Keeps content out of JSX and reusable for schema generation.

---

## 5. New `AdSlot` component (no reusable ad component exists yet)

Currently only `app/GoogleAdsense.tsx` (script loader) exists — no in-content unit. Create a small client `AdSlot`:
- Renders `<ins class="adsbygoogle" ...>` + the `(adsbygoogle = window.adsbygoogle || []).push({})` init.
- Props: `slot` (ad unit id), `format="auto"`, `responsive`.
- Renders nothing if `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` is unset (mirrors existing guard).
- Wrapper styled `my-8 flex justify-center` + a muted `Advertisement` label, `min-h` reserved to avoid CLS.

**Placement (per docs/adsense-zones.md — verify against that file):**
- ✅ After first explanatory section (§2 step 5).
- ✅ Before FAQ (§2 step 9).
- ❌ Never inside `ClueParseBreakdown` or `MisdirectionTable` controls — keep the interactive asset clean.

---

## 6. Responsive & theme checklist
- Hero H1 `text-3xl sm:text-4xl`; table → cards under `sm`.
- All new components must render correctly in dark mode using existing `dark:` token patterns (mirror `CalloutBox`/`IndicatorTagList`).
- Touch targets ≥ 40px on filter chips and mobile row toggles.
- Reserve ad height to protect CLS / Core Web Vitals.

---

## 7. Build order (for implementation phase — not now)
1. `data/cryptic-misleading-words.ts` (the curated dataset; verify real examples against puzzles.json).
2. `ClueParseBreakdown` (server component, CSS-only motion).
3. `MisdirectionTable` (client component, search + filter).
4. `AdSlot` (client component).
5. Assemble `app/[locale]/cryptic-misleading-words/page.tsx` reusing ContentBlocks + the 3 new components.
6. Metadata + Article/FAQPage/BreadcrumbList JSON-LD (mirror anagram page).
7. Add to sitemap; add reverse internal links from beginner/clue-types/glossary/abbreviations pages.

---

## Summary
Reuse the established ContentBlocks system for structure and tone (guarantees consistency), and invest design effort in exactly two new on-brand components — `ClueParseBreakdown` (the screenshot-worthy "aha") and `MisdirectionTable` (the searchable unique asset) — plus a reusable `AdSlot`. No new fonts/colors; distinctiveness comes from the *interaction* (search/filter/decompose), not a new aesthetic.
