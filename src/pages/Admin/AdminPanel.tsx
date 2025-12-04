// src/pages/Admin/AdminPanel.tsx
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchOrders } from '../../store/slices/deliveriesSlice'
import api from '../../api/axios'
import AdminDashboardCharts from '../../components/AdminDashboardCharts'  
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'



const AdminPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((s) => s.deliveries)
  const [drivers, setDrivers] = useState<any[]>([])

  useEffect(() => {
    dispatch(fetchOrders())

    api.get('/users').then((r) =>
      setDrivers(r.data.users.filter((u: any) => u.role === 'driver'))
    )
  }, [dispatch])

  const assignDriver = async (orderId: string, driverId: string) => {
    try {
      await api.post(`/orders/${orderId}/assign`, { driverId })
      dispatch(fetchOrders())
    } catch (err) {
     toast.error('Failed to assign driver')
    }
  }

  const changeStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      dispatch(fetchOrders())
    } catch (err) {
     toast.error('Failed to update status')
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`)
      dispatch(fetchOrders())
    } catch (err) {
     toast.error('Failed to delete order')
    }
  }

 return (
  <div className="p-4 pt-20 max-w-4xl mx-auto">

    <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

    {/* Charts */}
    <AdminDashboardCharts />

    <h3 className="text-xl font-semibold mt-8 mb-3">Manage Orders</h3>

    {loading ? (
      <div className="text-center py-6 text-gray-500">Loading...</div>
    ) : orders.length === 0 ? (
      <div className="text-center py-6 text-gray-400">No orders found.</div>
    ) : (
      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-semibold">
                  {o.id} — {o.customerName}
                </div>
                <div className="text-sm text-gray-500">{o.address}</div>
              </div>

              {/* Status Badge */}
              <StatusBadge status={o.status} />
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap gap-3">

              {/* Assign Driver */}
              <select
                defaultValue={o.driverId || ''}
                onChange={(e) => assignDriver(o.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm bg-gray-50"
              >
                <option value="">Assign Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Change Status */}
              <select
                defaultValue={o.status}
                onChange={(e) => changeStatus(o.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm bg-gray-50"
              >
                <option>Placed</option>
                <option>Shipped</option>
                <option>In-Transit</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => deleteOrder(o.id)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

}

export default AdminPanel
