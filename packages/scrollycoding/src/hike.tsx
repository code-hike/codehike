import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import { Classes } from "@code-hike/utils"
import "./index.scss"
import {
  HikeContext,
  HikeStep,
  StepContext,
  classPrefixer as c,
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
  classes = {},
  ...props
}: HikeProps) {
  const [state, dispatch] = React.useReducer(
    reducer,
    initialState
  )

  const focusStep =
    steps[state.focusStepIndex ?? state.scrollStepIndex]
  const codeProps: CodeProps = {
    ...focusStep.codeProps,
    ...state.focusCodeProps,
  }
  const previewProps = focusStep.previewProps

  return (
    <HikeContext.Provider
      value={{
        hikeState: state,
        dispatch,
        classes,
      }}
    >
      <section className={c("", classes)} {...props}>
        <div className={c("-content", classes)}>
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
                  className={c("-step", classes)}
                >
                  <div
                    className={c("-step-content", classes)}
                  >
                    {step.content}
                  </div>
                </Step>
              </StepContext.Provider>
            ))}
          </Scroller>
        </div>
        <aside className={c("-sticker-column", classes)}>
          <div className={c("-sticker", classes)}>
            <div className={c("-editor", classes)}>
              <Code classes={classes} {...codeProps} />
            </div>
            {noPreview || (
              <div className={c("-preview", classes)}>
                <Preview
                  classes={classes}
                  {...previewProps}
                />
              </div>
            )}
          </div>
        </aside>
      </section>
    </HikeContext.Provider>
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
