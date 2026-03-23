# CLAUDE.md — NYT Connections Hint Feature

## Project Overview

Add a complete NYT Connections hints and answers section to dailycryptic.org, including a daily-updating today page, individual date archive pages, and a full archive listing page. The content is fetched automatically via GitHub Actions and updated daily.

This is the single largest traffic opportunity for the site: the "connections hint" keyword cluster has 11.1M monthly searches globally (5.0M in the US alone) with an average KD of 36%.

## Key Decisions (Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data source risk | Accept risk, launch first | Use NYT API; if blocked, switch to manual. Speed > perfection. |
| Legal risk | Understood, proceed | Dozens of major sites (Forbes, Mashable, word.tips) do the same. Add disclaimer on page. |
| Update latency | 30-60 min delay acceptable | Most users don't search in the first minute after reset. |
| Daily maintenance | Zero time (fully automated) | Rely entirely on GitHub Actions. If it fails, that day has no update. |
| Future expansion | No pre-planning needed | Routes use `/connections-hint-today` (not `/games/...`). Add new games later with their own routes. |
| Hint text generation | Simple templates | Use fixed templates like "These words all relate to [category]". No AI API dependency. |
| Topical relevance | Not concerned | Both are word puzzles. word.tips already does crossword solver + connections + wordle on one domain. |
| Deployment | Push to main = auto deploy | GitHub Actions pushes to main → Cloudflare builds and deploys automatically. |

## Business Context

- Monetization: Google AdSense (same as rest of site)
- No login, no paywall, no membership
- Revenue comes from ad-safe content surfaces with high daily traffic
- Connections generates massive recurring daily traffic (users return every day for new hints)

## Target Keywords

| Keyword | Monthly Volume | KD |
|---------|---------------|-----|
| connections hint | 5.0M | 32 |
| connections hints today | 155.5K | 29 |
| connections hints | 386.9K | 30 |
| nyt connections hints | 450K | 75 |
| connections puzzle hint | 5.9K | 33 |
| connections game hint | 12K | 44 |

## Competitors & Benchmarks

| Competitor | DR | Traffic | Key Strength |
|------------|-----|---------|-------------|
| word.tips | 62 | 2.1M | Interactive 3-tier flashcard hints + 2,500 words evergreen content |
| Mashable | 91 | 1.0M | High DR + editorial voice |
| CNET | 91 | 861K | Tiered spoiler gates |
| Forbes | 94 | — | Massive DR |
| Tom's Guide | 91 | — | Hybrid URL strategy (evergreen + date archive) |
| TryHard Guides | ~50 | — | Massive date-page archive for long-tail SEO |

**Key insight:** word.tips (DR 62) outperforms DR 91 sites by having the best interactive UX + deepest evergreen content on a single URL. We should replicate this strategy.

## Page Architecture

### Three pages

1. **`/connections-hint-today`** — Main evergreen page, updated daily
   - Single URL that accumulates all PageRank and backlinks
   - Interactive 3-level progressive hints (Hint → Group Name → Words)
   - 2,000+ words of evergreen SEO content below the daily section
   - FAQ schema (7 questions)
   - Recent puzzles preview (last 4 days) at bottom

2. **`/connections-hint/[date]`** — Individual date archive pages
   - Simplified version of today page (no evergreen SEO content)
   - Same interactive hint component
   - Previous/Next navigation
   - 300-500 words
   - Captures long-tail searches like "connections hint march 23"

3. **`/connections-hint`** — Archive listing page
   - All puzzles grouped by month
   - 3-column card grid (responsive: 3 col desktop, 2 col tablet, 1 col mobile)
   - Each card shows: puzzle number badge, 4-color group name preview, date, "View Hints →" link
   - "Latest" tag on newest puzzle
   - "Show More" button per month (initially show 9 cards)
   - Design reference: pinpointanswer.today/linkedin-pinpoint-answer/

## Data Architecture

### Data file: `data/connections/puzzles.json`

