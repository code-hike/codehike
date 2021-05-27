import React from "react"
import { MiniEditorTween } from "./mini-editor-tween"
import { EditorStep } from "./use-snapshots"
import { CodeProps } from "./code"
import { EditorFrameProps } from "./editor-frame"

export { MiniEditorHike, MiniEditorHikeProps }

type MiniEditorHikeProps = {
  steps: EditorStep[]
  progress: number
  backward: boolean
  frameProps: Partial<EditorFrameProps>
  codeProps: Partial<CodeProps>
}

function MiniEditorHike({
  steps = [],
  progress = 0,
  backward = false,
  frameProps,
  codeProps,
}: MiniEditorHikeProps) {
  const prevIndex = clamp(
    Math.floor(progress),
    0,
    steps.length - 1
  )
  const nextIndex = clamp(
    prevIndex + 1,
    0,
    steps.length - 1
  )

  const prev = steps[prevIndex]
  const next = steps[nextIndex]

  const t = clamp(progress - prevIndex, 0, steps.length - 1)

  return (
    <MiniEditorTween
      frameProps={frameProps}
      codeProps={codeProps}
      prev={prev}
      next={next}
      backward={backward}
      t={t}
    />
  )
}

function clamp(a: number, min: number, max: number) {
  return Math.max(Math.min(a, max), min)
}
