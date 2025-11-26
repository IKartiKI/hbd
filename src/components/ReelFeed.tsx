import { useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { useAudioController } from '../hooks/useAudioController'
import { ReelItem } from './ReelItem'
import { FinalCard } from './FinalCard'

interface ReelFeedProps {
  items: MediaItem[]
  herName: string
}

type ToastState = { id: number; message: string } | null

export function ReelFeed({ items, herName }: ReelFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [roastMode, setRoastMode] = useState(true)
  // Start paused so the first user tap counts as an intentional gesture for audio autoplay policies
  const [isPlaying, setIsPlaying] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const wheelTimeout = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isThrottled = useRef(false)
  const toastIdRef = useRef(0)

  useAudioController({ items, activeIndex, isPlaying })

  const navigate = (direction: 1 | -1) => {
    setActiveIndex((prev) => {
      const next = prev + direction
      if (next < 0) return 0
      if (next > items.length) return items.length
      return next
    })
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isThrottled.current) return
      isThrottled.current = true
      if (e.deltaY > 30) navigate(1)
      if (e.deltaY < -30) navigate(-1)
      wheelTimeout.current = window.setTimeout(() => {
        isThrottled.current = false
      }, 450)
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') navigate(1)
      if (e.key === 'ArrowUp') navigate(-1)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
      if (wheelTimeout.current) window.clearTimeout(wheelTimeout.current)
    }
  }, [items.length])

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartY.current = e.touches[0]?.clientY ?? null
  }
  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartY.current == null) return
    const diff = touchStartY.current - (e.touches[0]?.clientY ?? 0)
    if (Math.abs(diff) < 45) return
    if (diff > 0) {
      navigate(1)
    } else {
      navigate(-1)
    }
    touchStartY.current = null
  }

  const showRoastToast = () => {
    const id = ++toastIdRef.current
    setToast({ id, message: 'Roasted!' })
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current))
    }, 900)
  }

  const handleReplay = () => {
    setShowConfetti(true)
    window.setTimeout(() => setShowConfetti(false), 1800)
    setActiveIndex(0)
    setIsPlaying(true)
  }

  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className="relative flex h-full w-full items-stretch justify-center bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <main className="relative h-full max-h-[100vh] w-full max-w-[480px] sm:max-w-[480px] bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.16),transparent_55%)] mix-blend-screen opacity-40 pointer-events-none" />

        <div className="relative h-full w-full overflow-hidden rounded-none sm:rounded-[32px] border border-white/10 bg-black/95 shadow-[0_25px_75px_rgba(0,0,0,0.75)]">
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-3 sm:px-5 sm:pt-4 flex items-center justify-between text-xs text-slate-100">
            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 border border-white/10">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] tracking-wide text-slate-100/90">
                {timestamp}
              </span>
            </div>

            <button
              type="button"
              aria-pressed={roastMode}
              aria-label="Toggle Roast Mode"
              onClick={() => setRoastMode((prev) => !prev)}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 border border-white/10 text-[11px] font-semibold tracking-wide"
            >
              <span
                className={`inline-flex h-4 w-7 items-center rounded-full px-0.5 transition-colors ${
                  roastMode ? 'bg-neonPink/90' : 'bg-slate-600/80'
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full bg-black shadow-sm transition-transform ${
                    roastMode ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </span>
              <span>{roastMode ? 'Roast Mode: ON' : 'Roast Mode: OFF'}</span>
            </button>
          </header>

          <div
            className="relative h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateY(-${activeIndex * 100}%)` }}
          >
            <div className="h-full w-full">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  id={`reel-${item.id}`}
                  className="h-full w-full"
                  aria-hidden={activeIndex !== index}
                >
                  <ReelItem
                    item={item}
                    isActive={activeIndex === index}
                    roastMode={roastMode}
                    index={index}
                    onRequestTogglePlay={() => setIsPlaying((prev) => !prev)}
                    onDoubleRoast={showRoastToast}
                    liked={likedIds.has(item.id)}
                    onLike={() =>
                      setLikedIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(item.id)) next.delete(item.id)
                        else next.add(item.id)
                        return next
                      })
                    }
                  />
                </div>
              ))}

              <div className="h-full w-full">
                <FinalCard herName={herName} onReplay={handleReplay} />
              </div>
            </div>
          </div>

          {toast && (
            <div className="pointer-events-none absolute inset-x-0 top-16 flex justify-center z-30">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-slate-100 border border-white/15 shadow-roast-lg animate-roast-pop">
                <span className="text-lg">😂</span>
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {showConfetti && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
              {Array.from({ length: 18 }).map((_, idx) => (
                <div
                  key={idx}
                  className="absolute left-1/2 top-0 h-3 w-1.5 rounded-sm bg-gradient-to-b from-neonPink via-neonYellow to-neonCyan animate-confetti-fall"
                  style={{
                    transform: `translateX(${(idx - 9) * 14}px)`,
                    animationDelay: `${idx * 40}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


