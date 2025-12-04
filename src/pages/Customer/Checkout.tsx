// src/pages/Customer/Checkout.tsx
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { createOrder } from '../../store/slices/deliveriesSlice'
import api from '../../api/axios'
import toast from 'react-hot-toast'


const Checkout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const data: any = location.state || {}
  const [processing, setProcessing] = useState(false)

  // If no data came through navigation
  if (!data?.customerId) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <p className="text-red-700 mb-2">Invalid order data.</p>
          <button
            onClick={() => navigate('/customer')}
            className="text-blue-600 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Mock pricing logic
  const amount = data.items.reduce(
    (sum: number, it: any) => sum + (it.qty || 1) * 100,
    0
  )

  const handlePay = async () => {
    setProcessing(true)

    try {
      // Step 1: Process Payment
      const res = await api.post('/payment/process', {
        amount,
        method: data.paymentMethod,
      })

      if (!res.data?.success) {
      toast.error('Payment failed (mock)')

        return
      }

      // Step 2: Create the order
      const newOrderPayload = {
        customerId: data.customerId,
        customerName: data.customerName,
        address: data.address,
        deliveryOption: data.deliveryOption,
        paymentMethod: data.paymentMethod,
        items: data.items,
      }

      const result: any = await dispatch(createOrder(newOrderPayload))

      if (result.error) {
        toast.error('Order creation failed')
        return
      }

     toast.success('Order placed successfully!')

      navigate(`/customer/orders/${result.payload.id}`)

    } catch (err) {
      toast.error('Payment failed (mock)')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600">Items</span>
          <span>{data.items.length}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">Delivery</span>
          <span>{data.deliveryOption}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-600">Payment</span>
          <span>{data.paymentMethod}</span>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount</span>
          <span>₹{amount}</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={processing}
        className="
          bg-green-600 text-white w-full p-3 rounded-lg 
          hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed
          transition shadow
        "
      >
        {processing ? 'Processing Payment...' : 'Pay & Place Order'}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full mt-3 text-blue-600 underline text-sm"
      >
        Go Back
      </button>
    </div>
  )
}

export default Checkout
