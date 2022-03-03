import { Snapshot, TabsSnapshot, Tab } from "./editor-frame"

export { getTabs }

function getTabs(
  prevSnapshot: Snapshot,
  nextSnapshot: Snapshot,
  northActive: string,
  southActive: string | undefined,
  t: number
) {
  // TODO simplify
  if (
    !prevSnapshot.southTabs &&
    isPresent(southActive, prevSnapshot.northTabs)
  ) {
    /// one to two south
    return {
      northTabs: getPanelTabs(
        nextSnapshot.northTabs,
        nextSnapshot.southTabs,
        prevSnapshot.southTabs,
        prevSnapshot.northTabs,
        northActive,
        t
      )!,
      southTabs: getPanelTabs(
        nextSnapshot.southTabs,
        nextSnapshot.northTabs,
        prevSnapshot.northTabs,
        prevSnapshot.southTabs,
        southActive,
        t
      ),
    }
  }
  if (
    !nextSnapshot.southTabs &&
    isPresent(southActive, nextSnapshot.northTabs)
  ) {
    /// two to one south
    return {
      northTabs: getPanelTabs(
        nextSnapshot.southTabs,
        nextSnapshot.northTabs,
        prevSnapshot.northTabs,
        prevSnapshot.southTabs,
        northActive,
        t
      )!,
      southTabs: getPanelTabs(
        nextSnapshot.northTabs,
        nextSnapshot.southTabs,
        prevSnapshot.southTabs,
        prevSnapshot.northTabs,
        southActive,
        t
      ),
    }
  }

  return {
    northTabs: getPanelTabs(
      nextSnapshot.northTabs,
      nextSnapshot.southTabs,
      prevSnapshot.northTabs,
      prevSnapshot.southTabs,
      northActive,
      t
    )!,
    southTabs: getPanelTabs(
      nextSnapshot.southTabs,
      nextSnapshot.northTabs,
      prevSnapshot.southTabs,
      prevSnapshot.northTabs,
      southActive,
      t
    ),
  }
}

function getPanelTabs(
  nextSnapshot: TabsSnapshot | null,
  otherNextSnapshot: TabsSnapshot | null,
  prevSnapshot: TabsSnapshot | null,
  otherPrevSnapshot: TabsSnapshot | null,
  active: string | undefined,
  t: number
): Tab[] {
  // For each tab bar there are four types of tabs
  // - oldTabs: tabs that are present in both prev and next versions of the bar
  // - totallyNewTabs: tabs that are totally new (present in next
  // but not in any prev)
  // - migratingTabs: tabs that are come from the other bar (present
  // in next and in otherPrev)
  // - disappearingTabs: present in prev but not in next or otherNext
  const oldTabs = !nextSnapshot
    ? []
    : Object.keys(nextSnapshot)
        .filter(
          filename =>
            isPresent(filename, prevSnapshot) ||
            !prevSnapshot
        )
        .map(filename => {
          const prev =
            prevSnapshot && prevSnapshot[filename]
          const next = nextSnapshot![filename]
          const dx = prev
            ? prev.left + (next.left - prev.left) * t
            : next.left
          const width = prev
            ? prev.width + (next.width - prev.width) * t
            : next.width
          return {
            active: filename === active,
            title: filename,
            style: {
              position: "absolute" as const,
              transform: `translateX(${dx}px)`,
              width,
            },
          }
        })

  const totallyNewTabs = !nextSnapshot
    ? []
    : Object.keys(nextSnapshot)
        .filter(
          filename =>
            prevSnapshot &&
            !isPresent(filename, prevSnapshot)
          // && !isPresent(filename, otherPrevSnapshot)
        )
        .map(filename => {
          const next = nextSnapshot[filename]

          return {
            active: filename === active,
            title: filename,
            style: {
              position: "absolute" as const,
              transform: `translateX(${next.left}px)`,
              opacity: t,
              width: next.width,
            },
          }
        })

  const migratingTabs = !nextSnapshot
    ? []
    : Object.keys(nextSnapshot)
        .filter(filename =>
          isPresent(filename, otherPrevSnapshot)
        )
        .map(filename => {
          const prev = otherPrevSnapshot![filename]
          const next = nextSnapshot![filename]
          const dx = next.left - prev.left
          return {
            active: filename === active,
            title: filename,
            style: {
              position: "absolute" as const,
              transform: `translateX(${dx}px)`,
            },
          }
        })

  const disappearingTabs = !prevSnapshot
    ? []
    : Object.keys(prevSnapshot)
        .filter(
          filename => !isPresent(filename, nextSnapshot)
          // && !isPresent(filename, otherNextSnapshot)
        )
        .map(filename => {
          const prev = prevSnapshot[filename]
          return {
            active: filename === active,
            title: filename,
            style: {
              position: "absolute" as const,
              opacity: 1 - t,
              transform: `translateX(${prev.left}px)`,
              width: prev.width,
            },
          }
        })

  return [
    ...totallyNewTabs,
    // ...migratingTabs,
    ...oldTabs,
    ...disappearingTabs,
  ]
}

function isPresent(
  filename: string | undefined,
  snapshot: TabsSnapshot | null
) {
  return snapshot && filename && filename in snapshot
}
