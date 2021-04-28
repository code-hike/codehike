import React from "react"
import { useClasser } from "@code-hike/classer"

export { TabsContainer }

type TabsContainerProps = {
  prevFiles: string[]
  nextFiles: string[]
  prevActive: string
  nextActive: string
  append?: React.ReactNode
  prepend?: React.ReactNode
  progress: number
  backward?: boolean
}

function TabsContainer({
  prevFiles,
  prevActive,
  nextFiles,
  nextActive,
  progress,
  backward,
  append,
  prepend = <div style={{ width: "30px" }} />,
}: TabsContainerProps) {
  const c = useClasser("ch-editor-tab")
  const ref = React.useRef<HTMLDivElement>(null!)
  const tabs = useTabs(ref, prevFiles, nextFiles, progress)
  const active =
    (backward && progress === 1) ||
    (!backward && progress > 0)
      ? nextActive
      : prevActive

  return (
    <>
      {prepend}
      <div
        style={{
          display: "flex",
          position: "relative",
          flex: 1,
          minWidth: 0,
        }}
        ref={ref}
      >
        {tabs.map(
          ({
            filename,
            tweenX,
            tweenOpacity,
            position,
          }) => (
            <div
              key={filename}
              title={filename}
              className={c(
                "",
                filename === active ? "active" : "inactive"
              )}
              style={{
                transform: `translateX(${tweenX(
                  progress
                )}px)`,
                opacity: tweenOpacity(progress),
                position,
              }}
            >
              <div>{filename}</div>
            </div>
          )
        )}
      </div>
      {append}
    </>
  )
}

type Tab = {
  filename: string
  position: "static" | "absolute"
  tweenX: (t: number) => number
  tweenOpacity: (t: number) => number
}
type Snapshot = Record<string, { left: number }>
type DimensionsState = {
  prevSnapshot: Snapshot | null
  nextSnapshot: Snapshot | null
  tabs: Tab[]
}

function useTabs(
  ref: React.MutableRefObject<HTMLDivElement>,
  prevFiles: string[],
  nextFiles: string[],
  progress: number
): Tab[] {
  const [
    { prevSnapshot, nextSnapshot, tabs },
    setState,
  ] = React.useState<DimensionsState>({
    prevSnapshot: null,
    nextSnapshot: null,
    tabs: [],
  })

  React.useLayoutEffect(() => {
    if (!prevSnapshot) {
      setState(s => ({
        ...s,
        prevSnapshot: getSnapshot(ref),
      }))
    } else if (!nextSnapshot) {
      const nextSnapshot = getSnapshot(ref)
      const tabs = merge(prevSnapshot, nextSnapshot)

      setState(s => ({
        ...s,
        nextSnapshot,
        tabs,
      }))
    }
  })

  if (!prevSnapshot) {
    return prevFiles.map(filename => ({
      filename,
      position: "static",
      tweenX: () => 0,
      tweenOpacity: () => 1,
    }))
  }

  if (!nextSnapshot || progress === 1) {
    return nextFiles.map(filename => ({
      filename,
      position: "static",
      tweenX: () => 0,
      tweenOpacity: () => 1,
    }))
  }

  return tabs
}

function getSnapshot(
  ref: React.MutableRefObject<HTMLDivElement>
) {
  const parentLeft = ref.current.getBoundingClientRect()
    .left
  const children = Array.from(ref.current.children)
  const dimensions = {} as Snapshot
  children.forEach(child => {
    const filename = child.getAttribute("title")!
    dimensions[filename] = {
      left: child.getBoundingClientRect().left - parentLeft,
    }
  })
  return dimensions
}

function merge(
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot
): Tab[] {
  const newFilenames = Object.keys(nextSnapshot).filter(
    filename => !(filename in prevSnapshot)
  )

  const newTabs = newFilenames.map(filename => {
    return {
      filename,
      position: "absolute",
      tweenX: () => nextSnapshot[filename].left,
      tweenOpacity: (t: number) => t,
    } as Tab
  })

  const oldTabs = Object.keys(prevSnapshot).map(
    filename => {
      const prev = prevSnapshot[filename]
      const next = nextSnapshot[filename]

      if (!next) {
        return {
          filename,
          position: "static",
          tweenX: () => 0,
          tweenOpacity: (t: number) => 1 - t,
        } as Tab
      }

      if (next.left === prev.left) {
        return {
          filename,
          position: "static",
          tweenX: () => 0,
          tweenOpacity: () => 1,
        } as Tab
      }

      return {
        filename,
        position: "static",
        tweenX: (t: number) => t * (next.left - prev.left),
        tweenOpacity: () => 1,
      } as Tab
    }
  )
  return [...newTabs, ...oldTabs]
}
