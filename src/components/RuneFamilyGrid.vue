<script setup lang="ts">
import { familyOf, families, runeUsageCount } from '../dataAccess'
import { familyColorClass, familyTextClass } from '../display'

defineEmits<{ select: [rune: string] }>()

function chipClasses(rune: string): string {
  const base =
    'flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold ring-1 ring-inset transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400 '
  return base + (familyColorClass[familyOf(rune)] ?? 'bg-zinc-800 text-zinc-300 ring-zinc-700')
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
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="r in fam.runes"
          :key="r"
          type="button"
          :class="chipClasses(r)"
          :title="`Show runewords containing ${r}`"
          @click="$emit('select', r)"
        >
          {{ r }}
          <span
            class="rounded bg-black/40 px-1 text-[10px] font-bold opacity-80"
            :title="`${runeUsageCount(r)} runewords`"
          >
            {{ runeUsageCount(r) }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
