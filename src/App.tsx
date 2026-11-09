import { motion } from 'framer-motion'
import { BatteryFull, BellOff, Camera, Circle, Flashlight, Music, Pause, Phone, Play, Share, Signal, Timer, Wifi } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  DynamicIsland,
  DynamicIslandProvider,
  getActivitySize,
  useDynamicIsland,
  type DynamicIslandApi,
} from './components/dynamic-island'
import { createActivity, type DemoActivity } from './demo/activities'

const CONTROLS: { id: DemoActivity | 'idle'; label: string; icon: ReactNode }[] = [
  { id: 'idle', label: 'Idle', icon: <Circle size={16} /> },
  { id: 'silent', label: 'Silent', icon: <BellOff size={16} /> },
  { id: 'timer', label: 'Timer', icon: <Timer size={16} /> },
  { id: 'music', label: 'Music', icon: <Music size={16} /> },
  { id: 'call', label: 'Call', icon: <Phone size={16} /> },
  { id: 'airdrop', label: 'AirDrop', icon: <Share size={16} /> },
]

type Step = [(island: DynamicIslandApi) => void, number]

const show = (name: DemoActivity) => (island: DynamicIslandApi) => island.show(createActivity(name, island))

const DEMO: Step[] = [
  [(i) => i.clear(), 1200],
  [show('silent'), 2400],
  [show('timer'), 3200],
  [(i) => (i.dismiss('timer'), show('music')(i)), 1800],
  [(i) => i.expand('music'), 3800],
  [(i) => i.collapse(), 1200],
  [show('silent'), 2600],
  [show('call'), 2800],
  [(i) => (i.dismiss('call'), show('callActive')(i)), 3000],
  [(i) => (i.dismiss('callActive'), show('airdrop')(i)), 5200],
]

export default function App() {
  return (
    <DynamicIslandProvider>
      <Demo />
    </DynamicIslandProvider>
  )
}

function usePhoneScale() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerHeight - 48) / 844))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return scale
}

function Demo() {
  const island = useDynamicIsland()
  const params = new URLSearchParams(location.search)
  const clean = params.has('clean')
  const [demo, setDemo] = useState(() => params.has('demo'))
  const [step, setStep] = useState(0)
  const scale = usePhoneScale()
  const islandRef = useRef(island)
  useEffect(() => {
    islandRef.current = island
  })


  useEffect(() => {
    if (!demo) return
    const [run, ms] = DEMO[step % DEMO.length]
    run(islandRef.current)
    const t = setTimeout(() => setStep((s) => s + 1), ms)
    return () => clearTimeout(t)
  }, [demo, step])

  const pick = (id: DemoActivity | 'idle') => {
    setDemo(false)
    island.clear()
    if (id !== 'idle') island.show(createActivity(id, island))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = CONTROLS[Number(e.key) - 1]
      if (c) pick(c.id)
      if (e.key === ' ') {
        e.preventDefault()
        setStep(0)
        setDemo((d) => !d)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const currentId = island.current?.id ?? 'idle'
  const activeControl = currentId === 'callActive' ? 'call' : currentId
  const statusHidden = getActivitySize(island.current, island.expandedId === currentId).width > 140

  return (
    <div className="flex min-h-full items-center justify-center gap-16 overflow-hidden bg-[radial-gradient(ellipse_at_top,#1a1a2e_0%,#050505_60%)] p-6">
      <div style={{ width: 402 * scale, height: 844 * scale }} className="shrink-0">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }} className="h-[844px] w-[402px]">
          <PhoneFrame statusHidden={statusHidden}>
            <DynamicIsland />
          </PhoneFrame>
        </div>
      </div>

      {!clean && (
        <div className="hidden w-[320px] shrink-0 flex-col gap-8 text-white md:flex">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" /> React · Framer Motion · Tailwind
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">Dynamic Island</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-white/50">
              A reusable island driven by <code className="text-white/80">useDynamicIsland()</code>. Tap the music
              island to expand it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CONTROLS.map((c, i) => {
              const active = activeControl === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => pick(c.id)}
                  className={`relative flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium outline-none transition-colors ${
                    active ? 'text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-xl bg-white"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  {!active && <span className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.03]" />}
                  <span className="relative">{c.icon}</span>
                  <span className="relative flex-1">{c.label}</span>
                  <kbd className={`relative text-[11px] ${active ? 'text-black/40' : 'text-white/25'}`}>{i + 1}</kbd>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => {
              setStep(0)
              setDemo((d) => !d)
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] px-4 py-3 text-sm font-medium text-white outline-none hover:from-white/15"
          >
            {demo ? <Pause size={16} /> : <Play size={16} />}
            {demo ? 'Stop auto demo' : 'Play auto demo'}
            <kbd className="ml-1 text-[11px] text-white/30">space</kbd>
          </button>
        </div>
      )}
    </div>
  )
}

function PhoneFrame({ children, statusHidden }: { children: ReactNode; statusHidden: boolean }) {
  return (
    <div className="relative h-full w-full rounded-[64px] bg-[#1c1c1e] p-[12px] shadow-[0_0_0_2px_#3a3a3c,0_40px_120px_-20px_rgba(120,80,255,0.35)]">
      <div className="relative h-full w-full overflow-hidden rounded-[52px] bg-[radial-gradient(circle_at_20%_10%,#7b3fe4_0%,transparent_45%),radial-gradient(circle_at_90%_40%,#ff5f6d_0%,transparent_45%),radial-gradient(circle_at_30%_90%,#1fa2ff_0%,transparent_50%),linear-gradient(180deg,#120c2b,#0b0b1a)]">
        <motion.div
          animate={{ opacity: statusHidden ? 0 : 1, filter: statusHidden ? 'blur(4px)' : 'blur(0px)' }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-0 top-0 flex h-[59px] items-center justify-between px-[34px] text-[17px] font-semibold text-white"
        >
          <span className="w-[54px] text-center">9:41</span>
          <span className="flex items-center gap-[6px]">
            <Signal size={17} strokeWidth={2.6} />
            <Wifi size={17} strokeWidth={2.6} />
            <BatteryFull size={24} strokeWidth={2} />
          </span>
        </motion.div>

        <div className="absolute inset-x-0 top-[11px] z-10 flex justify-center">{children}</div>

        <div className="absolute inset-x-0 top-[150px] text-center text-white">
          <div className="text-[20px] font-semibold text-white/80">Monday, November 9</div>
          <div className="text-[96px] font-bold leading-none tracking-tight text-white/90">9:41</div>
        </div>

        <div className="absolute inset-x-0 bottom-[44px] flex justify-between px-[46px]">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md">
            <Flashlight size={22} />
          </div>
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md">
            <Camera size={22} />
          </div>
        </div>
        <div className="absolute bottom-[9px] left-1/2 h-[5px] w-[140px] -translate-x-1/2 rounded-full bg-white/80" />
      </div>
    </div>
  )
}
