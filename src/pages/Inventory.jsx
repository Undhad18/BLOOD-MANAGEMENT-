import { useEffect, useMemo, useState } from 'react'
import { Plus, Minus, Droplet } from 'lucide-react'
import { useDataStore } from '../store/data.js'

const STORAGE_KEY = 'bb_inventory_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {} } catch { return {} }
}
function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

const BLOODS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

export function Inventory() {
  const [units, setUnits] = useState(load())
  const [selected, setSelected] = useState('A+')
  const [qty, setQty] = useState(1)

  useEffect(()=> save(units), [units])

  // Prefer centralized seeded store when available for analytics
  let store
  try { store = useDataStore() } catch { store = null }

  const requests = useMemo(()=> {
    if (store?.requests) return store.requests
    try { return JSON.parse(localStorage.getItem('bb_requests_v1')) ?? [] } catch { return [] }
  }, [store?.requests])

  const donors = store?.donors ?? []
  const inv = store?.inventory ?? units

  const usageByGroup = useMemo(()=> {
    const agg = {}
    for (const r of requests) {
      if (r.status === 'approved') {
        agg[r.blood] = (agg[r.blood]||0) + (r.units||0)
      }
    }
    return agg
  }, [requests])

  const mostRequested = useMemo(()=> {
    const count = {}
    for (const r of requests) {
      count[r.blood] = (count[r.blood]||0) + 1
    }
    return Object.entries(count).sort((a,b)=> b[1]-a[1])
  }, [requests])

  const donorFreq = useMemo(()=> {
    const count = {}
    for (const d of donors) count[d.blood] = (count[d.blood]||0) + 1
    return count
  }, [donors])

  function getStatus(value) {
    if (value == null) value = 0
    if (value < 10) return { label: 'Critical', color: 'bg-rose-700 text-rose-100', ring: 'ring-rose-500/40' }
    if (value < 30) return { label: 'Low', color: 'bg-amber-700 text-amber-100', ring: 'ring-amber-500/40' }
    if (value < 60) return { label: 'Moderate', color: 'bg-sky-700 text-sky-100', ring: 'ring-sky-500/40' }
    return { label: 'Healthy', color: 'bg-emerald-700 text-emerald-100', ring: 'ring-emerald-500/40' }
  }

  const lowGroups = useMemo(()=> {
    return BLOODS.filter(b => (inv[b] ?? units[b] ?? 0) < 30)
  }, [inv, units])

  function Bar({ label, value, max }) {
    const width = Math.max(4, Math.round((value/(max||1))*100))
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}</span></div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-600 to-rose-600" style={{ width: width+'%' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Droplet className="h-5 w-5 text-brand-400"/> Inventory</h2>
        {lowGroups.length > 0 && (
          <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
            <div className="text-sm text-amber-300">Low stock alert:</div>
            <div className="mt-1 text-sm text-slate-300">{lowGroups.join(', ')} below recommended levels.</div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {BLOODS.map((b)=> (
            <button key={b} onClick={()=>setSelected(b)} className={`px-3 py-1.5 rounded-lg border ${selected===b?'bg-brand-600 border-brand-500 text-white':'bg-slate-900/60 border-white/10 text-slate-200'}`}>{b}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-6">
          <input type="number" min={1} value={qty} onChange={(e)=>setQty(parseInt(e.target.value)||1)} className="w-24 bg-slate-900 border border-white/10 rounded-lg px-3 py-2"/>
          <button onClick={()=> setUnits(prev=> ({...prev, [selected]: (prev[selected]||0)+qty}))} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-elev-1"><Plus className="inline h-4 w-4 mr-1"/>Add</button>
          <button onClick={()=> setUnits(prev=> ({...prev, [selected]: Math.max(0,(prev[selected]||0)-qty)}))} className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-elev-1"><Minus className="inline h-4 w-4 mr-1"/>Issue</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BLOODS.map((b)=> (
            <div key={b} className="rounded-xl bg-slate-900/60 p-4 shadow-elev-2 ring-1 ring-inset border-white/5" >
              <div className="flex items-center justify-between">
                <div className="text-slate-400 text-sm">{b}</div>
                {(() => { const v = (inv[b] ?? units[b] ?? 0); const s = getStatus(v); return (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${s.color} ring-1 ${s.ring}`}>{s.label}</span>
                )})()}
              </div>
              <div className="mt-1 text-2xl font-semibold">{(inv[b] ?? units[b] ?? 0)}</div>
              {(() => { const v = (inv[b] ?? units[b] ?? 0); const pct = Math.min(100, Math.round((v/100)*100)); const s = getStatus(v); return (
                <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${s.color.replace(' text-',' ').split(' ')[0]}`} style={{ width: pct+'%' }} />
                </div>
              )})()}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <section className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3">Collection & Usage</h3>
          <div className="space-y-3">
            {BLOODS.map((b)=> {
              const collected = inv[b] ?? units[b] ?? 0
              const used = usageByGroup[b] || 0
              const maxVal = Math.max(collected, used, 1)
              return (
                <div key={b} className="space-y-2">
                  <div className="text-xs text-slate-400">{b}</div>
                  <Bar label="Collected" value={collected} max={maxVal} />
                  <Bar label="Used" value={used} max={maxVal} />
                </div>
              )
            })}
          </div>
        </section>
        <section className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3">Most Requested Groups</h3>
          <div className="space-y-3">
            {mostRequested.slice(0,8).map(([k,v])=> <Bar key={k} label={k} value={v} max={mostRequested[0]?.[1]||1} />)}
            {mostRequested.length===0 && <div className="text-sm text-slate-400">No requests yet.</div>}
          </div>
        </section>
        <section className="glass ring-3d rounded-2xl p-6 card-3d">
          <h3 className="font-semibold mb-3">Donor Frequency</h3>
          <div className="space-y-3">
            {Object.entries(donorFreq).map(([k,v])=> <Bar key={k} label={k} value={v} max={Math.max(...Object.values(donorFreq))||1} />)}
            {(!donors || donors.length===0) && <div className="text-sm text-slate-400">No donors in directory yet.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}


