<script setup lang="ts">
import { useFilters } from '../composables/useFilters'
import type { Runeword } from '../types'
import RunewordCard from './RunewordCard.vue'

defineProps<{ runewords: Runeword[] }>()
defineEmits<{ runeClick: [rune: string]; tagClick: [tag: string] }>()

const { clearAll } = useFilters()
</script>

<template>
  <div v-if="runewords.length > 0" class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
    <RunewordCard
      v-for="rw in runewords"
      :key="rw.id"
      :runeword="rw"
      @rune-click="$emit('runeClick', $event)"
      @tag-click="$emit('tagClick', $event)"
    />
  </div>
  <div
    v-else
    class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-zinc-800 px-6 py-16 text-center"
  >
    <p class="text-sm font-medium text-zinc-400">No runewords match the current filters.</p>
    <p class="text-xs text-zinc-600">Try fewer runes, another tag, or clear the search.</p>
    <button
      type="button"
      class="cursor-pointer rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
      @click="clearAll"
    >
      Clear filters
    </button>
  </div>
</template>
