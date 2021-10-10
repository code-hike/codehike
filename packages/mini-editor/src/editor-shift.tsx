import {
  CodeTween,
  CodeConfig,
  CodeStep,
} from "@code-hike/smooth-code"
import React from "react"

export type CodeFile = CodeStep & {
  name: string
}

type EditorPanel = {
  tabs: string[]
  active: string
  heightRatio: number
}

export type EditorStep = {
  files: CodeFile[]
  northPanel: EditorPanel
  southPanel?: EditorPanel
  terminal?: string
}

type Tab = {
  title: string
  active: boolean
  style: React.CSSProperties
}

type OutputPanel = {
  tabs: Tab[]
  style: React.CSSProperties
  children: React.ReactNode
}

type Transition = {
  northPanel: OutputPanel
  southPanel?: OutputPanel | null
}

type TabsSnapshot = Record<
  string,
  { left: number; active: boolean; width: number }
>
type Snapshot = {
  titleBarHeight: number
  northKey: any
  northHeight: number
  northTabs: TabsSnapshot
  southKey: any
  southHeight: number | null
  southTabs: TabsSnapshot | null
}

export function useTransition(
  ref: React.RefObject<HTMLDivElement>,
  prev: EditorStep,
  next: EditorStep,
  t: number,
  backward: boolean,
  codeConfig: CodeConfig
): Transition {
  const { prevSnapshot, nextSnapshot } = useSnapshots(
    ref,
    prev,
    next
  )

  if (!prevSnapshot) {
    return startingPosition(prev, next, codeConfig)
  }

  if (!nextSnapshot) {
    return endingPosition(prev, next, codeConfig)
  }

  // if (t === 0) {
  //   return startingPosition(prev, next, codeConfig)
  // }

  if (t === 1) {
    return endingPosition(prev, next, codeConfig)
  }
  const inputSouthPanel = prev.southPanel || next.southPanel

  const {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, t == 0 || backward)

  const { northStyle, southStyle } = getPanelStyles(
    prevSnapshot,
    nextSnapshot,
    t
  )
  const { northTabs, southTabs } = getTabs(
    prevSnapshot,
    nextSnapshot,
    prevNorthFile.name,
    prevSouthFile?.name,
    t
  )

  return {
    northPanel: {
      tabs: northTabs,
      style: northStyle,
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={t}
          parentHeight={northStyle.height as string}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: southTabs!,
      style: southStyle!,
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={t}
          parentHeight={southStyle?.height as string}
        />
      ),
    },
  }
}

// Returns the t=0 state of the transition
function startingPosition(
  prev: EditorStep,
  next: EditorStep,
  codeConfig: CodeConfig
): Transition {
  const inputNorthPanel = prev.northPanel
  const inputSouthPanel = prev.southPanel

  const {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, true)

  const northHeight = inputSouthPanel
    ? `calc((100% - var(--ch-title-bar-height)) * ${inputNorthPanel.heightRatio})`
    : "100%"

  const southHeight = `calc((100% - var(--ch-title-bar-height)) * ${inputSouthPanel?.heightRatio} + var(--ch-title-bar-height))`

  return {
    northPanel: {
      tabs: inputNorthPanel.tabs.map(title => ({
        title,
        active: title === inputNorthPanel.active,
        style: {},
      })),
      style: {
        height: northHeight,
      },
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={0}
          parentHeight={northHeight}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: inputSouthPanel.tabs.map(title => ({
        title,
        active: title === inputSouthPanel.active,
        style: {},
      })),
      style: {
        height: `calc((100% - var(--ch-title-bar-height)) * ${inputSouthPanel.heightRatio} + var(--ch-title-bar-height))`,
      },
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={0}
          parentHeight={southHeight}
        />
      ),
    },
  }
}
// Returns the t=1 state of the transition
function endingPosition(
  prev: EditorStep,
  next: EditorStep,
  codeConfig: CodeConfig
): Transition {
  const inputNorthPanel = next.northPanel
  const inputSouthPanel = next.southPanel

  let {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, false)

  // getStepFiles return the intermediate files, we need to patch the ending state (2to1south)
  const isTwoToOneSouth =
    !inputSouthPanel &&
    inputNorthPanel.active === prev?.southPanel?.active
  if (isTwoToOneSouth) {
    nextNorthFile = nextSouthFile!
  }

  const northHeight = inputSouthPanel
    ? `calc((100% - var(--ch-title-bar-height)) * ${inputNorthPanel.heightRatio})`
    : "100%"

  const southHeight = `calc((100% - var(--ch-title-bar-height)) * ${inputSouthPanel?.heightRatio} + var(--ch-title-bar-height))`

  return {
    northPanel: {
      tabs: inputNorthPanel.tabs.map(title => ({
        title,
        active: title === inputNorthPanel.active,
        style: {},
      })),
      style: {
        height: northHeight,
      },
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={1}
          parentHeight={northHeight}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: inputSouthPanel.tabs.map(title => ({
        title,
        active: title === inputSouthPanel.active,
        style: {},
      })),
      style: {
        height: southHeight,
      },
      children: (
        <CodeTransition
          codeConfig={codeConfig}
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={1}
          parentHeight={southHeight}
        />
      ),
    },
  }
}

