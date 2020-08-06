import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/steps.3.mdx"
import {
  Scroller,
  Step as ScrollerStep,
} from "@code-hike/scroller"
import s from "./steps.2.module.css"
import { Terminal } from "../src/mini-terminal"
import { Video } from "@code-hike/player"

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}

const components = {
  wrapper: Wrapper,
}

function Wrapper({ children }) {
  const [stepIndex, setIndex] = React.useState(0)
  const steps = []
  const stickers = []
  const clips = []
  React.Children.forEach(children, child => {
    console.log(child.props)
    const { video, from, to } = child.props
    const [code, ...step] = React.Children.toArray(
      child.props.children
    )
    clips.push({ src: video, start: from, end: to })
    steps.push(step)
    stickers.push(code.props.children.props.children)
  })
  return (
    <div className={s.main}>
      <div className={s.content}>
        <Terminal texts={stickers} index={stepIndex} />
        <Video
          steps={clips}
          style={{
            height: "200px",
          }}
          muted
          onStepChange={setIndex}
        />
        <div className={s.step}>{steps[stepIndex]}</div>
      </div>
    </div>
  )
}
