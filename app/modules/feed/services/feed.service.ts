import type {
  CreatePurchaseOrderInput,
  CreateSupplierInput,
  DistributeFeedInput,
  FeedLedgerEntry,
  FeedPurchaseOrder,
  FeedState,
  OperationMetadata,
  ReceiveFeedInput,
  StocktakeFeedInput,
} from '../domain/feed.types'

function copyState(state: FeedState): FeedState {
  return JSON.parse(JSON.stringify(state)) as FeedState
}

function requireText(value: string, field: string): string {
  const normalized = value.trim()
  if (!normalized) throw new Error(`${field} wajib diisi.`)
  return normalized
}

function requirePositive(value: number, field: string): number {
  const normalized = Number(value)
  if (!Number.isFinite(normalized) || normalized <= 0) throw new Error(`${field} harus lebih dari 0.`)
  return normalized
}

function requireNonNegative(value: number, field: string): number {
  const normalized = Number(value)
  if (!Number.isFinite(normalized) || normalized < 0) throw new Error(`${field} tidak boleh negatif.`)
  return normalized
}

function operationSuffix(operationId: string): string {
  return operationId.replace(/[^a-z0-9]/gi, '').slice(-8).toUpperCase() || Date.now().toString().slice(-8)
}

function compactDate(date: string): string {
  return date.replaceAll('-', '')
}

function addLedger(state: FeedState, entry: FeedLedgerEntry) {
  state.ledger.unshift(entry)
}

export function createSupplier(
  current: FeedState,
  input: CreateSupplierInput,
  metadata: OperationMetadata,
): FeedState {
  const state = copyState(current)
  const name = requireText(input.name, 'Nama supplier')

  if (state.suppliers.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Supplier dengan nama tersebut sudah tersedia.')
  }

  const code = `SUP-${operationSuffix(metadata.operationId)}`
  state.suppliers.unshift({
    id: code,
    code,
    name,
    phone: input.phone.trim(),
    address: input.address.trim(),
    active: true,
  })

  return state
}

export function createPurchaseOrder(
  current: FeedState,
  input: CreatePurchaseOrderInput,
  metadata: OperationMetadata,
): FeedState {
  const state = copyState(current)
  const supplier = state.suppliers.find(item => item.id === input.supplierId && item.active)
  if (!supplier) throw new Error('Supplier aktif tidak ditemukan.')
  if (!state.products.some(item => item.code === input.feedCode)) throw new Error('Jenis pakan tidak ditemukan.')
  if (!input.orderDate || !input.expectedDate) throw new Error('Tanggal PO dan estimasi tiba wajib diisi.')
  if (input.expectedDate < input.orderDate) throw new Error('Estimasi tiba tidak boleh sebelum tanggal PO.')

  const poNumber = `PO-${compactDate(input.orderDate)}-${operationSuffix(metadata.operationId)}`
  const purchaseOrder: FeedPurchaseOrder = {
    id: poNumber,
    poNumber,
    supplierId: supplier.id,
    orderDate: input.orderDate,
    expectedDate: input.expectedDate,
    status: 'OPEN',
    lines: [{
      feedCode: input.feedCode,
      orderedQuantity: requirePositive(input.quantity, 'Jumlah pesanan'),
      receivedQuantity: 0,
      pricePerKg: requirePositive(input.pricePerKg, 'Harga per kg'),
    }],
    note: input.note.trim(),
  }

  state.purchaseOrders.unshift(purchaseOrder)
  return state
}

