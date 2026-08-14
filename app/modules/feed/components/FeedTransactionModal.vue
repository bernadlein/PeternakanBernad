<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlertCircle, PackageCheck, X } from '@lucide/vue'
import { COOPS, TRANSACTION_LABELS } from '../domain/feed.constants'
import type { FeedTransactionMode } from '../domain/feed.types'
import { useFeedTransactionForm } from '../composables/useFeedTransactionForm'
import { useFeedStore } from '../stores/feed.store'

const props = defineProps<{ open: boolean; defaultMode?: FeedTransactionMode }>()
const emit = defineEmits<{ close: []; saved: [message: string] }>()
const store = useFeedStore()
const { form, reset } = useFeedTransactionForm(props.defaultMode)
const errorMessage = ref('')

const selectedPurchaseOrder = computed(() => store.purchaseOrders.find(item => item.id === form.purchaseOrderId))
const availableModes = Object.entries(TRANSACTION_LABELS) as [FeedTransactionMode, string][]

watch(() => props.open, (open) => {
  if (open) {
    reset(props.defaultMode ?? 'RECEIPT')
    errorMessage.value = ''
  }
})

watch(() => form.purchaseOrderId, () => {
  const order = selectedPurchaseOrder.value
  if (!order) return
  form.supplierId = order.supplierId
  form.feedCode = order.lines[0]?.feedCode ?? ''
})

