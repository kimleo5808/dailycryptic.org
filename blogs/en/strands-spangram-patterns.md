---
title: "NYT Strands Spangrams: What 373 Puzzles Reveal"
description: "We analysed 373 NYT Strands puzzles: spangram length and direction, how many theme words to expect, and a data-backed way to find the spangram."
slug: /strands-spangram-patterns
date: "2026-10-29"
tags: "NYT Strands, Data Study, Strategy"
image: /images/blog/strands-spangram-patterns/cover.jpg
visible: published
pin: false
---

Every NYT Strands puzzle hides one word that matters more than the rest: the spangram. Find it early and the theme falls into place. Miss it and you can spend ten minutes tracing letters around the board.

Most Strands advice is general: look at the edges, find any word you can, use your hints. We wanted something more specific, so we went through our archive of **373 Strands puzzles**, from 22 October 2025 to 29 October 2026, and measured every spangram and theme word.

**What is a spangram in NYT Strands?** The spangram is a special word or phrase in each Strands puzzle that describes the theme and stretches from one side of the board to the opposite side. It is highlighted in yellow when found, while the other theme words are highlighted in blue. Every puzzle has exactly one.

**What is NYT Strands?** Strands is a daily New York Times word-search puzzle on a grid of six columns and eight rows. You find theme words by connecting adjacent letters in any direction, and together the theme words and the spangram use every letter on the board.

<Callout>
**Key findings from 373 puzzles**

- **Every puzzle used exactly 48 letters**: the spangram plus the theme words always filled the whole board.
- Spangrams ran **horizontally 58%** of the time and **vertically 42%**.
- Spangrams ranged from **6 to 16 letters**; **10 letters** was the most common length.
- **Every 6- and 7-letter spangram was horizontal.** A vertical spangram was never shorter than 8.
- Puzzles had **4 to 8 theme words**, and **6** was the most common count.
- The more theme words a puzzle had, the **shorter its spangram** tended to be.
</Callout>

## How We Did This

Our archive records each puzzle's theme clue, spangram, spangram direction and list of theme words. We took all 373 puzzles from 22 October 2025 to 29 October 2026 and counted letters, words and directions. We did not need to classify anything by hand, so the numbers are exact counts rather than estimates.

Two caveats are worth stating. First, the archive starts in late 2025, so it does not cover the game's earliest months. Second, "direction" means which pair of sides the spangram connects: left to right (horizontal) or top to bottom (vertical). The actual path can bend and wander in between. dailycryptic.org is an independent puzzle site and is not affiliated with The New York Times.

## Finding 1: Every Letter Is Used

In all 373 puzzles, the letters in the spangram and the theme words added up to exactly **48**, the number of squares on a six-by-eight board. No letter was ever left over and no letter was used twice.

That sounds like a rule of the game, and it is, but it is also a powerful solving tool. It means you can always work out how many letters remain to be found.

Take the puzzle of 24 October 2026, whose clue was "Re-fresh-ing". Its spangram, LAUNDRY DAY, has 10 letters, and its seven theme words (BASKET, DETERGENT, DRYER, IRON, RACK, SINK and WASHER) add up to 38. Together that makes exactly 48.

**How to use it:** after each word you find, subtract its length from 48. If 18 letters remain and you know there are three theme words left, they average six letters each. If an odd pocket of letters is cut off in a corner, it must belong to a word that passes through that pocket.

## Finding 2: Most Spangrams Run Across

Horizontal spangrams, which connect the left and right edges, outnumbered vertical ones, which connect the top and bottom.

| Direction | Puzzles | Share | Shortest | Average length |
|---|---|---|---|---|
| Horizontal (left to right) | 216 | 58% | 6 letters | 10.4 letters |
| Vertical (top to bottom) | 157 | 42% | 8 letters | 10.9 letters |

The difference has a simple geometric cause. The board is six squares wide but eight tall, so a horizontal spangram has a shorter distance to cover. That leaves the puzzle maker more freedom in choosing the spangram, and more room for theme words.

Vertical spangrams were slightly longer on average, 10.9 letters against 10.4, which fits the same geometry: a word that has to cross eight rows tends to need more letters than one that crosses six columns. When a vertical spangram does appear, it is often a long phrase, as three of the four 16-letter spangrams in our archive were.

💡 **Pro tip:** when you start a new puzzle, scan the left and right edges first. Horizontal spangrams are more common, and the edge letters are your best clue to where one begins or ends.

## Finding 3: The Short-Spangram Rule

Spangram lengths ranged from 6 to 16 letters. The chart below shows how often each length appeared, split by direction.

![Stacked bar chart of spangram length across 373 NYT Strands puzzles, split into horizontal and vertical: lengths run from 6 to 16 letters, 10 letters is the most common at 68 puzzles, and every spangram of 6 or 7 letters was horizontal](/images/blog/strands-spangram-patterns/spangram-length.webp)

