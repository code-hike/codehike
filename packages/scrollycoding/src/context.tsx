import * as React from "react"
import {
  Classes,
  classNamesWithPrefix,
} from "@code-hike/utils"

export const classPrefixer = classNamesWithPrefix("ch-hike")

export interface HikeStep {
  focus: string | undefined
  content: React.ReactNode[]
  code: string
  demo: string
}

export const HikeContext = React.createContext<{
  currentFocus: string | undefined
  setFocus: (
    code: string,
    focus: string | undefined
  ) => void
  resetFocus: () => void
  classes: Classes
} | null>(null)

export const StepContext = React.createContext<HikeStep | null>(
  null
)
