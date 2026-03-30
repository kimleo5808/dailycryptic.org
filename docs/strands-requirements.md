# NYT Strands Hints Feature — Requirements & Implementation Spec

## Project Overview

Add a complete NYT Strands hints, spangram, and answers section to dailycryptic.org, replicating the proven 3-page architecture from the Connections feature but with content, components, and UX entirely tailored to Strands gameplay mechanics.

**Estimated traffic potential:** 50K–300K monthly visits from the "strands hint" keyword cluster.

## Competitive Landscape

| Competitor | Evergreen Words | Hint Interactivity | FAQ | Schema | Key Weakness |
|-----------|----------------|-------------------|-----|--------|-------------|
| word.tips | ~180 (thin) | Letter-by-letter reveal | 0 | NewsArticle | Almost no evergreen content |
| NYTGameHint | ~600 | Best: per-word reveal + grid | 6 | Article | No monthly archive, weak SEO structure |
| strands.today | ~1,550 | Progressive | 5 | FAQPage | No HowTo schema, thin strategies |
| TechRadar guide | ~1,400 | None (static) | 5 | FAQ+HowTo | Separate guide page, not on hints URL |
| TechRadar daily | ~300 (thin) | FAQ fold | 4 | FAQ | Extremely thin per-day content |
| Mashable | ~200 (thin) | H2-tier gates | 0 | None | Thinnest content, relies on DR 91 |
| Try Hard Guides | ~500 | None (direct answers) | 0 | BreadcrumbList | No progressive hints, no interactivity |
| Insider Gaming | ~550 | 3-tier | 0 | None | No schema, no FAQ, no archive |

