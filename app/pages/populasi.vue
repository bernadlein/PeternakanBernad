<script setup lang="ts">
import { Download } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useReportExport } from '~/composables/useReportExport'
import { useFarmStore } from '~/stores/farm.store'
import { formatDate, formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Populasi' })
const farm = useFarmStore()
const { populationRecords } = storeToRefs(farm)
const { exportReport } = useReportExport()
const period = { start: '2026-08-01', end: '2026-08-14' }
</script>

<template>
  <SharedModuleHeading title="Populasi" description="Rekonsiliasi DOC masuk, mortalitas, afkir, dan populasi aktif." activity-type="Mortalitas" />
  <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <article class="metric-card"><p class="metric-label">DOC masuk</p><p class="metric-value mt-3">{{ formatNumber(farm.metrics.totalCapacity) }}</p><p class="metric-foot">Kapasitas dua kandang</p></article>
    <article class="metric-card"><p class="metric-label">Populasi aktif</p><p class="metric-value mt-3">{{ formatNumber(farm.metrics.totalPopulation) }}</p><p class="metric-foot text-[#3d8c52]">{{ formatNumber(farm.metrics.survivalRate, 2) }}% survival rate</p></article>
    <article class="metric-card"><p class="metric-label">Mortalitas kumulatif</p><p class="metric-value mt-3">{{ formatNumber(farm.metrics.totalMortality) }}</p><p class="metric-foot text-[#d35b50]">{{ formatNumber(farm.metrics.mortalityRate, 3) }}% dari DOC masuk</p></article>
    <article class="metric-card"><p class="metric-label">Mortalitas hari ini</p><p class="metric-value mt-3">{{ formatNumber(farm.metrics.todayMortality) }}</p><p class="metric-foot">Batas kontrol harian 0,08%</p></article>
  </section>
  <section class="panel mt-5"><div class="panel-head"><div><h3 class="panel-title">Riwayat populasi & mortalitas</h3><p class="panel-subtitle">Rekonsiliasi populasi harian per kandang</p></div><button class="text-button" @click="exportReport('populasi', period)"><Download :size="15" /> CSV</button></div><div class="overflow-x-auto"><table class="data-table"><thead><tr><th>Tanggal</th><th>Kandang</th><th>Populasi awal</th><th>Mortalitas</th><th>Afkir</th><th>Populasi akhir</th><th>Catatan</th></tr></thead><tbody><tr v-for="row in populationRecords" :key="row.id"><td>{{ formatDate(row.date) }}</td><td><strong>{{ farm.locationName(row.coopId) }}</strong></td><td>{{ formatNumber(row.opening) }}</td><td class="text-[#c6574d]!">{{ formatNumber(row.mortality) }}</td><td>{{ formatNumber(row.culled) }}</td><td><strong>{{ formatNumber(row.closing) }}</strong></td><td>{{ row.note }}</td></tr></tbody></table></div></section>
</template>
