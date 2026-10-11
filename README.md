# Conquest Dark — Runewords

A Vue 3 + Tailwind CSS browser for Conquest Dark runeword combinations.
Data comes from `docs/runes.csv`, `docs/runewords.csv`, and `docs/category.csv`.

## Features

- **Runewords page** (`/`): all 293 runewords as cards (rune chips, effects, tags, RD/build badges) with live filters:
  text search, rune multi-select (all/any match), category tags, rune count (3/5/6), build, Runeword Discovery bucket.
  Click any rune or tag on a card to filter by it. Hover a card for a floating rune-details panel.
- **Runes page** (`/runes`): all 40 runes grouped by family with per-level effects, max level, and usage counts;
  click a rune to jump to matching runewords.
- **Abilities page** (`/abilities`): all 70 game abilities (primary/power/passive/movement) scraped from the
  Conquest Dark Wiki, with filters for type, targeting, damage type, and requirements.

## Development

```sh
npm install
npm run dev            # regenerates data JSON, then starts Vite
npm run fetch:abilities  # refresh docs/abilities.json from the wiki (manual)
```

## Scripts

| Command                  | What it does                                                          |
| ------------------------ | --------------------------------------------------------------------- |
| `npm run data`           | Parses `docs/*.csv` + JSON sources → `src/data/*.json` (validates)     |
| `npm run fetch:abilities`| Scrapes the wiki → `docs/abilities.json` (manual refresh)              |
| `npm run dev`            | `data` + Vite dev server                                              |
| `npm run build`          | `data` + typecheck + production build                                 |
| `npm run typecheck`      | `vue-tsc` only                                                        |
| `npm run preview`        | Serve the production build                                            |

`src/data/*.json` is generated — edit the CSVs / `docs/rune-details.json`, or rerun
`npm run fetch:abilities`, then rerun `npm run data`.

Ability data © Conquest Dark Wiki contributors, licensed under CC BY-SA 4.0.

See `plan.md` for architecture and data-model notes.
