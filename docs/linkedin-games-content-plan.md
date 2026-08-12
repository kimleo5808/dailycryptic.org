# LinkedIn Games Cluster — Content Plan (Backlinko method)

Status: approved plan · Owner: content · Created 2026-08-12
Companion doc: [linkedin-games-ui-plan.md](linkedin-games-ui-plan.md)

## Cluster architecture

Site convention is flat feature routes under `app/[locale]/`, so we use a 2-tier
hub-and-spoke (skill rule: <10 articles → skip sub-hubs). No dates in slugs;
each game gets one evergreen updating URL plus a date archive — the exact
pattern that wins these SERPs (word.tips, Try Hard Guides, puzznest all use it).

```
/linkedin-games-answers                     [Hub — all games, today]
├── /linkedin-queens-answer                 [Spoke — today, evergreen]
│   └── /linkedin-queens-answer/[date]      [Archive]
├── /linkedin-zip-answer        (+ [date])
├── /linkedin-tango-answer      (+ [date])
├── /linkedin-pinpoint-answer   (+ [date])
└── /linkedin-crossclimb-answer (+ [date])
```

Phase 2 spokes (not in this build): how-to-play guides per game, Wend/Patches/
Mini Sudoku pages when data supply is proven.

## Shared page rules (every spoke)

- **Word count:** ≥1,500 words of unique evergreen copy per spoke (game rules,
  solving method, hint philosophy, FAQ) + the daily answer block. The evergreen
  copy is written once per page, not per day; only the answer data rotates.
