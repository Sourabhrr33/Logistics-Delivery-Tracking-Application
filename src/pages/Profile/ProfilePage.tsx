// src/pages/Profile/ProfilePage.tsx
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import StatusBadge from '../../components/StatusBadge'

const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user)
  const orders = useAppSelector((s) => s.deliveries.orders)

  // Orders based on user role
  const myOrders = orders.filter((o) =>
    user?.role === 'customer'
      ? o.customerId === user.id
      : user?.role === 'driver'
      ? o.driverId === user.id
      : false
  )

  const delivered = myOrders.filter((o) => o.status === 'Delivered').length
  const inTransit = myOrders.filter((o) => o.status === 'In-Transit' || o.status === "Shipped").length
  const pending = myOrders.filter((o) => o.status === 'Placed').length

  return (
    <div className="p-4 pt-20 max-w-2xl mx-auto space-y-8">

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100 flex gap-4 items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <span className="inline-block mt-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            {user?.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="text-xs text-gray-500">Total</div>
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

        {user?.role === 'customer' && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          </div>
        )}
      </div>

      {/* History Header */}
      <h3 className="text-lg font-semibold">Order History</h3>

      {/* Order History List */}
      {myOrders.length === 0 ? (
        <div className="text-gray-500">No history available.</div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <Link
              key={o.id}
              to={
                user?.role === "customer"
                  ? `/customer/orders/${o.id}`
                  : `/driver`
              }
              className="block bg-white rounded-lg shadow p-4 border border-gray-100 hover:bg-gray-50 transition"
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

export default ProfilePage
