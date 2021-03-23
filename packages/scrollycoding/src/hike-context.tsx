import { Classes } from "@code-hike/classer"
import { MiniBrowserProps } from "@code-hike/mini-browser"
import { StatefulEditorProps } from "@code-hike/mini-editor"
import {
  SandpackPredefinedTemplate,
  SandpackSetup,
} from "@codesandbox/sandpack-react"
import React from "react"

export interface Preset {
  template?: SandpackPredefinedTemplate
  customSetup?: SandpackSetup
}

export interface PreviewProps extends MiniBrowserProps {
  preset?: Partial<Preset>
  filesHash?: string
}

export interface CodeFiles {
  [path: string]: {
    lang: string
    code: string
    hideTab?: boolean
  }
}

export type CodeProps = {
  files: CodeFiles
  activeFile: string
} & Omit<StatefulEditorProps, "file" | "code" | "lang">

export interface HikeStep {
  content: React.ReactNode[]
  previewProps: PreviewProps
  codeProps: CodeProps
}

export interface HikeProps
  extends React.PropsWithoutRef<
    JSX.IntrinsicElements["section"]
  > {
  steps: HikeStep[]
  classes?: Classes
  noPreview?: boolean
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

type FixedHikeContext = {
  layout: "fixed"
}

export type FluidHikeContext = {
  layout: "fluid"
  dispatch: React.Dispatch<HikeAction>
  hikeState: HikeState
}

const HikeContext = React.createContext<
  FixedHikeContext | FluidHikeContext | null
>(null)

export function HikeProvider({
  value,
  children,
}: {
  value: FixedHikeContext | FluidHikeContext
  children?: React.ReactNode
}) {
  return (
    <HikeContext.Provider value={value}>
      {children}
    </HikeContext.Provider>
  )
}

export function useHikeContext() {
  return React.useContext(HikeContext)!
}

export function useFluidContext() {
  return React.useContext(HikeContext)! as FluidHikeContext
}
