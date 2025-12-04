// src/pages/Auth/Signup.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { signupUser, sendOtp, verifyOtp } from '../../store/slices/authThunks'
import toast from 'react-hot-toast'


const Signup = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submitForm = async () => {
    if (!form.name || !form.email || !form.password) {
      return setError('All fields are required.')
    }

    await dispatch(sendOtp({ email: form.email }))
    setStep('otp')
  }

  const submitOtp = async () => {
    const result: any = await dispatch(verifyOtp({ email: form.email, otp }))
    if (result.error) {
      setError('Invalid OTP')
      return
    }

    await dispatch(signupUser(form))
   toast.success('Signup successful!')

    navigate('/auth/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow border border-gray-200">

        {step === 'form' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
            <p className="text-gray-600 text-sm text-center mb-4">
              Join our delivery system today
            </p>

            {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

            <input
              className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              onClick={submitForm}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Send OTP
            </button>

            <p
              onClick={() => navigate('/auth/login')}
              className="text-sm text-blue-600 text-center mt-4 cursor-pointer hover:underline"
            >
              Already have an account? Login
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-3">Verify OTP</h1>
            <p className="text-sm text-gray-600 text-center mb-4">
              Enter the OTP sent to <strong>{form.email}</strong>
            </p>

            {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

            <input
              className="border p-2 w-full mb-4 rounded text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={submitOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Verify & Create Account
            </button>

            <p
              onClick={() => setStep('form')}
              className="text-sm text-blue-600 text-center mt-4 cursor-pointer hover:underline"
            >
              Change Email
            </p>
          </>
        )}

      </div>
    </div>
  )
}

export default Signup
