import { useMemo, useState } from 'react'
import { BarChart3, Activity, Users, Droplet } from 'lucide-react'
import { useDataStore } from '../store/data.js'
import { exportCsv } from '../utils/export.js'

function Bar({ label, value, max }) {
  const width = Math.max(4, Math.round((value/max)*100))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}</span></div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-600 to-rose-600" style={{ width: width+'%' }} />
      </div>
    </div>
  )
}

export function AdminAnalytics() {
  // Prefer seeded store if present
  let store
  try { store = useDataStore() } catch { store = null }
  const stock = store?.inventory ?? { 'A+': 80, 'A-': 25, 'B+': 60, 'B-': 20, 'AB+': 30, 'AB-': 12, 'O+': 90, 'O-': 18 }
  const requests = store?.requests ?? []
  const [range, setRange] = useState('year')
  const [group, setGroup] = useState('')
  const [region, setRegion] = useState('')
  const stockMax = useMemo(()=> Math.max(...Object.values(stock)), [])
  const demographics = { '18-25': 120, '26-35': 240, '36-50': 180, '50+': 60 }
  const demoMax = useMemo(()=> Math.max(...Object.values(demographics)), [])
  const monthly = { 'Jan': 40, 'Feb': 56, 'Mar': 72, 'Apr': 64, 'May': 88, 'Jun': 95 }
  const monthMax = useMemo(()=> Math.max(...Object.values(monthly)), [])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-3 glass ring-3d rounded-2xl p-6 card-3d">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-slate-400">Date range</label>
            <select value={range} onChange={(e)=>setRange(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10">
              <option value="7d">Last 7 days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400">Blood group</label>
            <select value={group} onChange={(e)=>setGroup(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10">
              <option value="">All</option>
              {Object.keys(stock).map(k=> <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400">Region</label>
            <input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="City or State" className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10"/>
          </div>
          <button onClick={()=> exportCsv('requests', requests.map(r=> ({ date: new Date(r.createdAt).toISOString().slice(0,10), hospital: r.hospital, blood: r.blood, units: r.units, status: r.status })))} className="ml-auto px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 ring-3d">Export CSV</button>
        </div>
      </div>
      <div className="md:col-span-1 glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplet className="h-4 w-4 text-brand-400"/> Blood stock per type</h3>
        <div className="space-y-3">
          {Object.entries(stock).map(([k,v])=> <Bar key={k} label={k} value={v} max={stockMax} />)}
        </div>
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand-400"/> Bar chart: Availability</h3>
        <div className="overflow-x-auto">
          <svg width="100%" height="180" viewBox="0 0 640 180" preserveAspectRatio="xMidYMid meet" className="rounded-xl bg-slate-900/50">
            {(() => {
              const entries = Object.entries(stock)
              const max = Math.max(1, ...entries.map(([,v])=>v))
              const barW = 640 / (entries.length * 1.5)
              return entries.map(([k,v], i) => {
                const h = Math.round((v/max) * 120)
                const x = 20 + i * (barW * 1.5)
                const y = 150 - h
                const low = v < 10
                const fill = low ? '#e11d48' : '#10b981'
                return (
                  <g key={k}>
                    <rect x={x} y={y} width={barW} height={h} rx="6" fill={fill} />
                    <text x={x + barW/2} y={165} textAnchor="middle" fontSize="10" fill="#cbd5e1">{k}</text>
                    <text x={x + barW/2} y={y-4} textAnchor="middle" fontSize="10" fill="#e2e8f0">{v}</text>
                  </g>
                )
              })
            })()}
          </svg>
        </div>
        <div className="text-xs text-slate-400 mt-2">Red bars indicate groups with &lt; 10 units.</div>
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3">Donut chart: Stock composition</h3>
        {(() => {
          const entries = Object.entries(stock)
          const total = Math.max(1, entries.reduce((a,[,v])=>a+v,0))
          let acc = 0
          const cx = 96, cy = 96, r = 64, strokeW = 24
          const colors = ['#f43f5e','#06b6d4','#10b981','#a78bfa','#f59e0b','#ef4444','#22d3ee','#34d399']
          return (
            <svg width="192" height="192" viewBox="0 0 192 192" className="mx-auto">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0f172a" strokeWidth={strokeW} />
              {entries.map(([k,v], i) => {
                const frac = v / total
                const dash = 2 * Math.PI * r * frac
                const gap = 2 * Math.PI * r - dash
                const rotate = (acc / total) * 360 - 90
                acc += v
                const low = v < 10
                const color = low ? '#e11d48' : colors[i % colors.length]
                return (
                  <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW} strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rotate} ${cx} ${cy})`} />
                )
              })}
            </svg>
          )
        })()}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(stock).map(([k,v], i)=> (
            <div key={k} className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: v < 10 ? '#e11d48' : ['#f43f5e','#06b6d4','#10b981','#a78bfa','#f59e0b','#ef4444','#22d3ee','#34d399'][i%8] }} />
              <span className="text-slate-300">{k}</span>
              <span className="text-slate-400">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-brand-400"/> Donor demographics</h3>
        <div className="space-y-3">
          {Object.entries(demographics).map(([k,v])=> <Bar key={k} label={k} value={v} max={demoMax} />)}
        </div>
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand-400"/> Monthly donation trends</h3>
        <div className="space-y-3">
          {Object.entries(monthly).map(([k,v])=> <Bar key={k} label={k} value={v} max={monthMax} />)}
        </div>
      </div>
      <MonthlyTrends />
      <TopHospitals />
      <div className="md:col-span-3 glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-brand-400"/> Urgent requests</h3>
        <p className="text-slate-300 text-sm">Highlight districts where O- and AB- stocks fall below thresholds (demo).</p>
      </div>
    </div>
  )
}

function MonthlyTrends() {
  let store
  try { store = useDataStore() } catch { store = null }
  const activities = store?.activities ?? []
  const requests = store?.requests ?? []

  // Build last 12 months labels
  const now = new Date()
  const months = []
  for (let i=11; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1)
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString(undefined, { month: 'short' }) })
  }

  const donationCounts = months.map(m => {
    const [y, mon] = m.key.split('-').map(Number)
    const start = new Date(y, mon, 1).getTime()
    const end = new Date(y, mon+1, 1).getTime()
    // Count donation activities as 1 unit each (demo)
    return activities.filter(a => a.type==='donation' && a.ts>=start && a.ts<end).length
  })

  const requestUnits = months.map(m => {
    const [y, mon] = m.key.split('-').map(Number)
    const start = new Date(y, mon, 1).getTime()
    const end = new Date(y, mon+1, 1).getTime()
    return requests.filter(r => r.createdAt>=start && r.createdAt<end).reduce((sum,r)=> sum + (r.units||0), 0)
  })

  const maxY = Math.max(10, ...donationCounts, ...requestUnits)
  const width = 640
  const height = 220
  const pad = { l: 36, r: 12, t: 12, b: 28 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  function pathFor(data, color) {
    const stepX = innerW / (data.length - 1 || 1)
    const toX = (i) => pad.l + i * stepX
    const toY = (v) => pad.t + innerH - (v / maxY) * innerH
    let d = ''
    data.forEach((v,i)=> {
      const x = toX(i), y = toY(v)
      d += i===0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    })
    return <path d={d} fill="none" stroke={color} strokeWidth="2.5" />
  }

  return (
    <div className="md:col-span-3 glass ring-3d rounded-2xl p-6 card-3d">
      <h3 className="font-semibold mb-2">Monthly Donations vs Requests</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="rounded-xl bg-slate-900/50">
        {/* Y axis grid */}
        {Array.from({length:5}).map((_,i)=>{
          const y = 12 + (i*(innerH/4))
          return <line key={i} x1={pad.l} x2={width-pad.r} y1={y} y2={y} stroke="#1f2937" strokeWidth="1" />
        })}
        {/* X labels */}
        {months.map((m,i)=>{
          const stepX = innerW / (months.length - 1 || 1)
          const x = pad.l + i * stepX
          return <text key={m.key} x={x} y={height-8} textAnchor="middle" fontSize="10" fill="#94a3b8">{m.label}</text>
        })}
        {/* Axes */}
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={height-pad.b} stroke="#334155" />
        <line x1={pad.l} x2={width-pad.r} y1={height-pad.b} y2={height-pad.b} stroke="#334155" />
        {/* Lines */}
        {pathFor(donationCounts, '#10b981')}
        {pathFor(requestUnits, '#e11d48')}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-emerald-500"/> Donations</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-rose-500"/> Requests</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">Shows last 12 months using seeded activities (donations) and requests (units).</p>
    </div>
  )
}

function TopHospitals() {
  let store
  try { store = useDataStore() } catch { store = null }
  const requests = store?.requests ?? []
  const acts = store?.activities ?? []
  const byHospital = {}
  for (const r of requests) {
    const key = r.hospital || 'Unknown'
    byHospital[key] = byHospital[key] || { hospital: key, requests: 0, donations: 0 }
    byHospital[key].requests += 1
  }
  for (const a of acts) {
    if (a.type==='supply') {
      const key = a.hospital || 'Unknown'
      byHospital[key] = byHospital[key] || { hospital: key, requests: 0, donations: 0 }
      byHospital[key].donations += a.units || 0
    }
  }
  const rows = Object.values(byHospital).sort((a,b)=> (b.requests+b.donations) - (a.requests+a.donations))
  const max = Math.max(1, ...rows.map(r=> Math.max(r.requests, r.donations)))

  return (
    <div className="md:col-span-3 grid md:grid-cols-2 gap-6">
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3">Hospitals by Requests/Donations</h3>
        <div className="space-y-3 max-h-80 overflow-auto pr-2">
          {rows.map((r)=> (
            <div key={r.hospital} className="space-y-1">
              <div className="text-sm text-slate-300">{r.hospital}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 text-slate-400">Requests</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-600" style={{ width: Math.round((r.requests/max)*100)+'%' }} />
                </div>
                <span className="w-8 text-right text-slate-400">{r.requests}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 text-slate-400">Donations</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: Math.round((r.donations/max)*100)+'%' }} />
                </div>
                <span className="w-8 text-right text-slate-400">{r.donations}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3">Hospitals Table</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-2">Hospital</th>
              <th className="py-2">Requests</th>
              <th className="py-2">Donations</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r.hospital} className="border-t border-white/5">
                <td className="py-2">{r.hospital}</td>
                <td className="py-2">{r.requests}</td>
                <td className="py-2">{r.donations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


