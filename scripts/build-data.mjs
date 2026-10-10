import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docs = join(root, 'docs')
const outDir = join(root, 'src', 'data')

function readCsv(relPath) {
  const text = readFileSync(join(docs, relPath), 'utf8').replace(/^\uFEFF/, '')
  const parsed = Papa.parse(text)
  if (parsed.errors.length) {
    console.warn(`[data] ${relPath} parse warnings:`)
    for (const e of parsed.errors.slice(0, 5)) console.warn(`  ${e.message} (row ${e.row})`)
  }
  return parsed.data
}

const cell = (row, i) => String(row[i] ?? '').trim()

// ---- runes.csv: first column = family, rest = rune names ----
const families = []
const runeFamily = new Map()
for (const row of readCsv('runes.csv')) {
  const name = cell(row, 0)
  if (!name) continue
  const runes = row.slice(1).map((c) => String(c ?? '').trim()).filter(Boolean)
  families.push({ name, runes })
  for (const r of runes) {
    if (runeFamily.has(r)) throw new Error(`Duplicate rune "${r}" in runes.csv`)
    runeFamily.set(r, name)
  }
}

// ---- category.csv: first column = group, rest = tags ----
const categories = readCsv('category.csv')
  .map((row) => ({
    group: cell(row, 0),
    tags: row.slice(1).map((c) => String(c ?? '').trim()).filter(Boolean),
  }))
  .filter((c) => c.group && c.tags.length > 0)

const knownTags = new Set(categories.flatMap((c) => c.tags))

// ---- rune-details.json: per-rune effect per level + max level (hand-maintained) ----
const runeDetails = JSON.parse(readFileSync(join(docs, 'rune-details.json'), 'utf8'))
for (const [rune, detail] of Object.entries(runeDetails)) {
  if (!runeFamily.has(rune)) throw new Error(`rune-details.json: unknown rune "${rune}"`)
  if (typeof detail?.effectPerLevel !== 'string' || !detail.effectPerLevel) {
    throw new Error(`rune-details.json: "${rune}" missing effectPerLevel`)
  }
  if (typeof detail?.maxLevel !== 'number') {
    throw new Error(`rune-details.json: "${rune}" missing numeric maxLevel`)
  }
}

// ---- runewords.csv ----
const rows = readCsv('runewords.csv')
const headerIdx = rows.findIndex((r) => cell(r, 0) === 'Rune 1')
if (headerIdx === -1) throw new Error('Header row ("Rune 1", ...) not found in runewords.csv')

// Collect the numeric RD (Runeword Discovery) percentages inside a hint string.
function rdNumbers(text) {
  return [...text.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map((m) => Number(m[1]))
}

// Short display token like "~100%", "<25%", ">50%", "0~25%", "25-125%", "+125%".
function rdToken(text) {
  const m = text.match(/[~<>+]?\d+(?:\.\d+)?(?:\s*[~-]\s*\d+(?:\.\d+)?)?\s*%/)
  return m ? m[0].replace(/\s+/g, '') : null
}

function extractRd(notes, discovery) {
  const source = /RD\b|Runeword Discovery/i.test(notes)
    ? notes
    : discovery
      ? discovery
      : ''
  if (!source) return { rdHint: null, rdValue: null }
  const nums = rdNumbers(source)
  if (nums.length === 0) return { rdHint: null, rdValue: null }
  return { rdHint: rdToken(source), rdValue: Math.max(...nums) }
}

const runewords = []
const seenIds = new Set()
let unknownTagCount = 0

for (let i = headerIdx + 1; i < rows.length; i++) {
  const row = rows[i]
  const runes = [0, 1, 2, 3, 4, 5].map((c) => cell(row, c)).filter(Boolean)
  if (runes.length === 0) continue

  const unknown = runes.filter((r) => !runeFamily.has(r))
  if (unknown.length > 0) {
    throw new Error(`Unknown rune(s) [${unknown.join(', ')}] in runewords row ${i + 1}`)
  }

  const declared = Number.parseInt(cell(row, 8), 10)
  if (!Number.isNaN(declared) && declared !== runes.length) {
    console.warn(`[data] rune count mismatch for ${runes.join('+')}: column says ${declared}, cells say ${runes.length}`)
  }

  const effects = cell(row, 6)
    .split(/[\n;]+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const tags = cell(row, 7)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  for (const t of tags) {
    if (!knownTags.has(t)) {
      unknownTagCount++
      console.warn(`[data] unknown tag "${t}" on ${runes.join('+')}`)
    }
  }

  const notes = cell(row, 9)
  const discovery = cell(row, 10)
  const build = cell(row, 11)
  const { rdHint, rdValue } = extractRd(notes, discovery)

  let id = runes.map((r) => r.toLowerCase()).join('-')
  let n = 2
  while (seenIds.has(id)) id = `${runes.map((r) => r.toLowerCase()).join('-')}-${n++}`
  seenIds.add(id)

  runewords.push({
    id,
    runes,
    effects,
    tags,
    runeCount: runes.length,
    notes,
    rdHint,
    rdValue,
    build,
  })
}

const usedRunes = new Set(runewords.flatMap((r) => r.runes))
const unusedRunes = [...runeFamily.keys()].filter((r) => !usedRunes.has(r))

mkdirSync(outDir, { recursive: true })
const emit = (name, data) => {
  const path = join(outDir, name)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
  console.log(`[data] wrote src/data/${name}`)
}

emit('runes.json', { families, details: runeDetails })
emit('categories.json', { categories })
emit('runewords.json', { runewords })

const missingDetails = [...runeFamily.keys()].filter((r) => !runeDetails[r])
console.log(
  `[data] ${families.length} families, ${runeFamily.size} runes, ` +
    `${categories.length} tag groups, ${runewords.length} runewords` +
    (unusedRunes.length ? ` (unused runes: ${unusedRunes.join(', ')})` : ''),
)
console.log(
  `[data] rune details: ${Object.keys(runeDetails).length}/${runeFamily.size}` +
    (missingDetails.length ? ` (no level data: ${missingDetails.join(', ')})` : ''),
)
if (unknownTagCount > 0) console.warn(`[data] ${unknownTagCount} unknown tag occurrence(s)`)
