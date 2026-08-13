<script setup lang="ts">
import { ChevronRight, TrendingUp } from '@lucide/vue'
import { WEEKLY_FEED_USAGE } from '~/domain/farm.constants'
</script>

<template>
  <div class="panel">
    <div class="panel-head"><div><h3 class="panel-title">Konsumsi pakan 7 hari</h3><p class="panel-subtitle">Gabungan Kandang Timur dan Barat</p></div><NuxtLink to="/pakan" class="text-button">Kelola pakan <ChevronRight :size="15" /></NuxtLink></div>
    <div class="p-5">
      <div class="flex items-end gap-2 sm:gap-4"><div v-for="(item, index) in WEEKLY_FEED_USAGE" :key="item.day" class="flex flex-1 flex-col items-center gap-2"><span class="text-[10px] font-semibold text-[#7b867e]">{{ item.value }} t</span><div class="flex h-28 w-full items-end justify-center rounded-xl bg-[#f4f6f2] px-1.5 pt-2"><div class="w-full max-w-10 rounded-t-lg" :class="index === WEEKLY_FEED_USAGE.length - 1 ? 'bg-[#193425]' : 'bg-[#9fca7a]'" :style="{ height: `${(item.value / 6.5) * 100}%` }" /></div><span class="text-[10px] text-[#8b948d]">{{ item.day }}</span></div></div>
      <div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e9ede8] pt-4 text-[11px] text-[#7b867f]"><span>Rata-rata harian <strong class="text-[#263d30]">5,60 ton</strong></span><span class="flex items-center gap-1.5 text-[#39754b]"><TrendingUp :size="13" /> +6,8% minggu ini</span></div>
    </div>
  </div>
</template>
