---
title: "Cryptic Crossword Indicators, Ranked by Real Data"
description: "We ranked 15,735 cryptic crossword indicator words by how often they appear in 500,000+ clues — the signal words for every wordplay type, plus the ambiguous ones."
slug: /cryptic-crossword-indicator-words
date: "2026-05-31"
tags: "Cryptic Crosswords, Data Study, Indicators"
image: /images/cryptic-indicators-cover.svg
visible: published
pin: true
---

Every cryptic clue hides an instruction. "Mixed" tells you to rearrange letters. "About" tells you to wrap one word around another. "We hear" tells you to listen for a sound-alike. These little words are called **indicators**, and learning to spot them is the single biggest jump in cryptic solving.

The problem? Every guide gives you a *list* — but never tells you which indicators you'll actually meet most often, or which ones are dangerous because they mean more than one thing.

So we counted. We took a public corpus of **over 500,000 cryptic clues** and the **15,735 distinct indicator words** extracted from them, and ranked every one by real-world frequency.

<Callout>
**The headline:** the most common signal word for each wordplay type is short and ordinary — `in` (insertion, 2,310 clues), `about` (container, 1,897), `back` (reversal, 842), `out` (anagram, 886). The flashy indicators you remember are rare; the workhorses are tiny words you skim past.
</Callout>

## What is an indicator in a cryptic crossword?

An **indicator** is the word or phrase in a clue that tells you *which kind of wordplay* is in play. It does not become part of the answer — it is an instruction.

For example, in *"Quiet when LISTEN is mixed (6)"*, the indicator is **mixed** — it signals an anagram of LISTEN, giving SILENT. Remove the indicator and you cannot tell an anagram from a charade. Find it, and you have cracked half the clue.

Indicators fall into eight families, one for each wordplay device: anagram, insertion, container, reversal, hidden, deletion, homophone, and alternation.

## How we got these numbers

The data comes from George Ho's open **cryptics dataset** (see Sources): 500,000+ clues collected from solver blogs and archives across British publications over about twelve years, with a derived table of **15,735 indicators** labelled by wordplay type. We ranked each indicator by the number of clues it appears in.

Two honesty notes, because a ranking is only as good as its method:

- **The top entries are reliable.** Common indicators like `in`, `about` and `back` appear thousands of times — the counts are robust.
- **The long tail is noisy.** Indicators were extracted by pattern-matching, so rare entries include phrases and the odd false positive. Treat exact counts below ~20 as indicative, not precise.

This is a broad, multi-publication sample — more representative than any single setter — but it reflects British cryptic convention specifically.

## Anagram indicators: the most varied of all

Anagrams are the device with the most indicators by far — **7,121 distinct words**, almost half of all 15,735. That is *why* anagrams feel like they're everywhere: practically any word implying disorder, movement or change can signal one.

| Top anagram indicators | Clues |
| --- | ---: |
| out | 886 |
| new | 708 |
| off | 474 |
| upset | 467 |
| about | 447 |
| possibly | 418 |
| playing | 401 |
| drunk | 334 |
| badly | 327 |
| criminal | 324 |
| broken | 298 |
| broadcast | 286 |

Notice they are mostly short, common words — not the colourful "scrambled / cooked / shaken" you expect. Learn to be suspicious of innocuous words like *out*, *new* and *off* sitting next to a jumble of letters. See worked examples on our [anagram clues](/cryptic-clue-types/anagram) page.

## Insertion and container indicators: two sides of one coin

These two devices are mirror images. **Insertion** puts a short piece *inside* a longer one; **container** wraps a word *around* another. They share many indicators.

| Top insertion indicators | Clues | | Top container indicators | Clues |
| --- | ---: | --- | --- | ---: |
| in | 2,310 | | about | 1,897 |
| during | 269 | | around | 466 |
| wearing | 231 | | holding | 312 |
| into | 184 | | outside | 255 |
| found in | 143 | | covering | 222 |
| entering | 138 | | eating | 201 |

`in` (2,310) and `about` (1,897) are the two most common indicators of *any* type in the entire dataset. When you see either next to two word-fragments, suspect that one is being slotted inside the other. More on [container clues](/cryptic-clue-types/container).

## Reversal indicators: short directional words

Reversals run letters backwards. Their indicators are dominated by tiny words of direction — and in Down clues, "up" literally means the letters climb.

| Top reversal indicators | Clues |
| --- | ---: |
| back | 842 |
| up | 702 |
| about | 494 |
| over | 420 |
| upset | 345 |
| returning | 306 |

Read more on [reversal clues](/cryptic-clue-types/reversal).

## Hidden-word indicators: words of containment

Hidden clues bury the answer in a run of letters across the clue. The indicators hint that the answer is *concealed within*.

| Top hidden indicators | Clues |
| --- | ---: |
| some | 356 |
| in | 301 |
| from | 98 |
| part of | 93 |
| somewhat | 81 |
| of | 59 |

