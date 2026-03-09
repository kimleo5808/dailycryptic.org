# AGENTS.md

## Project Goal

This project is expanding from a daily puzzle site into a larger SEO-driven content and practice hub for cryptic clue learners.

The business model is:

- Free access only
- No membership system
- No login or registration
- Monetization through Google AdSense

The product goal is not to build a subscription puzzle platform. The goal is to increase qualified organic traffic, improve page depth, and grow ad inventory without damaging the core puzzle-solving experience.

## Core Strategy

The site should operate as three connected layers:

1. Daily puzzle layer
   - Today page
   - Single puzzle pages
   - Main archive

2. Learning layer
   - Beginner guides
   - Clue type pages
   - Indicator/reference pages

3. Practice layer
   - Difficulty archive pages
   - Type-driven practice routes
   - Archive browsing and internal navigation

Every new page must help with at least one of these goals:

- Capture search demand
- Improve internal linking depth
- Increase pages per session
- Create safe long-form surfaces for AdSense

## Business Constraints

The following constraints are mandatory:

- Do not introduce login, account, profile, leaderboard, or membership features
- Do not design any paywall, premium tier, or subscription UX
- Do not place ads in a way that interrupts clue entry, hint reveal, or answer checking
- Do not create thin SEO pages with low informational value
- Do not create pages that simply restate existing content with minor keyword variation

## Audience

Primary audiences:

- Beginners searching for help with cryptic clues
- Casual solvers looking for free daily practice
- Intermediate solvers looking for clue-type explanations
- Search users looking for answers, hints, archive pages, and learning resources

Secondary audiences:

- Users comparing clue types
- Users looking for easy, medium, or hard clue sets
- Users wanting repeated practice without full crossword commitment

## Success Criteria

This content expansion is successful if it leads to:

- More indexable pages with distinct search intent
- Stronger internal linking between learning pages and puzzle pages
- Longer time on site for informational pages
- Higher page-per-session from archive and learning journeys
- More AdSense-safe content surfaces

## Non-Goals

The following are explicitly out of scope for this plan:

- Membership
- Authentication
- User accounts
- Saved cloud progress
- Community features
- Forums
- Social feeds
- Paid products
- Complex puzzle creation tools

## Content Architecture

The site should be structured into the following clusters.

### 1. Beginner Cluster

Hub page:

- `/cryptic-crossword-for-beginners`

Supporting pages:

- `/cryptic-clue-types`
- `/minute-cryptic/easy`
- `/how-to-play-minute-cryptic`
- `/minute-cryptic-faq`

### 2. Clue Type Cluster

Hub page:

- `/cryptic-clue-types`

Supporting pages:

- `/cryptic-clue-types/anagram`
- `/cryptic-clue-types/charade`
- `/cryptic-clue-types/container`
- `/cryptic-clue-types/double-definition`
- `/cryptic-indicators`

### 3. Practice Cluster

Hub pages:

- `/minute-cryptic`
- `/minute-cryptic-today`

Supporting pages:

- `/minute-cryptic/easy`
- `/minute-cryptic/medium`
- `/minute-cryptic/hard`
- `/minute-cryptic/[date]`

## Approved New Pages

These are the first 10 new pages approved for this roadmap.

1. `/cryptic-crossword-for-beginners`
2. `/cryptic-clue-types`
3. `/cryptic-clue-types/anagram`
4. `/cryptic-clue-types/charade`
5. `/cryptic-clue-types/container`
6. `/cryptic-clue-types/double-definition`
7. `/cryptic-indicators`
8. `/minute-cryptic/easy`
9. `/minute-cryptic/medium`
10. `/minute-cryptic/hard`

## Page Requirements

### Global Requirements For All New Pages

Each new page must:

- Have a clear and distinct search intent
- Target at least one primary keyword and 2 to 4 supporting variations
- Contain at least 1000 words
- Prefer 1200 to 2200 words for most pages
- Include 5 to 8 H2 sections
- Include 8 to 16 H3 sections where appropriate
- Include at least one FAQ block
- Include at least 3 internal links
- Include at least 1 route toward a playable puzzle page
- Include at least 1 route toward a learning page
- Include at least 1 route toward an archive or difficulty page
- Use real puzzle examples from the site whenever possible

### Writing Standards

Each page should:

- Answer the search query within the first 2 paragraphs
- Use short, readable paragraphs
- Explain one main theme clearly instead of covering too many adjacent topics
- Include examples, not just definitions
- Include common mistakes and correction advice
- End with a next-step practice route

Avoid:

- Thin pages
- Keyword stuffing
- Repetitive intro copy
- Pages that exist only to host ads
- Duplicate content between guide pages and archive pages

## Keyword Mapping

### `/cryptic-crossword-for-beginners`

Primary keyword:

