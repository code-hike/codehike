import React from "react"
import { MiniBrowser } from "@code-hike/mini-browser"
import {
  SandpackClient,
  SandpackBundlerFiles,
  SandboxInfo,
} from "@codesandbox/sandpack-client"
import { EditorStep } from "@code-hike/mini-editor"
import { EditorTheme } from "@code-hike/utils"

export type PresetConfig = SandboxInfo
export function Preview({
  className,
  files,
  presetConfig,
  show,
  children,
  codeConfig,
  ...rest
}: {
  className: string
  files: EditorStep["files"]
  presetConfig?: PresetConfig
  show?: string
  children?: React.ReactNode
  codeConfig: { theme: EditorTheme }
}) {
  return (
    <div
      className={
        "ch-preview" + (className ? " " + className : "")
      }
    >
      <MiniBrowser
        loadUrl={show}
        theme={codeConfig.theme}
        {...rest}
        children={
          presetConfig ? (
            <SandpackPreview
              files={files}
              presetConfig={presetConfig}
            />
          ) : (
            children
          )
        }
      />
    </div>
  )
}

function SandpackPreview({
  files,
  presetConfig,
}: {
  files: EditorStep["files"]
  presetConfig: PresetConfig
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null!)
  const clientRef = React.useRef<SandpackClient>(null!)

  React.useEffect(() => {
    clientRef.current = new SandpackClient(
      iframeRef.current,
      {
        ...presetConfig,
        files: mergeFiles(presetConfig.files, files),
      },
      {
        showOpenInCodeSandbox: false,
        // showErrorScreen: false,
        // showLoadingScreen: false,
      }
    )
  }, [])

  React.useEffect(() => {
    if (clientRef.current) {
      clientRef.current.updatePreview({
        ...presetConfig,
        files: mergeFiles(presetConfig.files, files),
      })
    }
  }, [files])

  return <iframe ref={iframeRef} />
}

function mergeFiles(
  csbFiles: SandpackBundlerFiles,
  chFiles: EditorStep["files"]
) {
  const result = { ...csbFiles }
  chFiles.forEach(file => {
    result["/" + file.name] = {
      code: file.code.lines
        .map(l => l.tokens.map(t => t.content).join(""))
        .join("\n"),
    }
  })
  return result
}