`some` is the classic tell. Learn the pattern on our [hidden-word clues](/cryptic-clue-types/hidden-word) page.

## Homophone indicators: the "listen" words

Homophones sound like the answer. Unlike most devices, these indicators are vivid and unambiguous — they all point your ear, not your eye.

| Top homophone indicators | Clues |
| --- | ---: |
| reportedly | 589 |
| we hear | 425 |
| heard | 219 |
| said | 152 |
| broadcast | 150 |
| on the radio | 103 |

If a clue mentions hearing, speaking or broadcasting, test for a sound-alike. See [homophone clues](/cryptic-clue-types/homophone).

## Deletion indicators: words of loss

Deletions chop a letter off a word. The indicators are words of removal, lack or shortening.

| Top deletion indicators | Clues |
| --- | ---: |
| not | 70 |
| missing | 60 |
| almost | 49 |
| losing | 47 |
| short | 46 |
| lacking | 42 |

`almost` and `short` usually mean "drop the last letter"; `endless` and `heartless` target the end and middle. More on [deletion clues](/cryptic-clue-types/deletion).

## Alternation indicators: the "every other letter" device

The rarest family (just 244 indicators). Alternation takes every second letter of a word. The giveaway is a word implying regular spacing.

| Top alternation indicators | Clues |
| --- | ---: |
| regularly | 264 |
| occasionally | 52 |
| oddly | 31 |
| intermittently | 15 |
| periodically | 14 |

`regularly`, `oddly` and `evenly` are the words to watch.

## Beware the ambiguous indicators

Here is the insight no static list tells you: **the same word signals different devices depending on the clue.** The worst offender is `about` — it is the #1 container indicator, but it also commonly signals reversals and anagrams.

![One word, three tricks: how often "about" signals each wordplay device across 500,000+ clues](/images/indicator-about-ambiguity.svg)

It is not alone. These everyday words each wear several hats:

| Indicator | Signals… | Why it's tricky |
| --- | --- | --- |
| **about** | container (1,897), reversal (494), anagram (447) | the ultimate three-way trap |
| **in** | insertion (2,310), hidden (301) | put inside, or buried within? |
| **over** | reversal (420), container (181) | backwards, or wrapped around? |
| **upset** | anagram (467), reversal (345) | jumble, or turn upside-down? |
| **broadcast** | anagram (286), homophone (150) | scrambled, or sounds-like? |

<Aside>
**How to handle them:** don't lock in a device the instant you spot a known indicator. When you see an ambiguous word like *about* or *upset*, hold both readings in mind and let the answer length and the definition decide which one produces a real word.
</Aside>

## How to use indicators when solving

A short, evidence-backed routine:

1. **Find the definition first** — it sits at the start or end of the clue ([our data puts it at 54% start, 46% end](/blog/cryptic-crossword-statistics)).
2. **Scan the rest for an indicator.** A single signal word usually reveals the whole device.
3. **If the indicator is ambiguous, keep your options open** until the letters confirm one reading.
4. **Lean on the common ones.** Memorising `in`, `about`, `back`, `out`, `some` and `we hear` covers a huge share of real clues.
5. **Then practise.** Recognition becomes instinct only with reps — work through our [daily cryptic archive](/minute-cryptic), where every clue is broken down by definition and wordplay.

For the full categorised reference, see our [cryptic indicators](/cryptic-indicators) page; for the devices themselves, start with the [beginner's guide](/cryptic-crossword-for-beginners).

## Frequently asked questions

**What is an indicator word in a cryptic crossword?**
It is the word or phrase that tells you which wordplay device a clue uses — for example, "mixed" signals an anagram, "about" signals a container. The indicator is an instruction; it does not form part of the answer.

**What is the most common anagram indicator?**
In our analysis of 500,000+ clues, the most frequent anagram indicators were ordinary words: "out" (886 clues), "new" (708) and "off" (474). Anagrams have over 7,000 different indicators in total — more than any other device.

**What does "about" mean in a cryptic clue?**
"About" most often signals a container (put one word around another) — it does so in 1,897 clues. But it is ambiguous: it also signals reversals (494 clues) and anagrams (447). Use the answer length and definition to decide which.

**What word signals a homophone?**
Any word that points to hearing or speaking: "reportedly" (589 clues), "we hear" (425), "heard" (219), "said", "broadcast" or "on the radio". If a clue mentions sound, test for a word that sounds like the answer.

## Sources and method

- **Dataset:** George Ho's open dataset of cryptic crossword clues — [cryptics.georgeho.org](https://cryptics.georgeho.org/) — including its derived "indicators" table (15,735 rows labelled by wordplay type). The corpus spans 500,000+ clues from British publications.
- **Method:** each indicator was ranked by the number of clues it appears in. Top entries are robust; rare entries (counts under ~20) are indicative only, as indicators were extracted by pattern-matching.

*Analysis by the dailycryptic.org team. Spotted an error? [Tell us](/contact) and we will recheck.*
