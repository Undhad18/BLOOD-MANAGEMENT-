import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.js'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('donor@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    try {
      login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-xl font-semibold mb-4">Welcome back</h2>
        {error && <div className="mb-3 text-sm text-rose-400">{error}</div>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
            <p className="text-xs text-slate-400 mt-1">Use emails like admin@x.com or staff@x.com to try roles.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-neon">Login</button>
        </form>
        <div className="text-sm text-slate-400 mt-4">No account? <Link to="/register" className="text-brand-300 hover:text-brand-200">Register</Link></div>
      </div>
    </div>
  )
}


