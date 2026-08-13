import type { ActivityType } from './farm.types'

export const FARM_STORAGE_KEY = 'farmflow-ayam-v2'
export const LEGACY_FARM_STORAGE_KEYS = ['farmflow-ayam-v1']
export const DAILY_MORTALITY_LIMIT = 0.08
export const ACTIVE_CYCLE = 8
export const CYCLE_DAY = 26
export const ESTIMATED_HARVEST_DAYS = 17

export const ACTIVITY_TYPES: ActivityType[] = [
  'Pakan keluar',
  'Pakan masuk',
  'Mortalitas',
  'Timbang sampel',
  'Vaksinasi',
  'Obat & vitamin',
  'Inspeksi kandang',
]

export const WEEKLY_FEED_USAGE = [
  { day: 'Sab', value: 4.8 },
  { day: 'Min', value: 5.1 },
  { day: 'Sen', value: 5.4 },
  { day: 'Sel', value: 5.7 },
  { day: 'Rab', value: 5.9 },
  { day: 'Kam', value: 6.1 },
  { day: 'Jum', value: 6.2 },
]
