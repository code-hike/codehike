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
  autoPlay,
  autoPlayLoop = false,
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
  autoPlay?: number
  autoPlayLoop?: boolean
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

  // As this gets more complex, probably would make more sense to abstract this into a custom hook with methods to modify state versus exposing directly
  const [state, setState] = React.useState({
    stepIndex: initialSlide,
    step: editorSteps[initialSlide],
  })

  // Destructure these values and give them more semantic names for use below
  const {
    stepIndex: currentSlideIndex,
    step: tab,
  } = state;

  const atSlideshowStart = currentSlideIndex === 0;
  const atSlideshowEnd = currentSlideIndex === maxSteps;

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

  function slideNext() {
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

  function slidePrevious() {
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

  React.useEffect(() => {
    // If autoplay is enabled, and we are not at the end of the slides, move to the next slide
    if (autoPlay && !atSlideshowEnd) {
      const autoSlide = setTimeout(
        () => slideNext(),
        autoPlay
      );
      
      // Cleanup our timeout if our component unmounts
      return () => {
        clearTimeout(autoSlide);
      };
    // If we are at the end of the slideshow, and we have configured to loop, start over
    } else if (autoPlay && atSlideshowEnd && autoPlayLoop) {
      // We still have to use the same timeout function with autoPlay delay or else the last slide will never show because it will instantly change
      const autoRestart = setTimeout(
        () => {
          setState({
            stepIndex: 0,
            step: editorSteps[0],
          })
        },
        autoPlay
      );
      
      // Cleanup our timeout if our component unmounts
      return () => {
        clearTimeout(autoRestart);
      };      
    } else {
      return null;
    }
  }, [currentSlideIndex, autoPlay]);

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
            onClick={() => slidePrevious()}
            disabled={atSlideshowStart}
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
            onClick={() => slideNext()}
            disabled={atSlideshowEnd}
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
