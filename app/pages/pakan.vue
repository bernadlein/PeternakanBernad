<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  AlertTriangle, ArrowDownToLine, ArrowUpFromLine, ClipboardCheck,
  PackagePlus, Search, ShoppingCart, Truck, Warehouse,
} from '@lucide/vue'
import FeedTransactionModal from '~/modules/feed/components/FeedTransactionModal.vue'
import { useFeedLedgerFilters } from '~/modules/feed/composables/useFeedLedgerFilters'
import { COOPS, LEDGER_LABELS } from '~/modules/feed/domain/feed.constants'
import type { FeedTransactionMode } from '~/modules/feed/domain/feed.types'
import { getRemainingPurchaseOrderQuantity } from '~/modules/feed/services/feed.selectors'
import { useFeedStore } from '~/modules/feed/stores/feed.store'

definePageMeta({ title: 'Stok & Distribusi Pakan' })

const store = useFeedStore()
const { ledger } = storeToRefs(store)
const { filters, filteredEntries } = useFeedLedgerFilters(ledger)
const modalOpen = ref(false)
const modalMode = ref<FeedTransactionMode>('RECEIPT')
const notification = ref('')

const stockCards = computed(() => store.products.map(product => ({
  ...product,
  runwayDays: product.dailyConsumption > 0 ? product.currentStock / product.dailyConsumption : null,
  percentage: Math.min(100, Math.round((product.currentStock / Math.max(product.minimumStock, 1)) * 100)),
  low: product.currentStock <= product.minimumStock,
})))

function openTransaction(mode: FeedTransactionMode) {
  modalMode.value = mode
  modalOpen.value = true
}

function showNotification(message: string) {
  notification.value = message
  window.setTimeout(() => { notification.value = '' }, 3200)
}

function supplierName(id: string | null): string {
  return store.suppliers.find(item => item.id === id)?.name ?? '—'
}

function coopName(id: string | null): string {
  return COOPS.find(item => item.id === id)?.name ?? 'Gudang'
}

