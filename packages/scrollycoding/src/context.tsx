import * as React from "react"
import {
  Classes,
  classNamesWithPrefix,
} from "@code-hike/utils"
import { MiniBrowserProps } from "@code-hike/mini-browser"
import { CodeProps } from "./code"
import { SandpackRunnerProps } from "react-smooshpack"

export const classPrefixer = classNamesWithPrefix("ch-hike")

export interface IFile {
  code: string
}
export interface IFiles {
  [path: string]: IFile
}

export interface PreviewProps extends MiniBrowserProps {
  template: SandpackRunnerProps
  files: IFiles
}

export interface HikeStep {
  content: React.ReactNode[]
  previewProps: PreviewProps
  codeProps?: CodeProps
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
  classes: Classes
} | null>(null)

export const StepContext = React.createContext<{
  stepIndex: number
  step: HikeStep
} | null>(null)
