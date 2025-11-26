import { useEffect, useRef, useState } from 'react'
import type { MediaItem } from '../types'

interface UseAudioControllerOptions {
  items: MediaItem[]
  activeIndex: number
  isPlaying: boolean
}

const FADE_DURATION = 400

export function useAudioController({ items, activeIndex, isPlaying }: UseAudioControllerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioReady, setAudioReady] = useState(false)

  // Handle loading / switching audio when the active item changes
  useEffect(() => {
    if (!items.length) return
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = false
    }

    const audioEl = audioRef.current
    const currentItem = items[activeIndex]
    if (!currentItem || !currentItem.audio_filename) return

    let fadeFrame: number | null = null

    const fadeVolume = (from: number, to: number, cb?: () => void) => {
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / FADE_DURATION)
        const value = from + (to - from) * progress
        audioEl.volume = Math.max(0, Math.min(1, value))
        if (progress < 1) {
          fadeFrame = requestAnimationFrame(step)
        } else if (cb) {
          cb()
        }
      }
      fadeFrame = requestAnimationFrame(step)
    }

    const handleLoaded = () => {
      setAudioReady(true)
      const startTime = currentItem.audio_start_sec ?? 0
      audioEl.currentTime = startTime
      if (isPlaying) {
        audioEl.volume = 0
        audioEl
          .play()
          .then(() => fadeVolume(0, 1))
          .catch(() => {})
      }
    }

    const handleTimeUpdate = () => {
      const end = currentItem.audio_end_sec
      if (typeof end === 'number' && audioEl.currentTime >= end) {
        audioEl.currentTime = currentItem.audio_start_sec ?? 0
      }
    }

    const src = `/assets/${currentItem.audio_filename}`
    if (audioEl.src !== window.location.origin + src) {
      setAudioReady(false)
      audioEl.src = src
      audioEl.load()
    }

    audioEl.addEventListener('loadedmetadata', handleLoaded)
    audioEl.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoaded)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      if (fadeFrame !== null) cancelAnimationFrame(fadeFrame)
      fadeVolume(audioEl.volume, 0, () => {
        audioEl.pause()
      })
    }
  }, [items, activeIndex])

  // Handle simple play / pause toggling without resetting the source
  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl || !audioReady) return
    if (isPlaying) {
      audioEl
        .play()
        .then(() => {
          audioEl.volume = 1
        })
        .catch(() => {})
    } else {
      audioEl.pause()
    }
  }, [isPlaying, audioReady])

  return {
    audio: audioRef.current,
    audioReady,
  }
}


