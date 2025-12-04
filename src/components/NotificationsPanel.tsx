// src/components/NotificationsPanel.tsx
import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { markAllRead, markAsRead } from '../store/slices/notificationsSlice'

interface Props {
  open: boolean
  onClose: () => void
}

const NotificationsPanel: React.FC<Props> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const { list } = useAppSelector((s) => s.notifications)
  const dispatch = useAppDispatch()

  // Close on outside click
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (open) document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className="
        absolute right-4 top-14 
        w-80 bg-white rounded-xl shadow-xl border 
        p-0 overflow-hidden z-50
        animate-[fadeIn_0.15s_ease-out,scaleIn_0.15s_ease-out]
      "
      style={{ transformOrigin: 'top right' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b bg-gray-50">
        <div className="font-semibold text-lg">Notifications</div>
        <button
          onClick={() => dispatch(markAllRead())}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto p-3 space-y-2 custom-scroll">

        {list.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <div className="text-4xl mb-2">🔔</div>
            No notifications yet
          </div>
        )}

        {list.map((n) => (
          <div
            key={n.id}
            onClick={() => dispatch(markAsRead(n.id))}
            className={`
              p-3 rounded-lg border cursor-pointer transition flex gap-3
              ${n.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'}
            `}
          >
            {/* Unread Dot */}
            <div className="flex items-start pt-1">
              {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
              {n.read && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
            </div>

            {/* Notification Content */}
            <div className="flex-1">
              <div className="text-sm font-medium">{n.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPanel
