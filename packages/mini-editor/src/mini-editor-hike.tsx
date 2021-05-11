import React from "react"
import { EditorFrame, TerminalPanel } from "./editor-frame"
import { InnerTerminal } from "@code-hike/mini-terminal"
import { Code } from "./code"
import {
  useBackwardTransitions,
  useForwardTransitions,
} from "./steps"
import { Classes } from "@code-hike/classer"
import { EditorTransition } from "./editor-transition"
// import "./theme.css"

export { MiniEditorHike }

type MiniEditorStep = {
  code?: string
  focus?: string
  lang?: string
  file?: string
  tabs?: string[]
  terminal?: string
}

export type MiniEditorHikeProps = {
  progress?: number
  backward?: boolean
  code?: string
  focus?: string
  lang?: string
  file?: string
  tabs?: string[]
  steps?: MiniEditorStep[]
  height?: number
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  button?: React.ReactNode
  horizontalCenter?: boolean
  classes?: Classes
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

function MiniEditorHike(props: MiniEditorHikeProps) {
  const {
    progress = 0,
    backward = false,
    code,
    focus,
    lang,
    file,
    steps: ogSteps,
    tabs: ogTabs,
    minColumns = 50,
    minZoom = 0.2,
    maxZoom = 1,
    height,
    horizontalCenter = false,
    ...rest
  } = props
  const t = progress % 1
  const prevStep = ogSteps![0]
  const nextStep = ogSteps![1] || ogSteps![0]

  const { steps, files } = useSteps(ogSteps, {
    code,
    focus,
    lang,
    file,
    tabs: ogTabs,
  })

  const prev = {
    files: [{ name: "A.js", code: "a", lang: "js" }],
    northPanel: {
      tabs: ["A.js"],
      active: "A.js",
      heightRatio: 0.5,
    },
  }
  const next = {
    files: [{ name: "A.js", code: "b", lang: "js" }],
    northPanel: {
      tabs: ["A.js"],
      active: "A.js",
      heightRatio: 0.5,
    },
  }
  console.log({ t, prev, next })

  return (
    <EditorTransition
      t={t}
      prev={prev}
      next={next}
      backward={backward}
    />
  )
}

// function MiniEditorHikeOld(props: MiniEditorHikeProps) {
//   const {
//     progress = 0,
//     backward = false,
//     code,
//     focus,
//     lang,
//     file,
//     steps: ogSteps,
//     tabs: ogTabs,
//     minColumns = 50,
//     minZoom = 0.2,
//     maxZoom = 1,
//     height,
//     horizontalCenter = false,
//     ...rest
//   } = props
//   const { steps, files, stepsByFile } = useSteps(ogSteps, {
//     code,
//     focus,
//     lang,
//     file,
//     tabs: ogTabs,
//   })

//   const activeStepIndex = backward
//     ? Math.floor(progress)
//     : Math.ceil(progress)
//   const activeStep = steps[activeStepIndex]
//   const activeFile = (activeStep && activeStep.file) || ""

//   const activeSteps = stepsByFile[activeFile] || []

//   const tabs = activeStep.tabs || files

//   const terminalHeight = getTerminalHeight(steps, progress)

//   const terminalSteps = steps.map(s => ({
//     text: (s && s.terminal) || "",
//   }))

//   const contentSteps = useStepsWithDefaults(
//     { code, focus, lang, file },
//     ogSteps || []
//   )

//   return (
//     <EditorFrame
//       files={tabs}
//       active={activeFile}
//       terminalPanel={
//         <TerminalPanel height={terminalHeight}>
//           <InnerTerminal
//             steps={terminalSteps}
//             progress={progress}
//           />
//         </TerminalPanel>
//       }
//       height={height}
//       {...rest}
//     >
//       {activeSteps.length > 0 && (
//         <EditorContent
//           key={activeFile}
//           backward={backward}
//           progress={progress}
//           steps={contentSteps}
//           parentHeight={height}
//           minColumns={minColumns}
//           minZoom={minZoom}
//           maxZoom={maxZoom}
//           horizontalCenter={horizontalCenter}
//         />
//       )}
//     </EditorFrame>
//   )
// }

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
  minZoom: number
  maxZoom: number
  horizontalCenter: boolean
}

function EditorContent({
  progress,
  backward,
  steps,
  parentHeight,
  minColumns,
  minZoom,
  maxZoom,
  horizontalCenter,
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
      minZoom={minZoom}
      maxZoom={maxZoom}
      horizontalCenter={horizontalCenter}
    />
  )
}

function useSteps(
  ogSteps: MiniEditorStep[] | undefined,
  { code = "", focus, lang, file, tabs }: MiniEditorStep
) {
  return React.useMemo(() => {
    const steps = ogSteps?.map(s => ({
      code,
      focus,
      lang,
      file,
      tabs,
      ...s,
    })) || [{ code, focus, lang, file, tabs }]

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
  }, [ogSteps, code, focus, lang, file, tabs])
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
