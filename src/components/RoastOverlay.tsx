import type { MediaItem } from '../types'

interface RoastOverlayProps {
  item: MediaItem
}

export function RoastOverlay({ item }: RoastOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-6 sm:pb-10 flex flex-col items-stretch">
      <div className="px-4 sm:px-6 mb-3">
        <p className="max-w-md text-sm sm:text-base text-slate-100/80 drop-shadow-md line-clamp-2">
          {item.caption}
        </p>
      </div>
      <div className="px-3 sm:px-6 flex items-end justify-between gap-3">
        <div className="max-w-md">
          <div className="inline-flex flex-col gap-1 rounded-3xl bg-gradient-to-tr from-black/80 via-slate-900/80 to-black/40 border border-white/10 px-4 py-3 shadow-roast-lg backdrop-blur-md">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neonYellow/80">
              Peer Review
            </span>
            <p className="text-lg sm:text-2xl font-semibold leading-snug text-white">
              {item.roast_line}
            </p>
          </div>
        </div>

        {item.sticker && (
          <div className="pointer-events-auto mr-1 sm:mr-3 mb-2 sm:mb-4">
            <div className="rotate-[-12deg] inline-flex items-center rounded-2xl bg-neonPink text-black px-3 py-1.5 text-xs sm:text-sm font-extrabold tracking-wide shadow-roast-lg border border-black/60">
              <span className="mr-1.5 text-lg">🔥</span>
              <span className="uppercase">{item.sticker}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
