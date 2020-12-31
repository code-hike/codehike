import React from "react"
import { useSpring } from "use-spring"
import { MiniEditor, MiniEditorProps } from "./mini-editor"

export { MiniEditorWithState }

export type StatefulEditorProps = Omit<
  MiniEditorProps,
  "progress" | "steps" | "backward"
>

function MiniEditorWithState({
  focus,
  code,
  ...rest
}: StatefulEditorProps) {
  const [steps, progress] = usePrevFocus(code, focus)

  return (
    <MiniEditor
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
    stiffness: 100,
    decimals: 3,
  })

  return [state.steps, progress] as const
}