**Our target:** 2,400+ words of evergreen content on the today page (deeper than any competitor), best-in-class interactive hints, full schema markup (NewsArticle + FAQPage + HowTo + BreadcrumbList), and a complete date archive.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL structure | `/strands-hint-today`, `/strands-hint/[date]`, `/strands-hint` | Matches Connections pattern. Top-level routes, no `/games/` prefix. |
| Evergreen URL strategy | Single `/strands-hint-today` accumulates all PageRank | Proven by word.tips (#3 for "connections hints") and Connections feature |
| Content differentiation | Original Strands-specific content, NOT keyword-swapped Connections | Strands has unique mechanics (spangram, hint earning, letter grid) requiring unique content |
| Spangram as differentiator | Dedicated SpangramReveal component with direction + letter count + first/last letter hints | No competitor offers all three spangram hint levels |
| Data source | NYT Strands API `https://www.nytimes.com/svc/strands/v2/YYYY-MM-DD.json` | Same approach as Connections |
| Schema markup | NewsArticle + FAQPage + HowTo + BreadcrumbList | TechRadar guide uses HowTo — we combine it with daily content on one URL |

---

## Target Keywords

| Keyword | Estimated Monthly Volume | Target Page |
|---------|------------------------|-------------|
| strands hint | 500K–1M | `/strands-hint-today` |
| strands hints today | 100K–200K | `/strands-hint-today` |
| nyt strands hints | 200K–400K | `/strands-hint-today` |
| strands spangram today | 50K–100K | `/strands-hint-today` |
| strands answers today | 100K–200K | `/strands-hint-today` |
| strands hint [date] | Long-tail | `/strands-hint/[date]` |
| nyt strands archive | 10K–30K | `/strands-hint` |

---

## Data Architecture

### Type Definitions — `types/strands.ts`

```typescript
export interface StrandsPuzzle {
  id: number;                    // Puzzle number (e.g. 757)
  printDate: string;             // "2026-03-30"
  status?: "published" | "scheduled";
  clue: string;                  // NYT's theme clue (plain text, not a spoiler)
  hint: string;                  // Our additional hint (plain text)
  theme: string;                 // Base64-encoded theme name
  spangram: string;              // Base64-encoded spangram word
  spangramDirection: "horizontal" | "vertical";  // Orientation
  spangramLetterCount: number;   // Character count
  themeWords: string[];          // Base64-encoded theme word array
}

export interface DecodedStrandsPuzzle {
  id: number;
  printDate: string;
  clue: string;
  hint: string;
  theme: string;                 // Decoded
  spangram: string;              // Decoded
  spangramDirection: "horizontal" | "vertical";
  spangramLetterCount: number;
  themeWords: string[];          // Decoded
}

export interface StrandsDataFile {
  lastUpdated: string;
  puzzles: StrandsPuzzle[];
}

export interface StrandsMonthData {
  label: string;                 // "March 2026"
  rangeLabel: string;            // "Strands #750–#757 (March 2026)"
  puzzles: DecodedStrandsPuzzle[];
}
```

### Data File — `data/strands/puzzles.json`

```json
{
  "lastUpdated": "2026-03-30T05:30:00.000Z",
  "puzzles": [
    {
      "id": 757,
      "printDate": "2026-03-30",
      "status": "published",
      "clue": "Can I have my quarter back?",
      "hint": "Think about professional sports teams with animal or historical names",
      "theme": "QVRBVEVSU0FDS1M=",
      "spangram": "RkVFTElOR0xVQ0tZ",
      "spangramDirection": "horizontal",
      "spangramLetterCount": 12,
      "themeWords": ["V09SRA==", "V09SRDI=", "..."]
    }
  ]
}
```

### Data Access — `lib/strands-data.ts`

Mirror `lib/connections-data.ts` with these functions:

| Function | Returns | Notes |
|----------|---------|-------|
| `getAllStrandsPuzzles()` | `DecodedStrandsPuzzle[]` | All published, sorted date desc |
| `getStrandsPuzzleByDate(date)` | `DecodedStrandsPuzzle \| null` | Single puzzle by YYYY-MM-DD |
| `getTodaysStrandsPuzzle()` | `DecodedStrandsPuzzle \| null` | Most recent published puzzle |
| `getRecentStrandsPuzzles(count)` | `DecodedStrandsPuzzle[]` | N most recent (excluding today) |
| `getStrandsPuzzlesByMonth()` | `StrandsMonthData[]` | Grouped by month for archive |
| `getAdjacentStrandsPuzzles(date)` | `{ prev, next }` | For prev/next navigation |

All functions use React `cache()` for deduplication. Base64 decoding happens server-side via `Buffer.from(encoded, 'base64').toString('utf8')`.

---

## Component Design

### 1. `components/strands/StrandsThemeCard.tsx` (Client Component)

**Purpose:** 3-level progressive reveal for the daily theme.

**Levels:**
- Level 0 (default): Shows NYT's clue text only
- Level 1 ("See Our Hint"): Reveals our additional editorial hint
- Level 2 ("Reveal Theme"): Shows the decoded theme name

**Design:**
- Full-width card with rounded-xl corners
- Left border: 4px amber-400 (Strands brand color)
- Background: amber-50 light / amber-950/30 dark
- NYT clue displayed in medium italic text
- Each level button: pill shape, subtle border, hover glow
- Fade-in animation (150ms) on each reveal

**Props:** `{ clue: string, hint: string, theme: string }`

### 2. `components/strands/StrandsSpangramReveal.tsx` (Client Component)

**Purpose:** Dedicated spangram hint component with 4 progressive levels. This is our key differentiator — no competitor offers this granularity.

**Levels:**
- Level 0 (default): Shows direction (Horizontal ←→ / Vertical ↕) + letter count
- Level 1 ("Show First & Last Letter"): Reveals first and last characters (e.g., "F...Y")
- Level 2 ("Reveal Spangram"): Shows full spangram word

**Design:**
- Card with gradient border: amber-300 → yellow-400
- Star icon (⭐) in header
- Direction shown as icon + text (always visible, not a spoiler)
- Letter count shown as pill badge (always visible)
- Reveal buttons: amber/gold theme, matching Strands' yellow spangram highlight

**Props:** `{ spangram: string, direction: "horizontal" | "vertical", letterCount: number }`

### 3. `components/strands/StrandsWordList.tsx` (Client Component)

**Purpose:** Per-word progressive reveal for all theme words.

**Design:**
- Spoiler warning banner at top: "Full answers below — proceed with caution"
- List of word rows, each with its own "Reveal" button
- Theme words: blue pill on reveal (matching NYT's blue highlight)
- Spangram row: yellow pill, visually distinct, at bottom of list
- "Reveal All Words" button at bottom for quick reveal
- Word count indicator: "7 theme words + 1 spangram"

**Props:** `{ themeWords: string[], spangram: string }`

### 4. `components/strands/StrandsPuzzleCard.tsx` (Server Component)

**Purpose:** Archive card for listing pages.

**Design:**
- Rounded-xl card with border + shadow
- Top-left: circular number badge (#757) with amber gradient
- Top-right: "Latest" pill badge (if applicable)
- Body: clue text preview (truncated at ~60 chars with ellipsis)
- Theme indicator: row of dots representing theme word count (no spoiler)
- Footer: date (left) + "View Hints →" link (right)
- Hover: translateY(-2px) + shadow increase + border color shift

**Props:** `{ puzzle: DecodedStrandsPuzzle, isLatest?: boolean }`

### 5. `components/strands/StrandsMonthGroup.tsx` (Client Component)

**Purpose:** Monthly group container for archive page.

**Design:** Same pattern as ConnectionsMonthGroup:
- H2 heading: "Strands #750–#757 (March 2026)"
- 3-column responsive grid (3 col desktop, 2 col tablet, 1 col mobile)
- Initially shows 9 cards
- "Show More" button with count badge
- Smooth height transition on expand

**Props:** `{ month: StrandsMonthData }`

---

## Page 1: `/strands-hint-today` — Today Page

### Metadata

```
Title: "NYT Strands Hints Today — Spangram, Theme Words and Answers {date}"
Description: "Free hints and answers for today's NYT Strands puzzle #{id}. Progressive spangram clues, theme word reveals, and expert strategies. Updated daily."
Keywords: strands hint, strands hints today, nyt strands hints, strands spangram today, strands answers today, nyt strands today
Canonical: /strands-hint-today
```

### JSON-LD Schemas

1. **BreadcrumbList:** Home > Strands Hints
2. **NewsArticle:** Title, description, datePublished, dateModified
3. **FAQPage:** 7 Q&A pairs
4. **HowTo:** "How to Play NYT Strands" with 5 steps

### Page Layout (top to bottom)

#### Dynamic Daily Section (not counted toward evergreen word total)

```
ContentHero
  eyebrow: "Strands"
  title: "NYT Strands Hints, Spangram and Answers Today"
  description: "{dateLabel} — Strands #{id}. Reveal hints one level at a time, or jump straight to the answers."

StrandsThemeCard (3-level theme reveal)
StrandsSpangramReveal (spangram hints with direction + letters)
StrandsWordList (per-word reveal + full reveal)

Disclaimer: "This site is not affiliated with The New York Times. Strands is a trademark of The New York Times Company."

TableOfContents (8 items)
```

#### Evergreen Content Sections

Each section below is a permanent part of the page. Content must be original, factually accurate about Strands mechanics, and NOT adapted from Connections content.

---

**H2: What Is NYT Strands?** `id="what-is-strands"`

| Requirement | Target |
|-------------|--------|
| Word count | 150–200 |
| H3 count | 0 |

Content must cover:
- 6x8 letter grid with 48 letters, every letter belongs to a word
- Find theme words by tracing adjacent letters in any direction
- One special word (spangram) spans the entire board edge to edge
- Created by puzzle editor Tracy Bennett (also edits Wordle)
- Launched March 2024 in beta, full release June 2024
- Third most popular NYT game (1.5 billion solves in 2025)
- Free to play, new puzzle daily at midnight ET

**Quality gate:** Must NOT contain phrases like "similar to Connections" or "like Wordle" — this section describes Strands on its own terms. Comparisons belong in the dedicated comparison section.

---

**H2: How to Play NYT Strands** `id="how-to-play"`

| Requirement | Target |
|-------------|--------|
| Word count | 220–280 |
| H3 count | 5 |
| Schema | HowTo (5 steps) |

**H3: Step 1 — Read the Theme Clue**
- Every puzzle shows a clue at the top. It might be literal ("Types of fruit") or a pun ("Can I have my quarter back?"). The clue is the single most important piece of information.

**H3: Step 2 — Trace Words Through the Grid**
- Drag or tap adjacent letters to form words. Paths can go in all 8 directions (horizontal, vertical, diagonal) and can change direction mid-word. Minimum 4 letters.

**H3: Step 3 — Find the Spangram**
- The spangram is a special word or phrase that touches two opposite edges of the board. It describes the overall theme. Finding it early makes the rest easier.

**H3: Step 4 — Earn and Use Hints**
- Finding 3 non-theme words (4+ letters each) earns one hint. A hint highlights the letters of an undiscovered theme word. Hints are optional and unlimited.

**H3: Step 5 — Fill Every Letter**
- The puzzle is complete when every one of the 48 letters belongs to a found word. No letters are leftover. Solving without hints earns a "Perfect" rating.

**Quality gate:** Each step must describe a concrete game action, not vague advice. Steps must follow the actual gameplay flow a new player would experience.

---

**H2: What Is a Spangram? The Key to Every Strands Puzzle** `id="spangram"`

| Requirement | Target |
|-------------|--------|
| Word count | 220–280 |
| H3 count | 3 |

**H3: Spangram Rules**
- Must touch two opposite edges of the 6x8 grid (left↔right or top↔bottom)
- Can wind in any direction to reach both edges
- Usually the longest word on the board
- Can be a compound phrase without spaces (e.g., ITALIANFOOD, STAINREMOVAL)
- Highlighted in yellow when found (theme words highlight in blue)

**H3: Why Finding the Spangram First Wins Games**
- The spangram IS the theme name — finding it reveals what all other words have in common
- Strategic approach: scan edge letters first, look for long words starting or ending at the border
- Even partial identification narrows the search dramatically

**H3: Horizontal vs Vertical Spangrams**
- Horizontal spans left edge to right edge (or vice versa)
- Vertical spans top edge to bottom edge (or vice versa)
- Our daily hints include the spangram direction as a spoiler-free first clue

**Quality gate:** Must explain spangram as a game mechanic with specific examples, not generic description. Must mention the yellow/blue color distinction.

---

**H2: What Makes a Strands Puzzle Hard or Easy?** `id="difficulty"`

| Requirement | Target |
|-------------|--------|
| Word count | 180–230 |
| H3 count | 3 |

**H3: Easy Puzzles — Straightforward Themes**
- Clue is literal and direct
- Theme words are common vocabulary
- Spangram is a recognizable single word or phrase

**H3: Moderate Puzzles — Wordplay Clues**
- Clue contains puns, double meanings, or idioms
- Requires thinking beyond the literal interpretation
- Example pattern: "It's on the house" → building materials

**H3: Hard Puzzles — Abstract Themes and Cultural References**
- Clue is highly abstract or culturally specific
- Theme words may be niche vocabulary
- Spangram may be an unusual compound phrase

**Quality gate:** Must include at least one concrete example clue in each difficulty tier to illustrate the difference. Do NOT use a difficulty rating system that doesn't exist in the actual game — Strands has no color-coded difficulty like Connections.

---

**H2: 10 Expert Strategies for Solving NYT Strands** `id="strategies"`

| Requirement | Target |
|-------------|--------|
| Word count | 400–500 |
| H3 count | 10 |

Each strategy is one H3 with 35–55 words.

1. **H3: Decode the Clue — Think Literal and Figurative**
   - Read the clue both ways. "Can I have my quarter back?" sounds like money but means quarterback → football teams.

2. **H3: Hunt the Spangram First**
   - The spangram reveals the theme. Focus on edge letters and trace long words that touch opposite borders.

3. **H3: Start From the Corners**
   - Corner letters have only 3 neighbors (vs 8 for center letters). Fewer options = easier deduction.

4. **H3: Spot Common Suffixes and Prefixes**
   - Look for -ING, -TION, -ED, -ER, -LY clusters. These are often word endings that help you build backward.

5. **H3: Watch for Uncommon Letter Clusters**
   - Double letters (FF, ZZ, QU) or unusual combos (PH, GH) often belong to the same word.

6. **H3: Remember — Every Letter Is Used**
   - Unlike traditional word searches, there are zero filler letters. If letters seem leftover, reconsider your found words.

7. **H3: Farm Hints with Short Non-Theme Words**
   - Strategically find 4-letter common words (THAT, THIS, HAVE) to fill the hint meter before tackling hard theme words.

8. **H3: Save Hints for the Final Words**
   - The first few theme words are usually findable by logic. Save earned hints for the last 1-2 stubborn words.

9. **H3: Work the Edges Inward**
   - Edge letters are more constrained. Solve border words first, then the center fills in naturally.

10. **H3: Learn the Editor's Patterns**
    - Tracy Bennett has recurring styles: pun clues, fill-in-the-blank themes, pop culture categories. Playing daily builds pattern recognition.

**Quality gate:** Each tip must be specific to Strands mechanics (grid, tracing, spangram, hint earning). Generic word game advice is not acceptable. Must include the CalloutBox component for one highlight tip (suggest tip #6 about every letter being used).

---

**H2: Common NYT Strands Theme Patterns** `id="patterns"`

| Requirement | Target |
|-------------|--------|
| Word count | 300–370 |
| H3 count | 6 |

**H3: Synonym Sets**
- Most common type. "Words meaning fast" → QUICK, RAPID, SWIFT. Clue is usually direct and literal.

**H3: Fill-in-the-Blank Phrases**
- All words complete a phrase: "_____ game" → BOARD, VIDEO, CARD. Clue often uses blank notation.

**H3: Pun and Wordplay Themes**
- The clue misdirects. "All the trimmings" sounds like food garnishes but means Christmas decorations. Hardest to crack.

**H3: Pop Culture Categories**
- Movie characters, sports teams, song titles, TV shows. Requires broad cultural knowledge.

**H3: Hidden Word Patterns**
- Each theme word contains a smaller hidden word, or all words share a letter pattern. The trickiest structural category.

**H3: Concrete Classification**
- Direct categories: types of dance, kitchen items, dog breeds. Most beginner-friendly alongside synonym sets.

**Quality gate:** Each pattern must include a specific example (a real or realistic clue + 2-3 example words). Content must be about Strands themes specifically, not Connections categories.

---

**H2: NYT Strands vs Other Daily Word Games** `id="vs-other-games"`

| Requirement | Target |
|-------------|--------|
| Word count | 220–280 |
| H3 count | 3 |

**H3: Strands vs Wordle**
- Wordle: guess one 5-letter word in 6 tries with color feedback
- Strands: find 6-10 themed words in a letter grid with no guess limit
- Wordle is tense (limited tries). Strands is exploratory (unlimited, no penalty).
- Both edited by Tracy Bennett

**H3: Strands vs Connections**
- Connections: sort 16 given words into 4 groups. You see the words, find the groups.
- Strands: find hidden words in a letter grid. You know the theme, find the words.
- Connections has 4 difficulty levels (color-coded). Strands has no difficulty indicator.
- Connections allows 4 mistakes. Strands has no mistake penalty.

**H3: Strands vs Cryptic Crosswords**
- Both reward lateral thinking about clue meanings
- Cryptic clues use wordplay devices (anagrams, containers). Strands clues use puns and misdirection.
- If you enjoy decoding cryptic clue wordplay, Strands' pun-based themes will feel familiar
- Internal link to `/minute-cryptic-today`

**Quality gate:** Each comparison must highlight genuine mechanical differences, not surface-level "one is harder." The Cryptic Crosswords section must include an internal link to the daily cryptic page.

---

**H2: NYT Strands Hints FAQ** `id="faq"`

| Requirement | Target |
|-------------|--------|
| Word count | 350–420 |
| Q&A count | 7 |
| Schema | FAQPage |

Uses `SimpleFaq` component. Each answer: 40–65 words.

1. **What time does NYT Strands reset each day?**
   - Midnight Eastern Time (ET) daily. 9 PM Pacific, 5 AM UTC. The new puzzle is available immediately after reset on the NYT website and Games app.

2. **How many words are in each Strands puzzle?**
   - Typically 6–10 theme words plus one spangram. The exact count varies daily. All 48 letters on the 6x8 grid are used — no letter is wasted.

3. **What is a spangram in NYT Strands?**
   - The spangram is a special word that describes the puzzle's theme and physically spans from one edge of the grid to the opposite edge. It highlights in yellow when found, while regular theme words highlight in blue.

4. **How do hints work in Strands?**
   - Find three non-theme words (each at least 4 letters) to earn one hint. Using a hint highlights the letters of one undiscovered theme word on the grid. You can earn unlimited hints.

5. **Can I play old Strands puzzles?**
   - The official NYT site only offers today's puzzle. You can browse hints and answers for every past Strands puzzle in our Strands Archive. (Internal link to `/strands-hint`)

6. **What does "Perfect" mean in Strands?**
   - A Perfect score means you found all theme words and the spangram without using any hints. It is a soft challenge — there is no penalty for using hints, but skilled players aim for hint-free solves.

7. **Is NYT Strands free to play?**
   - Yes. Strands is completely free and does not require an NYT Games subscription. You can play in any web browser or through the NYT Games app on iOS and Android.

**Quality gate:** Answers must be factually accurate about actual Strands game mechanics. Answer #5 must include an internal link to the archive page.

---

**H2: Recent Strands Puzzles** `id="recent"`

- Grid of 4 most recent puzzle cards (excluding today)
- Uses `StrandsPuzzleCard` component
- "View All Strands Hints and Answers →" link to `/strands-hint`

---

**H2: More Daily Puzzle Hints** `id="related"`

Uses `RelatedLinks` component with 3 links:
- "Today's Connections hints" → `/connections-hint-today`
- "Today's cryptic clue" → `/minute-cryptic-today`
- "Anagram solver" → `/anagram-solver`

---

### Evergreen Word Count Budget

| Section | H3s | Target Words | Min Words | Max Words |
|---------|-----|-------------|-----------|-----------|
| What Is NYT Strands? | 0 | 175 | 150 | 200 |
| How to Play | 5 | 250 | 220 | 280 |
| What Is a Spangram? | 3 | 250 | 220 | 280 |
| Difficulty Levels | 3 | 200 | 180 | 230 |
| 10 Expert Strategies | 10 | 450 | 400 | 500 |
| Common Theme Patterns | 6 | 330 | 300 | 370 |
| Strands vs Other Games | 3 | 250 | 220 | 280 |
| FAQ (7 Q&As) | 7 Q&As | 380 | 350 | 420 |
| Recent + Related | 0 | 50 | 30 | 70 |
| **TOTAL** | **30+ H3s / 7 Q&As** | **~2,335** | **2,070** | **2,630** |

**Hard minimum: 2,100 words. Target: 2,400 words. Hard maximum: 2,700 words.**

---

## Page 2: `/strands-hint/[date]` — Date Archive Page

### Metadata

```
Title: "NYT Strands Hints and Answers — {weekday}, {month} {day}, {year}"
Description: "Hints, spangram, and answers for NYT Strands #{id} on {date}. Progressive clues — reveal as much or as little as you need."
Canonical: /strands-hint/{date}
```

### JSON-LD

- BreadcrumbList: Home > Strands Hints > Strands Archive > {date}

### Page Layout

```
ContentHero
  eyebrow: "Strands"
  title: "NYT Strands Hints and Answers — {dateLabel}"
  description: "Strands #{id}"

StrandsThemeCard
StrandsSpangramReveal
StrandsWordList

Disclaimer text

Previous/Next navigation (← Strands #{prev.id} | Strands #{next.id} →)

Link block:
  - "Today's Strands hints" → /strands-hint-today
  - "All Strands puzzles" → /strands-hint
  - "Today's Connections hints" → /connections-hint-today
  - "Today's cryptic clue" → /minute-cryptic-today
```

### Static Generation

- `generateStaticParams()`: generate params for last 90 days of puzzle dates
- Older dates: on-demand SSR (Next.js ISR / Cloudflare R2 caching)
- Return 404 for dates without puzzles via `notFound()`

---

## Page 3: `/strands-hint` — Archive Listing Page

### Metadata

```
Title: "All NYT Strands Hints, Spangrams and Answers (Updated Daily)"
Description: "Browse hints, spangrams, and answers for every past NYT Strands puzzle. Organized by month with progressive clue reveals."
Canonical: /strands-hint
```

### JSON-LD

- BreadcrumbList: Home > Strands Hints > Archive
- CollectionPage schema

### Page Layout

```
ContentHero
  eyebrow: "Strands"
  title: "All NYT Strands Hints, Spangrams and Answers"
  description: "Every daily Strands puzzle with progressive hints. Updated automatically each day."

Intro paragraph (1-2 sentences)

StrandsMonthGroup × N (newest month first)
  - Each shows 9 cards initially + "Show More"

RelatedLinks:
  - "Today's Strands hints" → /strands-hint-today
  - "Today's Connections hints" → /connections-hint-today
  - "Today's cryptic clue" → /minute-cryptic-today
```

---

## Navigation & Sitemap Updates

### `config/nav.ts`

Add under existing Games dropdown (or create if needed):
- Label: "Strands Hints"
- Path: `/strands-hint-today`
- Description: "Daily NYT Strands hints and answers"

### `i18n/messages/en.json`

Add to footer Games section:
- "Strands Hints" → `/strands-hint-today`
- "Strands Archive" → `/strands-hint`

### `app/sitemap.ts`

| URL | Priority | changeFrequency |
|-----|----------|----------------|
| `/strands-hint-today` | 0.95 | daily |
| `/strands-hint` | 0.8 | daily |
| `/strands-hint/{date}` (all dates) | 0.6 | monthly |

---

## GitHub Actions Automation

### Script: `scripts/fetch-strands.mjs`

**API endpoint:** `https://www.nytimes.com/svc/strands/v2/YYYY-MM-DD.json`

**Logic:**
1. Fetch today's puzzle from NYT API
2. Parse response: extract theme, clue, spangram, theme words, grid
3. Determine spangram direction (horizontal/vertical) from grid data
4. Count spangram letters
5. Generate editorial hint from theme name (template-based)
6. Base64-encode: theme, spangram, themeWords
7. Prepend to `data/strands/puzzles.json`
8. Skip if puzzle for this date already exists (duplicate check)

**Error handling:**
- API 404 → retry 3 times at 30-minute intervals
- Puzzle already exists → skip silently
- API structure change → fail with descriptive error

### Workflow: `.github/workflows/update-strands.yml`

**Option A:** Add Strands fetch step to existing `update-connections.yml`
**Option B:** Create separate workflow with same schedule

**Schedule:** `30 5 * * *` (UTC 05:30, same as Connections)

**Steps:**
1. Checkout repo
2. Run `scripts/fetch-strands.mjs`
3. Check if `data/strands/puzzles.json` changed
4. If changed: git add, commit "data: update strands puzzle for YYYY-MM-DD", push
5. Cloudflare auto-deploys on push to main

---

## Detailed TODO List

### Phase 1: Data Layer

- [ ] Create `types/strands.ts` with all type definitions
  - [ ] `StrandsPuzzle` interface (encoded)
  - [ ] `DecodedStrandsPuzzle` interface (decoded)
  - [ ] `StrandsDataFile` interface
  - [ ] `StrandsMonthData` interface
- [ ] Create `data/strands/puzzles.json` with seed data (7 days minimum)
  - [ ] Manually collect 7 days of puzzle data from NYT
  - [ ] Base64-encode theme, spangram, and themeWords fields
  - [ ] Include spangramDirection and spangramLetterCount for each
  - [ ] Verify clue text matches NYT exactly
- [ ] Create `lib/strands-data.ts` with all data access functions
  - [ ] `getAllStrandsPuzzles()` — filter by status, sort date desc
  - [ ] `getStrandsPuzzleByDate(date)` — single puzzle lookup
  - [ ] `getTodaysStrandsPuzzle()` — most recent published
  - [ ] `getRecentStrandsPuzzles(count)` — for "recent" section, excludes today
  - [ ] `getStrandsPuzzlesByMonth()` — grouped by month with range labels
  - [ ] `getAdjacentStrandsPuzzles(date)` — prev/next for navigation
  - [ ] All functions cached with React `cache()`
  - [ ] Base64 decoding via `Buffer.from(s, 'base64').toString('utf8')`

**Acceptance criteria:**
- All functions return correct data from seed puzzles.json
- Type checking passes with `tsc --noEmit`
- Functions match the same patterns as `lib/connections-data.ts`

---

### Phase 2: Components

- [ ] Create `components/strands/StrandsThemeCard.tsx`
  - [ ] 3-level progressive reveal (Clue visible → Hint → Theme)
  - [ ] Amber/yellow color theme (border-amber-400, bg-amber-50)
  - [ ] Fade-in animation on each reveal (CSS transition, 150ms)
  - [ ] Dark mode compatible colors
  - [ ] Mobile-responsive layout
  - [ ] Client-side base64 decoding for theme name (using `atob()`)

- [ ] Create `components/strands/StrandsSpangramReveal.tsx`
  - [ ] Direction always visible (←→ or ↕ icon + text)
  - [ ] Letter count always visible as pill badge
  - [ ] Level 1: First & last letter reveal (e.g., "F...Y")
  - [ ] Level 2: Full spangram reveal
  - [ ] Amber/gold gradient border card
  - [ ] Star icon in header
  - [ ] Client-side base64 decoding for spangram

- [ ] Create `components/strands/StrandsWordList.tsx`
  - [ ] Spoiler warning banner at top
  - [ ] Per-word reveal buttons (each word independent)
  - [ ] Theme words: blue pill styling on reveal
  - [ ] Spangram row: yellow pill styling, visually distinct
  - [ ] "Reveal All Words" button at bottom
  - [ ] Word count indicator ("7 theme words + 1 spangram")
  - [ ] Client-side base64 decoding

- [ ] Create `components/strands/StrandsPuzzleCard.tsx`
  - [ ] Circular number badge with amber gradient
  - [ ] "Latest" pill badge support
  - [ ] Clue text preview (truncated ~60 chars)
  - [ ] Theme word count dots (no spoiler)
  - [ ] Date + "View Hints →" link
  - [ ] Hover: translateY(-2px) + shadow increase
  - [ ] Links to `/strands-hint/{date}`

- [ ] Create `components/strands/StrandsMonthGroup.tsx`
  - [ ] Month heading with puzzle range
  - [ ] 3-column responsive grid (3/2/1 cols)
  - [ ] Initially shows 9 cards
  - [ ] "Show More" button with remaining count
  - [ ] Smooth height transition on expand

**Acceptance criteria:**
- All components render without errors in dev mode
- Progressive reveals work correctly (clicking advances level, state resets on re-mount)
- Dark mode: all color-coded elements are readable in both themes
- Mobile: all components stack properly at 320px width
- No base64-encoded text visible in server-rendered HTML source

---

### Phase 3: Today Page (`/strands-hint-today`)

- [ ] Create `app/[locale]/strands-hint-today/page.tsx`
- [ ] Implement `generateMetadata()` with Strands-specific title, description, keywords
- [ ] Add JSON-LD schemas:
  - [ ] BreadcrumbList (Home > Strands Hints)
  - [ ] NewsArticle (with datePublished/dateModified from puzzle date)
  - [ ] FAQPage (7 Q&A pairs)
  - [ ] HowTo (5 steps for "How to Play")
- [ ] Build daily section:
  - [ ] ContentHero with date + puzzle number
  - [ ] StrandsThemeCard component
  - [ ] StrandsSpangramReveal component
  - [ ] StrandsWordList component
  - [ ] Disclaimer text
- [ ] Build TableOfContents (8 items)
- [ ] Write evergreen content — each section in its own ContentSection:
  - [ ] "What Is NYT Strands?" (150–200 words)
  - [ ] "How to Play NYT Strands" with 5 H3 steps (220–280 words)
  - [ ] "What Is a Spangram?" with 3 H3s (220–280 words)
  - [ ] "What Makes a Strands Puzzle Hard or Easy?" with 3 H3s (180–230 words)
  - [ ] "10 Expert Strategies" with 10 H3s + 1 CalloutBox (400–500 words)
  - [ ] "Common NYT Strands Theme Patterns" with 6 H3s (300–370 words)
  - [ ] "NYT Strands vs Other Daily Word Games" with 3 H3s (220–280 words)
  - [ ] "NYT Strands Hints FAQ" with 7 Q&As via SimpleFaq (350–420 words)
- [ ] Build "Recent Strands Puzzles" section (4 cards)
- [ ] Build RelatedLinks section (3 links)
- [ ] Add `generateStaticParams()` for locale support

**Acceptance criteria:**
- Page renders with seed data without errors
- Total evergreen word count: 2,100–2,700 words (count with a word counting tool)
- All 30+ H3 headings present and properly nested under H2s
- All internal links are valid and point to existing pages
- JSON-LD validates with Google Rich Results Test (or structured data testing tool)
- No duplicate content from Connections page — every paragraph is Strands-specific
- Page passes Lighthouse accessibility audit (score >= 90)
- Disclaimer text is present

---

### Phase 4: Date Archive Page (`/strands-hint/[date]`)

- [ ] Create `app/[locale]/strands-hint/[date]/page.tsx`
- [ ] Implement `generateMetadata()` with date-specific title/description
- [ ] Add BreadcrumbList JSON-LD
- [ ] Build page layout:
  - [ ] ContentHero with date and puzzle number
  - [ ] StrandsThemeCard (reuse)
  - [ ] StrandsSpangramReveal (reuse)
  - [ ] StrandsWordList (reuse)
  - [ ] Disclaimer text
  - [ ] Previous/Next puzzle navigation
  - [ ] Link block (today page, archive, connections, cryptic)
- [ ] Implement `generateStaticParams()` — last 90 days
- [ ] Handle invalid dates with `notFound()`

**Acceptance criteria:**
- Pages render for all seed data dates
- Previous/Next navigation links are correct (first puzzle has no "previous", latest has no "next")
- 404 returned for dates without puzzles (e.g., `/strands-hint/2020-01-01`)
- No evergreen SEO content on date pages (avoid duplicate content)
- Meta title and description are unique per date

---

### Phase 5: Archive Listing Page (`/strands-hint`)

- [ ] Create `app/[locale]/strands-hint/page.tsx`
- [ ] Implement `generateMetadata()`
- [ ] Add BreadcrumbList + CollectionPage JSON-LD
- [ ] Build page layout:
  - [ ] ContentHero with archive title
  - [ ] Intro paragraph (1-2 sentences)
  - [ ] Monthly groups using StrandsMonthGroup
  - [ ] RelatedLinks at bottom
- [ ] Add `generateStaticParams()`

**Acceptance criteria:**
- Puzzles are grouped by month, newest month first
- Each month group shows correct range label ("Strands #750–#757 (March 2026)")
- "Show More" reveals remaining cards in a month
- Card links navigate to correct date pages
- "Latest" badge appears only on the most recent puzzle

---

### Phase 6: Navigation & Sitemap

- [ ] Update `config/nav.ts` — add Strands entry under Games
- [ ] Update `i18n/messages/en.json` — add Strands to footer
- [ ] Update `app/sitemap.ts`:
  - [ ] Add `/strands-hint-today` (priority 0.95, daily)
  - [ ] Add `/strands-hint` (priority 0.8, daily)
  - [ ] Add all `/strands-hint/[date]` pages (priority 0.6, monthly)
- [ ] Verify navigation renders correctly (desktop dropdown + mobile menu)

**Acceptance criteria:**
- Strands appears in site navigation
- All 3 Strands page types appear in generated sitemap.xml
- Footer links are present and clickable

---

### Phase 7: GitHub Actions Automation

- [ ] Create `scripts/fetch-strands.mjs`
  - [ ] Fetch from `https://www.nytimes.com/svc/strands/v2/YYYY-MM-DD.json`
  - [ ] Parse puzzle data (theme, clue, spangram, words, grid)
  - [ ] Determine spangram direction from grid analysis
  - [ ] Count spangram letters
  - [ ] Generate hint text (template-based from theme name)
  - [ ] Base64-encode theme, spangram, themeWords
  - [ ] Prepend to puzzles.json (maintain newest-first order)
  - [ ] Skip if date already exists (duplicate guard)
  - [ ] Graceful error handling (API 404, structure change)
- [ ] Create or extend workflow `.github/workflows/update-strands.yml`
  - [ ] Cron: `30 5 * * *` (UTC 05:30)
  - [ ] Checkout, run script, check for changes, commit, push
  - [ ] Retry logic: 3 attempts, 30 min apart
  - [ ] Only commit if puzzles.json actually changed

**Acceptance criteria:**
- Script runs locally: `node scripts/fetch-strands.mjs` successfully fetches and saves a puzzle
- Duplicate date handling: running twice for same date does not create duplicate entries
- API error: script exits with clear error message, does not corrupt puzzles.json
- Commit message format: "data: update strands puzzle for YYYY-MM-DD"

---

### Phase 8: Build & QA

- [ ] Project builds successfully: `pnpm build` completes without errors
- [ ] Today page renders correctly with seed data
- [ ] Date archive page renders for each seed date
- [ ] Archive listing page shows monthly groups
- [ ] "Show More" button works on archive page
- [ ] 3-level theme reveal works on desktop and mobile
- [ ] Spangram reveal works through all levels
- [ ] Per-word reveal works (individual + "Reveal All")
- [ ] Previous/Next navigation works on date pages
- [ ] All internal links are valid (no 404s)
- [ ] Sitemap includes all new pages
- [ ] JSON-LD schemas validate (NewsArticle, FAQPage, HowTo, BreadcrumbList, CollectionPage)
- [ ] Meta titles are unique across all pages
- [ ] Meta descriptions are unique across all pages
- [ ] Dark mode: all Strands components render correctly
- [ ] Mobile: all pages render correctly at 320px, 375px, 768px widths
- [ ] No console errors in browser dev tools
- [ ] Lighthouse performance score >= 80
- [ ] Lighthouse accessibility score >= 90
- [ ] GitHub Actions script works locally
- [ ] Seed data contains at least 7 days of puzzles

---

### Phase 9: Launch

- [ ] Seed at least 7 days of puzzle data (preferably 14+)
- [ ] Commit and push all code to main
- [ ] Verify Cloudflare deployment succeeds
- [ ] Enable GitHub Actions workflow
- [ ] Verify first automated update runs successfully (next day after launch)
- [ ] Submit new URLs to Google Search Console:
  - [ ] `/strands-hint-today`
  - [ ] `/strands-hint`
  - [ ] Sample date pages
- [ ] Monitor first 3 days of automated updates

---

## Content Quality Standards

### Absolute Rules

1. **No keyword-swapped content.** Every paragraph must be written specifically for Strands. If a sentence could work for Connections by swapping "spangram" for "purple group," it is too generic and must be rewritten.

2. **Factual accuracy.** All game mechanics described must match the actual NYT Strands game:
   - Grid: 6 columns × 8 rows = 48 letters
   - Spangram: must touch two opposite edges
   - Hints: earned by finding 3 non-theme words (4+ letters each)
   - Perfect: no hints used
   - Reset: midnight ET
   - Editor: Tracy Bennett
   - Launch: March 2024 beta, June 2024 full release

3. **No Connections language leaking into Strands content:**
   - Never mention "four groups" or "16 words" (those are Connections mechanics)
   - Never mention color-coded difficulty (Strands has no difficulty colors)
   - Never mention "mistakes" or "lives" (Strands has no mistake limit)
   - Never mention "shuffle button" (Strands has no shuffle)

4. **Concrete examples required.** Every strategy tip and theme pattern must include at least one specific example (a realistic clue + words) rather than abstract descriptions.

5. **Short paragraphs.** Maximum 3 sentences per paragraph. Each H3 section: 30–60 words. Each FAQ answer: 40–65 words.

6. **Internal links:** Minimum 3 internal links in evergreen content:
   - `/strands-hint` (archive page, from FAQ answer #5)
   - `/minute-cryptic-today` (from "vs Cryptic Crosswords" section)
   - `/connections-hint-today` (from RelatedLinks)

7. **No competitor content copying.** All text must be original. Do not reproduce phrasing from word.tips, TechRadar, Mashable, or any other competitor page.

8. **NYT disclaimer required** on every page: "This site is not affiliated with The New York Times. Strands is a trademark of The New York Times Company."

### Design Standards

1. **Strands color palette:**
   - Primary accent: Amber/Yellow (matching NYT Spangram highlight)
   - Theme words: Blue (matching NYT theme word highlight)
   - Use amber-50/amber-950 for cards (light/dark)
   - Use blue-50/blue-950 for word pills (light/dark)

2. **Component consistency:** Follow the same spacing, typography, and border-radius patterns as existing Connections components.

3. **Responsive breakpoints:** Test at 320px (small mobile), 375px (iPhone), 768px (tablet), 1024px (desktop), 1280px (wide desktop).

4. **Animation:** Keep all animations under 200ms. Prefer fade-in over slide. No animation on page load.
