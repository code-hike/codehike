import React from "react"
import { EditorFrame, TerminalPanel } from "./editor-frame"
import { InnerTerminal } from "@code-hike/mini-terminal"
import { Code } from "./code"
import {
  useBackwardTransitions,
  useForwardTransitions,
} from "./steps"
// import "./theme.css"

export { MiniEditor }

type MiniEditorStep = {
  code?: string
  focus?: string
  lang?: string
  file?: string
  tabs?: string[]
  terminal?: string
}

export type MiniEditorProps = {
  progress?: number
  backward?: boolean
  code?: string
  focus?: string
  lang?: string
  file?: string
  steps?: MiniEditorStep[]
  height?: number
  minColumns?: number
  button?: React.ReactNode
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

function MiniEditor(props: MiniEditorProps) {
  const {
    progress = 0,
    backward = false,
    code,
    focus,
    lang,
    file,
    steps: ogSteps,
    minColumns = 50,
    height,
    ...rest
  } = props
  const { steps, files, stepsByFile } = useSteps(ogSteps, {
    code,
    focus,
    lang,
    file,
  })

  const activeStepIndex = backward
    ? Math.floor(progress)
    : Math.ceil(progress)
  const activeStep = steps[activeStepIndex]
  const activeFile = (activeStep && activeStep.file) || ""

  const activeSteps = stepsByFile[activeFile] || []

  const tabs = activeStep.tabs || files

  const terminalHeight = getTerminalHeight(steps, progress)

  const terminalSteps = steps.map(s => ({
    text: (s && s.terminal) || "",
  }))

  const contentSteps = useStepsWithDefaults(
    { code, focus, lang, file },
    ogSteps || []
  )

  return (
    <EditorFrame
      files={tabs}
      active={activeFile}
      terminalPanel={
        <TerminalPanel height={terminalHeight}>
          <InnerTerminal
            steps={terminalSteps}
            progress={progress}
          />
        </TerminalPanel>
      }
      height={height}
      {...rest}
    >
      {activeSteps.length > 0 && (
        <EditorContent
          key={activeFile}
          backward={backward}
          progress={progress}
          steps={contentSteps}
          parentHeight={height}
          minColumns={minColumns}
        />
      )}
    </EditorFrame>
  )
}

function useStepsWithDefaults(
  defaults: MiniEditorStep,
  steps: MiniEditorStep[]
): ContentStep[] {
  const files = [
    ...new Set(
      steps.map(s => coalesce(s.file, defaults.file, ""))
    ),
  ]
  return steps.map(step => {
    return {
      code: coalesce(step.code, defaults.code, ""),
      file: coalesce(step.file, defaults.file, ""),
      focus: coalesce(step.focus, defaults.focus, ""),
      lang: coalesce(
        step.lang,
        defaults.lang,
        "javascript"
      ),
      tabs: coalesce(step.tabs, defaults.tabs, files),
      terminal: step.terminal || defaults.terminal,
    }
  })
}

function coalesce<T>(
  a: T | null | undefined,
  b: T | null | undefined,
  c: T
): T {
  return a != null ? a : b != null ? b : c
}

type ContentStep = {
  code: string
  focus: string
  lang: string
  file: string
  tabs: string[]
  terminal?: string
}

type ContentProps = {
  progress: number
  backward: boolean
  steps: ContentStep[]
  parentHeight?: number
  minColumns: number
}

function EditorContent({
  progress,
  backward,
  steps,
  parentHeight,
  minColumns,
}: ContentProps) {
  const fwdTransitions = useForwardTransitions(steps)
  const bwdTransitions = useBackwardTransitions(steps)

  const transitionIndex = Math.ceil(progress)
  const {
    prevCode,
    nextCode,
    prevFocus,
    nextFocus,
    lang,
  } = backward
    ? bwdTransitions[transitionIndex]
    : fwdTransitions[transitionIndex]

  return (
    <Code
      prevCode={prevCode || nextCode!}
      nextCode={nextCode || prevCode!}
      prevFocus={prevFocus}
      nextFocus={nextFocus}
      language={lang}
      progress={progress - transitionIndex + 1}
      parentHeight={parentHeight}
      minColumns={minColumns}
    />
  )
}

function useSteps(
  ogSteps: MiniEditorStep[] | undefined,
  { code = "", focus, lang, file }: MiniEditorStep
) {
  return React.useMemo(() => {
    const steps = ogSteps?.map(s => ({
      code,
      focus,
      lang,
      file,
      ...s,
    })) || [{ code, focus, lang, file }]

    const files = [
      ...new Set(
        steps
          .map((s: any) => s.file)
          .filter((f: any) => f != null)
      ),
    ]

    const stepsByFile: Record<string, MiniEditorStep[]> = {}
    steps.forEach(s => {
      if (s.file == null) return
      if (!stepsByFile[s.file]) {
        stepsByFile[s.file] = []
      }
      stepsByFile[s.file].push(s)
    })

    return { steps, files, stepsByFile }
  }, [ogSteps, code, focus, lang, file])
}

const MAX_HEIGHT = 150
function getTerminalHeight(steps: any, progress: number) {
  if (!steps.length) {
    return 0
  }

  const prevIndex = Math.floor(progress)
  const nextIndex = Math.ceil(progress)
  const prevTerminal =
    steps[prevIndex] && steps[prevIndex].terminal
  const nextTerminal = steps[nextIndex].terminal

  if (!prevTerminal && !nextTerminal) return 0

  if (!prevTerminal && nextTerminal)
    return MAX_HEIGHT * Math.min((progress % 1) * 4, 1)
  if (prevTerminal && !nextTerminal)
    return MAX_HEIGHT * Math.max(1 - (progress % 1) * 4, 0)

  return MAX_HEIGHT
}
