# 5-Letter Words — Cluster & Page Blueprint

> Backlinko methodology (Workflow 05 cluster-map + Workflow 01 for the hub) · dailycryptic.org · Line A / Wave 1
> Two-tier cluster (hub + spoke word-list pages — no sub-hubs needed for a word-list cluster).
> **Strategic filter from SERP research:** single-letter head terms ("5 letter words starting with A") are saturated by Merriam-Webster / Dictionary.com and NOT cheaply winnable. **We target the middle-position and multi-constraint long-tail**, where every competitor ships thin (<450-word) comma-list pages with no schema. That is the winnable gap.

---

## Why this cluster (the anti-thin-content thesis)

The word-list page is the most thin-content-prone page type on the web. **Every ranking competitor's body prose is under ~450 words**, presented as a plain comma list. Google tolerates them only because search demand is enormous. Our edge is to make each page genuinely *useful and deep* without keyword stuffing (respecting the site's 1–3% density rule):

The word count and quality come from **four real-value layers**, not padded prose:
1. **A sortable table** — Word · Scrabble points · Words-With-Friends points · one-line definition. (Beats every plain-list competitor.)
2. **"Common words first" split** — the ~10–20 words a Wordle player actually wants, above the exhaustive list.
3. **Constraint-specific Wordle strategy** — written fresh per template (e.g. for "I in the middle": which consonants to pair with a green 3rd-position I). This is the "helpful content" signal.
4. **Per-word mini-glossary** for the obscure words — the biggest legitimate word-count add and the strongest anti-thin-content move.

---

## URL architecture (2-tier + reusable A–Z index)

```
/5-letter-words                                   [HUB]  — full index, A–Z grids, strategy, FAQ
├── /5-letter-words/starting-with/[a-z]           26 spokes  (table-stakes; ship but expect hard SERP)
├── /5-letter-words/ending-in/[a-z]               26 spokes  (smaller sets → easier to feel "complete")
├── /5-letter-words/with/[a-z]                     26 spokes  (contains letter, any position)
├── /5-letter-words/[a-z]-in-position/[1-5]        130 spokes ← PRIORITY (position = green-tile intent, incl. "in the middle" = position 3)
└── (Wave 2) multi-constraint combos              e.g. /5-letter-words/starting-with/c/ending-in/e  ← lowest competition, index-gated
```
- **First build ≈ 208 static pages** (26+26+26 + 130). All prerendered from `public/data/wordlist.txt` (80,272 words) filtered to length 5. **No new data source, no daily fetch.**
- **URL hygiene:** flat, lowercase, hyphens, no year, ≤3 levels. Keep spoke slugs keyword-first.
- **Priority order:** `[letter]-in-position/*` (esp. position 3 "in the middle") > `ending-in/*` > `with/*` > `starting-with/*`. Multi-constraint combos are Wave 2 and must be index-whitelisted to protect crawl budget (critical on Cloudflare/OpenNext — we already cap static params).

---

## Priority table (which spokes first)

| Sub-template | Example | Volume | Competition | Priority | Why |
|---|---|---|---|---|---|
| Letter in position | `5 letter words with I in the middle` | High | **Medium** | **P0** | Green-tile-native; competitors thin; best win/effort |
| Ends in 1–2 letters | `5 letter words ending in ND` | High | High | P0 | Small result sets → page feels complete + snippet-friendly |
| Contains letter | `5 letter words with A and E` | High | Medium | P1 | Strong Wordle intent |
| Starts with letter | `5 letter words starting with A` | Very high | Very high | P1 | Table-stakes; ship for completeness, don't expect fast wins |
| Multi-constraint combo | `…starting with C ending in E` | Low each / huge aggregate | **Low** | P2 (Wave 2) | Programmatic long-tail sweet spot; index-gated |

---

# HUB PAGE BLUEPRINT · `/5-letter-words`

**Keyword/intent:** `5 letter words` / `five letter words` — navigational + Wordle-utility. Acts as the cluster's linking spine.