| Length | Horizontal | Vertical | Total |
|---|---|---|---|
| 6 | 14 | 0 | 14 |
| 7 | 20 | 0 | 20 |
| 8 | 18 | 19 | 37 |
| 9 | 20 | 26 | 46 |
| 10 | 39 | 29 | 68 |
| 11 | 35 | 25 | 60 |
| 12 | 27 | 16 | 43 |
| 13 | 22 | 24 | 46 |
| 14 | 13 | 10 | 23 |
| 15 | 7 | 5 | 12 |
| 16 | 1 | 3 | 4 |

The most useful line in that table is at the top. **All 34 spangrams of six or seven letters ran horizontally.** That is not a coincidence: a vertical spangram has to touch all eight rows, so it needs at least eight letters.

![A six-by-eight Strands board: a horizontal spangram must cross all 6 columns, so it needs at least 6 letters, while a vertical spangram must cross all 8 rows, so it needs at least 8 letters](/images/blog/strands-spangram-patterns/board-geometry.webp)

**How to use it:** if you suspect the theme is a short word, such as AUTUMN or COFFEE, look for it running across the board, not down it. Conversely, if you have found a vertical stretch of letters, the spangram is at least eight letters long.

### The shortest and longest spangrams

The shortest spangrams in our archive were six letters long. Recent examples include **COFFEE** (1 January 2026, clue: "Not your average joe"), **RESUME** (12 January 2026, "Appeal to a hire power") and **BATMAN** (16 January 2026, "DC crusader"). All were horizontal.

The longest reached 16 letters, the maximum we saw: **THE OLD SWITCHEROO** (6 October 2026, vertical), **WATCHING PAINT DRY** (7 February 2026, horizontal), **RELIGIOUS FIGURES** (19 November 2025, vertical) and **FOUR LETTER MOVIES** (4 November 2025, vertical). Long spangrams are usually phrases, so expect several words run together.

## Finding 4: How Many Theme Words to Expect

The spangram is one word; the rest of the board is filled by theme words. Across 373 puzzles, the number of theme words ranged from four to eight.

![Bar chart of theme words per Strands puzzle: 4 theme words in 13 puzzles, 5 in 113, 6 in 163, 7 in 68 and 8 in 16, with the average spangram length falling from 11.8 letters to 8.6 letters as the number of theme words rises](/images/blog/strands-spangram-patterns/theme-words.webp)

| Theme words | Puzzles | Share | Average spangram length |
|---|---|---|---|
| 4 | 13 | 3% | 11.8 letters |
| 5 | 113 | 30% | 11.1 letters |
| 6 | 163 | 44% | 10.5 letters |
| 7 | 68 | 18% | 10.1 letters |
| 8 | 16 | 4% | 8.6 letters |

Six theme words is the most common count, and three puzzles in four have five, six or seven. On average, a puzzle had 5.9 theme words.

The game tells you how many theme words a puzzle has, so you do not need to guess. But knowing the typical range helps you judge how long the remaining words are likely to be.

Combine the count with the 48-letter rule for a quick estimate. In a six-word puzzle with a ten-letter spangram, the six theme words share 38 letters, an average of just over six letters each. If you have found two short words and four remain, you know the rest must be longer, which tells you to look for seven- and eight-letter paths rather than more short ones.

## Finding 5: The Spangram Trade-Off

Look again at the last column of that table. Because every puzzle uses exactly 48 letters, the spangram and the theme words compete for space.

- Puzzles with **four** theme words had spangrams averaging **11.8 letters**.
- Puzzles with **eight** theme words had spangrams averaging just **8.6 letters**.

The relationship runs smoothly in between. More theme words leave fewer letters for the spangram, so it tends to be shorter.

**How to use it:** check the theme word count at the start. If a puzzle has seven or eight theme words, expect a shorter spangram and lean towards a horizontal one. If it has only four or five, expect a long spangram, probably a phrase.

## Finding 6: What Theme Words Look Like

Across all 373 puzzles there were 2,199 theme words. Their lengths tell you what to look for when you trace paths around the board.

| Theme word length | Words | Share |
|---|---|---|
| 4 letters | 370 | 17% |
| 5 letters | 493 | 22% |
| 6 letters | 444 | 20% |
| 7 letters | 344 | 16% |
| 8 letters | 240 | 11% |
| 9 letters | 153 | 7% |
| 10 or more | 155 | 7% |

The average theme word was **6.3 letters** long, and five letters was the most common length. Four is the minimum, because Strands does not accept shorter words. Long theme words of ten or more letters were uncommon, at about one in fourteen.

**How to use it:** when you are hunting for theme words, look for five- and six-letter paths first. They make up more than four in ten of all theme words, and they are short enough to spot by eye.

## Theme Clues Are Usually Puns

Each Strands puzzle comes with a short theme clue, and it is rarely a straight description. Recent clues in our archive include "Who ya gonna call?" (EXTERMINATOR, with pests as theme words), "Re-fresh-ing" (LAUNDRY DAY) and "An instrumental destination" (MUSIC STORE).

