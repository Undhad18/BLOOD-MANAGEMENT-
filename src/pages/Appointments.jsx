import { useEffect, useState } from 'react'
import { CalendarPlus } from 'lucide-react'

const STORAGE_KEY = 'bb_appts_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [] } catch { return [] }
}
function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function Appointments() {
  const [list, setList] = useState(load())
  const [form, setForm] = useState({ date: '', center: '', note: '' })

  useEffect(()=> save(list), [list])

  function add(e) {
    e.preventDefault()
    setList(prev=> [{ id: crypto.randomUUID(), ...form }, ...prev])
    setForm({ date: '', center: '', note: '' })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CalendarPlus className="h-5 w-5 text-brand-400"/> Book appointment</h2>
        <form className="space-y-3" onSubmit={add}>
          <div>
            <label className="block text-sm text-slate-300">Date</label>
            <input type="date" className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Center</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.center} onChange={(e)=>setForm({...form, center:e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Note</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.note} onChange={(e)=>setForm({...form, note:e.target.value})} />
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-neon">Book</button>
        </form>
      </div>
      <div className="space-y-3">
        {list.map(a => (
          <div key={a.id} className="bg-slate-900/60 rounded-xl p-4 shadow-elev-2">
            <div className="font-medium">{a.date} • {a.center}</div>
            <div className="text-slate-400 text-sm">{a.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


