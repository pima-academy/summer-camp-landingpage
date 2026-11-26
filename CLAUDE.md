# PiMA Summer Camp Landing Page

## Language

- All repo documentation (this file, `docs/`, ADRs, `GLOSSARY.md`, GitHub issues and PR bodies) is written in English.
- Website content in `site/` stays in Vietnamese. Don't translate it.

## Building UI

- Every design value (colour, font family, weight, size, line height, radius, shadow) comes from `src/styles/tokens.css` as `var(--…)`; `scripts/guardrail.test.mjs` fails on a literal anywhere else.

## Frozen code

- `src/camp/` and the two camp page files (`src/pages/trai-he-toan-hoc-2025.astro`, `src/pages/trai-he-pima-2026.astro`) are frozen; do not edit them. See `src/camp/README.md`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `pima-academy/summer-camp-landingpage`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
