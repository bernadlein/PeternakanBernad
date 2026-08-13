<script setup lang="ts">
import { House } from '@lucide/vue'
import type { Coop } from '~/domain/farm.types'
import { formatNumber } from '~/utils/formatters'

defineProps<{ coop: Coop }>()
</script>

<template>
  <article class="rounded-2xl border border-[#e1e6e0] bg-[#fafbf9] p-4 transition hover:border-[#b8c4ba] hover:bg-white">
    <div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="flex size-10 items-center justify-center rounded-xl bg-[#e5f5c8] text-[#4d7629]"><House :size="19" /></div><div><p class="text-sm font-bold">{{ coop.name }}</p><p class="text-[10px] font-semibold uppercase tracking-wider text-[#8a948c]">{{ coop.id }}</p></div></div><span class="status-pill">{{ coop.status }}</span></div>
    <div class="mt-5 flex items-end justify-between"><div><p class="eyebrow">Populasi</p><p class="mt-1 text-2xl font-bold tracking-[-0.04em]">{{ formatNumber(coop.population) }}</p></div><p class="pb-1 text-[11px] text-[#7e8880]">dari {{ formatNumber(coop.capacity) }}</p></div>
    <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e6eae5]"><div class="h-full rounded-full bg-[#69a854]" :style="{ width: `${(coop.population / coop.capacity) * 100}%` }" /></div>
    <div class="mt-4 grid grid-cols-3 gap-2 border-t border-[#e5e9e4] pt-4"><div><p class="coop-label">Umur</p><p class="coop-value">{{ coop.age }} hari</p></div><div><p class="coop-label">Bobot</p><p class="coop-value">{{ formatNumber(coop.weight, 2) }} kg</p></div><div><p class="coop-label">Mortalitas</p><p class="coop-value">{{ formatNumber(((coop.capacity - coop.population) / coop.capacity) * 100, 2) }}%</p></div></div>
  </article>
</template>
