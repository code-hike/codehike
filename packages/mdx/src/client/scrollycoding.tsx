import React from "react"
import {
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import {
  Scroller,
  Step as ScrollerStep,
} from "@code-hike/scroller"
import { Preview, PresetConfig } from "./preview"

export function Scrollycoding({
  children,
  editorSteps,
  codeConfig,
  presetConfig,
  start = 0,
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
  start?: number
  presetConfig?: PresetConfig
}) {
  const stepsChildren = React.Children.toArray(children)

  const [state, setState] = React.useState({
    stepIndex: start,
    step: editorSteps[start],
  })

  const tab = state.step

  function onStepChange(index: number) {
    setState({ stepIndex: index, step: editorSteps[index] })
  }

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(
      state.step,
      filename,
      null
    )
    setState({ ...state, step: newStep })
  }

  return (
    <section
      className={`ch-scrollycoding ${
        presetConfig ? "ch-scrollycoding-with-preview" : ""
      }`}
    >
      <div className="ch-scrollycoding-content">
        <Scroller onStepChange={onStepChange}>
          {stepsChildren.map((children, i) => (
            <ScrollerStep
              as="div"
              key={i}
              index={i}
              onClick={() => onStepChange(i)}
              className="ch-scrollycoding-step-content"
              data-selected={
                i === state.stepIndex ? "true" : undefined
              }
            >
              {children}
            </ScrollerStep>
          ))}
        </Scroller>
      </div>
      <div className="ch-scrollycoding-sticker">
        <InnerCode
          {...(tab as any)}
          codeConfig={codeConfig}
          onTabClick={onTabClick}
        />
        {presetConfig && (
          <Preview
            className="ch-scrollycoding-preview"
            files={tab.files}
            presetConfig={presetConfig}
          />
        )}
      </div>
    </section>
  )
}
