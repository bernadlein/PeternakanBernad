import { FEED_SCHEMA_VERSION, FEED_STORAGE_KEY, LEGACY_FARM_KEYS } from '../domain/feed.constants'
import { createSeedFeedState } from '../domain/feed.seed'
import type { FeedLedgerEntry, FeedState } from '../domain/feed.types'
import type { FeedRepository } from './feed.repository'

interface LegacyFeedStock { code?: string; name?: string; stock?: number; minimum?: number }
interface LegacyMovement { id?: string; date?: string; type?: string; feed?: string; quantity?: number; coop?: string; note?: string }
interface LegacyFarmState { feedStocks?: LegacyFeedStock[]; feedMovements?: LegacyMovement[] }

function isFeedState(value: unknown): value is FeedState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<FeedState>
  return state.schemaVersion === FEED_SCHEMA_VERSION
    && Array.isArray(state.products)
    && Array.isArray(state.suppliers)
    && Array.isArray(state.purchaseOrders)
    && Array.isArray(state.ledger)
    && Array.isArray(state.stocktakes)
}

function parse(value: string | null): unknown {
  if (!value) return null
  try { return JSON.parse(value) } catch { return null }
}

function migrateLegacy(storage: Storage): FeedState | null {
  let legacy: LegacyFarmState | null = null
  for (const key of LEGACY_FARM_KEYS) {
    const candidate = parse(storage.getItem(key)) as LegacyFarmState | null
    if (candidate?.feedStocks?.length) {
      legacy = candidate
      break
    }
  }
  if (!legacy) return null

  const state = createSeedFeedState()
  for (const stock of legacy.feedStocks ?? []) {
    const product = state.products.find(item => item.code === stock.code || stock.name?.includes(item.code))
    if (!product) continue
    if (Number.isFinite(Number(stock.stock))) product.currentStock = Number(stock.stock)
    if (Number.isFinite(Number(stock.minimum))) product.minimumStock = Number(stock.minimum)
  }

  const migrated: FeedLedgerEntry[] = (legacy.feedMovements ?? []).flatMap((movement, index) => {
    const quantity = Math.abs(Number(movement.quantity ?? 0))
    const product = state.products.find(item => movement.feed?.includes(item.code) || movement.feed === item.name)
    if (!product || quantity <= 0) return []
    const isIncoming = movement.type?.toLowerCase().includes('masuk')
    return [{
      id: movement.id ?? `LEGACY-${index + 1}`,
      occurredAt: movement.date ? `${movement.date}T12:00:00+07:00` : new Date().toISOString(),
      kind: isIncoming ? 'RECEIPT' : 'DISTRIBUTION',
      feedCode: product.code,
      quantity,
      signedQuantity: isIncoming ? quantity : -quantity,
      balanceBefore: product.currentStock,
      balanceAfter: product.currentStock,
      coopId: movement.coop === 'KD-01' || movement.coop === 'KD-02' ? movement.coop : null,
      supplierId: null,
      purchaseOrderId: null,
      reference: 'MIGRASI-V2',
      note: movement.note ?? 'Diimpor dari modul pakan lama',
      createdBy: 'Migration',
    } satisfies FeedLedgerEntry]
  })
  state.ledger = [...migrated, ...state.ledger]
  return state
}

export class LocalStorageFeedRepository implements FeedRepository {
  constructor(private readonly storage: Storage) {}

  load(): FeedState | null {
    const current = parse(this.storage.getItem(FEED_STORAGE_KEY))
    if (isFeedState(current)) return current

    const migrated = migrateLegacy(this.storage)
    if (migrated) this.save(migrated)
    return migrated
  }

  save(state: FeedState): void {
    this.storage.setItem(FEED_STORAGE_KEY, JSON.stringify(state))
  }

  clear(): void {
    this.storage.removeItem(FEED_STORAGE_KEY)
  }
}
