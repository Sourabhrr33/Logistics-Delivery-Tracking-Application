import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export type Notification = {
  id: string
  message: string
  roleTarget: 'customer' | 'driver' | 'admin'
  createdAt: string
  read?: boolean
}

type NotificationsState = {
  list: Notification[]
}

const initialState: NotificationsState = {
  list: []
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification(state, action: PayloadAction<Notification>) {
      state.list.unshift({
        ...action.payload,
        read: false
      })
    },
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.list.find((n) => n.id === action.payload)
      if (item) item.read = true
    },
    markAllRead(state) {
      state.list = state.list.map((n) => ({ ...n, read: true }))
    }
  }
})

export const { pushNotification, markAsRead, markAllRead } = notificationsSlice.actions
export default notificationsSlice.reducer
