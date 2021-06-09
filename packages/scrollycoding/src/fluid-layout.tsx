import React from "react"
import { useClasser } from "@code-hike/classer"
import { ContentColumn } from "./content-column"
import { StickerColumn } from "./sticker-column"
import {
  HikeProvider,
  HikeState,
  HikeAction,
  HikeStep,
} from "./hike-context"
import { EditorProps } from "./editor"

export function FluidLayout({
  steps,
  noPreview = false,
}: {
  steps: HikeStep[]
  noPreview: boolean
}) {
  const c = useClasser("ch")
  const [state, dispatch] = React.useReducer(
    reducer,
    initialState
  )

  const focusStepIndex =
    state.focusStepIndex ?? state.scrollStepIndex

  const focusStep = steps[focusStepIndex]

  const editorProps: EditorProps = {
    ...focusStep.editorProps,
    contentProps:
      state.focusEditorStep ||
      focusStep.editorProps.contentProps,
  }
  const { previewProps, previewPreset } = focusStep

  const onStepChange = (newIndex: number) =>
    dispatch({ type: "change-step", newIndex })

  return (
    <HikeProvider
      value={{
        layout: "fluid",
        hikeState: state,
        dispatch,
      }}
    >
      <section className={c("hike", "hike-fluid")}>
        <ContentColumn
          steps={steps}
          onStepChange={onStepChange}
        />
        <StickerColumn
          previewProps={previewProps}
          previewPreset={previewPreset}
          editorProps={editorProps}
          noPreview={noPreview}
        />
      </section>
    </HikeProvider>
  )
}

const initialState = {
  scrollStepIndex: 0,
  focusStepIndex: null,
  focusEditorStep: null,
}

function reducer(
  state: HikeState,
  action: HikeAction
): HikeState {
  switch (action.type) {
    case "change-step":
      return {
        scrollStepIndex: action.newIndex,
        focusStepIndex: null,
        focusEditorStep: null,
      }
    case "set-focus":
      return {
        ...state,
        focusStepIndex: action.stepIndex,
        focusEditorStep: action.editorStep,
      }
    case "reset-focus":
      return {
        ...state,
        focusStepIndex: null,
        focusEditorStep: null,
      }
    default:
      throw new Error()
  }
}
