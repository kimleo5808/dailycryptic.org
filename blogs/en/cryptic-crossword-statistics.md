---
title: "We Analysed 5,712 Cryptic Clues: What the Data Shows"
description: "We analysed 5,712 real cryptic crossword clues from one Financial Times setter — where the definition hides, which wordplay wins, and what it means for solvers."
slug: /cryptic-crossword-statistics
date: "2026-05-31"
tags: "Cryptic Crosswords, Data Study, Solving Tips"
image: /images/cryptic-statistics-cover.svg
visible: published
pin: true
---

Every beginner's guide tells you the same thing: a cryptic clue is a **definition plus wordplay**, and the definition sits at the start or the end — never in the middle. It is good advice. But nobody ever says *which* end, or *how often* each kind of wordplay actually turns up.

So we counted.

We took **5,712 real cryptic clues** and measured them: where the definition lived, which wordplay devices appeared, and how long the answers ran. This article is the result — the actual numbers behind the rules of thumb, plus what they mean the next time you stare at a clue.

<Callout>
**The single most useful finding:** across 5,712 clues, the definition was at the **start 53.7%** of the time and at the **end 45.7%** of the time. It really is close to a coin flip — with a slight lean toward the front.
</Callout>

## How we did this (and what these numbers do *not* mean)

Honesty first, because a statistic is only as good as its sample.

The clues come from a **public, annotated dataset** of cryptic crosswords compiled by enthusiast solvers and released openly for research (see Sources). We used the cleaned **"teacow" sample — 5,712 clues from a single prolific *Financial Times* setter**, spanning roughly six years. Each record pairs the clue with its answer and a human-written **wordplay breakdown** that marks the definition (in `{ }`) and notates the mechanism — for example `*(GIVE GEAR)` for an anagram, or `MOCK (ridicule) + UP (mounted)` for a charade.

That gives us two tiers of reliability, and we will not pretend otherwise:

- **Definition position and answer length are exact.** They come straight from the markup and the grid entry.
- **Wordplay frequencies are detected from the notation.** Anagrams (`*`) and charades (`+`) use consistent symbols, so those counts are solid. The rarer devices — containers, reversals, deletions, homophones, hidden words — are matched by indicator words, which **undercounts** them. Treat those as **lower bounds**, not gospel.

And the big caveat: this is **one setter at one publication**. It is a real, sizeable, single-style sample — not the whole cryptic universe. A *Guardian* or *Times* setter would skew differently. Read the numbers as "here is exactly how one expert builds clues," not "here is the universal law of cryptics."

## Finding 1: The definition is (just barely) more likely to come first

Here is the split across all 5,712 clues:

| Where the definition sits | Clues | Share |
| --- | --- | ---: |
| At the **start** of the clue | 3,066 | **53.7%** |
| At the **end** of the clue | 2,610 | **45.7%** |
| Wrapped / &lit (whole clue) | 36 | 0.6% |

The textbook rule — *definition at one end, wordplay at the other* — holds almost perfectly: **99.4% of clues** put the definition cleanly at the front or back, and only a tiny sliver are all-in-one "&lit" clues where the entire clue defines and builds at once.

**What to do with this:** when you meet a clue, read the **first word or two and the last word or two as candidate definitions**, and test each against the answer length. Slightly favour the front — but barely. The wordplay is whatever is left over.

> Want to drill the mechanics behind that "leftover" wordplay? Our [cryptic clue types](/cryptic-clue-types) hub breaks down each device with worked examples.

## Finding 2: Charades are the workhorse; anagrams are rarer than you think

Anagrams get all the attention in beginner guides. In practice, the humble **charade** — building the answer from smaller pieces joined in order — is far more common.

| Wordplay device | Clues (≥1 occurrence) | Share | Reliability |
| --- | --- | ---: | --- |
| **Charade** (parts joined) | 2,266 | **39.7%** | High |
| **Anagram** (letters rearranged) | 1,136 | **19.9%** | High |
| Container (one piece inside another) | 475 | 8.3%+ | Lower bound |
| Reversal (letters run backwards) | 390 | 6.8%+ | Lower bound |
| Deletion (a letter dropped) | 90 | 1.6%+ | Lower bound |
| Homophone (sounds like) | 44 | 0.8%+ | Lower bound |
| Hidden word (buried in the clue) | 32 | 0.6%+ | Lower bound |

Two readings jump out:

