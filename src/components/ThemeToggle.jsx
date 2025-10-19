import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const KEY = 'bb_theme_v1'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(()=>{
    const stored = localStorage.getItem(KEY)
    const isDark = stored ? stored === 'dark' : true
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  },[])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(KEY, next ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
      {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
      <span className="text-xs">{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}


