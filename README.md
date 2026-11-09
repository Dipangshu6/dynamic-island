# Dynamic Island for React

An iPhone-style Dynamic Island for React. It uses spring animations, lets you put anything inside it, and is controlled through a hook.

Built with **React 18+**, **Framer Motion** and **Tailwind CSS v4**.

## Install (copy-paste)

1. Copy `src/components/dynamic-island/` into your project.
2. Install the peer dependency:

   ```bash
   npm i framer-motion
   ```

3. Make sure Tailwind scans the folder. It already does if the folder is under `src/`.

## Quick start

```tsx
import { DynamicIsland, DynamicIslandProvider, useDynamicIsland } from '@/components/dynamic-island'

export default function App() {
  return (
    <DynamicIslandProvider>
      {/* Render the island wherever you want it */}
      <div className="fixed inset-x-0 top-3 z-50 flex justify-center">
        <DynamicIsland hideWhenIdle />
      </div>
      <SaveButton />
    </DynamicIslandProvider>
  )
}

function SaveButton() {
  const island = useDynamicIsland()
  return (
    <button
      onClick={() =>
        island.show({
          id: 'saved',
          leading: <span>✅</span>,
          trailing: <span className="pr-2 text-sm font-medium">Saved</span>,
          duration: 2000,
        })
      }
    >
      Save
    </button>
  )
}
```

## Activities

Everything shown in the island is an **activity**:

```ts
island.show({
  id: 'music',                 // showing the same id again replaces it
  leading: <AlbumArt />,       // compact layout: left slot
  trailing: <Equalizer />,     // compact layout: right slot
  content: <Custom />,         // or any content (takes precedence over the slots)
  expanded: <Player />,        // shown when tapped; makes the island expandable
  size: 'compact',             // 'idle' | 'compact' | 'medium' | 'large' | { width, height, radius }
  expandedSize: 'large',
  duration: 3000,              // auto-dismiss after this many ms
  onClick: () => {},
  onDismiss: () => {},
})
```

Activities form a **stack**. The most recent one is displayed, and when it's dismissed the island goes back to the one underneath. For example, a 2-second "Silent" alert shown over a playing song returns to the music when it ends.

| Size      | Width × Height |
| --------- | -------------- |
| `idle`    | 126 × 37       |
| `compact` | 252 × 37       |
| `medium`  | 372 × 84       |
| `large`   | 372 × 196      |

A partial object such as `size: { width: 196 }` fills in the rest from `compact`.

## `useDynamicIsland()`

| Method                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `show(activity)`       | Show or replace an activity and return its id      |
| `update(id, patch)`    | Change an activity in place, without re-animating  |
| `dismiss(id?)`         | Remove an activity (the top one if no id is given) |
| `clear()`              | Remove all activities                              |
| `expand(id?)`          | Expand an activity that has `expanded` content     |
| `collapse()`           | Collapse the island                                |
| `current`              | The activity currently displayed                   |
| `activities`           | The whole stack                                    |
| `expandedId`           | The id of the expanded activity, or `null`         |

Expanded islands collapse when you click outside them or press <kbd>Esc</kbd>. Buttons inside the island work without triggering the island's own click.

## `<DynamicIsland />` props

| Prop               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `hideWhenIdle`     | Shrink and fade out when there's nothing to show             |
| `activity`         | Controlled mode: render this activity, no provider needed    |
| `expanded`         | Controlled expanded state (use with `activity`)              |
| `onExpandedChange` | Called when the island wants to expand or collapse           |
| `transition`       | Override the Framer Motion spring                            |
| `className`, `style` | Passed to the island element                               |

## Building blocks

These are exported to help you build activities:

- `<RollingText text="4:59" />`: each digit rolls when it changes
- `<Equalizer color bars height playing />`: animated audio bars
- `<ProgressRing progress={0-100} color size>{children}</ProgressRing>`
- `useTicker(start, step)` and `formatTime(seconds)`: a per-second counter for timers and call durations

`src/demo/` contains complete examples: silent mode, timer, music player, incoming call and AirDrop.

## Demo

```bash
npm i
npm run dev
```

- `1`–`6` switch states, and <kbd>Space</kbd> toggles the auto demo.
- `?demo` starts the auto demo, and `?demo&clean` shows only the phone, which is useful for screen recording.
