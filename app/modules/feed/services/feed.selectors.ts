import type { FeedAlert, FeedMetrics, FeedPurchaseOrder, FeedState } from '../domain/feed.types'

export function getOpenPurchaseOrders(state: FeedState): FeedPurchaseOrder[] {
  return state.purchaseOrders.filter(item => item.status === 'OPEN' || item.status === 'PARTIAL')
}

export function getRemainingPurchaseOrderQuantity(order: FeedPurchaseOrder): number {
  return order.lines.reduce(
    (total, line) => total + Math.max(0, line.orderedQuantity - line.receivedQuantity),
    0,
  )
}

export function calculateFeedMetrics(state: FeedState): FeedMetrics {
  const runway = state.products
    .filter(item => item.dailyConsumption > 0)
    .map(item => item.currentStock / item.dailyConsumption)
  const openOrders = getOpenPurchaseOrders(state)

  const latestPrice = new Map<string, number>()
  for (const order of state.purchaseOrders) {
    for (const line of order.lines) {
      if (!latestPrice.has(line.feedCode)) latestPrice.set(line.feedCode, line.pricePerKg)
    }
  }

  return {
    totalStock: state.products.reduce((total, item) => total + item.currentStock, 0),
    lowStockCount: state.products.filter(item => item.currentStock <= item.minimumStock).length,
    minimumRunwayDays: runway.length ? Math.min(...runway) : 0,
    openPurchaseOrderCount: openOrders.length,
    openPurchaseOrderQuantity: openOrders.reduce((total, item) => total + getRemainingPurchaseOrderQuantity(item), 0),
    estimatedInventoryValue: state.products.reduce(
      (total, item) => total + item.currentStock * (latestPrice.get(item.code) ?? 0),
      0,
    ),
  }
}

export function getFeedAlerts(state: FeedState): FeedAlert[] {
  return state.products.flatMap((product) => {
    const runwayDays = product.dailyConsumption > 0
      ? product.currentStock / product.dailyConsumption
      : Number.POSITIVE_INFINITY
    const isLowStock = product.currentStock <= product.minimumStock
    const isCritical = runwayDays <= 2
    if (!isLowStock && runwayDays > 4) return []

    return [{
      feedCode: product.code,
      title: isCritical ? `Stok ${product.code} kritis` : `Stok ${product.code} perlu perhatian`,
      message: Number.isFinite(runwayDays)
        ? `Sisa ${product.currentStock.toLocaleString('id-ID')} kg, cukup sekitar ${runwayDays.toFixed(1)} hari.`
        : `Sisa ${product.currentStock.toLocaleString('id-ID')} kg, di bawah batas minimum ${product.minimumStock.toLocaleString('id-ID')} kg.`,
      severity: isCritical ? 'critical' : 'warning',
      runwayDays,
    } satisfies FeedAlert]
  })
}
