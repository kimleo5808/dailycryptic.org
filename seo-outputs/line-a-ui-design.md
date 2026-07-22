# Line A — UI Design Plan (Wordle Solver + 5-Letter Words)

> frontend-design pass · dailycryptic.org · design-plan only, no production code.
> **Constraint honored:** everything below lives inside the existing design system — Tailwind tokens in `styles/globals.css`, shadcn-style primitives, light/dark via `.dark`, and the `ContentBlocks` family. No new fonts, no new color system. We reuse `WordleBoard` and its proven tile palette rather than reinventing it.

---

## 0 · Design language recap (what we build within)

| Token / asset | Value | Use here |
|---|---|---|
| `--primary` | indigo `239 84% 67%` (dark `232 92% 81%`) | Primary actions, active states, links |
| `--cta` | amber/gold `38 92% 50%` | The "Solve" / hero action, key callouts |
| `--card` / `--border` / `--muted` | white cards, hairline borders, soft shadow | Panels, tables, chips |
| `--radius` | `0.625rem` | All corners (tiles use tighter `rounded-[3px]` like real Wordle) |
| Fonts | `font-heading` (display), `font-body`, `font-mono` | Headings / prose / **all words & data** in mono |
| Reuse | `WordleBoard` palette `#6aaa64 / #c9b458 / #787c7e`, `animate-tile-flip`, `animate-shake`, `animate-fade-in-up` | Solver input + result reveals |
| Reuse | `ContentHero`, `ContentSection`, `SubHeading`, `BodyText`, `CalloutBox`, `SimpleFaq`, `TableOfContents`, `RelatedLinks` | All below-the-fold long-form |

**Aesthetic direction:** *"puzzle lab notebook."* Refined, tactile, data-forward — not playful-toy, not corporate-SaaS. The signature is the **tactile Wordle tile** (the one thing users remember) set against calm editorial prose. Words and numbers always render in **mono** so the page reads like a solver's worksheet. Restraint over decoration: one strong interactive hero, generous whitespace, data tables that feel like reference material.

**Signature differentiator:** a **live candidate counter** — a large mono number ("**142** possible words") that ticks and re-animates on every tile change. Competitors show a static list after a button click; our number feels *alive*, which is the memorable moment.

---

# PAGE 1 · `/wordle-solver` (tool page)

Two-zone page: **interactive tool (above fold)** → **editorial long-form (below)**. Mirrors the "core-up, SEO-down" law we just applied site-wide.

## 1.1 Above the fold — the tool

```
┌───────────────────────────────────────────────────────────────┐
│  ContentHero (compact): eyebrow "Wordle · Solver"              │
│  H1  Free Wordle Solver: Find Every Word That Still Fits       │
│  subhead (1 line) · byline + "Last updated"                    │
├───────────────────────────────────────────────────────────────┤
│  TOOL PANEL  (card, shadow-sm, rounded-lg)                     │
│                                                               │
│   ①  INPUT — Wordle-style tile row (reuse WordleBoard look)   │
│       [ C ][ R ][ _ ][ _ ][ E ]   ← tap a tile to cycle       │
│       state: empty → green → yellow → gray (color = palette)  │
│       helper line: "Tap a tile to set green ▸ yellow ▸ gray"  │
│                                                               │
│   ②  CONTROLS row (wrap on mobile)                            │
│       • Gray-letters chip input:  [ s ][ l ][ o ] + add…      │
│       • Length switch: (4) (5)• (6) (7)   segmented control   │
│       • Toggle: Answer words only  ⇄  All valid guesses        │
│       • Toggle: Hard-mode compatible                          │
│                                                               │
│   ③  RESULT HEADER                                            │
│       ┌── live counter ──┐   sort: [Best guess ▾] A–Z  Score  │
│       │  142  possible   │                                    │
│       └─  words  ────────┘   (mono, amber accent, ticks)      │
│                                                               │
│   ④  RESULT GRID — mono word chips, staggered fade-in-up      │
│       [BRAVE][CRAVE][GRACE][GRADE][TRADE] …                   │
│       each chip: hover lifts, click → "used as answer?" tag   │
└───────────────────────────────────────────────────────────────┘
```

