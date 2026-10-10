<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FilterPanel from '../components/FilterPanel.vue'
import RunewordList from '../components/RunewordList.vue'
import { useFilters } from '../composables/useFilters'
import { totalRunewords } from '../dataAccess'

const route = useRoute()
const { filteredRunewords, toggleRune, toggleTag, activeFilterCount, setRunes } = useFilters()
const showFilters = ref(false)

onMounted(() => {
  const q = route.query.runes
  if (typeof q === 'string' && q.trim()) {
    setRunes(q.split(',').map((s) => s.trim()).filter(Boolean))
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
    <div class="mb-4 flex items-center justify-between gap-3 lg:hidden">
      <button
        type="button"
        class="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200"
        @click="showFilters = !showFilters"
      >
        {{ showFilters ? 'Hide filters' : 'Filters' }}
        <span
          v-if="activeFilterCount > 0"
          class="rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-zinc-950"
        >
          {{ activeFilterCount }}
        </span>
      </button>
      <span class="text-sm text-zinc-500">
        {{ filteredRunewords.length }} of {{ totalRunewords }}
      </span>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside :class="showFilters ? 'block' : 'hidden lg:block'">
        <div
          class="lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1"
        >
          <FilterPanel />
        </div>
      </aside>

      <main class="min-w-0">
        <div class="mb-4 hidden items-baseline justify-between gap-3 lg:flex">
          <h1 class="text-lg font-semibold text-zinc-100">
            Runewords
            <span class="ml-2 text-sm font-normal text-zinc-500">
              {{ filteredRunewords.length }} of {{ totalRunewords }}
            </span>
          </h1>
        </div>
        <RunewordList
          :runewords="filteredRunewords"
          @rune-click="toggleRune"
          @tag-click="toggleTag"
        />
      </main>
    </div>
  </div>
</template>