```json
{
  "lastUpdated": "2026-03-23T12:00:00.000Z",
  "puzzles": [
    {
      "id": 1016,
      "printDate": "2026-03-23",
      "status": "published",
      "groups": [
        {
          "color": "yellow",
          "name": "BASE64_ENCODED",
          "hint": "Think about things in a kitchen",
          "words": ["BASE64_W1", "BASE64_W2", "BASE64_W3", "BASE64_W4"]
        },
        {
          "color": "green",
          "name": "BASE64_ENCODED",
          "hint": "These words share an ending",
          "words": ["BASE64_W1", "BASE64_W2", "BASE64_W3", "BASE64_W4"]
        },
        {
          "color": "blue",
          "name": "BASE64_ENCODED",
          "hint": "Pop culture knowledge helps here",
          "words": ["BASE64_W1", "BASE64_W2", "BASE64_W3", "BASE64_W4"]
        },
        {
          "color": "purple",
          "name": "BASE64_ENCODED",
          "hint": "Look for a hidden pattern in each word",
          "words": ["BASE64_W1", "BASE64_W2", "BASE64_W3", "BASE64_W4"]
        }
      ]
    }
  ]
}
```

- Group names and words are base64-encoded (consistent with existing puzzles.json pattern for public repo safety)
- Hints are plain text (not spoilers themselves, just vague clues)
- `status` field supports "published" / "scheduled"

### Data access: `lib/connections-data.ts`

Functions needed:
- `getAllConnectionsPuzzles()` — returns all puzzles, sorted by date desc
- `getConnectionsPuzzleByDate(date: string)` — returns single puzzle
- `getTodaysConnectionsPuzzle()` — returns today's puzzle (most recent published)
- `getRecentConnectionsPuzzles(count: number)` — for the "recent" preview section

## Component Design

### `components/connections/ConnectionsHintCard.tsx` (Client Component)

Interactive 3-level progressive hint reveal for each color group.

**Props:** `{ color: "yellow"|"green"|"blue"|"purple", hint: string, groupName: string, words: string[] }`

**UI:**
- Color-coded left border strip
- Color label + difficulty indicator (Easiest / Moderate / Tricky / Hardest)
- Three buttons in a row: "See Hint" → "See Group" → "See Words"
- Each button reveals the next level with a fade-in animation
- Mobile: buttons stack vertically

**Colors:**
- Yellow: `bg-amber-50 border-amber-400` (dark: `bg-amber-950 border-amber-600`)
- Green: `bg-emerald-50 border-emerald-400`
- Blue: `bg-blue-50 border-blue-400`
- Purple: `bg-purple-50 border-purple-400`

### `components/connections/ConnectionsAnswerReveal.tsx` (Client Component)

Spoiler gate for full answers.

**UI:**
- Warning text: "Spoiler alert — full answers below"
- Single "Reveal All Answers" button
- On click: shows all 4 groups with their words in a 2x2 grid (or 1-column on mobile)
- Each revealed group: colored background card with group name as header + 4 words as pills

### `components/connections/ConnectionsPuzzleCard.tsx` (Server Component)

Archive card for listing pages.

**Props:** `{ puzzle: ConnectionsPuzzle, isLatest?: boolean }`

**UI:**
- Rounded card with border and shadow
- Top-left: Circular number badge with gradient
- Top-right: "Latest" tag (if applicable)
- Body: 4 rows, each with color dot + group name
- Footer: date (left) + "View Hints →" link (right)

### `components/connections/ConnectionsMonthGroup.tsx` (Client Component)

Monthly group container for archive page.

**Props:** `{ month: string, puzzles: ConnectionsPuzzle[] }`

**UI:**
- H2 heading: "Connections #1016–#1000 (March 2026)"
- 3-column responsive card grid
- Initially shows 9 cards
- "Show More" button reveals rest of month
- Smooth height animation on expand

## Page Content — `/connections-hint-today`

### Daily Section (updates daily, not counted in SEO word count)

- H1: "NYT Connections Hints and Answers Today" with subtitle showing date + puzzle number
- 4x ConnectionsHintCard components (yellow, green, blue, purple)
- ConnectionsAnswerReveal component
- TableOfContents

### Evergreen SEO Content (2,000+ words, permanent)