### Tile input (the signature control)
- Visual = `WordleBoard` tiles: `h-12 w-12 rounded-[3px] font-heading font-extrabold uppercase`, 2px border, palette colors for green/yellow/gray, white/transparent empty.
- Interaction: **tap cycles state** empty → green → yellow → gray → empty; long-press or a small ✕ clears. Type letters on physical keyboard; on-screen mini-keyboard (reuse `WordleKeyboard`) for mobile fills the *current* tile.
- On invalid/empty search: `animate-shake` on the row (already in system).
- Green = letter *and* position locked; yellow = letter present, this position excluded; gray = excluded everywhere.

### Live counter (the memorable moment)
- Large mono numeral in `--cta` amber; label "possible words" in muted.
- On every input change, the number counts to its new value (~250ms) and the word grid re-staggers via `animate-fade-in-up` with `animation-delay: idx*20ms`. This is the one orchestrated micro-moment worth the polish budget.
- Edge states: `0` → counter turns muted-gray, panel shows "No words match — check for a conflicting gray letter." `1` → counter pulses (`animate-pulse-soft`), chip highlighted amber ("Likely the answer").

### Result chips
- `font-mono uppercase tracking-wide`, `rounded-md border bg-card px-2.5 py-1`, hover `-translate-y-0.5` + border→primary.
- Sort control = shadcn `Select`. Default "Best guess" (frequency coverage). Optional tiny bar under each chip showing letter-frequency score (chart-1 indigo).
- Density: virtualize/`+ show all` beyond ~120 chips to protect mobile.

### Responsive
- Mobile: tiles shrink to `h-11 w-11`, controls stack, counter sits above grid, on-screen keyboard docks bottom.
- Desktop: two columns optional — controls left, results right — but single-column stacked is the safe default and matches site rhythm.

## 1.2 Below the fold — editorial (ContentBlocks)

Rendered with existing components so it matches every other page and is fully server-rendered/crawlable:
- `TableOfContents` (jump links to the 9 H2s from the content blueprint).
- Each H2 = `ContentSection`; body = `BodyText`; tips = `CalloutBox type="tip"`.
- **Data tables** (best starters, letter frequency): styled as `rounded-xl border overflow-hidden`, header row `bg-muted`, zebra `even:bg-muted/40`, numbers mono, top row bolded. Wrap in `overflow-x-auto` (mobile-safe — matches our table rule).
- FAQ = `SimpleFaq` (native `<details>`, already crawlable).
- Close with `RelatedLinks` (Quordle · Wordle Unlimited · Anagram Solver · 5-Letter Words).
- One real **tool screenshot** inside "How to use" (mid-solve) for E-E-A-T/GEO.

