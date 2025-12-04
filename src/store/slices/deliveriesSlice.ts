// src/store/slices/deliveriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export type DeliveryItem = { name: string; qty: number }
export type DeliveryOption = 'Standard' | 'Express' | 'Same-day'
export type PaymentMethod = 'Card' | 'UPI' | 'COD'

export type Order = {
  id: string
  customerId: string
  customerName?: string
  status: 'Placed' | 'Shipped' | 'In-Transit' | 'Delivered' | 'Cancelled'
  address: string
  deliveryOption: DeliveryOption
  paymentMethod: PaymentMethod
  items: DeliveryItem[]
  timeline: { status: string; time: string }[]
  driverId?: string | null
  proofImageUrl?: string | null
  createdAt: string
}

type DeliveriesState = {
  orders: Order[]
  loading: boolean
  error: string | null
  currentOrder: Order | null
}

const initialState: DeliveriesState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null
}

export const fetchOrders = createAsyncThunk('deliveries/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders')
    return res.data.orders as Order[]
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch orders')
  }
})

export const createOrder = createAsyncThunk(
  'deliveries/createOrder',
  async (payload: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'status'> & { customerId: string; customerName?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/orders', payload)
      return res.data.order as Order
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create order')
    }
  }
)

export const getOrderById = createAsyncThunk('deliveries/getOrderById', async (orderId: string, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${orderId}`)
    return res.data.order as Order
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to get order')
  }
})

export const updateOrderStatus = createAsyncThunk(
  'deliveries/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status })
      return res.data.order as Order
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update order')
    }
  }
)

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.currentOrder = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => {
        s.loading = true; s.error = null
      })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false; s.orders = a.payload
      })
      .addCase(fetchOrders.rejected, (s, a) => {
        s.loading = false; s.error = a.payload as string
      })

      .addCase(createOrder.pending, (s) => { s.loading = true; s.error = null })
      .addCase(createOrder.fulfilled, (s, a) => {
        s.loading = false
        s.orders.unshift(a.payload)
      })
      .addCase(createOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload as string })

      .addCase(getOrderById.pending, (s) => { s.loading = true; s.error = null })
      .addCase(getOrderById.fulfilled, (s, a) => { s.loading = false; s.currentOrder = a.payload })
      .addCase(getOrderById.rejected, (s, a) => { s.loading = false; s.error = a.payload as string })

      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        // update in list + current
        s.orders = s.orders.map((o) => (o.id === a.payload.id ? a.payload : o))
        if (s.currentOrder?.id === a.payload.id) s.currentOrder = a.payload
      })
  }
})

export const { clearCurrent } = deliveriesSlice.actions
export default deliveriesSlice.reducer
