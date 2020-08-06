import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/steps.1.mdx"
import {
  Scroller,
  Step as ScrollerStep,
} from "@code-hike/scroller"
import s from "./steps.2.module.css"

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
  React.Children.forEach(children, child => {
    console.log(child.props)
    const [sticker, ...step] = React.Children.toArray(
      child.props.children
    )
    steps.push(step)
    stickers.push(sticker)
  })
  return (
    <div className={s.main}>
      <div className={s.content}>
        <Scroller onStepChange={setIndex}>
          {steps.map((c, i) => (
            <ScrollerStep
              key={i}
              index={i}
              className={s.step}
              style={{
                opacity: stepIndex === i ? 0.99 : 0.4,
              }}
            >
              {c}
            </ScrollerStep>
          ))}
        </Scroller>
      </div>
      <div className={s.sticker}>
        <div>{stickers[stepIndex]}</div>
      </div>
    </div>
  )
}
