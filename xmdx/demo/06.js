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
  return children
}
