<script setup lang="ts">
import { Bird, CircleGauge, HeartPulse, House, Settings, UserRound, Wheat, ClipboardList } from '@lucide/vue'
import { ACTIVE_CYCLE, ESTIMATED_HARVEST_DAYS } from '~/domain/farm.constants'
import { useUiStore } from '~/stores/ui.store'

const route = useRoute()
const ui = useUiStore()
const navItems = [
  { label: 'Dashboard', to: '/', icon: CircleGauge },
  { label: 'Kandang', to: '/kandang', icon: House },
  { label: 'Populasi', to: '/populasi', icon: Bird },
  { label: 'Pakan & Stok', to: '/pakan', icon: Wheat, badge: '1' },
  { label: 'Kesehatan', to: '/kesehatan', icon: HeartPulse },
  { label: 'Laporan', to: '/laporan', icon: ClipboardList },
]
</script>

<template>
  <button v-if="ui.mobileNavOpen" class="fixed inset-0 z-30 bg-black/45 lg:hidden" aria-label="Tutup menu" @click="ui.mobileNavOpen = false" />
  <aside class="sidebar" :class="ui.mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
    <div class="flex h-20 items-center gap-3 border-b border-white/10 px-6">
      <div class="flex size-10 items-center justify-center rounded-xl bg-[#c9f36a] text-[#173425]"><Bird :size="22" :stroke-width="2.4" /></div>
      <div><p class="text-[19px] font-extrabold tracking-[-0.04em] text-white">FarmFlow</p><p class="text-[9px] font-bold uppercase tracking-[0.24em] text-white/40">Broiler OS</p></div>
      <button class="ml-auto text-white/60 lg:hidden" aria-label="Tutup menu" @click="ui.mobileNavOpen = false">×</button>
    </div>

    <div class="px-4 py-6">
      <p class="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Operasional</p>
      <nav class="space-y-1" aria-label="Navigasi utama">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="route.path === item.to ? 'nav-item-active' : ''"
          @click="ui.closeOverlays()"
        >
          <component :is="item.icon" :size="18" :stroke-width="route.path === item.to ? 2.5 : 1.8" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="ml-auto rounded-full bg-[#f2b84b] px-2 py-0.5 text-[9px] font-extrabold text-[#3f2a0a]">{{ item.badge }}</span>
        </NuxtLink>
      </nav>
    </div>

    <div class="mx-4 mt-auto rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <div class="mb-3 flex items-center justify-between"><span class="text-xs font-semibold text-white/80">Siklus {{ String(ACTIVE_CYCLE).padStart(2, '0') }}</span><span class="rounded-full bg-[#c9f36a]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#c9f36a]">Aktif</span></div>
      <p class="text-[11px] leading-5 text-white/40">Panen diperkirakan dalam</p><p class="text-xl font-bold text-white">{{ ESTIMATED_HARVEST_DAYS }} hari</p>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full w-[61%] rounded-full bg-[#c9f36a]" /></div>
    </div>

    <div class="flex items-center gap-3 p-5">
      <div class="flex size-9 items-center justify-center rounded-full bg-[#e8c69e] text-[#593816]"><UserRound :size="17" /></div>
      <div class="min-w-0"><p class="truncate text-xs font-semibold text-white">Budi Santoso</p><p class="text-[10px] text-white/40">Farm Manager</p></div>
      <Settings class="ml-auto text-white/30" :size="17" />
    </div>
  </aside>
</template>
