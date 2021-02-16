import * as React from "react"
import { MiniBrowserProps } from "@code-hike/mini-browser"
import { CodeProps } from "./code"
import {
  SandboxEnviornment,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackSetup,
} from "react-smooshpack"

export interface TemplateProps {
  files: IFiles
  activePath?: string
  entry: string
  openPaths?: string[]
  dependencies?: Record<string, string>
  environment?: SandboxEnviornment
  recompileMode?: "immediate" | "delayed"
  recompileDelay?: number
  autorun?: boolean
  bundlerURL?: string
  skipEval?: boolean
}

export interface Preset {
  template?: SandpackPredefinedTemplate
  customSetup?: SandpackSetup
}

export interface IFile {
  code: string
}
export interface IFiles {
  [path: string]: IFile
}
export interface CodeFiles {
  [path: string]: { lang: string; code: string }
}

export interface PreviewProps extends MiniBrowserProps {
  preset?: Partial<Preset>
  files: SandpackFiles
}

export interface HikeStep {
  content: React.ReactNode[]
  previewProps: PreviewProps
  codeProps: CodeProps
}

export interface HikeState {
  scrollStepIndex: number
  focusStepIndex: number | null
  focusCodeProps: Partial<CodeProps>
}

export type HikeAction =
  | { type: "init" }
  | {
      type: "change-step"
      newIndex: number
    }
  | {
      type: "set-focus"
      stepIndex: number
      codeProps: Partial<CodeProps>
    }
  | { type: "reset-focus" }

export const HikeContext = React.createContext<{
  dispatch: React.Dispatch<HikeAction>
  hikeState: HikeState
} | null>(null)

export const StepContext = React.createContext<{
  stepIndex: number
  step: HikeStep
} | null>(null)
