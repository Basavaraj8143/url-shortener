# URL Shortener: Frontend

React single-page app for the URL shortener. It talks to the Spring Boot backend in the repo root.

**Stack:** React 19, Vite, React Router, Axios, [Clerk](https://clerk.com) for authentication, Oxlint.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

| Variable | Purpose |
|----------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API keys → Publishable key (safe to expose in the browser). The app shows a setup screen without it. |
| `VITE_API_BASE_URL` | Backend URL, without a trailing slash. Leave empty in local dev; set it to the deployed backend (for example the Render URL) in production. |

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Local development

Run the backend on `http://localhost:8080`. The dev server proxies `/api` and any short-code path (anything that is not a known frontend route or a static file) to it, so short links work on the dev origin too. Custom aliases may only contain letters, numbers, `_` and `-`, which keeps them clear of the static-file check in `vite.config.js`.

## Project structure

```
src/
  api/         Axios client, error and short-URL helpers
  components/  Navbar, Footer, UrlCard, UrlForm, Icon, ErrorBoundary, ProtectedRoute
  context/     AuthContext (wraps Clerk)
  hooks/       useCreateUrl, useCopyToClipboard, usePageTitle
  pages/       Landing, Login, Register, Dashboard, CreateUrl, NotFound
  utils/       Date helpers
```

## Deployment

The frontend deploys to Vercel. `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh. Set both environment variables in the Vercel project settings.
