import { useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'
import { RoastOverlay } from './RoastOverlay'
import { ReelControls } from './ReelControls'

interface ReelItemProps {
  item: MediaItem
  isActive: boolean
  roastMode: boolean
  index: number
  onRequestTogglePlay: () => void
  onDoubleRoast: () => void
  onLike: () => void
  liked: boolean
}

export function ReelItem({
  item,
  isActive,
  roastMode,
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
      className="relative h-full w-full overflow-hidden rounded-none bg-black text-white"
    >
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
              className="h-full w-full object-cover animate-ken-burns-slow"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>
        )}

        <RoastOverlay item={item} roastMode={roastMode} />

        {showTapLike && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-like-burst text-6xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              💩
            </div>
          </div>
        )}
      </div>

      <ReelControls
        item={item}
        isActive={isActive}
        isPlaying={isPlaying}
        progress={progress}
        liked={liked}
        onTogglePlay={handleTap}
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/10 to-transparent" />
    </section>
  )
}


