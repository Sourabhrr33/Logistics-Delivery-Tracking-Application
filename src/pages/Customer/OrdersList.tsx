// src/pages/Customer/OrdersList.tsx
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchOrders } from '../../store/slices/deliveriesSlice'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'

const OrdersList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((s) => s.deliveries)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const myOrders = orders.filter((o) => o.customerId === user?.id)

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <Link key={o.id} to={`/customer/orders/${o.id}`} className="block bg-white p-3 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-sm text-slate-500">{o.address}</div>
                </div>
               <StatusBadge status={o.status} />

              </div>
            </Link>
          ))}
          {myOrders.length === 0 && <div className="text-sm text-slate-500">No orders yet.</div>}
        </div>
      )}
    </div>
  )
}

export default OrdersList