function CodeTransition({
  prevFile,
  nextFile,
  t,
  codeConfig,
  parentHeight,
}: {
  prevFile: CodeFile
  nextFile: CodeFile
  t: number
  parentHeight: string
  codeConfig: CodeConfig
}) {
  return (
    <CodeTween
      progress={t}
      tween={{ prev: prevFile, next: nextFile }}
      config={{
        ...codeConfig,
        parentHeight,
        htmlProps: {
          ...codeConfig?.htmlProps,
          style: {
            height: "unset",
            ...codeConfig?.htmlProps?.style,
          },
        },
      }}
    />
  )
}

/**
 * Get the StepFiles for a transition
 * in each panel, if the prev and next active files are the same
 * we return the prev and next version of that panel
 * if the active files are different, we return the same file twice,
 * if backward is true we return the prev active file twice,
 * or else the next active file twice
 */
function getStepFiles(
  prev: EditorStep,
  next: EditorStep,
  backward: boolean
) {
  // The active file in each panel before and after:
  // +----+----+
  // | pn | nn |
  // +----+----+
  // | ps | ns |
  // +----+----+
  //
  const pn = prev.northPanel.active
  const nn = next.northPanel.active
  const ps = prev.southPanel?.active
  const ns = next.southPanel?.active

  const pnFile = prev.files.find(f => f.name === pn)!
  const nnFile = next.files.find(f => f.name === nn)!
  const psFile = ps
    ? prev.files.find(f => f.name === ps)
    : null
  const nsFile = ns
    ? next.files.find(f => f.name === ns)
    : null

  const oneToTwoSouth = !ps && pn === ns
  if (oneToTwoSouth) {
    return {
      prevNorthFile: nnFile,
      nextNorthFile: nnFile,
      prevSouthFile: pnFile,
      nextSouthFile: nsFile,
    }
  }

  const twoToOneSouth = !ns && nn === ps
  if (twoToOneSouth) {
    return {
      prevNorthFile: pnFile,
      nextNorthFile: pnFile,
      prevSouthFile: psFile,
      nextSouthFile: nnFile,
    }
  }

  const prevNorthFile =
    pn === nn ? pnFile : backward ? pnFile : nnFile

  const nextNorthFile =
    pn === nn ? nnFile : backward ? pnFile : nnFile

  const prevSouthFile =
    ps === ns
      ? psFile
      : backward
      ? psFile || nsFile
      : nsFile || psFile

  const nextSouthFile =
    ps === ns
      ? nsFile
      : backward
      ? psFile || nsFile
      : nsFile || psFile

  return {
    prevNorthFile,
    nextNorthFile,
    prevSouthFile,
    nextSouthFile,
  }
}

