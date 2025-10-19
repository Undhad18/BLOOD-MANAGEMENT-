import { create } from 'zustand'
import { setSecureItem, getSecureItem } from './secureStorage.js'

const KEY = 'bb_data_seed_v1'

const seed = {
  donors: [
    { id: 'd1', name: 'Anita Sharma', email: 'anita@example.com', blood: 'A+', city: 'Delhi', lastDonation: '2025-08-28', verified: true },
    { id: 'd2', name: 'Rahul Mehta', email: 'rahul@example.com', blood: 'O-', city: 'Mumbai', lastDonation: '2025-06-10', verified: true },
    { id: 'd3', name: 'Sana Khan', email: 'sana@example.com', blood: 'B+', city: 'Pune', lastDonation: '2025-09-15', verified: false },
  ],
  hospitals: [
    { id: 'h1', name: 'City Hospital Delhi', city: 'Delhi', approved: true },
    { id: 'h2', name: 'General Hospital Mumbai', city: 'Mumbai', approved: true },
    { id: 'h3', name: 'Care Clinic Pune', city: 'Pune', approved: false },
  ],
  centers: [
    { id: 'c1', name: 'Blood Center Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, units: 120 },
    { id: 'c2', name: 'Civil Hospital Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, units: 340 },
    { id: 'c3', name: 'Red Cross Surat', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, units: 180 },
    { id: 'c4', name: 'City Hospital Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, units: 210 },
    { id: 'c5', name: 'General Hospital Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, units: 260 },
  ],
  inventory: { 'A+': 80, 'A-': 25, 'B+': 60, 'B-': 20, 'AB+': 30, 'AB-': 12, 'O+': 90, 'O-': 18 },
  requests: [
    { id: 'r1', patient: 'Vikas', hospital: 'City Hospital Delhi', blood: 'O-', units: 2, status: 'pending', emergency: true, createdAt: Date.now()-86400000 },
    { id: 'r2', patient: 'Priya', hospital: 'General Hospital Mumbai', blood: 'A+', units: 1, status: 'approved', emergency: false, createdAt: Date.now()-172800000 },
  ],
  activities: [
    { id: 'a1', type: 'donation', note: 'Rahul donated O-', ts: Date.now()-3600000 },
    { id: 'a2', type: 'request', note: 'Emergency request O- at City Hospital', ts: Date.now()-7200000 },
    // supply events (hospital supplies units to fulfill requests or transfers)
    { id: 'a3', type: 'supply', hospital: 'City Hospital Delhi', blood: 'A+', units: 6, ts: Date.now()-86400000*10 },
    { id: 'a4', type: 'supply', hospital: 'General Hospital Mumbai', blood: 'O-', units: 4, ts: Date.now()-86400000*20 },
    { id: 'a5', type: 'supply', hospital: 'General Hospital Mumbai', blood: 'A+', units: 3, ts: Date.now()-86400000*35 },
  ],
}

function load() {
  const data = getSecureItem(KEY, null)
  return data ?? seed
}

function persist(state) {
  setSecureItem(KEY, state)
}

export const useDataStore = create((set, get) => ({
  ...load(),
  addDonor: (donor) => set((s) => {
    const added = { ...donor, id: crypto.randomUUID(), verified: false }
    const next = { ...s, donors: [ added, ...s.donors ], activities: [ { id: crypto.randomUUID(), type: 'register', note: `New donor registered: ${added.name} (${added.blood||'?'})`, ts: Date.now() }, ...s.activities ] }
    persist(next)
    return next
  }),
  verifyDonor: (id, verified=true) => set((s)=>{
    const next = { ...s, donors: s.donors.map(d=> d.id===id?{...d, verified}:d) }
    persist(next)
    return next
  }),
  updateInventory: (blood, delta) => set((s)=>{
    const val = Math.max(0, (s.inventory[blood]||0)+delta)
    const action = delta>=0?`+${delta}`:`${delta}`
    const next = { ...s, inventory: { ...s.inventory, [blood]: val }, activities: [ { id: crypto.randomUUID(), type: 'stock', note: `Stock updated: ${blood} ${action} units`, ts: Date.now() }, ...s.activities ] }
    persist(next)
    return next
  }),
  addRequest: (req) => set((s)=>{
    const created = { id: crypto.randomUUID(), status: 'pending', createdAt: Date.now(), ...req }
    const next = { ...s, requests: [ created, ...s.requests ], activities: [ { id: crypto.randomUUID(), type: 'request', note: `New request: ${created.blood} • ${created.units} units • ${created.hospital||''}`, ts: Date.now() }, ...s.activities ] }
    persist(next)
    return next
  }),
  setRequestStatus: (id, status) => set((s)=>{
    const req = s.requests.find(r=> r.id===id)
    const next = { ...s, requests: s.requests.map(r=> r.id===id?{...r, status}:r), activities: [ { id: crypto.randomUUID(), type: status==='approved'?'approve':'deny', note: `Request ${status}: ${req?.blood} • ${req?.units} units • ${req?.hospital||''}`, ts: Date.now() }, ...s.activities ] }
    persist(next)
    return next
  }),
  addHospital: (h) => set((s)=>{
    const next = { ...s, hospitals: [ { id: crypto.randomUUID(), approved: false, ...h }, ...s.hospitals ] }
    persist(next)
    return next
  }),
  setHospitalApproval: (id, approved=true) => set((s)=>{
    const next = { ...s, hospitals: s.hospitals.map(h=> h.id===id?{...h, approved}:h) }
    persist(next)
    return next
  }),
  logActivity: (type, note) => set((s)=>{
    const next = { ...s, activities: [ { id: crypto.randomUUID(), type, note, ts: Date.now() }, ...s.activities ] }
    persist(next)
    return next
  }),
}))


