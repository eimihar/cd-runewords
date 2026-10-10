<script setup lang="ts">
import { computed } from 'vue'
import { familyOf } from '../dataAccess'
import { familyColorClass } from '../display'

const props = defineProps<{ rune: string; clickable?: boolean }>()
defineEmits<{ click: [] }>()

const classes = computed(
  () =>
    `inline-flex items-center rounded px-2 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${familyColorClass[familyOf(props.rune)] ?? 'bg-zinc-800 text-zinc-300 ring-zinc-700'}`,
)
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    :class="[classes, 'cursor-pointer transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400']"
    :title="`Filter by ${rune}`"
    @click="$emit('click')"
  >
    {{ rune }}
  </button>
  <span v-else :class="classes" :title="familyOf(rune)">{{ rune }}</span>
</template>
