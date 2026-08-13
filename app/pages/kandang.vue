<script setup lang="ts">
import { Bird, Check, Droplets, House, Thermometer, Wheat, Wind } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useFarmStore } from '~/stores/farm.store'
import { useUiStore } from '~/stores/ui.store'
import { formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Kandang' })
const farm = useFarmStore()
const ui = useUiStore()
const { coops, checklist } = storeToRefs(farm)

function toggleChecklist(itemId: string) {
  const result = farm.toggleChecklist(itemId)
  ui.notify(result.ok ? 'Checklist diperbarui' : result.message)
}
</script>

<template>
  <SharedModuleHeading title="Kandang" description="Pantau kapasitas, kondisi lingkungan, peralatan, dan checklist dua kandang." activity-type="Inspeksi kandang" />
  <section class="grid gap-5 xl:grid-cols-2">
    <article v-for="coop in coops" :key="coop.id" class="panel p-5 sm:p-6">
      <div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><div class="flex size-11 items-center justify-center rounded-xl bg-[#e4f1dc] text-[#49783d]"><House :size="21" /></div><div><h3 class="text-base font-bold">{{ coop.name }}</h3><p class="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#929b94]">{{ coop.id }} • Closed house</p></div></div><span class="status-pill">{{ coop.status }}</span></div>
      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="status-tile"><Thermometer :size="16" /><p>Suhu</p><strong>{{ formatNumber(coop.temperature, 1) }}°C</strong><small>Target 26–29°C</small></div>
        <div class="status-tile"><Droplets :size="16" /><p>Kelembapan</p><strong>{{ coop.humidity }}%</strong><small>Target 60–70%</small></div>
        <div class="status-tile"><Bird :size="16" /><p>Populasi</p><strong>{{ formatNumber(coop.population) }}</strong><small>{{ formatNumber((coop.population / coop.capacity) * 100, 1) }}% terisi</small></div>
        <div class="status-tile"><Wheat :size="16" /><p>Pakan hari ini</p><strong>{{ formatNumber(coop.feedToday / 1000, 2) }} t</strong><small>Sesuai target</small></div>
      </div>
      <div class="mt-5 rounded-xl bg-[#f6f8f5] p-4"><div class="mb-3 flex items-center justify-between text-xs"><span class="font-semibold">Peralatan aktif</span><span class="text-[#438152]">Semua normal</span></div><div class="grid gap-2 text-[10.5px] text-[#717d74] sm:grid-cols-3"><span class="flex items-center gap-1.5"><Wind :size="13" /> 8 Exhaust fan</span><span class="flex items-center gap-1.5"><Droplets :size="13" /> Cooling pad</span><span class="flex items-center gap-1.5"><Check :size="13" /> 12 Jalur minum</span></div></div>
    </article>
  </section>
  <section class="panel mt-5"><div class="panel-head"><div><h3 class="panel-title">Checklist kandang hari ini</h3><p class="panel-subtitle">Pemeriksaan rutin oleh operator</p></div><span class="text-xs font-semibold text-[#438152]">{{ farm.completedChecklist }} dari {{ checklist.length }} selesai</span></div><div class="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3"><button v-for="item in checklist" :key="item.id" class="flex items-center gap-3 rounded-xl border border-[#e2e7e1] p-3 text-left text-xs transition hover:bg-[#f7f9f6]" @click="toggleChecklist(item.id)"><span class="flex size-5 items-center justify-center rounded-full" :class="item.done ? 'bg-[#dff0d8] text-[#3f7544]' : 'border border-[#cbd3cc]'"><Check v-if="item.done" :size="12" /></span>{{ item.label }}<span class="ml-auto text-[10px] text-[#9aa29c]">{{ item.done ? 'Selesai' : 'Belum' }}</span></button></div></section>
</template>
