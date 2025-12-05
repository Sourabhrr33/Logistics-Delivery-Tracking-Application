// src/store/slices/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post('/auth/login', payload)
      return res.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)


export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/signup', payload)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed')
    }
  }
)

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/send-otp', payload)
      return res.data
    } catch (err: any) {
      return rejectWithValue('Failed to send OTP')
    }
  }
)

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/verify-otp', payload)
      return res.data
    } catch {
      return rejectWithValue('Invalid OTP')
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/forgot-password', payload)
      return res.data
    } catch {
      return rejectWithValue('Unable to reset password')
    }
  }
)
