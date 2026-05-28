# UI Design Plan — /wordle-unlimited

> Constraint: match existing playable game pages (`/quordle`, `/minute-cryptic-unlimited`) and the site design system.
> KEY FINDING: the site already has generic, reusable Wordle infrastructure. Build is **light** — mostly composition.

## 1. Reuse inventory (do NOT rebuild these)

| Existing asset | Reuse for Wordle Unlimited |
|---|---|
| `components/games/shared/WordleBoard.tsx` | The guess grid. Already generic over `wordLength` + `rows`, has flip (`animate-tile-flip`), shake (`animate-shake`), dark mode, colour-blind, Wordle palette. **Use as-is.** |
| `components/games/shared/WordleKeyboard.tsx` | On-screen keyboard with letter states. **Use as-is.** |
| `hooks/useWordleGame.ts` | Scoring → evaluations / status / letterStates. Generic over length. **Use as-is.** |
| `lib/quordle-data.ts` → `scoreGuess`, `aggregateLetterState`, `getUtcDateKey`, `getDailyPuzzleNumber`, `cyrb128/mulberry32` pattern | Import the generic scorers; mirror the seeded-RNG daily pattern. |
| `data/wordle-words.ts` → `WORD_LISTS[4..7]` | Answer pool AND valid-guess set per length (same approach Quordle uses for length 5). |
| `stores/quordleStore.ts` | Template for a new `wordleUnlimitedStore` (localStorage, hydrate, daily-by-key, practice, prune). |
| `components/quordle/QuordleShareButton.tsx` | Template for emoji-grid share. |
| `components/minute-cryptic-content/ContentBlocks.tsx` | All long-form SEO content below the game (ContentSection, SubHeading, CalloutBox, StepList, SimpleFaq, RelatedLinks, TableOfContents). |
| `components/ads/AdSlot.tsx` | In-content ads (built last task). |

## 2. New files to create

1. `lib/wordle-unlimited-data.ts` — constants + helpers:
   - `WORD_LENGTHS = [4,5,6,7] as const`, `MAX_GUESSES = 6`.
   - `getRandomAnswer(len)`, `getDailyAnswer(len, dateKey)` (seeded by `wordle-unlimited:${len}:${dateKey}`), `isValidGuess(word, len)`, `getDailyPuzzleNumber`.
   - Re-export `scoreGuess`, `aggregateLetterState` from quordle-data (single source of truth).
2. `stores/wordleUnlimitedStore.ts` — zustand, mirrors quordleStore plus:
   - `practiceByLength: Record<len, PracticeGame>`, `dailyByLengthDate`, `hardMode`, `stats` (gamesPlayed, wins, currentStreak, maxStreak, guessDistribution).
   - localStorage keys `wordle-unlimited:*:v1`; `hydrate`, `addGuess`, `markFinished`, `resetPractice(len)`, `setHardMode`, `recordResult`.
3. `components/wordle-unlimited/WordleUnlimitedGame.tsx` — client component, single board (mirror QuordleGame structure, much simpler — one board not four).
4. `components/wordle-unlimited/WordleUnlimitedShareButton.tsx` — emoji grid of the actual rows (🟩🟨⬜) for a single board.
5. `app/[locale]/wordle-unlimited/page.tsx` — server page: game (above fold) + ContentBlocks long-form + schema.

## 3. Layout (top → bottom) — game-first

```
┌ ContentHero-style compact header (H1 "Wordle Unlimited" + 1-line subhead) ┐
│  — keep it short so the board is near the top of the viewport             │
├ Control bar (mirrors QuordleGame status bar) ───────────────────────────┤
│  [Practice | Daily] tabs   ·   Length: 4 5 6 7 (pills)   ·   guesses x/6 │
│  ·   Hard ⚲ toggle   ·   ⚙ settings (color-blind, dark handled globally) │
├ WordleBoard (rows=6, wordLength=selected) ──────────────────────────────┤
│  centered, full-size tiles (compact=false)                              │
├ Win/Lose summary card (inline, like Quordle's) ─────────────────────────┤
│  result + answer reveal + [Play Again] + [Share]                        │
├ WordleKeyboard ─────────────────────────────────────────────────────────┤
├ Tiny stats strip: Played · Win% · Streak (from store) ──────────────────┤
├ AdSlot (after the game, before the article) ────────────────────────────┤
├ TableOfContents ────────────────────────────────────────────────────────┤
├ Long-form SEO content (ContentSection blocks per blueprint H2 1–6) ──────┤
├ AdSlot (mid-article) ───────────────────────────────────────────────────┤
├ FAQ (SimpleFaq) ────────────────────────────────────────────────────────┤
└ RelatedLinks (Quordle / Connections / Strands / Unlimited Cryptic / Wordle answer) ┘
```