function dateTime(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function currency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

onMounted(() => store.initialize())
</script>

<template>
  <main class="min-h-screen bg-[#f5f7f3] px-4 py-5 text-slate-900 sm:px-6 lg:px-8 lg:py-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Operasional gudang</p>
          <h1 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Stok & distribusi pakan</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Pantau stok aktual, purchase order, penerimaan supplier, dan pemakaian dua kandang dalam satu ledger.</p>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:flex">
          <button class="btn-secondary flex items-center justify-center gap-2" @click="openTransaction('SUPPLIER')"><Truck class="h-4 w-4" /> Supplier</button>
          <button class="btn-primary flex items-center justify-center gap-2" @click="openTransaction('PURCHASE_ORDER')"><ShoppingCart class="h-4 w-4" /> Buat PO</button>
        </div>
      </header>

      <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article class="metric-card">
          <span class="metric-icon bg-emerald-100 text-emerald-700"><Warehouse class="h-5 w-5" /></span>
          <p>Total stok</p><strong>{{ store.metrics.totalStock.toLocaleString('id-ID') }} kg</strong><small>Seluruh jenis pakan</small>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-amber-100 text-amber-700"><AlertTriangle class="h-5 w-5" /></span>
          <p>Stok rendah</p><strong>{{ store.metrics.lowStockCount }} produk</strong><small>Perlu tindak lanjut</small>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-blue-100 text-blue-700"><ShoppingCart class="h-5 w-5" /></span>
          <p>PO terbuka</p><strong>{{ store.metrics.openPurchaseOrderQuantity.toLocaleString('id-ID') }} kg</strong><small>{{ store.metrics.openPurchaseOrderCount }} purchase order</small>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-violet-100 text-violet-700"><PackagePlus class="h-5 w-5" /></span>
          <p>Nilai persediaan</p><strong>{{ currency(store.metrics.estimatedInventoryValue) }}</strong><small>Estimasi harga PO terakhir</small>
        </article>
      </section>

      <section v-if="store.alerts.length" class="grid gap-3 lg:grid-cols-2">
        <article v-for="alert in store.alerts" :key="alert.feedCode" class="flex gap-3 rounded-2xl border p-4" :class="alert.severity === 'critical' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'">
          <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0" />
          <div><h2 class="font-black">{{ alert.title }}</h2><p class="mt-1 text-sm opacity-80">{{ alert.message }}</p></div>
        </article>
      </section>

      <section>
        <div class="mb-3 flex items-end justify-between">
          <div><h2 class="section-title">Posisi stok</h2><p class="section-subtitle">Saldo gudang dan estimasi hari tersisa.</p></div>
          <button class="hidden text-sm font-bold text-emerald-700 sm:block" @click="openTransaction('STOCKTAKE')">+ Stock opname</button>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          <article v-for="product in stockCards" :key="product.code" class="panel p-5 sm:p-6">
            <div class="flex items-start justify-between gap-4">
              <div><span class="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-black text-white">{{ product.code }}</span><h3 class="mt-3 text-xl font-black">{{ product.name }}</h3><p class="mt-1 text-sm text-slate-500">{{ product.phase }}</p></div>
              <span class="rounded-full px-3 py-1 text-xs font-black" :class="product.low ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'">{{ product.low ? 'Stok rendah' : 'Aman' }}</span>
            </div>
            <div class="mt-6 flex items-end justify-between gap-4"><div><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Stok tersedia</p><p class="mt-1 text-3xl font-black">{{ product.currentStock.toLocaleString('id-ID') }} <span class="text-base text-slate-400">kg</span></p></div><p v-if="product.runwayDays !== null" class="text-right text-sm font-bold text-slate-600">≈ {{ product.runwayDays.toFixed(1) }} hari</p></div>
            <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full" :class="product.low ? 'bg-rose-500' : 'bg-emerald-500'" :style="{ width: `${product.percentage}%` }" /></div>
            <div class="mt-3 flex justify-between text-xs font-semibold text-slate-400"><span>Minimum {{ product.minimumStock.toLocaleString('id-ID') }} kg</span><span>Pakai {{ product.dailyConsumption.toLocaleString('id-ID') }} kg/hari</span></div>
          </article>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button class="quick-action" @click="openTransaction('RECEIPT')"><span class="bg-emerald-100 text-emerald-700"><ArrowDownToLine class="h-5 w-5" /></span><div><strong>Terima pakan</strong><small>Dari supplier / PO</small></div></button>
        <button class="quick-action" @click="openTransaction('DISTRIBUTION')"><span class="bg-blue-100 text-blue-700"><ArrowUpFromLine class="h-5 w-5" /></span><div><strong>Distribusi</strong><small>Ke Kandang 1 atau 2</small></div></button>
        <button class="quick-action" @click="openTransaction('STOCKTAKE')"><span class="bg-violet-100 text-violet-700"><ClipboardCheck class="h-5 w-5" /></span><div><strong>Stock opname</strong><small>Hitung fisik & koreksi</small></div></button>
        <button class="quick-action" @click="openTransaction('PURCHASE_ORDER')"><span class="bg-amber-100 text-amber-700"><ShoppingCart class="h-5 w-5" /></span><div><strong>Purchase order</strong><small>Pesan ke supplier</small></div></button>
      </section>

      <section class="panel overflow-hidden">
        <div class="border-b border-slate-100 p-5 sm:flex sm:items-end sm:justify-between sm:p-6">
          <div><h2 class="section-title">Purchase order aktif</h2><p class="section-subtitle">PO terbuka dan penerimaan parsial.</p></div>
          <button class="mt-3 text-sm font-black text-emerald-700 sm:mt-0" @click="openTransaction('PURCHASE_ORDER')">+ PO baru</button>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table min-w-[760px]">
            <thead><tr><th>Nomor PO</th><th>Supplier</th><th>Pakan</th><th>Sisa</th><th>Estimasi tiba</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="order in store.openPurchaseOrders" :key="order.id"><td class="font-black text-slate-900">{{ order.poNumber }}</td><td>{{ supplierName(order.supplierId) }}</td><td>{{ order.lines.map(line => line.feedCode).join(', ') }}</td><td>{{ getRemainingPurchaseOrderQuantity(order).toLocaleString('id-ID') }} kg</td><td>{{ order.expectedDate }}</td><td><span class="status-pill" :class="order.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'">{{ order.status }}</span></td></tr>
              <tr v-if="!store.openPurchaseOrders.length"><td colspan="6" class="py-10 text-center text-slate-400">Tidak ada purchase order aktif.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel overflow-hidden">
        <div class="border-b border-slate-100 p-5 sm:p-6">
          <h2 class="section-title">Riwayat mutasi stok</h2><p class="section-subtitle">Ledger permanen untuk penerimaan, distribusi, dan koreksi.</p>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <label class="relative sm:col-span-1"><Search class="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input v-model="filters.search" class="input pl-9" placeholder="Cari referensi..." /></label>
            <select v-model="filters.kind" class="input"><option value="ALL">Semua mutasi</option><option v-for="(label, value) in LEDGER_LABELS" :key="value" :value="value">{{ label }}</option></select>
            <select v-model="filters.feedCode" class="input"><option value="ALL">Semua pakan</option><option v-for="product in store.products" :key="product.code" :value="product.code">{{ product.code }} · {{ product.name }}</option></select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table min-w-[980px]">
            <thead><tr><th>Waktu</th><th>Mutasi</th><th>Pakan</th><th>Lokasi / relasi</th><th>Jumlah</th><th>Saldo</th><th>Referensi</th><th>Petugas</th></tr></thead>
            <tbody>
              <tr v-for="entry in filteredEntries" :key="entry.id"><td>{{ dateTime(entry.occurredAt) }}</td><td><span class="status-pill" :class="entry.signedQuantity >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">{{ LEDGER_LABELS[entry.kind] }}</span></td><td class="font-black text-slate-900">{{ entry.feedCode }}</td><td>{{ entry.supplierId ? supplierName(entry.supplierId) : coopName(entry.coopId) }}</td><td class="font-black" :class="entry.signedQuantity >= 0 ? 'text-emerald-700' : 'text-blue-700'">{{ entry.signedQuantity > 0 ? '+' : '' }}{{ entry.signedQuantity.toLocaleString('id-ID') }} kg</td><td>{{ entry.balanceAfter.toLocaleString('id-ID') }} kg</td><td><p class="font-bold text-slate-700">{{ entry.reference }}</p><p class="max-w-52 truncate text-xs text-slate-400">{{ entry.note || '—' }}</p></td><td>{{ entry.createdBy }}</td></tr>
              <tr v-if="!filteredEntries.length"><td colspan="8" class="py-10 text-center text-slate-400">Mutasi tidak ditemukan.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <Transition enter-active-class="transition duration-200" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-150" leave-to-class="translate-y-4 opacity-0">
      <div v-if="notification" class="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-xl">{{ notification }}</div>
    </Transition>

    <FeedTransactionModal :open="modalOpen" :default-mode="modalMode" @close="modalOpen = false" @saved="showNotification" />
  </main>
</template>
