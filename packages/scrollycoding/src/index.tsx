import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import {
  MiniBrowser,
  MiniBrowserProps,
} from "@code-hike/mini-browser"
import { Classes } from "@code-hike/utils"
import "./index.scss"
import {
  HikeContext,
  HikeStep,
  StepContext,
  classPrefixer as c,
} from "./context"
import { Editor } from "./editor"
import { Focus } from "./focus"
import { StatefulEditorProps } from "@code-hike/mini-editor"

export { Hike, Focus, CodeSlot, BrowserSlot }

function CodeSlot(props: StatefulEditorProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  return (
    <div className={c("-step-code", classes)}>
      <Editor
        code={step.code}
        focus={step.focus}
        codesandboxUrl={step.demo}
        {...props}
        classes={classes}
      />
    </div>
  )
}

function BrowserSlot(props: MiniBrowserProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  return (
    <div className={c("-step-preview", classes)}>
      <MiniBrowser
        url={step.demo}
        {...props}
        classes={classes}
      />
    </div>
  )
}

export interface HikeProps {
  steps: HikeStep[]
  classes?: Classes
}

function Hike({ steps, classes = {} }: HikeProps) {
  const [{ index, focus, code }, setState] = React.useState(
    {
      index: 0,
      code: steps[0].code,
      focus: steps[0].focus,
    }
  )

  const currentStep = steps[index]
  const setFocus = (
    code: string,
    focus: string | undefined
  ) =>
    setState(({ index }) => ({
      index,
      code,
      focus: focus,
    }))
  const resetFocus = () =>
    setState(({ index }) => ({
      index,
      code: steps[index].code,
      focus: steps[index].focus,
    }))
  const changeStep = (newIndex: number) =>
    setState({
      index: newIndex,
      code: steps[newIndex].code,
      focus: steps[newIndex].focus,
    })

  return (
    <HikeContext.Provider
      value={{
        currentFocus: focus,
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
                code={code}
                classes={classes}
                focus={focus}
                codesandboxUrl={currentStep.demo}
              />
            </div>
            <div className={c("-preview", classes)}>
              <MiniBrowser
                url={currentStep.demo}
                classes={classes}
              />
            </div>
          </div>
        </aside>
      </section>
    </HikeContext.Provider>
  )
}