**Meta title (≤60):** `5-Letter Words — Full List & Wordle Finder by Letter` (52)
**Meta description (≤155):** `Every 5-letter word, sorted and filterable. Browse by starting letter, ending letter, or letter position to crack today's Wordle. Free, no signup.` (149)
**H1:** `5-Letter Words: The Complete List & Wordle Finder`

Structure:
```
[Breadcrumb: Home › Words › 5-Letter Words]
H1 + subhead (one sentence: what's here + Wordle framing)
[Mini inline filter widget: type known letters → jump to results] (reuses solver logic, optional v1)

## How Many 5-Letter Words Are There?           (~200w; snippet bait)
   - Lead sentence: "There are 12,966 five-letter words valid in Wordle, and 2,309 that can be the answer." (cite)
   - Scrabble/dictionary counts contrast. Bold the numbers.

## Browse 5-Letter Words by Starting Letter      (A–Z grid → /starting-with/[a-z])
## Browse by Ending Letter                        (A–Z grid → /ending-in/[a-z])
## Browse by Letter Position                      (5×A–Z matrix → /[a-z]-in-position/[n])
   - Callout: "Playing Wordle? If your green tile is in the middle, use the position pages."

## Best 5-Letter Words to Start Wordle            (~250w + table; reuse solver's starter data)
## Most Common Letters in 5-Letter Words          (~200w + frequency table)
## FAQ                                            (5 Q, FAQPage schema)
## Related: Wordle Solver · Today's Wordle Answer · Wordle Unlimited · Quordle
[Breadcrumb, footer]
```
Target hub length: **~1,200–1,500 words** + the A–Z index components (the real linking value).

Schema: `CollectionPage` + `BreadcrumbList` + `FAQPage`.

---

# SPOKE TEMPLATE · e.g. `/5-letter-words/[letter]-in-position/3` ("I in the middle")

