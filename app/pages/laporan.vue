<script setup lang="ts">
import { Bird, Download, FileSpreadsheet, HeartPulse, Wheat } from '@lucide/vue'
import { useReportExport } from '~/composables/useReportExport'
import { useFarmStore } from '~/stores/farm.store'
import { useUiStore } from '~/stores/ui.store'
import { formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Laporan' })
const farm = useFarmStore()
const ui = useUiStore()
const { exportReport } = useReportExport()
const period = reactive({ start: '2026-08-01', end: '2026-08-14' })

function resetDemo() {
  farm.resetDemo()
  ui.notify('Data demo dikembalikan')
}
</script>

<template>
  <SharedModuleHeading title="Laporan" description="Unduh rekap operasional sesuai periode yang dibutuhkan." hide-action />
  <section class="panel p-5 sm:p-6"><div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h3 class="text-base font-bold">Periode laporan</h3><p class="mt-1 text-xs text-[#7d8780]">Pilih rentang data untuk rekap operasional.</p></div><div class="grid gap-3 sm:grid-cols-[170px_170px_auto]"><label class="field-label">Dari tanggal<input v-model="period.start" type="date" class="field-input" /></label><label class="field-label">Sampai tanggal<input v-model="period.end" type="date" class="field-input" /></label><button class="primary-button self-end" @click="exportReport('operasional', period)"><Download :size="16" /> Unduh rekap</button></div></div></section>
  <section class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <button class="report-card" @click="exportReport('operasional', period)"><div class="report-icon bg-[#e7f2df] text-[#49783d]"><FileSpreadsheet :size="20" /></div><div><p>Rekap operasional</p><span>Ringkasan KPI dua kandang</span></div><Download class="ml-auto" :size="17" /></button>
    <button class="report-card" @click="exportReport('populasi', period)"><div class="report-icon bg-[#e5eef8] text-[#37658d]"><Bird :size="20" /></div><div><p>Populasi & mortalitas</p><span>Rekonsiliasi harian</span></div><Download class="ml-auto" :size="17" /></button>
    <button class="report-card" @click="exportReport('pakan', period)"><div class="report-icon bg-[#f8ead0] text-[#90651b]"><Wheat :size="20" /></div><div><p>Persediaan pakan</p><span>Mutasi masuk dan keluar</span></div><Download class="ml-auto" :size="17" /></button>
    <button class="report-card" @click="exportReport('kesehatan', period)"><div class="report-icon bg-[#ede9f6] text-[#685198]"><HeartPulse :size="20" /></div><div><p>Kesehatan</p><span>Program dan observasi</span></div><Download class="ml-auto" :size="17" /></button>
  </section>
  <section class="panel mt-5"><div class="panel-head"><div><h3 class="panel-title">Ringkasan periode berjalan</h3><p class="panel-subtitle">Indikator yang akan masuk ke rekap</p></div></div><div class="grid gap-px bg-[#e7ebe6] sm:grid-cols-2 xl:grid-cols-4"><div class="bg-white p-5"><p class="eyebrow">Populasi aktif</p><p class="mt-2 text-xl font-bold">{{ formatNumber(farm.metrics.totalPopulation) }} ekor</p></div><div class="bg-white p-5"><p class="eyebrow">Mortalitas kumulatif</p><p class="mt-2 text-xl font-bold">{{ formatNumber(farm.metrics.mortalityRate, 3) }}%</p></div><div class="bg-white p-5"><p class="eyebrow">Pakan tersedia</p><p class="mt-2 text-xl font-bold">{{ formatNumber(farm.metrics.totalFeedStock / 1000, 1) }} ton</p></div><div class="bg-white p-5"><p class="eyebrow">FCR sementara</p><p class="mt-2 text-xl font-bold">{{ formatNumber(farm.metrics.fcr, 2) }}</p></div></div></section>
  <button class="mt-5 text-[10px] text-[#98a099] underline decoration-dotted underline-offset-4" @click="resetDemo">Kembalikan data contoh</button>
</template>