## 1.3 AdSense
- One in-content slot **after the tool, before H2 1** (high-viewability, doesn't block the tool).
- One mid-article slot between H2 4 and H2 5. Never inside the tool panel.

---

# PAGE 2 · `/5-letter-words` (hub)

Reference/index aesthetic — calm, scannable, letter-grid forward.

```
[Breadcrumb: Home › Words › 5-Letter Words]
ContentHero: H1 "5-Letter Words: The Complete List & Wordle Finder" + subhead
[Optional compact inline filter — same tile control, collapsed]

ContentSection "How Many 5-Letter Words Are There?"  (snippet stat, big mono numbers)

## Browse by Starting Letter   → A–Z INDEX GRID component
## Browse by Ending Letter      → A–Z INDEX GRID
## Browse by Letter Position    → 5×(A–Z) MATRIX
## Best Starting Words          → data table (shared with solver)
## Most Common Letters          → frequency table
SimpleFaq · RelatedLinks
```

### A–Z Index Grid (new reusable component `LetterIndexGrid`)
- Responsive grid of 26 square tiles, each a link (`/5-letter-words/starting-with/a` …).
- Each tile: big mono capital letter + tiny muted count ("A · 421"). `rounded-lg border bg-card`, hover → border-primary + subtle lift. Active letter (on spoke pages) filled `bg-primary text-primary-foreground`.
- Grid: `grid-cols-6 sm:grid-cols-9 lg:grid-cols-13` — a tidy alphabet block, reminiscent of a keyboard tray.
- Position matrix: 5 rows (positions 1–5) × A–Z, row label "Letter in position 3 (middle)" highlighted.

---

# PAGE 3 · `/5-letter-words/[...]` (spoke template — the anti-thin design)

The design *is* the anti-thin-content strategy: the sortable table + glossary carry weight, not padded prose.

```
[Breadcrumb] ContentHero (compact): H1 "5-Letter Words with I in the Middle"
① Direct-answer strip:  "There are  47  five-letter words with I in the middle."
   (big mono count in amber) + inline common-words list (chips)

② RESULTS TABLE (the core asset) — component `WordListTable`
   Tabs / segmented:  ● Common (default)   ○ All valid
   ┌ Word ─────┬ Scrabble ┬ WWF ┬ Meaning ─────────────────────┐
   │ BRICK     │    13    │  14 │ a block of fired clay        │
   │ TRICK     │    …     │  …  │ …                            │
   sortable headers (Word ▲ / Scrabble ▾ / …), mono words, zebra rows

③ CalloutBox "Using these in Wordle" — constraint-specific strategy (fresh per page)

④ Highlight card: "Highest-scoring: BRICK (13 pts)"  (amber-left CalloutBox)

⑤ GLOSSARY — tricky words explained  → card grid (reuse MdxCard-ish)
   each card: mono WORD + 1–2 line definition

⑥ Localized SimpleFaq (3–4 Q)

⑦ CROSS-INDEX: "Change the letter" A–Z row · "Change constraint" chips
   (LetterIndexGrid reused, compact) · up-links to Solver / Today's answer

[Breadcrumb / footer]
```

### `WordListTable` (new component)
- shadcn table styling: header `bg-muted text-xs uppercase tracking-wide`, sortable header buttons with ▲▼, body rows `even:bg-muted/40`, `font-mono` words, right-aligned numeric columns.
- **Common vs All** = segmented control at top-left (reuse the length-switch pattern). "Common" pre-filtered by frequency (the words a Wordle player wants); "All valid" expands to full set.
- Empty/tiny sets (e.g. ends-in-XZ): collapse to a simple chip list, hide the table chrome.
- Mobile: table becomes horizontally scrollable (`overflow-x-auto`); Meaning column truncates with tap-to-expand.

### Why this beats competitors visually
- They ship a naked comma list; we ship a **sortable reference table + a glossary + a strategy callout**, all in the site's calm editorial skin. It reads as *authored*, not scraped — the exact signal Google/AdSense reward.

---

## Component inventory

**New (design specced here):**
- `WordleTileInput` (client) — the cycling tile row + gray-chip input + counter, built on `WordleBoard` visuals.
- `SolverResults` (client) — live counter + sortable chip grid.
- `LetterIndexGrid` (server) — reusable A–Z / position index.
- `WordListTable` (client for sort; SSR-renders full rows so content is crawlable) — Common/All sortable table + glossary.

**Reused as-is:** `WordleBoard` palette/animations, `WordleKeyboard`, all `ContentBlocks`, shadcn `Select`/`Toggle`/`Button`, `ThemeToggle` (dark mode free).

## Motion spec (restrained)
- Page load: hero + tool `animate-fade-in-up` once (staggered 0/80/160ms).
- Counter tick + result re-stagger on input change (the signature moment).
- Invalid → `animate-shake`. Single-candidate → `animate-pulse-soft`.
- No scroll-jacking, no gratuitous parallax — the tool is the star.

## Dark mode & a11y
- All colors are tokens or the WordleBoard palette, which already ship dark variants → dark mode is automatic.
- Tile input: `role="group"`, each tile a button with `aria-label` ("C, green"), keyboard operable (type + arrow keys). Counter is an `aria-live="polite"` region so screen readers hear "142 possible words".
- Color-blind: reuse `WordleBoard`'s `colorBlind` blue/orange swap; expose the same toggle.
- Contrast: mono words on card ≥ AA; amber counter paired with text label (never color-only meaning).

## Crawlability note (ties to SEO plan)
- The **long-form + tables + glossary + FAQ are server-rendered** (Next SSG) — the tool's JS interactivity sits on top of statically-rendered content. Same lesson as our answer-board work: never let the crawlable value depend on client state.
