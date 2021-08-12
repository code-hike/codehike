import React from "react"
import { useSpring } from "use-spring"
import { MiniEditorTween } from "./mini-editor-tween"
import { EditorStep, StepFile } from "./use-snapshots"
import {
  CodeProps,
  CodeAnnotation,
} from "@code-hike/smooth-code"
import { EditorFrameProps } from "./editor-frame"

export { MiniEditor, MiniEditorProps }

type SpringConfig = Parameters<typeof useSpring>[1]

const defaultSpring = {
  stiffness: 120,
  damping: 24,
  mass: 0.2,
  decimals: 3,
}

type SingleFileEditorProps = {
  code: string
  lang: string
  focus?: string
  annotations?: CodeAnnotation[]
  filename?: string
  terminal?: string
  frameProps?: Partial<EditorFrameProps>
  codeProps?: Partial<CodeProps>
  springConfig?: SpringConfig
}
type SinglePanelEditorProps = {
  files: StepFile[]
  active: string
  terminal?: string
  frameProps?: Partial<EditorFrameProps>
  codeProps?: Partial<CodeProps>
  springConfig?: SpringConfig
}
type TwoPanelEditorProps = EditorStep & {
  frameProps?: Partial<EditorFrameProps>
  codeProps?: Partial<CodeProps>
  springConfig?: SpringConfig
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
  annotations,
  terminal,
  springConfig,
  ...props
}: SingleFileEditorProps) {
  const step = React.useMemo(() => {
    const step: EditorStep = {
      files: [
        { name: filename, code, lang, focus, annotations },
      ],
      northPanel: {
        active: filename,
        tabs: [filename],
        heightRatio: 1,
      },
      terminal,
    }
    return step
  }, [code, lang, focus, filename, terminal])

  const { prev, next, t } = useStepSpring(
    step,
    springConfig
  )
  return (
    <MiniEditorTween
      t={t}
      backward={false}
      prev={prev}
      next={next}
      {...props}
    />
  )
}
function SinglePanelEditor({
  files,
  active,
  terminal,
  springConfig,
  ...props
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

  const { prev, next, t } = useStepSpring(
    step,
    springConfig
  )
  return (
    <MiniEditorTween
      t={t}
      backward={false}
      prev={prev}
      next={next}
      {...props}
    />
  )
}
function TwoPanelEditor({
  northPanel,
  southPanel,
  files,
  terminal,
  springConfig,
  ...props
}: TwoPanelEditorProps) {
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
    <MiniEditorTween
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
) {
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

  const [progress] = useSpring(target, springConfig)

  const t = progress % 1

  return { prev, next, t: t || 1 }
}
