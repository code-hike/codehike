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
            <Scroller
              onStepChange={newIndex =>
                dispatch({ type: "change-step", newIndex })
              }
            >
              {steps.map((step, index) => (
                <StepContext.Provider
                  value={{ stepIndex: index, step }}
                  key={index}
                >
                  <Step
                    as="div"
                    index={index}
                    key={index}
                    className={c(
                      "step",
                      index === focusStepIndex
                        ? "step-focused"
                        : "step-unfocused"
                    )}
                  >
                    {index > 0 && (
                      <div className={c("step-gap")} />
                    )}
                    <div
                      className={c(
                        "step-content",
                        index === focusStepIndex
                          ? "step-content-focused"
                          : "step-content-unfocused"
                      )}
                    >
                      {step.content}
                    </div>
                  </Step>
                </StepContext.Provider>
              ))}
            </Scroller>
          </div>
          <aside className={c("sticker-column")}>
            <div className={c("sticker")}>
              <div className={c("editor")}>
                <Code {...codeProps} />
              </div>
              {noPreview || (
                <div className={c("preview")}>
                  <Preview {...previewProps} />
                </div>
              )}
            </div>
          </aside>
        </section>
      </HikeContext.Provider>
    </ClasserProvider>
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
