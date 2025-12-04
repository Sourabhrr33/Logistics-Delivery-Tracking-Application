

# 📦 VedaPixel – Logistics & Delivery Tracking Application

A role-based logistics platform where **Customers**, **Drivers**, and **Admins** manage deliveries end-to-end.
Built using **React + TypeScript + Redux + MSW** with a fully mocked backend.

---

# 🚀 Features Overview

### 🔐 **Authentication (Mocked)**

* Signup
* Login
* OTP verification
* Forgot password
* Role-based routing
* Session persistence (localStorage)

### 🧍 Roles Supported

* **Customer**
* **Driver**
* **Admin**

---

# 👤 Customer Features

### 🛒 Order Creation

* Address input
* Delivery type: Standard / Express / Same-day
* Payment simulation (mock Stripe-like)
* Checkout success screen

### 📦 Order Tracking

* Full timeline:
  `Placed → Assigned → Accepted → In-Transit → Delivered`
* Shipment status updates
* Proof of delivery display
* Order history

### 🔔 Notifications

* Driver assigned
* Order in-transit
* Order delivered

---

# 🚚 Driver Features

### 📋 Dashboard

* View assigned deliveries
* Customer details, address, status

### Actions

* Accept delivery
* Start transit
* Mark delivered
* Upload proof image

---

# 🛠 Admin Features

### 📋 Order Management

* View all orders
* Assign drivers
* Change status
* Delete orders

### 📊 Dashboard with Charts

* Orders by status (Pie Chart)
* Orders over time (Line Chart)

---

# 🧩 State Management

Using **Redux Toolkit**, slices include:

* `authSlice`
* `deliveriesSlice`
* `notificationsSlice`

Async flows handled with:

```
createAsyncThunk + axios
```

---

# 🧪 Mock Backend (MSW)

The entire backend is powered by:

```
Mock Service Worker (MSW v2)
```

Includes handlers for:

* `/api/auth/*`
* `/api/orders/*`
* `/api/users`
* `/api/upload`
* Payment simulation
* Push notification event bus

MSW stores data in memory so the flow behaves like a real backend.

---

# 📂 Folder Structure

```
src/
 ├── api/
 │    └── axios.ts
 ├── components/
 │    ├── TopNav.tsx
 │    ├── NotificationsPanel.tsx
 │    └── AdminDashboardCharts.tsx
 ├── mocks/
 │    ├── handlers.ts
 │    ├── browser.ts
 │    └── notify.ts
 ├── pages/
 │    ├── Auth/
 │    ├── Customer/
 │    ├── Driver/
 │    └── Admin/
 ├── store/
 │    ├── slices/
 │    ├── selectors/
 │    └── index.ts
 ├── App.tsx
 └── main.tsx
```

---

# 🛠 Setup Instructions

### 1️⃣ Clone repo

```bash
git clone 
cd vedapixel-logistics-app
```

### 2️⃣ Install dependencies

```bash
npm install
```


### 4️⃣ Run app

```bash
npm run dev
```

### 5️⃣ Important: If handlers are updated

Go to browser → DevTools → **Application → Service Workers → Unregister** → Refresh.

---

# 🔐 Test Credentials

### Admin

```
email: admin@vp.test
password: admin123
```

### Driver

```
email: driver@vp.test
password: driver123
```

### Customer

(You create via signup)

---

# 🧪 How to Test Each User Flow

## CUSTOMER

1. Signup → OTP → Login
2. Create order
3. Checkout
4. View timeline
5. Wait for driver updates
6. Receive notifications

## ADMIN

1. Login
2. Check dashboard charts
3. Assign driver
4. Update status
5. Delete order

## DRIVER

1. Login
2. Accept order
3. Start transit
4. Mark delivered
5. Upload proof

---

# 🧠 Architecture Summary

The project uses:

### ✔ React + TypeScript

### ✔ Redux Toolkit

### ✔ MSW (Mock Server + Push Events)

### ✔ Recharts (Admin dashboard charts)

### ✔ Axios

### ✔ Role-based routing

### ✔ In-memory DB simulation

---

# 🚀 Scaling to 100K Users

If this app went to production:

### ✔ Use real backend (Node.js + PostgreSQL / MongoDB)

### ✔ WebSockets for real-time driver tracking

### ✔ Redis for caching frequently accessed queries

### ✔ Load-balanced microservices

### ✔ CDN for proof image delivery

### ✔ Server-driven push notifications (Firebase / WebPush)

### ✔ Background jobs (BullMQ) for handling logistics workflows

### ✔ Message queues (Kafka/RabbitMQ) for event-driven architecture

---


# 🎉 Final Notes

This app demonstrates:

* Clean architecture
* Modular Redux slices
* Proper async flows
* Full multi-role workflow
* Dashboard analytics
* Professional frontend engineering
