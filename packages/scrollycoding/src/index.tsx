import * as React from "react"
import { Scroller, Step } from "@code-hike/scroller"
import {
  MiniBrowser,
  MiniBrowserProps,
} from "@code-hike/mini-browser"
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

export { Hike, Focus, CodeSlot, BrowserSlot, HikeProps }

function CodeSlot(props: StatefulEditorProps) {
  const { classes } = React.useContext(HikeContext)!
  const step = React.useContext(StepContext)!
  return (
    <div className={c("-step-code", classes)}>
      <Editor
        code={step.code}
        focus={step.focus}
        codesandboxUrl={step.demo}
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
      <MiniBrowser
        url={step.demo}
        {...props}
        classes={classes}
      />
    </div>
  )
}
