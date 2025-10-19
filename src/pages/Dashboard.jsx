import { useAuthStore } from '../store/auth.js'
import { Calendar, Droplet, ShieldCheck } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuthStore()
  const history = [
    { date: '2025-01-12', unit: 'A+', location: 'City Hospital' },
    { date: '2024-08-28', unit: 'A+', location: 'Red Cross Center' },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <div className="glass ring-3d rounded-2xl p-6 card-3d">
          <h2 className="text-lg font-semibold">Welcome, {user?.name}</h2>
          <p className="text-slate-400 text-sm">Role: {user?.role}</p>
        </div>
        <div className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplet className="h-4 w-4 text-brand-400"/> Donation history</h3>
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.date} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
                <span className="text-slate-300">{h.date}</span>
                <span className="font-medium">{h.unit}</span>
                <span className="text-slate-400">{h.location}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-400"/> Next eligibility</h3>
          <p className="text-slate-300">You can donate again after 56 days.</p>
        </div>
        <div className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-400"/> Profile</h3>
          <p className="text-slate-300 text-sm">Keep your contact and blood group updated so hospitals can reach you quickly.</p>
        </div>
      </aside>
    </div>
  )
}


