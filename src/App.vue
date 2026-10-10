<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <header
      class="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur"
    >
      <div class="mx-auto flex h-14 w-full max-w-7xl items-center gap-5 px-4 lg:px-6">
        <RouterLink
          to="/"
          class="flex items-baseline gap-2 font-semibold text-amber-400 transition hover:text-amber-300"
        >
          <span class="text-base tracking-tight">Conquest Dark</span>
          <span class="text-sm font-normal text-zinc-500">Runewords</span>
        </RouterLink>
        <nav class="ml-auto flex gap-1 text-sm">
          <RouterLink
            to="/"
            class="rounded-md px-3 py-1.5 text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-100 [&.router-link-exact-active]:bg-zinc-800 [&.router-link-exact-active]:font-semibold [&.router-link-exact-active]:text-amber-400"
          >
            Runewords
          </RouterLink>
          <RouterLink
            to="/runes"
            class="rounded-md px-3 py-1.5 text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-100 [&.router-link-exact-active]:bg-zinc-800 [&.router-link-exact-active]:font-semibold [&.router-link-exact-active]:text-amber-400"
          >
            Runes
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t border-zinc-900 py-4">
      <p class="mx-auto max-w-7xl px-4 text-xs text-zinc-700 lg:px-6">
        Fan-made browser for Conquest Dark runewords. Data from docs/*.csv.
      </p>
    </footer>
  </div>
</template>
