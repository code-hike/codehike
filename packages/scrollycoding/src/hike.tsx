import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import { Classes } from "@code-hike/utils"
import "./index.scss"
import {
  HikeContext,
  HikeStep,
  StepContext,
  classPrefixer as c,
  Demo,
} from "./context"
import { Editor } from "./editor"
import { Preview } from "./preview"

export { Hike }

export interface HikeProps {
  steps: HikeStep[]
  classes?: Classes
}

function Hike({ steps, classes = {} }: HikeProps) {
  const [{ index, demo }, setState] = React.useState({
    index: 0,
    demo: steps[0].demo,
  })

  const currentStep = steps[index]

  const setFocus = (demo: Demo) =>
    setState(({ index }) => ({
      index,
      demo,
    }))
  const resetFocus = () =>
    setState(({ index }) => ({
      index,
      demo: steps[index].demo,
    }))
  const changeStep = (newIndex: number) =>
    setState({
      index: newIndex,
      demo: steps[newIndex].demo,
    })

  return (
    <HikeContext.Provider
      value={{
        currentFocus: demo.focus,
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
                demo={demo}
                classes={classes}
                {...currentStep.codeProps}
              />
            </div>
            <div className={c("-preview", classes)}>
              <Preview
                demo={demo}
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
