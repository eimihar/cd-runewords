export interface RuneFamily {
  name: string
  runes: string[]
}

export interface RuneDetail {
  effectPerLevel: string
  maxLevel: number
}

export interface CategoryGroup {
  group: string
  tags: string[]
}

export interface Runeword {
  id: string
  runes: string[]
  effects: string[]
  tags: string[]
  runeCount: number
  notes: string
  rdHint: string | null
  rdValue: number | null
  build: string
}

export type RdBucket = 'all' | 'none' | 'zero' | 'low' | 'mid' | 'high'
export type RuneMatchMode = 'all' | 'any'

export type AbilityType = 'primary' | 'power' | 'passive' | 'movement'

export interface Ability {
  id: string
  type: AbilityType
  name: string
  description: string[]
  damage: string
  targeting: string
  attacksPerSecond: number | null
  energyPerHit: number | null
  energyCost: number | null
  recharge: string
  innateBonus: string[]
  offhand: string
  offhandBonus: string[]
  requirements: string[]
  damageTypes: string[]
}
