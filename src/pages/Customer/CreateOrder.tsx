// src/pages/Customer/CreateOrder.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import toast from 'react-hot-toast'


type Item = { name: string; qty: number }
type DeliveryOption = 'Standard' | 'Express' | 'Same-day'
type PaymentMethod = 'Card' | 'UPI' | 'COD'

const CreateOrder: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user)
  const navigate = useNavigate()

  const [items, setItems] = useState<Item[]>([{ name: '', qty: 1 }])
  const [address, setAddress] = useState('')
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('Standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card')

  const addItem = () =>
    setItems([...items, { name: '', qty: 1 }])

  const removeItem = (idx: number) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

// const [items, setItems] = useState<Item[]>([{ name: '', qty: 1 }])

const updateItem = (idx: number, key: keyof Item, value: any) => {
  setItems((prev) =>
    prev.map((it, i) =>
      i === idx ? { ...it, [key]: value } : it
    )
  )
}



  const goToCheckout = () => {
    if (!address.trim()) return toast.error('Enter address')
    if (items.some((i) => !i.name.trim() || i.qty < 1)) return toast.error('Fill valid items')

    navigate('/customer/checkout', {
      state: {
        customerId: user?.id,
        customerName: user?.name,
        items,
        address,
        deliveryOption,
        paymentMethod,
      },
    })
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Order</h2>

      {/* Address */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <label className="block text-sm font-medium mb-1">Shipping Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded resize-none min-h-[80px]"
          placeholder="Enter full delivery address..."
        />
      </div>

      {/* Items */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <label className="block text-sm font-medium mb-2">Items</label>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={item.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                placeholder="Item name"
                className="flex-1 border p-2 rounded"
              />

              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) =>
                  updateItem(idx, 'qty', Number(e.target.value))
                }
                className="w-20 border p-2 rounded text-center"
              />

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-500 text-lg px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addItem}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add item
          </button>
        </div>
      </div>

      {/* Delivery Option */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <label className="block text-sm font-medium mb-1">
          Delivery Option
        </label>
        <select
          value={deliveryOption}
          onChange={(e) =>
            setDeliveryOption(e.target.value as DeliveryOption)
          }
          className="w-full border p-2 rounded"
        >
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
          <option value="Same-day">Same-day</option>
        </select>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium mb-1">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value as PaymentMethod)
          }
          className="w-full border p-2 rounded"
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>

      {/* Proceed Button */}
      <button
        onClick={goToCheckout}
        className="
          bg-blue-600 text-white w-full p-3 rounded-lg 
          hover:bg-blue-700 transition shadow
        "
      >
        Proceed to Checkout
      </button>
    </div>
  )
}

export default CreateOrder
