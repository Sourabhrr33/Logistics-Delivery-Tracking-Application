// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import seed from './data/seed.json'
import { v4 as uuidv4 } from 'uuid'
import { pushNotificationEvent } from './notify'

// -------------------------------------------------
// In-memory DB
// -------------------------------------------------
const ORDERS: any[] = [...seed.orders.map((o: any) => ({ ...o }))] // clone orders
const USERS: any[] = [...seed.users] // clone users

// Debug log every intercepted request
http.all('*', ({ request }) => {
  console.log('MSW Intercepted:', request.method, request.url)
  return undefined
})

// -------------------------------------------------
// Handlers array
// -------------------------------------------------
export const handlers = [
  // -------------------------------------------------
  // AUTH — LOGIN
  // -------------------------------------------------
  http.post('/api/auth/login', async ({ request }) => {
    type LoginBody = { email: string; password: string }
    const { email, password } = (await request.json()) as LoginBody

    const user = USERS.find((u) => u.email === email && u.password === password)
    if (!user)
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })

    const { password: _p, ...safe } = user
    return HttpResponse.json({ user: safe, token: 'mock-token-' + safe.id })
  }),

  // -------------------------------------------------
  // AUTH — SIGNUP
  // -------------------------------------------------
  http.post('/api/auth/signup', async ({ request }) => {
    type SignupBody = { name: string; email: string; password: string }
    const body = (await request.json()) as SignupBody

    const newUser = {
      id: 'u_' + uuidv4(),
      name: body.name,
      email: body.email,
      role: 'customer',
      password: body.password,
    }

    USERS.push(newUser)
    const { password: _p, ...safe } = newUser

    return HttpResponse.json(
      { success: true, user: safe, message: 'Signup successful (mocked)' },
      { status: 200 }
    )
  }),

  // -------------------------------------------------
  // AUTH — SEND OTP
  // -------------------------------------------------
  http.post('/api/auth/send-otp', async () => {
    return HttpResponse.json({ otp: '1234', message: 'OTP sent (mock)' })
  }),

  // -------------------------------------------------
  // AUTH — VERIFY OTP
  // -------------------------------------------------
  http.post('/api/auth/verify-otp', async ({ request }) => {
    type VerifyOtpBody = { otp: string }
    const { otp } = (await request.json()) as VerifyOtpBody

    if (otp === '1234') return HttpResponse.json({ valid: true })
    return HttpResponse.json({ valid: false }, { status: 400 })
  }),

  http.post('*/api/auth/forgot-password', async () => {
  return HttpResponse.json({
    success: true,
    message: 'Reset link sent (mock)'
  })
}),

  // -------------------------------------------------
  // GET ALL USERS (Admin)
  // -------------------------------------------------
  http.get('/api/users', () => {
    const safeUsers = USERS.map((u) => {
      const { password: _p, ...rest } = u
      return rest
    })
    return HttpResponse.json({ users: safeUsers })
  }),

  // -------------------------------------------------
  // GET ALL ORDERS
  // -------------------------------------------------
  http.get('/api/orders', () => {
    return HttpResponse.json({ orders: ORDERS })
  }),

  // -------------------------------------------------
  // CREATE ORDER (Customer)
  // -------------------------------------------------
  http.post('/api/orders', async ({ request }) => {
    type CreateOrderBody = {
      customerId: string
      customerName?: string
      address: string
      deliveryOption: string
      paymentMethod: string
      items: any[]
    }

    const body = (await request.json()) as CreateOrderBody
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date().toISOString()

    const newOrder = {
      id,
      ...body,
      status: 'Placed',
      timeline: [{ status: 'Placed', time: now }],
      createdAt: now,
      driverId: null,
      proofImageUrl: null,
    }

    ORDERS.unshift(newOrder)
    return HttpResponse.json({ order: newOrder }, { status: 201 })
  }),

  // -------------------------------------------------
  // GET ORDER BY ID
  // -------------------------------------------------
  http.get('/api/orders/:orderId', ({ params }) => {
    const order = ORDERS.find((o) => o.id === params.orderId)
    if (!order)
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 })

    return HttpResponse.json({ order })
  }),

  // -------------------------------------------------
  // ASSIGN DRIVER (Admin)
  // -------------------------------------------------
