export type CoopId = 'KD-01' | 'KD-02'
export type LocationId = CoopId | 'ALL' | 'GUDANG'
export type ActivityTone = 'green' | 'red' | 'blue' | 'amber'
export type FeedMovementType = 'Masuk' | 'Keluar'
export type HealthStatus = 'Selesai' | 'Terjadwal'

export type ActivityType =
  | 'Pakan keluar'
  | 'Pakan masuk'
  | 'Mortalitas'
  | 'Timbang sampel'
  | 'Vaksinasi'
  | 'Obat & vitamin'
  | 'Inspeksi kandang'

export interface Coop {
  id: CoopId
  name: string
  capacity: number
  population: number
  age: number
  weight: number
  temperature: number
  humidity: number
  mortalityToday: number
  feedToday: number
  status: 'Normal' | 'Perhatian'
}

export interface ActivityRecord {
  id: number
  date: string
  time: string
  title: string
  detail: string
  coopId: LocationId
  tone: ActivityTone
}

export interface PopulationRecord {
  id: number
  date: string
  coopId: CoopId
  opening: number
  mortality: number
  culled: number
  closing: number
  note: string
}

export interface FeedStock {
  code: string
  name: string
  phase: string
  stock: number
  minimum: number
  lastDelivery: string
}

export interface FeedMovement {
  id: number
  date: string
  type: FeedMovementType
  feedCode: string
  coopId: LocationId
  amount: number
  note: string
}

export interface HealthRecord {
  id: number
  date: string
  coopId: LocationId
  type: string
  product: string
  status: HealthStatus
  note: string
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface FarmState {
  coops: Coop[]
  activities: ActivityRecord[]
  populationRecords: PopulationRecord[]
  feedStocks: FeedStock[]
  feedMovements: FeedMovement[]
  healthRecords: HealthRecord[]
  checklist: ChecklistItem[]
}

export interface RecordActivityInput {
  type: ActivityType
  date: string
  coopId: LocationId
  amount: number | null
  feedCode: string
  healthType: string
  note: string
}

export interface OperationMetadata {
  id: number
  time: string
}

export interface FarmMetrics {
  totalCapacity: number
  totalPopulation: number
  totalMortality: number
  todayMortality: number
  mortalityRate: number
  survivalRate: number
  averageWeight: number
  totalFeedStock: number
  dailyFeedUse: number
  feedRunway: number
  fcr: number
}

export type ReportType = 'operasional' | 'populasi' | 'pakan' | 'kesehatan'

export interface ReportPeriod {
  start: string
  end: string
}
