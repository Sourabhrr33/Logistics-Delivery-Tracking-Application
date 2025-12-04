// src/pages/Driver/DriverHome.tsx
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchOrders, updateOrderStatus } from '../../store/slices/deliveriesSlice'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'


const DriverHome: React.FC = () => {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((s) => s.deliveries)
  const user = useAppSelector((s) => s.auth.user)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const myAssigned = orders.filter((o) => o.driverId === user?.id)

  const acceptOrder = async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/accept`, { driverId: user?.id })
      dispatch(fetchOrders())
      toast.success('Accepted')
    } catch {
      toast.error('Failed to accept')
    }
  }

type OrderStatus = "Placed" | "Shipped" | "In-Transit" | "Delivered" | "Cancelled"

const changeStatus = async (orderId: string, status: OrderStatus) => {
  await dispatch(updateOrderStatus({ orderId, status }))
}

  const uploadProof = async (orderId: string, file: File | null) => {
    if (!file) return alert('No file')
    setUploadingFor(orderId)

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await api.post('/upload', fd)
      const url = res.data.url

      await api.put(`/orders/${orderId}/status`, { status: 'Delivered' })
      await api.put(`/orders/${orderId}/proof`, { proofUrl: url })

      dispatch(fetchOrders())
      alert('Proof uploaded and order marked Delivered')
    } catch {
      alert('Upload failed')
    } finally {
      setUploadingFor(null)
    }
  }

  return (
    <div className="p-4 pt-20 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Driver Dashboard — {user?.name}
      </h2>

      {loading ? (
        <div className="text-gray-500 text-center py-6">Loading...</div>
      ) : myAssigned.length === 0 ? (
        <div className="text-gray-500 text-center py-6">
          No assigned deliveries.
        </div>
      ) : (
        <div className="space-y-4">
          {myAssigned.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-semibold">{o.id}</div>
                  <div className="text-sm text-gray-600">{o.address}</div>
                </div>

                <StatusBadge status={o.status} />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {o.status === 'Placed' && (
                  <button
                    onClick={() => acceptOrder(o.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Accept Delivery
                  </button>
                )}

                {o.status === 'Shipped' && (
                  <button
                    onClick={() => changeStatus(o.id, 'In-Transit')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Start Transit
                  </button>
                )}

                {o.status === 'In-Transit' && (
                  <button
                    onClick={() => changeStatus(o.id, 'Delivered')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>

              {/* Upload Proof */}
              {o.status === 'Delivered' && !o.proofImageUrl && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">
                    Upload Proof
                  </label>

                  <label className="mt-2 inline-block px-3 py-1 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200 text-sm">
                    {uploadingFor === o.id ? 'Uploading...' : 'Choose File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        uploadProof(o.id, e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
              )}

              {/* Proof Preview */}
              {o.proofImageUrl && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Proof Uploaded:
                  </div>

                  <img
                    src={o.proofImageUrl}
                    alt="Proof"
                    className="rounded shadow border w-full max-w-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DriverHome
