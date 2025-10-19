import { useEffect, useState } from 'react'
import { Droplet, Check, X } from 'lucide-react'

const STORAGE_KEY = 'bb_requests_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [] } catch { return [] }
}
function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function Requests() {
  const [list, setList] = useState(load())
  const [form, setForm] = useState({ name: '', hospital: '', blood: 'A+', units: 1 })

  useEffect(()=> save(list), [list])

  function addRequest(e) {
    e.preventDefault()
    setList(prev=> [{ id: crypto.randomUUID(), status: 'pending', ...form }, ...prev])
    setForm({ name: '', hospital: '', blood: 'A+', units: 1 })
  }

  function setStatus(id, status) {
    setList(prev=> prev.map(r=> r.id===id?{...r, status}:r))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Droplet className="h-5 w-5 text-brand-400"/> New request</h2>
        <form className="space-y-3" onSubmit={addRequest}>
          <div>
            <label className="block text-sm text-slate-300">Patient name</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Hospital</label>
            <input className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.hospital} onChange={(e)=>setForm({...form, hospital:e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-300">Blood</label>
              <select className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.blood} onChange={(e)=>setForm({...form, blood:e.target.value})}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=> <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-300">Units</label>
              <input type="number" min={1} className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" value={form.units} onChange={(e)=>setForm({...form, units:parseInt(e.target.value)||1})} />
            </div>
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-neon">Create request</button>
        </form>
      </div>
      <div className="space-y-3">
        {list.map((r)=> (
          <div key={r.id} className="glass ring-3d rounded-2xl p-4 card-3d flex items-center justify-between">
            <div>
              <div className="font-medium">{r.patient || r.name} • <span className="text-brand-300">{r.blood}</span> • {r.units} units</div>
              <div className="text-slate-400 text-sm">{r.hospital}</div>
              <div className="text-xs mt-1">Status: <span className={r.status==='approved'?'text-emerald-400':r.status==='denied'?'text-rose-400':'text-amber-300'}>{r.status}</span></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setStatus(r.id,'approved')} className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white"><Check className="h-4 w-4"/></button>
              <button onClick={()=>setStatus(r.id,'denied')} className="px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white"><X className="h-4 w-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


