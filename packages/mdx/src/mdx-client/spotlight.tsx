import React from "react"
import { EditorProps, EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"

export function Spotlight({
  children,
  editorSteps,
  codeConfig,
  start = 0,
  presetConfig,
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

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(
      state.step,
      filename,
      null
    )
    setState({ ...state, step: newStep })
  }

  const headerElement =
    stepsChildren[0] as React.ReactElement

  return (
    <div
      className={`ch-spotlight ${
        presetConfig ? "ch-spotlight-with-preview" : ""
      }`}
    >
      <div className="ch-spotlight-tabs">
        {headerElement?.props?.children ? (
          <div>{stepsChildren[0]}</div>
        ) : null}
        {stepsChildren.map((children, i) =>
          i === 0 ? null : (
            <div
              key={i}
              onClick={() =>
                setState({
                  stepIndex: i,
                  step: editorSteps[i],
                })
              }
              className="ch-spotlight-tab"
              data-selected={
                i === state.stepIndex ? "true" : undefined
              }
            >
              {children}
            </div>
          )
        )}
      </div>
      <div className="ch-spotlight-sticker">
        <InnerCode
          {...(tab as any)}
          codeConfig={codeConfig}
          onTabClick={onTabClick}
        />
        {presetConfig && (
          <Preview
            className="ch-spotlight-preview"
            files={tab.files}
            presetConfig={presetConfig}
            codeConfig={codeConfig}
          />
        )}
      </div>
    </div>
  )
}
