# Conquest Dark — Runewords

A Vue 3 + Tailwind CSS browser for Conquest Dark runeword combinations.
Data comes from `docs/runes.csv`, `docs/runewords.csv`, and `docs/category.csv`.

## Features

- **Runewords page** (`/`): all 293 runewords as cards (rune chips, effects, tags, RD/build badges) with live filters:
  text search, rune multi-select (all/any match), category tags, rune count (3/5/6), build, Runeword Discovery bucket.
  Click any rune or tag on a card to filter by it.
- **Runes page** (`/runes`): all 40 runes grouped by family with usage counts; click a rune to jump to matching runewords.

## Development

```sh
npm install
npm run dev        # regenerates data JSON, then starts Vite
```

## Scripts

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run data`      | Parses `docs/*.csv` → `src/data/*.json` (validates runes)  |
| `npm run dev`       | `data` + Vite dev server                                  |
| `npm run build`     | `data` + typecheck + production build                     |
| `npm run typecheck` | `vue-tsc` only                                            |
| `npm run preview`   | Serve the production build                                |

`src/data/*.json` is generated — edit the CSVs and rerun `npm run data` instead.

See `plan.md` for architecture and data-model notes.
