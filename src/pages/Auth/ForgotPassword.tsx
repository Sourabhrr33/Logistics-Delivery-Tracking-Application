import React, { useState } from 'react'
import { forgotPassword } from '../../store/slices/authThunks'
import { useAppDispatch } from '../../store/hooks'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submit = async () => {
    await dispatch(forgotPassword({ email }))
    alert('Reset link sent (mock)')
    navigate('/auth/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
