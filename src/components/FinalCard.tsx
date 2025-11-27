import { useState, useRef, useEffect } from 'react'
import { useTypedText } from '../hooks/useTypedText'

interface FinalCardProps {
  herName: string
  onReplay: () => void
}

export function FinalCard({ herName, onReplay }: FinalCardProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loveLine = `Thank you for having a birthday, otherwise I'd never have wasted hours making this side project because of you.`
  const loveLine2 = `Pdhai krle chl kl paper h🥱.`

  const typed1 = useTypedText({ text: loveLine })
  const typed2 = useTypedText({ text: loveLine2, startDelayMs: 2600 })

  // Toggle music playback
  const toggleMusic = async () => {
    if (!audioRef.current) return;
    
    try {
      // Pause any other audio that might be playing
      const mediaElements = document.querySelectorAll<HTMLMediaElement>('audio, video')
      for (const media of Array.from(mediaElements)) {
        if (media !== audioRef.current) {
          media.pause()
        }
      }
      
      if (isMusicPlaying) {
        await audioRef.current.pause()
      } else {
        // If audio src is empty, set it again (in case of previous errors)
        if (!audioRef.current.src) {
          audioRef.current.src = '/assets/media/birthday-music.mp3'
        }
        await audioRef.current.play()
      }
      setIsMusicPlaying(!isMusicPlaying)
    } catch (error) {
      console.error('Error toggling music:', error)
      // Try reloading the audio source if there's an error
      if (audioRef.current) {
        audioRef.current.load()
      }
    }
  }

  // Initialize audio when component mounts
  useEffect(() => {
    // Create audio element with preload set to 'none' to prevent auto-downloading
    audioRef.current = new Audio()
    audioRef.current.preload = 'none'
    audioRef.current.loop = true
    audioRef.current.src = '/assets/media/birthday-music.mp3'
    
    // Handle when audio can play
    const handleCanPlay = () => {
      console.log('Audio can play')
    }
    
    // Handle audio errors
    const handleError = (e: Event) => {
      console.error('Audio error:', e)
    }
    
    audioRef.current.addEventListener('canplay', handleCanPlay)
    audioRef.current.addEventListener('error', handleError)
    
    // Clean up audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('canplay', handleCanPlay)
        audioRef.current.removeEventListener('error', handleError)
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-roastDark via-black to-roastDark text-center px-5 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.24),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-screen bg-[radial-gradient(circle_at_20%_20%,#f97316_0,#f97316_3px,transparent_3px),radial-gradient(circle_at_80%_40%,#22d3ee_0,#22d3ee_3px,transparent_3px)] bg-[length:140px_140px]" />
      </div>

      <div className="relative flex max-w-xl flex-col items-center gap-6 sm:gap-8 z-10">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300/80">
          Anti-Reel • Birthday Edition
        </p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-xl">
          Happy Birthday, {herName} — <br />
          <span className="bg-gradient-to-r from-neonPink via-neonYellow to-neonCyan bg-clip-text text-transparent">
            End of presentation. You may resume being difficult now.
          </span>
        </h1>

        <div className="mt-2 space-y-3 text-sm sm:text-base text-slate-100/90 max-w-lg">
          <p className="min-h-[1.5em]">
            {typed1}
            <span className="inline-block w-[1ch] align-bottom border-r-2 border-neonPink animate-type-cursor" />
          </p>
          <p className="min-h-[1.5em] text-slate-200/90">{typed2}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full bg-gradient-to-r from-neonPink via-neonYellow to-neonCyan px-7 py-2.5 text-sm font-semibold text-black shadow-roast-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neonPink focus-visible:ring-offset-black"
          >
            Replay
          </button>
          <button
            type="button"
            onClick={toggleMusic}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-5 py-2.5 text-sm font-semibold text-slate-100 shadow-roast-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60 focus-visible:ring-offset-black"
          >
            {isMusicPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Pause Music
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play Music
              </>
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMessage(true)
                setTimeout(() => setShowMessage(false), 3000)
              }}
              className="rounded-full border border-white/30 bg-black/40 px-6 py-2.5 text-sm font-semibold text-slate-100 shadow-roast-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60 focus-visible:ring-offset-black"
            >
              Send a Secret Note
            </button>
            {showMessage && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 text-xs text-white rounded-lg whitespace-nowrap animate-fade-in-out">
                You have WhatsApp for that, okay?
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
          No screenshots of this screen allowed. Them's the rules.
        </p>
      </div>

    </div>
  )
}


