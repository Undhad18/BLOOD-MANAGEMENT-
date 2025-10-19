import { useMemo, useState } from 'react'
import { useDataStore } from '../store/data.js'

export function Centers() {
  const { centers } = useDataStore()
  const [state, setState] = useState('Gujarat')
  const filtered = useMemo(() => centers.filter(c=> !state || c.state===state), [centers, state])
  const totalUnits = filtered.reduce((a,c)=>a+c.units,0)
  const heatColor = (u)=> u<100?'#e11d48':u<200?'#f59e0b':'#10b981'
  return (
    <div className="grid gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4">Donation Centers & Regional Stock</h2>
        <div className="mb-4">
          <label className="text-sm text-slate-300 mr-2">State</label>
          <select value={state} onChange={(e)=>setState(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10">
            {[...new Set(centers.map(c=>c.state))].map(s=> <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {filtered.map(c=> (
              <div key={c.id} className="bg-slate-900/60 rounded-xl p-4 shadow-elev-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-slate-400 text-sm">{c.city}, {c.state}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold" style={{ color: heatColor(c.units) }}>{c.units}</div>
                    <div className="text-xs text-slate-400">units</div>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full" style={{ width: Math.min(100, Math.round((c.units/400)*100))+'%', background: heatColor(c.units) }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="aspect-video rounded-xl overflow-hidden ring-3d">
              <iframe
                title="map"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(filtered[0]?.city||'Gandhinagar')}&t=&z=7&ie=UTF8&iwloc=&output=embed`}></iframe>
            </div>
            <div className="mt-3 text-sm text-slate-300">Total in {state}: <span className="font-semibold" style={{ color: heatColor(totalUnits) }}>{totalUnits}</span> units</div>
          </div>
        </div>
      </div>
    </div>
  )
}


