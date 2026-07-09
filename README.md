# Fran Bulnes Home

Minimal React/Vite home page for franciscobulnes.cl.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy the generated `dist` folder to Vercel, Netlify, Cloudflare Pages, or any static host.

## Deploy to franciscobulnes.cl (GitHub Pages)

1. Create a repo on GitHub (e.g. `franciscobulnes.cl` or `fran-home`)
2. Push this project to `main`
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. In your DNS provider, add:
   - `A` records pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or a `CNAME` record: `www` → `<usuario>.github.io`
   - For apex domain (`franciscobulnes.cl`), use the A records above
5. Back in GitHub Pages settings, set custom domain to `franciscobulnes.cl` and enable HTTPS

## Edit content

- Text/content: `src/App.jsx`
- Styles/colors/layout: `src/styles.css`
