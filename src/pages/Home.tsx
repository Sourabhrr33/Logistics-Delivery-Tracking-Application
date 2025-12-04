// src/pages/Home.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const Home: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user)

  // Redirect short-links based on role
  if (user) {
    if (user.role === 'customer') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Link
            to="/customer"
            className="text-blue-600 underline text-lg hover:text-blue-800"
          >
            Go to Customer Dashboard →
          </Link>
        </div>
      )
    }

    if (user.role === 'driver') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Link
            to="/driver"
            className="text-blue-600 underline text-lg hover:text-blue-800"
          >
            Go to Driver Dashboard →
          </Link>
        </div>
      )
    }

    if (user.role === 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Link
            to="/admin"
            className="text-blue-600 underline text-lg hover:text-blue-800"
          >
            Go to Admin Panel →
          </Link>
        </div>
      )
    }
  }

  // Public landing screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg transition hover:shadow-xl">
        <h1 className="text-3xl font-bold mb-3 text-center">VedaPixel Logistics</h1>
        <p className="text-slate-600 text-center mb-6 leading-relaxed">
          Track deliveries, manage drivers, and streamline your logistics workflow —
          all in one clean and simple interface.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/auth/login"
            className="w-full text-center bg-blue-600 text-white p-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/auth/signup"
            className="w-full text-center border border-blue-600 text-blue-600 p-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
          >
            Create an Account
          </Link>
        </div>

        <div className="mt-6 text-center text-slate-400 text-xs">
          Mock App • Assignment Project • MSW API Simulation
        </div>
      </div>
    </div>
  )
}

export default Home
