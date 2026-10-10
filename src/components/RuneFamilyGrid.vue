<script setup lang="ts">
import { familyOf, families, runeDetail, runeUsageCount } from '../dataAccess'
import { displayText, familyColorClass, familyTextClass } from '../display'

defineEmits<{ select: [rune: string] }>()

function chipClasses(rune: string): string {
  const base =
    'inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold ring-1 ring-inset '
  return base + (familyColorClass[familyOf(rune)] ?? 'bg-zinc-800 text-zinc-300 ring-zinc-700')
}

function effectText(rune: string): string {
  const detail = runeDetail(rune)
  return detail ? displayText(detail.effectPerLevel) : ''
}

function maxLevelText(rune: string): string {
  const detail = runeDetail(rune)
  return detail ? `Lv ${detail.maxLevel}` : ''
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <section
      v-for="fam in families"
      :key="fam.name"
      class="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <h2
          class="text-xs font-bold uppercase tracking-widest"
          :class="familyTextClass[fam.name] ?? 'text-zinc-400'"
        >
          {{ fam.name }}
        </h2>
        <span class="text-[11px] text-zinc-600">{{ fam.runes.length }} runes</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <button
          v-for="r in fam.runes"
          :key="r"
          type="button"
          class="group flex w-full cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-left transition hover:bg-zinc-800/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400"
          :title="`Show runewords containing ${r}`"
          @click="$emit('select', r)"
        >
          <span :class="chipClasses(r)">
            {{ r }}
            <span
              class="rounded bg-black/40 px-1 text-[10px] font-bold opacity-80"
              :title="`${runeUsageCount(r)} runewords`"
            >
              {{ runeUsageCount(r) }}
            </span>
          </span>
          <span
            v-if="effectText(r)"
            class="min-w-0 flex-1 text-[11px] leading-snug text-zinc-500 transition group-hover:text-zinc-400"
          >
            {{ effectText(r) }}
          </span>
          <span v-else class="min-w-0 flex-1 text-[11px] italic leading-snug text-zinc-700">
            No level data yet
          </span>
          <span
            v-if="maxLevelText(r)"
            class="shrink-0 rounded bg-zinc-800 px-1 py-0.5 text-[10px] font-semibold text-zinc-500 ring-1 ring-inset ring-zinc-700"
            title="Max level"
          >
            {{ maxLevelText(r) }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
