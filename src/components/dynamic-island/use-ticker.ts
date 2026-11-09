import { useEffect, useState } from 'react'

/** Counts up (step 1) or down (step -1) once per second, clamped at 0. */
export function useTicker(start: number, step: 1 | -1 = 1, running = true) {
  const [value, setValue] = useState(start)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setValue((v) => Math.max(0, v + step)), 1000)
    return () => clearInterval(id)
  }, [step, running])
  return value
}

export const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
