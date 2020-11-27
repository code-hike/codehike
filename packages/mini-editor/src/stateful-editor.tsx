import React from "react"
import { useSpring } from "use-spring"
import { MiniEditor, MiniEditorProps } from "./mini-editor"

export { MiniEditorWithState }

type StatefulEditorProps = Omit<
  MiniEditorProps,
  "progress" | "steps" | "backward"
>

function MiniEditorWithState({
  focus,
  ...rest
}: StatefulEditorProps) {
  const [steps, progress] = usePrevFocus(focus)

  return (
    <MiniEditor
      progress={progress}
      steps={steps}
      {...rest}
    />
  )
}

function usePrevFocus(focus: string | undefined) {
  const [state, setState] = React.useState({
    target: 0,
    steps: [{ focus }],
  })

  React.useEffect(() => {
    const lastFocus =
      state.steps[state.steps.length - 1].focus
    if (lastFocus !== focus) {
      setState(s => ({
        target: s.target + 1,
        steps: [...s.steps, { focus }],
      }))
    }
  }, [focus])

  const [progress] = useSpring(state.target, {
    stiffness: 100,
  })

  return [state.steps, progress] as const
}
