import type { FarmMetrics, FarmState, LocationId } from '~/domain/farm.types'

export function calculateFarmMetrics(state: FarmState): FarmMetrics {
  const totalCapacity = state.coops.reduce((sum, coop) => sum + coop.capacity, 0)
  const totalPopulation = state.coops.reduce((sum, coop) => sum + coop.population, 0)
  const totalMortality = totalCapacity - totalPopulation
  const todayMortality = state.coops.reduce((sum, coop) => sum + coop.mortalityToday, 0)
  const averageWeight = state.coops.reduce((sum, coop) => sum + coop.weight, 0) / Math.max(state.coops.length, 1)
  const totalFeedStock = state.feedStocks.reduce((sum, feed) => sum + feed.stock, 0)
  const dailyFeedUse = state.coops.reduce((sum, coop) => sum + coop.feedToday, 0)

  return {
    totalCapacity,
    totalPopulation,
    totalMortality,
    todayMortality,
    mortalityRate: totalCapacity ? (totalMortality / totalCapacity) * 100 : 0,
    survivalRate: totalCapacity ? (totalPopulation / totalCapacity) * 100 : 0,
    averageWeight,
    totalFeedStock,
    dailyFeedUse,
    feedRunway: dailyFeedUse ? totalFeedStock / dailyFeedUse : 0,
    fcr: 1.46,
  }
}

export function getLocationName(state: FarmState, locationId: LocationId): string {
  if (locationId === 'ALL') return 'Semua kandang'
  if (locationId === 'GUDANG') return 'Gudang pakan'
  return state.coops.find(coop => coop.id === locationId)?.name ?? locationId
}

export function getCompletedChecklistCount(state: FarmState): number {
  return state.checklist.filter(item => item.done).length
}

export function isFeedBelowMinimum(stock: number, minimum: number): boolean {
  return stock < minimum
}
