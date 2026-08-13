<script setup lang="ts">
import { Download, Wheat } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useReportExport } from '~/composables/useReportExport'
import { isFeedBelowMinimum } from '~/services/farm.selectors'
import { useFarmStore } from '~/stores/farm.store'
import { formatDate, formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Pakan & Stok' })
const farm = useFarmStore()
const { feedStocks, feedMovements } = storeToRefs(farm)
const { exportReport } = useReportExport()
const period = { start: '2026-08-01', end: '2026-08-14' }
</script>

<template>
  <SharedModuleHeading title="Pakan & Stok" description="Kelola stok masuk, distribusi harian, dan estimasi kebutuhan pakan." activity-type="Pakan keluar" />
  <section class="grid gap-4 lg:grid-cols-2">
    <article v-for="feed in feedStocks" :key="feed.code" class="panel p-5 sm:p-6">
      <div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="flex size-11 items-center justify-center rounded-xl bg-[#f6ead1] text-[#95671c]"><Wheat :size="21" /></div><div><p class="text-base font-bold">{{ feed.code }} • {{ feed.name }}</p><p class="mt-0.5 text-[10px] uppercase tracking-wider text-[#929b94]">{{ feed.phase }}</p></div></div><span class="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase" :class="isFeedBelowMinimum(feed.stock, feed.minimum) ? 'bg-[#fff0d9] text-[#a3670e]' : 'bg-[#e4f2df] text-[#397449]'">{{ isFeedBelowMinimum(feed.stock, feed.minimum) ? 'Pesan ulang' : 'Aman' }}</span></div>
      <div class="mt-7 flex items-end justify-between"><div><p class="eyebrow">Stok tersedia</p><p class="mt-1 text-3xl font-bold tracking-[-0.05em]">{{ formatNumber(feed.stock / 1000, 1) }} <span class="text-sm font-medium text-[#7c867e]">ton</span></p></div><p class="text-right text-[10px] leading-5 text-[#89928b]">Minimum<br><strong class="text-[#425349]">{{ formatNumber(feed.minimum / 1000) }} ton</strong></p></div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-[#edf0ec]"><div class="h-full rounded-full" :class="isFeedBelowMinimum(feed.stock, feed.minimum) ? 'bg-[#e0a544]' : 'bg-[#73a960]'" :style="{ width: `${Math.min(100, (feed.stock / Math.max(feed.minimum, 1)) * 80)}%` }" /></div><p class="mt-4 text-[10.5px] text-[#89928b]">Pengiriman terakhir {{ feed.lastDelivery }}</p>
    </article>
  </section>
  <section class="panel mt-5"><div class="panel-head"><div><h3 class="panel-title">Mutasi persediaan pakan</h3><p class="panel-subtitle">Penerimaan dan distribusi per kandang</p></div><button class="text-button" @click="exportReport('pakan', period)"><Download :size="15" /> CSV</button></div><div class="overflow-x-auto"><table class="data-table"><thead><tr><th>Tanggal</th><th>Tipe</th><th>Pakan</th><th>Tujuan</th><th>Jumlah</th><th>Catatan</th></tr></thead><tbody><tr v-for="row in feedMovements" :key="row.id"><td>{{ formatDate(row.date) }}</td><td><span class="rounded-full px-2 py-1 text-[9px] font-bold" :class="row.type === 'Masuk' ? 'bg-[#e5eef8] text-[#37658d]' : 'bg-[#e7f2df] text-[#4b793a]'">{{ row.type }}</span></td><td><strong>{{ row.feedCode }}</strong></td><td>{{ farm.locationName(row.coopId) }}</td><td><strong>{{ formatNumber(row.amount) }} kg</strong></td><td>{{ row.note }}</td></tr></tbody></table></div></section>
</template>
