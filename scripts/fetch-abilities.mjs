import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'docs')
const SOURCE_PAGE = 'https://conquestdark.wiki.gg/wiki/Abilities'
const RAW_URL = `${SOURCE_PAGE}?action=raw`
const LICENSE = 'CC BY-SA 4.0 — Conquest Dark Wiki (conquestdark.wiki.gg)'

const SECTION_TYPES = {
  'Primary Attack Ability': 'primary',
  'Power Abilities': 'power',
  'Passive Abilities': 'passive',
  'Movement Abilities': 'movement',
}

const EXPECTED_HEADERS = {
  primary: ['Name', 'Damage', 'Targeting Type', 'Attacks per Second', 'Energy per Hit', 'Innate Bonus', 'Offhand', 'Offhand Bonus', 'Requirements'],
  power: ['Name', 'Description', 'Targeting Type', 'Energy Cost', 'Requirements'],
  passive: ['Name', 'Description', 'Targeting Type', 'Requirements'],
  movement: ['Name', 'Description', 'Recharge', 'Required Mastery'],
}

// Guard against silent mis-parses when the wiki markup changes.
const MIN_COUNTS = { primary: 15, power: 15, passive: 10, movement: 10 }

function fail(msg) {
  console.error(`[fetch-abilities] ERROR: ${msg}`)
  process.exit(1)
}

async function fetchWikitext() {
  const res = await fetch(RAW_URL, {
    headers: { 'User-Agent': 'conquest-dark-runewords-data-script/1.0 (fan project)' },
  })
  if (!res.ok) fail(`HTTP ${res.status} fetching ${RAW_URL}`)
  return res.text()
}

function splitSections(wikitext) {
  const sections = []
  let current = null
  for (const line of wikitext.split('\n')) {
    const m = line.match(/^==\s*(.+?)\s*==\s*$/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1], lines: [] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) sections.push(current)
  return sections
}

function extractTable(lines) {
  const start = lines.findIndex((l) => l.startsWith('{|'))
  if (start === -1) return null
  const end = lines.findIndex((l, i) => i > start && l.startsWith('|}'))
  if (end === -1) throw new Error('table block not closed with |}')
  return lines.slice(start + 1, end)
}

// Split a wikitable into { headerLines, rows: string[][] }.
function parseTableLines(tableLines) {
  const headerLines = []
  const rows = []
  let headerDone = false
  let current = null
  let inCaption = false

  for (const raw of tableLines) {
    const t = raw.trim()
    if (inCaption) {
      if (t.startsWith('!') || t.startsWith('|-')) inCaption = false
      else continue
    }
    if (t.startsWith('|+')) {
      inCaption = true
      continue
    }
    if (t.startsWith('|-')) {
      if (current) rows.push(current)
      current = null
      headerDone = true
      continue
    }
    if (!headerDone) headerLines.push(raw)
    else {
      if (!current) current = []
      current.push(raw)
    }
  }
  if (current) rows.push(current)
  return { headerLines, rows }
}

// Turn raw cell lines into cell strings.
// New cell: line starts with marker ('|' for data, '!' for header); same-line
// extra cells split on sep ('||' / '!!'). Other lines continue the previous cell.
function cellsFromLines(lines, marker, sep) {
  const cells = []
  for (const raw of lines) {
    const t = raw.trim()
    if (t.startsWith(marker)) {
      const body = t.slice(marker.length)
      if (body === '') cells.push('')
      else for (const part of body.split(sep)) cells.push(part)
    } else {
      if (cells.length === 0) cells.push('')
      cells[cells.length - 1] += '\n' + raw
    }
  }
  return cells
}