- **About 2 clues in 5 use a charade.** That tracks with a long-standing observation among setters that "around a third of clues are pure or part charade" — our data lands slightly higher for this builder.
- **Anagrams appear in roughly 1 clue in 5.** They are the easiest to *spot* (an anagram indicator like "mixed", "cooked" or "altered" is a giveaway), which is why beginners overrate their frequency — but they are not the majority.

The practical lesson: if you are deciding **which skill to drill first for the best return**, learn to spot [charades](/cryptic-clue-types/charade) and [anagrams](/cryptic-clue-types/anagram). Between them they touch the **majority of clues**.

<Aside>
**Why the rarer devices are undercounted:** a reversal might be written as `<DEER` or simply parsed structurally without the word "reversed". Our keyword matching misses those, so the true share of containers, reversals and the rest is higher than the table shows. We would rather report a confident floor than a flattering guess.
</Aside>

## Finding 3: The average answer is 7 letters — and 6 is the single most common length

| Answer length | Clues |
| --- | ---: |
| 3–4 letters | 526 |
| 5 letters | 853 |
| **6 letters** | **1,024** |
| 7 letters | 895 |
| 8 letters | 962 |
| 9 letters | 817 |
| 10+ letters | 635 |

The mean answer length is **7.2 letters**, ranging from 3 up to a single 21-letter monster. The distribution clusters tightly between 5 and 9 letters — **almost 80% of answers** fall in that band.

Why does this matter when solving? **The enumeration (the number in brackets) is a stronger clue than it looks.** A `(6)` is the modal case and rarely narrows things; but a `(3)` or a `(10,4)` is unusual enough that it sharply limits what the answer can be. Use the extreme lengths — they carry the most information.

## Finding 4: Most clues are simpler than they feel

Cryptic clues *feel* like they stack trick upon trick. The data says otherwise — at least for the devices we can detect reliably.

Only **7.3% of clues** combined two or more detectable devices (say, an anagram placed inside a container). The large majority lean on a **single mechanism** plus a definition. (This is again a floor, since we cannot catch every nested device — but the direction is clear.)

**The takeaway for your confidence:** when a clue looks impossible, your first move is usually to find the *one* thing it is doing — not three. Identify the definition, identify the lone device, and the answer tends to fall out.

## So how should you actually use this?

A short, evidence-backed playbook:

1. **Read both ends as the definition first.** It is the front 54% of the time, the back 46% — so check both, lean front, and let the answer length confirm.
2. **Train charades and anagrams before anything else.** They account for the bulk of clues and the fastest wins. Start with our [beginner's guide](/cryptic-crossword-for-beginners).
3. **Respect unusual enumerations.** A very short or very long answer is rare — and therefore informative.
4. **Hunt for one device, not many.** Most clues do one thing. Find it.
5. **Then just do reps.** Patterns become instinct only with volume. Work through our [daily cryptic archive](/minute-cryptic) — every clue comes with a full step-by-step breakdown of its definition and wordplay.

## Frequently asked questions

**Where is the definition in a cryptic clue?**
Always at the start or the end — almost never in the middle. In our sample of 5,712 clues, it was at the start 53.7% of the time and at the end 45.7%, with only 0.6% being all-in-one "&lit" clues.

**What is the most common type of cryptic clue?**
The charade — joining smaller pieces into the answer — was the most common device, appearing in 39.7% of clues, ahead of anagrams at 19.9%.

**Are anagrams the most common cryptic clue type?**
No. Anagrams are the most *recognisable* (their indicator words give them away), but charades are roughly twice as common in this data.

**How long is a typical cryptic answer?**
About 7 letters on average, with 6 letters being the single most common length. Almost 80% of answers are between 5 and 9 letters.

## Sources and method

- **Dataset:** Wordplay dataset of cryptic clues with human-written breakdowns — [github.com/mdda/cryptic-wordplay](https://github.com/mdda/cryptic-wordplay) (the cleaned "teacow"/*Financial Times* sample, 5,712 clues). A broader, unlabelled corpus of 500,000+ clues is maintained at [cryptics.georgeho.org](https://cryptics.georgeho.org/).
- **Method:** definition position and answer length were read directly from the markup; wordplay devices were detected from notation and indicator words, with anagrams and charades counted reliably and rarer devices reported as lower bounds.
- **Scope:** a single *Financial Times* setter over ~6 years. Treat the figures as one expert's style, not a universal average.

*Analysis by the dailycryptic.org team. Spotted an error in our method? [Tell us](/contact) — we will recheck and update.*
