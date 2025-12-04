// src/pages/Customer/CustomerHome.tsx
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchOrders } from '../../store/slices/deliveriesSlice'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'

const CustomerHome: React.FC = () => {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((s) => s.deliveries)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const myOrders = orders ? orders.filter((o) => o.customerId === user?.id) : []

  const delivered = myOrders.filter((o) => o.status === 'Delivered').length
  const inTransit = myOrders.filter(
    (o) => o.status === 'In-Transit' || o.status === 'Shipped'
  ).length
  const pending = myOrders.filter((o) => o.status === 'Placed').length

  return (
    <div className="p-4 pt-20 max-w-3xl mx-auto space-y-6">

      {/* Greeting */}
      <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-xs text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{myOrders.length}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-xs text-gray-500">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{delivered}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-xs text-gray-500">In Transit</div>
          <div className="text-2xl font-bold text-blue-600">{inTransit}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-xs text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
        </div>
      </div>

      {/* Recent Orders Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Link
          to="/customer/create"
          className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm"
        >
          + Create Order
        </Link>
      </div>

      {/* Order List */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : myOrders.length === 0 ? (
        <div className="text-gray-500 text-sm pt-4">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.slice(0, 5).map((o) => (
            <Link
              key={o.id}
              to={`/customer/orders/${o.id}`}
              className="block bg-white rounded-lg shadow border border-gray-100 p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{o.id}</div>
                  <div className="text-sm text-gray-500">{o.address}</div>
                </div>

                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerHome
