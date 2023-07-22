import React from "react"
import { MiniBrowser } from "../mini-browser"
import {
  SandpackClient,
  SandpackBundlerFiles,
  SandboxInfo,
} from "@codesandbox/sandpack-client"
import { EditorStep } from "../mini-editor"
import { ElementProps, GlobalConfig } from "../core/types"

type PreviewProps = {
  globalConfig: GlobalConfig
  // data
  files: EditorStep["files"]
  presetConfig?: PresetConfig
  children?: React.ReactNode
  // local config
  show?: string
  frameless?: boolean
} & ElementProps

export type PresetConfig = SandboxInfo
export function Preview({
  globalConfig,
  files,
  presetConfig,
  show,
  children,
  frameless,
  className,
  style,
  ...rest
}: PreviewProps) {
  const kids = presetConfig ? (
    <SandpackPreview
      files={files}
      presetConfig={presetConfig}
    />
  ) : (
    children
  )
  return (
    <div
      className={
        "ch-preview" + (className ? " " + className : "")
      }
      style={style}
      data-ch-theme={globalConfig?.themeName}
    >
      {frameless ? (
        kids
      ) : (
        <MiniBrowser
          loadUrl={show}
          {...rest}
          children={kids}
        />
      )}
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
