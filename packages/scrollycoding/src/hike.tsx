import * as React from "react"
import {
  ClasserProvider,
  Classes,
} from "@code-hike/classer"
import "./index.scss"
import { Swap } from "server-side-media-queries-for-react"
import { FluidLayout } from "./fluid-layout"
import { FixedLayout } from "./fixed-layout"
import { PreviewProps } from "./preview"
import { PreviewPreset } from "./demo-provider"
import { EditorProps } from "./editor"
import { HikeStep } from "./hike-context"
import {
  EditorStep,
  mdxToStep,
} from "@code-hike/mini-editor"

const StepHead: React.FC = () => null

export { Hike, HikeWithSteps, StepHead }

type HikeProps = {
  classes: Classes
  config?: {
    noPreview?: boolean
    breakpoint?: number
    defaultFileName?: string
  }
  editorProps?: Partial<EditorProps>
  previewProps?: Partial<PreviewProps>
  preset?: PreviewPreset
  children: React.ReactNode
}

function Hike({
  classes,
  children,
  editorProps,
  previewProps,
  preset,
  config,
}: HikeProps) {
  const steps = useStepsFromChildren({
    children,
    editorProps,
    previewProps,
    preset,
    defaultFileName: config?.defaultFileName,
  })
  return (
    <HikeWithSteps
      steps={steps}
      classes={classes}
      config={config}
    />
  )
}

function HikeWithSteps({
  classes,
  steps,
  config,
}: {
  classes?: Classes
  steps: HikeStep[]
  config?: { noPreview?: boolean; breakpoint?: number }
}) {
  return (
    <ClasserProvider classes={classes}>
      <Swap
        // TODO use config.breakpoint
        match={[
          [
            "(min-width: 920px)",
            <FluidLayout
              steps={steps}
              noPreview={config?.noPreview || false}
            />,
          ],
          ["default", <FixedLayout steps={steps} />],
        ]}
      />
    </ClasserProvider>
  )
}

function useStepsFromChildren({
  children,
  editorProps = {},
  previewProps = {},
  preset = {},
  defaultFileName = "App.js",
}: {
  children: React.ReactNode
  editorProps?: Partial<EditorProps>
  previewProps?: Partial<PreviewProps>
  preset?: PreviewPreset
  defaultFileName?: string
}): HikeStep[] {
  // Assumes a step head like:
  // <StepHead codeProps={{minColumns: 20}} previewProps={{zoom: 1}} editorFrameProps={{width: 200}} >

  const kids = React.Children.toArray(children)
  let prevEditorStep: EditorStep | undefined = undefined
  const steps = [] as HikeStep[]

  for (let i = 0; i < kids.length; ) {
    const headKid = kids[i]
    const contentKids = [] as React.ReactNode[]
    i++
    while (
      i < kids.length &&
      (kids[i] as any)?.props?.mdxType !== "StepHead"
    ) {
      contentKids.push(kids[i])
      i++
    }

    const editorStep = mdxToStep(headKid, prevEditorStep, {
      defaultFileName,
    })
    prevEditorStep = editorStep

    const headProps = (headKid as any)?.props
    const stepPreviewProps = headProps?.previewProps
    const stepCodeProps = headProps?.codeProps
    const stepFrameProps = headProps?.editorFrameProps

    steps.push({
      content: React.createElement(React.Fragment, {
        children: contentKids,
      }),
      editorProps: {
        contentProps: editorStep,
        codeProps: {
          ...editorProps?.codeProps,
          ...stepCodeProps,
        },
        frameProps: {
          ...editorProps?.frameProps,
          ...stepFrameProps,
        },
        springConfig: editorProps?.springConfig,
      },
      previewPreset: preset,
      previewProps: {
        ...previewProps,
        ...stepPreviewProps,
      },
    })
  }

  return steps
}
