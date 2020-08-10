import React, { Children } from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/steps.3.mdx"
import { TalkLayout } from "../src/talk-layout"

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
  const snippets = stickers.map(
    element => element.props.children.props.children
  )
  const clips = Children.map(children, child => {
    const { video, from, to } = child.props
    return { src: video, start: from, end: to }
  })

  return (
    <TalkLayout
      steps={steps}
      snippets={snippets}
      clips={clips}
    />
  )
}
