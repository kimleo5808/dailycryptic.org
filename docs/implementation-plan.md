# Implementation Plan

## Purpose

This document turns the approved SEO content roadmap into a practical build plan for the codebase.

Use this file when:

- deciding route and component structure
- sequencing implementation work
- checking whether existing pages need updates
- reviewing technical dependencies for the content rollout

## Core Deliverables

The implementation phase must produce:

- 10 new indexable pages
- updated internal links from existing high-value pages
- clue-type and difficulty linking from puzzle detail pages
- sitemap coverage for all new pages
- metadata coverage for all new pages

## Route Plan

The following routes must be implemented:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- `/cryptic-clue-types/anagram`
- `/cryptic-clue-types/charade`
- `/cryptic-clue-types/container`
- `/cryptic-clue-types/double-definition`
- `/cryptic-indicators`
- `/minute-cryptic/easy`
- `/minute-cryptic/medium`
- `/minute-cryptic/hard`

For localized routing, these will appear under the existing locale-aware app structure.

## Recommended Technical Approach

### Content Storage

Decide one of the following before implementation starts:

1. Inline TSX page copy
2. Structured content objects in data/config files
3. MDX-driven long-form pages

Recommended approach for this codebase:

- Use TSX pages for initial rollout
- Move repeated structures into small reusable content components
- If content volume grows, consider extracting long-form page sections into structured data files later

### Reusable Components To Consider

- Long-form page wrapper
- FAQ block
- Related links block
- Example clue block
- Difficulty archive intro block
- Topic hero/header block

## Data Dependencies

Required existing data sources:

- `data/minute-cryptic/puzzles.json`
- `lib/minute-cryptic-data.ts`

Required derived logic:

- filter puzzles by `difficulty`
- filter puzzle examples by `clueType`
- map clue type to topic route
- map difficulty to difficulty archive route

## Existing Files Likely To Change

### New page files

Expected additions under `app/[locale]/...`

- `cryptic-crossword-for-beginners/page.tsx`
- `cryptic-clue-types/page.tsx`
- `cryptic-clue-types/anagram/page.tsx`
- `cryptic-clue-types/charade/page.tsx`
- `cryptic-clue-types/container/page.tsx`
- `cryptic-clue-types/double-definition/page.tsx`
- `cryptic-indicators/page.tsx`
- `minute-cryptic/easy/page.tsx`
- `minute-cryptic/medium/page.tsx`
- `minute-cryptic/hard/page.tsx`

### Existing files likely to be updated

- `app/[locale]/page.tsx` or home components
- `components/home/index.tsx`
- `app/[locale]/how-to-play-minute-cryptic/page.tsx`
- `app/[locale]/minute-cryptic/page.tsx`
- `app/[locale]/minute-cryptic-today/page.tsx`
- `app/[locale]/daily-cryptic/page.tsx`
- `app/[locale]/minute-cryptic-faq/page.tsx`
- `app/[locale]/minute-cryptic/[date]/page.tsx`
- `app/sitemap.ts`
- possibly `lib/minute-cryptic-data.ts`
- possibly `lib/jsonld.tsx`

## Page Build Rules

Every new page implementation must include:

- page component
- metadata via existing metadata helpers
- breadcrumb schema where appropriate
- FAQ schema where appropriate
- internal links to related cluster pages
- mobile-safe layout
- typography readable for long-form content

## Puzzle Detail Page Update Rules

Every puzzle detail page should expose:

- related clue type link
- related difficulty link
- related practice CTA

Suggested UI location:

- below explanation section
- inside "keep solving" style section
- inside related practice area

## Difficulty Archive Rules

The pages below must be generated from live puzzle data:

- `/minute-cryptic/easy`
- `/minute-cryptic/medium`
- `/minute-cryptic/hard`

Implementation requirements:

- filter using `difficulty`
- sort newest first
- link every item to its detail page
- include an explanatory intro above the list
- include learning links around the list

## Metadata Rules

Each new page needs:

- unique title
- unique description
- canonical path
- useful keyword set
- open graph consistency

Use the existing metadata helper pattern where possible.

## Sitemap Rules

All 10 new pages must be added to sitemap generation.

Future monthly archive pages are not in current scope and should not be added yet.

## Ad Placement Implementation Rules

Pages should support ad placement, but ad components should be inserted only in safe content zones.

Good insertion targets:

- after intro block
- after major educational section
- before FAQ
- above long archive list

Avoid:

- puzzle gameplay components
- keyboard areas
- clue submission controls

## Detailed Technical TODO

### Step 1: Preparation

- [ ] Confirm route naming and final page URLs
- [ ] Confirm content source strategy
- [ ] Confirm component reuse strategy
- [ ] Confirm whether FAQ blocks will be page-specific or reusable

### Step 2: Data Helpers

- [ ] Add or extend clue-type route mapping helper
- [ ] Add or extend difficulty route mapping helper
- [ ] Add helper for selecting example puzzles by clue type
- [ ] Add helper for filtering puzzles by difficulty
- [ ] Add helper for getting recent puzzles by difficulty if useful

### Step 3: Shared Components

- [ ] Implement long-form content wrapper if needed
- [ ] Implement FAQ section helper/component if needed
- [ ] Implement clue example section helper/component if needed
- [ ] Implement related links block if needed
- [ ] Implement archive list section if needed

### Step 4: New Page Creation

- [ ] Implement beginner page
- [ ] Implement clue-type hub page
- [ ] Implement anagram page
- [ ] Implement charade page
- [ ] Implement container page
- [ ] Implement double-definition page
- [ ] Implement indicators page
- [ ] Implement easy difficulty page
- [ ] Implement medium difficulty page
- [ ] Implement hard difficulty page

### Step 5: Metadata And Schema

- [ ] Add metadata for all 10 new pages
- [ ] Add breadcrumb schema to all suitable pages
- [ ] Add FAQ schema to pages with FAQ sections
- [ ] Ensure canonical paths are correct

### Step 6: Existing Page Updates

- [ ] Add beginner guide links to homepage UI
- [ ] Add clue types links to homepage UI
- [ ] Add learning cluster links to how-to page
- [ ] Add learning cluster links to today page
- [ ] Add difficulty links to archive page
- [ ] Add learning links to daily-cryptic page
- [ ] Add beginner and easy links to FAQ page
- [ ] Add type and difficulty links to puzzle detail page

### Step 7: Discoverability

- [ ] Add new routes to sitemap
- [ ] Check crawl path from homepage to all new pages
- [ ] Check crawl path from archive and puzzle pages to hub pages

### Step 8: QA

- [ ] Run build
- [ ] Review all pages for layout issues
- [ ] Review all pages for mobile spacing and readability
- [ ] Check all links
- [ ] Check metadata output
- [ ] Check sitemap output
- [ ] Check that difficulty pages only show matching puzzles
- [ ] Check that clue-type examples match page topic

## Suggested Delivery Order

Recommended engineering sequence:

1. Build helper logic for clue-type and difficulty mapping
2. Build reusable content/FAQ/example sections
3. Ship beginner page
4. Ship clue-type hub
5. Ship 4 clue-type pages
6. Ship indicators page
7. Ship 3 difficulty archive pages
8. Update existing high-traffic pages
9. Update sitemap
10. Run QA pass
