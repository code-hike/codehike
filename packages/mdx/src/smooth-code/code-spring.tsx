import React from "react"
import { useSpring } from "use-spring"
import { FullTween } from "../utils"
import { CodeTween, CodeStep } from "./code-tween"
import { CodeSettings } from "../core/types"

type SpringConfig = Parameters<typeof useSpring>[1]

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const defaultSpring = {
  stiffness: 120,
  damping: 24,
  mass: 0.2,
  decimals: 3,
}

export function CodeSpring({
  step,
  config,
  ...htmlProps
}: {
  step: CodeStep
  config: CodeSettings & { spring?: SpringConfig }
} & HTMLProps) {
  const { tween, t } = useStepSpring(step, config.spring)
  return (
    <CodeTween
      tween={tween}
      progress={t}
      config={config}
      {...htmlProps}
    />
  )
}

function useStepSpring(
  step: CodeStep,
  springConfig: SpringConfig = defaultSpring
): { tween: FullTween<CodeStep>; t: number } {
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
          tween: { prev: steps[0], next: steps[1] },
          t: trioProgress,
        }
      : {
          tween: { prev: steps[1], next: steps[2] },
          t: trioProgress - 1,
        }

  return result
}

type StepSpringState = {
  target: number
  steps: [CodeStep, CodeStep, CodeStep]
  index: number
}

function updateStepSpring(
  state: StepSpringState,
  newStep: CodeStep,
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
