# CLAUDE-quordle.md — Quordle Game & SEO Hub

> Scope isolated requirements doc for the Quordle feature. The root `CLAUDE.md` covers the NYT Connections feature; this file covers Quordle only. Keep them in sync when cross-cutting changes (nav, sitemap, footer) land.

## Project Overview

Add a playable **Quordle** game page at `/quordle` on dailycryptic.org. The page combines (a) an interactive Daily + Practice mode Quordle game above the fold, with (b) ~2,200 words of evergreen SEO content below, targeting the 1.8M/month US keyword cluster around "quordle".

This is the second-largest traffic bet on the site after Connections. Unlike Connections (hints-only), Quordle SERP is dominated by pages that let users **actually play the game** — so the game component is non-negotiable.

## Key Decisions (Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route | `/quordle` (single page, not `/quordle-today`) | Main keyword is `quordle` (1.8M/mo). Aggregate PageRank on one URL. |
| Game modes | **Daily** (default) + **Practice** (unlimited) | Daily drives return visits; Practice increases session time. |
| Daily seed | Client-side deterministic: `UTC_date → hash → word index` | All users worldwide get the same 4 words per UTC day. No backend. |
| Word list source | Local JSON in `/data/quordle/` (answers + guesses) | No external API. Full offline capability. |
| State persistence | `localStorage` per user | Refresh-safe; no login. |
| Shared primitives | Extract `WordleBoard` + `WordleKeyboard` from existing logic into `components/games/shared/` | Quordle = 4 Wordle boards + 1 keyboard. Future Wordle game can reuse. |
| Monetization | Google AdSense, **game area ad-free** | Ads below the game + between content sections only. |
| Legal | Add disclaimer: "Not affiliated with Quordle / Merriam-Webster / Wordle / New York Times" | Defensive; multiple competitors use the Quordle mark already. |
| Schema | VideoGame + FAQPage + HowTo + BreadcrumbList | Full SERP coverage for AI/rich-result snippets. |

## Business Context

- **Search opportunity:** `quordle` 1.8M/mo (US) / 3.8M/mo global, KD 57. Long-tail cluster (`quordle today`, `daily quordle`, `how to play quordle`, etc.) adds ~250K/mo more with lower KD.
- **SERP reality:** The first page is overwhelmingly "click and play" destinations (merriam-webster.com, quordle-wordle.com, beta.quordle.com, quordly.org/com). Content-only pages lose.
- **Differentiation:** Best-in-class game UX + deepest SEO content + internal link equity from the existing Connections / Wordle Hints / Strands / Minute Cryptic ecosystem on this domain.
- **Revenue model:** Same as the rest of the site — AdSense on content sections, no paywall, no signup.

## Target Keywords

| Keyword | US MSV | KD | Intent | Role |
|---|---|---|---|---|
| quordle | 1,800,000 | 57 | Informational | Primary — H1, title, URL, first paragraph |
| quordle today | 165,000 | 47 | Informational | Secondary — title suffix, "Daily Quordle" H2 |
| quordle hint | 40,500 | 43 | Informational | Future `/quordle-hint` page (Phase 2) |
| quordle game | 18,100 | 85 | Informational | Synonym — repeat naturally |
| quordle come / com | 26,900 combined | 38–49 | Navigational | Do not chase (navigational typo) |
| daily quordle | 9,900 | 62 | Informational | H2 heading |
| quordle merriam webster | 9,900 | 65 | Brand+Transactional | Skip (brand defense risk) |
| quordle answer today | 9,900 | 47 | Informational | Future `/quordle-answer` page (Phase 2) |
| quordle hint today | 9,900 | 52 | I+C | Phase 2 |
| quordle puzzles / hints / sequence / answers | 5K–8K each | 25–40 | Informational | Natural body coverage |
| how to play quordle | 390 | 41 | Informational | H2 section |
| what is quordle | 140 | 39 | Informational | H2 section |

**Keyword density target:** "quordle" should appear ~20–25 times across the 2,200-word page (density ~1%). Avoid stuffing: "quordle" + 1 natural modifier ("daily quordle", "play quordle", "quordle game") in H2s/H3s.