http.post('/api/orders/:orderId/assign', async ({ params, request }) => {
  type AssignBody = { driverId: string }
  const { driverId } = (await request.json()) as AssignBody

  console.log('ASSIGN HANDLER HIT →', params.orderId, driverId)

  const order = ORDERS.find((o) => o.id === params.orderId)
  if (!order) {
    return HttpResponse.json(
      { message: 'Order not found' },
      { status: 404 }
    )
  }

  // Assign driver
  order.driverId = driverId

  // ❗ DO NOT CHANGE STATUS HERE
  // order.status = 'Shipped'  ← THIS WAS CAUSING THE BUG

  // Add timeline log
  order.timeline.push({
    status: 'Driver Assigned',
    time: new Date().toISOString(),
  })

  // Notify driver
  pushNotificationEvent({
    id: 'n-' + Math.random(),
    roleTarget: 'driver',
    message: `New delivery assigned: ${order.id}`,
    createdAt: new Date().toISOString(),
  })

  return HttpResponse.json({ order })
}),

  // -------------------------------------------------
  // DRIVER ACCEPT
  // -------------------------------------------------
http.post('/api/orders/:orderId/accept', async ({ params, request }) => {
  type Body = { driverId: string }
  const { driverId } = (await request.json()) as Body

  const order = ORDERS.find((o) => o.id === params.orderId)
  if (!order)
    return HttpResponse.json({ message: 'Order not found' }, { status: 404 })

  order.driverId = driverId
  order.status = 'Shipped'              // ✔ Correct place to update status
  order.timeline.push({
    status: 'Accepted by driver',
    time: new Date().toISOString(),
  })

  return HttpResponse.json({ order })
}),

  // -------------------------------------------------
  // UPDATE ORDER STATUS (Driver)
  // -------------------------------------------------
  http.put('/api/orders/:orderId/status', async ({ params, request }) => {
    type StatusBody = { status: string }
    const { status } = (await request.json()) as StatusBody

    const order = ORDERS.find((o) => o.id === params.orderId)
    if (!order)
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    order.status = status
    order.timeline.push({ status, time: new Date().toISOString() })

    // notifications
    if (status === 'In-Transit') {
      pushNotificationEvent({
        id: 'n-' + Math.random(),
        roleTarget: 'customer',
        message: `Your order ${order.id} is now In Transit`,
        createdAt: new Date().toISOString(),
      })
    }

    if (status === 'Delivered') {
      pushNotificationEvent({
        id: 'n-' + Math.random(),
        roleTarget: 'customer',
        message: `Your order ${order.id} was delivered`,
        createdAt: new Date().toISOString(),
      })
    }

    return HttpResponse.json({ order })
  }),

  // -------------------------------------------------
  // UPLOAD PROOF
  // -------------------------------------------------
  http.post('/api/upload', async () => {
    const url =
      'https://placehold.co/600x400?text=proof-' +
      Math.floor(Math.random() * 10000)
    return HttpResponse.json({ url })
  }),

  // -------------------------------------------------
  // SAVE PROOF URL
  // -------------------------------------------------
  http.put('/api/orders/:orderId/proof', async ({ params, request }) => {
    type ProofBody = { proofUrl: string }
    const { proofUrl } = (await request.json()) as ProofBody

    const order = ORDERS.find((o) => o.id === params.orderId)
    if (!order)
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    order.proofImageUrl = proofUrl
    order.timeline.push({
      status: 'Proof uploaded',
      time: new Date().toISOString(),
    })

    return HttpResponse.json({ order })
  }),

  // -------------------------------------------------
  // DELETE ORDER
  // -------------------------------------------------
  http.delete('/api/orders/:orderId', ({ params }) => {
    const index = ORDERS.findIndex((o) => o.id === params.orderId)
    if (index === -1)
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 })

    ORDERS.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // -------------------------------------------------
  // PAYMENT SIMULATION
  // -------------------------------------------------
  http.post('/api/payment/process', async () => {
    return HttpResponse.json({
      success: true,
      transactionId: uuidv4(),
    })
  }),
]
