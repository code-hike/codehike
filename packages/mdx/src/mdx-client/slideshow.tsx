import React from "react"
import { EditorProps, EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"
import { extractPreviewSteps } from "./steps"
import { useInitialState } from "utils"

export function Slideshow({
  children,
  className,
  code,
  codeConfig,
  editorSteps,
  hasPreviewSteps,
  // Set the initial slide index
  initialSlideIndex = 0,
  // Called when the slideshow state changes and returns the current state object
  onChange: onSlideshowChange = () => {},
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
  initialSlideIndex?: number
  onChange?: Function
  presetConfig?: PresetConfig
  style?: React.CSSProperties
}) {
  const { stepsChildren, previewChildren } =
    extractPreviewSteps(children, hasPreviewSteps)
  const withPreview = presetConfig || hasPreviewSteps

  const hasNotes = stepsChildren.some(
    (child: any) => child.props?.children
  )

  const maxSteps = editorSteps.length - 1;

  // This hook will prevent the slide from being changed via the initialSlideIndex prop after render
  const initialSlideValue = useInitialState(initialSlideIndex);

  // Make sure the initial slide is not configured out of bounds
  const initialSlide = initialSlideValue > maxSteps ? maxSteps : initialSlideValue

  const [state, setState] = React.useState({
    stepIndex: initialSlide,
    step: editorSteps[initialSlide],
  })
  const tab = state.step

  // Run any time our Slideshow state changes
  React.useEffect(() => {
    // Return our state object to the Slideshow onChange function
    onSlideshowChange(state);
  }, [state]);

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
            type="range"
            min={0}
            max={maxSteps}
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
                  maxSteps,
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