> This single template renders all 208 spokes. Every string below is generated from the constraint (letter, mode, position) + the word data. Target **700–1,000 words of genuine value per page** (vs competitors' ~150–450), carried by the table + glosses + strategy, NOT by repeating the keyword.

### Per-page meta (generated)
- **Title (≤60):** `5-Letter Words with {L} in the Middle — Wordle Help` (~50)
- **Description (≤155):** `All {N} five-letter words with {L} as the {ordinal} letter, sorted with Scrabble scores and definitions. Perfect for a green {L} tile in Wordle.`
- **H1:** `5-Letter Words with {L} in the Middle` (or "starting with {L}" / "ending in {L}")

### Section stack (fixed order)

1. **Direct answer + count (snippet bait, ~40w)**
   > "There are **{N}** five-letter words with **{L}** in the middle. The most common are {top 8 common words}."
   One sentence, immediately snippet-able. Followed by a short `<ul>` of the 8–15 most common words.

2. **Sortable results table (the core asset)**
   Columns: **Word · Scrabble pts · WWF pts · Short definition**. Default sort: **common words first** (frequency), resortable A–Z / by score. Split into **"Common words" (default view) vs "All valid words" (expandable)** — capitalizemytitle's proven UX signal.
   - Scrabble/WWF points computed from a static letter-value map (public).
   - Definitions: a one-line gloss per word (from a bundled dictionary gloss file — needed for the glossary layer).

3. **How to use these for Wordle (constraint-specific, ~180w — fresh per template)**
   - For a position page: "If Wordle marked **{L}** green as the {ordinal} letter, keep it fixed and probe the high-frequency letters you haven't tried — {R, S, T, N} for consonants, {A, O} for vowels. From this list, {2–3 named words} test the most new letters."
   - This paragraph differs for starting-with / ending-in / contains / each position → no duplication across templates.

4. **Highest-scoring word (Scrabble intent, ~40w)**
   > "The highest-scoring 5-letter word with {L} in the middle is **{WORD}** ({pts} points)." (snippet + serves Scrabble users)

5. **Mini-glossary: tricky words explained (~200–300w — the biggest legit word-count add)**
   - 4–8 of the obscure words on the list, each with a 1–2 sentence definition/example. Real content depth that defeats thin-content classification. Content varies entirely by word set → unique per page.

6. **Localized FAQ (3–4 Q, FAQPage schema)**
   - "How many 5-letter words have {L} in the middle?" → "{N}."
   - "What is the highest-scoring one in Scrabble?" → "{WORD}, {pts} pts."
   - "What's a good Wordle guess with {L} in the {ordinal} spot?" → {named words}.
   - "Are these valid in Scrabble and Words With Friends?" → yes/notes.

7. **Cross-links (A–Z index component + contextual)**
   - "Change the letter": A–Z row for the same mode.
   - "Change the constraint": links to `starting-with/{L}`, `ending-in/{L}`, `with/{L}`, other positions of {L}.
   - "Change length": 4/6/7-letter siblings (Wave 2).
   - **Up-links (funnel to monetized pages):** Wordle Solver, Today's Wordle Answer, 5-Letter Words hub.

8. **Breadcrumb:** Home › Words › 5-Letter Words › {mode/letter}

### Per-spoke schema
- `ItemList` (word list; glossed words as `DefinedTerm`)
- `FAQPage` (localized FAQ)
- `BreadcrumbList`

---

## Internal linking matrix (cluster)

| From | To | Anchor | Where |
|---|---|---|---|
| `/5-letter-words` (hub) | each spoke | "5-letter words {constraint}" | A–Z / position grids |
| spoke | hub | "all 5-letter words" | breadcrumb + intro |
| spoke | sibling spokes | "words ending in {L}", "{L} as 2nd letter" | cross-links block |
| spoke | `/wordle-solver` | "filter these with the Wordle solver" | H2 3 |
| spoke | `/wordle-answer-today` | "today's Wordle answer" | FAQ / strategy |
| `/wordle-answer-today` (existing) | relevant spoke | "5-letter words starting with {today's first letter}" | daily-answer page module (bidirectional funnel) |
| `/wordle-solver` | hub + top spokes | "browse 5-letter word lists" | H2 5 + Related |

> **Bidirectional funnel (the site's structural edge):** existing daily Wordle pages embed "5-letter words starting with {today's answer's first letter}"; word-list pages link back to today's answer + the solver. This pushes the daily pages' existing authority into the new programmatic cluster and vice-versa.

---

## Data & build notes (for the eng plan later — not code)

- **Source:** `public/data/wordlist.txt` (80,272 words) filtered to `length === 5`. No new corpus for the lists themselves.
- **New data needed for the quality layers:**
  - Scrabble/WWF letter-value maps (tiny static constants — public).
  - A **word→short-gloss** file for the definition column + glossary (bundle a compact 5-letter gloss set; can start with the "common" subset and expand). This is the one genuine data dependency; it is what lets us beat thin competitors.
  - A **frequency/commonness ranking** for the "common words first" sort (derive from a public frequency list, e.g. word frequency corpus, restricted to our 5-letter set).
- **Build/crawl-budget guardrails (Cloudflare/OpenNext):** prerender the 208 P0/P1 spokes fully. Gate Wave-2 combos behind an index whitelist + dedicated `sitemap-wordlists.xml`. Keep the gloss file lean to control bundle size.

---

## GEO checklist (applies to hub + every spoke)
- [x] Cited count stat in the first sentence (snippet bait)
- [x] Self-contained one-sentence answer at top (LLM-quotable)
- [x] Localized FAQ in direct Q→A + FAQPage schema
- [x] Data table (scores) + glossary (definitions) = real depth, not padded prose
- [x] Bold key facts; common-words list before exhaustive table
- [x] ItemList + FAQPage + BreadcrumbList schema (competitors have none)
- [x] Server-rendered / static (crawler + LLM visible)
- [x] Keyword density kept natural (1–3%); value carried by table/gloss/strategy
