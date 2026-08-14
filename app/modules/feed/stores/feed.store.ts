import { defineStore } from 'pinia'
import { DEFAULT_ACTOR } from '../domain/feed.constants'
import { createSeedFeedState } from '../domain/feed.seed'
import type {
  CreatePurchaseOrderInput,
  CreateSupplierInput,
  DistributeFeedInput,
  FeedState,
  ReceiveFeedInput,
  StocktakeFeedInput,
} from '../domain/feed.types'
import { LocalStorageFeedRepository } from '../repositories/local-storage-feed.repository'
import { calculateFeedMetrics, getFeedAlerts, getOpenPurchaseOrders } from '../services/feed.selectors'
import { createPurchaseOrder, createSupplier, distributeFeed, receiveFeed, stocktakeFeed } from '../services/feed.service'

export type FeedActionResult = { ok: true } | { ok: false; message: string }

function createOperationId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function metadata(date?: string) {
  return {
    operationId: createOperationId(),
    occurredAt: date ? `${date}T12:00:00+07:00` : new Date().toISOString(),
    actor: DEFAULT_ACTOR,
  }
}

export const useFeedStore = defineStore('feed', {
  state: () => ({
    ...createSeedFeedState(),
    initialized: false,
  }),

  getters: {
    metrics: state => calculateFeedMetrics(state),
    alerts: state => getFeedAlerts(state),
    openPurchaseOrders: state => getOpenPurchaseOrders(state),
    activeSuppliers: state => state.suppliers.filter(item => item.active),
  },

  actions: {
    snapshot(): FeedState {
      return {
        schemaVersion: this.schemaVersion,
        products: this.products,
        suppliers: this.suppliers,
        purchaseOrders: this.purchaseOrders,
        ledger: this.ledger,
        stocktakes: this.stocktakes,
      }
    },

    initialize() {
      if (this.initialized || !import.meta.client) return
      const repository = new LocalStorageFeedRepository(window.localStorage)
      const saved = repository.load()
      if (saved) this.$patch(saved)
      else repository.save(this.snapshot())
      this.initialized = true
    },

    persist() {
      if (!import.meta.client) return
      new LocalStorageFeedRepository(window.localStorage).save(this.snapshot())
    },

    run(operation: (state: FeedState) => FeedState): FeedActionResult {
      try {
        this.$patch(operation(this.snapshot()))
        this.persist()
        return { ok: true }
      }
      catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Transaksi gagal disimpan.' }
      }
    },

    addSupplier(input: CreateSupplierInput): FeedActionResult {
      return this.run(state => createSupplier(state, input, metadata()))
    },

    addPurchaseOrder(input: CreatePurchaseOrderInput): FeedActionResult {
      return this.run(state => createPurchaseOrder(state, input, metadata(input.orderDate)))
    },

    addReceipt(input: ReceiveFeedInput): FeedActionResult {
      return this.run(state => receiveFeed(state, input, metadata(input.date)))
    },

    addDistribution(input: DistributeFeedInput): FeedActionResult {
      return this.run(state => distributeFeed(state, input, metadata(input.date)))
    },

    addStocktake(input: StocktakeFeedInput): FeedActionResult {
      return this.run(state => stocktakeFeed(state, input, metadata(input.date)))
    },
  },
})
