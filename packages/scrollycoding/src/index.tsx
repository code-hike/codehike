import * as React from "react"
import "./index.scss"
import {
  HikeContext,
  StepContext,
  classPrefixer as c,
} from "./context"
import { Editor, CodeProps } from "./editor"
import { Focus } from "./focus"
import { Hike, HikeProps } from "./hike"
import { Preview, PreviewProps } from "./preview"

export {
  Hike,
  Focus,
  CodeSlot,
  PreviewSlot,
  HikeProps,
  CodeProps,
  PreviewProps,
}

function CodeSlot(slotProps: CodeProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  const props = { ...step.codeProps, ...slotProps }
  return (
    <div className={c("-step-code", classes)}>
      <Editor
        demo={step.demo}
        minColumns={46}
        {...props}
        classes={classes}
      />
    </div>
  )
}

function PreviewSlot(slotProps: PreviewProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  const props = { ...step.previewProps, ...slotProps }
  return (
    <div className={c("-step-preview", classes)}>
      <Preview
        demo={step.demo}
        classes={classes}
        {...props}
      />
    </div>
  )
}
