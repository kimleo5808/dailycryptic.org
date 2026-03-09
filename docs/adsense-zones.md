# AdSense Safe Zones

## Purpose

This document fulfills the AdSense readiness portion of the current SEO rollout.

It identifies where ads can be inserted safely across the new long-form pages
and archive pages without disrupting clue entry, hint reveal, or answer
checking.

## Global Rules

Safe zones:

- after the hero or introductory explanation block
- between major H2 sections on long-form guide pages
- above archive list sections
- before FAQ blocks
- after related-links or practice-next sections

Unsafe zones:

- next to the active clue input
- above the virtual keyboard
- next to hint, check, or submit controls
- inside the first screen if the puzzle module gets pushed downward
- between the explanation heading and the actual answer on single clue pages

## Long-Form Learning Pages

Routes:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- `/cryptic-clue-types/anagram`
- `/cryptic-clue-types/charade`
- `/cryptic-clue-types/container`
- `/cryptic-clue-types/double-definition`
- `/cryptic-indicators`

Recommended ad slots:

- slot A: immediately after the table of contents or first educational section
- slot B: between the middle instructional sections and the real-example block
- slot C: before FAQ

Implementation note:

- keep at least one uninterrupted block of educational content above the first ad
- avoid placing an ad between a heading and its first explanatory paragraph

## Difficulty Archive Pages

Routes:

- `/minute-cryptic/easy`
- `/minute-cryptic/medium`
- `/minute-cryptic/hard`

Recommended ad slots:

- slot A: after the opening explanation and before the archive list
- slot B: after the archive list and before FAQ

Implementation note:

- do not split a short explanatory section with an ad
- keep list scanning comfortable on mobile by avoiding dense ad stacking

## Main Archive Page

Route:

- `/minute-cryptic`

Recommended ad slots:

- slot A: after the "How to Use the Minute Cryptic Archive" block
- slot B: after the browsing hubs and before the month-by-month grid
- slot C: before FAQ

Implementation note:

- do not place ads between month heading and the first few clues of that month

## Single Puzzle Pages

Route:

- `/minute-cryptic/[date]`

Recommended ad slots:

- slot A: after the explanation card
- slot B: after the clue-type/difficulty learning card
- slot C: after related archive recommendations

Forbidden placements:

- inside the game component
- above the clue input
- above the keyboard
- between hints and answer checking controls

## Existing Supporting Pages

Routes:

- `/how-to-play-minute-cryptic`
- `/daily-cryptic`
- `/minute-cryptic-faq`

Recommended ad slots:

- after the opening explanatory section
- before FAQ or at the midpoint of long instructional content

## Content-Length Readiness

The 10 new approved pages are all above 1000 words and support safe ad
insertion without creating thin ad-heavy layouts.

Current measured word counts:

- `cryptic-crossword-for-beginners`: 1508
- `cryptic-clue-types`: 1028
- `cryptic-clue-types/anagram`: 1065
- `cryptic-clue-types/charade`: 1050
- `cryptic-clue-types/container`: 1032
- `cryptic-clue-types/double-definition`: 1349
- `cryptic-indicators`: 1105
- `minute-cryptic/easy`: 1192
- `minute-cryptic/medium`: 1219
- `minute-cryptic/hard`: 1155

## Final Rule

If a placement competes with solving flow, remove the ad placement.

This project is monetized by AdSense, but the core product remains the puzzle
experience and the learning flow around it.
