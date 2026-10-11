import { createRouter, createWebHistory } from 'vue-router'
import AbilitiesView from '../views/AbilitiesView.vue'
import RunesView from '../views/RunesView.vue'
import RunewordsView from '../views/RunewordsView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'runewords', component: RunewordsView },
    { path: '/runes', name: 'runes', component: RunesView },
    { path: '/abilities', name: 'abilities', component: AbilitiesView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
