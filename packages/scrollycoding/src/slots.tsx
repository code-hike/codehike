import * as React from "react"
import "./index.scss"
import {
  HikeContext,
  StepContext,
  classPrefixer as c,
} from "./context"
import { Code, CodeProps } from "./code"
import { Preview, PreviewProps } from "./preview"

export { CodeSlot, PreviewSlot }

function CodeSlot(slotProps: CodeProps) {
  const { classes } = React.useContext(HikeContext)!
  const { step } = React.useContext(StepContext)!
  const props = {
    minColumns: 46,
    classes,
    ...step.codeProps,
    ...slotProps,
  }
  return (
    <div className={c("-step-code", classes)}>
      <Code {...props} />
    </div>
  )
}

function PreviewSlot(slotProps: PreviewProps) {
  const { classes } = React.useContext(HikeContext)!
  const { step } = React.useContext(StepContext)!
  const props = {
    classes,
    ...step.previewProps,
    ...slotProps,
  }
  return (
    <div className={c("-step-preview", classes)}>
      <Preview {...props} />
    </div>
  )
}
