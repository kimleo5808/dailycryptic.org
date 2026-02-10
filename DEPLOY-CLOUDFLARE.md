# Deploy to Cloudflare Workers

This project is configured to deploy with OpenNext on Cloudflare Workers.

## 1. Prerequisites

- Cloudflare account with Workers enabled
- Domain added in Cloudflare (`theforgecodes.app`)
- Node.js 20.x (recommended)
- `pnpm` installed

## 2. Install and login

```bash
pnpm install
pnpm wrangler login
```

## 3. Create cache bucket (one-time)

`wrangler.jsonc` uses this bucket:

- `theforgecodes-cache`

Create it once:

```bash
pnpm wrangler r2 bucket create theforgecodes-cache
```

## 4. Set production environment variables in Cloudflare

Configure these in Workers settings:

- `NEXT_PUBLIC_SITE_URL=https://theforgecodes.app`
- `NEXT_PUBLIC_GOOGLE_ID=<your GA id>`
- `NEXT_PUBLIC_GOOGLE_ADSENSE_ID=<your Adsense id>`
- optional: `NEXT_PUBLIC_BAIDU_TONGJI`
- optional: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- optional: `NEXT_PUBLIC_PLAUSIBLE_SRC`

## 5. Deploy

```bash
pnpm deploy
```

## 6. GitHub auto deploy (recommended)

1. Push code to `https://github.com/kimleo5808/theforgecodes.app.git`
2. In Cloudflare Dashboard:
   - Workers & Pages -> Create -> Workers -> Import a repository
3. Build command:
   - `pnpm deploy`
4. Set environment variables in Cloudflare UI.

For production routing, keep worker name and service binding aligned with `wrangler.jsonc`.
