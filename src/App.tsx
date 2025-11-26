import { useEffect, useState } from 'react'
import './index.css'
import type { MediaItem } from './types'
import { ReelFeed } from './components/ReelFeed'

const MANIFEST_URL = '/assets/manifest.json'
const HER_NAME = 'Navyaa♡'

function App() {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(MANIFEST_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load manifest')
        return res.json()
      })
      .then((data: MediaItem[] | { items: MediaItem[] }) => {
        const parsed = Array.isArray(data) ? data : data.items
        setItems(parsed)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not load the birthday roast. Try refreshing.')
      })
  }, [])

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-slate-100">
        <div className="max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-black px-6 py-5 text-center shadow-roast-lg">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!items) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-[70vh] w-full max-w-[480px] rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/90 shadow-[0_25px_75px_rgba(0,0,0,0.8)] p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 border border-white/10">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Summoning your chaotic gallery…</span>
            </div>
            <div className="h-6 w-16 rounded-full bg-slate-800/80" />
          </div>

          <div className="flex-1 pt-6 space-y-4">
            <div className="h-72 rounded-3xl bg-slate-900/80" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-full bg-slate-800/80" />
              <div className="h-4 w-64 rounded-full bg-slate-800/60" />
              <div className="h-4 w-32 rounded-full bg-slate-800/40" />
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 text-xs text-slate-400">
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-900/90" />
              <div className="h-10 w-10 rounded-full bg-slate-900/90" />
            </div>
            <div className="h-1 w-24 rounded-full bg-slate-800/70" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black text-white">
      <ReelFeed items={items} herName={HER_NAME} />
    </div>
  )
}

export default App
