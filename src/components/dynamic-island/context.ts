import { createContext, useContext, type ReactNode } from 'react'

export type IslandSizePreset = 'idle' | 'compact' | 'medium' | 'large'
export type IslandDimensions = { width: number; height: number; radius: number }
export type IslandSize = IslandSizePreset | Partial<IslandDimensions>

export const ISLAND_SIZES: Record<IslandSizePreset, IslandDimensions> = {
  idle: { width: 126, height: 37, radius: 20 },
  compact: { width: 252, height: 37, radius: 20 },
  medium: { width: 372, height: 84, radius: 42 },
  large: { width: 372, height: 196, radius: 48 },
}

export type IslandActivity = {
  /** Unique id. Showing an activity with an existing id replaces it. */
  id: string
  /** Size while collapsed. Defaults to `compact` for leading/trailing, `medium` for content. */
  size?: IslandSize
  /** Left slot of a compact island. */
  leading?: ReactNode
  /** Right slot of a compact island. */
  trailing?: ReactNode
  /** Free-form content. Takes precedence over leading/trailing. */
  content?: ReactNode
  /** Content shown when the island is tapped. Makes the island expandable. */
  expanded?: ReactNode
  /** Size while expanded. Defaults to `large`. */
  expandedSize?: IslandSize
  /** Auto-dismiss after this many milliseconds. */
  duration?: number
  onClick?: () => void
  onDismiss?: () => void
}

export type DynamicIslandApi = {
  /** All live activities; the last one is displayed. */
  activities: IslandActivity[]
  current: IslandActivity | null
  expandedId: string | null
  show: (activity: IslandActivity) => string
  update: (id: string, patch: Partial<Omit<IslandActivity, 'id'>>) => void
  dismiss: (id?: string) => void
  clear: () => void
  expand: (id?: string) => void
  collapse: () => void
}

export const DynamicIslandContext = createContext<DynamicIslandApi | null>(null)

export function useDynamicIsland(): DynamicIslandApi {
  const ctx = useContext(DynamicIslandContext)
  if (!ctx) throw new Error('useDynamicIsland must be used inside <DynamicIslandProvider>')
  return ctx
}

export function resolveSize(size: IslandSize): IslandDimensions {
  return typeof size === 'string' ? ISLAND_SIZES[size] : { ...ISLAND_SIZES.compact, ...size }
}

export function getActivitySize(activity: IslandActivity | null, expanded = false): IslandDimensions {
  if (!activity) return ISLAND_SIZES.idle
  if (expanded && activity.expanded) return resolveSize(activity.expandedSize ?? 'large')
  return resolveSize(activity.size ?? (activity.content ? 'medium' : 'compact'))
}
