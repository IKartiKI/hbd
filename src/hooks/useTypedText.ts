import { useEffect, useState } from 'react'

interface UseTypedTextOptions {
  text: string
  speedMs?: number
  startDelayMs?: number
}

export function useTypedText({ text, speedMs = 55, startDelayMs = 400 }: UseTypedTextOptions) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let mounted = true
    let timeoutId: number | undefined
    let frame: number | undefined

    const start = () => {
      const startTime = performance.now()
      const loop = (now: number) => {
        if (!mounted) return
        const elapsed = now - startTime
        const chars = Math.min(text.length, Math.floor(elapsed / speedMs))
        setDisplayed(text.slice(0, chars))
        if (chars < text.length) {
          frame = requestAnimationFrame(loop)
        }
      }
      frame = requestAnimationFrame(loop)
    }

    timeoutId = window.setTimeout(start, startDelayMs)

    return () => {
      mounted = false
      if (timeoutId) window.clearTimeout(timeoutId)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [text, speedMs, startDelayMs])

  return displayed
}


