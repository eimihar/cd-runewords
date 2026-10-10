import { computed, ref, type Ref } from 'vue'
import { runewords } from '../dataAccess'
import { displayTag, displayText } from '../display'
import type { RdBucket, RuneMatchMode, Runeword } from '../types'

const search = ref('')
const selectedRunes = ref<string[]>([])
const runeMode = ref<RuneMatchMode>('all')
const selectedTags = ref<string[]>([])
const selectedCounts = ref<number[]>([])
const selectedBuilds = ref<string[]>([])
const rdBucket = ref<RdBucket>('all')

const haystack = runewords.map((rw) =>
  displayText([...rw.runes, ...rw.effects, rw.notes, ...rw.tags.map(displayTag)].join(' ')).toLowerCase(),
)

function matchesBucket(rw: Runeword, bucket: RdBucket): boolean {
  const v = rw.rdValue
  switch (bucket) {
    case 'all':
      return true
    case 'none':
      return v === null
    case 'zero':
      return v === 0
    case 'low':
      return v !== null && v > 0 && v < 50
    case 'mid':
      return v !== null && v >= 50 && v < 100
    case 'high':
      return v !== null && v >= 100
  }
}

const filteredRunewords = computed(() => {
  const q = search.value.trim().toLowerCase()
  const runes = selectedRunes.value
  const tags = selectedTags.value
  const counts = selectedCounts.value
  const selectedBuildList = selectedBuilds.value
  const bucket = rdBucket.value
  const mode = runeMode.value

  return runewords.filter((rw, i) => {
    if (q && !haystack[i].includes(q)) return false
    if (runes.length > 0) {
      const hit =
        mode === 'all'
          ? runes.every((r) => rw.runes.includes(r))
          : runes.some((r) => rw.runes.includes(r))
      if (!hit) return false
    }
    if (tags.length > 0 && !tags.some((t) => rw.tags.includes(t))) return false
    if (counts.length > 0 && !counts.includes(rw.runeCount)) return false
    if (selectedBuildList.length > 0 && !selectedBuildList.includes(rw.build)) return false
    if (!matchesBucket(rw, bucket)) return false
    return true
  })
})

function toggle<T>(arr: Ref<T[]>, value: T): void {
  const i = arr.value.indexOf(value)
  if (i === -1) arr.value.push(value)
  else arr.value.splice(i, 1)
}

function toggleRune(rune: string): void {
  toggle(selectedRunes, rune)
}

function toggleTag(tag: string): void {
  toggle(selectedTags, tag)
}

function toggleCount(count: number): void {
  toggle(selectedCounts, count)
}

function toggleBuild(build: string): void {
  toggle(selectedBuilds, build)
}

function setRunes(list: string[]): void {
  selectedRunes.value = [...new Set(list)].filter(Boolean)
}

function clearAll(): void {
  search.value = ''
  selectedRunes.value = []
  selectedTags.value = []
  selectedCounts.value = []
  selectedBuilds.value = []
  rdBucket.value = 'all'
  runeMode.value = 'all'
}

const activeFilterCount = computed(() => {
  let n = 0
  if (search.value.trim()) n++
  if (selectedRunes.value.length) n++
  if (selectedTags.value.length) n++
  if (selectedCounts.value.length) n++
  if (selectedBuilds.value.length) n++
  if (rdBucket.value !== 'all') n++
  return n
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0)

export function useFilters() {
  return {
    search,
    selectedRunes,
    runeMode,
    selectedTags,
    selectedCounts,
    selectedBuilds,
    rdBucket,
    filteredRunewords,
    activeFilterCount,
    hasActiveFilters,
    toggleRune,
    toggleTag,
    toggleCount,
    toggleBuild,
    setRunes,
    clearAll,
  }
}
