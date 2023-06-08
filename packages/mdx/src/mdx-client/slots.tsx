import React from "react"
import { EditorStep } from "../mini-editor"
import { InnerCode } from "./code"
import { Preview } from "./preview"

export function CodeSlot() {
  const context = React.useContext(StaticStepContext)

  if (!context) {
    return null
  }

  return <InnerCodeSlot {...context} />
}

function InnerCodeSlot({ editorStep, setFocus }) {
  const onTabClick = (filename: string) => {
    setFocus({ fileName: filename, focus: null, id: "" })
  }
  const { preset, presetConfig, ...props } = editorStep
  return <InnerCode {...props} onTabClick={onTabClick} />
}
export function PreviewSlot() {
  const context = React.useContext(StaticStepContext)
  if (!context) {
    return null
  }

  return <InnerPreviewSlot {...context} />
}

function InnerPreviewSlot({
  previewStep,
  allProps,
  editorStep,
}) {
  const { preset, ...props } = allProps
  return (
    <Preview
      className="ch-scrollycoding-preview"
      {...props}
      {...previewStep?.props}
      files={editorStep.files}
    />
  )
}

export const StaticStepContext = React.createContext<{
  editorStep: EditorStep
  previewStep: React.ReactNode
  allProps: any
  setFocus: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
}>(null)
