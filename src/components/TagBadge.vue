<script setup lang="ts">
import { computed } from 'vue'
import { tagGroupOf } from '../dataAccess'
import { displayTag, tagColorClass } from '../display'

const props = defineProps<{ tag: string }>()

const classes = computed(
  () =>
    `inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${tagColorClass[tagGroupOf(props.tag)] ?? tagColorClass['Misc']}`,
)
</script>

<template>
  <span :class="classes">{{ displayTag(tag) }}</span>
</template>
