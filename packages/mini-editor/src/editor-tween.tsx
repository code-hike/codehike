import React from "react"
import {
  EditorFrame,
  EditorFrameProps,
} from "./editor-frame"
import { TerminalPanel } from "./terminal-panel"
import { useTransition, EditorStep } from "./editor-shift"
import { CodeConfig } from "@code-hike/smooth-code"

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
  next = DEFAULT_STEP,
  t,
  backward,
  codeConfig,
  frameProps = {},
}: EditorTweenProps) {
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
      {...frameProps}
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
