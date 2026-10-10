<script setup lang="ts">
import { useFilters } from '../composables/useFilters'
import { builds, categories, families, familyOf, tagGroupOf } from '../dataAccess'
import { displayTag, familyColorClass, familyTextClass, tagColorClass } from '../display'
import type { RuneFamily } from '../types'

const {
  search,
  selectedRunes,
  runeMode,
  selectedTags,
  selectedCounts,
  selectedBuilds,
  rdBucket,
  activeFilterCount,
  hasActiveFilters,
  toggleRune,
  toggleTag,
  toggleCount,
  toggleBuild,
  clearAll,
} = useFilters()

const tagGroups = categories.filter((c) => c.group !== 'Number of Runes')
const countOptions = [3, 5, 6]

const sectionLabel = 'mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500'
const modeIdle = 'cursor-pointer rounded px-2 py-0.5 text-zinc-400 transition hover:text-zinc-200'
const modeActive = 'cursor-pointer rounded px-2 py-0.5 font-semibold bg-amber-500 text-zinc-950'
const countIdle =
  'cursor-pointer rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-zinc-700 transition hover:bg-zinc-700'
const countActive =
  'cursor-pointer rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold text-zinc-950 ring-1 ring-inset ring-amber-400'

function runeClasses(rune: string): string {
  const base =
    'cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset transition hover:brightness-125 '
  if (selectedRunes.value.includes(rune)) return base + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return base + (familyColorClass[familyOf(rune)] ?? 'bg-zinc-800 text-zinc-300 ring-zinc-700')
}

function tagClasses(tag: string): string {
  const base =
    'cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset transition hover:brightness-125 '
  if (selectedTags.value.includes(tag)) return base + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return base + (tagColorClass[tagGroupOf(tag)] ?? tagColorClass['Misc'])
}

function buildClasses(build: string): string {
  const base =
    'cursor-pointer rounded px-2 py-1 text-xs font-semibold ring-1 ring-inset transition hover:brightness-125 '
  if (selectedBuilds.value.includes(build))
    return base + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return base + 'bg-zinc-800 text-zinc-300 ring-zinc-700'
}

function familyLabelClasses(fam: RuneFamily): string {
  return `mb-1.5 block text-[10px] font-bold uppercase tracking-widest ${familyTextClass[fam.name] ?? 'text-zinc-500'}`
}
</script>

<template>
  <div class="flex flex-col gap-5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
    <div>
      <label for="rw-search" :class="sectionLabel">Search</label>
      <input
        id="rw-search"
        v-model="search"
        type="search"
        placeholder="Effect, rune, tag, or note…"
        class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/60"
      />
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between gap-2">
        <span class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Runes</span>
        <div class="flex rounded-md bg-zinc-800 p-0.5 text-[11px] font-medium">
          <button
            type="button"
            :class="runeMode === 'all' ? modeActive : modeIdle"
            title="Runewords must contain all selected runes"
            @click="runeMode = 'all'"
          >
            All
          </button>
          <button
            type="button"
            :class="runeMode === 'any' ? modeActive : modeIdle"
            title="Runewords containing any selected rune"
            @click="runeMode = 'any'"
          >
            Any
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div v-for="fam in families" :key="fam.name">
          <span :class="familyLabelClasses(fam)">{{ fam.name }}</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="r in fam.runes"
              :key="r"
              type="button"
              :class="runeClasses(r)"
              @click="toggleRune(r)"
            >
              {{ r }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Category tags</span>
      <div class="flex flex-col gap-2.5">
        <div v-for="group in tagGroups" :key="group.group">
          <span class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            {{ group.group }}
          </span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="t in group.tags"
              :key="t"
              type="button"
              :class="tagClasses(t)"
              @click="toggleTag(t)"
            >
              {{ displayTag(t) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Number of runes</span>
      <div class="flex gap-1.5">
        <button
          v-for="n in countOptions"
          :key="n"
          type="button"
          :class="selectedCounts.includes(n) ? countActive : countIdle"
          @click="toggleCount(n)"
        >
          {{ n }} runes
        </button>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Build</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="b in builds"
          :key="b"
          type="button"
          :class="buildClasses(b)"
          @click="toggleBuild(b)"
        >
          {{ b }}
        </button>
      </div>
    </div>

    <div>
      <label for="rw-rd" :class="sectionLabel">Runeword Discovery</label>
      <select
        id="rw-rd"
        v-model="rdBucket"
        class="w-full cursor-pointer rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/60"
      >
        <option value="all">Any</option>
        <option value="none">No info</option>
        <option value="zero">0%</option>
        <option value="low">1–49%</option>
        <option value="mid">50–99%</option>
        <option value="high">≥100%</option>
      </select>
    </div>

    <button
      v-if="hasActiveFilters"
      type="button"
      class="w-full cursor-pointer rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-amber-500/60 hover:text-amber-300"
      @click="clearAll"
    >
      Clear filters ({{ activeFilterCount }})
    </button>
  </div>
</template>
