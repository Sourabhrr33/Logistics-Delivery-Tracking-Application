// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Home from './pages/Home'
import CustomerHome from './pages/Customer/CustomerHome'
import CreateOrder from './pages/Customer/CreateOrder'
import Checkout from './pages/Customer/Checkout'
import OrdersList from './pages/Customer/OrdersList'
import OrderDetails from './pages/Customer/OrderDetails'
import DriverHome from './pages/Driver/DriverHome'
import AdminPanel from './pages/Admin/AdminPanel'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ProfilePage from './pages/Profile/ProfilePage'
import AuthenticatedLayout from './layouts/AuthenticatedLayout'

import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<PublicRoutes />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/customer" element={<CustomerHome />} />
            <Route path="/customer/create" element={<CreateOrder />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/orders" element={<OrdersList />} />
            <Route path="/customer/orders/:orderId" element={<OrderDetails />} />
            <Route path="/driver" element={<DriverHome />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}

export default App
