// src/routes/ProtectedRoutes.tsx
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'   

const ProtectedRoutes: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth)
  if (!user) return <Navigate to="/auth/login" replace />
  return <Outlet />
}

export default ProtectedRoutes