function submit() {
  errorMessage.value = ''
  const quantity = Number(form.quantity ?? 0)
  let result

  switch (form.mode) {
    case 'SUPPLIER':
      result = store.addSupplier({
        name: form.supplierName,
        phone: form.supplierPhone,
        address: form.supplierAddress,
      })
      break
    case 'PURCHASE_ORDER':
      result = store.addPurchaseOrder({
        supplierId: form.supplierId,
        orderDate: form.date,
        expectedDate: form.expectedDate,
        feedCode: form.feedCode,
        quantity,
        pricePerKg: Number(form.pricePerKg ?? 0),
        note: form.note,
      })
      break
    case 'RECEIPT':
      result = store.addReceipt({
        date: form.date,
        supplierId: form.supplierId,
        purchaseOrderId: form.purchaseOrderId,
        feedCode: form.feedCode,
        quantity,
        deliveryNote: form.deliveryNote,
        note: form.note,
      })
      break
    case 'DISTRIBUTION':
      result = store.addDistribution({
        date: form.date,
        coopId: form.coopId,
        feedCode: form.feedCode,
        quantity,
        note: form.note,
      })
      break
    case 'STOCKTAKE':
      result = store.addStocktake({
        date: form.date,
        feedCode: form.feedCode,
        actualQuantity: Number(form.actualQuantity ?? 0),
        reason: form.reason,
        note: form.note,
      })
      break
  }

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }
  emit('saved', `${TRANSACTION_LABELS[form.mode]} berhasil disimpan.`)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" @click.self="emit('close')">
      <form class="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl" @submit.prevent="submit">
        <header class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Transaksi pakan</p>
            <h2 class="mt-1 text-xl font-black text-slate-900">{{ TRANSACTION_LABELS[form.mode] }}</h2>
          </div>
          <button type="button" class="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Tutup" @click="emit('close')">
            <X class="h-5 w-5" />
          </button>
        </header>

        <div class="space-y-5 p-5 sm:p-7">
          <label class="field">
            <span>Jenis transaksi</span>
            <select v-model="form.mode" class="input">
              <option v-for="([value, label]) in availableModes" :key="value" :value="value">{{ label }}</option>
            </select>
          </label>

          <div v-if="errorMessage" class="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
            {{ errorMessage }}
          </div>

          <template v-if="form.mode === 'SUPPLIER'">
            <label class="field"><span>Nama supplier</span><input v-model="form.supplierName" class="input" placeholder="PT Pakan Makmur" /></label>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="field"><span>Telepon</span><input v-model="form.supplierPhone" class="input" placeholder="021-..." /></label>
              <label class="field"><span>Alamat</span><input v-model="form.supplierAddress" class="input" placeholder="Kota, provinsi" /></label>
            </div>
          </template>

          <template v-else>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="field"><span>Tanggal</span><input v-model="form.date" type="date" class="input" /></label>
              <label v-if="form.mode === 'PURCHASE_ORDER'" class="field"><span>Estimasi tiba</span><input v-model="form.expectedDate" type="date" class="input" /></label>
              <label v-if="form.mode === 'DISTRIBUTION'" class="field">
                <span>Kandang tujuan</span>
                <select v-model="form.coopId" class="input"><option v-for="coop in COOPS" :key="coop.id" :value="coop.id">{{ coop.name }}</option></select>
              </label>
            </div>

            <label v-if="form.mode === 'RECEIPT'" class="field">
              <span>Purchase order</span>
              <select v-model="form.purchaseOrderId" class="input">
                <option value="" disabled>Pilih PO yang masih terbuka</option>
                <option v-for="order in store.openPurchaseOrders" :key="order.id" :value="order.id">{{ order.poNumber }} · {{ order.lines[0]?.feedCode }}</option>
              </select>
            </label>

            <label v-if="form.mode === 'PURCHASE_ORDER'" class="field">
              <span>Supplier</span>
              <select v-model="form.supplierId" class="input"><option value="" disabled>Pilih supplier</option><option v-for="supplier in store.activeSuppliers" :key="supplier.id" :value="supplier.id">{{ supplier.name }}</option></select>
            </label>

            <label v-if="form.mode !== 'RECEIPT'" class="field">
              <span>Jenis pakan</span>
              <select v-model="form.feedCode" class="input"><option value="" disabled>Pilih pakan</option><option v-for="product in store.products" :key="product.code" :value="product.code">{{ product.code }} · {{ product.name }}</option></select>
            </label>

            <div v-if="form.mode === 'PURCHASE_ORDER' || form.mode === 'DISTRIBUTION' || form.mode === 'RECEIPT'" class="grid gap-4 sm:grid-cols-2">
              <label class="field"><span>Jumlah (kg)</span><input v-model.number="form.quantity" type="number" min="1" class="input" placeholder="0" /></label>
              <label v-if="form.mode === 'PURCHASE_ORDER'" class="field"><span>Harga per kg</span><input v-model.number="form.pricePerKg" type="number" min="1" class="input" placeholder="0" /></label>
              <label v-if="form.mode === 'RECEIPT'" class="field"><span>Nomor surat jalan</span><input v-model="form.deliveryNote" class="input" placeholder="SJ-2026-..." /></label>
            </div>

            <template v-if="form.mode === 'STOCKTAKE'">
              <label class="field"><span>Jenis pakan</span><select v-model="form.feedCode" class="input"><option value="" disabled>Pilih pakan</option><option v-for="product in store.products" :key="product.code" :value="product.code">{{ product.code }} · sistem {{ product.currentStock.toLocaleString('id-ID') }} kg</option></select></label>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="field"><span>Stok fisik (kg)</span><input v-model.number="form.actualQuantity" type="number" min="0" class="input" placeholder="0" /></label>
                <label class="field"><span>Alasan opname/koreksi</span><input v-model="form.reason" class="input" placeholder="Hasil timbang gudang" /></label>
              </div>
            </template>

            <label class="field"><span>Catatan opsional</span><textarea v-model="form.note" rows="3" class="input resize-none" placeholder="Tambahkan informasi pendukung" /></label>
          </template>
        </div>

        <footer class="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:justify-end sm:px-7">
          <button type="button" class="btn-secondary flex-1 sm:flex-none" @click="emit('close')">Batal</button>
          <button type="submit" class="btn-primary flex flex-1 items-center justify-center gap-2 sm:flex-none">
            <PackageCheck class="h-4 w-4" /> Simpan transaksi
          </button>
        </footer>
      </form>
    </div>
  </Teleport>
</template>
