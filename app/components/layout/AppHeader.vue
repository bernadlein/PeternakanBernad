<script setup lang="ts">
import { AlertTriangle, Bell, ClipboardPlus, Menu, X } from '@lucide/vue'
import { CYCLE_DAY } from '~/domain/farm.constants'
import { useFarmStore } from '~/stores/farm.store'
import { useUiStore } from '~/stores/ui.store'
import { formatNumber } from '~/utils/formatters'

const route = useRoute()
const farm = useFarmStore()
const ui = useUiStore()
const title = computed(() => String(route.meta.title ?? 'Ringkasan Peternakan'))
</script>

<template>
  <header class="sticky top-0 z-20 flex h-20 items-center border-b border-[#dfe4de] bg-[#f4f6f3]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
    <button class="mr-3 rounded-lg p-2 hover:bg-black/5 lg:hidden" aria-label="Buka menu" @click="ui.mobileNavOpen = true"><Menu :size="21" /></button>
    <div><h1 class="text-lg font-bold tracking-[-0.03em] sm:text-xl">{{ title }}</h1><p class="hidden text-xs text-[#78827a] sm:block">Jumat, 14 Agustus 2026 • Siklus hari ke-{{ CYCLE_DAY }}</p></div>
    <div class="ml-auto flex items-center gap-2.5">
      <button class="relative flex size-10 items-center justify-center rounded-xl border border-[#dce2dc] bg-white transition hover:border-[#aebbb0]" aria-label="Notifikasi" @click="ui.notificationsOpen = !ui.notificationsOpen"><Bell :size="18" /><span class="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#df5a4e]" /></button>
      <button class="hidden items-center gap-2 rounded-xl bg-[#193425] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#26503a] sm:flex" @click="ui.openActivity()"><ClipboardPlus :size="17" /> Catat aktivitas</button>
    </div>
  </header>

  <div v-if="ui.notificationsOpen" class="fixed right-4 top-[72px] z-30 w-[calc(100%-2rem)] max-w-[350px] rounded-2xl border border-[#dce2dc] bg-white p-4 shadow-2xl sm:right-8">
    <div class="mb-3 flex items-center justify-between"><p class="text-sm font-bold">Notifikasi</p><button aria-label="Tutup" @click="ui.notificationsOpen = false"><X :size="17" /></button></div>
    <div class="rounded-xl bg-[#fff6e6] p-3"><div class="flex gap-3"><AlertTriangle :size="17" class="mt-0.5 shrink-0 text-[#a96c10]" /><div><p class="text-xs font-semibold">Stok BR-2 segera dipesan</p><p class="mt-1 text-[11px] leading-5 text-[#7c6c50]">Persediaan tersisa sekitar {{ formatNumber(farm.metrics.feedRunway, 1) }} hari. Rekomendasi pemesanan: 30 ton.</p></div></div></div>
  </div>
</template>
