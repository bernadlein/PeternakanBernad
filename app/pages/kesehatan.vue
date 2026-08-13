<script setup lang="ts">
import { AlertTriangle, Download, ShieldCheck, Syringe } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { DAILY_MORTALITY_LIMIT } from '~/domain/farm.constants'
import { useReportExport } from '~/composables/useReportExport'
import { useFarmStore } from '~/stores/farm.store'
import { formatDate, formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Kesehatan' })
const farm = useFarmStore()
const { healthRecords } = storeToRefs(farm)
const { exportReport } = useReportExport()
const period = { start: '2026-08-01', end: '2026-08-14' }
const dailyMortalityRate = computed(() => farm.metrics.totalPopulation ? (farm.metrics.todayMortality / farm.metrics.totalPopulation) * 100 : 0)
</script>

<template>
  <SharedModuleHeading title="Kesehatan" description="Kelola jadwal vaksin, vitamin, pengobatan, dan observasi kesehatan." activity-type="Obat & vitamin" />
  <section class="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
    <article class="metric-card"><div class="metric-icon bg-[#e5f2df] text-[#41734a]"><ShieldCheck :size="20" /></div><p class="metric-label mt-5">Status flock</p><p class="mt-1 text-xl font-bold">Sehat & aktif</p><p class="metric-foot">Tidak ada gejala khusus</p></article>
    <article class="metric-card"><div class="metric-icon bg-[#e5eef8] text-[#37658d]"><Syringe :size="20" /></div><p class="metric-label mt-5">Program berikutnya</p><p class="mt-1 text-xl font-bold">Vitamin lanjutan</p><p class="metric-foot">15 Agustus • 07:00 WIB</p></article>
    <article class="metric-card"><div class="flex items-start gap-3"><AlertTriangle :size="20" class="mt-0.5 text-[#a46c17]" /><div><p class="text-sm font-bold">Batas kendali mortalitas</p><p class="mt-1 text-xs leading-5 text-[#7e877f]">Hari ini {{ formatNumber(dailyMortalityRate, 3) }}%. Masih di bawah batas internal {{ formatNumber(DAILY_MORTALITY_LIMIT, 2) }}% per hari.</p></div></div></article>
  </section>
  <section class="panel mt-5"><div class="panel-head"><div><h3 class="panel-title">Program kesehatan & observasi</h3><p class="panel-subtitle">Vaksin, vitamin, pengobatan, dan temuan lapangan</p></div><button class="text-button" @click="exportReport('kesehatan', period)"><Download :size="15" /> CSV</button></div><div class="overflow-x-auto"><table class="data-table"><thead><tr><th>Tanggal</th><th>Kandang</th><th>Jenis</th><th>Produk/kegiatan</th><th>Status</th><th>Catatan</th></tr></thead><tbody><tr v-for="row in healthRecords" :key="row.id"><td>{{ formatDate(row.date) }}</td><td>{{ farm.locationName(row.coopId) }}</td><td><strong>{{ row.type }}</strong></td><td>{{ row.product }}</td><td><span class="rounded-full px-2 py-1 text-[9px] font-bold" :class="row.status === 'Selesai' ? 'bg-[#e4f2df] text-[#397449]' : 'bg-[#e5eef8] text-[#37658d]'">{{ row.status }}</span></td><td>{{ row.note }}</td></tr></tbody></table></div></section>
</template>
