<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { familyOf, runeDetail, runeUsageCount } from '../dataAccess'
import { displayText, familyTextClass } from '../display'
import type { Runeword } from '../types'
import RuneChip from './RuneChip.vue'
import TagBadge from './TagBadge.vue'

defineProps<{ runeword: Runeword }>()
defineEmits<{ runeClick: [rune: string]; tagClick: [tag: string] }>()

const chipBase =
  'cursor-pointer rounded transition hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400'

const cardRef = ref<HTMLElement | null>(null)
const popRef = ref<HTMLElement | null>(null)
const showPop = ref(false)
const positioned = ref(false)
const popStyle = ref<Record<string, string>>({ top: '0px', left: '0px' })

let hideTimer: ReturnType<typeof setTimeout> | undefined
let rafId: number | undefined
let viewportListenersAdded = false

function effectOf(rune: string): string {
  const detail = runeDetail(rune)
  return detail ? displayText(detail.effectPerLevel) : ''
}

function levelOf(rune: string): string {
  const detail = runeDetail(rune)
  return detail ? `Lv ${detail.maxLevel}` : ''
}

function position(): void {
  const card = cardRef.value
  const pop = popRef.value
  if (!card || !pop) return
  const r = card.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 12
  const edge = 8
  const pw = pop.offsetWidth
  const ph = pop.offsetHeight

  let left = r.right + gap
  if (left + pw > vw - edge) left = r.left - pw - gap
  left = Math.min(Math.max(left, edge), Math.max(edge, vw - pw - edge))

  let top = r.top
  if (top + ph > vh - edge) top = r.bottom - ph
  top = Math.min(Math.max(top, edge), Math.max(edge, vh - ph - edge))

  popStyle.value = { top: `${Math.round(top)}px`, left: `${Math.round(left)}px` }

  if (r.bottom < 0 || r.top > vh) hideNow()
}

function onViewportChange(): void {
  if (rafId !== undefined) return
  rafId = requestAnimationFrame(() => {
    rafId = undefined
    if (showPop.value) position()
  })
}

function addViewportListeners(): void {
  if (viewportListenersAdded) return
  viewportListenersAdded = true
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
}

function removeViewportListeners(): void {
  if (!viewportListenersAdded) return
  viewportListenersAdded = false
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
}

function onDocumentPointerDown(e: PointerEvent): void {
  const t = e.target as Node | null
  if (t && (popRef.value?.contains(t) || cardRef.value?.contains(t))) return
  hideNow()
}

function cancelHide(): void {
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

async function open(): Promise<void> {
  cancelHide()
  if (!showPop.value) {
    positioned.value = false
    showPop.value = true
    const r = cardRef.value?.getBoundingClientRect()
    if (r) {
      popStyle.value = {
        top: `${Math.round(r.top)}px`,
        left: `${Math.round(Math.min(r.right + 12, window.innerWidth - 8))}px`,
      }
    }
    addViewportListeners()
  }
  await nextTick()
  position()
  positioned.value = true
}

function hide(delay = 140): void {
  cancelHide()
  hideTimer = setTimeout(hideNow, delay)
}

function hideNow(): void {
  cancelHide()
  if (!showPop.value) return
  showPop.value = false
  positioned.value = false
  removeViewportListeners()
  if (rafId !== undefined) {
    cancelAnimationFrame(rafId)
    rafId = undefined
  }
}

onBeforeUnmount(() => {
  cancelHide()
  removeViewportListeners()
  if (rafId !== undefined) cancelAnimationFrame(rafId)
})
</script>

<template>
  <article
    ref="cardRef"
    class="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
    @mouseenter="open"
    @mouseleave="hide()"
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

  <Teleport to="body">
    <div
      v-if="showPop"
      ref="popRef"
      class="fixed z-50 w-80 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-2xl shadow-black/50"
      :class="positioned ? '' : 'invisible'"
      :style="popStyle"
      @mouseenter="cancelHide"
      @mouseleave="hide(0)"
    >
      <div
        class="mb-2.5 flex items-center justify-between gap-2 border-b border-zinc-800 pb-2"
      >
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Rune details
        </span>
        <span class="text-[10px] text-zinc-600">{{ runeword.runes.length }} runes</span>
      </div>
      <ul class="flex flex-col gap-2.5">
        <li v-for="r in runeword.runes" :key="r" class="flex flex-col gap-1">
          <div class="flex items-center gap-1.5">
            <RuneChip :rune="r" />
            <span
              class="text-[10px] font-semibold uppercase tracking-wider"
              :class="familyTextClass[familyOf(r)] ?? 'text-zinc-500'"
            >
              {{ familyOf(r) }}
            </span>
            <span class="ml-auto flex shrink-0 items-center gap-1 text-[10px] text-zinc-600">
              <span
                v-if="levelOf(r)"
                class="rounded bg-zinc-800 px-1 py-0.5 font-semibold text-zinc-500 ring-1 ring-inset ring-zinc-700"
              >
                {{ levelOf(r) }}
              </span>
              {{ runeUsageCount(r) }} words
            </span>
          </div>
          <p v-if="effectOf(r)" class="text-[11px] leading-snug text-zinc-400">
            {{ effectOf(r) }}
          </p>
          <p v-else class="text-[11px] italic leading-snug text-zinc-600">
            No level data yet
          </p>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
