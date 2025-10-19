import React from 'react'
import { useDataStore } from '../store/data.js'
import { useNotificationStore } from '../store/notifications.js'
import { Droplet, Bell, Users, Building2, Activity as ActivityIcon, CheckCircle2, HeartPulse } from 'lucide-react'
import { ActivityFeed } from '../components/ActivityFeed.jsx'

export function Admin() {
  const { donors, hospitals, inventory, requests, activities, setRequestStatus, setHospitalApproval, verifyDonor, updateInventory, logActivity } = useDataStore()
  const { addNotification } = useNotificationStore()
  const totals = {
    donors: donors.length,
    units: Object.values(inventory).reduce((a,b)=>a+b,0),
    requests: requests.length,
  }
  const pendingRequests = requests.filter(r=> r.status==='pending').length
  const approvedHospitals = hospitals.filter(h=> h.approved).length
  const allDonations = activities.filter(a=> a.type==='donation').length
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const donationsThisMonth = activities.filter(a=> a.type==='donation' && a.ts>=monthStart).length

  // Local filters for realism
  const [donorQuery, setDonorQuery] = React.useState('')
  const [reqQuery, setReqQuery] = React.useState('')
  const filteredDonors = donors.filter(d=> (d.name?.toLowerCase().includes(donorQuery.toLowerCase()) || d.email?.toLowerCase().includes(donorQuery.toLowerCase())) )
  const filteredRequests = requests.filter(r=> (r.hospital?.toLowerCase().includes(reqQuery.toLowerCase()) || r.patient?.toLowerCase().includes(reqQuery.toLowerCase())) )

  function bulkVerifyDonors() {
    filteredDonors.filter(d=> !d.verified).forEach(d=> verifyDonor(d.id, true))
    addNotification({ type:'bulk', message:`Verified ${filteredDonors.filter(d=>!d.verified).length} donors` })
  }
  function bulkApproveRequests() {
    filteredRequests.filter(r=> r.status==='pending').forEach(r=> setRequestStatus(r.id,'approved'))
    addNotification({ type:'bulk', message:`Approved ${filteredRequests.filter(r=>r.status==='pending').length} requests` })
  }
  function bulkApproveHospitals() {
    hospitals.filter(h=> !h.approved).forEach(h=> setHospitalApproval(h.id,true))
    addNotification({ type:'bulk', message:`Approved ${hospitals.filter(h=>!h.approved).length} hospitals` })
  }

  return (
    <div className="grid gap-6">
      {/* Admin banner distinct from homepage */}
      <div className="rounded-3xl p-6 card-3d shadow-neon bg-gradient-to-r from-slate-900 via-rose-900/30 to-sky-900/30 ring-3d">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Admin Console</div>
            <div className="text-2xl font-semibold">Operational Overview</div>
            <div className="text-slate-400 text-sm">Manage inventory, verify donors, approve hospitals, and monitor requests</div>
          </div>
          <div className="flex gap-2">
            <button onClick={bulkVerifyDonors} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">Verify All</button>
            <button onClick={bulkApproveRequests} className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white">Approve Pending</button>
            <button onClick={bulkApproveHospitals} className="px-3 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white">Approve Hospitals</button>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="rounded-2xl p-4 card-3d shadow-neon bg-gradient-to-br from-slate-900/80 to-slate-900/40 ring-3d">
          <div className="text-slate-400 text-xs flex items-center gap-2"><Users className="h-4 w-4 text-sky-300"/> Total Donors</div>
          <div className="mt-1 text-2xl font-semibold">{totals.donors}</div>
        </div>
        <div className="rounded-2xl p-4 card-3d shadow-elev-2 bg-gradient-to-br from-rose-900/60 to-rose-800/30 ring-3d">
          <div className="text-rose-200 text-xs flex items-center gap-2"><HeartPulse className="h-4 w-4"/> Total Donations</div>
          <div className="mt-1 text-2xl font-semibold">{allDonations}</div>
        </div>
        <div className="rounded-2xl p-4 card-3d shadow-elev-2 bg-gradient-to-br from-emerald-900/60 to-emerald-800/30 ring-3d">
          <div className="text-emerald-200 text-xs flex items-center gap-2"><Droplet className="h-4 w-4"/> Available Units</div>
          <div className="mt-1 text-2xl font-semibold">{totals.units}</div>
        </div>
        <div className="rounded-2xl p-4 card-3d shadow-elev-2 bg-gradient-to-br from-amber-900/60 to-amber-800/30 ring-3d">
          <div className="text-amber-200 text-xs flex items-center gap-2"><Bell className="h-4 w-4"/> Pending Requests</div>
          <div className="mt-1 text-2xl font-semibold">{pendingRequests}</div>
        </div>
        <div className="rounded-2xl p-4 card-3d shadow-elev-2 bg-gradient-to-br from-sky-900/60 to-sky-800/30 ring-3d">
          <div className="text-sky-200 text-xs flex items-center gap-2"><Building2 className="h-4 w-4"/> Partner Hospitals</div>
          <div className="mt-1 text-2xl font-semibold">{approvedHospitals}</div>
        </div>
        <div className="rounded-2xl p-4 card-3d shadow-elev-2 bg-gradient-to-br from-fuchsia-900/60 to-fuchsia-800/30 ring-3d">
          <div className="text-fuchsia-200 text-xs flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Donations This Month</div>
          <div className="mt-1 text-2xl font-semibold">{donationsThisMonth}</div>
        </div>
      </div>

      {/* Low stock alerts */}
      {(() => {
        const lows = Object.entries(inventory).filter(([,v])=> (v||0) < 10)
        if (lows.length === 0) return null
        return (
          <section className="glass ring-3d rounded-2xl p-6 card-3d">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Bell className="h-4 w-4 text-amber-300"/> Low Stock Alerts</h3>
            <div className="space-y-3">
              {lows.map(([group, val])=> {
                const eligible = donors.filter(d=> d.verified && d.blood === group)
                return (
                  <div key={group} className="bg-slate-900/60 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-amber-200">⚠️ {group} stock is low! Only {val||0} units left.</div>
                      <div className="text-slate-400 text-sm">Eligible donors: {eligible.length}</div>
                    </div>
                    <button onClick={()=> { logActivity('notify', `Requested donors with ${group}`); addNotification({ type:'low_stock', message:`Request sent to ${eligible.length} ${group} donors` }) }} className="px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white">Request Donors</button>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })()}

      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Droplet className="h-4 w-4 text-brand-400"/> Manage Inventory</h3>
        <div className="grid md:grid-cols-4 gap-3">
          {Object.entries(inventory).map(([k,v])=> (
            <div key={k} className="bg-slate-900/60 rounded-xl p-4 shadow-elev-2">
              <div className="text-slate-400 text-sm">{k}</div>
              <div className="text-xl font-semibold">{v}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>updateInventory(k, +1)} className="px-2 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white">+1</button>
                <button onClick={()=>updateInventory(k, -1)} className="px-2 py-1 rounded-md bg-rose-700 hover:bg-rose-600 text-white">-1</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ActivityFeed />

      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-brand-400"/> Manage Donors</h3>
        <div className="mb-3 flex items-center gap-3">
          <input value={donorQuery} onChange={(e)=>setDonorQuery(e.target.value)} placeholder="Search donors by name or email" className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 flex-1"/>
        </div>
        <div className="space-y-2 max-h-80 overflow-auto pr-2">
          {filteredDonors.map(d=> (
            <div key={d.id} className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.name} • {d.blood}</div>
                <div className="text-slate-400 text-sm">{d.city} • {d.email}</div>
              </div>
              <button onClick={()=>verifyDonor(d.id, !d.verified)} className={`px-3 py-1 rounded-md ${d.verified?'bg-emerald-700 hover:bg-emerald-600':'bg-amber-700 hover:bg-amber-600'} text-white`}>{d.verified?'Verified':'Verify'}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-400"/> Manage Hospitals</h3>
        <div className="space-y-2 max-h-80 overflow-auto pr-2">
          {hospitals.map(h=> (
            <div key={h.id} className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{h.name}</div>
                <div className="text-slate-400 text-sm">{h.city}</div>
              </div>
              <button onClick={()=>setHospitalApproval(h.id, !h.approved)} className={`px-3 py-1 rounded-md ${h.approved?'bg-emerald-700 hover:bg-emerald-600':'bg-amber-700 hover:bg-amber-600'} text-white`}>{h.approved?'Approved':'Approve'}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass ring-3d rounded-2xl p-6 card-3d">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><ActivityIcon className="h-4 w-4 text-brand-400"/> Requests</h3>
        <div className="mb-3 flex items-center gap-3">
          <input value={reqQuery} onChange={(e)=>setReqQuery(e.target.value)} placeholder="Search requests by patient or hospital" className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 flex-1"/>
        </div>
        <div className="space-y-2 max-h-80 overflow-auto pr-2">
          {filteredRequests.map(r=> (
            <div key={r.id} className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.patient} • {r.blood} • {r.units} units {r.emergency && <span className="text-rose-300">(Emergency)</span>}</div>
                <div className="text-slate-400 text-sm">{r.hospital}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setRequestStatus(r.id,'approved')} className="px-3 py-1 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white">Approve</button>
                <button onClick={()=>setRequestStatus(r.id,'denied')} className="px-3 py-1 rounded-md bg-rose-700 hover:bg-rose-600 text-white">Deny</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


