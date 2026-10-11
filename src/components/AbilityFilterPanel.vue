<script setup lang="ts">
import { useAbilityFilters } from '../composables/useAbilityFilters'
import { abilityDamageTypes, abilityRequirements, abilityTargetings } from '../dataAccess'
import { abilityTypeColorClass, abilityTypeLabel, damageTypeColorClass } from '../display'
import type { AbilityType } from '../types'

const {
  search,
  selectedTypes,
  selectedTargetings,
  selectedDamageTypes,
  selectedRequirements,
  activeFilterCount,
  hasActiveFilters,
  toggleType,
  toggleTargeting,
  toggleDamageType,
  toggleRequirement,
  clearAll,
} = useAbilityFilters()

const types: AbilityType[] = ['primary', 'power', 'passive', 'movement']
const sectionLabel = 'mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500'

function chipBase(): string {
  return 'cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset transition hover:brightness-125 '
}

function typeClasses(type: AbilityType): string {
  if (selectedTypes.value.includes(type)) return chipBase() + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return chipBase() + abilityTypeColorClass[type]
}

function targetingClasses(targeting: string): string {
  if (selectedTargetings.value.includes(targeting))
    return chipBase() + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return chipBase() + 'bg-sky-500/15 text-sky-300 ring-sky-500/40'
}

function damageClasses(damageType: string): string {
  if (selectedDamageTypes.value.includes(damageType))
    return chipBase() + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return (
    chipBase() +
    (damageTypeColorClass[damageType] ?? 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/40')
  )
}

function requirementClasses(req: string): string {
  if (selectedRequirements.value.includes(req))
    return chipBase() + 'bg-amber-400 text-zinc-950 ring-amber-300'
  return chipBase() + 'bg-zinc-800 text-zinc-300 ring-zinc-700'
}
</script>

<template>
  <div class="flex flex-col gap-5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
    <div>
      <label for="ab-search" :class="sectionLabel">Search</label>
      <input
        id="ab-search"
        v-model="search"
        type="search"
        placeholder="Name, description, or requirement…"
        class="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/60"
      />
    </div>

    <div>
      <span :class="sectionLabel">Ability type</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="t in types"
          :key="t"
          type="button"
          :class="typeClasses(t)"
          @click="toggleType(t)"
        >
          {{ abilityTypeLabel[t] }}
        </button>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Targeting type</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="t in abilityTargetings"
          :key="t"
          type="button"
          :class="targetingClasses(t)"
          @click="toggleTargeting(t)"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Damage type</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="d in abilityDamageTypes"
          :key="d"
          type="button"
          :class="damageClasses(d)"
          @click="toggleDamageType(d)"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <div>
      <span :class="sectionLabel">Requirement</span>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="r in abilityRequirements"
          :key="r"
          type="button"
          :class="requirementClasses(r)"
          @click="toggleRequirement(r)"
        >
          {{ r }}
        </button>
      </div>
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
