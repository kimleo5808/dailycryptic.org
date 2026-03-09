# Internal Link Map

## Purpose

This document defines the required internal linking relationships for the new SEO content cluster.

Use this file when:

- adding new navigation blocks
- reviewing anchor text
- updating puzzle detail pages
- checking whether topic clusters are properly connected

## Core Principle

Every important page should both receive links and send links.

The content system should create 3 strong link directions:

- hub -> supporting pages
- supporting pages -> hub
- puzzle/practice pages -> learning pages

## Primary Hub Pages

### Beginner Hub

- `/cryptic-crossword-for-beginners`

### Clue Type Hub

- `/cryptic-clue-types`

### Practice Hubs

- `/minute-cryptic`
- `/minute-cryptic-today`

## New Page Link Requirements

### `/cryptic-crossword-for-beginners`

Must link to:

- `/cryptic-clue-types`
- `/minute-cryptic/easy`
- `/minute-cryptic-today`

Should receive links from:

- homepage
- `/how-to-play-minute-cryptic`
- `/minute-cryptic-faq`
- `/daily-cryptic`

Recommended anchors:

- cryptic crossword for beginners
- beginner guide to cryptic clues
- how to start solving cryptic clues

### `/cryptic-clue-types`

Must link to:

- `/cryptic-clue-types/anagram`
- `/cryptic-clue-types/charade`
- `/cryptic-clue-types/container`
- `/cryptic-clue-types/double-definition`
- `/cryptic-crossword-for-beginners`

Should receive links from:

- homepage
- `/how-to-play-minute-cryptic`
- `/cryptic-crossword-for-beginners`

Recommended anchors:

- cryptic clue types
- types of cryptic clues
- common clue patterns

### `/cryptic-clue-types/anagram`

Must link to:

- `/cryptic-clue-types`
- `/cryptic-indicators`
- `/minute-cryptic/easy`

Should receive links from:

- `/cryptic-clue-types`
- related puzzle detail pages
- `/cryptic-indicators`

Recommended anchors:

- anagram clues
- anagram clue guide
- how anagram clues work

### `/cryptic-clue-types/charade`

Must link to:

- `/cryptic-clue-types`
- `/minute-cryptic/easy`
- related charade puzzle pages

Should receive links from:

- `/cryptic-clue-types`
- related puzzle detail pages

Recommended anchors:

- charade clues
- charade clue guide
- how charade clues work

### `/cryptic-clue-types/container`

Must link to:

- `/cryptic-clue-types`
- `/cryptic-indicators`
- `/minute-cryptic/medium`

Should receive links from:

- `/cryptic-clue-types`
- related puzzle detail pages
- `/cryptic-indicators`

Recommended anchors:

- container clues
- container clue guide
- insertion clue examples

### `/cryptic-clue-types/double-definition`

Must link to:

- `/cryptic-clue-types`
- `/cryptic-crossword-for-beginners`
- `/minute-cryptic/medium`

Should receive links from:

- `/cryptic-clue-types`
- related puzzle detail pages

Recommended anchors:

- double definition clues
- double definition guide
- how double definition clues work

### `/cryptic-indicators`

Must link to:

- `/cryptic-clue-types/anagram`
- `/cryptic-clue-types/container`
- `/how-to-play-minute-cryptic`

Should receive links from:

- `/how-to-play-minute-cryptic`
- `/cryptic-clue-types`
- clue-type pages

Recommended anchors:

- cryptic indicators
- cryptic clue indicators
- common indicator words

### `/minute-cryptic/easy`

Must link to:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- `/minute-cryptic/medium`

Should receive links from:

- homepage
- `/minute-cryptic`
- `/cryptic-crossword-for-beginners`
- puzzle detail pages for easy puzzles

Recommended anchors:

- easy cryptic clues
- easy minute cryptic practice
- beginner-friendly cryptic clues

### `/minute-cryptic/medium`

Must link to:

- `/minute-cryptic/easy`
- `/minute-cryptic/hard`
- `/cryptic-indicators`

Should receive links from:

- `/minute-cryptic`
- `/minute-cryptic/easy`
- puzzle detail pages for medium puzzles

Recommended anchors:

- medium cryptic clues
- intermediate practice
- medium minute cryptic

### `/minute-cryptic/hard`

Must link to:

- `/minute-cryptic/medium`
- `/cryptic-indicators`
- relevant hard puzzle pages

Should receive links from:

- `/minute-cryptic`
- `/minute-cryptic/medium`
- puzzle detail pages for hard puzzles

Recommended anchors:

- hard cryptic clues
- advanced cryptic practice
- hard minute cryptic

## Existing Page Update Map

### Homepage

Add links to:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- optionally `/minute-cryptic/easy`

### `/how-to-play-minute-cryptic`

Add links to:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- `/cryptic-indicators`

### `/minute-cryptic`

Add links to:

- `/minute-cryptic/easy`
- `/minute-cryptic/medium`
- `/minute-cryptic/hard`

### `/minute-cryptic-today`

Add links to:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`

### `/daily-cryptic`

Add links to:

- `/cryptic-crossword-for-beginners`
- `/cryptic-clue-types`
- `/minute-cryptic/easy`

### `/minute-cryptic-faq`

Add links to:

- `/cryptic-crossword-for-beginners`
- `/minute-cryptic/easy`
- `/cryptic-clue-types`

### `/minute-cryptic/[date]`

Add links to:

- clue-type topic page
- difficulty archive page
- related practice route

## Puzzle Detail Linking Rules

### By Clue Type

- anagram -> `/cryptic-clue-types/anagram`
- charade -> `/cryptic-clue-types/charade`
- container -> `/cryptic-clue-types/container`
- double-definition -> `/cryptic-clue-types/double-definition`

### By Difficulty

- easy -> `/minute-cryptic/easy`
- medium -> `/minute-cryptic/medium`
- hard -> `/minute-cryptic/hard`

## Anchor Text Rules

Preferred:

- descriptive
- topic-specific
- naturally readable

Examples:

- cryptic crossword for beginners
- types of cryptic clues
- easy cryptic clues
- anagram clue guide

Avoid:

- click here
- read more
- learn more
- this guide
- this page

## Link QA Checklist

- [ ] Every new page receives at least 3 internal links
- [ ] Every new page links out to at least 3 relevant pages
- [ ] Every puzzle detail page links to its clue type page
- [ ] Every puzzle detail page links to its difficulty page
- [ ] Homepage links to the new beginner and clue-type hubs
- [ ] Archive page links to easy, medium, and hard pages
- [ ] No weak anchor text is used in high-value locations
- [ ] No page becomes an orphan route
