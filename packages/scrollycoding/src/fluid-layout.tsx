import React from "react"
import { useClasser } from "@code-hike/classer"
import { Code } from "./code"
import { Preview } from "./preview"
import {
  CodeProps,
  HikeAction,
  HikeProps,
  HikeProvider,
  HikeState,
  HikeStep,
  PreviewProps,
  useFluidContext,
} from "./hike-context"
import { Scroller, Step } from "@code-hike/scroller"
import {
  DemoProvider,
  StepContext,
  usePreviewProps,
} from "./demo-context"

export { FluidLayout }

function FluidLayout({
  noPreview = false,
  steps,
  ...props
}: HikeProps) {
  const c = useClasser("ch")
  const [state, dispatch] = React.useReducer(
    reducer,
    initialState
  )

  const focusStepIndex =
    state.focusStepIndex ?? state.scrollStepIndex

  const focusStep = steps[focusStepIndex]
  const codeProps: CodeProps = {
    ...focusStep.codeProps,
    ...state.focusCodeProps,
  }
  const previewProps = focusStep.previewProps

  const onStepChange = (newIndex: number) =>
    dispatch({ type: "change-step", newIndex })

  return (
    <HikeProvider
      value={{
        layout: "fluid",
        hikeState: state,
        dispatch,
      }}
    >
      <section
        className={c("hike", "hike-fluid")}
        {...props}
      >
        <ContentColumn
          steps={steps}
          onStepChange={onStepChange}
        />
        <StickerColumn
          previewProps={previewProps}
          codeProps={codeProps}
          noPreview={noPreview}
        />
      </section>
    </HikeProvider>
  )
}

function ContentColumn({
  steps,
  onStepChange,
}: {
  steps: HikeStep[]
  onStepChange: (index: number) => void
}) {
  const c = useClasser("ch")
  return (
    <div className={c("hike-content")}>
      <Scroller onStepChange={onStepChange}>
        {steps.map((step, index) => (
          <StepContext.Provider
            value={{ stepIndex: index }}
            key={index}
          >
            <StepContent step={step} stepIndex={index} />
          </StepContext.Provider>
        ))}
      </Scroller>
    </div>
  )
}

function StickerColumn({
  previewProps,
  codeProps,
  noPreview,
}: {
  previewProps: PreviewProps
  codeProps: CodeProps
  noPreview: boolean
}) {
  const c = useClasser("ch")
  return (
    <aside className={c("hike-sticker-column")}>
      <div className={c("hike-sticker")}>
        <DemoProvider
          codeProps={codeProps}
          previewProps={previewProps}
        >
          <div className={c("hike-editor")}>
            <Code {...codeProps} />
          </div>
          {noPreview || (
            <div className={c("hike-preview")}>
              <PreviewWrapper />
            </div>
          )}
        </DemoProvider>
      </div>
    </aside>
  )
}

function PreviewWrapper() {
  const previewProps = usePreviewProps()
  return <Preview {...previewProps} />
}

function StepContent({
  step,
  stepIndex,
}: {
  step: HikeStep
  stepIndex: number
}) {
  const c = useClasser("ch-hike-step")
  const { hikeState } = useFluidContext()
  const focusStepIndex =
    hikeState.focusStepIndex ?? hikeState.scrollStepIndex
  const isOn = stepIndex === focusStepIndex
  return (
    <Step
      as="div"
      index={stepIndex}
      className={c("", isOn ? "focused" : "unfocused")}
    >
      {stepIndex > 0 && <div className={c("gap")} />}
      <div
        className={c(
          "content",
          isOn ? "content-focused" : "content-unfocused"
        )}
      >
        {step.content}
      </div>
    </Step>
  )
}

const initialState = {
  scrollStepIndex: 0,
  focusStepIndex: null,
  focusCodeProps: {},
}

function reducer(
  state: HikeState,
  action: HikeAction
): HikeState {
  switch (action.type) {
    case "change-step":
      return {
        scrollStepIndex: action.newIndex,
        focusStepIndex: null,
        focusCodeProps: {},
      }
    case "set-focus":
      return {
        ...state,
        focusStepIndex: action.stepIndex,
        focusCodeProps: action.codeProps,
      }
    case "reset-focus":
      return {
        ...state,
        focusStepIndex: null,
        focusCodeProps: {},
      }
    default:
      throw new Error()
  }
}
