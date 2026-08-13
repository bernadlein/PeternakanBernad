import type { FarmState, ReportPeriod, ReportType } from '~/domain/farm.types'
import { calculateFarmMetrics, getLocationName } from './farm.selectors'
import { formatNumber } from '~/utils/formatters'

type CsvCell = string | number

function escapeCsv(value: CsvCell): string {
  return `"${String(value).replaceAll('"', '""')}"`
}

function buildRows(type: ReportType, state: FarmState, period: ReportPeriod): CsvCell[][] {
  if (type === 'populasi') {
    return [
      ['Tanggal', 'Kandang', 'Populasi Awal', 'Mortalitas', 'Afkir', 'Populasi Akhir', 'Catatan'],
      ...state.populationRecords.map(item => [item.date, getLocationName(state, item.coopId), item.opening, item.mortality, item.culled, item.closing, item.note]),
    ]
  }

  if (type === 'pakan') {
    return [
      ['Tanggal', 'Tipe', 'Kode Pakan', 'Tujuan', 'Jumlah (kg)', 'Catatan'],
      ...state.feedMovements.map(item => [item.date, item.type, item.feedCode, getLocationName(state, item.coopId), item.amount, item.note]),
    ]
  }

  if (type === 'kesehatan') {
    return [
      ['Tanggal', 'Kandang', 'Jenis', 'Produk/Kegiatan', 'Status', 'Catatan'],
      ...state.healthRecords.map(item => [item.date, getLocationName(state, item.coopId), item.type, item.product, item.status, item.note]),
    ]
  }

  const metrics = calculateFarmMetrics(state)
  return [
    ['Laporan Operasional FarmFlow', `${period.start} s/d ${period.end}`],
    ['Populasi aktif', metrics.totalPopulation],
    ['Mortalitas kumulatif', metrics.totalMortality],
    ['Mortalitas kumulatif (%)', formatNumber(metrics.mortalityRate, 3)],
    ['Stok pakan (kg)', metrics.totalFeedStock],
    ['Bobot rata-rata (kg)', formatNumber(metrics.averageWeight, 2)],
    [],
    ['Kandang', 'Populasi', 'Kapasitas', 'Umur (hari)', 'Bobot (kg)', 'Suhu (°C)', 'Kelembapan (%)'],
    ...state.coops.map(coop => [coop.name, coop.population, coop.capacity, coop.age, coop.weight, coop.temperature, coop.humidity]),
  ]
}

export function createCsvReport(type: ReportType, state: FarmState, period: ReportPeriod): string {
  const rows = buildRows(type, state, period)
  return `\uFEFF${rows.map(row => row.map(escapeCsv).join(';')).join('\n')}`
}
