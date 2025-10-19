import { useMemo, useState } from 'react'
import { MapPin, Search as SearchIcon, Users } from 'lucide-react'

const MOCK_DONORS = [
  { id: '1', name: 'Anita', blood: 'A+', city: 'Delhi' },
  { id: '2', name: 'Rahul', blood: 'O-', city: 'Mumbai' },
  { id: '3', name: 'Sana', blood: 'B+', city: 'Pune' },
  { id: '4', name: 'Vikram', blood: 'AB-', city: 'Bengaluru' },
  { id: '5', name: 'Priya', blood: 'O+', city: 'Chennai' },
]

export function Search() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('')

  const filtered = useMemo(() => {
    return MOCK_DONORS.filter(d =>
      (!group || d.blood === group) &&
      (!query || d.city.toLowerCase().includes(query.toLowerCase()) || d.name.toLowerCase().includes(query.toLowerCase()))
    )
  }, [query, group])

  return (
    <div className="glass ring-3d rounded-2xl p-6 card-3d">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-brand-400"/> Find donors</h2>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="md:col-span-2 flex items-center gap-2 bg-slate-900 border border-white/10 rounded-lg px-3 py-2">
          <SearchIcon className="h-4 w-4 text-slate-400"/>
          <input placeholder="Search by city or name" className="bg-transparent flex-1 outline-none" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2" value={group} onChange={(e)=>setGroup(e.target.value)}>
          <option value="">All groups</option>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=> <option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(d => (
          <div key={d.id} className="bg-slate-900/60 rounded-xl p-4 shadow-elev-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-slate-400 text-sm flex items-center gap-1"><MapPin className="h-3 w-3"/>{d.city}</div>
              </div>
              <div className="px-2 py-1 rounded-md bg-slate-800 border border-white/10">{d.blood}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


