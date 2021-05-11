import React from "react"
import { useSpring } from "use-spring"
import {
  EditorTransition,
  EditorTransitionProps,
} from "./editor-transition"
import { EditorStep } from "./use-snapshots"
import { CodeProps } from "./code"

type FullMiniEditorProps = EditorStep

export { FullMiniEditor, FullMiniEditorHike }

function FullMiniEditor(step: FullMiniEditorProps) {
  // const { prev, next, t } = useStepSpring(step)
  // return (
  //   <EditorTransition
  //     t={t}
  //     backward={false}
  //     prev={prev}
  //     next={next}
  //   />
  // )
  return null
}

function FullMiniEditorHike({
  steps,
  progress,
  backward,
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

function useStepSpring(step: EditorStep) {
  const [{ target, prev, next }, setState] = React.useState(
    {
      target: 0,
      prev: step,
      next: step,
    }
  )

  React.useEffect(() => {
    if (next != step) {
      setState(s => ({
        target: s.target + 1,
        prev: next,
        next: step,
      }))
    }
  }, [step])

  const [progress] = useSpring(target, {
    stiffness: 256,
    damping: 24,
    mass: 0.2,
    decimals: 3,
  })

  const t = progress % 1

  return { prev, next, t: t || 1 }
}
