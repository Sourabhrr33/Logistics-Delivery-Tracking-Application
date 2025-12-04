// src/pages/Customer/OrderDetails.tsx
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getOrderById } from '../../store/slices/deliveriesSlice'
import StatusBadge from '../../components/StatusBadge'

const ICONS: Record<string, string> = {
  Placed: '📦',
  Shipped: '🚚',
  'In-Transit': '🔄',
  Delivered: '✅',
  'Proof uploaded': '🖼',
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const dispatch = useAppDispatch()
  const { currentOrder, loading } = useAppSelector((s) => s.deliveries)

  useEffect(() => {
    if (orderId) dispatch(getOrderById(orderId))
  }, [dispatch, orderId])

  if (loading || !currentOrder)
    return <div className="p-4 pt-20 text-center">Loading...</div>

  return (
    <div className="p-4 pt-20 max-w-2xl mx-auto space-y-6">

      {/* Title Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{currentOrder.id}</h2>
            <p className="text-sm text-gray-500">{currentOrder.address}</p>
          </div>
          <StatusBadge status={currentOrder.status} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p><strong>Payment:</strong> {currentOrder.paymentMethod}</p>
          <p><strong>Delivery Option:</strong> {currentOrder.deliveryOption}</p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Delivery Timeline</h3>

        <div className="space-y-4">
          {currentOrder.timeline.map((t, idx) => (
            <div key={idx} className="flex items-start gap-3">

              {/* Icon + connecting line */}
              <div className="flex flex-col items-center">
                <span className="text-xl">{ICONS[t.status] ?? '📦'}</span>

                {idx < currentOrder.timeline.length - 1 && (
                  <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
                )}
              </div>

              {/* Content */}
              <div className="">
                <div className="font-medium">{t.status}</div>
                <div className="text-xs text-gray-500">
                  {new Date(t.time).toLocaleString()}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Proof Section */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <h3 className="text-lg font-semibold mb-2">Proof of Delivery</h3>

        {currentOrder.proofImageUrl ? (
          <img
            src={currentOrder.proofImageUrl}
            alt="Proof"
            className="rounded shadow border w-full max-w-md"
          />
        ) : (
          <p className="text-sm text-gray-500">No proof uploaded yet.</p>
        )}
      </div>

    </div>
  )
}

export default OrderDetails
