import React, { Children } from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.2.mdx"
import { ScrollytellingLayout } from "../src/scrollytelling"

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
  const steps = Children.toArray(children).map(child => {
    return Children.toArray(child.props.children).slice(1)
  })
  const stickers = Children.map(children, child => {
    return Children.toArray(child.props.children)[0]
  })

  return (
    <ScrollytellingLayout
      steps={steps}
      stickers={stickers}
    />
  )
}
