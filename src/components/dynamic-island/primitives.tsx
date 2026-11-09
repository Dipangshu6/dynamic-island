import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Text whose characters roll vertically when they change. Great for timers and counters. */
export function RollingText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex tabular-nums ${className}`}>
      {text.split('').map((ch, i) => (
        <span key={i} className="relative inline-block h-[1.15em] overflow-hidden leading-[1.15em]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              initial={{ y: '100%', opacity: 0, filter: 'blur(2px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-100%', opacity: 0, filter: 'blur(2px)' }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

/** Animated audio bars. */
export function Equalizer({
  color = '#fff',
  bars = 5,
  height = 16,
  playing = true,
}: {
  color?: string
  bars?: number
  height?: number
  playing?: boolean
}) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: color }}
          animate={{
            height: playing
              ? [height * 0.25, height, height * 0.45, height * 0.8, height * 0.3]
              : height * 0.2,
          }}
          transition={
            playing
              ? {
                  duration: 0.9 + (i % 3) * 0.25,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: i * 0.12,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}

/** Circular progress (0–100) with optional centered content. */
export function ProgressRing({
  progress,
  size = 48,
  stroke = 4,
  color = '#0a84ff',
  trackColor = 'rgba(255,255,255,0.15)',
  children,
}: {
  progress: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (Math.min(100, Math.max(0, progress)) / 100) * c, stroke: color }}
          transition={{ ease: 'easeOut', duration: 0.2 }}
        />
      </svg>
      {children}
    </div>
  )
}
