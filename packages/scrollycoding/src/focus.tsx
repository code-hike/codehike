import { Classes } from "@code-hike/utils"
import * as React from "react"
import { CodeProps } from "./code"

import {
  HikeContext,
  StepContext,
  classPrefixer as c,
} from "./context"

export interface FocusProps {
  children?: React.ReactNode
  on: string
  file?: string
}

export function Focus({
  children,
  on: focus,
  file,
}: FocusProps) {
  const { dispatch, hikeState, classes } = React.useContext(
    HikeContext
  )!
  const { stepIndex } = React.useContext(StepContext)!
  const currentFocus = hikeState.focusCodeProps.focus
  const isFocused = currentFocus === focus

  const codeProps: Partial<CodeProps> = { focus }
  if (file) {
    codeProps.activeFile = file
  }

  return (
    <button
      className={c(
        [
          "-focus",
          isFocused ? "-focus-active" : "-focus-inactive",
        ],
        classes
      )}
      title="Show code"
      onClick={() =>
        isFocused
          ? dispatch({ type: "reset-focus" })
          : dispatch({
              type: "set-focus",
              stepIndex,
              codeProps,
            })
      }
    >
      {children}
      <Icon classes={classes} isFocused={isFocused} />
    </button>
  )
}

function Icon({
  isFocused,
  classes,
}: {
  isFocused: boolean
  classes: Classes
}) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      className={c("-focus-icon", classes)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={
          isFocused
            ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
        }
      />
    </svg>
  )
}
