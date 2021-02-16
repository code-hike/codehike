import * as React from "react"
import {
  SandpackFiles,
  SandpackProvider,
} from "react-smooshpack"
import { Preset } from "./context"

type CodeContextProps = {
  preset?: Preset
  files: SandpackFiles
  children: React.ReactNode
}

export function CodeContext({
  preset,
  files,
  children,
}: CodeContextProps) {
  const mergedFiles = {
    ...preset?.customSetup?.files,
    ...files,
  }

  const setup = {
    ...preset?.customSetup,
    files: mergedFiles,
  }

  return (
    <SandpackProvider
      template="react"
      recompileMode="immediate"
      {...preset}
      customSetup={setup}
    >
      {children}
    </SandpackProvider>
  )
}
