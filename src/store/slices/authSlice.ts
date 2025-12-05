import { createSlice } from '@reduxjs/toolkit'
import { loginUser, signupUser, sendOtp, verifyOtp } from './authThunks'

type User = {
  id: string
  name: string
  role: 'admin' | 'customer' | 'driver'
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('vp_user') || 'null'),
  token: localStorage.getItem('vp_token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('vp_user')
      localStorage.removeItem('vp_token')
    }
  },

  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token

      localStorage.setItem('vp_user', JSON.stringify(action.payload.user))
      localStorage.setItem('vp_token', action.payload.token)
    })

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // SIGNUP
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true
      state.error = null
    })

    builder.addCase(signupUser.fulfilled, (state) => {
      state.loading = false
    })

    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // SEND OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.loading = true
      state.error = null
    })

    builder.addCase(sendOtp.fulfilled, (state) => {
      state.loading = false
    })

    builder.addCase(sendOtp.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // VERIFY OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true
      state.error = null
    })

    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.loading = false
    })

    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
