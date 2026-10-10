<script setup lang="ts">
import { useRouter } from 'vue-router'
import RuneFamilyGrid from '../components/RuneFamilyGrid.vue'
import { useFilters } from '../composables/useFilters'
import { runeUsageCount, totalRunes, totalRunewords } from '../dataAccess'

const router = useRouter()
const { setRunes } = useFilters()

function selectRune(rune: string) {
  setRunes([rune])
  router.push({ path: '/' })
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
    <header class="mb-6">
      <h1 class="text-xl font-semibold text-zinc-100">Runes</h1>
      <p class="mt-1 text-sm text-zinc-500">
        {{ totalRunes }} runes across 5 families, with effect per level and max level where known.
        Click a rune to browse the {{ totalRunewords }} runewords that use it (badge shows how many).
      </p>
    </header>
    <RuneFamilyGrid @select="selectRune" />
    <p class="mt-6 text-xs text-zinc-600">
      Tip: use the multi-select on the runewords page to find words sharing several runes.
      <span v-if="runeUsageCount('Adr') === 0"> Note: Adr is not used by any runeword yet.</span>
    </p>
  </div>
</template>
