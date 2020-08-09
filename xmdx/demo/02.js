import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/hello.md"

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}

const components = {
  h1: ({ children }) => (
    <h1 style={{ border: "12px solid purple" }}>
      {children}
    </h1>
  ),
}
