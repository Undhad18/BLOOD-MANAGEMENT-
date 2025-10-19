import { Droplet, Users, Archive, MapPinned, MapPin, Calendar, Search as SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicTopBar } from '../components/PublicHeader.jsx'

export function Home() {
  const stats = [
    { label: 'Active Donors', value: '1,284', icon: Users },
    { label: 'Units in Stock', value: '642', icon: Archive },
    { label: 'Requests Pending', value: '24', icon: Droplet },
    { label: 'Cities Covered', value: '18', icon: MapPinned },
  ]
  return (
    <div className="grid gap-8">
      <PublicTopBar />
      <section className="grid md:grid-cols-2 items-center gap-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Donate blood, save lives
          </h1>
          <p className="text-slate-300 max-w-prose">
            Join our community of donors and help hospitals maintain reliable blood supplies. Book an appointment, track your donations, and respond to requests near you.
          </p>
          <div className="flex gap-3">
            <Link to="/register" className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-neon card-3d">Become a donor</Link>
            <Link to="/search" className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-elev-1">Find donors</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-tr from-rose-700/20 to-sky-600/20 rounded-3xl blur-2xl" />
          <div className="relative glass ring-3d rounded-3xl p-6 card-3d">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-900/60 p-4 shadow-elev-2">
                  <div className="flex items-center gap-3">
                    <s.icon className="h-5 w-5 text-brand-400" />
                    <span className="text-slate-300 text-sm">{s.label}</span>
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-4 gap-4">
        {[
          { title: 'Blood Availability', icon: SearchIcon, to: '/search' },
          { title: 'Locate Blood Bank', icon: MapPin, to: '/search' },
          { title: 'Upcoming Camps', icon: Calendar, to: '/appointments' },
          { title: 'Register as Donor', icon: Droplet, to: '/register' },
        ].map(t => (
          <Link key={t.title} to={t.to} className="glass ring-3d rounded-2xl p-5 card-3d hover:shadow-neon">
            <div className="flex items-center gap-3">
              <t.icon className="h-5 w-5 text-brand-400" />
              <div className="font-medium">{t.title}</div>
            </div>
            <div className="text-slate-400 text-sm mt-2">Explore</div>
          </Link>
        ))}
      </section>
      <footer className="mt-6 text-xs text-slate-400">
        <div className="glass ring-3d rounded-2xl p-4 flex items-center justify-between">
          <div>Helpline: 104 • Demo app inspired by eRaktKosh</div>
          <div>Ministry of Health & Family Welfare (Demo)</div>
        </div>
      </footer>
    </div>
  )
}


