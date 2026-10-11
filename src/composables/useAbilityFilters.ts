import { computed, ref, type Ref } from 'vue'
import { abilities } from '../dataAccess'
import { displayText } from '../display'
import type { AbilityType } from '../types'

const search = ref('')
const selectedTypes = ref<AbilityType[]>([])
const selectedTargetings = ref<string[]>([])
const selectedDamageTypes = ref<string[]>([])
const selectedRequirements = ref<string[]>([])

const haystack = abilities.map((a) => {
  const parts = [
    a.name,
    a.damage,
    a.targeting,
    a.offhand,
    ...a.description,
    ...a.innateBonus,
    ...a.offhandBonus,
    ...a.requirements,
  ]
  return (parts.join(' ') + ' ' + parts.map(displayText).join(' ')).toLowerCase()
})

const filteredAbilities = computed(() => {
  const q = search.value.trim().toLowerCase()
  const types = selectedTypes.value
  const targetings = selectedTargetings.value
  const damageTypes = selectedDamageTypes.value
  const requirements = selectedRequirements.value

  return abilities.filter((a, i) => {
    if (q && !haystack[i].includes(q)) return false
    if (types.length > 0 && !types.includes(a.type)) return false
    if (targetings.length > 0 && !targetings.includes(a.targeting)) return false
    if (damageTypes.length > 0 && !damageTypes.some((d) => a.damageTypes.includes(d))) return false
    if (requirements.length > 0 && !requirements.some((r) => a.requirements.includes(r))) return false
    return true
  })
})

function toggle<T>(arr: Ref<T[]>, value: T): void {
  const i = arr.value.indexOf(value)
  if (i === -1) arr.value.push(value)
  else arr.value.splice(i, 1)
}

function toggleType(type: AbilityType): void {
  toggle(selectedTypes, type)
}

function toggleTargeting(targeting: string): void {
  toggle(selectedTargetings, targeting)
}

function toggleDamageType(damageType: string): void {
  toggle(selectedDamageTypes, damageType)
}

function toggleRequirement(requirement: string): void {
  toggle(selectedRequirements, requirement)
}

function clearAll(): void {
  search.value = ''
  selectedTypes.value = []
  selectedTargetings.value = []
  selectedDamageTypes.value = []
  selectedRequirements.value = []
}

const activeFilterCount = computed(() => {
  let n = 0
  if (search.value.trim()) n++
  if (selectedTypes.value.length) n++
  if (selectedTargetings.value.length) n++
  if (selectedDamageTypes.value.length) n++
  if (selectedRequirements.value.length) n++
  return n
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0)

export function useAbilityFilters() {
  return {
    search,
    selectedTypes,
    selectedTargetings,
    selectedDamageTypes,
    selectedRequirements,
    filteredAbilities,
    activeFilterCount,
    hasActiveFilters,
    toggleType,
    toggleTargeting,
    toggleDamageType,
    toggleRequirement,
    clearAll,
  }
}
