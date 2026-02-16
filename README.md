# dailycryptic.org

Minute cryptic website built with Next.js 16 + Cloudflare (OpenNext).

## Core Product

- Daily minute cryptic clue
- Progressive hints (4 levels)
- Answer check and explanation
- Archive by date

## Local Development

1. Install dependencies

```bash
pnpm install
```

2. Copy env file

```bash
cp .env.example .env
```

3. Start dev server

```bash
pnpm dev
```

## Puzzle Data Source

All puzzle content lives in:

- `data/minute-cryptic/puzzles.json`

Each puzzle supports:

- `id`
- `printDate` (YYYY-MM-DD)
- `publishDate` (YYYY-MM-DD, optional; falls back to `printDate`)
- `status` (`published` | `scheduled` | `draft`, optional)
- `clue`
- `answer`
- `clueType`
- `difficulty`
- `hintLevels` (exactly 4 strings)
- `explanation`

## Publishing Workflow

This project is self-authored and does not depend on external puzzle feeds.

1. Add or edit puzzle items in `data/minute-cryptic/puzzles.json`
2. Set `publishDate` and `status`
3. Run validation:

```bash
pnpm run validate:minute-cryptic
```

4. Build check:

```bash
pnpm build
```

5. Deploy

```bash
pnpm run deploy
```

## Prelaunch Visibility Gate

Before full launch, you can limit public puzzle count:

- Env var: `MINUTE_CRYPTIC_VISIBLE_COUNT`

Examples:

- `MINUTE_CRYPTIC_VISIBLE_COUNT=2` -> only first 2 visible puzzles
- unset / invalid -> fallback behavior from data layer

This gate affects:

- homepage recent clues
- `/minute-cryptic-today`
- `/minute-cryptic` archive
- `/minute-cryptic/[date]` static routes
- sitemap puzzle URLs

## Validation Rules

`pnpm run validate:minute-cryptic` checks:

- unique `id`
- unique `printDate`
- unique normalized `answer`
- valid `status`, `clueType`, `difficulty`
- valid date strings
- `hintLevels` length = 4
- clue enumeration `(N)` matches answer length when present

## CI/CD

Workflow file:

- `.github/workflows/deploy-cloudflare.yml`

Pipeline:

1. install dependencies
2. validate minute cryptic data
3. build + deploy

No external puzzle-feed update script is used.
