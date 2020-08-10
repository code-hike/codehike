import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.2.mdx"
import { Terminal } from "../src/mini-terminal"
import { Scrollytelling } from "../src/scrollytelling"

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
  const steps = []
  const stickers = []

  React.Children.forEach(children, child => {
    console.log(child.props)
    const [code, ...step] = React.Children.toArray(
      child.props.children
    )
    steps.push(step)
    stickers.push(code.props.children.props.children)
  })

  return (
    <Scrollytelling
      steps={steps}
      sticker={stepIndex => (
        <Terminal texts={stickers} index={stepIndex} />
      )}
    />
  )
}
