import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DynamicIslandContext, type DynamicIslandApi, type IslandActivity } from './context'

export function DynamicIslandProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<IslandActivity[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const listRef = useRef<IslandActivity[]>([])
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const commit = useCallback((next: IslandActivity[]) => {
    listRef.current = next
    setActivities(next)
  }, [])

  const clearTimer = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) clearTimeout(t)
    timers.current.delete(id)
  }, [])

  const dismiss = useCallback(
    (id?: string) => {
      const list = listRef.current
      const target = id ?? list[list.length - 1]?.id
      const found = list.find((a) => a.id === target)
      if (!found) return
      clearTimer(found.id)
      commit(list.filter((a) => a.id !== found.id))
      setExpandedId((e) => (e === found.id ? null : e))
      found.onDismiss?.()
    },
    [clearTimer, commit],
  )

  const show = useCallback(
    (activity: IslandActivity) => {
      commit([...listRef.current.filter((a) => a.id !== activity.id), activity])
      clearTimer(activity.id)
      if (activity.duration) {
        timers.current.set(
          activity.id,
          setTimeout(() => dismiss(activity.id), activity.duration),
        )
      }
      return activity.id
    },
    [clearTimer, commit, dismiss],
  )

  const update = useCallback<DynamicIslandApi['update']>(
    (id, patch) => commit(listRef.current.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    [commit],
  )

  const clear = useCallback(() => {
    const list = listRef.current
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    commit([])
    setExpandedId(null)
    list.forEach((a) => a.onDismiss?.())
  }, [commit])

  const expand = useCallback((id?: string) => {
    const list = listRef.current
    setExpandedId(id ?? list[list.length - 1]?.id ?? null)
  }, [])

  const collapse = useCallback(() => setExpandedId(null), [])

  useEffect(() => {
    const map = timers.current
    return () => map.forEach(clearTimeout)
  }, [])

  const value = useMemo<DynamicIslandApi>(
    () => ({
      activities,
      current: activities[activities.length - 1] ?? null,
      expandedId,
      show,
      update,
      dismiss,
      clear,
      expand,
      collapse,
    }),
    [activities, expandedId, show, update, dismiss, clear, expand, collapse],
  )

  return <DynamicIslandContext.Provider value={value}>{children}</DynamicIslandContext.Provider>
}
