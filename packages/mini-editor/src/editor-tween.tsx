import React from "react"
import {
  EditorFrame,
  EditorFrameProps,
} from "./editor-frame"
import { TerminalPanel } from "./terminal-panel"
import { useTransition, EditorStep } from "./editor-shift"
import {
  CodeConfig,
  mapFocusToLineNumbers,
} from "@code-hike/smooth-code"

export {
  EditorTransition,
  EditorTransitionProps,
  EditorTween,
  EditorTweenProps,
}

type EditorTransitionProps = {
  prev?: EditorStep
  next?: EditorStep
  t: number
  backward: boolean
  codeConfig: CodeConfig
} & Omit<EditorFrameProps, "northPanel" | "southPanel">

type EditorTweenProps = {
  prev?: EditorStep
  next?: EditorStep
  t: number
  backward: boolean
  codeConfig: CodeConfig
  frameProps?: Partial<EditorFrameProps>
}

const DEFAULT_STEP: EditorStep = {
  files: [
    {
      code: { lines: [], lang: "js" },
      focus: "",
      name: "",
    },
  ],
  northPanel: { active: "", tabs: [""], heightRatio: 1 },
}

function EditorTween({
  prev = DEFAULT_STEP,
  next,
  t,
  backward,
  codeConfig,
  frameProps = {},
}: EditorTweenProps) {
  const ref = React.createRef<HTMLDivElement>()
  const { northPanel, southPanel } = useTransition(
    ref,
    prev,
    next || prev,
    t,
    backward,
    codeConfig
  )

  const defaultHeight = useDefaultHeight(prev)
  const framePropsWithHeight = {
    ...frameProps,
    style: { height: defaultHeight, ...frameProps?.style },
  }

  const terminalPanel = (
    <TerminalPanel
      prev={prev.terminal}
      next={(next || prev).terminal}
      t={t}
      backward={backward}
    />
  )
  return (
    <EditorFrame
      ref={ref}
      {...framePropsWithHeight}
      northPanel={northPanel}
      southPanel={southPanel}
      terminalPanel={terminalPanel}
      theme={codeConfig.theme}
    />
  )
}

function EditorTransition({
  prev = DEFAULT_STEP,
  next = DEFAULT_STEP,
  t,
  backward,
  codeConfig,
  ...rest
}: EditorTransitionProps) {
  const ref = React.createRef<HTMLDivElement>()
  const { northPanel, southPanel } = useTransition(
    ref,
    prev,
    next,
    t,
    backward,
    codeConfig
  )

  const terminalPanel = (
    <TerminalPanel
      prev={prev.terminal}
      next={next.terminal}
      t={t}
      backward={backward}
    />
  )
  return (
    <EditorFrame
      ref={ref}
      northPanel={northPanel}
      southPanel={southPanel}
      terminalPanel={terminalPanel}
      {...rest}
    />
  )
}

function useDefaultHeight({
  files,
  northPanel,
  southPanel,
}: EditorStep): string {
  return React.useMemo(() => {
    const northFile = files.find(
      ({ name }) => name === northPanel.active
    )
    const southFile = files.find(
      ({ name }) => name === southPanel?.active
    )
    let focusedLines = getFocusedLineCount(northFile!) + 3.9
    if (southFile) {
      focusedLines += getFocusedLineCount(southFile!) + 3.9
    }
    const emHeight = focusedLines * 1.03125
    return `${emHeight}em`
  }, [])
}

function getFocusedLineCount({
  code,
  focus,
}: EditorStep["files"][0]): number {
  const focusByLineNumber = mapFocusToLineNumbers(
    focus,
    code.lines
  )
  const focusedLineNumbers = Object.keys(
    focusByLineNumber
  ).map(k => Number(k))
  const min = Math.min(...focusedLineNumbers)
  const max = Math.max(...focusedLineNumbers)
  return max - min + 1
}
