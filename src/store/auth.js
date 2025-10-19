import { create } from 'zustand'
import { setSecureItem, getSecureItem } from './secureStorage.js'

const STORAGE_KEY = 'bloodbank_auth_secure_v1'

function loadAuth() {
  try {
    return getSecureItem(STORAGE_KEY, { user: null })
  } catch {
    return { user: null }
  }
}

function saveAuth(state) {
  try { setSecureItem(STORAGE_KEY, { user: state.user }) } catch {}
}

export const useAuthStore = create((set, get) => ({
  ...loadAuth(),
  login: (email, password) => {
    const role = email.includes('admin') ? 'admin' : email.includes('staff') ? 'staff' : 'donor'
    const token = 'jwt_'+crypto.randomUUID()
    const exp = Date.now() + 8 * 60 * 60 * 1000
    const user = { id: crypto.randomUUID(), name: email.split('@')[0], email, role, token, exp }
    set({ user })
    saveAuth(get())
    return user
  },
  issueOtp: (identifier) => {
    const otp = String(Math.floor(100000 + Math.random()*900000))
    setSecureItem('bb_last_otp', { identifier, otp, ts: Date.now() })
    return otp
  },
  verifyOtp: (identifier, code) => {
    const rec = getSecureItem('bb_last_otp', null)
    if (!rec) return false
    return rec.identifier === identifier && rec.otp === code && Date.now()-rec.ts < 5*60*1000
  },
  register: (name, email, password) => {
    const token = 'jwt_'+crypto.randomUUID()
    const exp = Date.now() + 8 * 60 * 60 * 1000
    const user = { id: crypto.randomUUID(), name, email, role: 'donor', token, exp }
    set({ user })
    saveAuth(get())
    return user
  },
  logout: () => {
    set({ user: null })
    saveAuth(get())
  },
  isTokenValid: () => {
    const { user } = get()
    return !!(user && user.token && user.exp && Date.now() < user.exp)
  },
  getAuthHeader: () => {
    const { user } = get()
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
  }
}))