## Competitors & SERP Benchmarks (US)

| Rank | URL | Page AS | Referring domains | Organic traffic | Observation |
|---|---|---|---|---|---|
| 1 | merriam-webster.com/games/quordle | 77 | 1,400 | 595K | Brand authority + clean playable UI |
| 3 | quordle-wordle.com | 76 | 1,500 | 51K | Pure game, minimal content, heavy backlinks |
| 6 | beta.quordle.com | 71 | 16 | 48K | Official beta |
| 7 | quordly.org | 72 | 354 | 44K | Alternative domain, playable |
| 8 | quordly.com | 69 | 398 | 30K | Alternative domain, playable |

**Take-aways:**
1. Every top-10 result lets the user play immediately. Zero tolerance for "article-only" pages.
2. quordle-wordle.com (rank 3) has extremely thin content but high backlinks → we can beat them on content depth and internal links.
3. We do not need to outrank merriam-webster.com to win; grabbing 20K–50K monthly organic (positions 5–15) is the realistic target.

## Page Architecture

### Single page: `/quordle`

```
┌───────────────────────────────────────────────────────┐
│ Header (site-wide)                                    │
├───────────────────────────────────────────────────────┤
│ ABOVE-THE-FOLD (game region, no ads)                  │
│   H1: Play Quordle — Daily 4-Word Puzzle Game         │
│   Sub: "Guess 4 five-letter words in 9 tries.         │
│         New puzzle every day, plus unlimited practice"│
│   Mode tabs: [Daily]  [Practice]                      │
│   Game: 2×2 board grid + virtual keyboard + timer     │
│   Actions: Share · How to play · Full screen          │
├───────────────────────────────────────────────────────┤
│ BELOW-THE-FOLD (evergreen SEO, 2,200 words)           │
│   Table of Contents                                   │
│   H2 × 10 sections (see Content Plan below)           │
│   Ad slots between long sections                      │
│   Related games (internal links)                      │
│   "About / Disclaimer" block                          │
├───────────────────────────────────────────────────────┤
│ Footer (site-wide)                                    │
└───────────────────────────────────────────────────────┘
```

Phase 2 candidate routes (**not in this milestone**):
- `/quordle/hint` — daily hint page (9.9K/mo, KD 52)
- `/quordle/answer` — daily answer page (9.9K/mo, KD 47)
- `/quordle/archive` — past puzzles
- `/quordle/[date]` — individual date archive pages

## Data Architecture

### `data/quordle/answers.json`

~2,300 entries. The canonical daily-answer pool (common 5-letter words, curated to avoid offensive/proper-noun terms). Each entry is a plain 5-letter lowercase word.

```json
["about", "abuse", "actor", "acute", "admit", "adopt", "..."]
```

### `data/quordle/guesses.json`

~10,000 entries. Expanded set of valid guess words (includes less-common words that are legal inputs but never answers).

### Daily seed algorithm (`lib/quordle-data.ts`)

```
getTodayAnswers(date = new Date()): [string, string, string, string]
  1. key = "YYYY-MM-DD" (UTC)
  2. seed = hash(key)  // use a stable hash (e.g., cyrb128 / fnv1a)
  3. prng = mulberry32(seed)
  4. Pick 4 distinct indices from answers.json using prng
  5. Return the 4 lowercased words
```

- Deterministic: every user on a given UTC date gets the same 4 words.
- No network call; purely client-side.
- Answer pool length must be >> 365 to avoid frequent repeats (2,300+ is fine).

### Functions needed (`lib/quordle-data.ts`)

- `getTodayAnswers(date?: Date): [string, string, string, string]` — daily-seeded
- `getRandomAnswers(): [string, string, string, string]` — practice mode (non-deterministic)
- `isValidGuess(word: string): boolean` — check against guesses.json ∪ answers.json
- `scoreGuess(guess: string, answer: string): LetterState[]` — returns `["correct" | "present" | "absent", …]` for 5 letters (Wordle algorithm with proper duplicate handling)

