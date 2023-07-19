import React from "react"
import { useSpring } from "use-spring"
import { EditorTween } from "./editor-tween"
import { EditorFrameProps } from "./editor-frame"
import { EditorStep, CodeFile } from "./editor-shift"
import { CodeSettings } from "../core/types"

export { EditorSpring }
export type { EditorProps, EditorStep, CodeFile }

type SpringConfig = Parameters<typeof useSpring>[1]

type DivProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["div"]
>

const defaultSpring = {
  stiffness: 120,
  damping: 24,
  mass: 0.2,
  decimals: 3,
}
type EditorProps = EditorStep & {
  frameProps?: Partial<EditorFrameProps>
  codeConfig: CodeSettings
  springConfig?: SpringConfig
} & DivProps

function EditorSpring({
  northPanel,
  southPanel,
  files,
  terminal,
  springConfig,
  ...props
}: EditorProps) {
  const step = React.useMemo(() => {
    return {
      northPanel,
      southPanel,
      files,
      terminal,
    }
  }, [northPanel, southPanel, files, terminal])

  const { prev, next, t } = useStepSpring(
    step,
    springConfig
  )
  return (
    <EditorTween
      t={t}
      backward={false}
      prev={prev}
      next={next}
      {...props}
    />
  )
}

function useStepSpring(
  step: EditorStep,
  springConfig: SpringConfig = defaultSpring
): { prev: EditorStep; next: EditorStep; t: number } {
  const [{ target, steps, index }, setState] =
    React.useState<StepSpringState>({
      target: 2,
      steps: [step, step, step],
      index: 0,
    })

  React.useEffect(() => {
    const lastStep = steps[steps.length - 1]
    if (lastStep != step) {
      setState(s => updateStepSpring(s, step, progress))
    }
  }, [step])

  const [progress] = useSpring(target, springConfig)

  const trioProgress = progress - index

  const result =
    trioProgress <= 1
      ? {
          prev: steps[0],
          next: steps[1],
          t: trioProgress,
        }
      : {
          prev: steps[1],
          next: steps[2],
          t: trioProgress - 1,
        }

  return result
}

type StepSpringState = {
  target: number
  steps: [EditorStep, EditorStep, EditorStep]
  index: number
}

function updateStepSpring(
  state: StepSpringState,
  newStep: EditorStep,
  progress: number
): StepSpringState {
  const { steps, target, index } = state
  const stepsClone =
    steps.slice() as StepSpringState["steps"]

  const trioProgress = progress - index

  if (trioProgress < 1) {
    stepsClone[2] = newStep
    return {
      ...state,
      steps: stepsClone,
    }
  } else {
    stepsClone[0] = steps[1]
    stepsClone[1] = steps[2]
    stepsClone[2] = newStep
    return {
      ...state,
      steps: stepsClone,
      target: target + 1,
      index: index + 1,
    }
  }
}
