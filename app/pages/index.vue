<script setup lang="ts">
import { AlertTriangle, Bird, Boxes, ChevronRight, Scale, Syringe, TrendingDown, TrendingUp, Wheat } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useFarmStore } from '~/stores/farm.store'
import { formatNumber } from '~/utils/formatters'

definePageMeta({ title: 'Ringkasan Peternakan' })
const farm = useFarmStore()
const { coops, activities } = storeToRefs(farm)
</script>

<template>
  <section class="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div><span class="inline-flex items-center gap-1.5 rounded-full bg-[#dff1dc] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#286338]"><span class="size-1.5 rounded-full bg-[#44a65a]" /> Semua kandang normal</span><h2 class="mt-2 text-2xl font-semibold tracking-[-0.045em] sm:text-[30px]">Selamat pagi, Bernad.</h2><p class="mt-1 text-sm text-[#737e76]">Berikut kondisi terakhir peternakan Anda hari ini.</p></div>
    <div class="flex items-center gap-2 text-xs text-[#68736b]"><span class="size-2 rounded-full bg-[#44a65a]" /> Data diperbarui 08:15 WIB</div>
  </section>

  <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <DashboardMetricCard label="Populasi aktif" :value="formatNumber(farm.metrics.totalPopulation)" unit="ekor"><template #icon><div class="metric-icon bg-[#e9f3db] text-[#437022]"><Bird :size="20" /></div></template><TrendingDown :size="13" class="text-[#d96357]" /><span class="text-[#d35b50]">{{ formatNumber(farm.metrics.todayMortality) }} ekor</span> hari ini</DashboardMetricCard>
    <DashboardMetricCard label="Bobot rata-rata" :value="formatNumber(farm.metrics.averageWeight, 2)" unit="kg"><template #icon><div class="metric-icon bg-[#e5eef8] text-[#37658d]"><Scale :size="20" /></div></template><TrendingUp :size="13" class="text-[#3d8c52]" /><span class="text-[#3d8c52]">+58 gr</span> dari kemarin</DashboardMetricCard>
    <DashboardMetricCard label="Stok pakan" :value="formatNumber(farm.metrics.totalFeedStock / 1000, 1)" unit="ton" variant="warning"><template #icon><div class="metric-icon bg-[#f8ead0] text-[#90651b]"><Wheat :size="20" /></div></template><span class="font-semibold text-[#a66a0f]">± {{ formatNumber(farm.metrics.feedRunway, 1) }} hari</span> persediaan</DashboardMetricCard>
    <DashboardMetricCard label="FCR sementara" :value="formatNumber(farm.metrics.fcr, 2)" unit="rasio"><template #icon><div class="metric-icon bg-[#ede9f6] text-[#685198]"><Boxes :size="20" /></div></template><TrendingUp :size="13" class="text-[#3d8c52]" /><span class="text-[#3d8c52]">0,04 lebih baik</span> dari target</DashboardMetricCard>
  </section>

  <section class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.7fr)]">
    <div class="panel"><div class="panel-head"><div><h3 class="panel-title">Performa kandang</h3><p class="panel-subtitle">Populasi dan indikator utama per kandang</p></div><NuxtLink to="/kandang" class="text-button">Lihat detail <ChevronRight :size="15" /></NuxtLink></div><div class="grid gap-3 p-4 sm:p-5 md:grid-cols-2"><DashboardCoopSummaryCard v-for="coop in coops" :key="coop.id" :coop="coop" /></div></div>
    <DashboardActivityList :records="activities" />
  </section>

  <section class="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.75fr)]">
    <DashboardFeedChart />
    <div class="panel"><div class="panel-head"><div><h3 class="panel-title">Perlu perhatian</h3><p class="panel-subtitle">Prioritas operasional berikutnya</p></div><span class="flex size-7 items-center justify-center rounded-full bg-[#fff0d7] text-[11px] font-bold text-[#a66a0f]">3</span></div><div class="space-y-3 p-5">
      <div class="rounded-xl border border-[#efd9ae] bg-[#fffaf0] p-3.5"><div class="flex gap-3"><Wheat :size="17" class="mt-0.5 shrink-0 text-[#9f6d1b]" /><div><p class="text-xs font-semibold">Pesan pakan BR-2</p><p class="mt-1 text-[10.5px] leading-5 text-[#7d7464]">Stok berada di bawah batas minimum 30 ton.</p></div><span class="ml-auto text-[9px] font-bold uppercase text-[#a36c12]">Urgent</span></div></div>
      <div class="rounded-xl border border-[#e1e6e0] p-3.5"><div class="flex gap-3"><Syringe :size="17" class="mt-0.5 shrink-0 text-[#5a7190]" /><div><p class="text-xs font-semibold">Vitamin lanjutan</p><p class="mt-1 text-[10.5px] leading-5 text-[#7d867f]">Kedua kandang • Sabtu, 07:00 WIB</p></div></div></div>
      <div class="rounded-xl border border-[#e1e6e0] p-3.5"><div class="flex gap-3"><AlertTriangle :size="17" class="mt-0.5 shrink-0 text-[#5a7190]" /><div><p class="text-xs font-semibold">Timbang sampel mingguan</p><p class="mt-1 text-[10.5px] leading-5 text-[#7d867f]">Target minimum 100 ekor per kandang.</p></div></div></div>
    </div></div>
  </section>
</template>
