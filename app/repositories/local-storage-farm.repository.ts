import { FARM_STORAGE_KEY, LEGACY_FARM_STORAGE_KEYS } from '~/domain/farm.constants'
import type { FarmState } from '~/domain/farm.types'
import type { FarmRepository } from './farm.repository'

function isFarmState(value: unknown): value is FarmState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<FarmState>
  return Array.isArray(candidate.coops)
    && Array.isArray(candidate.activities)
    && Array.isArray(candidate.populationRecords)
    && Array.isArray(candidate.feedStocks)
    && Array.isArray(candidate.feedMovements)
    && Array.isArray(candidate.healthRecords)
    && Array.isArray(candidate.checklist)
}

function normalizeFarmState(state: FarmState): FarmState {
  return {
    ...state,
    checklist: state.checklist.map((item, index) => ({
      ...item,
      id: item.id || `legacy-check-${index + 1}`,
    })),
  }
}

export class LocalStorageFarmRepository implements FarmRepository {
  constructor(private readonly storage: Storage, private readonly key = FARM_STORAGE_KEY) {}

  load(): FarmState | null {
    const raw = this.storage.getItem(this.key)
      ?? LEGACY_FARM_STORAGE_KEYS.map(key => this.storage.getItem(key)).find(Boolean)
    if (!raw) return null

    try {
      const parsed: unknown = JSON.parse(raw)
      return isFarmState(parsed) ? normalizeFarmState(parsed) : null
    } catch {
      return null
    }
  }

  save(state: FarmState): void {
    this.storage.setItem(this.key, JSON.stringify(state))
  }

  clear(): void {
    this.storage.removeItem(this.key)
  }
}
