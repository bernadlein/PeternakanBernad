import { FEED_SCHEMA_VERSION } from './feed.constants'
import type { FeedState } from './feed.types'

export function createSeedFeedState(): FeedState {
  return {
    schemaVersion: FEED_SCHEMA_VERSION,
    products: [
      { code: 'BR-1', name: 'Starter Crumble', phase: 'Umur 1–14 hari', currentStock: 4800, minimumStock: 3000, dailyConsumption: 0, unit: 'kg' },
      { code: 'BR-2', name: 'Finisher Pellet', phase: 'Umur 15–panen', currentStock: 23600, minimumStock: 30000, dailyConsumption: 6200, unit: 'kg' },
    ],
    suppliers: [
      { id: 'SUP-001', code: 'SUP-001', name: 'PT Pakan Sejahtera', phone: '021-555-0142', address: 'Bogor, Jawa Barat', active: true },
      { id: 'SUP-002', code: 'SUP-002', name: 'CV Nutrisi Unggas', phone: '0251-555-0198', address: 'Sukabumi, Jawa Barat', active: true },
    ],
    purchaseOrders: [
      {
        id: 'PO-20260814-001',
        poNumber: 'PO-20260814-001',
        supplierId: 'SUP-001',
        orderDate: '2026-08-14',
        expectedDate: '2026-08-16',
        status: 'OPEN',
        lines: [{ feedCode: 'BR-2', orderedQuantity: 30000, receivedQuantity: 0, pricePerKg: 8250 }],
        note: 'Prioritas stok finisher',
      },
    ],
    ledger: [
      { id: 'OPEN-BR1', occurredAt: '2026-08-14T06:00:00+07:00', kind: 'OPENING_BALANCE', feedCode: 'BR-1', quantity: 4800, signedQuantity: 4800, balanceBefore: 0, balanceAfter: 4800, coopId: null, supplierId: null, purchaseOrderId: null, reference: 'SALDO-AWAL', note: 'Saldo awal sistem', createdBy: 'System' },
      { id: 'OPEN-BR2', occurredAt: '2026-08-14T06:00:00+07:00', kind: 'OPENING_BALANCE', feedCode: 'BR-2', quantity: 23600, signedQuantity: 23600, balanceBefore: 0, balanceAfter: 23600, coopId: null, supplierId: null, purchaseOrderId: null, reference: 'SALDO-AWAL', note: 'Saldo awal sistem', createdBy: 'System' },
    ],
    stocktakes: [],
  }
}
