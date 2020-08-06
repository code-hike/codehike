import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/steps.mdx"
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
  const steps = React.Children.toArray(children)
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
        <div>
          <div>Step</div>
          <span>{stepIndex}</span>
        </div>
      </div>
    </div>
  )
}
