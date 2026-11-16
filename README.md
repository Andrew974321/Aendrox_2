# AENDROX

The AENDROX Next.js website lives in `aendrox/`.

## Run locally

```sh
cd aendrox
npm ci
npm run dev
```

## Vercel

Import this repository and set **Root Directory** to `aendrox` and **Framework Preset** to **Next.js**. Keep the output directory at the framework default. The build command is `npm run build`.

Configure environment variables in Vercel using `aendrox/.env.example` as the reference. Never commit real credentials. Set `SITE_URL` to `https://aendrox.in` for production. Contact storage requires Supabase configuration and `aendrox/supabase.sql`; live AI is optional.

See `aendrox/README.md` for project details.
