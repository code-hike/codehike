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
  autoFocus,
  hasPreviewSteps,
  // Set the initial slide index
  start = 0,
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
  autoFocus?: boolean
  start?: number
  onChange?: Function
  presetConfig?: PresetConfig
  style?: React.CSSProperties
}) {
  const controlsRef = React.useRef(null)

  React.useEffect(() => {
    // Only set focus on controls input if we have configured to do so
    autoFocus && controlsRef.current.focus()
  }, [])

  const { stepsChildren, previewChildren } =
    extractPreviewSteps(children, hasPreviewSteps)
  const withPreview = presetConfig || hasPreviewSteps

  const hasNotes = stepsChildren.some(
    (child: any) => child.props?.children
  )

  const maxSteps = editorSteps.length - 1;

  // Make sure the initial slide is not configured out of bounds
  const initialSlide = start > maxSteps ? maxSteps : start

  const [state, setState] = React.useState({
    stepIndex: initialSlide,
    step: editorSteps[initialSlide],
  })

  // Destructure these values and give them more semantic names for use below
  const {
    stepIndex: currentSlideIndex,
    step: tab,
  } = state;

  // Run any time our Slideshow state changes
  React.useEffect(() => {
    // Return our state object to the Slideshow onChange function
    onSlideshowChange({
      index: currentSlideIndex
    });
    // We are only calling this effect if the current slide changes.
  }, [currentSlideIndex]);

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
            {...previewChildren[currentSlideIndex]["props"]}
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
            max={maxSteps}
            min={0}
            ref={controlsRef}
            step={1}
            type="range"
            value={currentSlideIndex}
            onChange={e =>
              setState({
                stepIndex: +e.target.value,
                step: editorSteps[+e.target.value],
              })
            }
            autoFocus={autoFocus}
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
            {stepsChildren[currentSlideIndex]}
          </div>
        )}
      </div>
    </div>
  )
}