### State persistence (`stores/quordleStore.ts`)

Use existing `stores/` pattern (probably Zustand — verify against other stores in the repo). Keys namespaced per date to avoid collisions:

- `quordle:daily:YYYY-MM-DD:guesses` — array of guesses entered
- `quordle:daily:YYYY-MM-DD:completed` — bool
- `quordle:practice:session` — ephemeral (reset on "New game")

## Component Design

### Shared primitives: `components/games/shared/`

These are extracted from the Quordle implementation so a future standalone `/wordle` game can reuse them. They **must be generic** — no Quordle-specific props.

#### `WordleBoard.tsx` (Client Component)

Renders an N×5 grid for a single target word.

**Props:**
```ts
{
  rows: number;                              // max guesses (Quordle: 9, Wordle: 6)
  guesses: string[];                         // already-submitted guesses
  currentGuess: string;                      // in-progress guess (top unused row)
  evaluations: LetterState[][];              // evaluation per submitted guess
  status: "playing" | "won" | "lost";
  compact?: boolean;                         // smaller cells for multi-board layouts
}
```

**Visual:**
- Tile colors: green (correct) / yellow (present) / gray (absent) / empty border (not submitted)
- Flip animation on evaluation reveal
- Shake animation on invalid guess (handled by parent)
- Dark mode compatible using site tokens

#### `WordleKeyboard.tsx` (Client Component)

QWERTY on-screen keyboard + physical keyboard listener.

**Props:**
```ts
{
  onKey: (key: string) => void;              // "a"–"z" | "enter" | "backspace"
  letterStates: Record<string, LetterState>; // aggregated best state per letter
  disabled?: boolean;
}
```

- For Quordle, the parent aggregates 4 boards' letter states (take the "best" state: correct > present > absent).
- Physical keys: letters, Enter, Backspace; ignore others.
- Respect `document.activeElement` — don't intercept when user is typing in a textarea/input.

#### `useWordleGame` (Hook in `hooks/useWordleGame.ts`)

Encapsulates the per-board game state machine. Called 4× by Quordle.

```ts
useWordleGame({
  answer: string;
  maxRows: number;
  onWin?: () => void;
  onLose?: () => void;
}) => {
  guesses, currentGuess, evaluations, status,
  type: (letter) => void,
  backspace: () => void,
  submit: () => "ok" | "invalid" | "too_short",
}
```

### Quordle-specific: `components/quordle/`

#### `QuordleGame.tsx` (Client Component)

Top-level orchestrator.

**Props:**
```ts
{
  mode: "daily" | "practice";
  initialAnswers?: [string, string, string, string]; // SSR-safe seed
}
```

**Behavior:**
- Maintains 4 `useWordleGame` instances sharing a single `currentGuess` (because one input → 4 boards).
- Global `submit` validates `currentGuess` against the guess dictionary, then submits to all 4 boards at once.
- Global status: `won` when all 4 boards won; `lost` when guesses used up without all 4 won.
- Timer starts on first keystroke, stops on terminal state.
- Layout: 2×2 grid on desktop (≥1024px), 1×4 stack on tablet, 1×4 stack on mobile with slightly smaller tiles.
- Rehydrates from `localStorage` on mount for daily mode.
- On daily completion: show result matrix + share button (generates emoji grid — see `Share format` below).

#### `QuordleModeTabs.tsx` (Client Component)

Two tabs: `Daily` (default) and `Practice`. Tab switch unmounts/remounts `QuordleGame` with the new mode. URL hash: `#daily` / `#practice` for linkability.

#### `QuordleShareButton.tsx` (Client Component)

Generates the share string:

```
Daily Quordle #1016
5️⃣4️⃣
7️⃣6️⃣
dailycryptic.org/quordle
```

