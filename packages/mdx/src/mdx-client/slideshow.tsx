import React from "react"
import { EditorProps, EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"
import { extractPreviewSteps } from "./steps"

export function Slideshow({
  children,
  className,
  code,
  codeConfig,
  editorSteps,
  hasAutoFocusControls,
  hasPreviewSteps,
  presetConfig,
  style,
  ...rest
}: {
  children: React.ReactNode
  className?: string
  code?: EditorProps["codeConfig"]
  codeConfig: EditorProps["codeConfig"]
  editorSteps: EditorStep[]
  hasPreviewSteps?: boolean
  hasAutoFocusControls?: boolean
  presetConfig?: PresetConfig
  style?: React.CSSProperties
}) {
  const controlsRef = React.useRef(null);

  React.useEffect(() => {
      // Only set focus on controls input if we have configured to do so
      hasAutoFocusControls && controlsRef.current.focus();
  }, []);

  const { stepsChildren, previewChildren } =
    extractPreviewSteps(children, hasPreviewSteps)
  const withPreview = presetConfig || hasPreviewSteps

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
        withPreview ? "ch-slideshow-with-preview" : ""
      } ${className || ""}`}
      style={style}
    >
      <div className="ch-slideshow-slide">
        <InnerCode
          {...rest}
          {...(tab as any)}
          codeConfig={{
            ...codeConfig,
            ...code,
          }}
          onTabClick={onTabClick}
        />
        {presetConfig ? (
          <Preview
            className="ch-slideshow-preview"
            files={tab.files}
            presetConfig={presetConfig}
            codeConfig={codeConfig}
          />
        ) : hasPreviewSteps ? (
          <Preview
            className="ch-slideshow-preview"
            {...previewChildren[state.stepIndex]["props"]}
          />
        ) : null}
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
            max={editorSteps.length - 1}
            min={0}
            ref={controlsRef}
            step={1}
            type="range"
            value={state.stepIndex}
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
