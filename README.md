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

## Optional Archive Display Gate

You can optionally limit archive list display count:

- Env var: `MINUTE_CRYPTIC_ARCHIVE_VISIBLE_COUNT`

Examples:

- `MINUTE_CRYPTIC_ARCHIVE_VISIBLE_COUNT=2` -> archive page shows 2 puzzles
- unset / invalid -> archive page shows all published puzzles

This gate affects only:

- `/minute-cryptic` archive

It does not affect:

- homepage clue module and recent list
- `/minute-cryptic-today`
- `/minute-cryptic/[date]` detail availability
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
