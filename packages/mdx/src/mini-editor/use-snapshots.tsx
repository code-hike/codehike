import React from "react"
import { Snapshot, TabsSnapshot } from "./editor-frame"
import { CodeAnnotation } from "../smooth-code"

export { useSnapshots }
export type { EditorStep, StepFile }

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

type StepFile = {
  code: string
  focus?: string
  lang: string
  name: string
  annotations?: CodeAnnotation[]
}

type EditorPanel = {
  tabs: string[]
  active: string
  heightRatio: number
}

type EditorStep = {
  files: StepFile[]
  northPanel: EditorPanel
  southPanel?: EditorPanel
  terminal?: string
}

function useSnapshots(
  ref: React.RefObject<HTMLDivElement>,
  prev: EditorStep,
  next: EditorStep
) {
  const [{ prevSnapshot, nextSnapshot }, setState] =
    React.useState<{
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
    northHeight:
      northElement!.getBoundingClientRect().height,
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