function cleanCell(s) {
  return s
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, _target, label) => label)
    .replace(/\[\[([^\]]+)\]\]/g, (_, target) => target.replace(/_/g, ' ').replace(/#.*$/, ''))
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

const toLines = (s) => (s ? s.split('\n').map((l) => l.trim()).filter(Boolean) : [])

function toNum(s) {
  const n = Number.parseFloat(s)
  return Number.isFinite(n) ? n : null
}

function extractDamageTypes(text) {
  const matches = text.match(/\b(Primal|Solar|Lunar|Umbral)\s+Damage\b/g) ?? []
  return [...new Set(matches.map((m) => m.replace(/\s+Damage$/, '')))]
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const wikitext = await fetchWikitext()
if (!wikitext.includes('{| class="wikitable')) fail('unexpected wiki format: no wikitable found')

const abilities = []
const seenIds = new Set()
const counts = { primary: 0, power: 0, passive: 0, movement: 0 }

for (const section of splitSections(wikitext)) {
  const type = SECTION_TYPES[section.title]
  if (!type) continue

  const table = extractTable(section.lines)
  if (!table) fail(`no table found in section "${section.title}"`)

  const { headerLines, rows } = parseTableLines(table)
  const headers = cellsFromLines(headerLines, '!', '!!').map((h) => h.trim())
  const expected = EXPECTED_HEADERS[type]
  if (headers.join('|') !== expected.join('|')) {
    fail(
      `header changed in "${section.title}":\n  got:      ${headers.join(' | ')}\n  expected: ${expected.join(' | ')}`,
    )
  }

  rows.forEach((rowLines, i) => {
    const raw = cellsFromLines(rowLines, '|', '||')
    if (raw.length > expected.length + 1) {
      fail(`row ${i + 1} of "${section.title}" has ${raw.length} cells (expected ~${expected.length})`)
    }
    while (raw.length < expected.length) raw.push('')
    const c = raw.map(cleanCell)

    let ability
    if (type === 'primary') {
      ability = {
        name: c[0],
        description: [],
        damage: c[1],
        targeting: c[2],
        attacksPerSecond: toNum(c[3]),
        energyPerHit: toNum(c[4]),
        energyCost: null,
        recharge: '',
        innateBonus: toLines(c[5]),
        offhand: c[6],
        offhandBonus: toLines(c[7]),
        requirements: toLines(c[8]),
      }
    } else if (type === 'power') {
      ability = {
        name: c[0],
        description: toLines(c[1]),
        damage: '',
        targeting: c[2],
        attacksPerSecond: null,
        energyPerHit: null,
        energyCost: toNum(c[3]),
        recharge: '',
        innateBonus: [],
        offhand: '',
        offhandBonus: [],
        requirements: toLines(c[4]),
      }
    } else if (type === 'passive') {
      ability = {
        name: c[0],
        description: toLines(c[1]),
        damage: '',
        targeting: c[2],
        attacksPerSecond: null,
        energyPerHit: null,
        energyCost: null,
        recharge: '',
        innateBonus: [],
        offhand: '',
        offhandBonus: [],
        requirements: toLines(c[3]),
      }
    } else {
      ability = {
        name: c[0],
        description: toLines(c[1]),
        damage: '',
        targeting: '',
        attacksPerSecond: null,
        energyPerHit: null,
        energyCost: null,
        recharge: c[2],
        innateBonus: [],
        offhand: '',
        offhandBonus: [],
        requirements: toLines(c[3]),
      }
    }

    if (!ability.name) fail(`empty name in "${section.title}" row ${i + 1}`)

    const allText = [
      ability.damage,
      ...ability.description,
      ...ability.innateBonus,
      ...ability.offhandBonus,
      ...ability.requirements,
    ].join('\n')

    let id = slug(ability.name)
    let n = 2
    while (seenIds.has(id)) id = `${slug(ability.name)}-${n++}`
    seenIds.add(id)

    abilities.push({ id, type, ...ability, damageTypes: extractDamageTypes(allText) })
    counts[type]++
  })
}

for (const [type, min] of Object.entries(MIN_COUNTS)) {
  if (counts[type] < min) fail(`only ${counts[type]} ${type} abilities (expected >= ${min})`)
}

mkdirSync(outDir, { recursive: true })
const out = {
  source: SOURCE_PAGE,
  license: LICENSE,
  fetchedAt: new Date().toISOString(),
  abilities,
}
writeFileSync(join(outDir, 'abilities.json'), JSON.stringify(out, null, 2) + '\n')

console.log(
  `[fetch-abilities] wrote docs/abilities.json — ` +
    Object.entries(counts)
      .map(([t, n]) => `${n} ${t}`)
      .join(', ') +
    ` (total ${abilities.length})`,
)
