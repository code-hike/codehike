import React, { useContext } from "react"
import {
  SandpackFiles,
  SandpackProvider,
} from "react-smooshpack"
import {
  CodeFiles,
  CodeProps,
  PreviewProps,
} from "./hike-context"
import hash from "object-hash"

type DemoProviderProps = {
  codeProps: CodeProps
  previewProps: Partial<PreviewProps>
  children?: React.ReactNode
}

type DemoContext = {
  codeProps: CodeProps
  previewProps: PreviewProps
}

export const DemoContext = React.createContext<DemoContext | null>(
  null
)
export function DemoProvider({
  codeProps,
  previewProps,
  children,
}: DemoProviderProps) {
  const { preset } = previewProps

  // TODO useMemo

  const newFiles = {
    ...preset?.customSetup?.files,
    ...getFiles(codeProps.files!),
  } as SandpackFiles

  const newPreset = {
    ...preset,
    customSetup: {
      ...preset?.customSetup,
      files: newFiles,
    },
  }

  const demo = {
    codeProps,
    previewProps: {
      ...previewProps,
      filesHash: hash(newFiles),
    },
  }

  return (
    <SandpackProvider
      template="react"
      recompileMode="immediate"
      {...newPreset}
    >
      <DemoContext.Provider value={demo}>
        {children}
      </DemoContext.Provider>
    </SandpackProvider>
  )
}

export function useCodeProps() {
  return useContext(DemoContext)!.codeProps
}
export function usePreviewProps() {
  return useContext(DemoContext)!.previewProps
}

export const StepContext = React.createContext<{
  stepIndex: number
} | null>(null)

export function useStepIndex() {
  return useContext(StepContext)!.stepIndex
}

function getFiles(codeFiles: CodeFiles): SandpackFiles {
  const files = {} as SandpackFiles
  const filenames = Object.keys(codeFiles)
  filenames.forEach(filename => {
    files["/" + filename] = {
      code: codeFiles[filename].code,
    }
  })
  return files
}
