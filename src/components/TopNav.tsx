import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import NotificationsPanel from './NotificationsPanel'

const TopNav = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const list = useAppSelector((s) => s.notifications.list)
  const [show, setShow] = useState(false)

  const unread = list.filter((n) => !n.read).length

  const goHome = () => {
    if (!user) return
    if (user.role === 'customer') navigate('/customer')
    if (user.role === 'driver') navigate('/driver')
    if (user.role === 'admin') navigate('/admin')
  }

  return (
    <div className="w-full bg-white shadow flex justify-between p-3 px-4 fixed top-0 left-0 right-0 z-20">
      <button onClick={goHome} className="font-semibold hover:opacity-70">
        VedaPixel
      </button>

      <div className="flex items-center gap-4">

        <button onClick={goHome} className="text-sm hover:opacity-70">
          Home
        </button>

        <Link to="/profile" className="text-sm hover:opacity-70">
          Profile
        </Link>

        {/* Notification Bell */}
        <button className="relative" onClick={() => setShow(!show)}>
          🔔
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1">
              {unread}
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch(logout())}
          className="text-sm text-red-600 hover:opacity-70"
        >
          Logout
        </button>
      </div>

      {/* 🔥 FIX: Pass required props */}
      <NotificationsPanel open={show} onClose={() => setShow(false)} />
    </div>
  )
}

export default TopNav