- cryptic crossword for beginners

Secondary keywords:

- beginner cryptic clues
- how to start cryptic crosswords
- easy cryptic crossword for beginners

### `/cryptic-clue-types`

Primary keyword:

- cryptic clue types

Secondary keywords:

- types of cryptic clues
- common cryptic clue patterns
- cryptic clue mechanisms

### `/cryptic-clue-types/anagram`

Primary keyword:

- anagram clues

Secondary keywords:

- anagram cryptic clues
- anagram clue indicators
- how to solve anagram clues

### `/cryptic-clue-types/charade`

Primary keyword:

- charade clues

Secondary keywords:

- charade cryptic clues
- charade clue examples
- how to solve charade clues

### `/cryptic-clue-types/container`

Primary keyword:

- container clues

Secondary keywords:

- container cryptic clues
- insertion clues
- container clue indicators

### `/cryptic-clue-types/double-definition`

Primary keyword:

- double definition clues

Secondary keywords:

- double definition cryptic clues
- double definition examples

### `/cryptic-indicators`

Primary keyword:

- cryptic indicators

Secondary keywords:

- cryptic clue indicators
- anagram indicators
- container indicators

### `/minute-cryptic/easy`

Primary keyword:

- easy minute cryptic clues

Secondary keywords:

- easy cryptic clues
- beginner cryptic practice
- easy minute cryptic archive

### `/minute-cryptic/medium`

Primary keyword:

- medium minute cryptic clues

Secondary keywords:

- medium cryptic clues
- intermediate cryptic practice

### `/minute-cryptic/hard`

Primary keyword:

- hard minute cryptic clues

Secondary keywords:

- hard cryptic clues
- advanced cryptic practice

## Internal Linking Rules

Internal linking is a required part of implementation.

### Required Linking Patterns

- Homepage must link to beginner and clue-type hubs
- `/how-to-play-minute-cryptic` must link to beginner, clue types, and indicators pages
- `/minute-cryptic` archive must link to easy, medium, and hard pages
- `/minute-cryptic-today` should link to beginner and clue-type learning pages
- Every single puzzle page should link to its clue type page
- Every single puzzle page should link to its difficulty page

### Single Puzzle Linking Rule

For `/minute-cryptic/[date]` pages:

- anagram -> `/cryptic-clue-types/anagram`
- charade -> `/cryptic-clue-types/charade`
- container -> `/cryptic-clue-types/container`
- double-definition -> `/cryptic-clue-types/double-definition`

And:

- easy -> `/minute-cryptic/easy`
- medium -> `/minute-cryptic/medium`
- hard -> `/minute-cryptic/hard`

### Preferred Anchor Text

Use descriptive anchors such as:

- cryptic crossword for beginners
- cryptic clue types
- anagram clues
- charade clues
- container clues
- double definition clues
- cryptic indicators
- easy cryptic clues
- medium cryptic clues
- hard cryptic clues

Avoid weak anchor text such as:

- click here
- read more
- learn more
- this page

## AdSense Rules

Ad placement must support content monetization without damaging gameplay UX.

### Good Ad Placements

- After the opening explanatory section on long-form guide pages
- Mid-article between major H2 sections
- Before FAQ on long-form pages
- Above archive lists on difficulty pages
- Mid-list inside long archive pages

### Bad Ad Placements

- Next to the active answer input area
- Above the virtual keyboard
- Next to hint and check buttons
- In the first screen if it pushes the clue module down
- Between the user and the core puzzle interaction flow

## Existing Pages That Must Be Updated

The following existing pages should be updated as part of this initiative:

- homepage
- `/how-to-play-minute-cryptic`
- `/minute-cryptic`
- `/minute-cryptic-today`
- `/daily-cryptic`
- `/minute-cryptic-faq`
- `/minute-cryptic/[date]`

## Content Production Order

Recommended publishing order:

1. `/cryptic-crossword-for-beginners`
2. `/cryptic-clue-types`
3. `/cryptic-clue-types/anagram`
4. `/cryptic-clue-types/charade`
5. `/cryptic-clue-types/container`
6. `/cryptic-clue-types/double-definition`
7. `/cryptic-indicators`
8. `/minute-cryptic/easy`
9. `/minute-cryptic/medium`
10. `/minute-cryptic/hard`

## Detailed TODO List

### Phase 1: Foundation

- [x] Create route structure for the 10 approved pages
- [x] Confirm naming conventions for all new routes
- [x] Decide whether page content will live inline, in MDX, or in structured data files
- [x] Define reusable content page layout pattern for long-form SEO pages
- [x] Define reusable FAQ component pattern if needed
- [x] Define reusable section component patterns for clue examples and related links
- [x] Define internal link component or helper pattern if needed
- [x] Add planning note for future monthly archive pages, but do not implement yet

