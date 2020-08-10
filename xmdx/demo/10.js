import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.2.mdx"
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
    const [sticker, ...step] = React.Children.toArray(
      child.props.children
    )
    steps.push(step)
    stickers.push(sticker)
  })

  return (
    <Scrollytelling steps={steps} stickers={stickers} />
  )
}
