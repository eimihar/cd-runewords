<script setup lang="ts">
import { displayText, abilityTypeColorClass, abilityTypeLabel, damageTypeColorClass } from '../display'
import type { Ability } from '../types'

const props = defineProps<{ ability: Ability }>()

function requirementLabel(req: string): string {
  return displayText(req)
}

function isNoRequirement(req: string): boolean {
  return /^no\s+r?e?quirements$/i.test(req)
}

const statBadge =
  'rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700'
const typeBadge = `rounded px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${abilityTypeColorClass[props.ability.type]}`
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
  >
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="text-sm font-semibold text-zinc-100">{{ displayText(ability.name) }}</h3>
      <span :class="typeBadge">{{ abilityTypeLabel[ability.type] }}</span>
      <span v-if="ability.damage" class="ml-auto text-xs font-medium text-zinc-300">
        {{ displayText(ability.damage) }}
      </span>
    </div>

    <ul v-if="ability.description.length > 0" class="flex flex-col gap-1">
      <li
        v-for="(line, i) in ability.description"
        :key="i"
        class="text-sm leading-snug text-zinc-300"
      >
        {{ displayText(line) }}
      </li>
    </ul>

    <ul v-if="ability.innateBonus.length > 0" class="flex flex-col gap-1">
      <li
        v-for="(bonus, i) in ability.innateBonus"
        :key="i"
        class="flex gap-2 text-sm leading-snug text-zinc-300"
      >
        <span aria-hidden="true" class="select-none text-amber-500/70">◆</span>
        <span>{{ displayText(bonus) }}</span>
      </li>
    </ul>

    <div v-if="ability.offhand" class="flex flex-col gap-1">
      <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Offhand — <span class="text-zinc-300 normal-case tracking-normal">{{ ability.offhand }}</span>
      </p>
      <p
        v-for="(bonus, i) in ability.offhandBonus"
        :key="i"
        class="flex gap-2 text-xs leading-snug text-zinc-400"
      >
        <span aria-hidden="true" class="select-none text-sky-500/70">◆</span>
        <span>{{ displayText(bonus) }}</span>
      </p>
    </div>

    <div
      class="mt-auto flex flex-wrap items-center gap-1.5 border-t border-zinc-800 pt-3"
    >
      <span
        v-if="ability.targeting"
        class="rounded bg-sky-500/15 px-1.5 py-0.5 text-[11px] font-medium text-sky-300 ring-1 ring-inset ring-sky-500/40"
      >
        {{ ability.targeting }}
      </span>
      <span
        v-for="d in ability.damageTypes"
        :key="d"
        :class="['rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset', damageTypeColorClass[d] ?? 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/40']"
      >
        {{ d }} Damage
      </span>
      <span v-if="ability.attacksPerSecond !== null" :class="statBadge">
        APS {{ ability.attacksPerSecond.toFixed(2) }}
      </span>
      <span v-if="ability.energyPerHit !== null" :class="statBadge">
        {{ ability.energyPerHit }} energy/hit
      </span>
      <span v-if="ability.energyCost !== null" :class="statBadge">
        {{ ability.energyCost }} energy
      </span>
      <span v-if="ability.recharge" :class="statBadge">{{ ability.recharge }} recharge</span>
    </div>

    <div v-if="ability.requirements.length > 0" class="flex flex-wrap items-center gap-1">
      <template v-if="ability.requirements.some((r) => !isNoRequirement(r))">
        <span
          v-for="req in ability.requirements.filter((r) => !isNoRequirement(r))"
          :key="req"
          class="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700"
          title="Requirement"
        >
          {{ requirementLabel(req) }}
        </span>
      </template>
      <span v-else class="text-[11px] italic text-zinc-600">No requirements</span>
    </div>
  </article>
</template>
