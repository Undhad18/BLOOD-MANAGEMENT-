import { useDataStore } from '../store/data.js'
import { Clock } from 'lucide-react'

function timeAgo(ts) {
  const d = Math.floor((Date.now()-ts)/1000)
  if (d<60) return `${d}s ago`
  if (d<3600) return `${Math.floor(d/60)}m ago`
  if (d<86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

export function ActivityFeed() {
  const { activities } = useDataStore()
  const recent = activities.slice(0, 10)
  return (
    <div className="glass ring-3d rounded-2xl p-6 card-3d">
      <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-brand-400"/> Recent Activities</h3>
      <div className="space-y-2">
        {recent.map(a=> (
          <div key={a.id} className="bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
            <div className="text-slate-200 text-sm">{a.note}</div>
            <div className="text-xs text-slate-400">{timeAgo(a.ts)}</div>
          </div>
        ))}
        {recent.length===0 && <div className="text-sm text-slate-400">No recent activity.</div>}
      </div>
    </div>
  )
}


