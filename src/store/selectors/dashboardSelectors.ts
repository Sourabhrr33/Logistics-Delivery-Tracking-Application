import type { RootState } from '../index'

export const selectOrderStats = (state: RootState) => {
  const orders = state.deliveries.orders

  type Status = 'Placed' | 'Shipped' | 'In-Transit' | 'Delivered'

  const statusCounts: Record<Status, number> = {
    Placed: 0,
    Shipped: 0,
    'In-Transit': 0,
    Delivered: 0,
  }

  const timelineCounts: Record<string, number> = {}

  orders.forEach((order) => {
    // safely type status
    const status = (order.status ?? 'Placed') as Status
    statusCounts[status]++

    // 🔥 SAFE HANDLING (fix crash)
    const createdAt = order.createdAt ?? new Date().toISOString()
    const date = createdAt.split('T')[0]

    timelineCounts[date] = (timelineCounts[date] || 0) + 1
  })

  return {
    statusCounts,
    timelineCounts,
    totalOrders: orders.length,
  }
}
