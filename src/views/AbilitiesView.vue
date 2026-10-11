<script setup lang="ts">
import { ref } from 'vue'
import AbilityCard from '../components/AbilityCard.vue'
import AbilityFilterPanel from '../components/AbilityFilterPanel.vue'
import { useAbilityFilters } from '../composables/useAbilityFilters'
import { abilitiesLicense, abilitiesSource, abilitiesFetchedAt, totalAbilities } from '../dataAccess'

const { filteredAbilities, activeFilterCount, clearAll } = useAbilityFilters()
const showFilters = ref(false)
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
      <span class="text-sm text-zinc-500">{{ filteredAbilities.length }} of {{ totalAbilities }}</span>
    </div>

    <div class="grid items-start gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
      <aside :class="showFilters ? 'block' : 'hidden lg:block'">
        <div class="lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
          <AbilityFilterPanel />
        </div>
      </aside>

      <main class="min-w-0">
        <div class="mb-4 hidden items-baseline justify-between gap-3 lg:flex">
          <h1 class="text-lg font-semibold text-zinc-100">
            Abilities
            <span class="ml-2 text-sm font-normal text-zinc-500">
              {{ filteredAbilities.length }} of {{ totalAbilities }}
            </span>
          </h1>
        </div>

        <p v-if="totalAbilities === 0" class="mb-4 text-sm text-zinc-500">
          No ability data loaded — run
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-amber-300">npm run fetch:abilities</code>
          to scrape it from the Conquest Dark Wiki.
        </p>

        <div v-if="filteredAbilities.length > 0" class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <AbilityCard v-for="ab in filteredAbilities" :key="ab.id" :ability="ab" />
        </div>
        <div
          v-else-if="totalAbilities > 0"
          class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-zinc-800 px-6 py-16 text-center"
        >
          <p class="text-sm font-medium text-zinc-400">No abilities match the current filters.</p>
          <p class="text-xs text-zinc-600">Try another type, targeting, or clear the search.</p>
          <button
            type="button"
            class="cursor-pointer rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
            @click="clearAll"
          >
            Clear filters
          </button>
        </div>

        <p v-if="totalAbilities > 0" class="mt-6 text-xs text-zinc-600">
          Data from
          <a
            :href="abilitiesSource"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-500 underline decoration-zinc-700 underline-offset-2 transition hover:text-amber-400"
            >Conquest Dark Wiki</a
          >
          ({{ abilitiesLicense.replace(' — Conquest Dark Wiki (conquestdark.wiki.gg)', '') }}).
          Fetched {{ abilitiesFetchedAt.slice(0, 10) }}.
        </p>
      </main>
    </div>
  </div>
</template>
