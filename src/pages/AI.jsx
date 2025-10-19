import { useMemo, useState } from 'react'
import { MapPin, Bot, Radar, AlertTriangle, Lightbulb } from 'lucide-react'
import { useDataStore } from '../store/data.js'

const MOCK_DONORS = [
  { id: '1', name: 'Anita', blood: 'A+', city: 'Delhi', lat:28.61, lng:77.21 },
  { id: '2', name: 'Rahul', blood: 'O-', city: 'Mumbai', lat:19.07, lng:72.87 },
  { id: '3', name: 'Sana', blood: 'B+', city: 'Pune', lat:18.52, lng:73.86 },
  { id: '4', name: 'Vikram', blood: 'AB-', city: 'Bengaluru', lat:12.97, lng:77.59 },
  { id: '5', name: 'Priya', blood: 'O+', city: 'Chennai', lat:13.08, lng:80.27 },
]

function haversineKm(a, b) {
  const toRad = (d)=> d*Math.PI/180
  const R = 6371
  const dLat = toRad(b.lat-a.lat)
  const dLng = toRad(b.lng-a.lng)
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s))
}

export function AIMatching() {
  const [need, setNeed] = useState({ blood: 'A+', lat: 28.61, lng: 77.21 })
  let store
  try { store = useDataStore() } catch { store = null }
  const inventory = store?.inventory
  const centers = store?.centers ?? []
  const requests = store?.requests ?? []
  const donors = store?.donors ?? []
  const ranked = useMemo(()=> {
    return MOCK_DONORS
      .filter(d=> d.blood === need.blood)
      .map(d=> ({ ...d, distance: Math.round(haversineKm({lat:need.lat,lng:need.lng}, d)) }))
      .sort((a,b)=> a.distance-b.distance)
  }, [need])

  return (
    <div className="grid gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Radar className="h-5 w-5 text-brand-400"/> AI Donor Matching</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-slate-300">Blood group</label>
            <select value={need.blood} onChange={(e)=>setNeed({...need, blood:e.target.value})} className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2">
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=> <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300">Latitude</label>
            <input value={need.lat} onChange={(e)=>setNeed({...need, lat: parseFloat(e.target.value)||0})} className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Longitude</label>
            <input value={need.lng} onChange={(e)=>setNeed({...need, lng: parseFloat(e.target.value)||0})} className="mt-1 w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {ranked.map(d=> (
          <div key={d.id} className="glass ring-3d rounded-2xl p-4 card-3d flex items-center justify-between">
            <div>
              <div className="font-medium">{d.name} • {d.blood}</div>
              <div className="text-slate-400 text-sm flex items-center gap-1"><MapPin className="h-3 w-3"/> {d.city} • {d.distance} km away</div>
            </div>
            <button className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white">Contact</button>
          </div>
        ))}
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Bot className="h-4 w-4 text-brand-400"/> Assistant</h3>
        <p className="text-slate-300 text-sm">Ask: "Find O+ donors near Mumbai" or "Predict shortage for O- next month" (demo).</p>
      </div>

      {/* Predictions & Insights */}
      <Predictions inventory={inventory} centers={centers} requests={requests} donors={donors} />
    </div>
  )
}

function Predictions({ inventory, centers, requests, donors }) {
  // Build last 3 months demand per blood group and forecast next month as average
  const groups = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
  const now = new Date()
  const months = [0,1,2].map(i=> {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const demandByGroup = Object.fromEntries(groups.map(g=> [g, 0]))
  for (const r of requests) {
    const d = new Date(r.createdAt || Date.now())
    if (months.some(x=> x.y===d.getFullYear() && x.m===d.getMonth())) {
      demandByGroup[r.blood] = (demandByGroup[r.blood]||0) + (r.units||0)
    }
  }
  const forecast = Object.fromEntries(groups.map(g=> [g, Math.round((demandByGroup[g]||0) / (months.length || 1))]))
  const stock = inventory || {}
  const shortages = groups
    .map(g=> ({ group: g, projectedDeficit: Math.max(0, (forecast[g]||0) - (stock[g]||0)) }))
    .filter(x=> x.projectedDeficit>0)
    .sort((a,b)=> b.projectedDeficit-a.projectedDeficit)

  // Suggest camp locations: cities with highest recent requests or low center stock per city
  const byCity = {}
  for (const r of requests) {
    const city = (r.hospital || '').split(' ').slice(-1)[0] || 'Unknown'
    byCity[city] = byCity[city] || { city, demand: 0 }
    byCity[city].demand += r.units||0
  }
  const cityCenters = (centers||[]).reduce((acc,c)=> (acc[c.city]=c.units, acc), {})
  const suggest = Object.values(byCity)
    .map(c=> ({ ...c, supply: cityCenters[c.city]||0, gap: (c.demand||0)-(cityCenters[c.city]||0) }))
    .sort((a,b)=> b.gap-a.gap)
    .slice(0,3)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-300"/> Forecasted High Demand</h3>
        <div className="space-y-2 text-sm">
          {groups.map(g=> (
            <div key={g} className="flex items-center justify-between">
              <span className="text-slate-300">{g}</span>
              <span className="text-slate-400">next month: <span className="text-slate-200 font-medium">{forecast[g]||0}</span></span>
            </div>
          ))}
        </div>
      </section>
      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-400"/> Projected Shortages</h3>
        <div className="space-y-2 text-sm">
          {shortages.length===0 && <div className="text-slate-400">No projected shortages.</div>}
          {shortages.map(s=> (
            <div key={s.group} className="flex items-center justify-between">
              <span className="text-slate-300">{s.group}</span>
              <span className="text-rose-300">deficit {s.projectedDeficit} units</span>
            </div>
          ))}
        </div>
      </section>
      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-brand-300"/> Suggested Camp Locations</h3>
        <div className="space-y-2 text-sm">
          {suggest.length===0 && <div className="text-slate-400">No suggestions available.</div>}
          {suggest.map(c=> (
            <div key={c.city} className="flex items-center justify-between">
              <span className="text-slate-300">{c.city}</span>
              <span className="text-slate-400">demand {c.demand} / supply {c.supply} • gap <span className="text-rose-300">{c.gap}</span></span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


