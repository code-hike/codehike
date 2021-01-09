import * as React from "react"
import { MiniBrowserProps } from "@code-hike/mini-browser"
import "./index.scss"
import {
  HikeContext,
  StepContext,
  classPrefixer as c,
} from "./context"
import { Editor } from "./editor"
import { Focus } from "./focus"
import { Hike, HikeProps } from "./hike"
import { StatefulEditorProps } from "@code-hike/mini-editor"
import { Preview } from "./preview"

export { Hike, Focus, CodeSlot, BrowserSlot, HikeProps }

function CodeSlot(props: StatefulEditorProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  return (
    <div className={c("-step-code", classes)}>
      <Editor
        stepCode={step.stepCode}
        codesandboxUrl={""}
        minColumns={46}
        {...props}
        classes={classes}
      />
    </div>
  )
}

function BrowserSlot(props: MiniBrowserProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  return (
    <div className={c("-step-preview", classes)}>
      <Preview
        stepCode={step.stepCode}
        classes={classes}
        {...props}
      />
    </div>
  )
}
