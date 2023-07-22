import React from "react"
import { EditorStep } from "../mini-editor"
import { InnerCode } from "./code"
import { Preview } from "./preview"
import {
  CodeConfigProps,
  ElementProps,
  GlobalConfig,
} from "../core/types"

type CodeSlotProps = CodeConfigProps & ElementProps

export function CodeSlot(localProps: CodeSlotProps) {
  const context = React.useContext(StaticStepContext)

  if (!context) {
    return null
  }

  const {
    editorStep,
    codeConfigProps,
    setFocus,
    globalConfig,
  } = context
  const onTabClick = (filename: string) => {
    setFocus({ fileName: filename, focus: null, id: "" })
  }

  return (
    <InnerCode
      globalConfig={globalConfig}
      editorStep={editorStep}
      codeConfigProps={{
        ...codeConfigProps,
        ...localProps,
      }}
      onTabClick={onTabClick}
    />
  )
}

export function PreviewSlot(localProps: any) {
  const context = React.useContext(StaticStepContext)
  if (!context) {
    return null
  }

  const {
    editorStep,
    previewStep,
    presetConfig,
    globalConfig,
  } = context

  return (
    <Preview
      className="ch-scrollycoding-preview"
      files={editorStep.files}
      globalConfig={globalConfig}
      presetConfig={presetConfig}
      {...previewStep["props"]}
    />
  )
}

export const StaticStepContext = React.createContext<{
  editorStep: EditorStep
  globalConfig: GlobalConfig
  previewStep: React.ReactNode
  presetConfig?: any
  codeConfigProps: CodeConfigProps
  setFocus: (x: {
    fileName?: string
    focus: string | null
    id: string
  }) => void
}>(null)
