import { useState } from 'react'
import { useTypedText } from '../hooks/useTypedText'

interface FinalCardProps {
  herName: string
  onReplay: () => void
}

export function FinalCard({ herName, onReplay }: FinalCardProps) {
  const [showModal, setShowModal] = useState(false)
  const loveLine = `Thank you for being the most chaotic, radiant part of my universe.`
  const loveLine2 = `The roast is fake mean. The love is aggressively real.`

  const typed1 = useTypedText({ text: loveLine })
  const typed2 = useTypedText({ text: loveLine2, startDelayMs: 2600 })

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-roastDark via-black to-roastDark text-center px-5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.24),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-screen bg-[radial-gradient(circle_at_20%_20%,#f97316_0,#f97316_3px,transparent_3px),radial-gradient(circle_at_80%_40%,#22d3ee_0,#22d3ee_3px,transparent_3px)] bg-[length:140px_140px]" />
      </div>

      <div className="relative flex max-w-xl flex-col items-center gap-6 sm:gap-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300/80">
          Anti-Reel • Birthday Edition
        </p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-xl">
          Happy Birthday, {herName} — <br />
          <span className="bg-gradient-to-r from-neonPink via-neonYellow to-neonCyan bg-clip-text text-transparent">
            the Roast Ends, the Love Doesn’t.
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
            Replay the Roast
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-full border border-white/30 bg-black/40 px-6 py-2.5 text-sm font-semibold text-slate-100 shadow-roast-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60 focus-visible:ring-offset-black"
          >
            Send a Secret Note
          </button>
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
          No screenshots of this screen allowed. Them’s the rules.
        </p>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-black border border-white/10 shadow-roast-lg p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold text-white">Write your secret note</h2>
            <p className="mb-4 text-xs text-slate-300">
              This is just for you to draft and feel your feelings. Nothing is saved or sent
              anywhere.
            </p>
            <textarea
              aria-label="Secret note to her (not stored)"
              rows={5}
              className="w-full resize-none rounded-2xl border border-white/15 bg-black/60 px-3.5 py-3 text-sm text-slate-100 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neonPink/70"
              placeholder="Dear [HerName], I promise the roasting stops the second you say the word..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


