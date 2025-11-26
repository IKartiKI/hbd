import type { MediaItem } from '../types'

interface ReelControlsProps {
  item: MediaItem
  isActive: boolean
  isPlaying: boolean
  progress: number
  liked: boolean
  onTogglePlay: () => void
  onLike: () => void
  onShare: () => void
  onSave: () => void
}

export function ReelControls({
  item,
  isActive,
  isPlaying,
  progress,
  liked,
  onTogglePlay,
  onLike,
  onShare,
  onSave,
}: ReelControlsProps) {
  return (
    <div className="absolute bottom-4 right-3 sm:right-6 flex flex-col items-center gap-4 text-white drop-shadow-lg">
      <button
        type="button"
        aria-label={liked ? 'Unlike' : 'Like'}
        onClick={onLike}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/10"
      >
        <span
          className={`text-2xl transition-transform ${
            liked ? 'scale-110 text-red-400' : 'scale-100 text-white'
          }`}
        >
          {liked ? '💩' : '💩'}
        </span>
      </button>

      <div className="relative">
        <button
          type="button"
          aria-label="Share reel"
          onClick={(e) => {
            e.stopPropagation();
            const shareMenu = document.getElementById(`share-menu-${item.id}`);
            if (shareMenu) {
              shareMenu.classList.toggle('hidden');
            }
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/10 text-xl"
        >
          📤
        </button>
        <div 
          id={`share-menu-${item.id}`}
          className="hidden absolute bottom-14 right-0 w-40 bg-black/80 backdrop-blur-sm rounded-xl p-2 border border-white/10 shadow-lg z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs text-white/70 px-3 py-1.5">Share to...</div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const calcMenu = document.getElementById(`calc-menu-${item.id}`);
              if (calcMenu) {
                calcMenu.classList.toggle('hidden');
              }
            }}
            className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm flex items-center gap-2"
          >
            <span>Calculator</span>
            <span className="text-xs opacity-50">=</span>
          </button>
          <div 
            id={`calc-menu-${item.id}`}
            className="hidden absolute left-[-160px] top-0 w-40 bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 shadow-lg"
          >
            <div className="text-xs text-white/70 mb-2">Calculator</div>
            <div className="bg-black/50 rounded-lg p-2 text-right text-xs font-mono mb-2 border border-white/5">
              <div className="h-4"></div>
              <div className="text-lg">0</div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-sm">
              {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map((char) => (
                <button 
                  key={char}
                  className="aspect-square rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Just for show - no actual calculation
                    if (char === '=') {
                      setTimeout(() => {
                        const calcMenu = document.getElementById(`calc-menu-${item.id}`);
                        if (calcMenu) {
                          calcMenu.classList.add('hidden');
                        }
                        const shareMenu = document.getElementById(`share-menu-${item.id}`);
                        if (shareMenu) {
                          shareMenu.classList.add('hidden');
                        }
                      }, 300);
                    }
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Save reel"
        onClick={onSave}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/10 text-xl"
      >
        💾
      </button>

      <button
        type="button"
        aria-label={isPlaying ? 'Pause media' : 'Play media'}
        onClick={onTogglePlay}
        className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/10 text-xs uppercase tracking-wide"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {isActive && item.type === 'video' && (
        <div
          aria-hidden="true"
          className="mt-2 h-0.5 w-10 rounded-full bg-white/15 overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-neonPink via-neonYellow to-neonCyan transition-[width]"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  )
}


