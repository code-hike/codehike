import React from "react"
import {
  EditorFrame,
  EditorFrameProps,
  getPanelStyles,
  Snapshot,
} from "./editor-frame"
import { Code } from "../code"

export { EditorTransition }

type StepFile = {
  code: string
  focus?: string
  lang: string
  name: string
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

type EditorTransitionProps = {
  prev: EditorStep
  next: EditorStep
  t: number
  backward: boolean
} & Omit<EditorFrameProps, "northPanel" | "southPanel">

function EditorTransition({
  prev,
  next,
  t,
  backward,
  ...rest
}: EditorTransitionProps) {
  const ref = React.createRef<HTMLDivElement>()
  const { northPanel, southPanel } = useTransition(
    ref,
    prev,
    next,
    t,
    backward
  )
  return (
    <EditorFrame
      ref={ref}
      northPanel={northPanel}
      southPanel={southPanel}
      {...rest}
    />
  )
}

function useTransition(
  ref: React.RefObject<HTMLDivElement>,
  prev: EditorStep,
  next: EditorStep,
  t: number,
  backward: boolean
) {
  const { prevSnapshot, nextSnapshot } = useSnapshots(
    ref,
    prev,
    next
  )

  if (!prevSnapshot) {
    return startingPosition(prev, next)
  }

  if (!nextSnapshot) {
    return endingPosition(prev, next)
  }

  if (t === 0) {
    return startingPosition(prev, next)
  }

  if (t === 1) {
    return endingPosition(prev, next)
  }
  const inputNorthPanel = prev.northPanel || next.northPanel
  const inputSouthPanel = prev.southPanel || next.southPanel

  const {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, backward)

  const { northStyle, southStyle } = getPanelStyles(
    prevSnapshot,
    nextSnapshot,
    t
  )

  return {
    northPanel: {
      tabs: inputNorthPanel.tabs,
      active: prevNorthFile.name,
      style: northStyle,
      children: (
        <CodeTransition
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={t}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: inputSouthPanel.tabs,
      active: prevSouthFile!.name,
      style: southStyle!,
      children: (
        <CodeTransition
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={t}
        />
      ),
    },
  }
}

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

  React.useLayoutEffect(() => {
    if (prevSnapshot || nextSnapshot) {
      setState({
        prevSnapshot: null,
        nextSnapshot: null,
      })
    }
  }, [prev, next])

  React.useLayoutEffect(() => {
    if (!prevSnapshot) {
      const northElement = ref.current?.querySelector(
        "[data-ch-panel='north']"
      )
      const southElement = ref.current?.querySelector(
        "[data-ch-panel='south']"
      )
      setState(s => ({
        ...s,
        prevSnapshot: {
          northHeight: northElement!.getBoundingClientRect()
            .height,
          northKey: prev.northPanel.active,
          southHeight:
            southElement?.getBoundingClientRect().height ||
            null,
          southKey: prev.southPanel?.active,
        },
      }))
    } else if (!nextSnapshot) {
      const northElement = ref.current?.querySelector(
        "[data-ch-panel='north']"
      )
      const southElement = ref.current?.querySelector(
        "[data-ch-panel='south']"
      )
      setState(s => ({
        ...s,
        nextSnapshot: {
          northHeight: northElement!.getBoundingClientRect()
            .height,
          northKey: next.northPanel.active,
          southHeight:
            southElement?.getBoundingClientRect().height ||
            null,
          southKey: next.southPanel?.active,
        },
      }))
    }
  })

  return { prevSnapshot, nextSnapshot }
}

// Returns the t=0 state of the transition
function startingPosition(
  prev: EditorStep,
  next: EditorStep
) {
  const inputNorthPanel = prev.northPanel
  const inputSouthPanel = prev.southPanel

  const {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, true)

  return {
    northPanel: {
      tabs: inputNorthPanel.tabs,
      active: inputNorthPanel.active,
      style: {
        height: inputSouthPanel
          ? `calc((100% - var(--ch-title-bar-height)) * ${inputNorthPanel.heightRatio})`
          : "100%",
      },
      children: (
        <CodeTransition
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={0}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: inputSouthPanel.tabs,
      active: inputSouthPanel.active,
      style: {
        height: `calc((100% - var(--ch-title-bar-height)) * ${inputSouthPanel.heightRatio} + var(--ch-title-bar-height))`,
      },
      children: (
        <CodeTransition
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={0}
        />
      ),
    },
  }
}
// Returns the t=1 state of the transition
function endingPosition(
  prev: EditorStep,
  next: EditorStep
) {
  const inputNorthPanel = next.northPanel
  const inputSouthPanel = next.southPanel

  const {
    prevNorthFile,
    prevSouthFile,
    nextNorthFile,
    nextSouthFile,
  } = getStepFiles(prev, next, false)

  return {
    northPanel: {
      tabs: inputNorthPanel.tabs,
      active: inputNorthPanel.active,
      style: {
        height: inputSouthPanel
          ? `calc((100% - var(--ch-title-bar-height)) * ${inputNorthPanel.heightRatio})`
          : "100%",
      },
      children: (
        <CodeTransition
          prevFile={prevNorthFile}
          nextFile={nextNorthFile}
          t={1}
        />
      ),
    },
    southPanel: inputSouthPanel && {
      tabs: inputSouthPanel.tabs,
      active: inputSouthPanel.active,
      style: {
        height: `calc((100% - var(--ch-title-bar-height)) * ${inputSouthPanel.heightRatio} + var(--ch-title-bar-height))`,
      },
      children: (
        <CodeTransition
          prevFile={prevSouthFile!}
          nextFile={nextSouthFile!}
          t={1}
        />
      ),
    },
  }
}

function CodeTransition({
  prevFile,
  nextFile,
  t,
}: {
  prevFile: StepFile
  nextFile: StepFile
  t: number
}) {
  return (
    <Code
      prevCode={prevFile.code}
      nextCode={nextFile.code}
      progress={t}
      language={prevFile.lang}
      prevFocus={prevFile.focus || null}
      nextFocus={nextFile.focus || null}
      minColumns={20}
      minZoom={1}
      maxZoom={1}
      horizontalCenter={false}
      parentHeight={t}
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
    ? prev.files.find(f => f.name === ns)
    : null

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

function tween(a: number, b: number, t: number) {
  return a + (b - a) * t
}
