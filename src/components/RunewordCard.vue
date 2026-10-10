<script setup lang="ts">
import { displayText } from '../display'
import type { Runeword } from '../types'
import RuneChip from './RuneChip.vue'
import TagBadge from './TagBadge.vue'

defineProps<{ runeword: Runeword }>()
defineEmits<{ runeClick: [rune: string]; tagClick: [tag: string] }>()

const chipBase =
  'cursor-pointer rounded transition hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400'
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <RuneChip
        v-for="r in runeword.runes"
        :key="r"
        :rune="r"
        clickable
        @click="$emit('runeClick', r)"
      />
      <span
        class="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400"
      >
        {{ runeword.runeCount }} runes
      </span>
    </div>

    <ul class="flex flex-col gap-1">
      <li
        v-for="(effect, i) in runeword.effects"
        :key="i"
        class="flex gap-2 text-sm leading-snug text-zinc-200"
      >
        <span aria-hidden="true" class="select-none text-amber-500/70">◆</span>
        <span>{{ displayText(effect) }}</span>
      </li>
    </ul>

    <div
      v-if="runeword.tags.length > 0 || runeword.rdHint || runeword.build"
      class="mt-auto flex flex-wrap items-center gap-1.5 border-t border-zinc-800 pt-3"
    >
      <button
        v-for="t in runeword.tags"
        :key="t"
        type="button"
        :class="chipBase"
        :title="`Filter by ${t}`"
        @click="$emit('tagClick', t)"
      >
        <TagBadge :tag="t" />
      </button>
      <div class="ml-auto flex items-center gap-1.5">
        <span
          v-if="runeword.rdHint"
          class="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[11px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/40"
          title="Runeword Discovery requirement"
        >
          RD {{ runeword.rdHint }}
        </span>
        <span
          v-if="runeword.build"
          class="rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-500/40"
        >
          {{ runeword.build }}
        </span>
      </div>
    </div>

    <p
      v-if="runeword.notes"
      class="whitespace-pre-line border-t border-zinc-800 pt-2 text-xs italic leading-relaxed text-zinc-500"
    >
      {{ displayText(runeword.notes) }}
    </p>
  </article>
</template>