Numbers = guess count for each of the 4 boards (or `🟥` if that board wasn't solved). Use `navigator.share` on mobile, fallback to clipboard copy with a toast.

#### `QuordleHowToPlay.tsx` (Server Component)

Modal or collapsible card with the rules. Also contributes to HowTo schema.

### Content components (SEO region)

All Server Components. Reuse existing patterns from `/connections-hint-today` where possible.

- `QuordleStartingWords.tsx` — table of recommended opening words
- `QuordleComparisonTable.tsx` — Quordle vs Wordle vs Dordle vs Octordle
- `QuordleFaq.tsx` — FAQ section with FAQPage schema JSON-LD

## Page Content — `/quordle`

### Above the fold

- H1: **Play Quordle — Daily 4-Word Puzzle Game**
- Subtitle: "Guess 4 five-letter words in 9 tries. New daily puzzle every day, plus unlimited practice mode. Free, no sign-in."
- Mode tabs (Daily / Practice)
- `QuordleGame` component
- Action bar: Share · How to play · Full screen

### Evergreen SEO content (~2,200 words total)

| # | H2 | H3 | Target words | Keyword/intent |
|---|---|---|---|---|
| 1 | What Is Quordle? | — | 180 | `what is quordle` (140/mo KD 39) |
| 2 | How to Play Quordle | 2a Objective / 2b Color scoring / 2c Guess limit / 2d Daily vs Practice / 2e Sharing your result | 300 | `how to play quordle` (390/mo KD 41) |
| 3 | Quordle Rules at a Glance | — (8-item bullet list) | 120 | Featured snippet bait |
| 4 | 10 Strategies to Solve Quordle Faster | 4.1 Cover vowels first / 4.2 Use consonant-rich second guesses / 4.3 Treat boards independently / 4.4 Solve the easiest board first only when safe / 4.5 Avoid wasting guesses on one board / 4.6 Reuse confirmed greens / 4.7 Watch for double letters / 4.8 Work systematically, not emotionally / 4.9 Time-box per guess / 4.10 Know when to guess vs calculate | 450 | Long-tail + LLM citation |
| 5 | Best Starting Words for Quordle | — (table: ADIEU, STARE, AUDIO, RAISE, CRANE, OUIJA, ROATE, + vowel/consonant coverage column + "why it works" column) | 260 | `quordle starting words` (long-tail) |
| 6 | Quordle vs Wordle vs Dordle vs Octordle | 6a vs Wordle / 6b vs Dordle / 6c vs Octordle | 220 | Comparison long-tails |
| 7 | Daily Quordle: Reset Time & Archive | — | 120 | `daily quordle` (9.9K/mo), `quordle today` |
| 8 | Quordle Hard Mode Tips | — | 180 | Long-tail |
| 9 | 5 Common Mistakes to Avoid | 9.1 × 5 sub-headings | 180 | Fresh angle |
| 10 | Quordle FAQ | 8 Q&A (FAQPage schema) | 300 | PAA capture + AI citation |
| — | Related Games (internal links) | Wordle Hints / Connections Hints / Strands / Minute Cryptic / Cryptic Glossary | 90 | Link equity |
| — | About & Disclaimer | — | 60 | E-E-A-T |

**Total: ~2,280 words of evergreen content.**

### FAQ (exactly 8 questions)

1. Is Quordle free to play?
2. How many guesses do you get in Quordle?
3. What time does the daily Quordle reset?
4. What's the difference between Quordle and Wordle?
5. Are the four Quordle words related to each other?
6. What are the best starting words for Quordle?
7. Can I play past Quordle puzzles?
8. Is Quordle harder than Wordle?

Each answer: 40–60 words, direct first sentence (BLUF), optimized for AI-generated answer boxes.

### Writing style

- Short paragraphs (2–3 sentences max)
- Each H3 section: 30–60 words
- Conversational but informative; second person ("you")
- Include concrete examples ("a strong opener like ADIEU hits four vowels")
- Absolutely no specific daily puzzle words in the evergreen text (would become stale and can't be scheduled)
- Internal links use descriptive anchor text

### What NOT to do

- Do not copy any sentences from competitor pages
- Do not embed or iframe the Merriam-Webster / quordle.com game
- Do not claim affiliation with Merriam-Webster, Quordle, or The New York Times
- Do include a disclaimer: "This site is not affiliated with Merriam-Webster, Quordle, Wordle, or The New York Times."

## Schema Markup

1. `VideoGame` (or `WebApplication` with `applicationCategory: "Game"`) — describes the Quordle game itself
2. `FAQPage` — 8 Q&As
3. `HowTo` — the "How to Play Quordle" section (5 steps)
4. `BreadcrumbList` — Home > Games > Quordle

All four as separate JSON-LD `<script>` blocks. Validate with Google Rich Results Test before shipping.

## Design Guidelines

### Color palette

Follow the site's existing theme tokens. Board tile states:

| State | Light mode | Dark mode |
|---|---|---|
| Correct (green) | `bg-emerald-500 text-white` | `bg-emerald-600 text-white` |
| Present (yellow) | `bg-amber-400 text-white` | `bg-amber-500 text-white` |
| Absent (gray) | `bg-zinc-400 text-white` | `bg-zinc-700 text-zinc-100` |
| Empty | `border-zinc-300` | `border-zinc-600` |

Include a color-blind friendly mode (toggle: green→blue, yellow→orange). Persist the choice in `localStorage` (key: `quordle:colorBlind`).

### Typography

Match the rest of the site (Outfit headings, Plus Jakarta Sans body). Board letters: monospace-like weight, bold, uppercase. Keyboard keys: same body font, medium weight.

### Responsive breakpoints

- ≥1024px (desktop): 2×2 board grid, full keyboard below
- 640–1023px (tablet): 2×2 grid with smaller tiles
- <640px (mobile): 1×4 stacked boards, full-width keyboard; keep the current active row always in view (auto-scroll on submit)

### Animations

- Tile flip on evaluation: 500 ms per letter, staggered 100 ms
- Shake on invalid guess: 250 ms horizontal shake on the current row of all 4 boards
- Keyboard key press: 100 ms scale-down feedback

## Navigation & Sitemap Updates

### `config/nav.ts`

Add **Quordle** under the existing Games section (alongside Connections Hints). If no "Games" category exists yet, create one.

### `i18n/messages/en.json`

Footer link groups — add:
- "Quordle" → `/quordle`

### `app/sitemap.ts`

Add:
- `/quordle` — priority 0.9, changeFrequency `daily` (because daily puzzle rotates, even though URL is static)

### `app/[locale]/page.tsx` (home)

Add a Quordle card to the Games/Tools grid on the home page.

### Internal link back-references

Add a "Related games" link to `/quordle` from:
- `/connections-hint-today`
- `/wordle-hints-today` (or whichever wordle page exists)
- `/strands-game`
- `/minute-cryptic-today`

## Testing & QA Checklist

- [ ] `pnpm build` succeeds with no type errors
- [ ] Daily mode returns the same 4 answers for all users on a given UTC day (test by mocking Date)
- [ ] Practice mode returns different answers on each "New game" click
- [ ] Invalid guess (not in dictionary) is rejected with a shake animation
- [ ] Winning condition: solving all 4 boards shows a success panel with stats + share button
- [ ] Losing condition: running out of guesses reveals remaining answers
- [ ] `localStorage` persistence: refresh mid-game → state restored
- [ ] `localStorage` namespace: completing today's puzzle does not unlock it on a different UTC date
- [ ] Physical keyboard + on-screen keyboard both work; don't fire when focus is in another input
- [ ] Mobile (<640px): 1×4 stacked layout, active row auto-scrolls into view on submit
- [ ] Tablet (640–1023px): 2×2 grid fits without horizontal scroll
- [ ] Desktop (≥1024px): 2×2 grid with keyboard centered below
- [ ] Dark mode: all tile colors, keyboard, timer, modals render correctly
- [ ] Color-blind mode toggle persists across sessions
- [ ] Share button: on mobile uses `navigator.share`, on desktop copies to clipboard with toast
- [ ] JSON-LD validates: VideoGame + FAQPage + HowTo + BreadcrumbList (Google Rich Results Test)
- [ ] Lighthouse performance ≥ 90 (mobile); CLS ≤ 0.1
- [ ] Lighthouse accessibility ≥ 95; all interactive elements keyboard-reachable
- [ ] Evergreen content is ≥ 2,000 words (word-count check)
- [ ] Primary keyword "quordle" appears in H1, title, URL slug, meta description, and first paragraph
- [ ] Sitemap includes `/quordle` with correct priority
- [ ] No console errors or warnings in the browser

---

## Detailed TODO List

### Phase 1 — Data Layer

- [ ] Create `data/quordle/` directory
- [ ] Create `data/quordle/answers.json` with ~2,300 curated 5-letter answer words (source: public Wordle answer list; filter offensive/proper nouns)
- [ ] Create `data/quordle/guesses.json` with ~10,000 valid guess words (superset of answers)
- [ ] Create `types/quordle.ts` with types: `LetterState`, `BoardState`, `QuordleMode`, `DailyQuordleSeed`
- [ ] Create `lib/quordle-data.ts`:
  - [ ] `getTodayAnswers(date?: Date): [string, string, string, string]` — UTC-keyed deterministic seed
  - [ ] `getRandomAnswers(): [string, string, string, string]` — practice mode
  - [ ] `isValidGuess(word: string): boolean`
  - [ ] `scoreGuess(guess: string, answer: string): LetterState[]` — proper duplicate-letter handling
  - [ ] Helper: stable 32-bit hash (cyrb128 or fnv1a) + mulberry32 PRNG

### Phase 2 — Shared Game Primitives

- [ ] Create `components/games/shared/` directory
- [ ] Build `components/games/shared/WordleBoard.tsx` (generic N×5 board, client component, flip animation, dark-mode tokens, `compact` variant)
- [ ] Build `components/games/shared/WordleKeyboard.tsx` (QWERTY layout, physical-keyboard listener, aggregated letter states, input focus guard)
- [ ] Build `hooks/useWordleGame.ts` (per-board state machine: type / backspace / submit, returns guesses / evaluations / status)
- [ ] Unit-check scoring edge cases: double letters (e.g., guess "allay" vs answer "crane" → correct 'a' dedup)

### Phase 3 — Quordle Game Component

- [ ] Create `components/quordle/` directory
- [ ] Build `components/quordle/QuordleGame.tsx`:
  - [ ] Orchestrate 4× `useWordleGame` sharing one `currentGuess`
  - [ ] Validate guess against dictionary before submitting to all 4 boards
  - [ ] Aggregate keyboard letter states across 4 boards
  - [ ] Win/lose logic (all 4 solved vs guesses exhausted)
  - [ ] Timer (start on first keystroke, stop on terminal state)
  - [ ] 2×2 / 1×4 responsive layout
- [ ] Build `components/quordle/QuordleModeTabs.tsx` (Daily / Practice tabs with URL hash sync)
- [ ] Build `components/quordle/QuordleShareButton.tsx` (emoji result grid, `navigator.share` + clipboard fallback, toast)
- [ ] Build `components/quordle/QuordleHowToPlay.tsx` (rules modal / collapsible card; also source for HowTo schema)
- [ ] Build `components/quordle/QuordleColorBlindToggle.tsx` (persists to `localStorage`)
- [ ] Create `stores/quordleStore.ts` (match existing store pattern — verify Zustand/Jotai/etc. in `stores/`):
  - [ ] Daily state namespaced by `YYYY-MM-DD`
  - [ ] Practice state ephemeral
  - [ ] SSR-safe hydration (no `window` access during render)

### Phase 4 — Page `/quordle`

- [ ] Create `app/[locale]/quordle/page.tsx`
- [ ] Add metadata: title, description, keywords, canonical, OpenGraph, Twitter card
- [ ] Add JSON-LD schemas: VideoGame + FAQPage + HowTo + BreadcrumbList
- [ ] Build above-the-fold section: H1, subtitle, `QuordleModeTabs`, `QuordleGame`, action bar
- [ ] Build below-the-fold SEO sections (all Server Components where possible):
  - [ ] `TableOfContents` (10 items)
  - [ ] H2 #1: What Is Quordle? (~180 words)
  - [ ] H2 #2: How to Play Quordle (5 H3s, ~300 words)
  - [ ] H2 #3: Quordle Rules at a Glance (8-item bullet list, ~120 words)
  - [ ] H2 #4: 10 Strategies to Solve Quordle Faster (10 H3s, ~450 words)
  - [ ] H2 #5: Best Starting Words for Quordle (`QuordleStartingWords` table, ~260 words)
  - [ ] H2 #6: Quordle vs Wordle vs Dordle vs Octordle (`QuordleComparisonTable`, ~220 words)
  - [ ] H2 #7: Daily Quordle: Reset Time & Archive (~120 words)
  - [ ] H2 #8: Quordle Hard Mode Tips (~180 words)
  - [ ] H2 #9: 5 Common Mistakes to Avoid (5 H3s, ~180 words)
  - [ ] H2 #10: Quordle FAQ (`QuordleFaq`, 8 Q&As, ~300 words, FAQPage schema)
  - [ ] Related Games block (internal links, ~90 words)
  - [ ] About & Disclaimer block (~60 words)
- [ ] Verify total evergreen word count ≥ 2,000 (use word-count script or extension)
- [ ] Verify primary keyword placement (H1, title, URL, meta, first paragraph)

### Phase 5 — Site Integration

- [ ] Update `config/nav.ts` — add Quordle entry under Games
- [ ] Update `i18n/messages/en.json` — add footer link "Quordle" → `/quordle`
- [ ] Update `app/sitemap.ts` — add `/quordle` (priority 0.9, daily)
- [ ] Update `app/[locale]/page.tsx` (home) — add Quordle card in Games/Tools grid
- [ ] Add "Related games" link to `/quordle` from:
  - [ ] `/connections-hint-today`
  - [ ] `/wordle-*` page(s)
  - [ ] `/strands-game`
  - [ ] `/minute-cryptic-today`

### Phase 6 — Testing & QA

- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds
- [ ] Manual QA on localhost for every item in the Testing & QA Checklist above
- [ ] Run Google Rich Results Test on the built page (all 4 schemas valid)
- [ ] Run Lighthouse (mobile + desktop): performance ≥ 90, accessibility ≥ 95, SEO = 100
- [ ] Test on real mobile device (iOS Safari + Android Chrome)
- [ ] Verify no layout shift when game rehydrates from `localStorage`
- [ ] Verify daily answers are identical across two browsers on the same UTC date

### Phase 7 — Launch

- [ ] Final content review (grammar, tone, internal links working, no placeholders)
- [ ] Verify disclaimer is present and visible
- [ ] Commit and push to `main`
- [ ] Verify Cloudflare auto-deploy succeeds
- [ ] Submit `/quordle` URL to Google Search Console
- [ ] Add `/quordle` to Bing Webmaster Tools
- [ ] Monitor Search Console for indexing within 72 hours
- [ ] Track rankings for `quordle`, `quordle today`, `daily quordle`, `how to play quordle` weekly for the first month

### Phase 8 — Post-launch (not in initial milestone)

- [ ] Phase 2 sub-pages: `/quordle/hint`, `/quordle/answer`, `/quordle/archive`, `/quordle/[date]`
- [ ] GitHub Actions daily hint/answer fetcher (once we decide whether to manually curate or auto-generate)
- [ ] Stats page: streaks, win rate, distribution (stored in `localStorage`)
- [ ] Seasonal / themed puzzle modes

---

## Notes

- This doc is the authoritative spec for the Quordle milestone. If a requirement changes, update this file first, then the code.
- When implementation reveals an unknown (e.g., the existing `stores/` pattern turns out to be Jotai, not Zustand), update the relevant section here rather than diverging silently.
- The shared primitives in `components/games/shared/` are the foundation for future word-puzzle games on the site. Keep them strictly generic — no Quordle-specific logic leaks in.