| Section (H2) | H3s | Target Words |
|---|---|---|
| What Is NYT Connections? | — | 150 |
| How to Play NYT Connections | Step 1–5 (5 H3s) | 200 |
| Connections Difficulty Levels — What the Colors Mean | Yellow, Green, Blue, Purple (4 H3s) | 250 |
| 10 Tips and Strategies for Solving Connections | 10 H3s (one per tip) | 400 |
| Common Connections Category Patterns | Synonyms, ___ Word patterns, Pop Culture, Hidden Words, Letter Patterns (5 H3s) | 300 |
| NYT Connections vs Other Word Games | vs Wordle, vs Strands, vs Cryptic Crosswords (3 H3s) | 200 |
| Connections Hints FAQ | 7 Q&As | 350 |
| Recent Connections Puzzles | — (dynamic list) | 50 |
| More Daily Puzzle Hints | — (RelatedLinks) | 50 |
| **Total** | **8 H2s, 25+ H3s** | **~2,000** |

### FAQ Questions (with FAQPage schema)

1. What time does NYT Connections reset each day?
2. How many guesses do you get in Connections?
3. What do the colors mean in NYT Connections?
4. Can I play old Connections puzzles?
5. Is there a strategy for solving Connections?
6. What is the hardest color in Connections?
7. How is Connections different from Wordle?

### Schema Markup

- `NewsArticle` — for daily-updating content
- `FAQPage` — 7 Q&As
- `BreadcrumbList` — Home > Connections Hints > Today

## Page Content — `/connections-hint/[date]`

- H1: "NYT Connections Hints and Answers — [Day], [Month] [Date]" with puzzle number
- 4x ConnectionsHintCard (same interactive component)
- ConnectionsAnswerReveal
- Previous/Next puzzle navigation
- Links to: today page, full archive, minute-cryptic-today
- BreadcrumbList schema only (no FAQ, no NewsArticle)
- No evergreen SEO content (avoid duplicate content with today page)

## Page Content — `/connections-hint`

- H1: "All NYT Connections Hints and Answers (Updated Daily)"
- Intro paragraph (1-2 sentences)
- Monthly groups with card grids (ConnectionsMonthGroup)
- Bottom: RelatedLinks to today page + tools
- BreadcrumbList + CollectionPage schema

## GitHub Actions Automation

### Workflow: `.github/workflows/update-connections.yml`

**Schedule:** Daily at UTC 05:30 (12:30 AM ET, 30 min after NYT reset)

**Steps:**
1. Checkout repository
2. Run `scripts/fetch-connections.mjs`
3. Script fetches from NYT public API: `https://www.nytimes.com/svc/connections/v2/YYYY-MM-DD.json`
4. Parse response → extract groups, words, difficulty
5. Generate hint text for each group (template-based or simple description)
6. Base64-encode group names and words
7. Prepend new puzzle to `data/connections/puzzles.json`
8. Git add, commit, push
9. Cloudflare deployment triggers automatically

### Script: `scripts/fetch-connections.mjs`

**Input:** Current date (or date argument)
**Output:** Updated `data/connections/puzzles.json`

**Error handling:**
- If NYT API returns 404 (puzzle not yet available), retry after 30 min (max 3 retries)
- If puzzle already exists in JSON (duplicate check by date), skip
- If API structure changes, fail gracefully and open a GitHub issue

### Fallback

If GitHub Actions fails:
- Manual fallback: run `node scripts/fetch-connections.mjs` locally and push
- The today page should gracefully handle missing data (show "Today's puzzle is being updated" message)

## Navigation & Sitemap Updates

### Nav config (`config/nav.ts`)

Add a new top-level dropdown "Games" alongside existing "Cryptic":

```
Home | Cryptic ▼ | Games ▼ | Today's Clue
```

Or add Connections under the existing Cryptic dropdown in a new "Games" section:

```
Cryptic ▼
  ├── Minute Cryptic (existing)
  ├── Guide (existing)
  ├── Tools (existing)
  ├── Reference (existing)
  └── Games (NEW)
      ├── Connections Hints
      └── (future games)
```

Decision: Use the approach that fits best with the current nav layout.

### Footer (`i18n/messages/en.json`)

Add new "Games" group or add under existing groups:
- "Connections Hints" → `/connections-hint-today`
- "Connections Archive" → `/connections-hint`

### Sitemap (`app/sitemap.ts`)

Add:
- `/connections-hint-today` (priority 0.95, changeFrequency: daily)
- `/connections-hint` (priority 0.8, changeFrequency: daily)
- All `/connections-hint/[date]` pages (priority 0.6, changeFrequency: monthly)

## Design Guidelines

### Color Palette for Connections

