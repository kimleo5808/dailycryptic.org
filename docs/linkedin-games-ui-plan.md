# LinkedIn Games Cluster — UI Design Plan

Status: approved plan · Companion: [linkedin-games-content-plan.md](linkedin-games-content-plan.md)

## Design direction

**"Toy board on a desk."** The site's existing voice is playful neo-brutalism
(2px slate-900 borders, hard offset shadows `shadow-[3px_3px_0]`, sky→indigo→
violet gradient accents, rounded-2xl cards). The LinkedIn cluster adopts that
shell so the site stays coherent, and differentiates *inside* the card: each
game's solution renderer speaks that game's own visual language. The memorable
thing is the boards themselves — clean, theme-aware, obviously hand-built,
where every competitor posts blurry screenshots.

Typography and color tokens: inherit the global system (no new fonts). Accent
per game so archive cards and hub tiles are scannable:

| Game | Accent token | Rationale |
|---|---|---|
| Queens | amber-400 | crowns/royalty |
| Zip | sky-500 | path/flow |
| Tango | violet-500 | sun/moon duality |
| Pinpoint | emerald-500 | "on target" |
| Crossclimb | rose-500 | ladder rungs |

## Shared page shell (all 5 spokes)

```
[Breadcrumb]
[H1 + date pill + "Updated" label]        ← date pill = slate-900 chip, white text
[Direct-answer paragraph (GEO)]
[HINTS CARD]     progressive reveal: 3 numbered hint buttons, each a bordered
                 row that flips from "Tap to reveal hint 2" to hint text;
                 blurred-text treatment (blur-sm + select-none) until tapped
[SOLUTION CARD]  collapsed behind a full-width "Reveal today's solution"
                 button (border-2, hard shadow, game accent bg); expands to
                 the game board component with a soft pop animation (mc-pop
                 pattern already in the codebase)
[Evergreen content: rules / method / mistakes — prose sections]
[Archive strip: last 7 dates as pill links + "Full archive" link]
[FAQ accordion]
[Related games strip: 2 sibling spokes + minute cryptic]
```

Mobile-first: boards max-w-[420px] centered, cells sized with `aspect-square`
inside CSS grid; the page never scrolls horizontally.

## Per-game board components (`components/linkedin/`)

**QueensBoard** — n×n CSS grid, 2px slate-900 gridlines. Cells with a queen:
region-colored background (10-color palette mapped from data) + ♛ glyph
(text-slate-900). Empty cells: theme surface. If full region map exists in
data, color all cells; v1 ships with solution-cells-only coloring. Staggered
`animation-delay` pop-in of crowns left→right on reveal.

**ZipGrid** — n×n grid; numbered waypoint cells show the number in a
slate-900 circle badge; the path is drawn as an SVG overlay polyline (rounded
joins, sky-500, 6px) that animates with stroke-dashoffset on reveal — the one
"wow" moment of the cluster. Walls render as thickened cell borders.

**TangoGrid** — 6×6 grid of ☀ (amber-400) / 🌙 (violet-400 on dark surface)
tokens; `=`/`×` constraint signs rendered on cell edges as tiny badges.

**PinpointReveal** — vertical list of 5 clue rows, each a bordered card;
hint mode reveals clues one at a time; the category answer is a final
emerald-accent card with the answer in display weight.

**CrossclimbLadder** — literal ladder: word rungs as bordered slabs with
side rails; each rung shows clue (small, slate-500) + answer (mono, bold,
tap-to-reveal per rung); final order shown with amber numbered chips; top/
bottom bonus words get rose accent caps.

## Hub page (/linkedin-games-answers)

Hero: H1 + date + one-line direct answer. Then a 1col→2col grid of 5 game
tiles: game accent left border (border-l-4), game name, status dot
("Solved · Aug 12"), first hint teaser (blurred), "Get hints →" arrow link.
Bottom: prose sections + FAQ per content plan. Tiles reuse the archive-card
pattern from existing games for consistency.

## Dark mode & a11y

All boards use token pairs (existing dark: classes convention). Glyph
contrast ≥4.5:1 in both themes (slate-900 glyphs on colored cells; amber/
violet tokens flip lightness in dark). Reveal buttons are real `<button>`s
with aria-expanded; hint blur also gated by aria-hidden until revealed;
boards carry an sr-only textual solution (e.g. "Queens: row 1 column 4…")
so the answer is accessible and crawlable as text.

## Motion budget

One orchestrated moment per page: solution reveal (board pop + staggered
cell entrance ≤600ms total; Zip's path draw ≤900ms). Everything else is
150ms hover/expand transitions. CSS-only; no new dependencies.
