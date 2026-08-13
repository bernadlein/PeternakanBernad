import { describe, expect, it } from 'vitest'
import { createSeedFarmState } from '~/domain/farm.seed'
import { calculateFarmMetrics } from '~/services/farm.selectors'
import { recordFarmActivity } from '~/services/farm.service'
import { createCsvReport } from '~/services/report.service'

const metadata = { id: 99, time: '08:30' }

describe('farm service', () => {
  it('menghitung metrik awal secara konsisten', () => {
    const metrics = calculateFarmMetrics(createSeedFarmState())
    expect(metrics.totalCapacity).toBe(48000)
    expect(metrics.totalPopulation).toBe(47748)
    expect(metrics.totalFeedStock).toBe(28400)
  })

  it('mencatat mortalitas sebagai satu transaksi domain', () => {
    const before = createSeedFarmState()
    const after = recordFarmActivity(before, {
      type: 'Mortalitas',
      date: '2026-08-14',
      coopId: 'KD-01',
      amount: 2,
      feedCode: 'BR-2',
      healthType: 'Observasi',
      note: 'Uji',
    }, metadata)

    expect(after.coops[0]?.population).toBe(23840)
    expect(after.populationRecords[0]?.mortality).toBe(2)
    expect(after.activities[0]?.title).toBe('Mortalitas dicatat')
    expect(before.coops[0]?.population).toBe(23842)
  })

  it('menolak distribusi pakan yang melebihi stok', () => {
    expect(() => recordFarmActivity(createSeedFarmState(), {
      type: 'Pakan keluar',
      date: '2026-08-14',
      coopId: 'KD-01',
      amount: 999999,
      feedCode: 'BR-2',
      healthType: 'Observasi',
      note: '',
    }, metadata)).toThrow('Stok pakan tidak mencukupi')
  })

  it('membuat laporan dari service tanpa bergantung pada UI', () => {
    const csv = createCsvReport('operasional', createSeedFarmState(), {
      start: '2026-08-01',
      end: '2026-08-14',
    })
    expect(csv).toContain('Laporan Operasional FarmFlow')
    expect(csv).toContain('Kandang Timur')
  })
})
