import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/steps.mdx"

const components = {
  wrapper: Wrapper,
}

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}

function Wrapper({ children }) {
  const [stepIndex, setIndex] = React.useState(0)
  const kids = React.Children.toArray(children)
  console.log(kids)
  return (
    <div>
      {kids[stepIndex]}
      <button
        onClick={() => setIndex(stepIndex + 1)}
      >
        Next
      </button>
    </div>
  )
}