Match NYT's official Connections colors:
- Yellow: `#F9DF6D` / amber-300
- Green: `#A0C35A` / lime-500
- Blue: `#B0C4EF` / blue-300
- Purple: `#BA81C5` / purple-400

Use these as accent colors in cards, borders, and badges. The page base should use the site's existing theme (light/dark mode compatible).

### Card Design Reference

Archive cards follow pinpointanswer.today pattern:
- Rounded corners (rounded-xl)
- Subtle border + shadow
- Hover effect: slight lift + border color change
- Number badge: circular, gradient background
- "Latest" tag: small pill badge in primary/accent color

### Typography

- Puzzle numbers: font-heading, bold
- Group names in cards: font-body, medium weight
- Dates: text-sm, muted-foreground
- Follow existing site typography (Outfit headings, Plus Jakarta Sans body)

## Writing Guidelines

### Evergreen content style

- Short paragraphs (2-3 sentences max)
- Each H3 section: 30-60 words
- Conversational but informative tone
- Include specific examples where possible (e.g., "a yellow group might be 'Types of Cheese'")
- Do NOT mention specific daily puzzles in evergreen content (it would become stale)
- Internal links use descriptive anchor text (not "click here")

### What NOT to do

- Do not copy any text from competitor pages
- Do not include NYT branding/logos
- Do not frame or embed the NYT Connections game
- Do not claim affiliation with NYT
- Include a disclaimer: "This site is not affiliated with The New York Times"

---

## Detailed TODO List

### Phase 1: Data Layer

- [ ] Create `data/connections/` directory
- [ ] Create initial `data/connections/puzzles.json` with seed data (5-7 days of puzzles, manually collected)
- [ ] Create `types/connections.ts` with TypeScript types (`ConnectionsPuzzle`, `ConnectionsGroup`, color union type)
- [ ] Create `lib/connections-data.ts` with data access functions:
  - [ ] `getAllConnectionsPuzzles()`
  - [ ] `getConnectionsPuzzleByDate(date: string)`
  - [ ] `getTodaysConnectionsPuzzle()`
  - [ ] `getRecentConnectionsPuzzles(count: number)`
  - [ ] `getConnectionsPuzzlesByMonth()` — returns puzzles grouped by month for archive

### Phase 2: Interactive Components

- [ ] Create `components/connections/ConnectionsHintCard.tsx`
  - [ ] 3-level progressive reveal (Hint → Group → Words)
  - [ ] Color-coded left border for each difficulty level
  - [ ] Fade-in animation on reveal
  - [ ] Mobile-responsive layout
  - [ ] Base64 decoding for group names and words (client-side only)
- [ ] Create `components/connections/ConnectionsAnswerReveal.tsx`
  - [ ] Spoiler warning text
  - [ ] "Reveal All Answers" button
  - [ ] 2x2 grid of color-coded answer cards on reveal
  - [ ] Base64 decoding on reveal
- [ ] Create `components/connections/ConnectionsPuzzleCard.tsx`
  - [ ] Number badge with gradient
  - [ ] "Latest" tag support
  - [ ] 4-color group name preview
  - [ ] Date + "View Hints →" link
  - [ ] Hover lift effect
- [ ] Create `components/connections/ConnectionsMonthGroup.tsx`
  - [ ] Month heading with puzzle range
  - [ ] 3-column responsive card grid
  - [ ] "Show More" button (initially show 9)
  - [ ] Smooth expand animation

### Phase 3: Today Page (`/connections-hint-today`)

- [ ] Create `app/[locale]/connections-hint-today/page.tsx`
- [ ] Add metadata (title, description, keywords, canonical)
- [ ] Add JSON-LD schemas (NewsArticle, FAQPage, BreadcrumbList)
- [ ] Build page layout:
  - [ ] ContentHero with date + puzzle number
  - [ ] 4x ConnectionsHintCard (yellow → purple)
  - [ ] ConnectionsAnswerReveal
  - [ ] TableOfContents (8 items)
  - [ ] Write evergreen content sections:
    - [ ] "What Is NYT Connections?" (~150 words)
    - [ ] "How to Play NYT Connections" with 5 H3 steps (~200 words)
    - [ ] "Connections Difficulty Levels — What the Colors Mean" with 4 color H3s (~250 words)
    - [ ] "10 Tips and Strategies for Solving Connections" with 10 H3s (~400 words)
    - [ ] "Common Connections Category Patterns" with 5 H3s (~300 words)
    - [ ] "NYT Connections vs Other Word Games" with 3 H3s (~200 words)
    - [ ] "Connections Hints FAQ" with 7 Q&As using SimpleFaq (~350 words)
  - [ ] Recent puzzles preview (last 4 days as horizontal cards)
  - [ ] RelatedLinks section
