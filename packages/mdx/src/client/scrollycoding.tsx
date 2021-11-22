import React from "react"
import {
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"
import { Code } from "./code"
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

  const [stepIndex, setIndex] = React.useState(start)
  const tab = editorSteps[stepIndex]

  function onStepChange(index: number) {
    setIndex(index)
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
              onClick={() => setIndex(i)}
              className="ch-scrollycoding-step-content"
              data-selected={
                i === stepIndex ? "true" : undefined
              }
            >
              {children}
            </ScrollerStep>
          ))}
        </Scroller>
      </div>
      <div className="ch-scrollycoding-sticker">
        <Code {...(tab as any)} codeConfig={codeConfig} />
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
