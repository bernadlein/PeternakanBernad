export type CoopId = 'KD-01' | 'KD-02'
export type FeedTransactionMode = 'SUPPLIER' | 'PURCHASE_ORDER' | 'RECEIPT' | 'DISTRIBUTION' | 'STOCKTAKE'
export type PurchaseOrderStatus = 'OPEN' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED'
export type FeedLedgerKind = 'OPENING_BALANCE' | 'RECEIPT' | 'DISTRIBUTION' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT'

export interface FeedProduct {
  code: string
  name: string
  phase: string
  currentStock: number
  minimumStock: number
  dailyConsumption: number
  unit: 'kg'
}

export interface FeedSupplier {
  id: string
  code: string
  name: string
  phone: string
  address: string
  active: boolean
}

export interface PurchaseOrderLine {
  feedCode: string
  orderedQuantity: number
  receivedQuantity: number
  pricePerKg: number
}

export interface FeedPurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  orderDate: string
  expectedDate: string
  status: PurchaseOrderStatus
  lines: PurchaseOrderLine[]
  note: string
}

export interface FeedLedgerEntry {
  id: string
  occurredAt: string
  kind: FeedLedgerKind
  feedCode: string
  quantity: number
  signedQuantity: number
  balanceBefore: number
  balanceAfter: number
  coopId: CoopId | null
  supplierId: string | null
  purchaseOrderId: string | null
  reference: string
  note: string
  createdBy: string
}

export interface FeedStocktake {
  id: string
  date: string
  feedCode: string
  systemQuantity: number
  actualQuantity: number
  difference: number
  reason: string
  ledgerEntryId: string | null
}

export interface FeedState {
  schemaVersion: 1
  products: FeedProduct[]
  suppliers: FeedSupplier[]
  purchaseOrders: FeedPurchaseOrder[]
  ledger: FeedLedgerEntry[]
  stocktakes: FeedStocktake[]
}

export interface OperationMetadata {
  operationId: string
  occurredAt: string
  actor: string
}

export interface CreateSupplierInput {
  name: string
  phone: string
  address: string
}

export interface CreatePurchaseOrderInput {
  supplierId: string
  orderDate: string
  expectedDate: string
  feedCode: string
  quantity: number
  pricePerKg: number
  note: string
}

export interface ReceiveFeedInput {
  date: string
  supplierId: string
  purchaseOrderId: string
  feedCode: string
  quantity: number
  deliveryNote: string
  note: string
}

export interface DistributeFeedInput {
  date: string
  coopId: CoopId
  feedCode: string
  quantity: number
  note: string
}

export interface StocktakeFeedInput {
  date: string
  feedCode: string
  actualQuantity: number
  reason: string
  note: string
}

export interface FeedMetrics {
  totalStock: number
  lowStockCount: number
  minimumRunwayDays: number
  openPurchaseOrderCount: number
  openPurchaseOrderQuantity: number
  estimatedInventoryValue: number
}

export interface FeedAlert {
  feedCode: string
  title: string
  message: string
  severity: 'warning' | 'critical'
  runwayDays: number
}
