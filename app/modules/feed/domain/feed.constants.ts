export const FEED_STORAGE_KEY = 'farmflow-feed-v1'
export const LEGACY_FARM_KEYS = ['farmflow-ayam-v2', 'farmflow-ayam-v1']
export const FEED_SCHEMA_VERSION = 1 as const
export const DEFAULT_ACTOR = 'Farm Manager'

export const COOPS = [
  { id: 'KD-01' as const, name: 'Kandang Timur' },
  { id: 'KD-02' as const, name: 'Kandang Barat' },
]

export const TRANSACTION_LABELS = {
  SUPPLIER: 'Tambah supplier',
  PURCHASE_ORDER: 'Buat purchase order',
  RECEIPT: 'Terima pakan',
  DISTRIBUTION: 'Distribusi kandang',
  STOCKTAKE: 'Stock opname',
} as const

export const LEDGER_LABELS = {
  OPENING_BALANCE: 'Saldo awal',
  RECEIPT: 'Penerimaan',
  DISTRIBUTION: 'Distribusi',
  ADJUSTMENT_IN: 'Koreksi tambah',
  ADJUSTMENT_OUT: 'Koreksi kurang',
} as const
