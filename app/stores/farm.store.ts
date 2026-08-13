import { defineStore } from 'pinia'
import { createSeedFarmState } from '~/domain/farm.seed'
import type { FarmState, RecordActivityInput } from '~/domain/farm.types'
import { LocalStorageFarmRepository } from '~/repositories/local-storage-farm.repository'
import { calculateFarmMetrics, getCompletedChecklistCount, getLocationName } from '~/services/farm.selectors'
import { recordFarmActivity, toggleFarmChecklist } from '~/services/farm.service'
import { getJakartaTime } from '~/utils/formatters'

type ActionResult = { ok: true } | { ok: false; message: string }

function repository() {
  return import.meta.client ? new LocalStorageFarmRepository(window.localStorage) : null
}

export const useFarmStore = defineStore('farm', {
  state: () => ({
    ...createSeedFarmState(),
    initialized: false,
  }),

  getters: {
    metrics: state => calculateFarmMetrics(state),
    completedChecklist: state => getCompletedChecklistCount(state),
    locationName: state => (locationId: Parameters<typeof getLocationName>[1]) => getLocationName(state, locationId),
  },

  actions: {
    snapshot(): FarmState {
      return {
        coops: this.coops,
        activities: this.activities,
        populationRecords: this.populationRecords,
        feedStocks: this.feedStocks,
        feedMovements: this.feedMovements,
        healthRecords: this.healthRecords,
        checklist: this.checklist,
      }
    },

    initialize() {
      if (this.initialized || !import.meta.client) return
      const saved = repository()?.load()
      if (saved) {
        this.$patch(saved)
        this.persist()
      }
      this.initialized = true
    },

    persist() {
      repository()?.save(this.snapshot())
    },

    recordActivity(input: RecordActivityInput): ActionResult {
      try {
        const next = recordFarmActivity(this.snapshot(), input, {
          id: Date.now(),
          time: getJakartaTime(),
        })
        this.$patch(next)
        this.persist()
        return { ok: true }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Aktivitas gagal disimpan.' }
      }
    },

    toggleChecklist(itemId: string): ActionResult {
      try {
        this.$patch(toggleFarmChecklist(this.snapshot(), itemId))
        this.persist()
        return { ok: true }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Checklist gagal diperbarui.' }
      }
    },

    resetDemo() {
      this.$patch(createSeedFarmState())
      repository()?.clear()
      this.persist()
    },
  },
})