function getPanelStyles(
  prev: Snapshot,
  next: Snapshot,
  t: number
): {
  northStyle: React.CSSProperties
  southStyle?: React.CSSProperties
} {
  // +---+---+
  // | x | x |
  // +---+---+
  // |   |   |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight === null
  ) {
    return {
      northStyle: {
        height: prev.northHeight,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // | y |   |
  // +---+---+
  if (
    prev.southHeight !== null &&
    next.southHeight === null &&
    next.northKey !== prev.southKey
  ) {
    return {
      northStyle: {
        height: tween(
          prev.northHeight,
          next.northHeight,
          t
        ),
      },
      southStyle: {
        height: prev.southHeight,
      },
    }
  }

  // +---+---+
  // | x | y |
  // +---+---+
  // | y |   |
  // +---+---+
  if (
    prev.southHeight !== null &&
    next.southHeight === null &&
    prev.southKey === next.northKey
  ) {
    return {
      northStyle: {
        height: prev.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.southHeight,
          next.northHeight + next.titleBarHeight,
          t
        ),
        transform: `translateY(${tween(
          0,
          -(prev.northHeight + prev.titleBarHeight),
          t
        )}px)`,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // |   | y |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight !== null &&
    prev.northKey !== next.southKey
  ) {
    return {
      northStyle: {
        height: tween(
          prev.northHeight,
          next.northHeight,
          t
        ),
      },
      southStyle: {
        position: "relative",
        height: next.southHeight!,
      },
    }
  }

  // +---+---+
  // | y | x |
  // +---+---+
  // |   | y |
  // +---+---+
  if (
    prev.southHeight === null &&
    next.southHeight !== null &&
    prev.northKey === next.southKey
  ) {
    return {
      northStyle: {
        height: next.northHeight,
      },
      southStyle: {
        position: "relative",
        height: tween(
          prev.northHeight + prev.titleBarHeight,
          next.southHeight!,
          t
        ),
        transform: `translateY(${tween(
          -(next.northHeight + next.titleBarHeight),
          0,
          t
        )}px)`,
      },
    }
  }

  // +---+---+
  // | x | x |
  // +---+---+
  // | y | y |
  // +---+---+
  return {
    northStyle: {
      height: tween(prev.northHeight, next.northHeight, t),
    },
    southStyle: {
      height: tween(
        prev.southHeight!,
        next.southHeight!,
        t
      ),
    },
  }
}

function tween(a: number, b: number, t: number) {
  return a + (b - a) * t
}

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

// snapshots

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

function useSnapshots(
  ref: React.RefObject<HTMLDivElement>,
  prev: EditorStep,
  next: EditorStep
) {
  const [
    { prevSnapshot, nextSnapshot },
    setState,
  ] = React.useState<{
    prevSnapshot: Snapshot | null
    nextSnapshot: Snapshot | null
  }>({
    prevSnapshot: null,
    nextSnapshot: null,
  })

  useLayoutEffect(() => {
    if (prevSnapshot || nextSnapshot) {
      setState({
        prevSnapshot: null,
        nextSnapshot: null,
      })
    }
  }, [prev, next])

  useLayoutEffect(() => {
    if (!prevSnapshot) {
      setState(s => ({
        ...s,
        prevSnapshot: {
          ...getPanelSnapshot(ref.current!, prev),
          ...getTabsSnapshot(ref.current!, prev),
        },
      }))
    } else if (!nextSnapshot) {
      setState(s => ({
        ...s,
        nextSnapshot: {
          ...getPanelSnapshot(ref.current!, next),
          ...getTabsSnapshot(ref.current!, next),
        },
      }))
    }
  })

  return { prevSnapshot, nextSnapshot }
}

function getPanelSnapshot(
  parent: HTMLDivElement,
  step: EditorStep
) {
  const northElement = parent.querySelector(
    "[data-ch-panel='north']"
  )
  const southElement = parent.querySelector(
    "[data-ch-panel='south']"
  )
  const bar = parent.querySelector(".ch-frame-title-bar")
  return {
    titleBarHeight: bar!.getBoundingClientRect().height,
    northHeight: northElement!.getBoundingClientRect()
      .height,
    northKey: step.northPanel.active,
    southHeight:
      southElement?.getBoundingClientRect().height || null,
    southKey: step.southPanel?.active,
  }
}

function getTabsSnapshot(
  parent: HTMLDivElement,
  step: EditorStep
) {
  const northTabs = Array.from(
    parent.querySelectorAll("[data-ch-tab='north']")
  )

  const southTabs = Array.from(
    parent.querySelectorAll("[data-ch-tab='south']")
  )

  return {
    northTabs: getTabsDimensions(
      northTabs,
      step.northPanel.active
    )!,
    southTabs: getTabsDimensions(
      southTabs,
      step.southPanel?.active
    ),
  }
}

function getTabsDimensions(
  tabElements: Element[],
  active: string | undefined
) {
  if (!tabElements[0]) {
    return null
  }

  const parent = tabElements[0]!.parentElement!
  const parentLeft = parent.getBoundingClientRect().left

  const dimensions = {} as TabsSnapshot
  tabElements.forEach(child => {
    const filename = child.getAttribute("title")!
    const rect = child.getBoundingClientRect()
    dimensions[filename] = {
      left: rect.left - parentLeft,
      width: rect.width,
      active: filename === active,
    }
  })

  return dimensions
}
