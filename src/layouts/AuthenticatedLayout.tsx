import React from 'react'
import TopNav from '../components/TopNav'
import { Outlet } from 'react-router-dom'

const AuthenticatedLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthenticatedLayout
