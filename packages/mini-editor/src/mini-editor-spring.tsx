import React from "react"
import { useSpring } from "use-spring"
import { MiniEditorTween } from "./mini-editor-tween"
import { EditorStep, StepFile } from "./use-snapshots"
import { CodeProps } from "./code"
import { EditorFrameProps } from "./editor-frame"

export { MiniEditor, MiniEditorProps }

type SingleFileEditorProps = {
  code: string
  lang: string
  focus?: string
  filename?: string
  terminal?: string
  frameProps: Partial<EditorFrameProps>
  codeProps: Partial<CodeProps>
}
type SinglePanelEditorProps = {
  files: StepFile[]
  active: string
  terminal?: string
  frameProps: Partial<EditorFrameProps>
  codeProps: Partial<CodeProps>
}
type TwoPanelEditorProps = EditorStep & {
  frameProps: Partial<EditorFrameProps>
  codeProps: Partial<CodeProps>
}
type MiniEditorProps =
  | SingleFileEditorProps
  | SinglePanelEditorProps
  | TwoPanelEditorProps

function MiniEditor(props: MiniEditorProps) {
  if ("northPanel" in props) {
    return <TwoPanelEditor {...props} />
  } else if ("active" in props) {
    return <SinglePanelEditor {...props} />
  } else {
    return <SingleFileEditor {...props} />
  }
}

function SingleFileEditor({
  code = "",
  lang = "js",
  focus,
  filename = "",
  terminal,
  frameProps,
  codeProps,
}: SingleFileEditorProps) {
  const step = React.useMemo(() => {
    const step: EditorStep = {
      files: [{ name: filename, code, lang, focus }],
      northPanel: {
        active: filename,
        tabs: [filename],
        heightRatio: 1,
      },
      terminal,
    }
    return step
  }, [code, lang, focus, filename, terminal])

  const { prev, next, t } = useStepSpring(step)
  return (
    <MiniEditorTween
      frameProps={frameProps}
      t={t}
      backward={false}
      prev={prev}
      next={next}
      codeProps={codeProps}
    />
  )
}
function SinglePanelEditor({
  files,
  active,
  terminal,
  frameProps,
  codeProps,
}: SinglePanelEditorProps) {
  const step = React.useMemo(() => {
    const tabs = files.map(file => file.name)
    const step: EditorStep = {
      files,
      northPanel: {
        active,
        tabs,
        heightRatio: 1,
      },
      terminal,
    }
    return step
  }, [files, active, terminal])

  const { prev, next, t } = useStepSpring(step)
  return (
    <MiniEditorTween
      frameProps={frameProps}
      t={t}
      backward={false}
      prev={prev}
      next={next}
      codeProps={codeProps}
    />
  )
}
function TwoPanelEditor({
  frameProps,
  codeProps,
  northPanel,
  southPanel,
  files,
  terminal,
}: TwoPanelEditorProps) {
  const step = React.useMemo(() => {
    return {
      northPanel,
      southPanel,
      files,
      terminal,
    }
  }, [northPanel, southPanel, files, terminal])

  const { prev, next, t } = useStepSpring(step)
  return (
    <MiniEditorTween
      frameProps={frameProps}
      t={t}
      backward={false}
      prev={prev}
      next={next}
      codeProps={codeProps}
    />
  )
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
