import { reactive } from 'vue'
import type { CoopId, FeedTransactionMode } from '../domain/feed.types'

function jakartaDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

export function useFeedTransactionForm(initialMode: FeedTransactionMode = 'RECEIPT') {
  const today = jakartaDate()
  const form = reactive({
    mode: initialMode,
    date: today,
    supplierId: '',
    purchaseOrderId: '',
    feedCode: '',
    quantity: null as number | null,
    pricePerKg: null as number | null,
    expectedDate: today,
    deliveryNote: '',
    coopId: 'KD-01' as CoopId,
    actualQuantity: null as number | null,
    reason: '',
    note: '',
    supplierName: '',
    supplierPhone: '',
    supplierAddress: '',
  })

  function reset(mode: FeedTransactionMode = form.mode) {
    Object.assign(form, {
      mode,
      date: today,
      supplierId: '',
      purchaseOrderId: '',
      feedCode: '',
      quantity: null,
      pricePerKg: null,
      expectedDate: today,
      deliveryNote: '',
      coopId: 'KD-01',
      actualQuantity: null,
      reason: '',
      note: '',
      supplierName: '',
      supplierPhone: '',
      supplierAddress: '',
    })
  }

  return { form, reset }
}