export function receiveFeed(
  current: FeedState,
  input: ReceiveFeedInput,
  metadata: OperationMetadata,
): FeedState {
  const state = copyState(current)
  const purchaseOrder = state.purchaseOrders.find(item => item.id === input.purchaseOrderId)
  if (!purchaseOrder || !['OPEN', 'PARTIAL'].includes(purchaseOrder.status)) {
    throw new Error('Purchase order tidak tersedia atau sudah selesai.')
  }
  if (purchaseOrder.supplierId !== input.supplierId) throw new Error('Supplier tidak sesuai dengan purchase order.')

  const line = purchaseOrder.lines.find(item => item.feedCode === input.feedCode)
  const product = state.products.find(item => item.code === input.feedCode)
  if (!line || !product) throw new Error('Jenis pakan tidak ditemukan pada purchase order.')

  const quantity = requirePositive(input.quantity, 'Jumlah penerimaan')
  const remaining = line.orderedQuantity - line.receivedQuantity
  if (quantity > remaining) throw new Error(`Jumlah melebihi sisa PO (${remaining.toLocaleString('id-ID')} kg).`)

  const reference = requireText(input.deliveryNote, 'Nomor surat jalan')
  const balanceBefore = product.currentStock
  product.currentStock += quantity
  line.receivedQuantity += quantity
  purchaseOrder.status = purchaseOrder.lines.every(item => item.receivedQuantity >= item.orderedQuantity)
    ? 'RECEIVED'
    : 'PARTIAL'

  addLedger(state, {
    id: `RCV-${operationSuffix(metadata.operationId)}`,
    occurredAt: metadata.occurredAt,
    kind: 'RECEIPT',
    feedCode: product.code,
    quantity,
    signedQuantity: quantity,
    balanceBefore,
    balanceAfter: product.currentStock,
    coopId: null,
    supplierId: input.supplierId,
    purchaseOrderId: purchaseOrder.id,
    reference,
    note: input.note.trim(),
    createdBy: metadata.actor,
  })

  return state
}

export function distributeFeed(
  current: FeedState,
  input: DistributeFeedInput,
  metadata: OperationMetadata,
): FeedState {
  const state = copyState(current)
  const product = state.products.find(item => item.code === input.feedCode)
  if (!product) throw new Error('Jenis pakan tidak ditemukan.')

  const quantity = requirePositive(input.quantity, 'Jumlah distribusi')
  if (quantity > product.currentStock) {
    throw new Error(`Stok tidak cukup. Tersedia ${product.currentStock.toLocaleString('id-ID')} kg.`)
  }

  const balanceBefore = product.currentStock
  product.currentStock -= quantity

  addLedger(state, {
    id: `DST-${operationSuffix(metadata.operationId)}`,
    occurredAt: metadata.occurredAt,
    kind: 'DISTRIBUTION',
    feedCode: product.code,
    quantity,
    signedQuantity: -quantity,
    balanceBefore,
    balanceAfter: product.currentStock,
    coopId: input.coopId,
    supplierId: null,
    purchaseOrderId: null,
    reference: `DIST-${input.coopId}-${input.date}`,
    note: input.note.trim(),
    createdBy: metadata.actor,
  })

  return state
}

export function stocktakeFeed(
  current: FeedState,
  input: StocktakeFeedInput,
  metadata: OperationMetadata,
): FeedState {
  const state = copyState(current)
  const product = state.products.find(item => item.code === input.feedCode)
  if (!product) throw new Error('Jenis pakan tidak ditemukan.')

  const actualQuantity = requireNonNegative(input.actualQuantity, 'Stok fisik')
  const reason = requireText(input.reason, 'Alasan stock opname')
  const systemQuantity = product.currentStock
  const difference = actualQuantity - systemQuantity
  const stocktakeId = `STO-${operationSuffix(metadata.operationId)}`
  let ledgerEntryId: string | null = null

  if (difference !== 0) {
    ledgerEntryId = `ADJ-${operationSuffix(metadata.operationId)}`
    product.currentStock = actualQuantity
    addLedger(state, {
      id: ledgerEntryId,
      occurredAt: metadata.occurredAt,
      kind: difference > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
      feedCode: product.code,
      quantity: Math.abs(difference),
      signedQuantity: difference,
      balanceBefore: systemQuantity,
      balanceAfter: actualQuantity,
      coopId: null,
      supplierId: null,
      purchaseOrderId: null,
      reference: stocktakeId,
      note: [reason, input.note.trim()].filter(Boolean).join(' — '),
      createdBy: metadata.actor,
    })
  }

  state.stocktakes.unshift({
    id: stocktakeId,
    date: input.date,
    feedCode: product.code,
    systemQuantity,
    actualQuantity,
    difference,
    reason,
    ledgerEntryId,
  })

  return state
}
