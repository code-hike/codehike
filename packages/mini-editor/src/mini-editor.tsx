import React from "react"
import { useSpring } from "use-spring"
import {
  MiniEditorHike,
  MiniEditorHikeProps,
} from "./mini-editor-hike"

export { MiniEditor }

export type MiniEditorProps = Omit<
  MiniEditorHikeProps,
  "progress" | "steps" | "backward"
>

function MiniEditor({
  focus,
  code,
  ...rest
}: MiniEditorProps) {
  const [steps, progress] = usePrevFocus(code, focus)

  return (
    <MiniEditorHike
      progress={progress}
      steps={steps}
      {...rest}
    />
  )
}

function usePrevFocus(
  code: string | undefined,
  focus: string | undefined
) {
  const [state, setState] = React.useState({
    target: 0,
    steps: [{ focus, code }],
  })

  React.useEffect(() => {
    const last = state.steps[state.steps.length - 1]
    if (last.focus !== focus || last.code !== code) {
      setState(s => ({
        target: s.target + 1,
        steps: [...s.steps, { focus, code }],
      }))
    }
  }, [focus, code])

  const [progress] = useSpring(state.target, {
    stiffness: 256,
    damping: 24,
    mass: 0.2,
    decimals: 3,
  })

  return [state.steps, progress] as const
}
