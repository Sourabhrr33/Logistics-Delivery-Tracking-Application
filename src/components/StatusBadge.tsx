import React from 'react'

const COLORS: Record<string, string> = {
  Placed: 'bg-gray-200 text-gray-700',
  Shipped: 'bg-blue-200 text-blue-700',
  'In-Transit': 'bg-yellow-200 text-yellow-700',
  Delivered: 'bg-green-200 text-green-700',
  Cancelled: 'bg-red-200 text-red-700',
}

const StatusBadge = ({ status }: { status: string }) => {
  const style = COLORS[status] ?? 'bg-gray-200 text-gray-700'

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

export default StatusBadge