## 4. Interaction details (consistency with existing games)

- **Length selector**: pill toggles styled like the filter chips on `/cryptic-misleading-words` MisdirectionTable (active = `bg-primary text-primary-foreground`). Switching length resets the current practice board for that length (each length has its own saved game).
- **Practice vs Daily**: reuse the `QuordleModeTabs` visual pattern (could generalize it, or copy a minimal local version). Daily = one seeded word per length per UTC day; Practice = endless "Play Again".
- **Hard mode**: when on, validate that revealed greens/yellows are reused (standard Wordle rule) → show shake + toast "Must use revealed hints" (toast pattern already in QuordleGame `triggerShake`).
- **Animations**: inherited from WordleBoard (`animate-tile-flip` staggered by column, `animate-shake` on invalid). No new keyframes needed (they already exist in the shared board/tailwind config).
- **Win/lose**: inline summary card (match Quordle) rather than a heavy modal — lighter, consistent, less CLS. Reveal the answer on loss. "Play Again" (practice) gets instant new word.
- **Stats/streak**: localStorage via the new store. Increment on each finished game; streak resets on a loss. Show a compact strip + optional small distribution in settings.
- **Share**: single-board emoji grid + `dailycryptic.org/wordle-unlimited` footer; uses `navigator.share` → clipboard fallback (copy QuordleShareButton logic).
- **Hydration**: render a pulse skeleton until `hydrated` (same as QuordleGame) to avoid SSR/localStorage mismatch.

## 5. Design tokens (inherited — no new aesthetic)
- Wordle tile palette already defined in WordleBoard (green `#6aaa64`, yellow `#c9b458`, grey `#787c7e`, + dark + colour-blind variants). Keep it — users expect it.
- Page chrome (cards, headings, primary accent, dark mode) from globals.css CSS vars + ContentBlocks. `font-heading` for H1/tiles.
- Mobile: board centers; control bar wraps; keyboard full-width; **no sticky ad over the keyboard** (explicit competitor differentiator). Touch targets ≥ 40px on length pills + keys.

## 6. Accessibility
- Board already uses `role="grid"`/`gridcell` with letter+state aria labels.
- Length pills: `aria-pressed`; mode tabs: `role="tablist"` (reuse Quordle pattern).
- Live region for the error toast (`role="status"`) and for result announcement.

## 7. Honesty / trust (E-E-A-T, also a UX differentiator)
- A small disclosure line under the game: "Unofficial practice game. Not affiliated with The New York Times. For the official daily answer, see Wordle answer today." → links `/wordle-answer-today`.

## 8. Build order (implementation phase)
1. `lib/wordle-unlimited-data.ts`
2. `stores/wordleUnlimitedStore.ts`
3. `components/wordle-unlimited/WordleUnlimitedShareButton.tsx`
4. `components/wordle-unlimited/WordleUnlimitedGame.tsx`
5. `app/[locale]/wordle-unlimited/page.tsx` (game + content + VideoGame/FAQPage/HowTo/Breadcrumb schema)
6. Add to `app/sitemap.ts`, Games nav dropdown in `config/nav.ts`, reverse links from `/wordle-answer-today` + `/wordle-answer`.
7. `next build` verify.

## Summary
Near-zero new game logic: the board, keyboard, scoring hook, and word lists already exist and are length-generic. The work is one data module, one store, one game wrapper, one share button, and the page+content. Differentiation vs competitors = multi-length (4–7) + modern UX (dark, stats, streak, hard mode) + substantial honest content + cleanest mobile ads — none of the 10 competitors combine all four.
