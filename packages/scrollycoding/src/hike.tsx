import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import {
  Classes,
  ClasserProvider,
  useClasser,
} from "@code-hike/classer"
import "./index.scss"
import {
  HikeContext,
  HikeStep,
  StepContext,
  HikeState,
  HikeAction,
} from "./context"
import { Code, CodeProps } from "./code"
import { Preview } from "./preview"
import { CodeContext } from "./code-context"

export { Hike }

export interface HikeProps
  extends React.PropsWithoutRef<
    JSX.IntrinsicElements["section"]
  > {
  steps: HikeStep[]
  classes?: Classes
  noPreview?: boolean
}

function Hike({
  noPreview,
  steps,
  classes,
  ...props
}: HikeProps) {
  const c = useClasser("ch-hike", classes)
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
    <ClasserProvider classes={classes}>
      <HikeContext.Provider
        value={{
          hikeState: state,
          dispatch,
        }}
      >
        <section className={c("")} {...props}>
          <div className={c("content")}>
            <Scroller onStepChange={onStepChange}>
              {steps.map((step, index) => (
                <CodeContext
                  files={previewProps.files}
                  preset={previewProps.preset}
                >
                  <StepContent
                    step={step}
                    stepIndex={index}
                    key={index}
                  />
                </CodeContext>
              ))}
            </Scroller>
          </div>
          <aside className={c("sticker-column")}>
            <div className={c("sticker")}>
              <CodeContext
                files={previewProps.files}
                preset={previewProps.preset}
              >
                <div className={c("editor")}>
                  <Code {...codeProps} />
                </div>
                {noPreview || (
                  <div className={c("preview")}>
                    <Preview {...previewProps} />
                  </div>
                )}
              </CodeContext>
            </div>
          </aside>
        </section>
      </HikeContext.Provider>
    </ClasserProvider>
  )
}

function ContentColumn() {
  return <div />
}
function StickerColumn() {
  return <div />
}

function StepContent({
  step,
  stepIndex,
}: {
  step: HikeStep
  stepIndex: number
}) {
  const c = useClasser("ch-hike-step")

  const { hikeState } = React.useContext(HikeContext)!

  const focusStepIndex =
    hikeState.focusStepIndex ?? hikeState.scrollStepIndex

  const isOn = stepIndex === focusStepIndex

  return (
    <StepContext.Provider
      value={{ stepIndex, step }}
      key={stepIndex}
    >
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
    </StepContext.Provider>
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
