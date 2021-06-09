import React from "react"
import {
  SandpackProvider,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  SandpackSetup,
  SandpackFile,
} from "@codesandbox/sandpack-react"
import { EditorProps } from "./editor"
import { PreviewProps } from "./preview"

export {
  DemoProvider,
  PreviewPreset,
  usePreviewProps,
  useEditorProps,
}

interface PreviewPreset {
  template?: SandpackPredefinedTemplate
  customSetup?: SandpackSetup
}

type DemoProviderProps = {
  editorProps: EditorProps
  previewProps: PreviewProps
  previewPreset: PreviewPreset
  children?: React.ReactNode
}

type DemoContext = {
  editorProps: EditorProps
  previewProps: PreviewProps
}

export const DemoContext = React.createContext<DemoContext | null>(
  null
)

function DemoProvider({
  children,
  editorProps,
  previewProps,
  previewPreset,
}: DemoProviderProps) {
  const sandpackProps = useSandpackProps(
    previewPreset,
    editorProps
  )
  const previewAndEditorProps = React.useMemo(
    () => ({
      previewProps,
      editorProps,
    }),
    [previewProps, editorProps]
  )
  return (
    <SandpackProvider {...sandpackProps}>
      <DemoContext.Provider value={previewAndEditorProps}>
        {children}
      </DemoContext.Provider>
    </SandpackProvider>
  )
}

function useSandpackProps(
  previewPreset: PreviewPreset,
  editorProps: EditorProps
): SandpackProviderProps {
  // TODO useMemo
  const files = {
    ...previewPreset?.customSetup?.files,
  } as Record<string, SandpackFile>
  const codeFiles = editorProps?.contentProps?.files || []
  codeFiles.forEach(file => {
    files["/" + file.name] = {
      code: file.code,
    }
  })

  return {
    recompileMode: "immediate",
    ...previewPreset,
    customSetup: {
      ...previewPreset?.customSetup,
      files,
    },
  }
}

function useEditorProps() {
  return React.useContext(DemoContext)!.editorProps
}
function usePreviewProps() {
  return React.useContext(DemoContext)!.previewProps
}
