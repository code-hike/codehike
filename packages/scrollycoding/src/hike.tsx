import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import { Classes } from "@code-hike/utils"
import "./index.scss"
import {
  HikeContext,
  HikeStep,
  StepContext,
  classPrefixer as c,
  StepCode,
} from "./context"
import { Editor } from "./editor"
import { Preview } from "./preview"

export { Hike }

export interface HikeProps {
  steps: HikeStep[]
  classes?: Classes
}

function Hike({ steps, classes = {} }: HikeProps) {
  const [{ index, stepCode }, setState] = React.useState({
    index: 0,
    stepCode: steps[0].stepCode,
  })

  const currentStep = steps[index]

  const setFocus = (stepCode: StepCode) =>
    setState(({ index }) => ({
      index,
      stepCode,
    }))
  const resetFocus = () =>
    setState(({ index }) => ({
      index,
      stepCode: steps[index].stepCode,
    }))
  const changeStep = (newIndex: number) =>
    setState({
      index: newIndex,
      stepCode: steps[newIndex].stepCode,
    })

  return (
    <HikeContext.Provider
      value={{
        currentFocus: stepCode.focus,
        setFocus,
        resetFocus,
        classes,
      }}
    >
      <section className={c("", classes)}>
        <div className={c("-content", classes)}>
          <Scroller onStepChange={changeStep}>
            {steps.map((step, index) => (
              <StepContext.Provider
                value={step}
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
              <Editor
                stepCode={stepCode}
                classes={classes}
                minColumns={46} //TODO param
                {...currentStep.codeProps}
              />
            </div>
            <div className={c("-preview", classes)}>
              <Preview
                stepCode={stepCode}
                classes={classes}
                {...currentStep.previewProps}
              />
            </div>
          </div>
        </aside>
      </section>
    </HikeContext.Provider>
  )
}
