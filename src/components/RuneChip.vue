<script setup lang="ts">
import { computed } from 'vue'
import { familyOf, runeDetail } from '../dataAccess'
import { displayText, familyColorClass } from '../display'

const props = defineProps<{ rune: string; clickable?: boolean }>()
defineEmits<{ click: [] }>()

const classes = computed(
  () =>
    `inline-flex items-center rounded px-2 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${familyColorClass[familyOf(props.rune)] ?? 'bg-zinc-800 text-zinc-300 ring-zinc-700'}`,
)

const tooltip = computed(() => {
  const family = familyOf(props.rune)
  const detail = runeDetail(props.rune)
  const lines = props.clickable ? [`Filter by ${props.rune}`] : []
  lines.push(family)
  if (detail) lines.push(displayText(detail.effectPerLevel), `Max level: ${detail.maxLevel}`)
  return lines.join('\n')
})
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    :class="[classes, 'cursor-pointer transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400']"
    :title="tooltip"
    @click="$emit('click')"
  >
    {{ rune }}
  </button>
  <span v-else :class="classes" :title="tooltip">{{ rune }}</span>
</template>
