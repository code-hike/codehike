import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.mdx"
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
  const steps = React.Children.toArray(children)
  const stickers = steps.map((_, stepIndex) => (
    <>
      <div>Step</div>
      <span>{stepIndex}</span>
    </>
  ))
  return (
    <ScrollytellingLayout
      steps={steps}
      stickers={stickers}
    />
  )
}
