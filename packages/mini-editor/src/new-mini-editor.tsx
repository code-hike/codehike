import React from "react"
import {
  EditorTransition,
  EditorTransitionProps,
} from "./editor-transition"
import { EditorStep } from "./use-snapshots"
import { CodeProps } from "./code"

export { FullMiniEditorHike }

function FullMiniEditorHike({
  steps = [],
  progress = 0,
  backward = false,
  frameProps,
  codeProps,
}: {
  steps: EditorStep[]
  progress: number
  backward: boolean
  frameProps: Partial<EditorTransitionProps>
  codeProps: Partial<CodeProps>
}) {
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
    <EditorTransition
      {...frameProps}
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
