# PiMA Summer Camp Landing Page

The repo holds two versions of pimavn.com:

- **Old site** (`site/`): the Webflow export that pimavn.com serves today.
- **Rebuild** (repo root): the same site rebuilt on Astro, checked locally only until the switch-over.

## Rebuild (Astro)

Requires Node 24 LTS (see `.nvmrc`).

```bash
npm ci                            # install exact versions from package-lock.json
npm run dev                       # dev server at http://localhost:4321 (gap pages visible)
npm run build && npm run preview  # production build in dist/, served locally
npm run shots                     # old/new screenshots at 390/820/1440 px (added by #17)
```

Pull requests into `dev` run `npm ci && npm run build` in CI (`.github/workflows/build.yml`). Nothing is deployed from it.

## Old site (Webflow export)

Static site exported from Webflow, deployed to GitHub Pages.

### Structure

```
site/            # Everything published to GitHub Pages
  index.html     # Home page
  *.html         # Other pages
  css/ js/ images/
.github/workflows/pages.yml   # Deploys site/ on every push to main
```

### Local preview

```bash
python3 -m http.server -d site 8000
```

### Updating from a new Webflow export

Unzip the export and replace the contents of `site/` (keep `site/.nojekyll`), then commit and push to `main`.
