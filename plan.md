# Conquest Dark Runewords — Plan

A Vue 3 + Tailwind app to browse runeword combinations from the game's rune data.

## 1. Data model

Parsed from `docs/runes.csv`, `docs/runewords.csv`, `docs/category.csv`.

- **Rune**: `{ name, family }`
  - Families: **Primordial** (9), **Sun** (8), **Moon** (7), **Abyss** (5), **Elritch** (11) — 40 runes total.
  - `Adr` is defined but unused by any runeword (kept in data).
  - **Rune level details** live in `docs/rune-details.json` (hand-maintained, not a CSV):
    `{ rune: { effectPerLevel, maxLevel } }` — validated by the pipeline and merged into
    `src/data/runes.json` as `details`; runes without an entry show "No level data yet".
- **Runeword**: `{ id, runes[], effects[], tags[], runeCount, notes, rdHint, build }`
  - `runeCount`: 3 | 5 | 6 (212 × 3-rune, 55 × 5-rune, 25 × 6-rune = 293 total).
  - `effects[]`: `Effect` field split on newlines/semicolons into individual bonus lines.
  - `tags[]`: from `CategoryTags`, trimmed.
  - `rdHint`: runeword-discovery hint extracted from Notes / Discovery columns (`~100% RD`, `<25%`, `>50%`, …).
  - `build`: only ~10 rows have one (Blockade, NecroAda, Soulstealer).
- **Category taxonomy** (from `category.csv`) drives filter groups:
  Damage Types, Conditions, Abilities, Role, Misc, Number of Runes.
  Note: `Good`, `Waste`, `Powerful`, `Unverified` live under Misc as quality tags.

## 2. Data pipeline

- `scripts/build-data.mjs` (Node + papaparse) parses the 3 CSVs plus `docs/rune-details.json`
  and `docs/abilities.json`, then emits `src/data/runes.json` (families + details),
  `src/data/runewords.json`, `src/data/categories.json`, `src/data/abilities.json`.
- Validation: every rune used in a runeword exists in `runes.csv`; unknown runes → build error.
  `rune-details.json` keys are checked against `runes.csv` (unknown key or bad shape → error).
- **Abilities source**: `npm run fetch:abilities` (`scripts/fetch-abilities.mjs`) scrapes
  `https://conquestdark.wiki.gg/wiki/Abilities?action=raw` (wikitext), parses the 4 wikitable
  sections (Primary/Power/Passive/Movement), validates headers + min counts, and writes
  `docs/abilities.json` (committed; manual refresh — builds never hit the network).
  License: CC BY-SA 4.0 (Conquest Dark Wiki) — credited in the app footer.
- Normalization (display only, raw CSVs untouched):
  - `Ofensive` → `Offensive` in tag labels.
  - Trim whitespace, split multi-line / `;`-separated effects.
  - Extract RD hints into `rdHint`.
- Wired as `npm run data` plus `predev` / `prebuild` hooks so JSON is always fresh.

## 3. UI

Two routes (vue-router), dark theme throughout.

### `/` — Runewords browser (main)
- **Sidebar filters** (all combinable, live):
  - Text search over effect lines + notes.
  - Rune multi-select (chips, colored by family) — match **all** selected, with an any/all toggle.
  - Tag multi-select grouped by taxonomy.
  - Rune count: 3 / 5 / 6.
  - Build: Blockade / NecroAda / Soulstealer.
  - RD hint buckets.
- **Runeword cards**: rune chips → effects → tag badges → count / build / RD badges;
  expandable notes. Live result count, clear-filters, empty state.

### `/runes` — Rune reference
- 5 family sections of rune chips. Click a rune → navigate to `/` pre-filtered
  to runewords containing it.

### `/abilities` — Abilities (from the wiki)
- 70 abilities (22 primary, 19 power, 16 passive, 13 movement) from `docs/abilities.json`.
- Sidebar filters: search, ability type, targeting type, damage type, requirement/proficiency.
- Cards: name + type badge, description/bonus lines, targeting + damage-type badges,
  APS/energy/recharge badges, requirement chips. Attribution line (CC BY-SA 4.0).

## 4. Architecture

```
scripts/build-data.mjs        # CSV/JSON → src/data/*.json pipeline
scripts/fetch-abilities.mjs   # wiki wikitext → docs/abilities.json (manual refresh)
src/
  data/*.json                 # generated, committed
  types.ts                    # Rune, Runeword, Category, RuneFamily, Ability
  dataAccess.ts               # typed loaders + lookups (rune → family, etc.)
  composables/useFilters.ts  useAbilityFilters.ts
  components/
    RuneChip.vue  TagBadge.vue  RunewordCard.vue  FilterPanel.vue
    RunewordList.vue  RuneFamilyGrid.vue
    AbilityCard.vue  AbilityFilterPanel.vue
  views/  RunewordsView.vue  RunesView.vue  AbilitiesView.vue
  router/index.ts
  App.vue  main.ts
```

- Stack: **Vite + Vue 3 + TypeScript + Tailwind CSS v4** (`@tailwindcss/vite`).
- State: single `useFilters` composable (module-level reactive) — no Pinia needed at this size.

## 5. Steps

1. Write `plan.md` ✅
2. Scaffold Vite + Vue 3 + TS + Tailwind
3. Data pipeline script + generated JSON
4. Types + data access + filter composable
5. Filter panel + runeword list/cards
6. Runes view + cross-linking
7. Polish (responsive, empty states)
8. Verify

## 6. Verification

- `npm run typecheck` and `npm run build` pass.
- Dev-server smoke test; spot-check known runewords against the CSVs.
