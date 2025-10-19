import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.js'
import { useDataStore } from '../../store/data.js'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const { addDonor } = useDataStore()
  const [name, setName] = useState('New Donor')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [blood, setBlood] = useState('A+')
  const [city, setCity] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    register(name, email, password)
    addDonor({ name, email, blood, city, lastDonation: '' })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-xl font-semibold mb-4">Create your account</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-slate-300">Full name</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-300">Blood group</label>
              <select className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={blood} onChange={(e)=>setBlood(e.target.value)}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=> <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300">City</label>
              <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={city} onChange={(e)=>setCity(e.target.value)} required />
            </div>
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-neon">Register</button>
        </form>
        <div className="text-sm text-slate-400 mt-4">Already have an account? <Link to="/login" className="text-brand-300 hover:text-brand-200">Login</Link></div>
      </div>
    </div>
  )
}


