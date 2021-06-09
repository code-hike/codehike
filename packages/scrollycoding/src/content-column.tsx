import React from "react"
import { useClasser } from "@code-hike/classer"
import {
  Scroller,
  Step as ScrollerStep,
} from "@code-hike/scroller"
import { useFluidContext, HikeStep } from "./hike-context"
import { EditorStep } from "@code-hike/mini-editor"

export const StepContext = React.createContext<{
  stepIndex: number
  editorStep: EditorStep
} | null>(null)

export function ContentColumn({
  steps,
  onStepChange,
}: {
  steps: HikeStep[]
  onStepChange: (index: number) => void
}) {
  const c = useClasser("ch")
  const contentSteps = steps.map(s => s.content)
  return (
    <div className={c("hike-content")}>
      <Scroller onStepChange={onStepChange}>
        {contentSteps.map((children, index) => (
          <StepContext.Provider
            value={{
              stepIndex: index,
              editorStep:
                steps[index].editorProps.contentProps,
            }}
            key={index}
          >
            <StepContent
              children={children}
              stepIndex={index}
            />
          </StepContext.Provider>
        ))}
      </Scroller>
    </div>
  )
}

function StepContent({
  children,
  stepIndex,
}: {
  children: React.ReactNode
  stepIndex: number
}) {
  const c = useClasser("ch-hike-step")
  const { dispatch, hikeState } = useFluidContext()
  const focusStepIndex =
    hikeState.focusStepIndex ?? hikeState.scrollStepIndex
  const isOn = stepIndex === focusStepIndex
  return (
    <ScrollerStep
      as="div"
      index={stepIndex}
      onClick={() =>
        dispatch({
          type: "set-focus",
          stepIndex,
          editorStep: null,
        })
      }
      className={c("", isOn ? "focused" : "unfocused")}
    >
      {stepIndex > 0 && <div className={c("gap")} />}
      <div
        className={c(
          "content",
          isOn ? "content-focused" : "content-unfocused"
        )}
      >
        {children}
      </div>
    </ScrollerStep>
  )
}

export function useStepData() {
  return React.useContext(StepContext)!
}
