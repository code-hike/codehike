import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.mdx"

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
    <div>
      {steps[stepIndex]}
      <button onClick={() => setIndex(stepIndex + 1)}>
        Next
      </button>
    </div>
  )
}
