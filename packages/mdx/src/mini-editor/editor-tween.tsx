import React from "react"
import {
  EditorFrame,
  EditorFrameProps,
} from "./editor-frame"
import { TerminalPanel } from "./terminal-panel"
import { useTransition, EditorStep } from "./editor-shift"
import { useLayoutEffect } from "../utils"
import { CopyButton } from "smooth-code/copy-button"
import { EditorExpandButton } from "mini-editor/expand-button"
import { CodeSettings } from "../core/types"

export { EditorTransition, EditorTween }
export type { EditorTransitionProps, EditorTweenProps }

type EditorTransitionProps = {
  prev?: EditorStep
  next?: EditorStep
  t: number
  backward: boolean
  codeConfig: CodeSettings
} & Omit<EditorFrameProps, "northPanel" | "southPanel">

type DivProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["div"]
>

type EditorTweenProps = {
  prev?: EditorStep
  next?: EditorStep
  t: number
  backward: boolean
  codeConfig: CodeSettings
  frameProps?: Partial<EditorFrameProps>
} & DivProps

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
  ...divProps
}: EditorTweenProps) {
  const ref = React.createRef<HTMLDivElement>()

  const { showCopyButton, showExpandButton, ...config } =
    codeConfig
  const {
    northPanel,
    southPanel,
    northContent,
    southContent,
  } = useTransition(
    ref,
    prev,
    next || prev,
    t,
    backward,
    config
  )

  const [frozenHeight, freezeHeight] = React.useState<
    number | undefined
  >(undefined)

  useLayoutEffect(() => {
    const height =
      ref.current?.getBoundingClientRect().height
    freezeHeight(height)
  }, [])

  const framePropsWithHeight = {
    ...frameProps,
    ...divProps,
    style: {
      ...frameProps?.style,
      ...divProps?.style,
    },
  }

  if (frozenHeight) {
    framePropsWithHeight.style.height = frozenHeight
    framePropsWithHeight.style.maxHeight = frozenHeight
  }

  const northButtons = (
    <>
      {showCopyButton ? (
        <CopyButton
          className="ch-editor-button"
          content={northContent}
        />
      ) : undefined}
      {showExpandButton ? (
        <EditorExpandButton
          className="ch-editor-button"
          step={next || prev}
        />
      ) : undefined}
    </>
  )

  const southCopyButton = showCopyButton ? (
    <CopyButton
      className="ch-editor-button"
      content={southContent}
    />
  ) : undefined

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
      northButton={northButtons}
      southButton={southCopyButton}
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
