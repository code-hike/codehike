import * as React from "react"
import "./index.scss"
import { StepContext } from "./context"
import { Code, CodeProps } from "./code"
import { Preview, PreviewProps } from "./preview"
import { useClasser } from "@code-hike/classer"
import { HikeProps } from "./hike"
import { CodeContext } from "./code-context"

export { HikeBook, CodeSlot, PreviewSlot }

function HikeBook({ steps, ...props }: HikeProps) {
  const c = useClasser("ch-hike")

  return (
    <section className={c("")} {...props}>
      <div className={c("content")}>
        {steps.map((step, index) => (
          <CodeContext
            files={step.previewProps.files}
            preset={step.previewProps.preset}
            key={index}
          >
            <StepContext.Provider
              value={{ stepIndex: index, step }}
            >
              {step.content}
            </StepContext.Provider>
          </CodeContext>
        ))}
      </div>
    </section>
  )
}

function CodeSlot({ style, ...slotProps }: CodeProps) {
  const c = useClasser("ch-hike")
  const { step } = React.useContext(StepContext)!
  const props = {
    minColumns: 46,
    ...step.codeProps,
    ...slotProps,
  }
  return (
    <div className={c("step-code")} style={style}>
      <Code {...props} />
    </div>
  )
}

function PreviewSlot({
  style,
  ...slotProps
}: PreviewProps) {
  const c = useClasser("ch-hike")
  const { step } = React.useContext(StepContext)!
  const props = {
    ...step.previewProps,
    ...slotProps,
  }
  return (
    <div className={c("step-preview")} style={style}>
      <Preview {...props} />
    </div>
  )
}
