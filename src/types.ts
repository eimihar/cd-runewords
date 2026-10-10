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
