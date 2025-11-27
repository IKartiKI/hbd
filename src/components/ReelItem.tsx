import { useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { RoastOverlay } from './RoastOverlay'
import { ReelControls } from './ReelControls'

interface ReelItemProps {
  item: MediaItem
  isActive: boolean
  index: number
  onRequestTogglePlay: () => void
  onDoubleRoast: () => void
  onLike: () => void
  liked: boolean
}

export function ReelItem({
  item,
  isActive,
  index,
  onRequestTogglePlay,
  onDoubleRoast,
  onLike,
  liked,
}: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showTapLike, setShowTapLike] = useState(false)
  const likeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive && item.type === 'video') {
      // Set video start time if specified
      if (item.video_start_sec != null) {
        video.currentTime = item.video_start_sec
      }
      if (isPlaying) {
        video
          .play()
          .then(() => {
            video.muted = false
          })
          .catch(() => {})
      } else {
        video.pause()
      }
    } else {
      video.pause()
    }
  }, [isActive, isPlaying, item.type, item.video_start_sec])

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      setIsPlaying(true)
    }
  }, [isActive])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTime = () => {
      if (!video.duration) return
      setProgress(video.currentTime / video.duration)
    }
    video.addEventListener('timeupdate', handleTime)
    return () => {
      video.removeEventListener('timeupdate', handleTime)
    }
  }, [])

  const handleTap = () => {
    setIsPlaying((prev) => !prev)
    onRequestTogglePlay()
  }

  const handleDoubleTap = () => {
    onDoubleRoast()
    onLike()
    setShowTapLike(true)
    if (likeTimeoutRef.current) {
      window.clearTimeout(likeTimeoutRef.current)
    }
    likeTimeoutRef.current = window.setTimeout(() => setShowTapLike(false), 600)
  }

  useEffect(
    () => () => {
      if (likeTimeoutRef.current) window.clearTimeout(likeTimeoutRef.current)
    },
    [],
  )

  return (
    <section
      aria-label={`Roast reel ${index + 1}`}
      className="relative h-full w-full overflow-hidden bg-black text-white"
    >
      {/* Progress bar at the top */}
      <div className="absolute top-0 left-0 right-0 z-20 flex h-1 space-x-1 px-2 pt-2">
        <div className="h-full w-full bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0"
        onClick={handleTap}
        onDoubleClick={handleDoubleTap}
        role="button"
        aria-label="Toggle play / pause"
        tabIndex={-1}
      >
        {item.type === 'photo' ? (
          <div className="relative h-full w-full">
            <img
              src={`/assets/${item.filename}`}
              alt={item.caption}
              loading={isActive ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={`/assets/${item.filename}`}
              muted
              loop
              playsInline
              preload={isActive ? 'auto' : 'metadata'}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="h-8"></div> {/* Spacer for progress bar */}
          
          <div className="flex-1 flex items-end">
            <div className="w-full">
              <RoastOverlay item={item} />
            </div>
          </div>
        </div>

        {/* Like Animation */}
        {showTapLike && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-like-burst text-6xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              ❤️
            </div>
          </div>
        )}
      </div>

<ReelControls
        item={item}
        liked={liked}
        onLike={onLike}
        onSave={() => {
          const link = document.createElement('a')
          link.href = `/assets/${item.filename}`
          link.download = item.filename.split('/').pop() ?? 'reel-media'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      />
    </section>
  )
}