Only 15 of the 373 clues ended with a question mark, so do not wait for one to signal a pun. Treat every theme clue as wordplay until proven otherwise. That habit will feel familiar to anyone who solves cryptic clues, where the surface meaning is almost always a decoy.

## Five Common Strands Mistakes

The data also explains why some habits waste time. These are the mistakes we see most often.

### 1. Assuming the spangram is one word

Long spangrams are usually phrases run together, such as WATCHING PAINT DRY or LAUNDRY DAY. If a promising path seems to end in the middle of a word, try reading on as if a new word begins.

### 2. Tracing only straight lines

Paths in Strands can turn at every letter, including diagonally. A spangram that connects the left and right edges rarely runs in a straight row. Follow the letters, not the grid lines.

### 3. Hunting for non-theme words too early

Non-theme words earn hints, but they do not fill the board. If you can see a theme word, take it first: it shrinks the board and confirms the topic. Use non-theme words when you are genuinely stuck.

### 4. Ignoring the letter count

With 48 letters in total, every word you find tells you how much is left. Solvers who track the remaining count spot leftover pockets of letters much faster than those who simply scan.

### 5. Reading the clue literally

Theme clues are almost always puns. "Re-fresh-ing" is not about drinks; it is about laundry. Before you start tracing, spend ten seconds listing other meanings of the clue's key word.

## Strands, Connections and Wordle: What Each Tests

Strands sits alongside other daily New York Times puzzles, and each one tests a different skill.

- **Strands** tests theme thinking and spatial search: you need to guess the topic and trace it through a grid.
- **Connections** tests categorisation, and its hardest group is mostly wordplay. Our [Connections purple group study](/blog/nyt-connections-purple-category) found that 77% of purple groups rely on tricks such as hidden words and homophones.
- **Wordle** tests deduction with letters. If you play it daily, our [Wordle answer and hints](/wordle-answer-today) page explains each day's word.

The common thread is wordplay. Strands' punning theme clues, Connections' purple group and cryptic crossword clues all reward the same habit: reading a phrase in more than one way.

## A Data-Backed Routine for Finding the Spangram

Putting the findings together gives a simple routine for the first minutes of any puzzle.

### Step 1: Read the clue as a pun

Say the theme clue aloud and list two or three possible meanings. "Re-fresh-ing" points to washing, not to drinks.

### Step 2: Note the theme word count

Seven or eight theme words suggest a shorter spangram, often horizontal. Four or five suggest a long one, probably a phrase.

### Step 3: Scan the left and right edges

Horizontal spangrams are more common, and the edges are where they must start and finish. Look for letter combinations that could begin or end a word related to the clue.

### Step 4: Find any theme word, then subtract from 48

One theme word confirms the topic and shrinks the board. Each time you find a word, take its length off the remaining total to see how much is left.

### Step 5: Use hints wisely

In Strands you earn a hint by finding non-theme words of four or more letters: every three such words gives you one hint. If you are stuck, spend your hint early on the spangram rather than late on a theme word you could find yourself.

## Frequently Asked Questions

### What is a spangram in Strands?

The spangram is the theme word that stretches across the Strands board, connecting two opposite sides. It describes the puzzle's theme and is highlighted in yellow when found. Every puzzle has exactly one spangram, and in our archive of 373 puzzles it ranged from 6 to 16 letters.

### Does the spangram always go across the board?

No. In our analysis of 373 puzzles, 58% of spangrams ran horizontally, from the left edge to the right, and 42% ran vertically, from top to bottom. Every spangram shorter than eight letters was horizontal, because a vertical one must cross all eight rows.

### How long is the spangram in Strands?

In our archive, spangrams ranged from 6 to 16 letters, with 10 letters the most common length and an average of about 10.6. Puzzles with more theme words tended to have shorter spangrams, because the spangram and theme words always share the same 48 letters.

### How many theme words are in a Strands puzzle?

Between four and eight in our archive of 373 puzzles. Six was the most common count, appearing in 44% of puzzles, and the average was 5.9. The game shows the number of theme words at the start of each puzzle.

### Does Strands use every letter on the board?

Yes. In every one of the 373 puzzles we analysed, the spangram and theme words together used exactly 48 letters, the full six-by-eight board, with no letter left over or used twice. You can use this to work out how many letters remain after each word you find.

### How do hints work in NYT Strands?

You earn a hint by finding words that are not part of the theme. Every three non-theme words of four or more letters earns one hint, which highlights the letters of a theme word on the board. Hints are most valuable when used on the spangram.

## Next Steps

- Stuck on today's board? Our [Strands hints for today](/strands-hint-today) reveal the theme and spangram step by step.
- Practise on past boards in the full [Strands hint archive](/strands-hint), or play our free [Strands-style game](/strands-game).
- Enjoy puzzle data? Read our [analysis of 660 NYT Connections puzzles](/blog/nyt-connections-purple-category), which found that 77% of purple groups are wordplay.
- Like the punning theme clues? Try a [daily cryptic clue](/minute-cryptic-today), where every clue is built on wordplay.
