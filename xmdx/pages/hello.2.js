import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/hello.md"

// TODO show default wrapper
const components = {
  wrapper: props => (
    <div
      style={{ background: "tomato" }}
      {...props}
    />
  ),
}

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}
