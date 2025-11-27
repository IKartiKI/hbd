import { useEffect, useRef, useState, useCallback } from 'react'
import type { MediaItem } from '../types'

interface UseAudioControllerOptions {
  items: MediaItem[]
  activeIndex: number
  isPlaying: boolean
}

const FADE_DURATION = 300

export function useAudioController({ items, activeIndex, isPlaying }: UseAudioControllerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioReady, setAudioReady] = useState(false)
  const currentItemRef = useRef<MediaItem | null>(null)
  const fadeFrame = useRef<number | null>(null)
  const previousAudioRef = useRef<HTMLAudioElement | null>(null)

  // Cleanup function to stop all audio and animations
  const cleanupAudio = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return
    
    // Stop any ongoing fades
    if (fadeFrame.current) {
      cancelAnimationFrame(fadeFrame.current)
      fadeFrame.current = null
    }
    
    // Fade out and pause
    const fadeOut = (startTime: number) => {
      if (!audio) return
      
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / FADE_DURATION, 1)
      audio.volume = Math.max(0, 1 - progress)
      
      if (progress < 1) {
        fadeFrame.current = requestAnimationFrame(() => fadeOut(startTime))
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    }
    
    fadeOut(performance.now())
  }, [])

  // Handle loading / switching audio when the active item changes
  useEffect(() => {
    if (!items.length) return
    
    const currentItem = items[activeIndex]
    if (!currentItem || !currentItem.audio_filename) {
      // If no audio for this item, clean up any existing audio
      if (audioRef.current) {
        cleanupAudio(audioRef.current)
        audioRef.current = null
      }
      setAudioReady(false)
      return
    }

    // Skip if we're already playing this audio
    if (currentItemRef.current?.id === currentItem.id && audioReady) {
      return
    }

    // Initialize audio element if needed
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'auto'
      audioRef.current.loop = false
    }

    const audioEl = audioRef.current
    const src = `/assets/${currentItem.audio_filename}`
    
    // Only change source if needed
    if (audioEl.src !== window.location.origin + src) {
      setAudioReady(false)
      audioEl.src = src
      audioEl.load()
    }

    const handleLoaded = () => {
      if (!audioEl) return
      
      const startTime = currentItem.audio_start_sec ?? 0
      audioEl.currentTime = startTime
      
      // Crossfade if we have a previous audio
      if (previousAudioRef.current && isPlaying) {
        cleanupAudio(previousAudioRef.current)
      }
      
      if (isPlaying) {
        audioEl.volume = 0
        audioEl.play()
          .then(() => {
            // Fade in new audio
            const start = performance.now()
            const fadeIn = (now: number) => {
              const progress = Math.min((now - start) / FADE_DURATION, 1)
              audioEl.volume = progress
              
              if (progress < 1) {
                fadeFrame.current = requestAnimationFrame(fadeIn)
              }
            }
            fadeFrame.current = requestAnimationFrame(fadeIn)
          })
          .catch(console.error)
      }
      
      setAudioReady(true)
      currentItemRef.current = currentItem
    }

    const handleTimeUpdate = () => {
      if (!audioEl) return
      
      const end = currentItem.audio_end_sec
      if (typeof end === 'number' && audioEl.currentTime >= end) {
        audioEl.currentTime = currentItem.audio_start_sec ?? 0
      }
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e)
      setAudioReady(false)
    }

    audioEl.addEventListener('loadedmetadata', handleLoaded, { once: true })
    audioEl.addEventListener('canplaythrough', handleLoaded, { once: true })
    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('error', handleError)

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoaded)
      audioEl.removeEventListener('canplaythrough', handleLoaded)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('error', handleError)
      
      // Store reference for crossfade
      if (audioEl.readyState > 0) {
        previousAudioRef.current = audioEl
      }
    }
  }, [items, activeIndex, isPlaying, cleanupAudio])

  // Handle play/pause toggling
  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl || !audioReady) return
    
    if (isPlaying) {
      audioEl.play().catch(console.error)
    } else {
      audioEl.pause()
    }
  }, [isPlaying, audioReady])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        cleanupAudio(audioRef.current)
      }
      if (previousAudioRef.current) {
        cleanupAudio(previousAudioRef.current)
      }
      if (fadeFrame.current) {
        cancelAnimationFrame(fadeFrame.current)
      }
    }
  }, [cleanupAudio])

  return {
    audio: audioRef.current,
    audioReady,
  }
}


