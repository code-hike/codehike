import React from "react"
import { MiniBrowser } from "@code-hike/mini-browser"
import {
  SandpackClient,
  SandpackBundlerFiles,
  SandboxInfo,
} from "@codesandbox/sandpack-client"
import { EditorStep } from "@code-hike/mini-editor"

export type PresetConfig = SandboxInfo

export function Preview({
  className,
  files,
  presetConfig,
}: {
  className: string
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

  return (
    <MiniBrowser className={className}>
      <iframe ref={iframeRef} />
    </MiniBrowser>
  )
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

export async function getPresetConfig(
  attributes?: {
    name: string
    value: "string"
  }[]
) {
  // todo add cache
  const presetAttribute = attributes?.find(
    (attr: any) => attr.name === "preset"
  )
  if (!presetAttribute) return undefined
  const url = presetAttribute.value
  const prefix = "https://codesandbox.io/s/"
  const csbid = url.slice(prefix.length)
  const configUrl = `https://codesandbox.io/api/v1/sandboxes/${csbid}/sandpack`
  const res = await fetch(configUrl)
  return await res.json()
}
