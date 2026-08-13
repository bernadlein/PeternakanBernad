import type {
  ActivityRecord,
  ActivityTone,
  FarmState,
  OperationMetadata,
  RecordActivityInput,
} from '~/domain/farm.types'
import { getLocationName } from './farm.selectors'
import { formatNumber } from '~/utils/formatters'

function cloneState(state: FarmState): FarmState {
  // JSON-safe domain model; this also removes Vue/Pinia reactive proxies.
  return JSON.parse(JSON.stringify(state)) as FarmState
}

function requirePositiveAmount(input: RecordActivityInput): number {
  const amount = Number(input.amount ?? 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Jumlah harus lebih besar dari nol.')
  }
  return amount
}

export function recordFarmActivity(
  currentState: FarmState,
  input: RecordActivityInput,
  metadata: OperationMetadata,
): FarmState {
  const state = cloneState(currentState)
  const selectedCoop = state.coops.find(coop => coop.id === input.coopId)
  let title = input.type
  let detail = `${input.note || 'Catatan operasional'} • ${getLocationName(state, input.coopId)}`
  let tone: ActivityTone = 'green'

  if (input.type === 'Mortalitas') {
    if (!selectedCoop) throw new Error('Kandang wajib dipilih.')
    const amount = requirePositiveAmount(input)
    const opening = selectedCoop.population
    selectedCoop.population = Math.max(0, opening - amount)
    selectedCoop.mortalityToday += amount
    state.populationRecords.unshift({
      id: metadata.id,
      date: input.date,
      coopId: selectedCoop.id,
      opening,
      mortality: amount,
      culled: 0,
      closing: selectedCoop.population,
      note: input.note || 'Mortalitas harian',
    })
    title = 'Mortalitas dicatat'
    detail = `${formatNumber(amount)} ekor • ${selectedCoop.name}`
    tone = 'red'
  } else if (input.type === 'Pakan masuk' || input.type === 'Pakan keluar') {
    const amount = requirePositiveAmount(input)
    const stock = state.feedStocks.find(item => item.code === input.feedCode)
    if (!stock) throw new Error('Jenis pakan tidak ditemukan.')
    const isInbound = input.type === 'Pakan masuk'
    if (!isInbound && amount > stock.stock) throw new Error('Stok pakan tidak mencukupi.')
    stock.stock += isInbound ? amount : -amount
    const movementType = isInbound ? 'Masuk' : 'Keluar'
    const location = isInbound ? 'GUDANG' : input.coopId
    state.feedMovements.unshift({
      id: metadata.id,
      date: input.date,
      type: movementType,
      feedCode: input.feedCode,
      coopId: location,
      amount,
      note: input.note || (isInbound ? 'Penerimaan pakan' : 'Distribusi pakan'),
    })
    detail = `${formatNumber(amount)} kg ${input.feedCode} • ${getLocationName(state, location)}`
    tone = isInbound ? 'blue' : 'green'
  } else if (input.type === 'Timbang sampel') {
    if (!selectedCoop) throw new Error('Kandang wajib dipilih.')
    const amount = requirePositiveAmount(input)
    selectedCoop.weight = amount
    detail = `${formatNumber(amount, 2)} kg • ${selectedCoop.name}`
    tone = 'blue'
  } else if (input.type === 'Vaksinasi' || input.type === 'Obat & vitamin') {
    const amount = Number(input.amount ?? 0)
    state.healthRecords.unshift({
      id: metadata.id,
      date: input.date,
      coopId: input.coopId,
      type: input.healthType,
      product: input.note || input.type,
      status: 'Selesai',
      note: amount > 0 ? `${formatNumber(amount)} dosis` : 'Sudah diberikan',
    })
    detail = `${input.note || input.healthType} • ${getLocationName(state, input.coopId)}`
    tone = 'amber'
  }

  const activity: ActivityRecord = {
    id: metadata.id,
    date: input.date,
    time: metadata.time,
    title,
    detail,
    coopId: input.coopId,
    tone,
  }
  state.activities.unshift(activity)
  state.activities = state.activities.slice(0, 30)
  return state
}

export function toggleFarmChecklist(state: FarmState, itemId: string): FarmState {
  const next = cloneState(state)
  const item = next.checklist.find(entry => entry.id === itemId)
  if (!item) throw new Error('Checklist tidak ditemukan.')
  item.done = !item.done
  return next
}
