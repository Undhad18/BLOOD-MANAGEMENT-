import { Phone, MapPin, Mail } from 'lucide-react'

export function PublicTopBar() {
  return (
    <div className="w-full bg-slate-900/80 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">National Blood Bank Network (Demo)</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>India</span>
        </div>
        <div className="flex items-center gap-4">
          <a className="flex items-center gap-1 hover:text-white" href="#"><Phone className="h-3 w-3"/>104 Helpline</a>
          <a className="flex items-center gap-1 hover:text-white" href="#"><Mail className="h-3 w-3"/>support@example.com</a>
        </div>
      </div>
    </div>
  )
}