### Phase 2: Data And Taxonomy

- [x] Audit all puzzles in `data/minute-cryptic/puzzles.json`
- [x] Confirm every puzzle has a valid `clueType`
- [x] Confirm every puzzle has a valid `difficulty`
- [x] Check whether additional clue types are present or planned beyond the current 4
- [x] Prepare mapping logic from puzzle `clueType` to clue-type topic pages
- [x] Prepare mapping logic from puzzle `difficulty` to difficulty archive pages
- [x] Identify 2 to 4 strong example puzzles for each clue-type page
- [x] Identify enough puzzles for easy, medium, and hard listing pages

### Phase 3: Content Architecture

- [x] Finalize title, H1, meta description, and keyword targets for all 10 pages
- [x] Finalize H2 and H3 outline for all 10 pages
- [x] Finalize FAQ questions for all 10 pages
- [x] Finalize related-links section for all 10 pages
- [x] Finalize next-step practice CTA for all 10 pages
- [x] Confirm which examples will appear on each learning page
- [x] Confirm which existing pages will link into each new page

### Phase 4: Content Production

- [x] Write `/cryptic-crossword-for-beginners`
- [x] Write `/cryptic-clue-types`
- [x] Write `/cryptic-clue-types/anagram`
- [x] Write `/cryptic-clue-types/charade`
- [x] Write `/cryptic-clue-types/container`
- [x] Write `/cryptic-clue-types/double-definition`
- [x] Write `/cryptic-indicators`
- [x] Write `/minute-cryptic/easy`
- [x] Write `/minute-cryptic/medium`
- [x] Write `/minute-cryptic/hard`

### Phase 5: Page Assembly

- [x] Implement the 10 new routes
- [x] Add metadata for each new page
- [x] Add structured internal links inside each page
- [x] Add FAQ schema where appropriate
- [x] Add breadcrumb schema where appropriate
- [x] Add page-level related content blocks
- [x] Add clue-example blocks using live site puzzle data where possible

### Phase 6: Existing Page Updates

- [x] Add beginner guide entry point to homepage
- [x] Add clue types entry point to homepage
- [x] Add learning-page links to `/how-to-play-minute-cryptic`
- [x] Add beginner and clue-type links to `/minute-cryptic-today`
- [x] Add difficulty links to `/minute-cryptic`
- [x] Add learning links to `/daily-cryptic`
- [x] Add beginner and easy-practice links to `/minute-cryptic-faq`
- [x] Add clue-type and difficulty links to `/minute-cryptic/[date]`

### Phase 7: Difficulty Archive Logic

- [x] Build easy page filtering logic
- [x] Build medium page filtering logic
- [x] Build hard page filtering logic
- [x] Confirm sort order for all difficulty pages
- [x] Confirm whether list pages should show newest first
- [x] Confirm number of visible clues before pagination or expansion is needed
- [x] Ensure each listed clue links to its detail page

### Phase 8: SEO And Discoverability

- [x] Add new pages to sitemap generation
- [x] Check canonical URLs for all new pages
- [x] Check metadata uniqueness across all 10 pages
- [x] Ensure no new page title duplicates an existing route
- [x] Ensure no new page description duplicates an existing route
- [x] Confirm internal linking coverage across clusters
- [x] Check heading hierarchy for all long-form pages
- [x] Confirm each page answers a distinct query intent

### Phase 9: AdSense Readiness

- [x] Identify safe ad zones on each long-form page
- [x] Identify safe ad zones on difficulty archive pages
- [x] Explicitly avoid ad placement near gameplay controls
- [x] Ensure content length is sufficient before ad insertion
- [ ] Check that pages still read naturally with ad blocks inserted

### Phase 10: QA

- [x] Review all pages for duplicate phrasing
- [x] Review all pages for thin sections
- [x] Review all pages for broken internal links
- [x] Review all pages for weak anchor text
- [x] Review all pages for mobile readability
- [x] Review all pages for excessive intro length
- [x] Review all example clues for correctness
- [x] Review all clue-type mappings for correctness
- [x] Review all difficulty mappings for correctness
- [x] Build and test the project
- [x] Verify sitemap includes all intended pages

## Acceptance Criteria

This initiative is complete when:

- All 10 approved new pages exist
- Every page is above 1000 words
- Every page has a distinct search intent
- Every page includes FAQ and internal links
- Existing high-traffic pages link into the new cluster pages
- Single puzzle pages link to their clue-type and difficulty hubs
- Sitemap contains the new pages
- Ad placement does not interfere with solving flow

## Notes For Future Expansion

These ideas are valid later but are not part of the current 10-page scope:

- monthly archive pages
- clue-type filtered archive pages
- mistake-focused articles
- 7-day or 14-day training plan pages
- expanded clue indicator reference sections
