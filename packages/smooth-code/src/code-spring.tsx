import React from "react"
import { useSpring } from "use-spring"
import { FullTween } from "@code-hike/utils"
import {
  CodeTween,
  CodeConfig,
  CodeStep,
} from "./code-tween"

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
  config: CodeConfig & { spring?: SpringConfig }
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
  const [{ target, tween }, setState] = React.useState({
    target: 0,
    tween: { prev: step, next: step },
  })

  React.useEffect(() => {
    if (tween.next != step) {
      setState(s => ({
        target: s.target + 1,
        tween: { prev: tween.next, next: step },
      }))
    }
  }, [step])

  const [progress] = useSpring(target, springConfig)

  const t = progress % 1

  return { tween, t: t || 1 }
}