- [ ] Add `generateStaticParams()` for locale support
- [ ] Verify total evergreen word count >= 2,000

### Phase 4: Date Archive Page (`/connections-hint/[date]`)

- [ ] Create `app/[locale]/connections-hint/[date]/page.tsx`
- [ ] Add metadata with date-specific title and description
- [ ] Add BreadcrumbList JSON-LD
- [ ] Build page layout:
  - [ ] H1 with date and puzzle number
  - [ ] 4x ConnectionsHintCard (reuse same component)
  - [ ] ConnectionsAnswerReveal
  - [ ] Previous/Next puzzle navigation links
  - [ ] Links to today page + archive + minute-cryptic-today
- [ ] Add `generateStaticParams()` generating params for all puzzle dates
- [ ] Handle 404 for dates without puzzles

### Phase 5: Archive Listing Page (`/connections-hint`)

- [ ] Create `app/[locale]/connections-hint/page.tsx`
- [ ] Add metadata (title, description, keywords)
- [ ] Add BreadcrumbList + CollectionPage JSON-LD
- [ ] Build page layout:
  - [ ] ContentHero with archive title
  - [ ] Intro paragraph
  - [ ] Monthly groups using ConnectionsMonthGroup
  - [ ] RelatedLinks at bottom
- [ ] Add `generateStaticParams()`

### Phase 6: Navigation & Sitemap

- [ ] Update `config/nav.ts` — add Connections entry
- [ ] Update `i18n/messages/en.json` — add Connections to footer links
- [ ] Update `app/sitemap.ts` — add all three page types:
  - [ ] `/connections-hint-today` (priority 0.95, daily)
  - [ ] `/connections-hint` (priority 0.8, daily)
  - [ ] All `/connections-hint/[date]` pages (priority 0.6, monthly)

### Phase 7: GitHub Actions Automation

- [ ] Create `scripts/fetch-connections.mjs`
  - [ ] Fetch from NYT Connections API
  - [ ] Parse puzzle data (groups, words, difficulty)
  - [ ] Generate hint text for each group
  - [ ] Base64-encode sensitive fields
  - [ ] Prepend to puzzles.json
  - [ ] Handle duplicate dates (skip if exists)
  - [ ] Handle API errors gracefully
- [ ] Create `.github/workflows/update-connections.yml`
  - [ ] Cron schedule: `30 5 * * *` (UTC 05:30)
  - [ ] Checkout, run script, commit, push
  - [ ] Add retry logic (3 attempts, 30 min apart)
  - [ ] Only commit if puzzles.json actually changed

### Phase 8: Testing & QA

- [ ] Build project successfully (`pnpm build`)
- [ ] Verify today page renders with seed data
- [ ] Verify date archive page renders for each seed date
- [ ] Verify archive listing page shows monthly groups correctly
- [ ] Verify "Show More" works on archive page
- [ ] Verify 3-level hint reveal works on mobile and desktop
- [ ] Verify answer reveal spoiler gate works
- [ ] Verify Previous/Next navigation on date pages
- [ ] Verify all internal links are correct
- [ ] Verify sitemap includes all new pages
- [ ] Verify JSON-LD schemas are valid (use Google Rich Results Test)
- [ ] Verify meta titles and descriptions are unique across pages
- [ ] Verify dark mode compatibility for all color-coded elements
- [ ] Test GitHub Actions script locally with `node scripts/fetch-connections.mjs`
- [ ] Verify the script correctly updates puzzles.json
- [ ] Verify no console errors in browser

### Phase 9: Launch

- [ ] Seed at least 7 days of puzzle data
- [ ] Commit and push all code
- [ ] Verify Cloudflare deployment succeeds
- [ ] Enable GitHub Actions workflow
- [ ] Verify first automated update runs successfully
- [ ] Submit new URLs to Google Search Console
- [ ] Monitor for the first 3 days of automated updates
