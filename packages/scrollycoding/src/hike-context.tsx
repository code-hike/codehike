import React from "react"
import { EditorProps } from "./editor"
import { PreviewProps } from "./preview"
import { PreviewPreset } from "./demo-provider"
import { EditorStep } from "@code-hike/mini-editor"

export interface HikeState {
  scrollStepIndex: number
  focusEditorStep: EditorStep | null
  focusStepIndex: number | null
}

export type HikeStep = {
  previewProps: PreviewProps
  editorProps: EditorProps
  previewPreset: PreviewPreset
  content: React.ReactNode
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
      editorStep: EditorStep | null
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
