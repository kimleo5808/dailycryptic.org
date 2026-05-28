# CLAUDE.md — Project Index

dailycryptic.org is an SEO-driven daily puzzle hints/answers site (Next.js 16 App Router,
deployed to Cloudflare via OpenNext). It serves cryptic crossword content plus daily
hint/answer pages and playable games for NYT Wordle, Connections, Strands, and Quordle.
Monetization is Google AdSense only — no login, accounts, paywall, or membership.

## Where things live

- Routes: `app/[locale]/<feature>/`
- Per-game data: `data/<game>/puzzles.json` (sensitive fields base64-encoded)
- Data access: `lib/<game>-data.ts`
- Components: `components/<game>/`
- Navigation: `config/nav.ts` · Site config: `config/site.ts`
- Daily auto-update: `.github/workflows/update-*.yml` → `scripts/fetch-*.mjs`

## Requirement & planning docs

All feature requirement docs live in `docs/`:

- [docs/cryptic-content-requirements.md](docs/cryptic-content-requirements.md) — cryptic content expansion roadmap, page architecture, SEO/AdSense rules (formerly `AGENTS.md`)
- [docs/connections-requirements.md](docs/connections-requirements.md) — NYT Connections hint feature (formerly root `CLAUDE.md`)
- [docs/quordle-requirements.md](docs/quordle-requirements.md) — Quordle game & SEO hub (formerly `CLAUDE-quordle.md`)
- [docs/strands-requirements.md](docs/strands-requirements.md) — NYT Strands hint feature
- [docs/content-plan.md](docs/content-plan.md) · [docs/implementation-plan.md](docs/implementation-plan.md) · [docs/internal-link-map.md](docs/internal-link-map.md) · [docs/adsense-zones.md](docs/adsense-zones.md)
