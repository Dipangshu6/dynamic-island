import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useContext, useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import { DynamicIslandContext, getActivitySize, type IslandActivity } from './context'

const islandSpring: Transition = { type: 'spring', bounce: 0.38, duration: 0.65 }

const contentMotion = {
  initial: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, bounce: 0.3, duration: 0.5, delay: 0.08 },
  },
  exit: { opacity: 0, scale: 0.9, filter: 'blur(8px)', transition: { duration: 0.15 } },
}

export type DynamicIslandProps = {
  /** Render a specific activity (controlled). Omit to read from <DynamicIslandProvider>. */
  activity?: IslandActivity | null
  /** Controlled expanded state, used with `activity`. */
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Shrink and fade out when there is nothing to show. */
  hideWhenIdle?: boolean
  transition?: Transition
  className?: string
  style?: CSSProperties
}

export function DynamicIsland({
  activity,
  expanded,
  onExpandedChange,
  hideWhenIdle = false,
  transition = islandSpring,
  className = '',
  style,
}: DynamicIslandProps) {
  const ctx = useContext(DynamicIslandContext)
  const controlled = activity !== undefined
  const current = controlled ? activity : (ctx?.current ?? null)
  const isExpanded =
    !!current?.expanded && (controlled ? !!expanded : ctx?.expandedId === current.id)
  const size = getActivitySize(current, isExpanded)
  const interactive = !!current && (!!current.expanded || !!current.onClick)
  const hidden = !current && hideWhenIdle
  const ref = useRef<HTMLDivElement>(null)

  const setExpanded = (next: boolean) => {
    if (controlled) onExpandedChange?.(next)
    else if (ctx && current) {
      if (next) ctx.expand(current.id)
      else ctx.collapse()
    }
  }
  const setExpandedRef = useRef(setExpanded)
  useEffect(() => {
    setExpandedRef.current = setExpanded
  })

  useEffect(() => {
    if (!isExpanded) return
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setExpandedRef.current(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedRef.current(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isExpanded])

  const activate = () => {
    if (!current) return
    current.onClick?.()
    if (current.expanded) setExpanded(!isExpanded)
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target !== e.currentTarget && target.closest('button, a, input, select, textarea')) return
    activate()
  }

  return (
    <motion.div
      ref={ref}
      role={interactive ? 'button' : 'status'}
      aria-live="polite"
      aria-expanded={current?.expanded ? isExpanded : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (interactive && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          activate()
        }
      }}
      initial={false}
      animate={{
        width: size.width,
        height: size.height,
        borderRadius: size.radius,
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.6 : 1,
      }}
      transition={transition}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      className={`relative max-w-[calc(100vw-16px)] overflow-hidden bg-black text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ pointerEvents: hidden ? 'none' : undefined, ...style }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {current && (
          <motion.div
            key={`${current.id}:${isExpanded ? 'expanded' : 'default'}`}
            {...contentMotion}
            className="absolute inset-0"
          >
            {isExpanded ? (
              current.expanded
            ) : current.content ? (
              current.content
            ) : (
              <div className="flex h-full items-center justify-between gap-3 px-[10px]">
                <div className="flex items-center">{current.leading}</div>
                <div className="flex items-center">{current.trailing}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
