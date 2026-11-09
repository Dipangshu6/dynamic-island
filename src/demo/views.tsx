import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, BellOff, Check, Pause, Phone, PhoneOff, Play, SkipBack, SkipForward, Timer } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Equalizer, ProgressRing, RollingText, formatTime, useTicker } from '../components/dynamic-island'

export function ShakingBell() {
  return (
    <motion.div
      className="flex h-[25px] w-[40px] items-center justify-center rounded-full bg-[#ff3b30]"
      animate={{ rotate: [0, -22, 18, -14, 10, -5, 0] }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <BellOff size={15} strokeWidth={2.6} />
    </motion.div>
  )
}

export function TimerIcon() {
  return (
    <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#ff9f0a]/20">
      <Timer size={15} className="text-[#ff9f0a]" strokeWidth={2.6} />
    </div>
  )
}

export function Countdown({ from }: { from: number }) {
  const seconds = useTicker(from, -1)
  return <RollingText text={formatTime(seconds)} className="pr-[6px] text-[17px] font-semibold text-[#ff9f0a]" />
}

export function AlbumArt({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background:
          'radial-gradient(circle at 30% 25%, #ff7ab6 0%, transparent 55%), radial-gradient(circle at 75% 80%, #5b8cff 0%, transparent 60%), linear-gradient(135deg, #2a0f4d, #ff5f6d)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.25),transparent_45%)]" />
    </div>
  )
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(true)
  const [elapsed, setElapsed] = useState(84)
  const total = 243

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setElapsed((e) => (e + 1) % total), 1000)
    return () => clearInterval(id)
  }, [playing])

  return (
    <div className="flex h-full flex-col justify-between px-[22px] pb-[18px] pt-[20px]">
      <div className="flex items-center gap-[14px]">
        <AlbumArt size={58} radius={14} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[17px] font-semibold leading-tight">Midnight City</div>
          <div className="truncate text-[15px] text-white/55">M83</div>
        </div>
        <Equalizer color="#ff7ab6" bars={6} height={22} playing={playing} />
      </div>

      <div className="flex items-center gap-[10px] text-[12px] font-medium tabular-nums text-white/50">
        <span className="w-[30px]">{formatTime(elapsed)}</span>
        <div className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            animate={{ width: `${(elapsed / total) * 100}%` }}
            transition={{ ease: 'linear', duration: 1 }}
          />
        </div>
        <span className="w-[34px] text-right">-{formatTime(total - elapsed)}</span>
      </div>

      <div className="flex items-center justify-center gap-[44px]">
        <IconButton label="Previous" onClick={() => setElapsed(0)}>
          <SkipBack size={26} fill="currentColor" />
        </IconButton>
        <IconButton label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={playing ? 'pause' : 'play'}
              initial={{ scale: 0.4, opacity: 0, filter: 'blur(4px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 0.4, opacity: 0, filter: 'blur(4px)' }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
              className="block"
            >
              {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </motion.span>
          </AnimatePresence>
        </IconButton>
        <IconButton label="Next" onClick={() => setElapsed(0)}>
          <SkipForward size={26} fill="currentColor" />
        </IconButton>
      </div>
    </div>
  )
}

function IconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.08 }}
      className="flex items-center justify-center text-white outline-none"
    >
      {children}
    </motion.button>
  )
}

export function IncomingCall({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="flex h-full items-center justify-between px-[14px]">
      <div className="flex items-center gap-[12px]">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#a18cd1] to-[#fbc2eb] text-[19px] font-semibold">
          SC
        </div>
        <div>
          <div className="text-[13px] text-white/50">iPhone</div>
          <div className="text-[17px] font-semibold leading-tight">Sarah Chen</div>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onDecline}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#ff3b30] outline-none"
          aria-label="Decline"
        >
          <PhoneOff size={22} fill="currentColor" strokeWidth={1.5} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          onClick={onAccept}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#30d158] outline-none"
          aria-label="Accept"
        >
          <Phone size={22} fill="currentColor" strokeWidth={1.5} />
        </motion.button>
      </div>
    </div>
  )
}

export function CallTimer() {
  const seconds = useTicker(0, 1)
  return (
    <div className="flex items-center gap-[6px]">
      <Phone size={15} className="text-[#30d158]" fill="#30d158" strokeWidth={1.5} />
      <RollingText text={formatTime(seconds)} className="text-[15px] font-semibold text-[#30d158]" />
    </div>
  )
}

export function AirDrop({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const done = progress >= 100

  useEffect(() => {
    if (done) {
      const t = setTimeout(onDone, 1400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 2 + Math.random() * 5)), 60)
    return () => clearTimeout(t)
  }, [progress, done, onDone])

  return (
    <div className="flex h-full items-center justify-between px-[16px]">
      <div className="flex items-center gap-[12px]">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <ArrowUp size={26} strokeWidth={2.8} />
        </div>
        <div>
          <div className="text-[13px] text-white/50">AirDrop</div>
          <div className="text-[17px] font-semibold leading-tight">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={done ? 'done' : 'sending'}
                initial={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -12, opacity: 0, filter: 'blur(4px)' }}
                className="block"
              >
                {done ? 'Sent to MacBook Pro' : 'Sending 3 photos…'}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ProgressRing progress={progress} color={done ? '#30d158' : '#0a84ff'}>
        <AnimatePresence mode="popLayout" initial={false}>
          {done ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6, duration: 0.5 }}
            >
              <Check size={22} strokeWidth={3.5} className="text-[#30d158]" />
            </motion.div>
          ) : (
            <motion.span key="pct" exit={{ scale: 0, opacity: 0 }} className="text-[11px] font-semibold tabular-nums">
              {Math.floor(progress)}%
            </motion.span>
          )}
        </AnimatePresence>
      </ProgressRing>
    </div>
  )
}