- **Keyword density:** core phrase + close variants at 1–3% of body text.
  For a 1,500-word page that means roughly 20–35 total occurrences of the core
  phrase family (e.g. "Queens answer / LinkedIn Queens answer today / today's
  Queens solution"). Vary phrasing; never repeat one exact string >15 times.
- **Answer-first layout:** today's answer/hints render above the fold, before
  the evergreen copy (matches our NYT pages and every winning competitor).
- **Progressive disclosure:** hints before spoilers (tap-to-reveal), mirroring
  our Connections/Strands pages — it earns dwell time and reduces pogo-sticking.
- **Freshness signals:** dateModified in Article schema, "Updated <date>" label,
  daily data rotation.
- **GEO blocks:** every page carries (a) a 40–60 word direct answer paragraph
  right under the H1 ("Today's LinkedIn Queens answer for August 12, 2026 …"),
  (b) an FAQ section with FAQPage schema, (c) one quotable stat line.
- **Schema:** Article + FAQPage + BreadcrumbList (use existing `lib/jsonld.tsx`
  helpers). Hub also gets ItemList.
- **E-E-A-T:** byline "DailyCryptic Puzzle Team", methodology note ("we solve
  each puzzle by hand every morning"), link to /about.

## Page briefs

### 1. Hub — /linkedin-games-answers

- **Core keyword:** "linkedin games answers today" · secondary: "all linkedin
  games answers", "linkedin puzzle answers"
- **Intent:** navigational-informational, daily repeat visits
- **Meta title:** `LinkedIn Games Answers Today — Queens, Zip, Tango & More`
- **Meta description:** `Today's answers for every LinkedIn game: Queens, Zip, Tango, Pinpoint and Crossclimb. Hints first, spoilers on tap — updated every morning.`
- **H1:** `LinkedIn Games Answers Today`
- **Structure:** direct-answer intro (date-stamped) → 5 game cards, each with
  today's status + "Get hints →" link (hub links DOWN to every spoke) → "About
  LinkedIn's game lineup" (~400 words) → how our hints work (~300 words) →
  FAQ (5 Q&A, ~400 words) → related: minute-cryptic, connections-hint.
- **Word budget:** ~1,500 (cards excluded).

### 2. Spoke — /linkedin-queens-answer  (P0, build first)

- **Core keyword:** "linkedin queens answer today" · variants: "queens hint
  today", "queens game solution", "linkedin queens puzzle answer"
- **Meta title:** `LinkedIn Queens Answer Today — Daily Hints & Solution`
- **Meta description:** `Stuck on today's LinkedIn Queens? Get gentle hints first, then the full crown placement solution. Updated daily with an archive of past puzzles.`
- **H1:** `LinkedIn Queens Answer Today`
- **H2 outline:**
  1. Today's Queens hints (3-level progressive reveal)
  2. Today's Queens solution (color-grid board render)
  3. How Queens works (rules, ~250 words)
  4. A repeatable method to solve Queens (~400 words: singles → color
     elimination → adjacency pruning)
  5. Common Queens mistakes (~250 words)
  6. Queens answer archive (recent dates list)
  7. FAQ (~350 words: what time does it reset, is there only one solution,
     streak rules, difficulty)
- **Unique asset (Skyscraper 2.0):** interactive color-grid solution board
  (competitors post screenshots; we render a clean, theme-aware board).

### 3. Spoke — /linkedin-zip-answer  (P0)

- **Core keyword:** "linkedin zip answer today" · variants: "zip solution
  today", "linkedin zip hint"
- **Meta title:** `LinkedIn Zip Answer Today — Path Solution & Hints`
- **Meta description:** `Today's LinkedIn Zip answer with the complete numbered path, gentle hints first, and a daily archive. Updated every morning.`
- **H1:** `LinkedIn Zip Answer Today`
- **H2s:** hints → numbered-path solution (grid render) → rules → solving
  method (endpoints first, wall logic, fill constraint) → mistakes → archive → FAQ.
- **Unique asset:** step-numbered path grid.

### 4. Spoke — /linkedin-tango-answer  (P0)

- **Core keyword:** "linkedin tango answer today" · variants: "tango solution",
  "linkedin tango hints"
- **Meta title:** `LinkedIn Tango Answer Today — Grid Solution & Hints`
- **Meta description:** `Solve today's LinkedIn Tango with progressive hints and the full sun/moon grid solution. New answer every day, past puzzles archived.`
- **H1:** `LinkedIn Tango Answer Today`
- **H2s:** hints → solution grid (sun/moon) → rules (no-three-in-a-row, equal
  counts, = and × signs) → method → mistakes → archive → FAQ.

### 5. Spoke — /linkedin-pinpoint-answer  (P1, same template)

- **Core keyword:** "linkedin pinpoint answer today" · variants: "pinpoint
  category today", "pinpoint hint"
- **Meta title:** `LinkedIn Pinpoint Answer Today — Category & Clue Hints`
- **Meta description:** `Today's Pinpoint category revealed gently: clue-by-clue hints first, then the answer. Updated daily with full archive.`
- **H1:** `LinkedIn Pinpoint Answer Today`
- **H2s:** hints (per-clue progressive) → category answer → rules → how to
  guess earlier (~350 words) → archive → FAQ.

### 6. Spoke — /linkedin-crossclimb-answer  (P1)

- **Core keyword:** "linkedin crossclimb answer today" · variants: "crossclimb
  clues today", "crossclimb ladder answer"
- **Meta title:** `LinkedIn Crossclimb Answer Today — All Clues & Ladder`
- **Meta description:** `Every Crossclimb clue answered plus the final ladder order for today's LinkedIn puzzle. Hints before spoilers, archive included.`
- **H1:** `LinkedIn Crossclimb Answer Today`
- **H2s:** clue-by-clue hints → ladder solution (ordered word list) → rules →
  ladder-ordering method → archive → FAQ.

## Internal linking matrix

| From | To | Anchor |
|---|---|---|
| Hub | each spoke | "Today's Queens answer" (varied per game) |
| Each spoke | hub | breadcrumb + "all LinkedIn games answers" (intro) |
| Each spoke | 2 sibling spokes | "LinkedIn Zip answer" / "Tango solution" (footer Related) |
| Each spoke | /minute-cryptic-today | "daily cryptic clue" (Related strip) |
| Hub | /connections-hint-today | "NYT Connections hints" (Related strip) |
| config/nav.ts | hub + 5 spokes | new "LinkedIn Games" dropdown group |

## Measurement

Success = impressions for "linkedin queens answer" family in GSC within 2
weeks; page-1 within 6–8 weeks. If Queens/Zip/Tango prove out, ship Wend +
Patches pages immediately (first-mover window).
