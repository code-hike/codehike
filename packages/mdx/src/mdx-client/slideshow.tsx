import React from "react"
import { EditorProps, EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"

export function Slideshow({
  children,
  editorSteps,
  codeConfig,
  presetConfig,
  code,
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
  presetConfig?: PresetConfig
  code?: EditorProps["codeConfig"]
}) {
  const stepsChildren = React.Children.toArray(children)

  const hasNotes = stepsChildren.some(
    (child: any) => child.props?.children
  )

  const [state, setState] = React.useState({
    stepIndex: 0,
    step: editorSteps[0],
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

  return (
    <div
      className={`ch-slideshow ${
        presetConfig ? "ch-slideshow-with-preview" : ""
      }`}
    >
      <div className="ch-slideshow-slide">
        <InnerCode
          {...(tab as any)}
          codeConfig={{
            ...codeConfig,
            ...code,
          }}
          onTabClick={onTabClick}
        />
        {presetConfig && (
          <Preview
            className="ch-slideshow-preview"
            files={tab.files}
            presetConfig={presetConfig}
            codeConfig={codeConfig}
          />
        )}
      </div>

      <div className="ch-slideshow-notes">
        <div className="ch-slideshow-range">
          <button
            onClick={() =>
              setState(s => {
                const stepIndex = Math.max(
                  0,
                  s.stepIndex - 1
                )
                return {
                  stepIndex,
                  step: editorSteps[stepIndex],
                }
              })
            }
          >
            Prev
          </button>
          <input
            type="range"
            min={0}
            max={editorSteps.length - 1}
            value={state.stepIndex}
            step={1}
            onChange={e =>
              setState({
                stepIndex: +e.target.value,
                step: editorSteps[+e.target.value],
              })
            }
          />
          <button
            onClick={() =>
              setState(s => {
                const stepIndex = Math.min(
                  editorSteps.length - 1,
                  s.stepIndex + 1
                )
                return {
                  stepIndex,
                  step: editorSteps[stepIndex],
                }
              })
            }
          >
            Next
          </button>
        </div>

        {hasNotes && (
          <div className="ch-slideshow-note">
            {stepsChildren[state.stepIndex]}
          </div>
        )}
      </div>
    </div>
  )
}
