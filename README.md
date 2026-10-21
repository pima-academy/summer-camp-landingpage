# PiMA Summer Camp Landing Page

Static site exported from Webflow, deployed to GitHub Pages.

## Structure

```
site/            # Everything published to GitHub Pages
  index.html     # Home page
  *.html         # Other pages
  css/ js/ images/
.github/workflows/pages.yml   # Deploys site/ on every push to main
```

## Local preview

```bash
python3 -m http.server -d site 8000
```

## Updating from a new Webflow export

Unzip the export and replace the contents of `site/` (keep `site/.nojekyll`), then commit and push to `main`.
