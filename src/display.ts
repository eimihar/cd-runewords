// Display-only corrections. Raw CSV data stays untouched.

const TAG_FIXES: Record<string, string> = {
  Ofensive: 'Offensive',
}

const TEXT_FIXES: Array<[RegExp, string]> = [
  [/\bDamge\b/g, 'Damage'],
  [/\bChacne\b/g, 'Chance'],
  [/\bInjuried\b/g, 'Injured'],
  [/Chance Chance/g, 'Chance'],
]

export function displayTag(tag: string): string {
  return TAG_FIXES[tag] ?? tag
}

export function displayText(text: string): string {
  return TEXT_FIXES.reduce((out, [re, rep]) => out.replace(re, rep), text)
}

export const familyColorClass: Record<string, string> = {
  'Primordial Runes': 'bg-orange-500/15 text-orange-300 ring-orange-500/40',
  'Sun Runes': 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
  'Moon Runes': 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
  'Abyss Runes': 'bg-teal-500/15 text-teal-300 ring-teal-500/40',
  'Elritch Runes': 'bg-violet-500/15 text-violet-300 ring-violet-500/40',
}

export const familyTextClass: Record<string, string> = {
  'Primordial Runes': 'text-orange-400',
  'Sun Runes': 'text-amber-300',
  'Moon Runes': 'text-sky-400',
  'Abyss Runes': 'text-teal-400',
  'Elritch Runes': 'text-violet-400',
}

export const tagColorClass: Record<string, string> = {
  'Damage Types': 'bg-rose-500/15 text-rose-300 ring-rose-500/40',
  Conditions: 'bg-orange-500/15 text-orange-300 ring-orange-500/40',
  Abilities: 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
  Role: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40',
  Misc: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/40',
  'Number of Runes': 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
}
