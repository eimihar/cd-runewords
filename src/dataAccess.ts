import categoriesData from './data/categories.json'
import runesData from './data/runes.json'
import runewordsData from './data/runewords.json'
import type { CategoryGroup, RuneFamily, Runeword } from './types'

export const families: RuneFamily[] = runesData.families
export const categories: CategoryGroup[] = categoriesData.categories
export const runewords: Runeword[] = runewordsData.runewords
export const totalRunewords = runewords.length
export const totalRunes = families.reduce((n, f) => n + f.runes.length, 0)

export const builds: string[] = [...new Set(runewords.map((r) => r.build).filter(Boolean))].sort()

const familyByRune = new Map<string, string>()
for (const fam of families) {
  for (const rune of fam.runes) familyByRune.set(rune, fam.name)
}

export function familyOf(rune: string): string {
  return familyByRune.get(rune) ?? ''
}

const groupByTag = new Map<string, string>()
for (const cat of categories) {
  for (const tag of cat.tags) groupByTag.set(tag, cat.group)
}

export function tagGroupOf(tag: string): string {
  return groupByTag.get(tag) ?? 'Misc'
}

const usageByRune = new Map<string, number>()
for (const rw of runewords) {
  for (const rune of rw.runes) usageByRune.set(rune, (usageByRune.get(rune) ?? 0) + 1)
}

export function runeUsageCount(rune: string): number {
  return usageByRune.get(rune) ?? 0
}
