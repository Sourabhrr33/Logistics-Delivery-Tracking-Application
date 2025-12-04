// src/api/deliveries.ts
import api from './axios'
import type { Order } from '../store/slices/deliveriesSlice'

export const getOrders = () => api.get<{ orders: Order[] }>('/orders')
export const postOrder = (payload: any) => api.post('/orders', payload)
export const getOrder = (id: string) => api.get<{ order: Order }>(`/orders/${id}`)
export const putOrderStatus = (id: string, status: Order['status']) => api.put(`/orders/${id}/status`, { status })
export const postPayment = (payload: { amount: number; method: string }) => api.post('/payment/process', payload)
