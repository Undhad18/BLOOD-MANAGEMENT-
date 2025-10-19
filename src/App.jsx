import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/auth/Login.jsx'
import { Register } from './pages/auth/Register.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Inventory } from './pages/Inventory.jsx'
import { Requests } from './pages/Requests.jsx'
import { Search } from './pages/Search.jsx'
import { Appointments } from './pages/Appointments.jsx'
import { useAuthStore } from './store/auth.js'
import { AIMatching } from './pages/AI.jsx'
// import { AdminAnalytics } from './pages/AdminAnalytics.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { Centers } from './pages/Centers.jsx'
import { Droplet, Calendar, Archive, Search as SearchIcon, Home as HomeIcon, LogIn, UserPlus } from 'lucide-react'
import { Admin } from './pages/Admin.jsx'

function Nav() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const active = (path) => location.pathname === path ? 'text-brand-400' : 'text-slate-300'
  return (
    <div className="sticky top-0 z-40">
      <div className="bg-slate-900/70 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-rose-700 flex items-center justify-center shadow-neon card-3d">
              <Droplet className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold tracking-wide text-white group-hover:text-brand-200 transition-colors">BloodBank</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link className={`hover:text-white transition-colors ${active('/')}`} to="/"><HomeIcon className="inline h-4 w-4 mr-1"/>Home</Link>
            <Link className={`hover:text-white transition-colors ${active('/inventory')}`} to="/inventory"><Archive className="inline h-4 w-4 mr-1"/>Inventory</Link>
            <Link className={`hover:text-white transition-colors ${active('/requests')}`} to="/requests"><Droplet className="inline h-4 w-4 mr-1"/>Requests</Link>
            <Link className={`hover:text-white transition-colors ${active('/search')}`} to="/search"><SearchIcon className="inline h-4 w-4 mr-1"/>Search</Link>
            <Link className={`hover:text-white transition-colors ${active('/appointments')}`} to="/appointments"><Calendar className="inline h-4 w-4 mr-1"/>Appointments</Link>
            <Link className={`hover:text-white transition-colors ${active('/ai')}`} to="/ai">AI</Link>
            {/* <Link className={`hover:text-white transition-colors ${active('/analytics')}`} to="/analytics">Analytics</Link> */}
            <Link className={`hover:text-white transition-colors ${active('/centers')}`} to="/centers">Centers</Link>
            <Link className={`hover:text-white transition-colors ${active('/admin')}`} to="/admin">Admin</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-200 hover:text-white">{user.name}</Link>
                <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-elev-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-200 hover:text-white"><LogIn className="inline h-4 w-4 mr-1"/>Login</Link>
                <Link to="/register" className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-elev-1"><UserPlus className="inline h-4 w-4 mr-1"/>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Protected({ children, roles }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid-3d [background-size:var(--tw-bg-size,32px_32px)]">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/search" element={<Search />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/ai" element={<AIMatching />} />
          {/* <Route path="/analytics" element={<Protected roles={['admin']}><AdminAnalytics /></Protected>} /> */}
          <Route path="/centers" element={<Centers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}


