import { create } from 'zustand'
import { setSecureItem, getSecureItem } from './secureStorage.js'

const KEY = 'bb_notifications_v1'

function load() {
  return getSecureItem(KEY, [])
}

function save(list) {
  setSecureItem(KEY, list)
}

export const useNotificationStore = create((set, get) => ({
  notifications: load(),
  addNotification: (notif) => set((s)=>{
    const next = [{ id: crypto.randomUUID(), ts: Date.now(), read: false, ...notif }, ...s.notifications]
    save(next)
    return { notifications: next }
  }),
  markAllRead: () => set((s)=>{
    const next = s.notifications.map(n=> ({...n, read: true}))
    save(next)
    return { notifications: next }
  })
}))


