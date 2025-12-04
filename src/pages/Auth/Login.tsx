// src/pages/Auth/Login.tsx
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { loginUser } from '../../store/slices/authThunks'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector((s) => s.auth.loading)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const result: any = await dispatch(loginUser({ email, password }))

    if (result?.error) {
      setError(result.payload || 'Invalid credentials')
      return
    }

    const role = result.payload.user.role

    if (role === 'customer') navigate('/customer')
    if (role === 'driver') navigate('/driver')
    if (role === 'admin') navigate('/admin')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-xl shadow border border-gray-200 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm text-center mb-4">Login to your account</p>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p
          onClick={() => navigate('/auth/forgot')}
          className="text-sm text-blue-600 text-center cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        <p className="text-sm text-center">
          Don't have an account?
          <span
            onClick={() => navigate('/auth/signup')}
            className="text-blue-600 cursor-pointer hover:underline ml-1"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
